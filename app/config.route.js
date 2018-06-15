(function () {
  "use strict";

  angular
    .module("hughSeed")
    .config(config);

  /**
   * @ngInject
   */
  function config($routeProvider) {
    $routeProvider.otherwise({redirectTo: "/home"});
  }
})();
