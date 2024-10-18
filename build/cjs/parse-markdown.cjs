var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/parse-markdown.js
var parse_markdown_exports = {};
__export(parse_markdown_exports, {
  default: () => parseMarkdown
});
module.exports = __toCommonJS(parse_markdown_exports);
function parseMarkdown(markdown) {
  if (!markdown) {
    throw new Error("data is null, undefined or empty");
  }
  if (typeof markdown !== "string") {
    throw new Error("data is not a string");
  }
  markdown = markdown.trim();
  if (markdown === "") {
    throw new Error("data is an empty string");
  }
  const headings = [...markdown.matchAll(/^#{1,6} (?<title>.+)/gm)].map(({ 0: heading, 1: title, index }) => ({
    heading,
    title,
    index
  }));
  if (headings.length > 0 && headings[0].index > 0) {
    headings.unshift({
      heading: "",
      title: "raw",
      index: 0
    });
  }
  const parsed = {};
  for (let i = 0; i < headings.length; i++) {
    parsed[headings[i].title] = {
      heading: headings[i].heading,
      content: markdown.slice(
        headings[i].index + headings[i].heading.length + 1,
        i < headings.length - 1 ? headings[i + 1].index : void 0
      ).trim()
    };
  }
  return parsed;
}
