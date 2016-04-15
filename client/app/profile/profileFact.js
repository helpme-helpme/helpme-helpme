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

    countComment: function(posts) {
      var count = {};
      posts.forEach(function(post) {
        count[post.post] = post.comments.length;
      });
      return count;
    },

    checkComment: function(posts) {

    }
  };
}
