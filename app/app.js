(function () {
  "use strict";
  
  require("./stylesheets/override.scss");

  require("angular");
  require("angular-route");
  require("angular-animate");
  require("angular-touch");
  require("angular-messages");
  require("angular-ui-bootstrap");
  require("angular-confirm");

  require("./module");
  require("./config.route");
  
  require("./core");
  require("./home");
})();
