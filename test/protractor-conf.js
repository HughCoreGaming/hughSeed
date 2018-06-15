exports.config = {

  framework: "custom",
  frameworkPath: require.resolve("protractor-cucumber-framework"),

  specs: [
    "e2e/*.feature"
  ],

  baseUrl: "http://localhost:8080/",

  seleniumArgs: ["-browserTimeout=120"],

  capabilities: {
    "browserName": "chrome",
    "chromeOptions": {
      "args": ["--no-sandbox"]
    }
  },

  cucumberOpts: {
    require: [
      "e2e/support/*.js",
      "e2e/steps/**/*.js"
    ],

    format: [
      "pretty",
      "json:test/e2e/output/test-results.json"
    ],

    tags: "~@ignore"
  }
};
