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
        console.log(data, "data from backend");
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
        for(var i = 0; i < $scope.posts.length; i++) {
          var post = $scope.posts[i];
          var last = data.comments.length-1;

          if (post._id === data._id) {
            var newComment = data.comments[last];
            post.comments.push(newComment);
            return;
          }
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.poller = function() {
    // recreate an array similar to $scope.posts
    var postArray = [];
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
            postArray.push(post);
          });
        });
        // count the comment in each post
        var newCount = Profile.countComment(posts);
        return postArray;
      })
      .then(function(posts) {
        for(var post in currentCount) {
          // check difference in comment count in each post
          if(currentCount[post] !== newCount[post]) {
            for(var i = 0; i < $scope.posts.length; i++) {
              var obj = $scope.posts[i];
              // find the relevant post in the $scope.posts
              if(obj.post === post) {
                // push the new comment in the post
                var lastIndex = posts[i].comments.length-1;
                var newComment = posts[i].comments[lastIndex];
                obj.comments.push(newComment);
                // make commentCount same to count
                commentCount = count;
              }
            }
          }
        }
      })
      .catch(function(error) {
        console.error(error);
      });
      $timeout($scope.poller, 5000);
  };
  // Once auth0 profile info has been set, query our database for friends' posts, inactive friends and personal goals.
  auth.profilePromise.then(function(profile) {
    $scope.getFriendsPosts();
    $scope.getInactiveFriends();
    $scope.getGoals();
    $scope.poller();
  });
}