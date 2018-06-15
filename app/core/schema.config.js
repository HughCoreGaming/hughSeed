/* global PRODUCTION:false FIREBASE:false FIREBASEAPIKEY:false */
(function () {
  "use strict";
  angular
    .module("hughSeed.core")
    .run(function ($window, $location) {
      var dbUrl = "https://" + FIREBASE + ".firebaseio.com";

      if (PRODUCTION) {
        var host = $location.host();
        dbUrl = "https://" + host.replace("firebaseapp.com", "firebaseio.com");
      }

      var config =  {
        apiKey: FIREBASEAPIKEY,
        authDomain: FIREBASE + ".firebaseapp.com",
        databaseURL: dbUrl
      };

      // Initialize Firebase connection
      $window.firebase.initializeApp(config);
    });
})();
