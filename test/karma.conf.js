// Karma configuration
// Generated on Thu Feb 11 2016 14:30:58 GMT+0000 (GMT)

var webpack = require("webpack");
var path = require("path");

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "..",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],


    // list of files / patterns to load in the browser
    files: [
      "test/unit/test_index.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "test/unit/test_index.js": ["webpack", "sourcemap"]
    },


    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "junit", "coverage"],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome", "Chrome_without_sandbox", "Firefox"],

    customLaunchers: {
      // Since CI runs the build in a docker container,
      // we need to disable the chrome sandbox, as that is another container environment
      // and it conflicts with docker gubbins.
      Chrome_without_sandbox: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    junitReporter: {
      outputDir: "test/unit/output",
      suite: "unit"
    },

    coverageReporter: {
      dir: "test/unit/output/coverage",
      reporters: [
        {
          type: "cobertura",
          subdir: ".",
          file: "cobertura.xml"
        }
      ]
    },

    webpack: {
      plugins: [
        new webpack.ProvidePlugin({jQuery: "jquery/dist/jquery.js"}),

        new webpack.DefinePlugin({
          FIREBASEAPIKEY: "\"MOCK_API_KEY\"",
          FIREBASE: "\"UNITTEST\"",
          PRODUCTION: "false"
        })
      ],
      module: {
        loaders: [
          {
            test: /\.(html|scss|css)$/,
            loader: "file"
          },
          {
            test: /\.min\.js$/,
            include: /(node_modules|bower_components)/,
            loader: "script"
          }
        ],
        postLoaders: [{
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: "istanbul-instrumenter"
        }]
      },
      node: {
        fs: "empty"
      },
      externals: [
        {
          "./cptable": "var cptable"
        }
      ],
      devtool: "inline-source-map"
    },

    webpackMiddleware: {
      noInfo: true
    }
  });
};
