const { webpackPreprocessorFn } = require("./webpack-preprocessor");

module.exports = (on, config) => {
  on("file:preprocessor", webpackPreprocessorFn);
};
