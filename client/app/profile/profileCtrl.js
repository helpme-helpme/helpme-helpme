angular
  .module('app.profile', ['angularMoment'])
  .controller('ProfileController', ProfileController);

ProfileController.$inject = ['$scope', '$timeout', 'auth', 'Profile'];

function ProfileController($scope, $timeout, auth, Profile) {
  // User profile information from Auth0 db
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};
  // Form input fields
  $scope.input = {};

  var user_id = $scope.profile.user_id;
  var currentCount;

  $scope.getProfile = function() {
    Profile.getProfile(user_id)
      .then(function(data) {
        $scope.user.info = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getPosts = function() {
    Profile.getPosts(user_id)
      .then(function(data) {
        $scope.user.goals = data.goals;
        $scope.user.posts = data.posts;
        $scope.input.selected = $scope.user.goals[0];
        currentCount = Profile.countComment(data.posts);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addPost = function() {
    var post = {
      post: $scope.input.post,
      goal_id: $scope.input.selected._id,
    };
    Profile.addPost(user_id, post)
      .then(function(data) {
        $scope.input.post = '';
        $scope.getPosts();
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input) {
    Profile.addComment(user_id, goal_id, post_id, input)
      .then(function(data) {
        Profile.pushComment(data, $scope.user.posts, currentCount);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.poller = function() {
    var newPosts = [];
    Profile.getPosts(user_id)
      .then(function(data) {
        newPosts = data.posts;
        var newCount = Profile.countComment(newPosts);
        return newCount;
      })
      .then(function(newCount) {
        Profile.checkComment(currentCount, newCount, $scope.user.posts, newPosts);
      })
      .catch(function(error) {
        console.error(error);
      });
    $timeout($scope.poller, 2000);
  };

  // Once auth0 profile info has been set, query our database for user's profile and posts
  auth.profilePromise.then(function(profile) {
    $scope.getProfile();
    $scope.getPosts();
    $scope.poller();
  });
}
