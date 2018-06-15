(function () {
  "use strict";

  angular
    .module("hughSeed.core")
    .factory("firebaseUtil", firebaseUtil);

  function firebaseUtil($q) {
    return {
      loaded: loaded,
      serverTime: serverTime
    };

    ////////////

    function loaded() {
      var loadables = [].slice.call(arguments);
      return $q.all(loadables.map(loadedAsPromise));

      function loadedAsPromise(firebaseObjectOrArray) {
        return firebaseObjectOrArray.$loaded()
          .then($q.resolve)
          .catch($q.reject);
      }
    }

    function serverTime() {
      return firebase.database.ServerValue.TIMESTAMP;
    }

  }

})();
