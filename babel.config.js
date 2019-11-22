module.exports = api => {
  api.cache(true);

  plugins = [];

  const isUnitTest = process.env.IS_UNIT_TEST === "true";

  if (isUnitTest) {
    return {
      plugins,
      presets: ["react-app"],
    };
  }

  return {
    plugins,
    presets: ["babel-preset-gatsby"],
  };
};
