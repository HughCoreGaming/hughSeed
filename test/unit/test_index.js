"use strict";

// Third party dependencies
require("angular");
require("angular-route/angular-route");

// testing dependencies
require("angular-mocks/angular-mocks");

// Application entry point
require("../../app/app");

// require all modules ending in ".spec" from the
// current directory and all subdirectories
var testsContext = require.context(".", true, /\.spec$/);
testsContext.keys().forEach(testsContext);
