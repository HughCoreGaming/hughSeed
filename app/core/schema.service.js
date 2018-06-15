(function () {
  "use strict";

  angular
    .module("hughSeed.core")
    .factory("schema", schema);


  /**
   * @ngInject
   */
  function schema($q, $firebaseAuth, $firebaseObject, $firebaseArray) {
    var REQUIRED_SESSION_TTL = 10 * 60 * 60; // 10 hours

    var auth;
    var status = {};

    var service = {
      status: status,
      login: login,
      logout: logout,
      waitForAuth: waitForAuth,
      requireAuth: requireAuth,
      getRoot: getRoot,
      getObject: getObject,
      getArray: getArray
    };

    init();

    return service;

    ////////////

    function init() {

      auth = $firebaseAuth();
      auth.$onAuthStateChanged(onAuth);

      var connectedObj = $firebaseObject(getRoot().child(".info/connected"));
      connectedObj.$watch(function () {
        status.connected = connectedObj.$value;
      });

      function onAuth(authData) {
        if (authData) {
          status.userId = authData.uid;
          status.userName = "...";
          lookupUser(authData.uid)
            .then(function (user) {
              status.userName = user.name;
              user.$destroy();
            });
        }
        else {
          status.userId = null;
          status.userName = null;
        }
      }
    }

    function login(email, password) {
      return auth.$signInWithEmailAndPassword(email,password);
    }

    function logout() {
      return auth.$signOut();
    }

    function waitForAuth() {
      return auth.$waitForSignIn()
        .then(function (authData) {
          if (authData == null) {
            return null;
          }

          return addRoles(authData);
        });

      function needTokenRefresh(authData) {
        var sessionTTL = sessionLength(authData.auth.token);
        var remainingTTL = authData.expires - Date.now() / 1000;

        // Expired token has been returned
        if (remainingTTL < 0) {
          return true;
        }

        // Configured session length is too short to trigger token refresh
        if (sessionTTL < 2 * REQUIRED_SESSION_TTL) {
          return false;
        }

        // Trigger token refresh
        if (remainingTTL < REQUIRED_SESSION_TTL) {
          return true;
        }

        return false;
      }

      function sessionLength(authToken) {
        if (!authToken) {
          return -1;
        }

        return authToken.exp - authToken.auth_time;
      }

      function addRoles(authData) {
        return lookupUser(authData.uid)
          .then(function (user) {
            authData.roles = user.roles;
            return authData;
          })
          .catch(function (e) {
            logout();
            return null;
          });
      }
    }

    function requireAuth(role) {
      return waitForAuth()
        .then(function (authData) {
          if (authData == null) {
            return $q.reject("AUTH_REQUIRED");
          }
          else if (!authData.roles[role])
          {
            return $q.reject("AUTH_REQUIRED");
          }
          return $q.when(authData);
        });
    }

    function getRoot() {
      return firebase.database().ref();
    }

    function getObject(ref) {
      if (!ref) {
        ref = getRoot();
      }

      return $firebaseObject(ref);
    }

    function getArray(ref) {
      if (!ref) {
        ref = getRoot();
      }

      return $firebaseArray(ref);
    }

    function lookupUser(userId) {
      return $firebaseObject(getRoot().child("users").child(userId))
        .$loaded();
    }

  }

})();
