const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// app.use(express.static(path.join(__dirname, "build")));

// Step 1: Create & configure a webpack compiler
var webpack = require("webpack");
var webpackConfig = require(process.env.WEBPACK_CONFIG
  ? process.env.WEBPACK_CONFIG
  : "./webpack.config");
var compiler = webpack(webpackConfig);

// Step 2: Attach the dev middleware to the compiler & the server
app.use(
  require("webpack-dev-middleware")(compiler, {
    logLevel: "warn",
    publicPath: webpackConfig.output.publicPath
  })
);

// Step 3: Attach the hot middleware to the compiler & the server
app.use(
  require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000
  })
);

app.get("/ping", function(req, res) {
  return res.send("pong");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
