const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

if (process.env.NODE_ENV === "development") {
  const webpack = require("webpack");
  const webpackConfig = require("./config/webpack.config.dev.js");
  const compiler = webpack(webpackConfig);

  app.use(
    require("webpack-dev-middleware")(compiler, {
      logLevel: "warn",
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(
    require("webpack-hot-middleware")(compiler, {
      log: console.log,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000
    })
  );
}

app.get("/ping", function(req, res) {
  return res.send("pong");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(process.env.PORT || 8080);
