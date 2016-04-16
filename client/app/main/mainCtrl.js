angular
  .module('app.main', [])
  .controller('MainController', MainController);

MainController.$inject = ['$scope', '$timeout', 'auth', 'Goals', 'Friend', 'Profile'];

function MainController($scope, $timeout, auth, Goals, Friend, Profile) {
  $scope.profile = auth.profile;
  // User information from our MongoDB
  $scope.user = {};

  var user_id = $scope.profile.user_id;
  var currentCount;

  $scope.getGoals = function() {
    Goals.getGoals(user_id)
      .then(function(goals) {
        $scope.user.goals = goals;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getInactiveFriends = function() {
    Friend.getInactiveFriends(user_id)
      .then(function(data) {
        $scope.friends = data;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.getFriendsPosts = function() {
    $scope.posts = [];
    Friend.getFriendsPosts(user_id)
      .then(function(data) {
        data.forEach(function(obj) {
          var friend = {};
          friend.firstname = obj[0].firstname || '';
          friend.lastname = obj[0].lastname || '';
          friend.username = obj[0].username || '';
          friend.auth_id = obj[0].auth_id;
          obj[1].forEach(function(post) {
            post.friend = friend;
            $scope.posts.push(post);
          });
        });
        currentCount = Profile.countComment($scope.posts)
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.addComment = function(post_id, goal_id, input, friend_id) {
    Profile.addComment(user_id, goal_id, post_id, input, friend_id)
      .then(function(data) {
        Profile.pushComment(data, $scope.posts, currentCount);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.poller = function() {
    // recreate an array similar to $scope.posts
    var newPosts = [];
    Friend.getFriendsPosts(user_id)
      .then(function(data) {
        data.forEach(function(friend) {
          friend[1].forEach(function(post) {
            newPosts.push(post);
          });
        });
        // count the comment in each post
        var newCount = Profile.countComment(newPosts);
        return newCount;
      })
      .then(function(newCount) {
        Profile.checkComment(currentCount, newCount, $scope.posts, newPosts);
      })
      .catch(function(error) {
        console.error(error);
      });
    $timeout($scope.poller, 2000);
  };
  // Once auth0 profile info has been set, query our database for friends' posts, inactive friends and personal goals.
  auth.profilePromise.then(function(profile) {
    $scope.getFriendsPosts();
    $scope.getInactiveFriends();
    $scope.getGoals();
    $scope.poller();
  });
}
