var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controller/help.js
var help_exports = {};
__export(help_exports, {
  default: () => help_default
});
module.exports = __toCommonJS(help_exports);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);

// src/utility.js
var utility_default = /* @__PURE__ */ (() => {
  const tags = {
    b: "bold",
    d: "dim"
  };
  return {
    /**
     * Show an error message in the console
     * @param {Error|string} error
     * @param {boolean} dontExit
     */
    error(error, dontExit = false) {
      const message = error instanceof Error ? process.env.DEBUG === "true" ? error : this.replaceTags(error.message) : this.replaceTags(error);
      console.error(message);
      !dontExit && process.env.KANBN_ENV !== "test" && process.exit(1);
    },
    /**
     * Convert a string to simplified paramcase, e.g:
     *  PascalCase -> pascalcase
     *  Test Word -> test-word
     * @param {string} s The string to convert
     * @return {string} The converted string
     */
    paramCase(s) {
      return s.replace(
        /([A-Z]+(.))/g,
        (_, separator, letter, offset) => (offset ? "-" + separator : separator).toLowerCase()
      ).split(/[\s!?.,@:;|\\/"'`£$%\^&*{}[\]()<>~#+\-=_¬]+/g).join("-").replace(/(^-|-$)/g, "");
    },
    /**
     * Get a task id from the task name
     * @param {string} name The task name
     * @return {string} The task id
     */
    getTaskId(name) {
      return this.paramCase(name);
    },
    /**
     * Convert an argument into a string. If the argument is an array of strings, concatenate them or use the
     * last element
     * @param {string|string[]} arg An argument that might be a string or an array of strings
     * @return {string} The argument value as a string
     */
    strArg(arg, all = false) {
      if (Array.isArray(arg)) {
        return all ? arg.join(",") : arg.pop();
      }
      return arg;
    },
    /**
     * Convert an argument into an array. If the argument is a string, return it as a single-element array
     * @param {string|string[]} arg An argument that might be a string or an array of strings
     * @return {string[]} The argument value as an array
     */
    arrayArg(arg) {
      if (Array.isArray(arg)) {
        return arg;
      }
      return [arg];
    },
    /**
     * Remove escape characters ('/' and '\') from the beginning of a string
     * @param {string} s The string to trim
     */
    trimLeftEscapeCharacters(s) {
      return s.replace(/^[\\\/]+/, "");
    },
    /**
     * Compare two dates using only the date part and ignoring time
     * @param {Date} a
     * @param {Date} b
     * @return {boolean} True if the dates are the same
     */
    compareDates(a, b) {
      const aDate = new Date(a), bDate = new Date(b);
      aDate.setHours(0, 0, 0, 0);
      bDate.setHours(0, 0, 0, 0);
      return aDate.getTime() == bDate.getTime();
    },
    /**
     * If a is undefined, convert it to a number or string depending on the specified type
     * @param {*} a
     * @param {string} type
     * @return {string|number}
     */
    coerceUndefined(a, type) {
      if (a === void 0) {
        switch (type) {
          case "string":
            return "";
          default:
            return 0;
        }
      }
      return a;
    },
    /**
     * Make a string bold
     * @param {string} s The string to wrap
     * @return {string} The updated string
     */
    bold(s) {
      return `\x1B[1m${s}\x1B[0m`;
    },
    /**
     * Make a string dim
     * @param {string} s The string to wrap
     * @return {string} The updated string
     */
    dim(s) {
      return `\x1B[2m${s}\x1B[0m`;
    },
    /**
     * Replace tags like {x}...{x} in a string
     * @param {string} s The string in which to replace tags
     * @return {string} The updated string
     */
    replaceTags(s) {
      for (tag in tags) {
        const r = new RegExp(`{${tag}}([^{]+){${tag}}`, "g");
        s = s.replace(r, (m, s2) => this[tags[tag]](s2));
      }
      return s;
    },
    /**
     * Zip 2 arrays together, i.e. ([1, 2, 3], [a, b, c]) => [[1, a], [2, b], [3, c]]
     * @param {any[]} a
     * @param {any[]} b
     * @return {any[]}
     */
    zip: (a, b) => a.map((k, i) => [k, b[i]])
  };
})();

// src/controller/help.js
var dirname = typeof __dirname ? __dirname : import_meta.dirname;
var help_default = async (args, argv, routeId) => {
  const helpRoute = await import(import_path.default.join(dirname, "../../routes", `${routeId}.json`));
  import_fs.default.promises.readFile(import_path.default.join(dirname, "../../", helpRoute.help), { encoding: "utf-8" }).then((help) => {
    console.log(utility_default.replaceTags(help).trim());
  });
};
