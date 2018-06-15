(function () {
  "use strict";

  angular
    .module("hughSeed.home")
    .config(initRoutes);

  /**
   * @ngInject
   */
  function initRoutes($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: require("./home.html"),
        controller: "HomeController",
        controllerAs: "vm"
      });
  }


})();
