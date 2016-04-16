angular
  .module('app.profile')
  .factory('Profile', Profile);

Profile.$inject = ['$http'];

function Profile($http) {
  return {
    getProfile: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    getPosts: function(user_id) {
      return $http({
          method: 'GET',
          url: '/api/profile/posts/' + user_id
        })
        .then(function(res) {
          return res.data;
        });
    },

    addPost: function(user_id, post) {
      return $http({
          method: 'POST',
          url: '/api/profile/posts/' + user_id,
          data: post
        })
        .then(function(res) {
          return res.data;
        });
    },

    addComment: function(user_id, goal_id, post_id, input, friend_id) {
      var comment = {
        friend_id: friend_id || user_id,
        goal_id: goal_id,
        post_id: post_id,
        comment: input
      };
      return $http({
          method: 'POST',
          url: '/api/comment/' + user_id,
          data: comment
        })
        .then(function(res) {
          return res.data;
        });
    },

    pushComment: function(data, currentPosts, count) {
      for (var i = 0; i < currentPosts.length; i++) {
        var post = currentPosts[i];
        var last = data.comments.length - 1;
        // the post that need to updated
        if (post._id === data._id) {
          var newComment = data.comments[last];
          //push the new comment
          post.comments.push(newComment);
          // update current count
          ++count[post.post];
          return;
        }
      }
    },

    countComment: function(posts) {
      var count = {};
      posts.forEach(function(post) {
        count[post.post] = post.comments.length;
      });
      return count;
    },

    checkComment: function(currentCount, newCount, currentPosts, newPosts) {
      for (var post in currentCount) {
        // check for any difference in current and new count
        if (currentCount[post] !== newCount[post]) {
          for (var i = 0; i < currentPosts.length; i++) {
            var obj = currentPosts[i];
            // find the post that needs to be updated
            if (obj.post === post) {
              // push the new comment in the post
              var lastIndex = newPosts[i].comments.length - 1;
              var newComment = newPosts[i].comments[lastIndex];

              obj.comments.push(newComment);
              // make commentCount same to count
              currentCount[post] = newCount[post];
            }
          }
        }
      }
    }
  };
}
