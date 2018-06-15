(function () {
  "use strict";

  angular
    .module("hughSeed.home")
    .controller("HomeController", HomeController);

  /**
   * @ngInject
   */
  function HomeController(firebaseUtil) {
    var vm = this;
    
    vm.myProject = firebaseUtil.serverTime();

    ////////////

    function myProject() {

    }
  }
})();
