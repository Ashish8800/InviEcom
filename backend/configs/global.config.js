function print() {
  if (process.env.APP_ENIVERMENT != "production") console.log(...arguments);
}

module.exports = function globalConfig() {
  global.yup = require("yup");
  global.print = print;
};
