var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/yamljs/lib/Pattern.js
var require_Pattern = __commonJS({
  "node_modules/yamljs/lib/Pattern.js"(exports2, module2) {
    var Pattern;
    Pattern = function() {
      Pattern2.prototype.regex = null;
      Pattern2.prototype.rawRegex = null;
      Pattern2.prototype.cleanedRegex = null;
      Pattern2.prototype.mapping = null;
      function Pattern2(rawRegex, modifiers) {
        var _char, capturingBracketNumber, cleanedRegex, i, len, mapping, name, part, subChar;
        if (modifiers == null) {
          modifiers = "";
        }
        cleanedRegex = "";
        len = rawRegex.length;
        mapping = null;
        capturingBracketNumber = 0;
        i = 0;
        while (i < len) {
          _char = rawRegex.charAt(i);
          if (_char === "\\") {
            cleanedRegex += rawRegex.slice(i, +(i + 1) + 1 || 9e9);
            i++;
          } else if (_char === "(") {
            if (i < len - 2) {
              part = rawRegex.slice(i, +(i + 2) + 1 || 9e9);
              if (part === "(?:") {
                i += 2;
                cleanedRegex += part;
              } else if (part === "(?<") {
                capturingBracketNumber++;
                i += 2;
                name = "";
                while (i + 1 < len) {
                  subChar = rawRegex.charAt(i + 1);
                  if (subChar === ">") {
                    cleanedRegex += "(";
                    i++;
                    if (name.length > 0) {
                      if (mapping == null) {
                        mapping = {};
                      }
                      mapping[name] = capturingBracketNumber;
                    }
                    break;
                  } else {
                    name += subChar;
                  }
                  i++;
                }
              } else {
                cleanedRegex += _char;
                capturingBracketNumber++;
              }
            } else {
              cleanedRegex += _char;
            }
          } else {
            cleanedRegex += _char;
          }
          i++;
        }
        this.rawRegex = rawRegex;
        this.cleanedRegex = cleanedRegex;
        this.regex = new RegExp(this.cleanedRegex, "g" + modifiers.replace("g", ""));
        this.mapping = mapping;
      }
      Pattern2.prototype.exec = function(str) {
        var index, matches, name, ref;
        this.regex.lastIndex = 0;
        matches = this.regex.exec(str);
        if (matches == null) {
          return null;
        }
        if (this.mapping != null) {
          ref = this.mapping;
          for (name in ref) {
            index = ref[name];
            matches[name] = matches[index];
          }
        }
        return matches;
      };
      Pattern2.prototype.test = function(str) {
        this.regex.lastIndex = 0;
        return this.regex.test(str);
      };
      Pattern2.prototype.replace = function(str, replacement) {
        this.regex.lastIndex = 0;
        return str.replace(this.regex, replacement);
      };
      Pattern2.prototype.replaceAll = function(str, replacement, limit) {
        var count;
        if (limit == null) {
          limit = 0;
        }
        this.regex.lastIndex = 0;
        count = 0;
        while (this.regex.test(str) && (limit === 0 || count < limit)) {
          this.regex.lastIndex = 0;
          str = str.replace(this.regex, replacement);
          count++;
        }
        return [str, count];
      };
      return Pattern2;
    }();
    module2.exports = Pattern;
  }
});

// node_modules/yamljs/lib/Utils.js
var require_Utils = __commonJS({
  "node_modules/yamljs/lib/Utils.js"(exports2, module2) {
    var Pattern;
    var Utils;
    var hasProp = {}.hasOwnProperty;
    Pattern = require_Pattern();
    Utils = function() {
      function Utils2() {
      }
      Utils2.REGEX_LEFT_TRIM_BY_CHAR = {};
      Utils2.REGEX_RIGHT_TRIM_BY_CHAR = {};
      Utils2.REGEX_SPACES = /\s+/g;
      Utils2.REGEX_DIGITS = /^\d+$/;
      Utils2.REGEX_OCTAL = /[^0-7]/gi;
      Utils2.REGEX_HEXADECIMAL = /[^a-f0-9]/gi;
      Utils2.PATTERN_DATE = new Pattern("^(?<year>[0-9][0-9][0-9][0-9])-(?<month>[0-9][0-9]?)-(?<day>[0-9][0-9]?)(?:(?:[Tt]|[ 	]+)(?<hour>[0-9][0-9]?):(?<minute>[0-9][0-9]):(?<second>[0-9][0-9])(?:.(?<fraction>[0-9]*))?(?:[ 	]*(?<tz>Z|(?<tz_sign>[-+])(?<tz_hour>[0-9][0-9]?)(?::(?<tz_minute>[0-9][0-9]))?))?)?$", "i");
      Utils2.LOCAL_TIMEZONE_OFFSET = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 60 * 1e3;
      Utils2.trim = function(str, _char) {
        var regexLeft, regexRight;
        if (_char == null) {
          _char = "\\s";
        }
        regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
        if (regexLeft == null) {
          this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp("^" + _char + _char + "*");
        }
        regexLeft.lastIndex = 0;
        regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
        if (regexRight == null) {
          this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + "" + _char + "*$");
        }
        regexRight.lastIndex = 0;
        return str.replace(regexLeft, "").replace(regexRight, "");
      };
      Utils2.ltrim = function(str, _char) {
        var regexLeft;
        if (_char == null) {
          _char = "\\s";
        }
        regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
        if (regexLeft == null) {
          this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp("^" + _char + _char + "*");
        }
        regexLeft.lastIndex = 0;
        return str.replace(regexLeft, "");
      };
      Utils2.rtrim = function(str, _char) {
        var regexRight;
        if (_char == null) {
          _char = "\\s";
        }
        regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
        if (regexRight == null) {
          this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + "" + _char + "*$");
        }
        regexRight.lastIndex = 0;
        return str.replace(regexRight, "");
      };
      Utils2.isEmpty = function(value) {
        return !value || value === "" || value === "0" || value instanceof Array && value.length === 0 || this.isEmptyObject(value);
      };
      Utils2.isEmptyObject = function(value) {
        var k;
        return value instanceof Object && function() {
          var results;
          results = [];
          for (k in value) {
            if (!hasProp.call(value, k)) continue;
            results.push(k);
          }
          return results;
        }().length === 0;
      };
      Utils2.subStrCount = function(string, subString, start, length) {
        var c, i, j, len, ref, sublen;
        c = 0;
        string = "" + string;
        subString = "" + subString;
        if (start != null) {
          string = string.slice(start);
        }
        if (length != null) {
          string = string.slice(0, length);
        }
        len = string.length;
        sublen = subString.length;
        for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          if (subString === string.slice(i, sublen)) {
            c++;
            i += sublen - 1;
          }
        }
        return c;
      };
      Utils2.isDigits = function(input) {
        this.REGEX_DIGITS.lastIndex = 0;
        return this.REGEX_DIGITS.test(input);
      };
      Utils2.octDec = function(input) {
        this.REGEX_OCTAL.lastIndex = 0;
        return parseInt((input + "").replace(this.REGEX_OCTAL, ""), 8);
      };
      Utils2.hexDec = function(input) {
        this.REGEX_HEXADECIMAL.lastIndex = 0;
        input = this.trim(input);
        if ((input + "").slice(0, 2) === "0x") {
          input = (input + "").slice(2);
        }
        return parseInt((input + "").replace(this.REGEX_HEXADECIMAL, ""), 16);
      };
      Utils2.utf8chr = function(c) {
        var ch;
        ch = String.fromCharCode;
        if (128 > (c %= 2097152)) {
          return ch(c);
        }
        if (2048 > c) {
          return ch(192 | c >> 6) + ch(128 | c & 63);
        }
        if (65536 > c) {
          return ch(224 | c >> 12) + ch(128 | c >> 6 & 63) + ch(128 | c & 63);
        }
        return ch(240 | c >> 18) + ch(128 | c >> 12 & 63) + ch(128 | c >> 6 & 63) + ch(128 | c & 63);
      };
      Utils2.parseBoolean = function(input, strict) {
        var lowerInput;
        if (strict == null) {
          strict = true;
        }
        if (typeof input === "string") {
          lowerInput = input.toLowerCase();
          if (!strict) {
            if (lowerInput === "no") {
              return false;
            }
          }
          if (lowerInput === "0") {
            return false;
          }
          if (lowerInput === "false") {
            return false;
          }
          if (lowerInput === "") {
            return false;
          }
          return true;
        }
        return !!input;
      };
      Utils2.isNumeric = function(input) {
        this.REGEX_SPACES.lastIndex = 0;
        return typeof input === "number" || typeof input === "string" && !isNaN(input) && input.replace(this.REGEX_SPACES, "") !== "";
      };
      Utils2.stringToDate = function(str) {
        var date, day, fraction, hour, info, minute, month, second, tz_hour, tz_minute, tz_offset, year;
        if (!(str != null ? str.length : void 0)) {
          return null;
        }
        info = this.PATTERN_DATE.exec(str);
        if (!info) {
          return null;
        }
        year = parseInt(info.year, 10);
        month = parseInt(info.month, 10) - 1;
        day = parseInt(info.day, 10);
        if (info.hour == null) {
          date = new Date(Date.UTC(year, month, day));
          return date;
        }
        hour = parseInt(info.hour, 10);
        minute = parseInt(info.minute, 10);
        second = parseInt(info.second, 10);
        if (info.fraction != null) {
          fraction = info.fraction.slice(0, 3);
          while (fraction.length < 3) {
            fraction += "0";
          }
          fraction = parseInt(fraction, 10);
        } else {
          fraction = 0;
        }
        if (info.tz != null) {
          tz_hour = parseInt(info.tz_hour, 10);
          if (info.tz_minute != null) {
            tz_minute = parseInt(info.tz_minute, 10);
          } else {
            tz_minute = 0;
          }
          tz_offset = (tz_hour * 60 + tz_minute) * 6e4;
          if ("-" === info.tz_sign) {
            tz_offset *= -1;
          }
        }
        date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
        if (tz_offset) {
          date.setTime(date.getTime() - tz_offset);
        }
        return date;
      };
      Utils2.strRepeat = function(str, number) {
        var i, res;
        res = "";
        i = 0;
        while (i < number) {
          res += str;
          i++;
        }
        return res;
      };
      Utils2.getStringFromFile = function(path, callback) {
        var data, fs, j, len1, name, ref, req, xhr;
        if (callback == null) {
          callback = null;
        }
        xhr = null;
        if (typeof window !== "undefined" && window !== null) {
          if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
          } else if (window.ActiveXObject) {
            ref = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (j = 0, len1 = ref.length; j < len1; j++) {
              name = ref[j];
              try {
                xhr = new ActiveXObject(name);
              } catch (error) {
              }
            }
          }
        }
        if (xhr != null) {
          if (callback != null) {
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                  return callback(xhr.responseText);
                } else {
                  return callback(null);
                }
              }
            };
            xhr.open("GET", path, true);
            return xhr.send(null);
          } else {
            xhr.open("GET", path, false);
            xhr.send(null);
            if (xhr.status === 200 || xhr.status === 0) {
              return xhr.responseText;
            }
            return null;
          }
        } else {
          req = require;
          fs = req("fs");
          if (callback != null) {
            return fs.readFile(path, function(err, data2) {
              if (err) {
                return callback(null);
              } else {
                return callback(String(data2));
              }
            });
          } else {
            data = fs.readFileSync(path);
            if (data != null) {
              return String(data);
            }
            return null;
          }
        }
      };
      return Utils2;
    }();
    module2.exports = Utils;
  }
});

// node_modules/yamljs/lib/Unescaper.js
var require_Unescaper = __commonJS({
  "node_modules/yamljs/lib/Unescaper.js"(exports2, module2) {
    var Pattern;
    var Unescaper;
    var Utils;
    Utils = require_Utils();
    Pattern = require_Pattern();
    Unescaper = function() {
      function Unescaper2() {
      }
      Unescaper2.PATTERN_ESCAPED_CHARACTER = new Pattern('\\\\([0abt	nvfre "\\/\\\\N_LP]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})');
      Unescaper2.unescapeSingleQuotedString = function(value) {
        return value.replace(/\'\'/g, "'");
      };
      Unescaper2.unescapeDoubleQuotedString = function(value) {
        if (this._unescapeCallback == null) {
          this._unescapeCallback = /* @__PURE__ */ function(_this) {
            return function(str) {
              return _this.unescapeCharacter(str);
            };
          }(this);
        }
        return this.PATTERN_ESCAPED_CHARACTER.replace(value, this._unescapeCallback);
      };
      Unescaper2.unescapeCharacter = function(value) {
        var ch;
        ch = String.fromCharCode;
        switch (value.charAt(1)) {
          case "0":
            return ch(0);
          case "a":
            return ch(7);
          case "b":
            return ch(8);
          case "t":
            return "	";
          case "	":
            return "	";
          case "n":
            return "\n";
          case "v":
            return ch(11);
          case "f":
            return ch(12);
          case "r":
            return ch(13);
          case "e":
            return ch(27);
          case " ":
            return " ";
          case '"':
            return '"';
          case "/":
            return "/";
          case "\\":
            return "\\";
          case "N":
            return ch(133);
          case "_":
            return ch(160);
          case "L":
            return ch(8232);
          case "P":
            return ch(8233);
          case "x":
            return Utils.utf8chr(Utils.hexDec(value.substr(2, 2)));
          case "u":
            return Utils.utf8chr(Utils.hexDec(value.substr(2, 4)));
          case "U":
            return Utils.utf8chr(Utils.hexDec(value.substr(2, 8)));
          default:
            return "";
        }
      };
      return Unescaper2;
    }();
    module2.exports = Unescaper;
  }
});

// node_modules/yamljs/lib/Escaper.js
var require_Escaper = __commonJS({
  "node_modules/yamljs/lib/Escaper.js"(exports2, module2) {
    var Escaper;
    var Pattern;
    Pattern = require_Pattern();
    Escaper = function() {
      var ch;
      function Escaper2() {
      }
      Escaper2.LIST_ESCAPEES = ["\\", "\\\\", '\\"', '"', "\0", "", "", "", "", "", "", "\x07", "\b", "	", "\n", "\v", "\f", "\r", "", "", "", "", "", "", "", "", "", "", "", "", "", "\x1B", "", "", "", "", (ch = String.fromCharCode)(133), ch(160), ch(8232), ch(8233)];
      Escaper2.LIST_ESCAPED = ["\\\\", '\\"', '\\"', '\\"', "\\0", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\a", "\\b", "\\t", "\\n", "\\v", "\\f", "\\r", "\\x0e", "\\x0f", "\\x10", "\\x11", "\\x12", "\\x13", "\\x14", "\\x15", "\\x16", "\\x17", "\\x18", "\\x19", "\\x1a", "\\e", "\\x1c", "\\x1d", "\\x1e", "\\x1f", "\\N", "\\_", "\\L", "\\P"];
      Escaper2.MAPPING_ESCAPEES_TO_ESCAPED = function() {
        var i, j, mapping, ref;
        mapping = {};
        for (i = j = 0, ref = Escaper2.LIST_ESCAPEES.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          mapping[Escaper2.LIST_ESCAPEES[i]] = Escaper2.LIST_ESCAPED[i];
        }
        return mapping;
      }();
      Escaper2.PATTERN_CHARACTERS_TO_ESCAPE = new Pattern("[\\x00-\\x1f]|\xC2\x85|\xC2\xA0|\xE2\x80\xA8|\xE2\x80\xA9");
      Escaper2.PATTERN_MAPPING_ESCAPEES = new Pattern(Escaper2.LIST_ESCAPEES.join("|").split("\\").join("\\\\"));
      Escaper2.PATTERN_SINGLE_QUOTING = new Pattern("[\\s'\":{}[\\],&*#?]|^[-?|<>=!%@`]");
      Escaper2.requiresDoubleQuoting = function(value) {
        return this.PATTERN_CHARACTERS_TO_ESCAPE.test(value);
      };
      Escaper2.escapeWithDoubleQuotes = function(value) {
        var result;
        result = this.PATTERN_MAPPING_ESCAPEES.replace(value, /* @__PURE__ */ function(_this) {
          return function(str) {
            return _this.MAPPING_ESCAPEES_TO_ESCAPED[str];
          };
        }(this));
        return '"' + result + '"';
      };
      Escaper2.requiresSingleQuoting = function(value) {
        return this.PATTERN_SINGLE_QUOTING.test(value);
      };
      Escaper2.escapeWithSingleQuotes = function(value) {
        return "'" + value.replace(/'/g, "''") + "'";
      };
      return Escaper2;
    }();
    module2.exports = Escaper;
  }
});

// node_modules/yamljs/lib/Exception/ParseException.js
var require_ParseException = __commonJS({
  "node_modules/yamljs/lib/Exception/ParseException.js"(exports2, module2) {
    var ParseException;
    var extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
    var hasProp = {}.hasOwnProperty;
    ParseException = function(superClass) {
      extend(ParseException2, superClass);
      function ParseException2(message, parsedLine, snippet) {
        this.message = message;
        this.parsedLine = parsedLine;
        this.snippet = snippet;
      }
      ParseException2.prototype.toString = function() {
        if (this.parsedLine != null && this.snippet != null) {
          return "<ParseException> " + this.message + " (line " + this.parsedLine + ": '" + this.snippet + "')";
        } else {
          return "<ParseException> " + this.message;
        }
      };
      return ParseException2;
    }(Error);
    module2.exports = ParseException;
  }
});

// node_modules/yamljs/lib/Exception/ParseMore.js
var require_ParseMore = __commonJS({
  "node_modules/yamljs/lib/Exception/ParseMore.js"(exports2, module2) {
    var ParseMore;
    var extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
    var hasProp = {}.hasOwnProperty;
    ParseMore = function(superClass) {
      extend(ParseMore2, superClass);
      function ParseMore2(message, parsedLine, snippet) {
        this.message = message;
        this.parsedLine = parsedLine;
        this.snippet = snippet;
      }
      ParseMore2.prototype.toString = function() {
        if (this.parsedLine != null && this.snippet != null) {
          return "<ParseMore> " + this.message + " (line " + this.parsedLine + ": '" + this.snippet + "')";
        } else {
          return "<ParseMore> " + this.message;
        }
      };
      return ParseMore2;
    }(Error);
    module2.exports = ParseMore;
  }
});

// node_modules/yamljs/lib/Exception/DumpException.js
var require_DumpException = __commonJS({
  "node_modules/yamljs/lib/Exception/DumpException.js"(exports2, module2) {
    var DumpException;
    var extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
    var hasProp = {}.hasOwnProperty;
    DumpException = function(superClass) {
      extend(DumpException2, superClass);
      function DumpException2(message, parsedLine, snippet) {
        this.message = message;
        this.parsedLine = parsedLine;
        this.snippet = snippet;
      }
      DumpException2.prototype.toString = function() {
        if (this.parsedLine != null && this.snippet != null) {
          return "<DumpException> " + this.message + " (line " + this.parsedLine + ": '" + this.snippet + "')";
        } else {
          return "<DumpException> " + this.message;
        }
      };
      return DumpException2;
    }(Error);
    module2.exports = DumpException;
  }
});

// node_modules/yamljs/lib/Inline.js
var require_Inline = __commonJS({
  "node_modules/yamljs/lib/Inline.js"(exports2, module2) {
    var DumpException;
    var Escaper;
    var Inline;
    var ParseException;
    var ParseMore;
    var Pattern;
    var Unescaper;
    var Utils;
    var indexOf = [].indexOf || function(item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
      }
      return -1;
    };
    Pattern = require_Pattern();
    Unescaper = require_Unescaper();
    Escaper = require_Escaper();
    Utils = require_Utils();
    ParseException = require_ParseException();
    ParseMore = require_ParseMore();
    DumpException = require_DumpException();
    Inline = function() {
      function Inline2() {
      }
      Inline2.REGEX_QUOTED_STRING = `(?:"(?:[^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|'(?:[^']*(?:''[^']*)*)')`;
      Inline2.PATTERN_TRAILING_COMMENTS = new Pattern("^\\s*#.*$");
      Inline2.PATTERN_QUOTED_SCALAR = new Pattern("^" + Inline2.REGEX_QUOTED_STRING);
      Inline2.PATTERN_THOUSAND_NUMERIC_SCALAR = new Pattern("^(-|\\+)?[0-9,]+(\\.[0-9]+)?$");
      Inline2.PATTERN_SCALAR_BY_DELIMITERS = {};
      Inline2.settings = {};
      Inline2.configure = function(exceptionOnInvalidType, objectDecoder) {
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = null;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        this.settings.exceptionOnInvalidType = exceptionOnInvalidType;
        this.settings.objectDecoder = objectDecoder;
      };
      Inline2.parse = function(value, exceptionOnInvalidType, objectDecoder) {
        var context, result;
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        this.settings.exceptionOnInvalidType = exceptionOnInvalidType;
        this.settings.objectDecoder = objectDecoder;
        if (value == null) {
          return "";
        }
        value = Utils.trim(value);
        if (0 === value.length) {
          return "";
        }
        context = {
          exceptionOnInvalidType,
          objectDecoder,
          i: 0
        };
        switch (value.charAt(0)) {
          case "[":
            result = this.parseSequence(value, context);
            ++context.i;
            break;
          case "{":
            result = this.parseMapping(value, context);
            ++context.i;
            break;
          default:
            result = this.parseScalar(value, null, ['"', "'"], context);
        }
        if (this.PATTERN_TRAILING_COMMENTS.replace(value.slice(context.i), "") !== "") {
          throw new ParseException('Unexpected characters near "' + value.slice(context.i) + '".');
        }
        return result;
      };
      Inline2.dump = function(value, exceptionOnInvalidType, objectEncoder) {
        var ref, result, type;
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectEncoder == null) {
          objectEncoder = null;
        }
        if (value == null) {
          return "null";
        }
        type = typeof value;
        if (type === "object") {
          if (value instanceof Date) {
            return value.toISOString();
          } else if (objectEncoder != null) {
            result = objectEncoder(value);
            if (typeof result === "string" || result != null) {
              return result;
            }
          }
          return this.dumpObject(value);
        }
        if (type === "boolean") {
          return value ? "true" : "false";
        }
        if (Utils.isDigits(value)) {
          return type === "string" ? "'" + value + "'" : String(parseInt(value));
        }
        if (Utils.isNumeric(value)) {
          return type === "string" ? "'" + value + "'" : String(parseFloat(value));
        }
        if (type === "number") {
          return value === Infinity ? ".Inf" : value === -Infinity ? "-.Inf" : isNaN(value) ? ".NaN" : value;
        }
        if (Escaper.requiresDoubleQuoting(value)) {
          return Escaper.escapeWithDoubleQuotes(value);
        }
        if (Escaper.requiresSingleQuoting(value)) {
          return Escaper.escapeWithSingleQuotes(value);
        }
        if ("" === value) {
          return '""';
        }
        if (Utils.PATTERN_DATE.test(value)) {
          return "'" + value + "'";
        }
        if ((ref = value.toLowerCase()) === "null" || ref === "~" || ref === "true" || ref === "false") {
          return "'" + value + "'";
        }
        return value;
      };
      Inline2.dumpObject = function(value, exceptionOnInvalidType, objectSupport) {
        var j, key, len1, output, val;
        if (objectSupport == null) {
          objectSupport = null;
        }
        if (value instanceof Array) {
          output = [];
          for (j = 0, len1 = value.length; j < len1; j++) {
            val = value[j];
            output.push(this.dump(val));
          }
          return "[" + output.join(", ") + "]";
        } else {
          output = [];
          for (key in value) {
            val = value[key];
            output.push(this.dump(key) + ": " + this.dump(val));
          }
          return "{" + output.join(", ") + "}";
        }
      };
      Inline2.parseScalar = function(scalar, delimiters, stringDelimiters, context, evaluate) {
        var i, joinedDelimiters, match, output, pattern, ref, ref1, strpos, tmp;
        if (delimiters == null) {
          delimiters = null;
        }
        if (stringDelimiters == null) {
          stringDelimiters = ['"', "'"];
        }
        if (context == null) {
          context = null;
        }
        if (evaluate == null) {
          evaluate = true;
        }
        if (context == null) {
          context = {
            exceptionOnInvalidType: this.settings.exceptionOnInvalidType,
            objectDecoder: this.settings.objectDecoder,
            i: 0
          };
        }
        i = context.i;
        if (ref = scalar.charAt(i), indexOf.call(stringDelimiters, ref) >= 0) {
          output = this.parseQuotedScalar(scalar, context);
          i = context.i;
          if (delimiters != null) {
            tmp = Utils.ltrim(scalar.slice(i), " ");
            if (!(ref1 = tmp.charAt(0), indexOf.call(delimiters, ref1) >= 0)) {
              throw new ParseException("Unexpected characters (" + scalar.slice(i) + ").");
            }
          }
        } else {
          if (!delimiters) {
            output = scalar.slice(i);
            i += output.length;
            strpos = output.indexOf(" #");
            if (strpos !== -1) {
              output = Utils.rtrim(output.slice(0, strpos));
            }
          } else {
            joinedDelimiters = delimiters.join("|");
            pattern = this.PATTERN_SCALAR_BY_DELIMITERS[joinedDelimiters];
            if (pattern == null) {
              pattern = new Pattern("^(.+?)(" + joinedDelimiters + ")");
              this.PATTERN_SCALAR_BY_DELIMITERS[joinedDelimiters] = pattern;
            }
            if (match = pattern.exec(scalar.slice(i))) {
              output = match[1];
              i += output.length;
            } else {
              throw new ParseException("Malformed inline YAML string (" + scalar + ").");
            }
          }
          if (evaluate) {
            output = this.evaluateScalar(output, context);
          }
        }
        context.i = i;
        return output;
      };
      Inline2.parseQuotedScalar = function(scalar, context) {
        var i, match, output;
        i = context.i;
        if (!(match = this.PATTERN_QUOTED_SCALAR.exec(scalar.slice(i)))) {
          throw new ParseMore("Malformed inline YAML string (" + scalar.slice(i) + ").");
        }
        output = match[0].substr(1, match[0].length - 2);
        if ('"' === scalar.charAt(i)) {
          output = Unescaper.unescapeDoubleQuotedString(output);
        } else {
          output = Unescaper.unescapeSingleQuotedString(output);
        }
        i += match[0].length;
        context.i = i;
        return output;
      };
      Inline2.parseSequence = function(sequence, context) {
        var e, i, isQuoted, len, output, ref, value;
        output = [];
        len = sequence.length;
        i = context.i;
        i += 1;
        while (i < len) {
          context.i = i;
          switch (sequence.charAt(i)) {
            case "[":
              output.push(this.parseSequence(sequence, context));
              i = context.i;
              break;
            case "{":
              output.push(this.parseMapping(sequence, context));
              i = context.i;
              break;
            case "]":
              return output;
            case ",":
            case " ":
            case "\n":
              break;
            default:
              isQuoted = (ref = sequence.charAt(i)) === '"' || ref === "'";
              value = this.parseScalar(sequence, [",", "]"], ['"', "'"], context);
              i = context.i;
              if (!isQuoted && typeof value === "string" && (value.indexOf(": ") !== -1 || value.indexOf(":\n") !== -1)) {
                try {
                  value = this.parseMapping("{" + value + "}");
                } catch (error) {
                  e = error;
                }
              }
              output.push(value);
              --i;
          }
          ++i;
        }
        throw new ParseMore("Malformed inline YAML string " + sequence);
      };
      Inline2.parseMapping = function(mapping, context) {
        var done, i, key, len, output, shouldContinueWhileLoop, value;
        output = {};
        len = mapping.length;
        i = context.i;
        i += 1;
        shouldContinueWhileLoop = false;
        while (i < len) {
          context.i = i;
          switch (mapping.charAt(i)) {
            case " ":
            case ",":
            case "\n":
              ++i;
              context.i = i;
              shouldContinueWhileLoop = true;
              break;
            case "}":
              return output;
          }
          if (shouldContinueWhileLoop) {
            shouldContinueWhileLoop = false;
            continue;
          }
          key = this.parseScalar(mapping, [":", " ", "\n"], ['"', "'"], context, false);
          i = context.i;
          done = false;
          while (i < len) {
            context.i = i;
            switch (mapping.charAt(i)) {
              case "[":
                value = this.parseSequence(mapping, context);
                i = context.i;
                if (output[key] === void 0) {
                  output[key] = value;
                }
                done = true;
                break;
              case "{":
                value = this.parseMapping(mapping, context);
                i = context.i;
                if (output[key] === void 0) {
                  output[key] = value;
                }
                done = true;
                break;
              case ":":
              case " ":
              case "\n":
                break;
              default:
                value = this.parseScalar(mapping, [",", "}"], ['"', "'"], context);
                i = context.i;
                if (output[key] === void 0) {
                  output[key] = value;
                }
                done = true;
                --i;
            }
            ++i;
            if (done) {
              break;
            }
          }
        }
        throw new ParseMore("Malformed inline YAML string " + mapping);
      };
      Inline2.evaluateScalar = function(scalar, context) {
        var cast, date, exceptionOnInvalidType, firstChar, firstSpace, firstWord, objectDecoder, raw, scalarLower, subValue, trimmedScalar;
        scalar = Utils.trim(scalar);
        scalarLower = scalar.toLowerCase();
        switch (scalarLower) {
          case "null":
          case "":
          case "~":
            return null;
          case "true":
            return true;
          case "false":
            return false;
          case ".inf":
            return Infinity;
          case ".nan":
            return 0 / 0;
          case "-.inf":
            return Infinity;
          default:
            firstChar = scalarLower.charAt(0);
            switch (firstChar) {
              case "!":
                firstSpace = scalar.indexOf(" ");
                if (firstSpace === -1) {
                  firstWord = scalarLower;
                } else {
                  firstWord = scalarLower.slice(0, firstSpace);
                }
                switch (firstWord) {
                  case "!":
                    if (firstSpace !== -1) {
                      return parseInt(this.parseScalar(scalar.slice(2)));
                    }
                    return null;
                  case "!str":
                    return Utils.ltrim(scalar.slice(4));
                  case "!!str":
                    return Utils.ltrim(scalar.slice(5));
                  case "!!int":
                    return parseInt(this.parseScalar(scalar.slice(5)));
                  case "!!bool":
                    return Utils.parseBoolean(this.parseScalar(scalar.slice(6)), false);
                  case "!!float":
                    return parseFloat(this.parseScalar(scalar.slice(7)));
                  case "!!timestamp":
                    return Utils.stringToDate(Utils.ltrim(scalar.slice(11)));
                  default:
                    if (context == null) {
                      context = {
                        exceptionOnInvalidType: this.settings.exceptionOnInvalidType,
                        objectDecoder: this.settings.objectDecoder,
                        i: 0
                      };
                    }
                    objectDecoder = context.objectDecoder, exceptionOnInvalidType = context.exceptionOnInvalidType;
                    if (objectDecoder) {
                      trimmedScalar = Utils.rtrim(scalar);
                      firstSpace = trimmedScalar.indexOf(" ");
                      if (firstSpace === -1) {
                        return objectDecoder(trimmedScalar, null);
                      } else {
                        subValue = Utils.ltrim(trimmedScalar.slice(firstSpace + 1));
                        if (!(subValue.length > 0)) {
                          subValue = null;
                        }
                        return objectDecoder(trimmedScalar.slice(0, firstSpace), subValue);
                      }
                    }
                    if (exceptionOnInvalidType) {
                      throw new ParseException("Custom object support when parsing a YAML file has been disabled.");
                    }
                    return null;
                }
                break;
              case "0":
                if ("0x" === scalar.slice(0, 2)) {
                  return Utils.hexDec(scalar);
                } else if (Utils.isDigits(scalar)) {
                  return Utils.octDec(scalar);
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else {
                  return scalar;
                }
                break;
              case "+":
                if (Utils.isDigits(scalar)) {
                  raw = scalar;
                  cast = parseInt(raw);
                  if (raw === String(cast)) {
                    return cast;
                  } else {
                    return raw;
                  }
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
                  return parseFloat(scalar.replace(",", ""));
                }
                return scalar;
              case "-":
                if (Utils.isDigits(scalar.slice(1))) {
                  if ("0" === scalar.charAt(1)) {
                    return -Utils.octDec(scalar.slice(1));
                  } else {
                    raw = scalar.slice(1);
                    cast = parseInt(raw);
                    if (raw === String(cast)) {
                      return -cast;
                    } else {
                      return -raw;
                    }
                  }
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
                  return parseFloat(scalar.replace(",", ""));
                }
                return scalar;
              default:
                if (date = Utils.stringToDate(scalar)) {
                  return date;
                } else if (Utils.isNumeric(scalar)) {
                  return parseFloat(scalar);
                } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
                  return parseFloat(scalar.replace(",", ""));
                }
                return scalar;
            }
        }
      };
      return Inline2;
    }();
    module2.exports = Inline;
  }
});

// node_modules/yamljs/lib/Parser.js
var require_Parser = __commonJS({
  "node_modules/yamljs/lib/Parser.js"(exports2, module2) {
    var Inline;
    var ParseException;
    var ParseMore;
    var Parser;
    var Pattern;
    var Utils;
    Inline = require_Inline();
    Pattern = require_Pattern();
    Utils = require_Utils();
    ParseException = require_ParseException();
    ParseMore = require_ParseMore();
    Parser = function() {
      Parser2.prototype.PATTERN_FOLDED_SCALAR_ALL = new Pattern("^(?:(?<type>![^\\|>]*)\\s+)?(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$");
      Parser2.prototype.PATTERN_FOLDED_SCALAR_END = new Pattern("(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$");
      Parser2.prototype.PATTERN_SEQUENCE_ITEM = new Pattern("^\\-((?<leadspaces>\\s+)(?<value>.+?))?\\s*$");
      Parser2.prototype.PATTERN_ANCHOR_VALUE = new Pattern("^&(?<ref>[^ ]+) *(?<value>.*)");
      Parser2.prototype.PATTERN_COMPACT_NOTATION = new Pattern("^(?<key>" + Inline.REGEX_QUOTED_STRING + `|[^ '"\\{\\[].*?) *\\:(\\s+(?<value>.+?))?\\s*$`);
      Parser2.prototype.PATTERN_MAPPING_ITEM = new Pattern("^(?<key>" + Inline.REGEX_QUOTED_STRING + `|[^ '"\\[\\{].*?) *\\:(\\s+(?<value>.+?))?\\s*$`);
      Parser2.prototype.PATTERN_DECIMAL = new Pattern("\\d+");
      Parser2.prototype.PATTERN_INDENT_SPACES = new Pattern("^ +");
      Parser2.prototype.PATTERN_TRAILING_LINES = new Pattern("(\n*)$");
      Parser2.prototype.PATTERN_YAML_HEADER = new Pattern("^\\%YAML[: ][\\d\\.]+.*\n", "m");
      Parser2.prototype.PATTERN_LEADING_COMMENTS = new Pattern("^(\\#.*?\n)+", "m");
      Parser2.prototype.PATTERN_DOCUMENT_MARKER_START = new Pattern("^\\-\\-\\-.*?\n", "m");
      Parser2.prototype.PATTERN_DOCUMENT_MARKER_END = new Pattern("^\\.\\.\\.\\s*$", "m");
      Parser2.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION = {};
      Parser2.prototype.CONTEXT_NONE = 0;
      Parser2.prototype.CONTEXT_SEQUENCE = 1;
      Parser2.prototype.CONTEXT_MAPPING = 2;
      function Parser2(offset) {
        this.offset = offset != null ? offset : 0;
        this.lines = [];
        this.currentLineNb = -1;
        this.currentLine = "";
        this.refs = {};
      }
      Parser2.prototype.parse = function(value, exceptionOnInvalidType, objectDecoder) {
        var alias, allowOverwrite, block, c, context, data, e, first, i, indent, isRef, j, k, key, l, lastKey, len, len1, len2, len3, lineCount, m, matches, mergeNode, n, name, parsed, parsedItem, parser, ref, ref1, ref2, refName, refValue, val, values;
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        this.currentLineNb = -1;
        this.currentLine = "";
        this.lines = this.cleanup(value).split("\n");
        data = null;
        context = this.CONTEXT_NONE;
        allowOverwrite = false;
        while (this.moveToNextLine()) {
          if (this.isCurrentLineEmpty()) {
            continue;
          }
          if ("	" === this.currentLine[0]) {
            throw new ParseException("A YAML file cannot contain tabs as indentation.", this.getRealCurrentLineNb() + 1, this.currentLine);
          }
          isRef = mergeNode = false;
          if (values = this.PATTERN_SEQUENCE_ITEM.exec(this.currentLine)) {
            if (this.CONTEXT_MAPPING === context) {
              throw new ParseException("You cannot define a sequence item when in a mapping");
            }
            context = this.CONTEXT_SEQUENCE;
            if (data == null) {
              data = [];
            }
            if (values.value != null && (matches = this.PATTERN_ANCHOR_VALUE.exec(values.value))) {
              isRef = matches.ref;
              values.value = matches.value;
            }
            if (!(values.value != null) || "" === Utils.trim(values.value, " ") || Utils.ltrim(values.value, " ").indexOf("#") === 0) {
              if (this.currentLineNb < this.lines.length - 1 && !this.isNextLineUnIndentedCollection()) {
                c = this.getRealCurrentLineNb() + 1;
                parser = new Parser2(c);
                parser.refs = this.refs;
                data.push(parser.parse(this.getNextEmbedBlock(null, true), exceptionOnInvalidType, objectDecoder));
              } else {
                data.push(null);
              }
            } else {
              if (((ref = values.leadspaces) != null ? ref.length : void 0) && (matches = this.PATTERN_COMPACT_NOTATION.exec(values.value))) {
                c = this.getRealCurrentLineNb();
                parser = new Parser2(c);
                parser.refs = this.refs;
                block = values.value;
                indent = this.getCurrentLineIndentation();
                if (this.isNextLineIndented(false)) {
                  block += "\n" + this.getNextEmbedBlock(indent + values.leadspaces.length + 1, true);
                }
                data.push(parser.parse(block, exceptionOnInvalidType, objectDecoder));
              } else {
                data.push(this.parseValue(values.value, exceptionOnInvalidType, objectDecoder));
              }
            }
          } else if ((values = this.PATTERN_MAPPING_ITEM.exec(this.currentLine)) && values.key.indexOf(" #") === -1) {
            if (this.CONTEXT_SEQUENCE === context) {
              throw new ParseException("You cannot define a mapping item when in a sequence");
            }
            context = this.CONTEXT_MAPPING;
            if (data == null) {
              data = {};
            }
            Inline.configure(exceptionOnInvalidType, objectDecoder);
            try {
              key = Inline.parseScalar(values.key);
            } catch (error) {
              e = error;
              e.parsedLine = this.getRealCurrentLineNb() + 1;
              e.snippet = this.currentLine;
              throw e;
            }
            if ("<<" === key) {
              mergeNode = true;
              allowOverwrite = true;
              if (((ref1 = values.value) != null ? ref1.indexOf("*") : void 0) === 0) {
                refName = values.value.slice(1);
                if (this.refs[refName] == null) {
                  throw new ParseException('Reference "' + refName + '" does not exist.', this.getRealCurrentLineNb() + 1, this.currentLine);
                }
                refValue = this.refs[refName];
                if (typeof refValue !== "object") {
                  throw new ParseException("YAML merge keys used with a scalar value instead of an object.", this.getRealCurrentLineNb() + 1, this.currentLine);
                }
                if (refValue instanceof Array) {
                  for (i = j = 0, len = refValue.length; j < len; i = ++j) {
                    value = refValue[i];
                    if (data[name = String(i)] == null) {
                      data[name] = value;
                    }
                  }
                } else {
                  for (key in refValue) {
                    value = refValue[key];
                    if (data[key] == null) {
                      data[key] = value;
                    }
                  }
                }
              } else {
                if (values.value != null && values.value !== "") {
                  value = values.value;
                } else {
                  value = this.getNextEmbedBlock();
                }
                c = this.getRealCurrentLineNb() + 1;
                parser = new Parser2(c);
                parser.refs = this.refs;
                parsed = parser.parse(value, exceptionOnInvalidType);
                if (typeof parsed !== "object") {
                  throw new ParseException("YAML merge keys used with a scalar value instead of an object.", this.getRealCurrentLineNb() + 1, this.currentLine);
                }
                if (parsed instanceof Array) {
                  for (l = 0, len1 = parsed.length; l < len1; l++) {
                    parsedItem = parsed[l];
                    if (typeof parsedItem !== "object") {
                      throw new ParseException("Merge items must be objects.", this.getRealCurrentLineNb() + 1, parsedItem);
                    }
                    if (parsedItem instanceof Array) {
                      for (i = m = 0, len2 = parsedItem.length; m < len2; i = ++m) {
                        value = parsedItem[i];
                        k = String(i);
                        if (!data.hasOwnProperty(k)) {
                          data[k] = value;
                        }
                      }
                    } else {
                      for (key in parsedItem) {
                        value = parsedItem[key];
                        if (!data.hasOwnProperty(key)) {
                          data[key] = value;
                        }
                      }
                    }
                  }
                } else {
                  for (key in parsed) {
                    value = parsed[key];
                    if (!data.hasOwnProperty(key)) {
                      data[key] = value;
                    }
                  }
                }
              }
            } else if (values.value != null && (matches = this.PATTERN_ANCHOR_VALUE.exec(values.value))) {
              isRef = matches.ref;
              values.value = matches.value;
            }
            if (mergeNode) {
            } else if (!(values.value != null) || "" === Utils.trim(values.value, " ") || Utils.ltrim(values.value, " ").indexOf("#") === 0) {
              if (!this.isNextLineIndented() && !this.isNextLineUnIndentedCollection()) {
                if (allowOverwrite || data[key] === void 0) {
                  data[key] = null;
                }
              } else {
                c = this.getRealCurrentLineNb() + 1;
                parser = new Parser2(c);
                parser.refs = this.refs;
                val = parser.parse(this.getNextEmbedBlock(), exceptionOnInvalidType, objectDecoder);
                if (allowOverwrite || data[key] === void 0) {
                  data[key] = val;
                }
              }
            } else {
              val = this.parseValue(values.value, exceptionOnInvalidType, objectDecoder);
              if (allowOverwrite || data[key] === void 0) {
                data[key] = val;
              }
            }
          } else {
            lineCount = this.lines.length;
            if (1 === lineCount || 2 === lineCount && Utils.isEmpty(this.lines[1])) {
              try {
                value = Inline.parse(this.lines[0], exceptionOnInvalidType, objectDecoder);
              } catch (error) {
                e = error;
                e.parsedLine = this.getRealCurrentLineNb() + 1;
                e.snippet = this.currentLine;
                throw e;
              }
              if (typeof value === "object") {
                if (value instanceof Array) {
                  first = value[0];
                } else {
                  for (key in value) {
                    first = value[key];
                    break;
                  }
                }
                if (typeof first === "string" && first.indexOf("*") === 0) {
                  data = [];
                  for (n = 0, len3 = value.length; n < len3; n++) {
                    alias = value[n];
                    data.push(this.refs[alias.slice(1)]);
                  }
                  value = data;
                }
              }
              return value;
            } else if ((ref2 = Utils.ltrim(value).charAt(0)) === "[" || ref2 === "{") {
              try {
                return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
              } catch (error) {
                e = error;
                e.parsedLine = this.getRealCurrentLineNb() + 1;
                e.snippet = this.currentLine;
                throw e;
              }
            }
            throw new ParseException("Unable to parse.", this.getRealCurrentLineNb() + 1, this.currentLine);
          }
          if (isRef) {
            if (data instanceof Array) {
              this.refs[isRef] = data[data.length - 1];
            } else {
              lastKey = null;
              for (key in data) {
                lastKey = key;
              }
              this.refs[isRef] = data[lastKey];
            }
          }
        }
        if (Utils.isEmpty(data)) {
          return null;
        } else {
          return data;
        }
      };
      Parser2.prototype.getRealCurrentLineNb = function() {
        return this.currentLineNb + this.offset;
      };
      Parser2.prototype.getCurrentLineIndentation = function() {
        return this.currentLine.length - Utils.ltrim(this.currentLine, " ").length;
      };
      Parser2.prototype.getNextEmbedBlock = function(indentation, includeUnindentedCollection) {
        var data, indent, isItUnindentedCollection, newIndent, removeComments, removeCommentsPattern, unindentedEmbedBlock;
        if (indentation == null) {
          indentation = null;
        }
        if (includeUnindentedCollection == null) {
          includeUnindentedCollection = false;
        }
        this.moveToNextLine();
        if (indentation == null) {
          newIndent = this.getCurrentLineIndentation();
          unindentedEmbedBlock = this.isStringUnIndentedCollectionItem(this.currentLine);
          if (!this.isCurrentLineEmpty() && 0 === newIndent && !unindentedEmbedBlock) {
            throw new ParseException("Indentation problem.", this.getRealCurrentLineNb() + 1, this.currentLine);
          }
        } else {
          newIndent = indentation;
        }
        data = [this.currentLine.slice(newIndent)];
        if (!includeUnindentedCollection) {
          isItUnindentedCollection = this.isStringUnIndentedCollectionItem(this.currentLine);
        }
        removeCommentsPattern = this.PATTERN_FOLDED_SCALAR_END;
        removeComments = !removeCommentsPattern.test(this.currentLine);
        while (this.moveToNextLine()) {
          indent = this.getCurrentLineIndentation();
          if (indent === newIndent) {
            removeComments = !removeCommentsPattern.test(this.currentLine);
          }
          if (removeComments && this.isCurrentLineComment()) {
            continue;
          }
          if (this.isCurrentLineBlank()) {
            data.push(this.currentLine.slice(newIndent));
            continue;
          }
          if (isItUnindentedCollection && !this.isStringUnIndentedCollectionItem(this.currentLine) && indent === newIndent) {
            this.moveToPreviousLine();
            break;
          }
          if (indent >= newIndent) {
            data.push(this.currentLine.slice(newIndent));
          } else if (Utils.ltrim(this.currentLine).charAt(0) === "#") {
          } else if (0 === indent) {
            this.moveToPreviousLine();
            break;
          } else {
            throw new ParseException("Indentation problem.", this.getRealCurrentLineNb() + 1, this.currentLine);
          }
        }
        return data.join("\n");
      };
      Parser2.prototype.moveToNextLine = function() {
        if (this.currentLineNb >= this.lines.length - 1) {
          return false;
        }
        this.currentLine = this.lines[++this.currentLineNb];
        return true;
      };
      Parser2.prototype.moveToPreviousLine = function() {
        this.currentLine = this.lines[--this.currentLineNb];
      };
      Parser2.prototype.parseValue = function(value, exceptionOnInvalidType, objectDecoder) {
        var e, foldedIndent, matches, modifiers, pos, ref, ref1, val;
        if (0 === value.indexOf("*")) {
          pos = value.indexOf("#");
          if (pos !== -1) {
            value = value.substr(1, pos - 2);
          } else {
            value = value.slice(1);
          }
          if (this.refs[value] === void 0) {
            throw new ParseException('Reference "' + value + '" does not exist.', this.currentLine);
          }
          return this.refs[value];
        }
        if (matches = this.PATTERN_FOLDED_SCALAR_ALL.exec(value)) {
          modifiers = (ref = matches.modifiers) != null ? ref : "";
          foldedIndent = Math.abs(parseInt(modifiers));
          if (isNaN(foldedIndent)) {
            foldedIndent = 0;
          }
          val = this.parseFoldedScalar(matches.separator, this.PATTERN_DECIMAL.replace(modifiers, ""), foldedIndent);
          if (matches.type != null) {
            Inline.configure(exceptionOnInvalidType, objectDecoder);
            return Inline.parseScalar(matches.type + " " + val);
          } else {
            return val;
          }
        }
        if ((ref1 = value.charAt(0)) === "[" || ref1 === "{" || ref1 === '"' || ref1 === "'") {
          while (true) {
            try {
              return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
            } catch (error) {
              e = error;
              if (e instanceof ParseMore && this.moveToNextLine()) {
                value += "\n" + Utils.trim(this.currentLine, " ");
              } else {
                e.parsedLine = this.getRealCurrentLineNb() + 1;
                e.snippet = this.currentLine;
                throw e;
              }
            }
          }
        } else {
          if (this.isNextLineIndented()) {
            value += "\n" + this.getNextEmbedBlock();
          }
          return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
        }
      };
      Parser2.prototype.parseFoldedScalar = function(separator, indicator, indentation) {
        var isCurrentLineBlank, j, len, line, matches, newText, notEOF, pattern, ref, text;
        if (indicator == null) {
          indicator = "";
        }
        if (indentation == null) {
          indentation = 0;
        }
        notEOF = this.moveToNextLine();
        if (!notEOF) {
          return "";
        }
        isCurrentLineBlank = this.isCurrentLineBlank();
        text = "";
        while (notEOF && isCurrentLineBlank) {
          if (notEOF = this.moveToNextLine()) {
            text += "\n";
            isCurrentLineBlank = this.isCurrentLineBlank();
          }
        }
        if (0 === indentation) {
          if (matches = this.PATTERN_INDENT_SPACES.exec(this.currentLine)) {
            indentation = matches[0].length;
          }
        }
        if (indentation > 0) {
          pattern = this.PATTERN_FOLDED_SCALAR_BY_INDENTATION[indentation];
          if (pattern == null) {
            pattern = new Pattern("^ {" + indentation + "}(.*)$");
            Parser2.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION[indentation] = pattern;
          }
          while (notEOF && (isCurrentLineBlank || (matches = pattern.exec(this.currentLine)))) {
            if (isCurrentLineBlank) {
              text += this.currentLine.slice(indentation);
            } else {
              text += matches[1];
            }
            if (notEOF = this.moveToNextLine()) {
              text += "\n";
              isCurrentLineBlank = this.isCurrentLineBlank();
            }
          }
        } else if (notEOF) {
          text += "\n";
        }
        if (notEOF) {
          this.moveToPreviousLine();
        }
        if (">" === separator) {
          newText = "";
          ref = text.split("\n");
          for (j = 0, len = ref.length; j < len; j++) {
            line = ref[j];
            if (line.length === 0 || line.charAt(0) === " ") {
              newText = Utils.rtrim(newText, " ") + line + "\n";
            } else {
              newText += line + " ";
            }
          }
          text = newText;
        }
        if ("+" !== indicator) {
          text = Utils.rtrim(text);
        }
        if ("" === indicator) {
          text = this.PATTERN_TRAILING_LINES.replace(text, "\n");
        } else if ("-" === indicator) {
          text = this.PATTERN_TRAILING_LINES.replace(text, "");
        }
        return text;
      };
      Parser2.prototype.isNextLineIndented = function(ignoreComments) {
        var EOF, currentIndentation, ret;
        if (ignoreComments == null) {
          ignoreComments = true;
        }
        currentIndentation = this.getCurrentLineIndentation();
        EOF = !this.moveToNextLine();
        if (ignoreComments) {
          while (!EOF && this.isCurrentLineEmpty()) {
            EOF = !this.moveToNextLine();
          }
        } else {
          while (!EOF && this.isCurrentLineBlank()) {
            EOF = !this.moveToNextLine();
          }
        }
        if (EOF) {
          return false;
        }
        ret = false;
        if (this.getCurrentLineIndentation() > currentIndentation) {
          ret = true;
        }
        this.moveToPreviousLine();
        return ret;
      };
      Parser2.prototype.isCurrentLineEmpty = function() {
        var trimmedLine;
        trimmedLine = Utils.trim(this.currentLine, " ");
        return trimmedLine.length === 0 || trimmedLine.charAt(0) === "#";
      };
      Parser2.prototype.isCurrentLineBlank = function() {
        return "" === Utils.trim(this.currentLine, " ");
      };
      Parser2.prototype.isCurrentLineComment = function() {
        var ltrimmedLine;
        ltrimmedLine = Utils.ltrim(this.currentLine, " ");
        return ltrimmedLine.charAt(0) === "#";
      };
      Parser2.prototype.cleanup = function(value) {
        var count, i, indent, j, l, len, len1, line, lines, ref, ref1, ref2, smallestIndent, trimmedValue;
        if (value.indexOf("\r") !== -1) {
          value = value.split("\r\n").join("\n").split("\r").join("\n");
        }
        count = 0;
        ref = this.PATTERN_YAML_HEADER.replaceAll(value, ""), value = ref[0], count = ref[1];
        this.offset += count;
        ref1 = this.PATTERN_LEADING_COMMENTS.replaceAll(value, "", 1), trimmedValue = ref1[0], count = ref1[1];
        if (count === 1) {
          this.offset += Utils.subStrCount(value, "\n") - Utils.subStrCount(trimmedValue, "\n");
          value = trimmedValue;
        }
        ref2 = this.PATTERN_DOCUMENT_MARKER_START.replaceAll(value, "", 1), trimmedValue = ref2[0], count = ref2[1];
        if (count === 1) {
          this.offset += Utils.subStrCount(value, "\n") - Utils.subStrCount(trimmedValue, "\n");
          value = trimmedValue;
          value = this.PATTERN_DOCUMENT_MARKER_END.replace(value, "");
        }
        lines = value.split("\n");
        smallestIndent = -1;
        for (j = 0, len = lines.length; j < len; j++) {
          line = lines[j];
          if (Utils.trim(line, " ").length === 0) {
            continue;
          }
          indent = line.length - Utils.ltrim(line).length;
          if (smallestIndent === -1 || indent < smallestIndent) {
            smallestIndent = indent;
          }
        }
        if (smallestIndent > 0) {
          for (i = l = 0, len1 = lines.length; l < len1; i = ++l) {
            line = lines[i];
            lines[i] = line.slice(smallestIndent);
          }
          value = lines.join("\n");
        }
        return value;
      };
      Parser2.prototype.isNextLineUnIndentedCollection = function(currentIndentation) {
        var notEOF, ret;
        if (currentIndentation == null) {
          currentIndentation = null;
        }
        if (currentIndentation == null) {
          currentIndentation = this.getCurrentLineIndentation();
        }
        notEOF = this.moveToNextLine();
        while (notEOF && this.isCurrentLineEmpty()) {
          notEOF = this.moveToNextLine();
        }
        if (false === notEOF) {
          return false;
        }
        ret = false;
        if (this.getCurrentLineIndentation() === currentIndentation && this.isStringUnIndentedCollectionItem(this.currentLine)) {
          ret = true;
        }
        this.moveToPreviousLine();
        return ret;
      };
      Parser2.prototype.isStringUnIndentedCollectionItem = function() {
        return this.currentLine === "-" || this.currentLine.slice(0, 2) === "- ";
      };
      return Parser2;
    }();
    module2.exports = Parser;
  }
});

// node_modules/yamljs/lib/Dumper.js
var require_Dumper = __commonJS({
  "node_modules/yamljs/lib/Dumper.js"(exports2, module2) {
    var Dumper;
    var Inline;
    var Utils;
    Utils = require_Utils();
    Inline = require_Inline();
    Dumper = function() {
      function Dumper2() {
      }
      Dumper2.indentation = 4;
      Dumper2.prototype.dump = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
        var i, key, len, output, prefix, value, willBeInlined;
        if (inline == null) {
          inline = 0;
        }
        if (indent == null) {
          indent = 0;
        }
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectEncoder == null) {
          objectEncoder = null;
        }
        output = "";
        prefix = indent ? Utils.strRepeat(" ", indent) : "";
        if (inline <= 0 || typeof input !== "object" || input instanceof Date || Utils.isEmpty(input)) {
          output += prefix + Inline.dump(input, exceptionOnInvalidType, objectEncoder);
        } else {
          if (input instanceof Array) {
            for (i = 0, len = input.length; i < len; i++) {
              value = input[i];
              willBeInlined = inline - 1 <= 0 || typeof value !== "object" || Utils.isEmpty(value);
              output += prefix + "-" + (willBeInlined ? " " : "\n") + this.dump(value, inline - 1, willBeInlined ? 0 : indent + this.indentation, exceptionOnInvalidType, objectEncoder) + (willBeInlined ? "\n" : "");
            }
          } else {
            for (key in input) {
              value = input[key];
              willBeInlined = inline - 1 <= 0 || typeof value !== "object" || Utils.isEmpty(value);
              output += prefix + Inline.dump(key, exceptionOnInvalidType, objectEncoder) + ":" + (willBeInlined ? " " : "\n") + this.dump(value, inline - 1, willBeInlined ? 0 : indent + this.indentation, exceptionOnInvalidType, objectEncoder) + (willBeInlined ? "\n" : "");
            }
          }
        }
        return output;
      };
      return Dumper2;
    }();
    module2.exports = Dumper;
  }
});

// node_modules/yamljs/lib/Yaml.js
var require_Yaml = __commonJS({
  "node_modules/yamljs/lib/Yaml.js"(exports2, module2) {
    var Dumper;
    var Parser;
    var Utils;
    var Yaml;
    Parser = require_Parser();
    Dumper = require_Dumper();
    Utils = require_Utils();
    Yaml = function() {
      function Yaml2() {
      }
      Yaml2.parse = function(input, exceptionOnInvalidType, objectDecoder) {
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        return new Parser().parse(input, exceptionOnInvalidType, objectDecoder);
      };
      Yaml2.parseFile = function(path, callback, exceptionOnInvalidType, objectDecoder) {
        var input;
        if (callback == null) {
          callback = null;
        }
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectDecoder == null) {
          objectDecoder = null;
        }
        if (callback != null) {
          return Utils.getStringFromFile(path, /* @__PURE__ */ function(_this) {
            return function(input2) {
              var result;
              result = null;
              if (input2 != null) {
                result = _this.parse(input2, exceptionOnInvalidType, objectDecoder);
              }
              callback(result);
            };
          }(this));
        } else {
          input = Utils.getStringFromFile(path);
          if (input != null) {
            return this.parse(input, exceptionOnInvalidType, objectDecoder);
          }
          return null;
        }
      };
      Yaml2.dump = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
        var yaml2;
        if (inline == null) {
          inline = 2;
        }
        if (indent == null) {
          indent = 4;
        }
        if (exceptionOnInvalidType == null) {
          exceptionOnInvalidType = false;
        }
        if (objectEncoder == null) {
          objectEncoder = null;
        }
        yaml2 = new Dumper();
        yaml2.indentation = indent;
        return yaml2.dump(input, inline, 0, exceptionOnInvalidType, objectEncoder);
      };
      Yaml2.stringify = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
        return this.dump(input, inline, indent, exceptionOnInvalidType, objectEncoder);
      };
      Yaml2.load = function(path, callback, exceptionOnInvalidType, objectDecoder) {
        return this.parseFile(path, callback, exceptionOnInvalidType, objectDecoder);
      };
      return Yaml2;
    }();
    if (typeof window !== "undefined" && window !== null) {
      window.YAML = Yaml;
    }
    if (typeof window === "undefined" || window === null) {
      exports2.YAML = Yaml;
    }
    module2.exports = Yaml;
  }
});

// node_modules/js-yaml/lib/js-yaml/common.js
var require_common = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/common.js"(exports2, module2) {
    "use strict";
    function isNothing(subject) {
      return typeof subject === "undefined" || subject === null;
    }
    function isObject(subject) {
      return typeof subject === "object" && subject !== null;
    }
    function toArray(sequence) {
      if (Array.isArray(sequence)) return sequence;
      else if (isNothing(sequence)) return [];
      return [sequence];
    }
    function extend(target, source) {
      var index, length, key, sourceKeys;
      if (source) {
        sourceKeys = Object.keys(source);
        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key = sourceKeys[index];
          target[key] = source[key];
        }
      }
      return target;
    }
    function repeat(string, count) {
      var result = "", cycle;
      for (cycle = 0; cycle < count; cycle += 1) {
        result += string;
      }
      return result;
    }
    function isNegativeZero(number) {
      return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
    }
    module2.exports.isNothing = isNothing;
    module2.exports.isObject = isObject;
    module2.exports.toArray = toArray;
    module2.exports.repeat = repeat;
    module2.exports.isNegativeZero = isNegativeZero;
    module2.exports.extend = extend;
  }
});

// node_modules/js-yaml/lib/js-yaml/exception.js
var require_exception = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/exception.js"(exports2, module2) {
    "use strict";
    function YAMLException(reason, mark) {
      Error.call(this);
      this.name = "YAMLException";
      this.reason = reason;
      this.mark = mark;
      this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : "");
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack || "";
      }
    }
    YAMLException.prototype = Object.create(Error.prototype);
    YAMLException.prototype.constructor = YAMLException;
    YAMLException.prototype.toString = function toString(compact) {
      var result = this.name + ": ";
      result += this.reason || "(unknown reason)";
      if (!compact && this.mark) {
        result += " " + this.mark.toString();
      }
      return result;
    };
    module2.exports = YAMLException;
  }
});

// node_modules/js-yaml/lib/js-yaml/mark.js
var require_mark = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/mark.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    function Mark(name, buffer, position, line, column) {
      this.name = name;
      this.buffer = buffer;
      this.position = position;
      this.line = line;
      this.column = column;
    }
    Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
      var head, start, tail, end, snippet;
      if (!this.buffer) return null;
      indent = indent || 4;
      maxLength = maxLength || 75;
      head = "";
      start = this.position;
      while (start > 0 && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1) {
        start -= 1;
        if (this.position - start > maxLength / 2 - 1) {
          head = " ... ";
          start += 5;
          break;
        }
      }
      tail = "";
      end = this.position;
      while (end < this.buffer.length && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1) {
        end += 1;
        if (end - this.position > maxLength / 2 - 1) {
          tail = " ... ";
          end -= 5;
          break;
        }
      }
      snippet = this.buffer.slice(start, end);
      return common.repeat(" ", indent) + head + snippet + tail + "\n" + common.repeat(" ", indent + this.position - start + head.length) + "^";
    };
    Mark.prototype.toString = function toString(compact) {
      var snippet, where = "";
      if (this.name) {
        where += 'in "' + this.name + '" ';
      }
      where += "at line " + (this.line + 1) + ", column " + (this.column + 1);
      if (!compact) {
        snippet = this.getSnippet();
        if (snippet) {
          where += ":\n" + snippet;
        }
      }
      return where;
    };
    module2.exports = Mark;
  }
});

// node_modules/js-yaml/lib/js-yaml/type.js
var require_type = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type.js"(exports2, module2) {
    "use strict";
    var YAMLException = require_exception();
    var TYPE_CONSTRUCTOR_OPTIONS = [
      "kind",
      "resolve",
      "construct",
      "instanceOf",
      "predicate",
      "represent",
      "defaultStyle",
      "styleAliases"
    ];
    var YAML_NODE_KINDS = [
      "scalar",
      "sequence",
      "mapping"
    ];
    function compileStyleAliases(map) {
      var result = {};
      if (map !== null) {
        Object.keys(map).forEach(function(style) {
          map[style].forEach(function(alias) {
            result[String(alias)] = style;
          });
        });
      }
      return result;
    }
    function Type(tag2, options) {
      options = options || {};
      Object.keys(options).forEach(function(name) {
        if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
          throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag2 + '" YAML type.');
        }
      });
      this.tag = tag2;
      this.kind = options["kind"] || null;
      this.resolve = options["resolve"] || function() {
        return true;
      };
      this.construct = options["construct"] || function(data) {
        return data;
      };
      this.instanceOf = options["instanceOf"] || null;
      this.predicate = options["predicate"] || null;
      this.represent = options["represent"] || null;
      this.defaultStyle = options["defaultStyle"] || null;
      this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
        throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag2 + '" YAML type.');
      }
    }
    module2.exports = Type;
  }
});

// node_modules/js-yaml/lib/js-yaml/schema.js
var require_schema = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var Type = require_type();
    function compileList(schema, name, result) {
      var exclude = [];
      schema.include.forEach(function(includedSchema) {
        result = compileList(includedSchema, name, result);
      });
      schema[name].forEach(function(currentType) {
        result.forEach(function(previousType, previousIndex) {
          if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
            exclude.push(previousIndex);
          }
        });
        result.push(currentType);
      });
      return result.filter(function(type, index) {
        return exclude.indexOf(index) === -1;
      });
    }
    function compileMap() {
      var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {}
      }, index, length;
      function collectType(type) {
        result[type.kind][type.tag] = result["fallback"][type.tag] = type;
      }
      for (index = 0, length = arguments.length; index < length; index += 1) {
        arguments[index].forEach(collectType);
      }
      return result;
    }
    function Schema(definition) {
      this.include = definition.include || [];
      this.implicit = definition.implicit || [];
      this.explicit = definition.explicit || [];
      this.implicit.forEach(function(type) {
        if (type.loadKind && type.loadKind !== "scalar") {
          throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
        }
      });
      this.compiledImplicit = compileList(this, "implicit", []);
      this.compiledExplicit = compileList(this, "explicit", []);
      this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
    }
    Schema.DEFAULT = null;
    Schema.create = function createSchema() {
      var schemas, types;
      switch (arguments.length) {
        case 1:
          schemas = Schema.DEFAULT;
          types = arguments[0];
          break;
        case 2:
          schemas = arguments[0];
          types = arguments[1];
          break;
        default:
          throw new YAMLException("Wrong number of arguments for Schema.create function");
      }
      schemas = common.toArray(schemas);
      types = common.toArray(types);
      if (!schemas.every(function(schema) {
        return schema instanceof Schema;
      })) {
        throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
      }
      if (!types.every(function(type) {
        return type instanceof Type;
      })) {
        throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      return new Schema({
        include: schemas,
        explicit: types
      });
    };
    module2.exports = Schema;
  }
});

// node_modules/js-yaml/lib/js-yaml/type/str.js
var require_str = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/str.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:str", {
      kind: "scalar",
      construct: function(data) {
        return data !== null ? data : "";
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/seq.js
var require_seq = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/seq.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:seq", {
      kind: "sequence",
      construct: function(data) {
        return data !== null ? data : [];
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/map.js
var require_map = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/map.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:map", {
      kind: "mapping",
      construct: function(data) {
        return data !== null ? data : {};
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/failsafe.js
var require_failsafe = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/failsafe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      explicit: [
        require_str(),
        require_seq(),
        require_map()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/null.js
var require_null = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/null.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlNull(data) {
      if (data === null) return true;
      var max = data.length;
      return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
    }
    function constructYamlNull() {
      return null;
    }
    function isNull(object) {
      return object === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:null", {
      kind: "scalar",
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function() {
          return "~";
        },
        lowercase: function() {
          return "null";
        },
        uppercase: function() {
          return "NULL";
        },
        camelcase: function() {
          return "Null";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/bool.js
var require_bool = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/bool.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlBoolean(data) {
      if (data === null) return false;
      var max = data.length;
      return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
    }
    function constructYamlBoolean(data) {
      return data === "true" || data === "True" || data === "TRUE";
    }
    function isBoolean(object) {
      return Object.prototype.toString.call(object) === "[object Boolean]";
    }
    module2.exports = new Type("tag:yaml.org,2002:bool", {
      kind: "scalar",
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function(object) {
          return object ? "true" : "false";
        },
        uppercase: function(object) {
          return object ? "TRUE" : "FALSE";
        },
        camelcase: function(object) {
          return object ? "True" : "False";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/int.js
var require_int = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/int.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    function isHexCode(c) {
      return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
    }
    function isOctCode(c) {
      return 48 <= c && c <= 55;
    }
    function isDecCode(c) {
      return 48 <= c && c <= 57;
    }
    function resolveYamlInteger(data) {
      if (data === null) return false;
      var max = data.length, index = 0, hasDigits = false, ch;
      if (!max) return false;
      ch = data[index];
      if (ch === "-" || ch === "+") {
        ch = data[++index];
      }
      if (ch === "0") {
        if (index + 1 === max) return true;
        ch = data[++index];
        if (ch === "b") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (ch !== "0" && ch !== "1") return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "x") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_") continue;
            if (!isHexCode(data.charCodeAt(index))) return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "_") return false;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch === ":") break;
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      if (!hasDigits || ch === "_") return false;
      if (ch !== ":") return true;
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
    }
    function constructYamlInteger(data) {
      var value = data, sign = 1, ch, base, digits = [];
      if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
      }
      ch = value[0];
      if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value = value.slice(1);
        ch = value[0];
      }
      if (value === "0") return 0;
      if (ch === "0") {
        if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x") return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
      }
      if (value.indexOf(":") !== -1) {
        value.split(":").forEach(function(v) {
          digits.unshift(parseInt(v, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d) {
          value += d * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseInt(value, 10);
    }
    function isInteger(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:int", {
      kind: "scalar",
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary: function(obj) {
          return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
        },
        octal: function(obj) {
          return obj >= 0 ? "0" + obj.toString(8) : "-0" + obj.toString(8).slice(1);
        },
        decimal: function(obj) {
          return obj.toString(10);
        },
        /* eslint-disable max-len */
        hexadecimal: function(obj) {
          return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
        }
      },
      defaultStyle: "decimal",
      styleAliases: {
        binary: [2, "bin"],
        octal: [8, "oct"],
        decimal: [10, "dec"],
        hexadecimal: [16, "hex"]
      }
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/float.js
var require_float = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/float.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
    );
    function resolveYamlFloat(data) {
      if (data === null) return false;
      if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === "_") {
        return false;
      }
      return true;
    }
    function constructYamlFloat(data) {
      var value, sign, base, digits;
      value = data.replace(/_/g, "").toLowerCase();
      sign = value[0] === "-" ? -1 : 1;
      digits = [];
      if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }
      if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else if (value === ".nan") {
        return NaN;
      } else if (value.indexOf(":") >= 0) {
        value.split(":").forEach(function(v) {
          digits.unshift(parseFloat(v, 10));
        });
        value = 0;
        base = 1;
        digits.forEach(function(d) {
          value += d * base;
          base *= 60;
        });
        return sign * value;
      }
      return sign * parseFloat(value, 10);
    }
    var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
    function representYamlFloat(object, style) {
      var res;
      if (isNaN(object)) {
        switch (style) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
      } else if (common.isNegativeZero(object)) {
        return "-0.0";
      }
      res = object.toString(10);
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
    }
    function isFloat(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:float", {
      kind: "scalar",
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/json.js
var require_json = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/json.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_failsafe()
      ],
      implicit: [
        require_null(),
        require_bool(),
        require_int(),
        require_float()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/core.js
var require_core = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/core.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_json()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/timestamp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
    );
    var YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
    );
    function resolveYamlTimestamp(data) {
      if (data === null) return false;
      if (YAML_DATE_REGEXP.exec(data) !== null) return true;
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
      return false;
    }
    function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
      match = YAML_DATE_REGEXP.exec(data);
      if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
      if (match === null) throw new Error("Date resolve error");
      year = +match[1];
      month = +match[2] - 1;
      day = +match[3];
      if (!match[4]) {
        return new Date(Date.UTC(year, month, day));
      }
      hour = +match[4];
      minute = +match[5];
      second = +match[6];
      if (match[7]) {
        fraction = match[7].slice(0, 3);
        while (fraction.length < 3) {
          fraction += "0";
        }
        fraction = +fraction;
      }
      if (match[9]) {
        tz_hour = +match[10];
        tz_minute = +(match[11] || 0);
        delta = (tz_hour * 60 + tz_minute) * 6e4;
        if (match[9] === "-") delta = -delta;
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      if (delta) date.setTime(date.getTime() - delta);
      return date;
    }
    function representYamlTimestamp(object) {
      return object.toISOString();
    }
    module2.exports = new Type("tag:yaml.org,2002:timestamp", {
      kind: "scalar",
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/merge.js
var require_merge = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/merge.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlMerge(data) {
      return data === "<<" || data === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:merge", {
      kind: "scalar",
      resolve: resolveYamlMerge
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/binary.js
var require_binary = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/binary.js"(exports2, module2) {
    "use strict";
    var NodeBuffer;
    try {
      _require = require;
      NodeBuffer = _require("buffer").Buffer;
    } catch (__) {
    }
    var _require;
    var Type = require_type();
    var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
    function resolveYamlBinary(data) {
      if (data === null) return false;
      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));
        if (code > 64) continue;
        if (code < 0) return false;
        bitlen += 6;
      }
      return bitlen % 8 === 0;
    }
    function constructYamlBinary(data) {
      var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
      for (idx = 0; idx < max; idx++) {
        if (idx % 4 === 0 && idx) {
          result.push(bits >> 16 & 255);
          result.push(bits >> 8 & 255);
          result.push(bits & 255);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
      }
      tailbits = max % 4 * 6;
      if (tailbits === 0) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      } else if (tailbits === 18) {
        result.push(bits >> 10 & 255);
        result.push(bits >> 2 & 255);
      } else if (tailbits === 12) {
        result.push(bits >> 4 & 255);
      }
      if (NodeBuffer) {
        return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
      }
      return result;
    }
    function representYamlBinary(object) {
      var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        if (idx % 3 === 0 && idx) {
          result += map[bits >> 18 & 63];
          result += map[bits >> 12 & 63];
          result += map[bits >> 6 & 63];
          result += map[bits & 63];
        }
        bits = (bits << 8) + object[idx];
      }
      tail = max % 3;
      if (tail === 0) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
      } else if (tail === 2) {
        result += map[bits >> 10 & 63];
        result += map[bits >> 4 & 63];
        result += map[bits << 2 & 63];
        result += map[64];
      } else if (tail === 1) {
        result += map[bits >> 2 & 63];
        result += map[bits << 4 & 63];
        result += map[64];
        result += map[64];
      }
      return result;
    }
    function isBinary(object) {
      return NodeBuffer && NodeBuffer.isBuffer(object);
    }
    module2.exports = new Type("tag:yaml.org,2002:binary", {
      kind: "scalar",
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/omap.js
var require_omap = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/omap.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;
    function resolveYamlOmap(data) {
      if (data === null) return true;
      var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for (pairKey in pair) {
          if (_hasOwnProperty.call(pair, pairKey)) {
            if (!pairHasKey) pairHasKey = true;
            else return false;
          }
        }
        if (!pairHasKey) return false;
        if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
        else return false;
      }
      return true;
    }
    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }
    module2.exports = new Type("tag:yaml.org,2002:omap", {
      kind: "sequence",
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/pairs.js
var require_pairs = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/pairs.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _toString = Object.prototype.toString;
    function resolveYamlPairs(data) {
      if (data === null) return true;
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        if (_toString.call(pair) !== "[object Object]") return false;
        keys = Object.keys(pair);
        if (keys.length !== 1) return false;
        result[index] = [keys[0], pair[keys[0]]];
      }
      return true;
    }
    function constructYamlPairs(data) {
      if (data === null) return [];
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        keys = Object.keys(pair);
        result[index] = [keys[0], pair[keys[0]]];
      }
      return result;
    }
    module2.exports = new Type("tag:yaml.org,2002:pairs", {
      kind: "sequence",
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/set.js
var require_set = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/set.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function resolveYamlSet(data) {
      if (data === null) return true;
      var key, object = data;
      for (key in object) {
        if (_hasOwnProperty.call(object, key)) {
          if (object[key] !== null) return false;
        }
      }
      return true;
    }
    function constructYamlSet(data) {
      return data !== null ? data : {};
    }
    module2.exports = new Type("tag:yaml.org,2002:set", {
      kind: "mapping",
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/default_safe.js
var require_default_safe = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/default_safe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      include: [
        require_core()
      ],
      implicit: [
        require_timestamp(),
        require_merge()
      ],
      explicit: [
        require_binary(),
        require_omap(),
        require_pairs(),
        require_set()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/undefined.js
var require_undefined = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/undefined.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptUndefined() {
      return true;
    }
    function constructJavascriptUndefined() {
      return void 0;
    }
    function representJavascriptUndefined() {
      return "";
    }
    function isUndefined(object) {
      return typeof object === "undefined";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/undefined", {
      kind: "scalar",
      resolve: resolveJavascriptUndefined,
      construct: constructJavascriptUndefined,
      predicate: isUndefined,
      represent: representJavascriptUndefined
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/regexp.js
var require_regexp = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/regexp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveJavascriptRegExp(data) {
      if (data === null) return false;
      if (data.length === 0) return false;
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        if (modifiers.length > 3) return false;
        if (regexp[regexp.length - modifiers.length - 1] !== "/") return false;
      }
      return true;
    }
    function constructJavascriptRegExp(data) {
      var regexp = data, tail = /\/([gim]*)$/.exec(data), modifiers = "";
      if (regexp[0] === "/") {
        if (tail) modifiers = tail[1];
        regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
      }
      return new RegExp(regexp, modifiers);
    }
    function representJavascriptRegExp(object) {
      var result = "/" + object.source + "/";
      if (object.global) result += "g";
      if (object.multiline) result += "m";
      if (object.ignoreCase) result += "i";
      return result;
    }
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/regexp", {
      kind: "scalar",
      resolve: resolveJavascriptRegExp,
      construct: constructJavascriptRegExp,
      predicate: isRegExp,
      represent: representJavascriptRegExp
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/type/js/function.js
var require_function = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/type/js/function.js"(exports2, module2) {
    "use strict";
    var esprima;
    try {
      _require = require;
      esprima = _require("esprima");
    } catch (_) {
      if (typeof window !== "undefined") esprima = window.esprima;
    }
    var _require;
    var Type = require_type();
    function resolveJavascriptFunction(data) {
      if (data === null) return false;
      try {
        var source = "(" + data + ")", ast = esprima.parse(source, { range: true });
        if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    function constructJavascriptFunction(data) {
      var source = "(" + data + ")", ast = esprima.parse(source, { range: true }), params = [], body;
      if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement" || ast.body[0].expression.type !== "ArrowFunctionExpression" && ast.body[0].expression.type !== "FunctionExpression") {
        throw new Error("Failed to resolve function");
      }
      ast.body[0].expression.params.forEach(function(param) {
        params.push(param.name);
      });
      body = ast.body[0].expression.body.range;
      if (ast.body[0].expression.body.type === "BlockStatement") {
        return new Function(params, source.slice(body[0] + 1, body[1] - 1));
      }
      return new Function(params, "return " + source.slice(body[0], body[1]));
    }
    function representJavascriptFunction(object) {
      return object.toString();
    }
    function isFunction(object) {
      return Object.prototype.toString.call(object) === "[object Function]";
    }
    module2.exports = new Type("tag:yaml.org,2002:js/function", {
      kind: "scalar",
      resolve: resolveJavascriptFunction,
      construct: constructJavascriptFunction,
      predicate: isFunction,
      represent: representJavascriptFunction
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/schema/default_full.js
var require_default_full = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/schema/default_full.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = Schema.DEFAULT = new Schema({
      include: [
        require_default_safe()
      ],
      explicit: [
        require_undefined(),
        require_regexp(),
        require_function()
      ]
    });
  }
});

// node_modules/js-yaml/lib/js-yaml/loader.js
var require_loader = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/loader.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var Mark = require_mark();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CONTEXT_FLOW_IN = 1;
    var CONTEXT_FLOW_OUT = 2;
    var CONTEXT_BLOCK_IN = 3;
    var CONTEXT_BLOCK_OUT = 4;
    var CHOMPING_CLIP = 1;
    var CHOMPING_STRIP = 2;
    var CHOMPING_KEEP = 3;
    var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
    var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
    var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function is_EOL(c) {
      return c === 10 || c === 13;
    }
    function is_WHITE_SPACE(c) {
      return c === 9 || c === 32;
    }
    function is_WS_OR_EOL(c) {
      return c === 9 || c === 32 || c === 10 || c === 13;
    }
    function is_FLOW_INDICATOR(c) {
      return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
    }
    function fromHexCode(c) {
      var lc;
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      lc = c | 32;
      if (97 <= lc && lc <= 102) {
        return lc - 97 + 10;
      }
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 120) {
        return 2;
      }
      if (c === 117) {
        return 4;
      }
      if (c === 85) {
        return 8;
      }
      return 0;
    }
    function fromDecimalCode(c) {
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      return -1;
    }
    function simpleEscapeSequence(c) {
      return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
    }
    function charFromCodepoint(c) {
      if (c <= 65535) {
        return String.fromCharCode(c);
      }
      return String.fromCharCode(
        (c - 65536 >> 10) + 55296,
        (c - 65536 & 1023) + 56320
      );
    }
    var simpleEscapeCheck = new Array(256);
    var simpleEscapeMap = new Array(256);
    for (i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    var i;
    function State(input, options) {
      this.input = input;
      this.filename = options["filename"] || null;
      this.schema = options["schema"] || DEFAULT_FULL_SCHEMA;
      this.onWarning = options["onWarning"] || null;
      this.legacy = options["legacy"] || false;
      this.json = options["json"] || false;
      this.listener = options["listener"] || null;
      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap = this.schema.compiledTypeMap;
      this.length = input.length;
      this.position = 0;
      this.line = 0;
      this.lineStart = 0;
      this.lineIndent = 0;
      this.documents = [];
    }
    function generateError(state, message) {
      return new YAMLException(
        message,
        new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart)
      );
    }
    function throwError(state, message) {
      throw generateError(state, message);
    }
    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }
    var directiveHandlers = {
      YAML: function handleYamlDirective(state, name, args) {
        var match, major, minor;
        if (state.version !== null) {
          throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
          throwError(state, "YAML directive accepts exactly one argument");
        }
        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
          throwError(state, "ill-formed argument of the YAML directive");
        }
        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);
        if (major !== 1) {
          throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
          throwWarning(state, "unsupported YAML version of the document");
        }
      },
      TAG: function handleTagDirective(state, name, args) {
        var handle, prefix;
        if (args.length !== 2) {
          throwError(state, "TAG directive accepts exactly two arguments");
        }
        handle = args[0];
        prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        state.tagMap[handle] = prefix;
      }
    };
    function captureSegment(state, start, end, checkJson) {
      var _position, _length, _character, _result;
      if (start < end) {
        _result = state.input.slice(start, end);
        if (checkJson) {
          for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
            _character = _result.charCodeAt(_position);
            if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
              throwError(state, "expected valid JSON character");
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(_result)) {
          throwError(state, "the stream contains non-printable characters");
        }
        state.result += _result;
      }
    }
    function mergeMappings(state, destination, source, overridableKeys) {
      var sourceKeys, key, index, quantity;
      if (!common.isObject(source)) {
        throwError(state, "cannot merge mappings; the provided source object is unacceptable");
      }
      sourceKeys = Object.keys(source);
      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key = sourceKeys[index];
        if (!_hasOwnProperty.call(destination, key)) {
          destination[key] = source[key];
          overridableKeys[key] = true;
        }
      }
    }
    function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
      var index, quantity;
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
          if (Array.isArray(keyNode[index])) {
            throwError(state, "nested arrays are not supported inside keys");
          }
          if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
            keyNode[index] = "[object Object]";
          }
        }
      }
      if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
      }
      keyNode = String(keyNode);
      if (_result === null) {
        _result = {};
      }
      if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
          for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
            mergeMappings(state, _result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, _result, valueNode, overridableKeys);
        }
      } else {
        if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
          state.line = startLine || state.line;
          state.position = startPos || state.position;
          throwError(state, "duplicated mapping key");
        }
        _result[keyNode] = valueNode;
        delete overridableKeys[keyNode];
      }
      return _result;
    }
    function readLineBreak(state) {
      var ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 10) {
        state.position++;
      } else if (ch === 13) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) {
          state.position++;
        }
      } else {
        throwError(state, "a line break is expected");
      }
      state.line += 1;
      state.lineStart = state.position;
    }
    function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 10 && ch !== 13 && ch !== 0);
        }
        if (is_EOL(ch)) {
          readLineBreak(state);
          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;
          while (ch === 32) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }
      if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state) {
      var _position = state.position, ch;
      ch = state.input.charCodeAt(_position);
      if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || is_WS_OR_EOL(ch)) {
          return true;
        }
      }
      return false;
    }
    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += " ";
      } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
      }
    }
    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
      ch = state.input.charCodeAt(state.position);
      if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
        return false;
      }
      if (ch === 63 || ch === 45) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          return false;
        }
      }
      state.kind = "scalar";
      state.result = "";
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
      while (ch !== 0) {
        if (ch === 58) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
            break;
          }
        } else if (ch === 35) {
          preceding = state.input.charCodeAt(state.position - 1);
          if (is_WS_OR_EOL(preceding)) {
            break;
          }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
          break;
        } else if (is_EOL(ch)) {
          _line = state.line;
          _lineStart = state.lineStart;
          _lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);
          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = _line;
            state.lineStart = _lineStart;
            state.lineIndent = _lineIndent;
            break;
          }
        }
        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - _line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }
        if (!is_WHITE_SPACE(ch)) {
          captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, captureEnd, false);
      if (state.result) {
        return true;
      }
      state.kind = _kind;
      state.result = _result;
      return false;
    }
    function readSingleQuotedScalar(state, nodeIndent) {
      var ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 39) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 39) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (ch === 39) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a single quoted scalar");
    }
    function readDoubleQuotedScalar(state, nodeIndent) {
      var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 34) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 34) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;
        } else if (ch === 92) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (is_EOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;
          } else if ((tmp = escapedHexLen(ch)) > 0) {
            hexLength = tmp;
            hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);
              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;
              } else {
                throwError(state, "expected hexadecimal character");
              }
            }
            state.result += charFromCodepoint(hexResult);
            state.position++;
          } else {
            throwError(state, "unknown escape sequence");
          }
          captureStart = captureEnd = state.position;
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a double quoted scalar");
    }
    function readFlowCollection(state, nodeIndent) {
      var readNext = true, _line, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = {}, keyNode, keyTag, valueNode, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 91) {
        terminator = 93;
        isMapping = false;
        _result = [];
      } else if (ch === 123) {
        terminator = 125;
        isMapping = true;
        _result = {};
      } else {
        return false;
      }
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(++state.position);
      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
          state.position++;
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = isMapping ? "mapping" : "sequence";
          state.result = _result;
          return true;
        } else if (!readNext) {
          throwError(state, "missed comma between flow collection entries");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 63) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === _line) && ch === 58) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }
        if (isMapping) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
          _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
          _result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 44) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }
      throwError(state, "unexpected end of the stream within a flow collection");
    }
    function readBlockScalar(state, nodeIndent) {
      var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 124) {
        folding = false;
      } else if (ch === 62) {
        folding = true;
      } else {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
        if (ch === 43 || ch === 45) {
          if (CHOMPING_CLIP === chomping) {
            chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            throwError(state, "repeat of a chomping mode identifier");
          }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            throwError(state, "repeat of an indentation width identifier");
          }
        } else {
          break;
        }
      }
      if (is_WHITE_SPACE(ch)) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (is_WHITE_SPACE(ch));
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (!is_EOL(ch) && ch !== 0);
        }
      }
      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }
        if (is_EOL(ch)) {
          emptyLines++;
          continue;
        }
        if (state.lineIndent < textIndent) {
          if (chomping === CHOMPING_KEEP) {
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) {
              state.result += "\n";
            }
          }
          break;
        }
        if (folding) {
          if (is_WHITE_SPACE(ch)) {
            atMoreIndented = true;
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common.repeat("\n", emptyLines + 1);
          } else if (emptyLines === 0) {
            if (didReadContent) {
              state.result += " ";
            }
          } else {
            state.result += common.repeat("\n", emptyLines);
          }
        } else {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        captureStart = state.position;
        while (!is_EOL(ch) && ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
      }
      return true;
    }
    function readBlockSequence(state, nodeIndent) {
      var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (ch !== 45) {
          break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!is_WS_OR_EOL(following)) {
          break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            _result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        _result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
          throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "sequence";
        state.result = _result;
        return true;
      }
      return false;
    }
    function readBlockMapping(state, nodeIndent, flowIndent) {
      var following, allowCompact, _line, _pos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = {}, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        following = state.input.charCodeAt(state.position + 1);
        _line = state.line;
        _pos = state.position;
        if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
          if (ch === 63) {
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = true;
            allowCompact = true;
          } else if (atExplicitKey) {
            atExplicitKey = false;
            allowCompact = true;
          } else {
            throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
          }
          state.position += 1;
          ch = following;
        } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          if (state.line === _line) {
            ch = state.input.charCodeAt(state.position);
            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 58) {
              ch = state.input.charCodeAt(++state.position);
              if (!is_WS_OR_EOL(ch)) {
                throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
              }
              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;
            } else if (detected) {
              throwError(state, "can not read an implicit mapping pair; a colon is missed");
            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true;
            }
          } else if (detected) {
            throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else {
          break;
        }
        if (state.line === _line || state.lineIndent > nodeIndent) {
          if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }
          if (!atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
            keyTag = keyNode = valueNode = null;
          }
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }
        if (state.lineIndent > nodeIndent && ch !== 0) {
          throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "mapping";
        state.result = _result;
      }
      return detected;
    }
    function readTagProperty(state) {
      var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 33) return false;
      if (state.tag !== null) {
        throwError(state, "duplication of a tag property");
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      } else {
        tagHandle = "!";
      }
      _position = state.position;
      if (isVerbatim) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && ch !== 62);
        if (state.position < state.length) {
          tagName = state.input.slice(_position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          throwError(state, "unexpected end of the stream within a verbatim tag");
        }
      } else {
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          if (ch === 33) {
            if (!isNamed) {
              tagHandle = state.input.slice(_position - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                throwError(state, "named tag handle cannot contain such characters");
              }
              isNamed = true;
              _position = state.position + 1;
            } else {
              throwError(state, "tag suffix cannot contain exclamation marks");
            }
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(_position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          throwError(state, "tag suffix cannot contain flow indicator characters");
        }
      }
      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        throwError(state, "tag name cannot contain such characters: " + tagName);
      }
      if (isVerbatim) {
        state.tag = tagName;
      } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
      } else if (tagHandle === "!") {
        state.tag = "!" + tagName;
      } else if (tagHandle === "!!") {
        state.tag = "tag:yaml.org,2002:" + tagName;
      } else {
        throwError(state, 'undeclared tag handle "' + tagHandle + '"');
      }
      return true;
    }
    function readAnchorProperty(state) {
      var _position, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 38) return false;
      if (state.anchor !== null) {
        throwError(state, "duplication of an anchor property");
      }
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an anchor node must contain at least one character");
      }
      state.anchor = state.input.slice(_position, state.position);
      return true;
    }
    function readAlias(state) {
      var _position, alias, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 42) return false;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an alias node must contain at least one character");
      }
      alias = state.input.slice(_position, state.position);
      if (!_hasOwnProperty.call(state.anchorMap, alias)) {
        throwError(state, 'unidentified alias "' + alias + '"');
      }
      state.result = state.anchorMap[alias];
      skipSeparationSpace(state, true, -1);
      return true;
    }
    function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
      var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, type, flowIndent, blockIndent;
      if (state.listener !== null) {
        state.listener("open", state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }
      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }
      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }
      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
          flowIndent = parentIndent;
        } else {
          flowIndent = parentIndent + 1;
        }
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
            hasContent = true;
          } else {
            if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
              hasContent = true;
            } else if (readAlias(state)) {
              hasContent = true;
              if (state.tag !== null || state.anchor !== null) {
                throwError(state, "alias node should not have any properties");
              }
            } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
              hasContent = true;
              if (state.tag === null) {
                state.tag = "?";
              }
            }
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
      }
      if (state.tag !== null && state.tag !== "!") {
        if (state.tag === "?") {
          if (state.result !== null && state.kind !== "scalar") {
            throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
          }
          for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
            type = state.implicitTypes[typeIndex];
            if (type.resolve(state.result)) {
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
          type = state.typeMap[state.kind || "fallback"][state.tag];
          if (state.result !== null && type.kind !== state.kind) {
            throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
          }
          if (!type.resolve(state.result)) {
            throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
          } else {
            state.result = type.construct(state.result);
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else {
          throwError(state, "unknown tag !<" + state.tag + ">");
        }
      }
      if (state.listener !== null) {
        state.listener("close", state);
      }
      return state.tag !== null || state.anchor !== null || hasContent;
    }
    function readDocument(state) {
      var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 37) {
          break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(_position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
          throwError(state, "directive name must not be less than one character in length");
        }
        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 0 && !is_EOL(ch));
            break;
          }
          if (is_EOL(ch)) break;
          _position = state.position;
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveArgs.push(state.input.slice(_position, state.position));
        }
        if (ch !== 0) readLineBreak(state);
        if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](state, directiveName, directiveArgs);
        } else {
          throwWarning(state, 'unknown document directive "' + directiveName + '"');
        }
      }
      skipSeparationSpace(state, true, -1);
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
        throwError(state, "directives end mark is expected");
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 46) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }
      if (state.position < state.length - 1) {
        throwError(state, "end of the stream or a document separator is expected");
      } else {
        return;
      }
    }
    function loadDocuments(input, options) {
      input = String(input);
      options = options || {};
      if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
          input += "\n";
        }
        if (input.charCodeAt(0) === 65279) {
          input = input.slice(1);
        }
      }
      var state = new State(input, options);
      var nullpos = input.indexOf("\0");
      if (nullpos !== -1) {
        state.position = nullpos;
        throwError(state, "null byte is not allowed in input");
      }
      state.input += "\0";
      while (state.input.charCodeAt(state.position) === 32) {
        state.lineIndent += 1;
        state.position += 1;
      }
      while (state.position < state.length - 1) {
        readDocument(state);
      }
      return state.documents;
    }
    function loadAll(input, iterator, options) {
      if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
        options = iterator;
        iterator = null;
      }
      var documents = loadDocuments(input, options);
      if (typeof iterator !== "function") {
        return documents;
      }
      for (var index = 0, length = documents.length; index < length; index += 1) {
        iterator(documents[index]);
      }
    }
    function load(input, options) {
      var documents = loadDocuments(input, options);
      if (documents.length === 0) {
        return void 0;
      } else if (documents.length === 1) {
        return documents[0];
      }
      throw new YAMLException("expected a single document in the stream, but found more");
    }
    function safeLoadAll(input, iterator, options) {
      if (typeof iterator === "object" && iterator !== null && typeof options === "undefined") {
        options = iterator;
        iterator = null;
      }
      return loadAll(input, iterator, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
    }
    function safeLoad(input, options) {
      return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
    }
    module2.exports.loadAll = loadAll;
    module2.exports.load = load;
    module2.exports.safeLoadAll = safeLoadAll;
    module2.exports.safeLoad = safeLoad;
  }
});

// node_modules/js-yaml/lib/js-yaml/dumper.js
var require_dumper = __commonJS({
  "node_modules/js-yaml/lib/js-yaml/dumper.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var DEFAULT_FULL_SCHEMA = require_default_full();
    var DEFAULT_SAFE_SCHEMA = require_default_safe();
    var _toString = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CHAR_TAB = 9;
    var CHAR_LINE_FEED = 10;
    var CHAR_CARRIAGE_RETURN = 13;
    var CHAR_SPACE = 32;
    var CHAR_EXCLAMATION = 33;
    var CHAR_DOUBLE_QUOTE = 34;
    var CHAR_SHARP = 35;
    var CHAR_PERCENT = 37;
    var CHAR_AMPERSAND = 38;
    var CHAR_SINGLE_QUOTE = 39;
    var CHAR_ASTERISK = 42;
    var CHAR_COMMA = 44;
    var CHAR_MINUS = 45;
    var CHAR_COLON = 58;
    var CHAR_EQUALS = 61;
    var CHAR_GREATER_THAN = 62;
    var CHAR_QUESTION = 63;
    var CHAR_COMMERCIAL_AT = 64;
    var CHAR_LEFT_SQUARE_BRACKET = 91;
    var CHAR_RIGHT_SQUARE_BRACKET = 93;
    var CHAR_GRAVE_ACCENT = 96;
    var CHAR_LEFT_CURLY_BRACKET = 123;
    var CHAR_VERTICAL_LINE = 124;
    var CHAR_RIGHT_CURLY_BRACKET = 125;
    var ESCAPE_SEQUENCES = {};
    ESCAPE_SEQUENCES[0] = "\\0";
    ESCAPE_SEQUENCES[7] = "\\a";
    ESCAPE_SEQUENCES[8] = "\\b";
    ESCAPE_SEQUENCES[9] = "\\t";
    ESCAPE_SEQUENCES[10] = "\\n";
    ESCAPE_SEQUENCES[11] = "\\v";
    ESCAPE_SEQUENCES[12] = "\\f";
    ESCAPE_SEQUENCES[13] = "\\r";
    ESCAPE_SEQUENCES[27] = "\\e";
    ESCAPE_SEQUENCES[34] = '\\"';
    ESCAPE_SEQUENCES[92] = "\\\\";
    ESCAPE_SEQUENCES[133] = "\\N";
    ESCAPE_SEQUENCES[160] = "\\_";
    ESCAPE_SEQUENCES[8232] = "\\L";
    ESCAPE_SEQUENCES[8233] = "\\P";
    var DEPRECATED_BOOLEANS_SYNTAX = [
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    function compileStyleMap(schema, map) {
      var result, keys, index, length, tag2, style, type;
      if (map === null) return {};
      result = {};
      keys = Object.keys(map);
      for (index = 0, length = keys.length; index < length; index += 1) {
        tag2 = keys[index];
        style = String(map[tag2]);
        if (tag2.slice(0, 2) === "!!") {
          tag2 = "tag:yaml.org,2002:" + tag2.slice(2);
        }
        type = schema.compiledTypeMap["fallback"][tag2];
        if (type && _hasOwnProperty.call(type.styleAliases, style)) {
          style = type.styleAliases[style];
        }
        result[tag2] = style;
      }
      return result;
    }
    function encodeHex(character) {
      var string, handle, length;
      string = character.toString(16).toUpperCase();
      if (character <= 255) {
        handle = "x";
        length = 2;
      } else if (character <= 65535) {
        handle = "u";
        length = 4;
      } else if (character <= 4294967295) {
        handle = "U";
        length = 8;
      } else {
        throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
      }
      return "\\" + handle + common.repeat("0", length - string.length) + string;
    }
    function State(options) {
      this.schema = options["schema"] || DEFAULT_FULL_SCHEMA;
      this.indent = Math.max(1, options["indent"] || 2);
      this.noArrayIndent = options["noArrayIndent"] || false;
      this.skipInvalid = options["skipInvalid"] || false;
      this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
      this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
      this.sortKeys = options["sortKeys"] || false;
      this.lineWidth = options["lineWidth"] || 80;
      this.noRefs = options["noRefs"] || false;
      this.noCompatMode = options["noCompatMode"] || false;
      this.condenseFlow = options["condenseFlow"] || false;
      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;
      this.tag = null;
      this.result = "";
      this.duplicates = [];
      this.usedDuplicates = null;
    }
    function indentString(string, spaces) {
      var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n") result += ind;
        result += line;
      }
      return result;
    }
    function generateNextLine(state, level) {
      return "\n" + common.repeat(" ", state.indent * level);
    }
    function testImplicitResolving(state, str) {
      var index, length, type;
      for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
        type = state.implicitTypes[index];
        if (type.resolve(str)) {
          return true;
        }
      }
      return false;
    }
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }
    function isPrintable(c) {
      return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== 65279 || 65536 <= c && c <= 1114111;
    }
    function isNsChar(c) {
      return isPrintable(c) && !isWhitespace(c) && c !== 65279 && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
    }
    function isPlainSafe(c, prev) {
      return isPrintable(c) && c !== 65279 && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_COLON && (c !== CHAR_SHARP || prev && isNsChar(prev));
    }
    function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== 65279 && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
    }
    function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }
    var STYLE_PLAIN = 1;
    var STYLE_SINGLE = 2;
    var STYLE_LITERAL = 3;
    var STYLE_FOLDED = 4;
    var STYLE_DOUBLE = 5;
    function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char, prev_char;
      var hasLineBreak = false;
      var hasFoldableLine = false;
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1;
      var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
      if (singleLineOnly) {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
      } else {
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
              i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
      }
      if (!hasLineBreak && !hasFoldableLine) {
        return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
      }
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    function writeScalar(state, string, level, iskey) {
      state.dump = function() {
        if (string.length === 0) {
          return "''";
        }
        if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
          return "'" + string + "'";
        }
        var indent = state.indent * Math.max(1, level);
        var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(string2) {
          return testImplicitResolving(state, string2);
        }
        switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return "'" + string.replace(/'/g, "''") + "'";
          case STYLE_LITERAL:
            return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
          case STYLE_FOLDED:
            return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
          case STYLE_DOUBLE:
            return '"' + escapeString(string, lineWidth) + '"';
          default:
            throw new YAMLException("impossible error: invalid scalar style");
        }
      }();
    }
    function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
      var clip = string[string.length - 1] === "\n";
      var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
      var chomp = keep ? "+" : clip ? "" : "-";
      return indentIndicator + chomp + "\n";
    }
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    function foldString(string, width) {
      var lineRe = /(\n+)([^\n]*)/g;
      var result = function() {
        var nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
      }();
      var prevMoreIndented = string[0] === "\n" || string[0] === " ";
      var moreIndented;
      var match;
      while (match = lineRe.exec(string)) {
        var prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    function foldLine(line, width) {
      if (line === "" || line[0] === " ") return line;
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = "";
      while (match = breakRe.exec(line)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += "\n" + line.slice(start, end);
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line.length - start > width && curr > start) {
        result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
      } else {
        result += line.slice(start);
      }
      return result.slice(1);
    }
    function escapeString(string) {
      var result = "";
      var char, nextChar;
      var escapeSeq;
      for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        if (char >= 55296 && char <= 56319) {
          nextChar = string.charCodeAt(i + 1);
          if (nextChar >= 56320 && nextChar <= 57343) {
            result += encodeHex((char - 55296) * 1024 + nextChar - 56320 + 65536);
            i++;
            continue;
          }
        }
        escapeSeq = ESCAPE_SEQUENCES[char];
        result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
      }
      return result;
    }
    function writeFlowSequence(state, level, object) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level, object[index], false, false)) {
          if (index !== 0) _result += "," + (!state.condenseFlow ? " " : "");
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = "[" + _result + "]";
    }
    function writeBlockSequence(state, level, object, compact) {
      var _result = "", _tag = state.tag, index, length;
      for (index = 0, length = object.length; index < length; index += 1) {
        if (writeNode(state, level + 1, object[index], true, true)) {
          if (!compact || index !== 0) {
            _result += generateNextLine(state, level);
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += "-";
          } else {
            _result += "- ";
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = _result || "[]";
    }
    function writeFlowMapping(state, level, object) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (index !== 0) pairBuffer += ", ";
        if (state.condenseFlow) pairBuffer += '"';
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level, objectKey, false, false)) {
          continue;
        }
        if (state.dump.length > 1024) pairBuffer += "? ";
        pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
        if (!writeNode(state, level, objectValue, false, false)) {
          continue;
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = "{" + _result + "}";
    }
    function writeBlockMapping(state, level, object, compact) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
      if (state.sortKeys === true) {
        objectKeyList.sort();
      } else if (typeof state.sortKeys === "function") {
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        throw new YAMLException("sortKeys must be a boolean or a function");
      }
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (!compact || index !== 0) {
          pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue;
        }
        explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += "?";
          } else {
            pairBuffer += "? ";
          }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue;
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ":";
        } else {
          pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || "{}";
    }
    function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;
      typeList = explicit ? state.explicitTypes : state.implicitTypes;
      for (index = 0, length = typeList.length; index < length; index += 1) {
        type = typeList[index];
        if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
          state.tag = explicit ? type.tag : "?";
          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;
            if (_toString.call(type.represent) === "[object Function]") {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
            }
            state.dump = _result;
          }
          return true;
        }
      }
      return false;
    }
    function writeNode(state, level, object, block, compact, iskey) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }
      var type = _toString.call(state.dump);
      if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
      }
      var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }
      if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
        compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = "*ref_" + duplicateIndex;
      } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
          if (block && Object.keys(state.dump).length !== 0) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object Array]") {
          var arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
          if (block && state.dump.length !== 0) {
            writeBlockSequence(state, arrayLevel, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowSequence(state, arrayLevel, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object String]") {
          if (state.tag !== "?") {
            writeScalar(state, state.dump, level, iskey);
          }
        } else {
          if (state.skipInvalid) return false;
          throw new YAMLException("unacceptable kind of an object to dump " + type);
        }
        if (state.tag !== null && state.tag !== "?") {
          state.dump = "!<" + state.tag + "> " + state.dump;
        }
      }
      return true;
    }
    function getDuplicateReferences(object, state) {
      var objects = [], duplicatesIndexes = [], index, length;
      inspectNode(object, objects, duplicatesIndexes);
      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }
    function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList, index, length;
      if (object !== null && typeof object === "object") {
        index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);
          if (Array.isArray(object)) {
            for (index = 0, length = object.length; index < length; index += 1) {
              inspectNode(object[index], objects, duplicatesIndexes);
            }
          } else {
            objectKeyList = Object.keys(object);
            for (index = 0, length = objectKeyList.length; index < length; index += 1) {
              inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
            }
          }
        }
      }
    }
    function dump(input, options) {
      options = options || {};
      var state = new State(options);
      if (!state.noRefs) getDuplicateReferences(input, state);
      if (writeNode(state, 0, input, true, true)) return state.dump + "\n";
      return "";
    }
    function safeDump(input, options) {
      return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
    }
    module2.exports.dump = dump;
    module2.exports.safeDump = safeDump;
  }
});

// node_modules/js-yaml/lib/js-yaml.js
var require_js_yaml = __commonJS({
  "node_modules/js-yaml/lib/js-yaml.js"(exports2, module2) {
    "use strict";
    var loader = require_loader();
    var dumper = require_dumper();
    function deprecated(name) {
      return function() {
        throw new Error("Function " + name + " is deprecated and cannot be used.");
      };
    }
    module2.exports.Type = require_type();
    module2.exports.Schema = require_schema();
    module2.exports.FAILSAFE_SCHEMA = require_failsafe();
    module2.exports.JSON_SCHEMA = require_json();
    module2.exports.CORE_SCHEMA = require_core();
    module2.exports.DEFAULT_SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_FULL_SCHEMA = require_default_full();
    module2.exports.load = loader.load;
    module2.exports.loadAll = loader.loadAll;
    module2.exports.safeLoad = loader.safeLoad;
    module2.exports.safeLoadAll = loader.safeLoadAll;
    module2.exports.dump = dumper.dump;
    module2.exports.safeDump = dumper.safeDump;
    module2.exports.YAMLException = require_exception();
    module2.exports.MINIMAL_SCHEMA = require_failsafe();
    module2.exports.SAFE_SCHEMA = require_default_safe();
    module2.exports.DEFAULT_SCHEMA = require_default_full();
    module2.exports.scan = deprecated("scan");
    module2.exports.parse = deprecated("parse");
    module2.exports.compose = deprecated("compose");
    module2.exports.addConstructor = deprecated("addConstructor");
  }
});

// node_modules/js-yaml/index.js
var require_js_yaml2 = __commonJS({
  "node_modules/js-yaml/index.js"(exports2, module2) {
    "use strict";
    var yaml2 = require_js_yaml();
    module2.exports = yaml2;
  }
});

// node_modules/front-matter/index.js
var require_front_matter = __commonJS({
  "node_modules/front-matter/index.js"(exports2, module2) {
    var parser = require_js_yaml2();
    var optionalByteOrderMark = "\\ufeff?";
    var platform = typeof process !== "undefined" ? process.platform : "";
    var pattern = "^(" + optionalByteOrderMark + "(= yaml =|---)$([\\s\\S]*?)^(?:\\2|\\.\\.\\.)\\s*$" + (platform === "win32" ? "\\r?" : "") + "(?:\\n)?)";
    var regex = new RegExp(pattern, "m");
    module2.exports = extractor;
    module2.exports.test = test;
    function extractor(string, options) {
      string = string || "";
      var defaultOptions = { allowUnsafe: false };
      options = options instanceof Object ? { ...defaultOptions, ...options } : defaultOptions;
      options.allowUnsafe = Boolean(options.allowUnsafe);
      var lines = string.split(/(\r?\n)/);
      if (lines[0] && /= yaml =|---/.test(lines[0])) {
        return parse(string, options.allowUnsafe);
      } else {
        return {
          attributes: {},
          body: string,
          bodyBegin: 1
        };
      }
    }
    function computeLocation(match, body) {
      var line = 1;
      var pos = body.indexOf("\n");
      var offset = match.index + match[0].length;
      while (pos !== -1) {
        if (pos >= offset) {
          return line;
        }
        line++;
        pos = body.indexOf("\n", pos + 1);
      }
      return line;
    }
    function parse(string, allowUnsafe) {
      var match = regex.exec(string);
      if (!match) {
        return {
          attributes: {},
          body: string,
          bodyBegin: 1
        };
      }
      var loader = allowUnsafe ? parser.load : parser.safeLoad;
      var yaml2 = match[match.length - 1].replace(/^\s+|\s+$/g, "");
      var attributes = loader(yaml2) || {};
      var body = string.replace(match[0], "");
      var line = computeLocation(match, string);
      return {
        attributes,
        body,
        bodyBegin: line,
        frontmatter: yaml2
      };
    }
    function test(string) {
      string = string || "";
      return regex.test(string);
    }
  }
});

// node_modules/marked/src/defaults.js
var require_defaults = __commonJS({
  "node_modules/marked/src/defaults.js"(exports2, module2) {
    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        gfm: true,
        headerIds: true,
        headerPrefix: "",
        highlight: null,
        langPrefix: "language-",
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }
    function changeDefaults(newDefaults) {
      module2.exports.defaults = newDefaults;
    }
    module2.exports = {
      defaults: getDefaults(),
      getDefaults,
      changeDefaults
    };
  }
});

// node_modules/marked/src/helpers.js
var require_helpers = __commonJS({
  "node_modules/marked/src/helpers.js"(exports2, module2) {
    var escapeTest = /[&<>"']/;
    var escapeReplace = /[&<>"']/g;
    var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    var escapeReplacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }
      return html;
    }
    var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
    function unescape(html) {
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === "colon") return ":";
        if (n.charAt(0) === "#") {
          return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
        }
        return "";
      });
    }
    var caret = /(^|[^\[])\^/g;
    function edit(regex, opt) {
      regex = regex.source || regex;
      opt = opt || "";
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, "$1");
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }
    var nonWordAndColonTest = /[^\w:]/g;
    var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, "%");
      } catch (e) {
        return null;
      }
      return href;
    }
    var baseUrls = {};
    var justDomain = /^[^:]+:\/*[^/]*$/;
    var protocol = /^([^:]+:)[\s\S]*$/;
    var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
    function resolveUrl(base, href) {
      if (!baseUrls[" " + base]) {
        if (justDomain.test(base)) {
          baseUrls[" " + base] = base + "/";
        } else {
          baseUrls[" " + base] = rtrim(base, "/", true);
        }
      }
      base = baseUrls[" " + base];
      const relativeBase = base.indexOf(":") === -1;
      if (href.substring(0, 2) === "//") {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, "$1") + href;
      } else if (href.charAt(0) === "/") {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, "$1") + href;
      } else {
        return base + href;
      }
    }
    var noopTest = { exec: function noopTest2() {
    } };
    function merge(obj) {
      let i = 1, target, key;
      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }
      return obj;
    }
    function splitCells(tableRow, count) {
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
        let escaped = false, curr = offset;
        while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
        if (escaped) {
          return "|";
        } else {
          return " |";
        }
      }), cells = row.split(/ \|/);
      let i = 0;
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push("");
      }
      for (; i < cells.length; i++) {
        cells[i] = cells[i].trim().replace(/\\\|/g, "|");
      }
      return cells;
    }
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return "";
      }
      let suffLen = 0;
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }
      return str.substr(0, l - suffLen);
    }
    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0, i = 0;
      for (; i < l; i++) {
        if (str[i] === "\\") {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }
    function checkSanitizeDeprecation(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
      }
    }
    function repeatString(pattern, count) {
      if (count < 1) {
        return "";
      }
      let result = "";
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }
    module2.exports = {
      escape,
      unescape,
      edit,
      cleanUrl,
      resolveUrl,
      noopTest,
      merge,
      splitCells,
      rtrim,
      findClosingBracket,
      checkSanitizeDeprecation,
      repeatString
    };
  }
});

// node_modules/marked/src/Tokenizer.js
var require_Tokenizer = __commonJS({
  "node_modules/marked/src/Tokenizer.js"(exports2, module2) {
    var { defaults } = require_defaults();
    var {
      rtrim,
      splitCells,
      escape,
      findClosingBracket
    } = require_helpers();
    function outputLink(cap, link, raw) {
      const href = link.href;
      const title = link.title ? escape(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, "$1");
      if (cap[0].charAt(0) !== "!") {
        return {
          type: "link",
          raw,
          href,
          title,
          text
        };
      } else {
        return {
          type: "image",
          raw,
          href,
          title,
          text: escape(text)
        };
      }
    }
    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
      if (matchIndentToCode === null) {
        return text;
      }
      const indentToCode = matchIndentToCode[1];
      return text.split("\n").map((node) => {
        const matchIndentInNode = node.match(/^\s+/);
        if (matchIndentInNode === null) {
          return node;
        }
        const [indentInNode] = matchIndentInNode;
        if (indentInNode.length >= indentToCode.length) {
          return node.slice(indentToCode.length);
        }
        return node;
      }).join("\n");
    }
    module2.exports = class Tokenizer {
      constructor(options) {
        this.options = options || defaults;
      }
      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: "space",
              raw: cap[0]
            };
          }
          return { raw: "\n" };
        }
      }
      code(src, tokens) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "paragraph") {
            return {
              raw: cap[0],
              text: cap[0].trimRight()
            };
          }
          const text = cap[0].replace(/^ {1,4}/gm, "");
          return {
            type: "code",
            raw: cap[0],
            codeBlockStyle: "indented",
            text: !this.options.pedantic ? rtrim(text, "\n") : text
          };
        }
      }
      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || "");
          return {
            type: "code",
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      }
      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, "#");
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              text = trimmed.trim();
            }
          }
          return {
            type: "heading",
            raw: cap[0],
            depth: cap[1].length,
            text
          };
        }
      }
      nptable(src) {
        const cap = this.rules.block.nptable.exec(src);
        if (cap) {
          const item = {
            type: "table",
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
            align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : [],
            raw: cap[0]
          };
          if (item.header.length === item.align.length) {
            let l = item.align.length;
            let i;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = "right";
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = "center";
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = "left";
              } else {
                item.align[i] = null;
              }
            }
            l = item.cells.length;
            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(item.cells[i], item.header.length);
            }
            return item;
          }
        }
      }
      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: "hr",
            raw: cap[0]
          };
        }
      }
      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *> ?/gm, "");
          return {
            type: "blockquote",
            raw: cap[0],
            text
          };
        }
      }
      list(src) {
        const cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw = cap[0];
          const bull = cap[2];
          const isordered = bull.length > 1;
          const list = {
            type: "list",
            raw,
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : "",
            loose: false,
            items: []
          };
          const itemMatch = cap[0].match(this.rules.block.item);
          let next = false, item, space, bcurr, bnext, addBack, loose, istask, ischecked;
          let l = itemMatch.length;
          bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);
          for (let i = 0; i < l; i++) {
            item = itemMatch[i];
            raw = item;
            if (i !== l - 1) {
              bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);
              if (!this.options.pedantic ? bnext[1].length > bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
                itemMatch.splice(i, 2, itemMatch[i] + "\n" + itemMatch[i + 1]);
                i--;
                l--;
                continue;
              } else {
                if (
                  // different bullet style
                  !this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)
                ) {
                  addBack = itemMatch.slice(i + 1).join("\n");
                  list.raw = list.raw.substring(0, list.raw.length - addBack.length);
                  i = l - 1;
                }
              }
              bcurr = bnext;
            }
            space = item.length;
            item = item.replace(/^ *([*+-]|\d+[.)]) ?/, "");
            if (~item.indexOf("\n ")) {
              space -= item.length;
              item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
            }
            loose = next || /\n\n(?!\s*$)/.test(item);
            if (i !== l - 1) {
              next = item.charAt(item.length - 1) === "\n";
              if (!loose) loose = next;
            }
            if (loose) {
              list.loose = true;
            }
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.test(item);
              ischecked = void 0;
              if (istask) {
                ischecked = item[1] !== " ";
                item = item.replace(/^\[[ xX]\] +/, "");
              }
            }
            list.items.push({
              type: "list_item",
              raw,
              task: istask,
              checked: ischecked,
              loose,
              text: item
            });
          }
          return list;
        }
      }
      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          return {
            type: this.options.sanitize ? "paragraph" : "html",
            raw: cap[0],
            pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
          };
        }
      }
      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag2 = cap[1].toLowerCase().replace(/\s+/g, " ");
          return {
            tag: tag2,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }
      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: "table",
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
            align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
          };
          if (item.header.length === item.align.length) {
            item.raw = cap[0];
            let l = item.align.length;
            let i;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = "right";
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = "center";
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = "left";
              } else {
                item.align[i] = null;
              }
            }
            l = item.cells.length;
            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(
                item.cells[i].replace(/^ *\| *| *\| *$/g, ""),
                item.header.length
              );
            }
            return item;
          }
        }
      }
      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          return {
            type: "heading",
            raw: cap[0],
            depth: cap[2].charAt(0) === "=" ? 1 : 2,
            text: cap[1]
          };
        }
      }
      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          return {
            type: "paragraph",
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1]
          };
        }
      }
      text(src, tokens) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          const lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            return {
              raw: cap[0],
              text: cap[0]
            };
          }
          return {
            type: "text",
            raw: cap[0],
            text: cap[0]
          };
        }
      }
      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: "escape",
            raw: cap[0],
            text: escape(cap[1])
          };
        }
      }
      tag(src, inLink, inRawBlock) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!inLink && /^<a /i.test(cap[0])) {
            inLink = true;
          } else if (inLink && /^<\/a>/i.test(cap[0])) {
            inLink = false;
          }
          if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = true;
          } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = false;
          }
          return {
            type: this.options.sanitize ? "text" : "html",
            raw: cap[0],
            inLink,
            inRawBlock,
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
          };
        }
      }
      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            if (!/>$/.test(trimmedUrl)) {
              return;
            }
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            const lastParenIndex = findClosingBracket(cap[2], "()");
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf("!") === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = "";
            }
          }
          let href = cap[2];
          let title = "";
          if (this.options.pedantic) {
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : "";
          }
          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
            title: title ? title.replace(this.rules.inline._escapes, "$1") : title
          }, cap[0]);
        }
      }
      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: "text",
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0]);
        }
      }
      strong(src, maskedSrc, prevChar = "") {
        let match = this.rules.inline.strong.start.exec(src);
        if (match && (!match[1] || match[1] && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar)))) {
          maskedSrc = maskedSrc.slice(-1 * src.length);
          const endReg = match[0] === "**" ? this.rules.inline.strong.endAst : this.rules.inline.strong.endUnd;
          endReg.lastIndex = 0;
          let cap;
          while ((match = endReg.exec(maskedSrc)) != null) {
            cap = this.rules.inline.strong.middle.exec(maskedSrc.slice(0, match.index + 3));
            if (cap) {
              return {
                type: "strong",
                raw: src.slice(0, cap[0].length),
                text: src.slice(2, cap[0].length - 2)
              };
            }
          }
        }
      }
      em(src, maskedSrc, prevChar = "") {
        let match = this.rules.inline.em.start.exec(src);
        if (match && (!match[1] || match[1] && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar)))) {
          maskedSrc = maskedSrc.slice(-1 * src.length);
          const endReg = match[0] === "*" ? this.rules.inline.em.endAst : this.rules.inline.em.endUnd;
          endReg.lastIndex = 0;
          let cap;
          while ((match = endReg.exec(maskedSrc)) != null) {
            cap = this.rules.inline.em.middle.exec(maskedSrc.slice(0, match.index + 2));
            if (cap) {
              return {
                type: "em",
                raw: src.slice(0, cap[0].length),
                text: src.slice(1, cap[0].length - 1)
              };
            }
          }
        }
      }
      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, " ");
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape(text, true);
          return {
            type: "codespan",
            raw: cap[0],
            text
          };
        }
      }
      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: "br",
            raw: cap[0]
          };
        }
      }
      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: "del",
            raw: cap[0],
            text: cap[2]
          };
        }
      }
      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === "@") {
            text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = "mailto:" + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }
          return {
            type: "link",
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: "text",
                raw: text,
                text
              }
            ]
          };
        }
      }
      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === "@") {
            text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = "mailto:" + text;
          } else {
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === "www.") {
              href = "http://" + text;
            } else {
              href = text;
            }
          }
          return {
            type: "link",
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: "text",
                raw: text,
                text
              }
            ]
          };
        }
      }
      inlineText(src, inRawBlock, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (inRawBlock) {
            text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
          } else {
            text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: "text",
            raw: cap[0],
            text
          };
        }
      }
    };
  }
});

// node_modules/marked/src/rules.js
var require_rules = __commonJS({
  "node_modules/marked/src/rules.js"(exports2, module2) {
    var {
      noopTest,
      edit,
      merge
    } = require_helpers();
    var block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
      html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: noopTest,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };
    block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
    block.item = edit(block.item, "gm").replace(/bull/g, block.bullet).getRegex();
    block.listItemStart = edit(/^( *)(bull)/).replace("bull", block.bullet).getRegex();
    block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
    block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
    block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
    block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
    block.normal = merge({}, block);
    block.gfm = merge({}, block.normal, {
      nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
      // Cells
      table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
      // Cells
    });
    block.gfm.nptable = edit(block.gfm.nptable).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
    block.gfm.table = edit(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
    block.pedantic = merge({}, block.normal, {
      html: edit(
        `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
      ).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest,
      // fences not supported
      paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
    });
    var inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
      // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      reflinkSearch: "reflink|nolink(?!\\()",
      strong: {
        start: /^(?:(\*\*(?=[*punctuation]))|\*\*)(?![\s])|__/,
        // (1) returns if starts w/ punctuation
        middle: /^\*\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*\*$|^__(?![\s])((?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?)__$/,
        endAst: /[^punctuation\s]\*\*(?!\*)|[punctuation]\*\*(?!\*)(?:(?=[punctuation_\s]|$))/,
        // last char can't be punct, or final * must also be followed by punct (or endline)
        endUnd: /[^\s]__(?!_)(?:(?=[punctuation*\s])|$)/
        // last char can't be a space, and final _ must preceed punct or \s (or endline)
      },
      em: {
        start: /^(?:(\*(?=[punctuation]))|\*)(?![*\s])|_/,
        // (1) returns if starts w/ punctuation
        middle: /^\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*$|^_(?![_\s])(?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?_$/,
        endAst: /[^punctuation\s]\*(?!\*)|[punctuation]\*(?!\*)(?:(?=[punctuation_\s]|$))/,
        // last char can't be punct, or final * must also be followed by punct (or endline)
        endUnd: /[^\s]_(?!_)(?:(?=[punctuation*\s])|$)/
        // last char can't be a space, and final _ must preceed punct or \s (or endline)
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\s*punctuation])/
    };
    inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
    inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
    inline._blockSkip = "\\[[^\\]]*?\\]\\([^\\)]*?\\)|`[^`]*?`|<[^>]*?>";
    inline._overlapSkip = "__[^_]*?__|\\*\\*\\[^\\*\\]*?\\*\\*";
    inline._comment = edit(block._comment).replace("(?:-->|$)", "-->").getRegex();
    inline.em.start = edit(inline.em.start).replace(/punctuation/g, inline._punctuation).getRegex();
    inline.em.middle = edit(inline.em.middle).replace(/punctuation/g, inline._punctuation).replace(/overlapSkip/g, inline._overlapSkip).getRegex();
    inline.em.endAst = edit(inline.em.endAst, "g").replace(/punctuation/g, inline._punctuation).getRegex();
    inline.em.endUnd = edit(inline.em.endUnd, "g").replace(/punctuation/g, inline._punctuation).getRegex();
    inline.strong.start = edit(inline.strong.start).replace(/punctuation/g, inline._punctuation).getRegex();
    inline.strong.middle = edit(inline.strong.middle).replace(/punctuation/g, inline._punctuation).replace(/overlapSkip/g, inline._overlapSkip).getRegex();
    inline.strong.endAst = edit(inline.strong.endAst, "g").replace(/punctuation/g, inline._punctuation).getRegex();
    inline.strong.endUnd = edit(inline.strong.endUnd, "g").replace(/punctuation/g, inline._punctuation).getRegex();
    inline.blockSkip = edit(inline._blockSkip, "g").getRegex();
    inline.overlapSkip = edit(inline._overlapSkip, "g").getRegex();
    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
    inline.tag = edit(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
    inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
    inline.reflink = edit(inline.reflink).replace("label", inline._label).getRegex();
    inline.reflinkSearch = edit(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
    inline.normal = merge({}, inline);
    inline.pedantic = merge({}, inline.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
    });
    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace("])", "~|])").getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
    });
    inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace("{2,}", "*").getRegex(),
      text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    });
    module2.exports = {
      block,
      inline
    };
  }
});

// node_modules/marked/src/Lexer.js
var require_Lexer = __commonJS({
  "node_modules/marked/src/Lexer.js"(exports2, module2) {
    var Tokenizer = require_Tokenizer();
    var { defaults } = require_defaults();
    var { block, inline } = require_rules();
    var { repeatString } = require_helpers();
    function smartypants(text) {
      return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
    }
    function mangle(text) {
      let out = "", i, ch;
      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = "x" + ch.toString(16);
        }
        out += "&#" + ch + ";";
      }
      return out;
    }
    module2.exports = class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = /* @__PURE__ */ Object.create(null);
        this.options = options || defaults;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        const rules = {
          block: block.normal,
          inline: inline.normal
        };
        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }
      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }
      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }
      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }
      /**
       * Preprocessing
       */
      lex(src) {
        src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ");
        this.blockTokens(src, this.tokens, true);
        this.inline(this.tokens);
        return this.tokens;
      }
      /**
       * Lexing
       */
      blockTokens(src, tokens = [], top = true) {
        if (this.options.pedantic) {
          src = src.replace(/^ +$/gm, "");
        }
        let token, i, l, lastToken;
        while (src) {
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            }
            continue;
          }
          if (token = this.tokenizer.code(src, tokens)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            } else {
              lastToken = tokens[tokens.length - 1];
              lastToken.raw += "\n" + token.raw;
              lastToken.text += "\n" + token.text;
            }
            continue;
          }
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.nptable(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.blockTokens(token.text, [], top);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            l = token.items.length;
            for (i = 0; i < l; i++) {
              token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
            }
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (top && (token = this.tokenizer.def(src))) {
            src = src.substring(token.raw.length);
            if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (top && (token = this.tokenizer.paragraph(src))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.text(src, tokens)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            } else {
              lastToken = tokens[tokens.length - 1];
              lastToken.raw += "\n" + token.raw;
              lastToken.text += "\n" + token.text;
            }
            continue;
          }
          if (src) {
            const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }
        return tokens;
      }
      inline(tokens) {
        let i, j, k, l2, row, token;
        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          switch (token.type) {
            case "paragraph":
            case "text":
            case "heading": {
              token.tokens = [];
              this.inlineTokens(token.text, token.tokens);
              break;
            }
            case "table": {
              token.tokens = {
                header: [],
                cells: []
              };
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                token.tokens.header[j] = [];
                this.inlineTokens(token.header[j], token.tokens.header[j]);
              }
              l2 = token.cells.length;
              for (j = 0; j < l2; j++) {
                row = token.cells[j];
                token.tokens.cells[j] = [];
                for (k = 0; k < row.length; k++) {
                  token.tokens.cells[j][k] = [];
                  this.inlineTokens(row[k], token.tokens.cells[j][k]);
                }
              }
              break;
            }
            case "blockquote": {
              this.inline(token.tokens);
              break;
            }
            case "list": {
              l2 = token.items.length;
              for (j = 0; j < l2; j++) {
                this.inline(token.items[j].tokens);
              }
              break;
            }
            default: {
            }
          }
        }
        return tokens;
      }
      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = [], inLink = false, inRawBlock = false) {
        let token;
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }
        while (src) {
          if (!keepPrevChar) {
            prevChar = "";
          }
          keepPrevChar = false;
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
            src = src.substring(token.raw.length);
            inLink = token.inLink;
            inRawBlock = token.inRawBlock;
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            if (token.type === "link") {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
            }
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            if (token.type === "link") {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
            }
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.strong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.em(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (!inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.inlineText(src, inRawBlock, smartypants)) {
            src = src.substring(token.raw.length);
            prevChar = token.raw.slice(-1);
            keepPrevChar = true;
            tokens.push(token);
            continue;
          }
          if (src) {
            const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }
        return tokens;
      }
    };
  }
});

// node_modules/marked/src/Renderer.js
var require_Renderer = __commonJS({
  "node_modules/marked/src/Renderer.js"(exports2, module2) {
    var { defaults } = require_defaults();
    var {
      cleanUrl,
      escape
    } = require_helpers();
    module2.exports = class Renderer {
      constructor(options) {
        this.options = options || defaults;
      }
      code(code, infostring, escaped) {
        const lang = (infostring || "").match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }
        code = code.replace(/\n$/, "") + "\n";
        if (!lang) {
          return "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n";
        }
        return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n";
      }
      blockquote(quote) {
        return "<blockquote>\n" + quote + "</blockquote>\n";
      }
      html(html) {
        return html;
      }
      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return "<h" + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + "</h" + level + ">\n";
        }
        return "<h" + level + ">" + text + "</h" + level + ">\n";
      }
      hr() {
        return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
      }
      list(body, ordered, start) {
        const type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
        return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
      }
      listitem(text) {
        return "<li>" + text + "</li>\n";
      }
      checkbox(checked) {
        return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
      }
      paragraph(text) {
        return "<p>" + text + "</p>\n";
      }
      table(header, body) {
        if (body) body = "<tbody>" + body + "</tbody>";
        return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
      }
      tablerow(content) {
        return "<tr>\n" + content + "</tr>\n";
      }
      tablecell(content, flags) {
        const type = flags.header ? "th" : "td";
        const tag2 = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
        return tag2 + content + "</" + type + ">\n";
      }
      // span level renderer
      strong(text) {
        return "<strong>" + text + "</strong>";
      }
      em(text) {
        return "<em>" + text + "</em>";
      }
      codespan(text) {
        return "<code>" + text + "</code>";
      }
      br() {
        return this.options.xhtml ? "<br/>" : "<br>";
      }
      del(text) {
        return "<del>" + text + "</del>";
      }
      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += ">" + text + "</a>";
        return out;
      }
      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? "/>" : ">";
        return out;
      }
      text(text) {
        return text;
      }
    };
  }
});

// node_modules/marked/src/TextRenderer.js
var require_TextRenderer = __commonJS({
  "node_modules/marked/src/TextRenderer.js"(exports2, module2) {
    module2.exports = class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }
      em(text) {
        return text;
      }
      codespan(text) {
        return text;
      }
      del(text) {
        return text;
      }
      html(text) {
        return text;
      }
      text(text) {
        return text;
      }
      link(href, title, text) {
        return "" + text;
      }
      image(href, title, text) {
        return "" + text;
      }
      br() {
        return "";
      }
    };
  }
});

// node_modules/marked/src/Slugger.js
var require_Slugger = __commonJS({
  "node_modules/marked/src/Slugger.js"(exports2, module2) {
    module2.exports = class Slugger {
      constructor() {
        this.seen = {};
      }
      serialize(value) {
        return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
      }
      /**
       * Finds the next safe (unique) slug to use
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + "-" + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }
      /**
       * Convert string to unique id
       * @param {object} options
       * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    };
  }
});

// node_modules/marked/src/Parser.js
var require_Parser2 = __commonJS({
  "node_modules/marked/src/Parser.js"(exports2, module2) {
    var Renderer = require_Renderer();
    var TextRenderer = require_TextRenderer();
    var Slugger = require_Slugger();
    var { defaults } = require_defaults();
    var {
      unescape
    } = require_helpers();
    module2.exports = class Parser {
      constructor(options) {
        this.options = options || defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }
      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }
      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }
      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox;
        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          switch (token.type) {
            case "space": {
              continue;
            }
            case "hr": {
              out += this.renderer.hr();
              continue;
            }
            case "heading": {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger
              );
              continue;
            }
            case "code": {
              out += this.renderer.code(
                token.text,
                token.lang,
                token.escaped
              );
              continue;
            }
            case "table": {
              header = "";
              cell = "";
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.tokens.header[j]),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);
              body = "";
              l2 = token.cells.length;
              for (j = 0; j < l2; j++) {
                row = token.tokens.cells[j];
                cell = "";
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k]),
                    { header: false, align: token.align[k] }
                  );
                }
                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case "blockquote": {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case "list": {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;
              body = "";
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;
                itemBody = "";
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === "text") {
                      item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                        item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: "text",
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }
                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }
              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case "html": {
              out += this.renderer.html(token.text);
              continue;
            }
            case "paragraph": {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case "text": {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === "text") {
                token = tokens[++i];
                body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = "", i, token;
        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          switch (token.type) {
            case "escape": {
              out += renderer.text(token.text);
              break;
            }
            case "html": {
              out += renderer.html(token.text);
              break;
            }
            case "link": {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case "image": {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case "strong": {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case "em": {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case "codespan": {
              out += renderer.codespan(token.text);
              break;
            }
            case "br": {
              out += renderer.br();
              break;
            }
            case "del": {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case "text": {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    };
  }
});

// node_modules/marked/src/marked.js
var require_marked = __commonJS({
  "node_modules/marked/src/marked.js"(exports2, module2) {
    var Lexer = require_Lexer();
    var Parser = require_Parser2();
    var Tokenizer = require_Tokenizer();
    var Renderer = require_Renderer();
    var TextRenderer = require_TextRenderer();
    var Slugger = require_Slugger();
    var {
      merge,
      checkSanitizeDeprecation,
      escape
    } = require_helpers();
    var {
      getDefaults,
      changeDefaults,
      defaults
    } = require_defaults();
    function marked2(src, opt, callback) {
      if (typeof src === "undefined" || src === null) {
        throw new Error("marked(): input parameter is undefined or null");
      }
      if (typeof src !== "string") {
        throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
      }
      if (typeof opt === "function") {
        callback = opt;
        opt = null;
      }
      opt = merge({}, marked2.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      if (callback) {
        const highlight = opt.highlight;
        let tokens;
        try {
          tokens = Lexer.lex(src, opt);
        } catch (e) {
          return callback(e);
        }
        const done = function(err) {
          let out;
          if (!err) {
            try {
              out = Parser.parse(tokens, opt);
            } catch (e) {
              err = e;
            }
          }
          opt.highlight = highlight;
          return err ? callback(err) : callback(null, out);
        };
        if (!highlight || highlight.length < 3) {
          return done();
        }
        delete opt.highlight;
        if (!tokens.length) return done();
        let pending = 0;
        marked2.walkTokens(tokens, function(token) {
          if (token.type === "code") {
            pending++;
            setTimeout(() => {
              highlight(token.text, token.lang, function(err, code) {
                if (err) {
                  return done(err);
                }
                if (code != null && code !== token.text) {
                  token.text = code;
                  token.escaped = true;
                }
                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });
        if (pending === 0) {
          done();
        }
        return;
      }
      try {
        const tokens = Lexer.lex(src, opt);
        if (opt.walkTokens) {
          marked2.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parse(tokens, opt);
      } catch (e) {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (opt.silent) {
          return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
        }
        throw e;
      }
    }
    marked2.options = marked2.setOptions = function(opt) {
      merge(marked2.defaults, opt);
      changeDefaults(marked2.defaults);
      return marked2;
    };
    marked2.getDefaults = getDefaults;
    marked2.defaults = defaults;
    marked2.use = function(extension) {
      const opts = merge({}, extension);
      if (extension.renderer) {
        const renderer = marked2.defaults.renderer || new Renderer();
        for (const prop in extension.renderer) {
          const prevRenderer = renderer[prop];
          renderer[prop] = (...args) => {
            let ret = extension.renderer[prop].apply(renderer, args);
            if (ret === false) {
              ret = prevRenderer.apply(renderer, args);
            }
            return ret;
          };
        }
        opts.renderer = renderer;
      }
      if (extension.tokenizer) {
        const tokenizer = marked2.defaults.tokenizer || new Tokenizer();
        for (const prop in extension.tokenizer) {
          const prevTokenizer = tokenizer[prop];
          tokenizer[prop] = (...args) => {
            let ret = extension.tokenizer[prop].apply(tokenizer, args);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (extension.walkTokens) {
        const walkTokens = marked2.defaults.walkTokens;
        opts.walkTokens = (token) => {
          extension.walkTokens(token);
          if (walkTokens) {
            walkTokens(token);
          }
        };
      }
      marked2.setOptions(opts);
    };
    marked2.walkTokens = function(tokens, callback) {
      for (const token of tokens) {
        callback(token);
        switch (token.type) {
          case "table": {
            for (const cell of token.tokens.header) {
              marked2.walkTokens(cell, callback);
            }
            for (const row of token.tokens.cells) {
              for (const cell of row) {
                marked2.walkTokens(cell, callback);
              }
            }
            break;
          }
          case "list": {
            marked2.walkTokens(token.items, callback);
            break;
          }
          default: {
            if (token.tokens) {
              marked2.walkTokens(token.tokens, callback);
            }
          }
        }
      }
    };
    marked2.parseInline = function(src, opt) {
      if (typeof src === "undefined" || src === null) {
        throw new Error("marked.parseInline(): input parameter is undefined or null");
      }
      if (typeof src !== "string") {
        throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
      }
      opt = merge({}, marked2.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      try {
        const tokens = Lexer.lexInline(src, opt);
        if (opt.walkTokens) {
          marked2.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parseInline(tokens, opt);
      } catch (e) {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (opt.silent) {
          return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
        }
        throw e;
      }
    };
    marked2.Parser = Parser;
    marked2.parser = Parser.parse;
    marked2.Renderer = Renderer;
    marked2.TextRenderer = TextRenderer;
    marked2.Lexer = Lexer;
    marked2.lexer = Lexer.lex;
    marked2.Tokenizer = Tokenizer;
    marked2.Slugger = Slugger;
    marked2.parse = marked2;
    module2.exports = marked2;
  }
});

// node_modules/chrono-node/dist/utils/pattern.js
var require_pattern = __commonJS({
  "node_modules/chrono-node/dist/utils/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.matchAnyPattern = exports2.extractTerms = exports2.repeatedTimeunitPattern = void 0;
    function repeatedTimeunitPattern(prefix, singleTimeunitPattern) {
      const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
      return `${prefix}${singleTimeunitPatternNoCapture}\\s*(?:,?\\s{0,5}${singleTimeunitPatternNoCapture}){0,10}`;
    }
    exports2.repeatedTimeunitPattern = repeatedTimeunitPattern;
    function extractTerms(dictionary) {
      let keys;
      if (dictionary instanceof Array) {
        keys = [...dictionary];
      } else if (dictionary instanceof Map) {
        keys = Array.from(dictionary.keys());
      } else {
        keys = Object.keys(dictionary);
      }
      return keys;
    }
    exports2.extractTerms = extractTerms;
    function matchAnyPattern(dictionary) {
      const joinedTerms = extractTerms(dictionary).sort((a, b) => b.length - a.length).join("|").replace(/\./g, "\\.");
      return `(?:${joinedTerms})`;
    }
    exports2.matchAnyPattern = matchAnyPattern;
  }
});

// node_modules/dayjs/dayjs.min.js
var require_dayjs_min = __commonJS({
  "node_modules/dayjs/dayjs.min.js"(exports2, module2) {
    !function(t, e) {
      "object" == typeof exports2 && "undefined" != typeof module2 ? module2.exports = e() : "function" == typeof define && define.amd ? define(e) : t.dayjs = e();
    }(exports2, function() {
      "use strict";
      var t = "millisecond", e = "second", n = "minute", r = "hour", i = "day", s = "week", u = "month", a = "quarter", o = "year", f = "date", h = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, c = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, d = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") }, $ = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, l = { s: $, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + $(r2, 2, "0") + ":" + $(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, u), s2 = n2 - i2 < 0, a2 = e2.clone().add(r2 + (s2 ? -1 : 1), u);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - a2 : a2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(h2) {
        return { M: u, y: o, w: s, d: i, D: f, h: r, m: n, s: e, ms: t, Q: a }[h2] || String(h2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, y = "en", M = {};
      M[y] = d;
      var m = function(t2) {
        return t2 instanceof S;
      }, D = function(t2, e2, n2) {
        var r2;
        if (!t2) return y;
        if ("string" == typeof t2) M[t2] && (r2 = t2), e2 && (M[t2] = e2, r2 = t2);
        else {
          var i2 = t2.name;
          M[i2] = t2, r2 = i2;
        }
        return !n2 && r2 && (y = r2), r2 || !n2 && y;
      }, v = function(t2, e2) {
        if (m(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new S(n2);
      }, g = l;
      g.l = D, g.i = m, g.w = function(t2, e2) {
        return v(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var S = function() {
        function d2(t2) {
          this.$L = D(t2.locale, null, true), this.parse(t2);
        }
        var $2 = d2.prototype;
        return $2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (g.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match(h);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.$x = t2.x || {}, this.init();
        }, $2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, $2.$utils = function() {
          return g;
        }, $2.isValid = function() {
          return !("Invalid Date" === this.$d.toString());
        }, $2.isSame = function(t2, e2) {
          var n2 = v(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, $2.isAfter = function(t2, e2) {
          return v(t2) < this.startOf(e2);
        }, $2.isBefore = function(t2, e2) {
          return this.endOf(e2) < v(t2);
        }, $2.$g = function(t2, e2, n2) {
          return g.u(t2) ? this[e2] : this.set(n2, t2);
        }, $2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, $2.valueOf = function() {
          return this.$d.getTime();
        }, $2.startOf = function(t2, a2) {
          var h2 = this, c2 = !!g.u(a2) || a2, d3 = g.p(t2), $3 = function(t3, e2) {
            var n2 = g.w(h2.$u ? Date.UTC(h2.$y, e2, t3) : new Date(h2.$y, e2, t3), h2);
            return c2 ? n2 : n2.endOf(i);
          }, l2 = function(t3, e2) {
            return g.w(h2.toDate()[t3].apply(h2.toDate("s"), (c2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e2)), h2);
          }, y2 = this.$W, M2 = this.$M, m2 = this.$D, D2 = "set" + (this.$u ? "UTC" : "");
          switch (d3) {
            case o:
              return c2 ? $3(1, 0) : $3(31, 11);
            case u:
              return c2 ? $3(1, M2) : $3(0, M2 + 1);
            case s:
              var v2 = this.$locale().weekStart || 0, S2 = (y2 < v2 ? y2 + 7 : y2) - v2;
              return $3(c2 ? m2 - S2 : m2 + (6 - S2), M2);
            case i:
            case f:
              return l2(D2 + "Hours", 0);
            case r:
              return l2(D2 + "Minutes", 1);
            case n:
              return l2(D2 + "Seconds", 2);
            case e:
              return l2(D2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, $2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, $2.$set = function(s2, a2) {
          var h2, c2 = g.p(s2), d3 = "set" + (this.$u ? "UTC" : ""), $3 = (h2 = {}, h2[i] = d3 + "Date", h2[f] = d3 + "Date", h2[u] = d3 + "Month", h2[o] = d3 + "FullYear", h2[r] = d3 + "Hours", h2[n] = d3 + "Minutes", h2[e] = d3 + "Seconds", h2[t] = d3 + "Milliseconds", h2)[c2], l2 = c2 === i ? this.$D + (a2 - this.$W) : a2;
          if (c2 === u || c2 === o) {
            var y2 = this.clone().set(f, 1);
            y2.$d[$3](l2), y2.init(), this.$d = y2.set(f, Math.min(this.$D, y2.daysInMonth())).$d;
          } else $3 && this.$d[$3](l2);
          return this.init(), this;
        }, $2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, $2.get = function(t2) {
          return this[g.p(t2)]();
        }, $2.add = function(t2, a2) {
          var f2, h2 = this;
          t2 = Number(t2);
          var c2 = g.p(a2), d3 = function(e2) {
            var n2 = v(h2);
            return g.w(n2.date(n2.date() + Math.round(e2 * t2)), h2);
          };
          if (c2 === u) return this.set(u, this.$M + t2);
          if (c2 === o) return this.set(o, this.$y + t2);
          if (c2 === i) return d3(1);
          if (c2 === s) return d3(7);
          var $3 = (f2 = {}, f2[n] = 6e4, f2[r] = 36e5, f2[e] = 1e3, f2)[c2] || 1, l2 = this.$d.getTime() + t2 * $3;
          return g.w(l2, this);
        }, $2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, $2.format = function(t2) {
          var e2 = this;
          if (!this.isValid()) return "Invalid Date";
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", r2 = g.z(this), i2 = this.$locale(), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = i2.weekdays, f2 = i2.months, h2 = function(t3, r3, i3, s3) {
            return t3 && (t3[r3] || t3(e2, n2)) || i3[r3].substr(0, s3);
          }, d3 = function(t3) {
            return g.s(s2 % 12 || 12, t3, "0");
          }, $3 = i2.meridiem || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          }, l2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: g.s(a2 + 1, 2, "0"), MMM: h2(i2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: g.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(i2.weekdaysMin, this.$W, o2, 2), ddd: h2(i2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: g.s(s2, 2, "0"), h: d3(1), hh: d3(2), a: $3(s2, u2, true), A: $3(s2, u2, false), m: String(u2), mm: g.s(u2, 2, "0"), s: String(this.$s), ss: g.s(this.$s, 2, "0"), SSS: g.s(this.$ms, 3, "0"), Z: r2 };
          return n2.replace(c, function(t3, e3) {
            return e3 || l2[t3] || r2.replace(":", "");
          });
        }, $2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, $2.diff = function(t2, f2, h2) {
          var c2, d3 = g.p(f2), $3 = v(t2), l2 = 6e4 * ($3.utcOffset() - this.utcOffset()), y2 = this - $3, M2 = g.m(this, $3);
          return M2 = (c2 = {}, c2[o] = M2 / 12, c2[u] = M2, c2[a] = M2 / 3, c2[s] = (y2 - l2) / 6048e5, c2[i] = (y2 - l2) / 864e5, c2[r] = y2 / 36e5, c2[n] = y2 / 6e4, c2[e] = y2 / 1e3, c2)[d3] || y2, h2 ? M2 : g.a(M2);
        }, $2.daysInMonth = function() {
          return this.endOf(u).$D;
        }, $2.$locale = function() {
          return M[this.$L];
        }, $2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = D(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, $2.clone = function() {
          return g.w(this.$d, this);
        }, $2.toDate = function() {
          return new Date(this.valueOf());
        }, $2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, $2.toISOString = function() {
          return this.$d.toISOString();
        }, $2.toString = function() {
          return this.$d.toUTCString();
        }, d2;
      }(), p = S.prototype;
      return v.prototype = p, [["$ms", t], ["$s", e], ["$m", n], ["$H", r], ["$W", i], ["$M", u], ["$y", o], ["$D", f]].forEach(function(t2) {
        p[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), v.extend = function(t2, e2) {
        return t2.$i || (t2(e2, S, v), t2.$i = true), v;
      }, v.locale = D, v.isDayjs = m, v.unix = function(t2) {
        return v(1e3 * t2);
      }, v.en = M[y], v.Ls = M, v.p = {}, v;
    });
  }
});

// node_modules/chrono-node/dist/calculation/years.js
var require_years = __commonJS({
  "node_modules/chrono-node/dist/calculation/years.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.findYearClosestToRef = exports2.findMostLikelyADYear = void 0;
    var dayjs_1 = __importDefault(require_dayjs_min());
    function findMostLikelyADYear(yearNumber) {
      if (yearNumber < 100) {
        if (yearNumber > 50) {
          yearNumber = yearNumber + 1900;
        } else {
          yearNumber = yearNumber + 2e3;
        }
      }
      return yearNumber;
    }
    exports2.findMostLikelyADYear = findMostLikelyADYear;
    function findYearClosestToRef(refDate, day, month) {
      const refMoment = dayjs_1.default(refDate);
      let dateMoment = refMoment;
      dateMoment = dateMoment.month(month - 1);
      dateMoment = dateMoment.date(day);
      dateMoment = dateMoment.year(refMoment.year());
      const nextYear = dateMoment.add(1, "y");
      const lastYear = dateMoment.add(-1, "y");
      if (Math.abs(nextYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = nextYear;
      } else if (Math.abs(lastYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = lastYear;
      }
      return dateMoment.year();
    }
    exports2.findYearClosestToRef = findYearClosestToRef;
  }
});

// node_modules/chrono-node/dist/locales/en/constants.js
var require_constants = __commonJS({
  "node_modules/chrono-node/dist/locales/en/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseTimeUnits = exports2.TIME_UNITS_PATTERN = exports2.parseYear = exports2.YEAR_PATTERN = exports2.parseOrdinalNumberPattern = exports2.ORDINAL_NUMBER_PATTERN = exports2.parseNumberPattern = exports2.NUMBER_PATTERN = exports2.TIME_UNIT_DICTIONARY = exports2.ORDINAL_WORD_DICTIONARY = exports2.INTEGER_WORD_DICTIONARY = exports2.MONTH_DICTIONARY = exports2.FULL_MONTH_NAME_DICTIONARY = exports2.WEEKDAY_DICTIONARY = void 0;
    var pattern_1 = require_pattern();
    var years_1 = require_years();
    exports2.WEEKDAY_DICTIONARY = {
      sunday: 0,
      sun: 0,
      "sun.": 0,
      monday: 1,
      mon: 1,
      "mon.": 1,
      tuesday: 2,
      tue: 2,
      "tue.": 2,
      wednesday: 3,
      wed: 3,
      "wed.": 3,
      thursday: 4,
      thurs: 4,
      "thurs.": 4,
      thur: 4,
      "thur.": 4,
      thu: 4,
      "thu.": 4,
      friday: 5,
      fri: 5,
      "fri.": 5,
      saturday: 6,
      sat: 6,
      "sat.": 6
    };
    exports2.FULL_MONTH_NAME_DICTIONARY = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12
    };
    exports2.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports2.FULL_MONTH_NAME_DICTIONARY), { jan: 1, "jan.": 1, feb: 2, "feb.": 2, mar: 3, "mar.": 3, apr: 4, "apr.": 4, jun: 6, "jun.": 6, jul: 7, "jul.": 7, aug: 8, "aug.": 8, sep: 9, "sep.": 9, sept: 9, "sept.": 9, oct: 10, "oct.": 10, nov: 11, "nov.": 11, dec: 12, "dec.": 12 });
    exports2.INTEGER_WORD_DICTIONARY = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12
    };
    exports2.ORDINAL_WORD_DICTIONARY = {
      first: 1,
      second: 2,
      third: 3,
      fourth: 4,
      fifth: 5,
      sixth: 6,
      seventh: 7,
      eighth: 8,
      ninth: 9,
      tenth: 10,
      eleventh: 11,
      twelfth: 12,
      thirteenth: 13,
      fourteenth: 14,
      fifteenth: 15,
      sixteenth: 16,
      seventeenth: 17,
      eighteenth: 18,
      nineteenth: 19,
      twentieth: 20,
      "twenty first": 21,
      "twenty-first": 21,
      "twenty second": 22,
      "twenty-second": 22,
      "twenty third": 23,
      "twenty-third": 23,
      "twenty fourth": 24,
      "twenty-fourth": 24,
      "twenty fifth": 25,
      "twenty-fifth": 25,
      "twenty sixth": 26,
      "twenty-sixth": 26,
      "twenty seventh": 27,
      "twenty-seventh": 27,
      "twenty eighth": 28,
      "twenty-eighth": 28,
      "twenty ninth": 29,
      "twenty-ninth": 29,
      "thirtieth": 30,
      "thirty first": 31,
      "thirty-first": 31
    };
    exports2.TIME_UNIT_DICTIONARY = {
      sec: "second",
      second: "second",
      seconds: "second",
      min: "minute",
      mins: "minute",
      minute: "minute",
      minutes: "minute",
      h: "hour",
      hr: "hour",
      hrs: "hour",
      hour: "hour",
      hours: "hour",
      day: "d",
      days: "d",
      week: "week",
      weeks: "week",
      month: "month",
      months: "month",
      y: "year",
      yr: "year",
      year: "year",
      years: "year"
    };
    exports2.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports2.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
    function parseNumberPattern(match) {
      const num = match.toLowerCase();
      if (exports2.INTEGER_WORD_DICTIONARY[num] !== void 0) {
        return exports2.INTEGER_WORD_DICTIONARY[num];
      } else if (num === "a" || num === "an") {
        return 1;
      } else if (num.match(/few/)) {
        return 3;
      } else if (num.match(/half/)) {
        return 0.5;
      } else if (num.match(/couple/)) {
        return 2;
      } else if (num.match(/several/)) {
        return 7;
      }
      return parseFloat(num);
    }
    exports2.parseNumberPattern = parseNumberPattern;
    exports2.ORDINAL_NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports2.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
    function parseOrdinalNumberPattern(match) {
      let num = match.toLowerCase();
      if (exports2.ORDINAL_WORD_DICTIONARY[num] !== void 0) {
        return exports2.ORDINAL_WORD_DICTIONARY[num];
      }
      num = num.replace(/(?:st|nd|rd|th)$/i, "");
      return parseInt(num);
    }
    exports2.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    exports2.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:BE|AD|BC)|[1-2][0-9]{3}|[5-9][0-9])`;
    function parseYear(match) {
      if (/BE/i.test(match)) {
        match = match.replace(/BE/i, "");
        return parseInt(match) - 543;
      }
      if (/BC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
      }
      if (/AD/i.test(match)) {
        match = match.replace(/AD/i, "");
        return parseInt(match);
      }
      const rawYearNumber = parseInt(match);
      return years_1.findMostLikelyADYear(rawYearNumber);
    }
    exports2.parseYear = parseYear;
    var SINGLE_TIME_UNIT_PATTERN = `(${exports2.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports2.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    exports2.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern(`(?:(?:about|around)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
    function parseTimeUnits(timeunitText) {
      const fragments = {};
      let remainingText = timeunitText;
      let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      }
      return fragments;
    }
    exports2.parseTimeUnits = parseTimeUnits;
    function collectDateTimeFragment(fragments, match) {
      const num = parseNumberPattern(match[1]);
      const unit = exports2.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
      fragments[unit] = num;
    }
  }
});

// node_modules/dayjs/plugin/quarterOfYear.js
var require_quarterOfYear = __commonJS({
  "node_modules/dayjs/plugin/quarterOfYear.js"(exports2, module2) {
    !function(t, n) {
      "object" == typeof exports2 && "undefined" != typeof module2 ? module2.exports = n() : "function" == typeof define && define.amd ? define(n) : t.dayjs_plugin_quarterOfYear = n();
    }(exports2, function() {
      "use strict";
      var t = "month", n = "quarter";
      return function(r, i) {
        var e = i.prototype;
        e.quarter = function(t2) {
          return this.$utils().u(t2) ? Math.ceil((this.month() + 1) / 3) : this.month(this.month() % 3 + 3 * (t2 - 1));
        };
        var u = e.add;
        e.add = function(r2, i2) {
          return r2 = Number(r2), this.$utils().p(i2) === n ? this.add(3 * r2, t) : u.bind(this)(r2, i2);
        };
        var s = e.startOf;
        e.startOf = function(r2, i2) {
          var e2 = this.$utils(), u2 = !!e2.u(i2) || i2;
          if (e2.p(r2) === n) {
            var a = this.quarter() - 1;
            return u2 ? this.month(3 * a).startOf(t).startOf("day") : this.month(3 * a + 2).endOf(t).endOf("day");
          }
          return s.bind(this)(r2, i2);
        };
      };
    });
  }
});

// node_modules/chrono-node/dist/utils/dayjs.js
var require_dayjs = __commonJS({
  "node_modules/chrono-node/dist/utils/dayjs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.implySimilarTime = exports2.assignSimilarTime = exports2.assignSimilarDate = exports2.assignTheNextDay = void 0;
    function assignTheNextDay(component, targetDayJs) {
      targetDayJs = targetDayJs.add(1, "day");
      assignSimilarDate(component, targetDayJs);
      implySimilarTime(component, targetDayJs);
    }
    exports2.assignTheNextDay = assignTheNextDay;
    function assignSimilarDate(component, targetDayJs) {
      component.assign("day", targetDayJs.date());
      component.assign("month", targetDayJs.month() + 1);
      component.assign("year", targetDayJs.year());
    }
    exports2.assignSimilarDate = assignSimilarDate;
    function assignSimilarTime(component, targetDayJs) {
      component.assign("hour", targetDayJs.hour());
      component.assign("minute", targetDayJs.minute());
      component.assign("second", targetDayJs.second());
      component.assign("millisecond", targetDayJs.millisecond());
      component.assign("timezoneOffset", targetDayJs.utcOffset());
    }
    exports2.assignSimilarTime = assignSimilarTime;
    function implySimilarTime(component, targetDayJs) {
      component.imply("hour", targetDayJs.hour());
      component.imply("minute", targetDayJs.minute());
      component.imply("second", targetDayJs.second());
      component.imply("millisecond", targetDayJs.millisecond());
      component.imply("timezoneOffset", targetDayJs.utcOffset());
    }
    exports2.implySimilarTime = implySimilarTime;
  }
});

// node_modules/chrono-node/dist/results.js
var require_results = __commonJS({
  "node_modules/chrono-node/dist/results.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ParsingResult = exports2.ParsingComponents = void 0;
    var quarterOfYear_1 = __importDefault(require_quarterOfYear());
    var dayjs_1 = __importDefault(require_dayjs_min());
    var dayjs_2 = require_dayjs();
    dayjs_1.default.extend(quarterOfYear_1.default);
    var ParsingComponents = class _ParsingComponents {
      constructor(refDate, knownComponents) {
        this.knownValues = {};
        this.impliedValues = {};
        if (knownComponents) {
          for (const key in knownComponents) {
            this.knownValues[key] = knownComponents[key];
          }
        }
        const refDayJs = dayjs_1.default(refDate);
        this.imply("day", refDayJs.date());
        this.imply("month", refDayJs.month() + 1);
        this.imply("year", refDayJs.year());
        this.imply("hour", 12);
        this.imply("minute", 0);
        this.imply("second", 0);
        this.imply("millisecond", 0);
      }
      get(component) {
        if (component in this.knownValues) {
          return this.knownValues[component];
        }
        if (component in this.impliedValues) {
          return this.impliedValues[component];
        }
        return null;
      }
      isCertain(component) {
        return component in this.knownValues;
      }
      getCertainComponents() {
        return Object.keys(this.knownValues);
      }
      imply(component, value) {
        if (component in this.knownValues) {
          return this;
        }
        this.impliedValues[component] = value;
        return this;
      }
      assign(component, value) {
        this.knownValues[component] = value;
        delete this.impliedValues[component];
        return this;
      }
      delete(component) {
        delete this.knownValues[component];
        delete this.impliedValues[component];
      }
      clone() {
        const component = new _ParsingComponents(/* @__PURE__ */ new Date());
        component.knownValues = {};
        component.impliedValues = {};
        for (const key in this.knownValues) {
          component.knownValues[key] = this.knownValues[key];
        }
        for (const key in this.impliedValues) {
          component.impliedValues[key] = this.impliedValues[key];
        }
        return component;
      }
      isOnlyDate() {
        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
      }
      isOnlyTime() {
        return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
      }
      isOnlyWeekdayComponent() {
        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
      }
      isOnlyDayMonthComponent() {
        return this.isCertain("day") && this.isCertain("month") && !this.isCertain("year");
      }
      isValidDate() {
        const date = this.isCertain("timezoneOffset") ? this.dateWithoutTimezoneAdjustment() : this.date();
        if (date.getFullYear() !== this.get("year"))
          return false;
        if (date.getMonth() !== this.get("month") - 1)
          return false;
        if (date.getDate() !== this.get("day"))
          return false;
        if (this.get("hour") != null && date.getHours() != this.get("hour"))
          return false;
        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
          return false;
        return true;
      }
      toString() {
        return `[ParsingComponents {knownValues: ${JSON.stringify(this.knownValues)}, impliedValues: ${JSON.stringify(this.impliedValues)}}]`;
      }
      dayjs() {
        return dayjs_1.default(this.date());
      }
      date() {
        const date = this.dateWithoutTimezoneAdjustment();
        return new Date(date.getTime() + this.getTimezoneAdjustmentMinute(date) * 6e4);
      }
      dateWithoutTimezoneAdjustment() {
        const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
        date.setFullYear(this.get("year"));
        return date;
      }
      getTimezoneAdjustmentMinute(date) {
        var _a;
        date = date !== null && date !== void 0 ? date : /* @__PURE__ */ new Date();
        const currentTimezoneOffset = -date.getTimezoneOffset();
        const targetTimezoneOffset = (_a = this.get("timezoneOffset")) !== null && _a !== void 0 ? _a : currentTimezoneOffset;
        return currentTimezoneOffset - targetTimezoneOffset;
      }
      static createRelativeFromRefDate(refDate, fragments) {
        let date = dayjs_1.default(refDate);
        for (const key in fragments) {
          date = date.add(fragments[key], key);
        }
        const components = new _ParsingComponents(refDate);
        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
          dayjs_2.assignSimilarTime(components, date);
          dayjs_2.assignSimilarDate(components, date);
        } else {
          dayjs_2.implySimilarTime(components, date);
          if (fragments["d"]) {
            components.assign("day", date.date());
            components.assign("month", date.month() + 1);
            components.assign("year", date.year());
          } else {
            if (fragments["week"]) {
              components.imply("weekday", date.day());
            }
            components.imply("day", date.date());
            if (fragments["month"]) {
              components.assign("month", date.month() + 1);
              components.assign("year", date.year());
            } else {
              components.imply("month", date.month() + 1);
              if (fragments["year"]) {
                components.assign("year", date.year());
              } else {
                components.imply("year", date.year());
              }
            }
          }
        }
        return components;
      }
    };
    exports2.ParsingComponents = ParsingComponents;
    var ParsingResult = class _ParsingResult {
      constructor(refDate, index, text, start, end) {
        this.refDate = refDate;
        this.index = index;
        this.text = text;
        this.start = start || new ParsingComponents(this.refDate);
        this.end = end;
      }
      clone() {
        const result = new _ParsingResult(this.refDate, this.index, this.text);
        result.start = this.start ? this.start.clone() : null;
        result.end = this.end ? this.end.clone() : null;
        return result;
      }
      date() {
        return this.start.date();
      }
      toString() {
        return `[ParsingResult {index: ${this.index}, text: '${this.text}', ...}]`;
      }
    };
    exports2.ParsingResult = ParsingResult;
  }
});

// node_modules/chrono-node/dist/common/parsers/AbstractParserWithWordBoundary.js
var require_AbstractParserWithWordBoundary = __commonJS({
  "node_modules/chrono-node/dist/common/parsers/AbstractParserWithWordBoundary.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AbstractParserWithWordBoundaryChecking = void 0;
    var AbstractParserWithWordBoundaryChecking = class {
      constructor() {
        this.cachedInnerPattern = null;
        this.cachedPattern = null;
      }
      pattern(context) {
        const innerPattern = this.innerPattern(context);
        if (innerPattern == this.cachedInnerPattern) {
          return this.cachedPattern;
        }
        this.cachedPattern = new RegExp(`(\\W|^)${innerPattern.source}`, innerPattern.flags);
        this.cachedInnerPattern = innerPattern;
        return this.cachedPattern;
      }
      extract(context, match) {
        const header = match[1];
        match.index = match.index + header.length;
        match[0] = match[0].substring(header.length);
        for (let i = 2; i < match.length; i++) {
          match[i - 1] = match[i];
        }
        return this.innerExtract(context, match);
      }
    };
    exports2.AbstractParserWithWordBoundaryChecking = AbstractParserWithWordBoundaryChecking;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitWithinFormatParser.js
var require_ENTimeUnitWithinFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitWithinFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    var PATTERN_WITHOUT_PREFIX = new RegExp(`(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    var ENTimeUnitWithinFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
      }
      innerExtract(context, match) {
        const timeUnits = constants_1.parseTimeUnits(match[1]);
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
      }
    };
    exports2.default = ENTimeUnitWithinFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENMonthNameLittleEndianParser.js
var require_ENMonthNameLittleEndianParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENMonthNameLittleEndianParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var constants_1 = require_constants();
    var constants_2 = require_constants();
    var constants_3 = require_constants();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`(?:on\\s*?)?(${constants_3.ORDINAL_NUMBER_PATTERN})(?:\\s*(?:to|\\-|\\\u2013|until|through|till|\\s)\\s*(${constants_3.ORDINAL_NUMBER_PATTERN}))?(?:-|/|\\s*(?:of)?\\s*)(` + pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY) + `)(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?(?=\\W|$)`, "i");
    var DATE_GROUP = 1;
    var DATE_TO_GROUP = 2;
    var MONTH_NAME_GROUP = 3;
    var YEAR_GROUP = 4;
    var ENMonthNameLittleEndianParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
          match.index = match.index + match[DATE_GROUP].length;
          return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
          const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
          result.start.assign("year", yearNumber);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
          const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
          result.end = result.start.clone();
          result.end.assign("day", endDate);
        }
        return result;
      }
    };
    exports2.default = ENMonthNameLittleEndianParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENMonthNameMiddleEndianParser.js
var require_ENMonthNameMiddleEndianParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENMonthNameMiddleEndianParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var constants_1 = require_constants();
    var constants_2 = require_constants();
    var constants_3 = require_constants();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})(?:-|/|\\s*,?\\s*)(${constants_2.ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*(?:(?:to|\\-)\\s*(${constants_2.ORDINAL_NUMBER_PATTERN})\\s*)?(?:(?:-|/|\\s*,?\\s*)(${constants_3.YEAR_PATTERN}))?(?=\\W|$)(?!\\:\\d)`, "i");
    var MONTH_NAME_GROUP = 1;
    var DATE_GROUP = 2;
    var DATE_TO_GROUP = 3;
    var YEAR_GROUP = 4;
    var ENMonthNameMiddleEndianParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
          return null;
        }
        const components = context.createParsingComponents({
          day,
          month
        });
        if (match[YEAR_GROUP]) {
          const year = constants_3.parseYear(match[YEAR_GROUP]);
          components.assign("year", year);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
          return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
      }
    };
    exports2.default = ENMonthNameMiddleEndianParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENMonthNameParser.js
var require_ENMonthNameParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENMonthNameParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var years_1 = require_years();
    var pattern_1 = require_pattern();
    var constants_2 = require_constants();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`((?:in)\\s*)?(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})\\s*(?:[,-]?\\s*(${constants_2.YEAR_PATTERN})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, "i");
    var PREFIX_GROUP = 1;
    var MONTH_NAME_GROUP = 2;
    var YEAR_GROUP = 3;
    var ENMonthNameParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const monthName = match[MONTH_NAME_GROUP].toLowerCase();
        if (match[0].length <= 3 && !constants_1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
          return null;
        }
        const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
        result.start.imply("day", 1);
        const month = constants_1.MONTH_DICTIONARY[monthName];
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
          const year = constants_2.parseYear(match[YEAR_GROUP]);
          result.start.assign("year", year);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, 1, month);
          result.start.imply("year", year);
        }
        return result;
      }
    };
    exports2.default = ENMonthNameParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENCasualYearMonthDayParser.js
var require_ENCasualYearMonthDayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENCasualYearMonthDayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s](?:(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]([0-9]{1,2})(?=\\W|$)`, "i");
    var YEAR_NUMBER_GROUP = 1;
    var MONTH_NAME_GROUP = 2;
    var MONTH_NUMBER_GROUP = 3;
    var DATE_NUMBER_GROUP = 4;
    var ENCasualYearMonthDayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP] ? parseInt(match[MONTH_NUMBER_GROUP]) : constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
          return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
          day,
          month,
          year
        };
      }
    };
    exports2.default = ENCasualYearMonthDayParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENSlashMonthFormatParser.js
var require_ENSlashMonthFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENSlashMonthFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})", "i");
    var MONTH_GROUP = 1;
    var YEAR_GROUP = 2;
    var ENSlashMonthFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
      }
    };
    exports2.default = ENSlashMonthFormatParser;
  }
});

// node_modules/chrono-node/dist/common/parsers/AbstractTimeExpressionParser.js
var require_AbstractTimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/common/parsers/AbstractTimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AbstractTimeExpressionParser = void 0;
    var index_1 = require_dist();
    function primaryTimePattern(primaryPrefix, primarySuffix) {
      return new RegExp(`(^|\\s|T)${primaryPrefix}(\\d{1,4})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:(?:\\:|\\\uFF1A)(\\d{2})(?:\\.(\\d{1,6}))?)?)?(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?${primarySuffix}`, "i");
    }
    function followingTimePatten(followingPhase, followingSuffix) {
      return new RegExp(`^(${followingPhase})(\\d{1,4})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:\\.(\\d{1,6}))?)?)?(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?${followingSuffix}`, "i");
    }
    var HOUR_GROUP = 2;
    var MINUTE_GROUP = 3;
    var SECOND_GROUP = 4;
    var MILLI_SECOND_GROUP = 5;
    var AM_PM_HOUR_GROUP = 6;
    var AbstractTimeExpressionParser = class {
      constructor(strictMode = false) {
        this.cachedPrimaryPrefix = null;
        this.cachedPrimarySuffix = null;
        this.cachedPrimaryTimePattern = null;
        this.cachedFollowingPhase = null;
        this.cachedFollowingSuffix = null;
        this.cachedFollowingTimePatten = null;
        this.strictMode = strictMode;
      }
      primarySuffix() {
        return "(?=\\W|$)";
      }
      followingSuffix() {
        return "(?=\\W|$)";
      }
      pattern(context) {
        return this.getPrimaryTimePatternThroughCache();
      }
      extract(context, match) {
        const startComponents = this.extractPrimaryTimeComponents(context, match);
        if (!startComponents) {
          match.index += match[0].length;
          return null;
        }
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length), startComponents);
        const remainingText = context.text.substring(match.index + match[0].length);
        const followingPattern = this.getFollowingTimePatternThroughCache();
        match = followingPattern.exec(remainingText);
        if (!match || match[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
          return this.checkAndReturnWithoutFollowingPattern(result);
        }
        result.end = this.extractFollowingTimeComponents(context, match, result);
        if (result.end) {
          if (result.end) {
            result.text += match[0];
          }
        }
        return result;
      }
      extractPrimaryTimeComponents(context, match, strict = false) {
        const components = context.createParsingComponents();
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
          if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
            return null;
          }
          minute = parseInt(match[MINUTE_GROUP]);
        } else if (hour > 100) {
          if (this.strictMode) {
            return null;
          }
          minute = hour % 100;
          hour = Math.floor(hour / 100);
        }
        if (minute >= 60 || hour > 24) {
          return null;
        }
        if (hour > 12) {
          meridiem = index_1.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
          if (hour > 12)
            return null;
          const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
          if (ampm == "a") {
            meridiem = index_1.Meridiem.AM;
            if (hour == 12) {
              hour = 0;
            }
          }
          if (ampm == "p") {
            meridiem = index_1.Meridiem.PM;
            if (hour != 12) {
              hour += 12;
            }
          }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem !== null) {
          components.assign("meridiem", meridiem);
        } else {
          if (hour < 12) {
            components.imply("meridiem", index_1.Meridiem.AM);
          } else {
            components.imply("meridiem", index_1.Meridiem.PM);
          }
        }
        if (match[MILLI_SECOND_GROUP] != null) {
          const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
          if (millisecond >= 1e3)
            return null;
          components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
          const second = parseInt(match[SECOND_GROUP]);
          if (second >= 60)
            return null;
          components.assign("second", second);
        }
        return components;
      }
      extractFollowingTimeComponents(context, match, result) {
        const components = context.createParsingComponents();
        if (match[MILLI_SECOND_GROUP] != null) {
          const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
          if (millisecond >= 1e3)
            return null;
          components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
          const second = parseInt(match[SECOND_GROUP]);
          if (second >= 60)
            return null;
          components.assign("second", second);
        }
        let hour = parseInt(match[HOUR_GROUP]);
        let minute = 0;
        let meridiem = -1;
        if (match[MINUTE_GROUP] != null) {
          minute = parseInt(match[MINUTE_GROUP]);
        } else if (hour > 100) {
          minute = hour % 100;
          hour = Math.floor(hour / 100);
        }
        if (minute >= 60 || hour > 24) {
          return null;
        }
        if (hour >= 12) {
          meridiem = index_1.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
          if (hour > 12) {
            return null;
          }
          const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
          if (ampm == "a") {
            meridiem = index_1.Meridiem.AM;
            if (hour == 12) {
              hour = 0;
              if (!components.isCertain("day")) {
                components.imply("day", components.get("day") + 1);
              }
            }
          }
          if (ampm == "p") {
            meridiem = index_1.Meridiem.PM;
            if (hour != 12)
              hour += 12;
          }
          if (!result.start.isCertain("meridiem")) {
            if (meridiem == index_1.Meridiem.AM) {
              result.start.imply("meridiem", index_1.Meridiem.AM);
              if (result.start.get("hour") == 12) {
                result.start.assign("hour", 0);
              }
            } else {
              result.start.imply("meridiem", index_1.Meridiem.PM);
              if (result.start.get("hour") != 12) {
                result.start.assign("hour", result.start.get("hour") + 12);
              }
            }
          }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem >= 0) {
          components.assign("meridiem", meridiem);
        } else {
          const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
          if (startAtPM) {
            if (result.start.get("hour") - 12 > hour) {
              components.imply("meridiem", index_1.Meridiem.AM);
            } else if (hour <= 12) {
              components.assign("hour", hour + 12);
              components.assign("meridiem", index_1.Meridiem.PM);
            }
          } else if (hour > 12) {
            components.imply("meridiem", index_1.Meridiem.PM);
          } else if (hour <= 12) {
            components.imply("meridiem", index_1.Meridiem.AM);
          }
        }
        if (components.date().getTime() < result.start.date().getTime()) {
          components.imply("day", components.get("day") + 1);
        }
        return components;
      }
      checkAndReturnWithoutFollowingPattern(result) {
        if (result.text.match(/^\d$/)) {
          return null;
        }
        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
        if (endingWithNumbers) {
          const endingNumbers = endingWithNumbers[1];
          if (this.strictMode) {
            return null;
          }
          if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
            return null;
          }
          const endingNumberVal = parseInt(endingNumbers);
          if (endingNumberVal > 24) {
            return null;
          }
        }
        return result;
      }
      getPrimaryTimePatternThroughCache() {
        const primaryPrefix = this.primaryPrefix();
        const primarySuffix = this.primarySuffix();
        if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
          return this.cachedPrimaryTimePattern;
        }
        this.cachedPrimaryTimePattern = primaryTimePattern(primaryPrefix, primarySuffix);
        this.cachedPrimaryPrefix = primaryPrefix;
        this.cachedPrimarySuffix = primarySuffix;
        return this.cachedPrimaryTimePattern;
      }
      getFollowingTimePatternThroughCache() {
        const followingPhase = this.followingPhase();
        const followingSuffix = this.followingSuffix();
        if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
          return this.cachedFollowingTimePatten;
        }
        this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
        this.cachedFollowingPhase = followingPhase;
        this.cachedFollowingSuffix = followingSuffix;
        return this.cachedFollowingTimePatten;
      }
    };
    exports2.AbstractTimeExpressionParser = AbstractTimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENTimeExpressionParser.js
var require_ENTimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENTimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var index_1 = require_dist();
    var AbstractTimeExpressionParser_1 = require_AbstractTimeExpressionParser();
    var ENTimeExpressionParser = class extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
      constructor(strictMode) {
        super(strictMode);
      }
      followingPhase() {
        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|to|\\?)\\s*";
      }
      primaryPrefix() {
        return "(?:(?:at|from)\\s*)??";
      }
      primarySuffix() {
        return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?=\\W|$)";
      }
      extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
          if (match[0].endsWith("night")) {
            const hour = components.get("hour");
            if (hour >= 6 && hour < 12) {
              components.assign("hour", components.get("hour") + 12);
              components.assign("meridiem", index_1.Meridiem.PM);
            } else if (hour < 6) {
              components.assign("meridiem", index_1.Meridiem.AM);
            }
          }
          if (match[0].endsWith("afternoon")) {
            components.assign("meridiem", index_1.Meridiem.PM);
            const hour = components.get("hour");
            if (hour >= 0 && hour <= 6) {
              components.assign("hour", components.get("hour") + 12);
            }
          }
          if (match[0].endsWith("morning")) {
            components.assign("meridiem", index_1.Meridiem.AM);
            const hour = components.get("hour");
            if (hour < 12) {
              components.assign("hour", components.get("hour"));
            }
          }
        }
        return components;
      }
    };
    exports2.default = ENTimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/utils/timeunits.js
var require_timeunits = __commonJS({
  "node_modules/chrono-node/dist/utils/timeunits.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.addImpliedTimeUnits = exports2.reverseTimeUnits = void 0;
    function reverseTimeUnits(timeUnits) {
      const reversed = {};
      for (const key in timeUnits) {
        reversed[key] = -timeUnits[key];
      }
      return reversed;
    }
    exports2.reverseTimeUnits = reverseTimeUnits;
    function addImpliedTimeUnits(components, timeUnits) {
      const output = components.clone();
      let date = components.dayjs();
      for (const key in timeUnits) {
        date = date.add(timeUnits[key], key);
      }
      if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
        output.imply("day", date.date());
        output.imply("month", date.month() + 1);
        output.imply("year", date.year());
      }
      if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
        output.imply("second", date.second());
        output.imply("minute", date.minute());
        output.imply("hour", date.hour());
      }
      return output;
    }
    exports2.addImpliedTimeUnits = addImpliedTimeUnits;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitAgoFormatParser.js
var require_ENTimeUnitAgoFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitAgoFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var timeunits_1 = require_timeunits();
    var PATTERN = new RegExp("(" + constants_1.TIME_UNITS_PATTERN + ")(?:ago|before|earlier)(?=(?:\\W|$))", "i");
    var STRICT_PATTERN = new RegExp("(" + constants_1.TIME_UNITS_PATTERN + ")ago(?=(?:\\W|$))", "i");
    var ENTimeUnitAgoFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      constructor(strictMode) {
        super();
        this.strictMode = strictMode;
      }
      innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
      }
      innerExtract(context, match) {
        const timeUnits = constants_1.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, outputTimeUnits);
      }
    };
    exports2.default = ENTimeUnitAgoFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitLaterFormatParser.js
var require_ENTimeUnitLaterFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitLaterFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp("(" + constants_1.TIME_UNITS_PATTERN + ")(later|after|from now|henceforth|forward|out)(?=(?:\\W|$))", "i");
    var STRICT_PATTERN = new RegExp("(" + constants_1.TIME_UNITS_PATTERN + ")(later|from now)(?=(?:\\W|$))", "i");
    var GROUP_NUM_TIMEUNITS = 1;
    var ENTimeUnitLaterFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      constructor(strictMode) {
        super();
        this.strictMode = strictMode;
      }
      innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
      }
      innerExtract(context, match) {
        const fragments = constants_1.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, fragments);
      }
    };
    exports2.default = ENTimeUnitLaterFormatParser;
  }
});

// node_modules/chrono-node/dist/common/abstractRefiners.js
var require_abstractRefiners = __commonJS({
  "node_modules/chrono-node/dist/common/abstractRefiners.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MergingRefiner = exports2.Filter = void 0;
    var Filter = class {
      refine(context, results) {
        return results.filter((r) => this.isValid(context, r));
      }
    };
    exports2.Filter = Filter;
    var MergingRefiner = class {
      refine(context, results) {
        if (results.length < 2) {
          return results;
        }
        const mergedResults = [];
        let curResult = results[0];
        let nextResult = null;
        for (let i = 1; i < results.length; i++) {
          nextResult = results[i];
          const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
          if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
            mergedResults.push(curResult);
            curResult = nextResult;
          } else {
            const left = curResult;
            const right = nextResult;
            const mergedResult = this.mergeResults(textBetween, left, right, context);
            context.debug(() => {
              console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
            });
            curResult = mergedResult;
          }
        }
        if (curResult != null) {
          mergedResults.push(curResult);
        }
        return mergedResults;
      }
    };
    exports2.MergingRefiner = MergingRefiner;
  }
});

// node_modules/chrono-node/dist/common/refiners/AbstractMergeDateRangeRefiner.js
var require_AbstractMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/AbstractMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var abstractRefiners_1 = require_abstractRefiners();
    var AbstractMergeDateRangeRefiner = class extends abstractRefiners_1.MergingRefiner {
      shouldMergeResults(textBetween, currentResult, nextResult) {
        return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
      }
      mergeResults(textBetween, fromResult, toResult) {
        if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
          toResult.start.getCertainComponents().forEach((key) => {
            if (!fromResult.start.isCertain(key)) {
              fromResult.start.assign(key, toResult.start.get(key));
            }
          });
          fromResult.start.getCertainComponents().forEach((key) => {
            if (!toResult.start.isCertain(key)) {
              toResult.start.assign(key, fromResult.start.get(key));
            }
          });
        }
        if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {
          let fromMoment = fromResult.start.dayjs();
          let toMoment = toResult.start.dayjs();
          if (fromResult.start.isOnlyWeekdayComponent() && fromMoment.add(-7, "days").isBefore(toMoment)) {
            fromMoment = fromMoment.add(-7, "days");
            fromResult.start.imply("day", fromMoment.date());
            fromResult.start.imply("month", fromMoment.month() + 1);
            fromResult.start.imply("year", fromMoment.year());
          } else if (toResult.start.isOnlyWeekdayComponent() && toMoment.add(7, "days").isAfter(fromMoment)) {
            toMoment = toMoment.add(7, "days");
            toResult.start.imply("day", toMoment.date());
            toResult.start.imply("month", toMoment.month() + 1);
            toResult.start.imply("year", toMoment.year());
          } else {
            [toResult, fromResult] = [fromResult, toResult];
          }
        }
        const result = fromResult.clone();
        result.start = fromResult.start;
        result.end = toResult.start;
        result.index = Math.min(fromResult.index, toResult.index);
        if (fromResult.index < toResult.index) {
          result.text = fromResult.text + textBetween + toResult.text;
        } else {
          result.text = toResult.text + textBetween + fromResult.text;
        }
        return result;
      }
    };
    exports2.default = AbstractMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/en/refiners/ENMergeDateRangeRefiner.js
var require_ENMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/en/refiners/ENMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateRangeRefiner_1 = __importDefault(require_AbstractMergeDateRangeRefiner());
    var ENMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner_1.default {
      patternBetween() {
        return /^\s*(to|-)\s*$/i;
      }
    };
    exports2.default = ENMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/calculation/mergingCalculation.js
var require_mergingCalculation = __commonJS({
  "node_modules/chrono-node/dist/calculation/mergingCalculation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.mergeDateTimeComponent = exports2.mergeDateTimeResult = void 0;
    var index_1 = require_dist();
    function mergeDateTimeResult(dateResult, timeResult) {
      const result = dateResult.clone();
      const beginDate = dateResult.start;
      const beginTime = timeResult.start;
      result.start = mergeDateTimeComponent(beginDate, beginTime);
      if (dateResult.end != null || timeResult.end != null) {
        const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
        const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
        const endDateTime = mergeDateTimeComponent(endDate, endTime);
        if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
          if (endDateTime.isCertain("day")) {
            endDateTime.assign("day", endDateTime.get("day") + 1);
          } else {
            endDateTime.imply("day", endDateTime.get("day") + 1);
          }
        }
        result.end = endDateTime;
      }
      return result;
    }
    exports2.mergeDateTimeResult = mergeDateTimeResult;
    function mergeDateTimeComponent(dateComponent, timeComponent) {
      const dateTimeComponent = dateComponent.clone();
      if (timeComponent.isCertain("hour")) {
        dateTimeComponent.assign("hour", timeComponent.get("hour"));
        dateTimeComponent.assign("minute", timeComponent.get("minute"));
        if (timeComponent.isCertain("second")) {
          dateTimeComponent.assign("second", timeComponent.get("second"));
          if (timeComponent.isCertain("millisecond")) {
            dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
          } else {
            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
          }
        } else {
          dateTimeComponent.imply("second", timeComponent.get("second"));
          dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
        }
      } else {
        dateTimeComponent.imply("hour", timeComponent.get("hour"));
        dateTimeComponent.imply("minute", timeComponent.get("minute"));
        dateTimeComponent.imply("second", timeComponent.get("second"));
        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
      }
      if (timeComponent.isCertain("timezoneOffset")) {
        dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
      }
      if (timeComponent.isCertain("meridiem")) {
        dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
      } else if (timeComponent.get("meridiem") != null && dateTimeComponent.get("meridiem") == null) {
        dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
      }
      if (dateTimeComponent.get("meridiem") == index_1.Meridiem.PM && dateTimeComponent.get("hour") < 12) {
        if (timeComponent.isCertain("hour")) {
          dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
        } else {
          dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
        }
      }
      return dateTimeComponent;
    }
    exports2.mergeDateTimeComponent = mergeDateTimeComponent;
  }
});

// node_modules/chrono-node/dist/common/refiners/AbstractMergeDateTimeRefiner.js
var require_AbstractMergeDateTimeRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/AbstractMergeDateTimeRefiner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var abstractRefiners_1 = require_abstractRefiners();
    var mergingCalculation_1 = require_mergingCalculation();
    var ENMergeDateTimeRefiner = class extends abstractRefiners_1.MergingRefiner {
      shouldMergeResults(textBetween, currentResult, nextResult) {
        return (currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime() || nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime()) && textBetween.match(this.patternBetween()) != null;
      }
      mergeResults(textBetween, currentResult, nextResult) {
        const result = currentResult.start.isOnlyDate() ? mergingCalculation_1.mergeDateTimeResult(currentResult, nextResult) : mergingCalculation_1.mergeDateTimeResult(nextResult, currentResult);
        result.index = currentResult.index;
        result.text = currentResult.text + textBetween + nextResult.text;
        return result;
      }
    };
    exports2.default = ENMergeDateTimeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/en/refiners/ENMergeDateTimeRefiner.js
var require_ENMergeDateTimeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/en/refiners/ENMergeDateTimeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateTimeRefiner_1 = __importDefault(require_AbstractMergeDateTimeRefiner());
    var ENMergeDateTimeRefiner = class extends AbstractMergeDateTimeRefiner_1.default {
      patternBetween() {
        return new RegExp("^\\s*(T|at|after|before|on|of|,|-)?\\s*$");
      }
    };
    exports2.default = ENMergeDateTimeRefiner;
  }
});

// node_modules/chrono-node/dist/common/refiners/ExtractTimezoneAbbrRefiner.js
var require_ExtractTimezoneAbbrRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/ExtractTimezoneAbbrRefiner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var TIMEZONE_NAME_PATTERN = new RegExp("^\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
    var DEFAULT_TIMEZONE_ABBR_MAP = {
      ACDT: 630,
      ACST: 570,
      ADT: -180,
      AEDT: 660,
      AEST: 600,
      AFT: 270,
      AKDT: -480,
      AKST: -540,
      ALMT: 360,
      AMST: -180,
      AMT: -240,
      ANAST: 720,
      ANAT: 720,
      AQTT: 300,
      ART: -180,
      AST: -240,
      AWDT: 540,
      AWST: 480,
      AZOST: 0,
      AZOT: -60,
      AZST: 300,
      AZT: 240,
      BNT: 480,
      BOT: -240,
      BRST: -120,
      BRT: -180,
      BST: 60,
      BTT: 360,
      CAST: 480,
      CAT: 120,
      CCT: 390,
      CDT: -300,
      CEST: 120,
      CET: 60,
      CHADT: 825,
      CHAST: 765,
      CKT: -600,
      CLST: -180,
      CLT: -240,
      COT: -300,
      CST: -360,
      CVT: -60,
      CXT: 420,
      ChST: 600,
      DAVT: 420,
      EASST: -300,
      EAST: -360,
      EAT: 180,
      ECT: -300,
      EDT: -240,
      EEST: 180,
      EET: 120,
      EGST: 0,
      EGT: -60,
      EST: -300,
      ET: -300,
      FJST: 780,
      FJT: 720,
      FKST: -180,
      FKT: -240,
      FNT: -120,
      GALT: -360,
      GAMT: -540,
      GET: 240,
      GFT: -180,
      GILT: 720,
      GMT: 0,
      GST: 240,
      GYT: -240,
      HAA: -180,
      HAC: -300,
      HADT: -540,
      HAE: -240,
      HAP: -420,
      HAR: -360,
      HAST: -600,
      HAT: -90,
      HAY: -480,
      HKT: 480,
      HLV: -210,
      HNA: -240,
      HNC: -360,
      HNE: -300,
      HNP: -480,
      HNR: -420,
      HNT: -150,
      HNY: -540,
      HOVT: 420,
      ICT: 420,
      IDT: 180,
      IOT: 360,
      IRDT: 270,
      IRKST: 540,
      IRKT: 540,
      IRST: 210,
      IST: 330,
      JST: 540,
      KGT: 360,
      KRAST: 480,
      KRAT: 480,
      KST: 540,
      KUYT: 240,
      LHDT: 660,
      LHST: 630,
      LINT: 840,
      MAGST: 720,
      MAGT: 720,
      MART: -510,
      MAWT: 300,
      MDT: -360,
      MESZ: 120,
      MEZ: 60,
      MHT: 720,
      MMT: 390,
      MSD: 240,
      MSK: 240,
      MST: -420,
      MUT: 240,
      MVT: 300,
      MYT: 480,
      NCT: 660,
      NDT: -90,
      NFT: 690,
      NOVST: 420,
      NOVT: 360,
      NPT: 345,
      NST: -150,
      NUT: -660,
      NZDT: 780,
      NZST: 720,
      OMSST: 420,
      OMST: 420,
      PDT: -420,
      PET: -300,
      PETST: 720,
      PETT: 720,
      PGT: 600,
      PHOT: 780,
      PHT: 480,
      PKT: 300,
      PMDT: -120,
      PMST: -180,
      PONT: 660,
      PST: -480,
      PT: -480,
      PWT: 540,
      PYST: -180,
      PYT: -240,
      RET: 240,
      SAMT: 240,
      SAST: 120,
      SBT: 660,
      SCT: 240,
      SGT: 480,
      SRT: -180,
      SST: -660,
      TAHT: -600,
      TFT: 300,
      TJT: 300,
      TKT: 780,
      TLT: 540,
      TMT: 300,
      TVT: 720,
      ULAT: 480,
      UTC: 0,
      UYST: -120,
      UYT: -180,
      UZT: 300,
      VET: -210,
      VLAST: 660,
      VLAT: 660,
      VUT: 660,
      WAST: 120,
      WAT: 60,
      WEST: 60,
      WESZ: 60,
      WET: 0,
      WEZ: 0,
      WFT: 720,
      WGST: -120,
      WGT: -180,
      WIB: 420,
      WIT: 540,
      WITA: 480,
      WST: 780,
      WT: 0,
      YAKST: 600,
      YAKT: 600,
      YAPT: 600,
      YEKST: 360,
      YEKT: 360
    };
    var ExtractTimezoneAbbrRefiner = class {
      constructor(timezoneOverrides) {
        this.timezone = Object.assign(Object.assign({}, DEFAULT_TIMEZONE_ABBR_MAP), timezoneOverrides);
      }
      refine(context, results) {
        var _a;
        const timezoneOverrides = (_a = context.option.timezones) !== null && _a !== void 0 ? _a : {};
        results.forEach((result) => {
          var _a2, _b;
          const suffix = context.text.substring(result.index + result.text.length);
          const match = TIMEZONE_NAME_PATTERN.exec(suffix);
          if (!match) {
            return;
          }
          const timezoneAbbr = match[1].toUpperCase();
          const extractedTimezoneOffset = (_b = (_a2 = timezoneOverrides[timezoneAbbr]) !== null && _a2 !== void 0 ? _a2 : this.timezone[timezoneAbbr]) !== null && _b !== void 0 ? _b : null;
          if (extractedTimezoneOffset === null) {
            return;
          }
          context.debug(() => {
            console.log(`Extracting timezone: '${timezoneAbbr}' into : ${extractedTimezoneOffset}`);
          });
          const currentTimezoneOffset = result.start.get("timezoneOffset");
          if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
            return;
          }
          result.text += match[0];
          if (!result.start.isCertain("timezoneOffset")) {
            result.start.assign("timezoneOffset", extractedTimezoneOffset);
          }
          if (result.end != null && !result.end.isCertain("timezoneOffset")) {
            result.end.assign("timezoneOffset", extractedTimezoneOffset);
          }
        });
        return results;
      }
    };
    exports2.default = ExtractTimezoneAbbrRefiner;
  }
});

// node_modules/chrono-node/dist/common/refiners/ExtractTimezoneOffsetRefiner.js
var require_ExtractTimezoneOffsetRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/ExtractTimezoneOffsetRefiner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?", "i");
    var TIMEZONE_OFFSET_SIGN_GROUP = 1;
    var TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
    var TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
    var ExtractTimezoneOffsetRefiner = class {
      refine(context, results) {
        results.forEach(function(result) {
          if (result.start.isCertain("timezoneOffset")) {
            return;
          }
          const suffix = context.text.substring(result.index + result.text.length);
          const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
          if (!match) {
            return;
          }
          context.debug(() => {
            console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
          });
          const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
          const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
          let timezoneOffset = hourOffset * 60 + minuteOffset;
          if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
            timezoneOffset = -timezoneOffset;
          }
          if (result.end != null) {
            result.end.assign("timezoneOffset", timezoneOffset);
          }
          result.start.assign("timezoneOffset", timezoneOffset);
          result.text += match[0];
        });
        return results;
      }
    };
    exports2.default = ExtractTimezoneOffsetRefiner;
  }
});

// node_modules/chrono-node/dist/common/refiners/OverlapRemovalRefiner.js
var require_OverlapRemovalRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/OverlapRemovalRefiner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var OverlapRemovalRefiner = class {
      refine(context, results) {
        if (results.length < 2) {
          return results;
        }
        const filteredResults = [];
        let prevResult = results[0];
        for (let i = 1; i < results.length; i++) {
          const result = results[i];
          if (result.index < prevResult.index + prevResult.text.length) {
            if (result.text.length > prevResult.text.length) {
              prevResult = result;
            }
          } else {
            filteredResults.push(prevResult);
            prevResult = result;
          }
        }
        if (prevResult != null) {
          filteredResults.push(prevResult);
        }
        return filteredResults;
      }
    };
    exports2.default = OverlapRemovalRefiner;
  }
});

// node_modules/chrono-node/dist/common/refiners/ForwardDateRefiner.js
var require_ForwardDateRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/ForwardDateRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dayjs_1 = __importDefault(require_dayjs_min());
    var ForwardDateRefiner = class {
      refine(context, results) {
        if (!context.option.forwardDate) {
          return results;
        }
        results.forEach(function(result) {
          let refMoment = dayjs_1.default(context.refDate);
          if (result.start.isOnlyDayMonthComponent() && refMoment.isAfter(result.start.dayjs())) {
            for (let i = 0; i < 3 && refMoment.isAfter(result.start.dayjs()); i++) {
              result.start.imply("year", result.start.get("year") + 1);
              context.debug(() => {
                console.log(`Forward yearly adjusted for ${result} (${result.start})`);
              });
              if (result.end && !result.end.isCertain("year")) {
                result.end.imply("year", result.end.get("year") + 1);
                context.debug(() => {
                  console.log(`Forward yearly adjusted for ${result} (${result.end})`);
                });
              }
            }
          }
          if (result.start.isOnlyWeekdayComponent() && refMoment.isAfter(result.start.dayjs())) {
            if (refMoment.day() > result.start.get("weekday")) {
              refMoment = refMoment.day(result.start.get("weekday") + 7);
            } else {
              refMoment = refMoment.day(result.start.get("weekday"));
            }
            result.start.imply("day", refMoment.date());
            result.start.imply("month", refMoment.month() + 1);
            result.start.imply("year", refMoment.year());
            context.debug(() => {
              console.log(`Forward weekly adjusted for ${result} (${result.start})`);
            });
            if (result.end && result.end.isOnlyWeekdayComponent()) {
              if (refMoment.day() > result.end.get("weekday")) {
                refMoment = refMoment.day(result.end.get("weekday") + 7);
              } else {
                refMoment = refMoment.day(result.end.get("weekday"));
              }
              result.end.imply("day", refMoment.date());
              result.end.imply("month", refMoment.month() + 1);
              result.end.imply("year", refMoment.year());
              context.debug(() => {
                console.log(`Forward weekly adjusted for ${result} (${result.end})`);
              });
            }
          }
        });
        return results;
      }
    };
    exports2.default = ForwardDateRefiner;
  }
});

// node_modules/chrono-node/dist/common/refiners/UnlikelyFormatFilter.js
var require_UnlikelyFormatFilter = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/UnlikelyFormatFilter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var abstractRefiners_1 = require_abstractRefiners();
    var UnlikelyFormatFilter = class extends abstractRefiners_1.Filter {
      constructor(strictMode) {
        super();
        this.strictMode = strictMode;
      }
      isValid(context, result) {
        if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
          context.debug(() => {
            console.log(`Removing unlikely result '${result.text}'`);
          });
          return false;
        }
        if (!result.start.isValidDate()) {
          context.debug(() => {
            console.log(`Removing invalid result: ${result} (${result.start})`);
          });
          return false;
        }
        if (result.end && !result.end.isValidDate()) {
          context.debug(() => {
            console.log(`Removing invalid result: ${result} (${result.end})`);
          });
          return false;
        }
        if (this.strictMode) {
          return this.isStrictModeValid(context, result);
        }
        return true;
      }
      isStrictModeValid(context, result) {
        if (result.start.isOnlyWeekdayComponent()) {
          context.debug(() => {
            console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
          });
          return false;
        }
        if (result.start.isOnlyTime() && (!result.start.isCertain("hour") || !result.start.isCertain("minute"))) {
          context.debug(() => {
            console.log(`(Strict) Removing uncertain time component: ${result} (${result.end})`);
          });
          return false;
        }
        return true;
      }
    };
    exports2.default = UnlikelyFormatFilter;
  }
});

// node_modules/chrono-node/dist/common/parsers/ISOFormatParser.js
var require_ISOFormatParser = __commonJS({
  "node_modules/chrono-node/dist/common/parsers/ISOFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})(?:T([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2})(?:\\.(\\d{1,4}))?)?(?:Z|([+-]\\d{2}):?(\\d{2})?)?)?(?=\\W|$)", "i");
    var YEAR_NUMBER_GROUP = 1;
    var MONTH_NUMBER_GROUP = 2;
    var DATE_NUMBER_GROUP = 3;
    var HOUR_NUMBER_GROUP = 4;
    var MINUTE_NUMBER_GROUP = 5;
    var SECOND_NUMBER_GROUP = 6;
    var MILLISECOND_NUMBER_GROUP = 7;
    var TZD_HOUR_OFFSET_GROUP = 8;
    var TZD_MINUTE_OFFSET_GROUP = 9;
    var ISOFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const components = {};
        components["year"] = parseInt(match[YEAR_NUMBER_GROUP]);
        components["month"] = parseInt(match[MONTH_NUMBER_GROUP]);
        components["day"] = parseInt(match[DATE_NUMBER_GROUP]);
        if (match[HOUR_NUMBER_GROUP] != null) {
          components["hour"] = parseInt(match[HOUR_NUMBER_GROUP]);
          components["minute"] = parseInt(match[MINUTE_NUMBER_GROUP]);
          if (match[SECOND_NUMBER_GROUP] != null) {
            components["second"] = parseInt(match[SECOND_NUMBER_GROUP]);
          }
          if (match[MILLISECOND_NUMBER_GROUP] != null) {
            components["millisecond"] = parseInt(match[MILLISECOND_NUMBER_GROUP]);
          }
          if (match[TZD_HOUR_OFFSET_GROUP] == null) {
            components["timezoneOffset"] = 0;
          } else {
            const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
            let minuteOffset = 0;
            if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
              minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
            }
            let offset = hourOffset * 60;
            if (offset < 0) {
              offset -= minuteOffset;
            } else {
              offset += minuteOffset;
            }
            components["timezoneOffset"] = offset;
          }
        }
        return components;
      }
    };
    exports2.default = ISOFormatParser;
  }
});

// node_modules/chrono-node/dist/common/refiners/MergeWeekdayComponentRefiner.js
var require_MergeWeekdayComponentRefiner = __commonJS({
  "node_modules/chrono-node/dist/common/refiners/MergeWeekdayComponentRefiner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var abstractRefiners_1 = require_abstractRefiners();
    var MergeWeekdayComponentRefiner = class extends abstractRefiners_1.MergingRefiner {
      mergeResults(textBetween, currentResult, nextResult) {
        const newResult = nextResult.clone();
        newResult.index = currentResult.index;
        newResult.text = currentResult.text + textBetween + newResult.text;
        newResult.start.assign("weekday", currentResult.start.get("weekday"));
        if (newResult.end) {
          newResult.end.assign("weekday", currentResult.start.get("weekday"));
        }
        return newResult;
      }
      shouldMergeResults(textBetween, currentResult, nextResult) {
        const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() && !currentResult.start.isCertain("hour") && nextResult.start.isCertain("day");
        return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
      }
    };
    exports2.default = MergeWeekdayComponentRefiner;
  }
});

// node_modules/chrono-node/dist/configurations.js
var require_configurations = __commonJS({
  "node_modules/chrono-node/dist/configurations.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.includeCommonConfiguration = void 0;
    var ExtractTimezoneAbbrRefiner_1 = __importDefault(require_ExtractTimezoneAbbrRefiner());
    var ExtractTimezoneOffsetRefiner_1 = __importDefault(require_ExtractTimezoneOffsetRefiner());
    var OverlapRemovalRefiner_1 = __importDefault(require_OverlapRemovalRefiner());
    var ForwardDateRefiner_1 = __importDefault(require_ForwardDateRefiner());
    var UnlikelyFormatFilter_1 = __importDefault(require_UnlikelyFormatFilter());
    var ISOFormatParser_1 = __importDefault(require_ISOFormatParser());
    var MergeWeekdayComponentRefiner_1 = __importDefault(require_MergeWeekdayComponentRefiner());
    function includeCommonConfiguration(configuration, strictMode = false) {
      configuration.parsers.unshift(new ISOFormatParser_1.default());
      configuration.refiners.unshift(new MergeWeekdayComponentRefiner_1.default());
      configuration.refiners.unshift(new ExtractTimezoneAbbrRefiner_1.default());
      configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner_1.default());
      configuration.refiners.unshift(new OverlapRemovalRefiner_1.default());
      configuration.refiners.push(new ForwardDateRefiner_1.default());
      configuration.refiners.push(new UnlikelyFormatFilter_1.default(strictMode));
      return configuration;
    }
    exports2.includeCommonConfiguration = includeCommonConfiguration;
  }
});

// node_modules/chrono-node/dist/common/casualReferences.js
var require_casualReferences = __commonJS({
  "node_modules/chrono-node/dist/common/casualReferences.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.tonight = exports2.tomorrow = exports2.yesterday = exports2.today = exports2.now = void 0;
    var results_1 = require_results();
    var dayjs_1 = __importDefault(require_dayjs_min());
    var dayjs_2 = require_dayjs();
    var index_1 = require_dist();
    function now(refDate) {
      const targetDate = dayjs_1.default(refDate);
      const component = new results_1.ParsingComponents(refDate, {});
      dayjs_2.assignSimilarDate(component, targetDate);
      dayjs_2.assignSimilarTime(component, targetDate);
      return component;
    }
    exports2.now = now;
    function today(refDate) {
      const targetDate = dayjs_1.default(refDate);
      const component = new results_1.ParsingComponents(refDate, {});
      dayjs_2.assignSimilarDate(component, targetDate);
      dayjs_2.implySimilarTime(component, targetDate);
      return component;
    }
    exports2.today = today;
    function yesterday(refDate) {
      let targetDate = dayjs_1.default(refDate);
      const component = new results_1.ParsingComponents(refDate, {});
      targetDate = targetDate.add(-1, "day");
      dayjs_2.assignSimilarDate(component, targetDate);
      dayjs_2.implySimilarTime(component, targetDate);
      return component;
    }
    exports2.yesterday = yesterday;
    function tomorrow(refDate) {
      const targetDate = dayjs_1.default(refDate);
      const component = new results_1.ParsingComponents(refDate, {});
      dayjs_2.assignTheNextDay(component, targetDate);
      return component;
    }
    exports2.tomorrow = tomorrow;
    function tonight(refDate, implyHour = 22) {
      const targetDate = dayjs_1.default(refDate);
      const component = new results_1.ParsingComponents(refDate, {});
      component.imply("hour", implyHour);
      component.imply("meridiem", index_1.Meridiem.PM);
      dayjs_2.assignSimilarDate(component, targetDate);
      return component;
    }
    exports2.tonight = tonight;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENCasualDateParser.js
var require_ENCasualDateParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENCasualDateParser.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dayjs_1 = __importDefault(require_dayjs_min());
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_2 = require_dayjs();
    var references = __importStar(require_casualReferences());
    var PATTERN = /(now|today|tonight|tomorrow|tmr|yesterday|last\s*night)(?=\W|$)/i;
    var ENCasualDateParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return PATTERN;
      }
      innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
          case "now":
            return references.now(context.refDate);
          case "today":
            return references.today(context.refDate);
          case "yesterday":
            return references.yesterday(context.refDate);
          case "tomorrow":
          case "tmr":
            return references.tomorrow(context.refDate);
          case "tonight":
            return references.tonight(context.refDate);
          default:
            if (lowerText.match(/last\s*night/)) {
              if (targetDate.hour() > 6) {
                targetDate = targetDate.add(-1, "day");
              }
              dayjs_2.assignSimilarDate(component, targetDate);
              component.imply("hour", 0);
            }
            break;
        }
        return component;
      }
    };
    exports2.default = ENCasualDateParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENCasualTimeParser.js
var require_ENCasualTimeParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENCasualTimeParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var index_1 = require_dist();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_1 = __importDefault(require_dayjs_min());
    var dayjs_2 = require_dayjs();
    var PATTERN = /(?:this)?\s*(morning|afternoon|evening|night|midnight|noon)(?=\W|$)/i;
    var ENCasualTimeParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
          case "afternoon":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 15);
            break;
          case "evening":
          case "night":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 20);
            break;
          case "midnight":
            dayjs_2.assignTheNextDay(component, targetDate);
            component.imply("hour", 0);
            component.imply("minute", 0);
            component.imply("second", 0);
            break;
          case "morning":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 6);
            break;
          case "noon":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 12);
            break;
        }
        return component;
      }
    };
    exports2.default = ENCasualTimeParser;
  }
});

// node_modules/chrono-node/dist/calculation/weeks.js
var require_weeks = __commonJS({
  "node_modules/chrono-node/dist/calculation/weeks.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toDayJSClosestWeekday = exports2.toDayJSWeekday = void 0;
    var dayjs_1 = __importDefault(require_dayjs_min());
    function toDayJSWeekday(refDate, offset, modifier) {
      if (!modifier) {
        return toDayJSClosestWeekday(refDate, offset);
      }
      let date = dayjs_1.default(refDate);
      switch (modifier) {
        case "this":
          date = date.day(offset);
          break;
        case "next":
          date = date.day(offset + 7);
          break;
        case "last":
          date = date.day(offset - 7);
          break;
      }
      return date;
    }
    exports2.toDayJSWeekday = toDayJSWeekday;
    function toDayJSClosestWeekday(refDate, offset) {
      let date = dayjs_1.default(refDate);
      const refOffset = date.day();
      if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
        date = date.day(offset - 7);
      } else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
        date = date.day(offset + 7);
      } else {
        date = date.day(offset);
      }
      return date;
    }
    exports2.toDayJSClosestWeekday = toDayJSClosestWeekday;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENWeekdayParser.js
var require_ENWeekdayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENWeekdayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var weeks_1 = require_weeks();
    var PATTERN = new RegExp(`(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:on\\s*?)?(?:(this|last|past|next)\\s*)?(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(this|last|past|next)\\s*week)?(?=\\W|$)`, "i");
    var PREFIX_GROUP = 1;
    var WEEKDAY_GROUP = 2;
    var POSTFIX_GROUP = 3;
    var ENWeekdayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "last" || modifierWord == "past") {
          modifier = "last";
        } else if (modifierWord == "next") {
          modifier = "next";
        } else if (modifierWord == "this") {
          modifier = "this";
        }
        const date = weeks_1.toDayJSWeekday(context.refDate, offset, modifier);
        return context.createParsingComponents().assign("weekday", offset).imply("day", date.date()).imply("month", date.month() + 1).imply("year", date.year());
      }
    };
    exports2.default = ENWeekdayParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENRelativeDateFormatParser.js
var require_ENRelativeDateFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENRelativeDateFormatParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var results_1 = require_results();
    var dayjs_1 = __importDefault(require_dayjs_min());
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var pattern_1 = require_pattern();
    var PATTERN = new RegExp(`(this|next|last|past)\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})(?=\\s*)(?=\\W|$)`, "i");
    var MODIFIER_WORD_GROUP = 1;
    var RELATIVE_WORD_GROUP = 2;
    var ENRelativeDateFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
        if (modifier == "next") {
          const timeUnits = {};
          timeUnits[timeunit] = 1;
          return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
        }
        if (modifier == "last" || modifier == "past") {
          const timeUnits = {};
          timeUnits[timeunit] = -1;
          return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
        }
        const components = context.createParsingComponents();
        let date = dayjs_1.default(context.refDate);
        if (unitWord.match(/week/i)) {
          date = date.add(-date.get("d"), "d");
          components.imply("day", date.date());
          components.imply("month", date.month() + 1);
          components.imply("year", date.year());
        } else if (unitWord.match(/month/i)) {
          date = date.add(-date.date() + 1, "d");
          components.imply("day", date.date());
          components.assign("year", date.year());
          components.assign("month", date.month() + 1);
        } else if (unitWord.match(/year/i)) {
          date = date.add(-date.date() + 1, "d");
          date = date.add(-date.month(), "month");
          components.imply("day", date.date());
          components.imply("month", date.month() + 1);
          components.assign("year", date.year());
        }
        return components;
      }
    };
    exports2.default = ENRelativeDateFormatParser;
  }
});

// node_modules/chrono-node/dist/chrono.js
var require_chrono = __commonJS({
  "node_modules/chrono-node/dist/chrono.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ParsingContext = exports2.Chrono = void 0;
    var results_1 = require_results();
    var en_1 = require_en();
    var Chrono = class _Chrono {
      constructor(configuration) {
        configuration = configuration || en_1.createCasualConfiguration();
        this.parsers = [...configuration.parsers];
        this.refiners = [...configuration.refiners];
      }
      clone() {
        return new _Chrono({
          parsers: [...this.parsers],
          refiners: [...this.refiners]
        });
      }
      parseDate(text, referenceDate, option) {
        const results = this.parse(text, referenceDate, option);
        return results.length > 0 ? results[0].start.date() : null;
      }
      parse(text, referenceDate, option) {
        const context = new ParsingContext(text, referenceDate || /* @__PURE__ */ new Date(), option || {});
        let results = [];
        this.parsers.forEach((parser) => {
          const parsedResults = _Chrono.executeParser(context, parser);
          results = results.concat(parsedResults);
        });
        results.sort((a, b) => {
          return a.index - b.index;
        });
        this.refiners.forEach(function(refiner) {
          results = refiner.refine(context, results);
        });
        return results;
      }
      static executeParser(context, parser) {
        const results = [];
        const pattern = parser.pattern(context);
        const originalText = context.text;
        let remainingText = context.text;
        let match = pattern.exec(remainingText);
        while (match) {
          const index = match.index + originalText.length - remainingText.length;
          match.index = index;
          const result = parser.extract(context, match);
          if (!result) {
            remainingText = originalText.substring(match.index + 1);
            match = pattern.exec(remainingText);
            continue;
          }
          let parsedResult = null;
          if (result instanceof results_1.ParsingResult) {
            parsedResult = result;
          } else if (result instanceof results_1.ParsingComponents) {
            parsedResult = context.createParsingResult(match.index, match[0]);
            parsedResult.start = result;
          } else {
            parsedResult = context.createParsingResult(match.index, match[0], result);
          }
          context.debug(() => console.log(`${parser.constructor.name} extracted result ${parsedResult}`));
          results.push(parsedResult);
          remainingText = originalText.substring(index + parsedResult.text.length);
          match = pattern.exec(remainingText);
        }
        return results;
      }
    };
    exports2.Chrono = Chrono;
    var ParsingContext = class {
      constructor(text, refDate, option) {
        this.text = text;
        this.refDate = refDate;
        this.option = option;
      }
      createParsingComponents(components) {
        if (components instanceof results_1.ParsingComponents) {
          return components;
        }
        return new results_1.ParsingComponents(this.refDate, components);
      }
      createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
        const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
        const start = startComponents ? this.createParsingComponents(startComponents) : null;
        const end = endComponents ? this.createParsingComponents(endComponents) : null;
        return new results_1.ParsingResult(this.refDate, index, text, start, end);
      }
      debug(block) {
        if (this.option.debug) {
          if (this.option.debug instanceof Function) {
            this.option.debug(block);
          } else {
            const handler = this.option.debug;
            handler.debug(block);
          }
        }
      }
    };
    exports2.ParsingContext = ParsingContext;
  }
});

// node_modules/chrono-node/dist/common/parsers/SlashDateFormatParser.js
var require_SlashDateFormatParser = __commonJS({
  "node_modules/chrono-node/dist/common/parsers/SlashDateFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var PATTERN = new RegExp("([^\\d]|^)([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?(\\W|$)", "i");
    var OPENING_GROUP = 1;
    var ENDING_GROUP = 5;
    var FIRST_NUMBERS_GROUP = 2;
    var SECOND_NUMBERS_GROUP = 3;
    var YEAR_GROUP = 4;
    var SlashDateFormatParser = class {
      constructor(littleEndian) {
        this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
        this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
      }
      pattern() {
        return PATTERN;
      }
      extract(context, match) {
        if (match[OPENING_GROUP] == "/" || match[ENDING_GROUP] == "/") {
          match.index += match[0].length;
          return;
        }
        const index = match.index + match[OPENING_GROUP].length;
        const text = match[0].substr(match[OPENING_GROUP].length, match[0].length - match[OPENING_GROUP].length - match[ENDING_GROUP].length);
        if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
          return;
        }
        if (!match[YEAR_GROUP] && match[0].indexOf("/") < 0) {
          return;
        }
        const result = context.createParsingResult(index, text);
        let month = parseInt(match[this.groupNumberMonth]);
        let day = parseInt(match[this.groupNumberDay]);
        if (month < 1 || month > 12) {
          if (month > 12) {
            if (day >= 1 && day <= 12 && month <= 31) {
              [day, month] = [month, day];
            } else {
              return null;
            }
          }
        }
        if (day < 1 || day > 31) {
          return null;
        }
        result.start.assign("day", day);
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
          const rawYearNumber = parseInt(match[YEAR_GROUP]);
          const year = years_1.findMostLikelyADYear(rawYearNumber);
          result.start.assign("year", year);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          result.start.imply("year", year);
        }
        return result;
      }
    };
    exports2.default = SlashDateFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitCasualRelativeFormatParser.js
var require_ENTimeUnitCasualRelativeFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/en/parsers/ENTimeUnitCasualRelativeFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var timeunits_1 = require_timeunits();
    var PATTERN = new RegExp(`(this|last|past|next|\\+|-)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    var ENTimeUnitCasualRelativeFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const prefix = match[1].toLowerCase();
        let timeUnits = constants_1.parseTimeUnits(match[2]);
        switch (prefix) {
          case "last":
          case "past":
          case "-":
            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
            break;
        }
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
      }
    };
    exports2.default = ENTimeUnitCasualRelativeFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/en/index.js
var require_en = __commonJS({
  "node_modules/chrono-node/dist/locales/en/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConfiguration = exports2.createCasualConfiguration = exports2.parseDate = exports2.parse = exports2.GB = exports2.strict = exports2.casual = void 0;
    var ENTimeUnitWithinFormatParser_1 = __importDefault(require_ENTimeUnitWithinFormatParser());
    var ENMonthNameLittleEndianParser_1 = __importDefault(require_ENMonthNameLittleEndianParser());
    var ENMonthNameMiddleEndianParser_1 = __importDefault(require_ENMonthNameMiddleEndianParser());
    var ENMonthNameParser_1 = __importDefault(require_ENMonthNameParser());
    var ENCasualYearMonthDayParser_1 = __importDefault(require_ENCasualYearMonthDayParser());
    var ENSlashMonthFormatParser_1 = __importDefault(require_ENSlashMonthFormatParser());
    var ENTimeExpressionParser_1 = __importDefault(require_ENTimeExpressionParser());
    var ENTimeUnitAgoFormatParser_1 = __importDefault(require_ENTimeUnitAgoFormatParser());
    var ENTimeUnitLaterFormatParser_1 = __importDefault(require_ENTimeUnitLaterFormatParser());
    var ENMergeDateRangeRefiner_1 = __importDefault(require_ENMergeDateRangeRefiner());
    var ENMergeDateTimeRefiner_1 = __importDefault(require_ENMergeDateTimeRefiner());
    var configurations_1 = require_configurations();
    var ENCasualDateParser_1 = __importDefault(require_ENCasualDateParser());
    var ENCasualTimeParser_1 = __importDefault(require_ENCasualTimeParser());
    var ENWeekdayParser_1 = __importDefault(require_ENWeekdayParser());
    var ENRelativeDateFormatParser_1 = __importDefault(require_ENRelativeDateFormatParser());
    var chrono_1 = require_chrono();
    var SlashDateFormatParser_1 = __importDefault(require_SlashDateFormatParser());
    var ENTimeUnitCasualRelativeFormatParser_1 = __importDefault(require_ENTimeUnitCasualRelativeFormatParser());
    exports2.casual = new chrono_1.Chrono(createCasualConfiguration(false));
    exports2.strict = new chrono_1.Chrono(createConfiguration(true, false));
    exports2.GB = new chrono_1.Chrono(createConfiguration(false, true));
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
    function createCasualConfiguration(littleEndian = false) {
      const option = createConfiguration(false, littleEndian);
      option.parsers.unshift(new ENCasualDateParser_1.default());
      option.parsers.unshift(new ENCasualTimeParser_1.default());
      option.parsers.unshift(new ENMonthNameParser_1.default());
      option.parsers.unshift(new ENRelativeDateFormatParser_1.default());
      option.parsers.unshift(new ENTimeUnitCasualRelativeFormatParser_1.default());
      return option;
    }
    exports2.createCasualConfiguration = createCasualConfiguration;
    function createConfiguration(strictMode = true, littleEndian = false) {
      return configurations_1.includeCommonConfiguration({
        parsers: [
          new SlashDateFormatParser_1.default(littleEndian),
          new ENTimeUnitWithinFormatParser_1.default(),
          new ENMonthNameLittleEndianParser_1.default(),
          new ENMonthNameMiddleEndianParser_1.default(),
          new ENWeekdayParser_1.default(),
          new ENCasualYearMonthDayParser_1.default(),
          new ENSlashMonthFormatParser_1.default(),
          new ENTimeExpressionParser_1.default(strictMode),
          new ENTimeUnitAgoFormatParser_1.default(strictMode),
          new ENTimeUnitLaterFormatParser_1.default(strictMode)
        ],
        refiners: [new ENMergeDateTimeRefiner_1.default(), new ENMergeDateRangeRefiner_1.default()]
      }, strictMode);
    }
    exports2.createConfiguration = createConfiguration;
  }
});

// node_modules/chrono-node/dist/locales/de/parsers/DETimeExpressionParser.js
var require_DETimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/locales/de/parsers/DETimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractTimeExpressionParser_1 = require_AbstractTimeExpressionParser();
    var index_1 = require_dist();
    var DETimeExpressionParser = class extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
      primaryPrefix() {
        return "(?:(?:um|von)\\s*)?";
      }
      followingPhase() {
        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|bis)\\s*";
      }
      primarySuffix() {
        return "(?:\\s*uhr)?(?:\\s*(?:morgens|vormittags|nachmittags|abends|nachts))?(?=\\W|$)";
      }
      extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
          if (match[0].endsWith("morgens") || match[0].endsWith("vormittags")) {
            components.assign("meridiem", index_1.Meridiem.AM);
            const hour = components.get("hour");
            if (hour < 12) {
              components.assign("hour", components.get("hour"));
            }
          }
          if (match[0].endsWith("nachmittags") || match[0].endsWith("abends") || match[0].endsWith("nachts")) {
            components.assign("meridiem", index_1.Meridiem.PM);
            const hour = components.get("hour");
            if (hour < 12) {
              components.assign("hour", components.get("hour") + 12);
            }
          }
        }
        return components;
      }
    };
    exports2.default = DETimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/locales/de/constants.js
var require_constants2 = __commonJS({
  "node_modules/chrono-node/dist/locales/de/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseTimeUnits = exports2.TIME_UNITS_PATTERN = exports2.parseYear = exports2.YEAR_PATTERN = exports2.parseNumberPattern = exports2.NUMBER_PATTERN = exports2.TIME_UNIT_DICTIONARY = exports2.INTEGER_WORD_DICTIONARY = exports2.MONTH_DICTIONARY = exports2.WEEKDAY_DICTIONARY = void 0;
    var pattern_1 = require_pattern();
    var years_1 = require_years();
    exports2.WEEKDAY_DICTIONARY = {
      "sonntag": 0,
      "so": 0,
      "montag": 1,
      "mo": 1,
      "dienstag": 2,
      "di": 2,
      "mittwoch": 3,
      "mi": 3,
      "donnerstag": 4,
      "do": 4,
      "freitag": 5,
      "fr": 5,
      "samstag": 6,
      "sa": 6
    };
    exports2.MONTH_DICTIONARY = {
      "januar": 1,
      "jan": 1,
      "jan.": 1,
      "februar": 2,
      "feb": 2,
      "feb.": 2,
      "m\xE4rz": 3,
      "maerz": 3,
      "m\xE4r": 3,
      "m\xE4r.": 3,
      "mrz": 3,
      "mrz.": 3,
      "april": 4,
      "apr": 4,
      "apr.": 4,
      "mai": 5,
      "juni": 6,
      "jun": 6,
      "jun.": 6,
      "juli": 7,
      "jul": 7,
      "jul.": 7,
      "august": 8,
      "aug": 8,
      "aug.": 8,
      "september": 9,
      "sep": 9,
      "sep.": 9,
      "sept": 9,
      "sept.": 9,
      "oktober": 10,
      "okt": 10,
      "okt.": 10,
      "november": 11,
      "nov": 11,
      "nov.": 11,
      "dezember": 12,
      "dez": 12,
      "dez.": 12
    };
    exports2.INTEGER_WORD_DICTIONARY = {
      "eins": 1,
      "zwei": 2,
      "drei": 3,
      "vier": 4,
      "f\xFCnf": 5,
      "fuenf": 5,
      "sechs": 6,
      "sieben": 7,
      "acht": 8,
      "neun": 9,
      "zehn": 10,
      "elf": 11,
      "zw\xF6lf": 12,
      "zwoelf": 12
    };
    exports2.TIME_UNIT_DICTIONARY = {
      sec: "second",
      second: "second",
      seconds: "second",
      min: "minute",
      mins: "minute",
      minute: "minute",
      minutes: "minute",
      h: "hour",
      hr: "hour",
      hrs: "hour",
      hour: "hour",
      hours: "hour",
      day: "d",
      days: "d",
      week: "week",
      weeks: "week",
      month: "month",
      months: "month",
      y: "year",
      yr: "year",
      year: "year",
      years: "year"
    };
    exports2.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports2.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
    function parseNumberPattern(match) {
      const num = match.toLowerCase();
      if (exports2.INTEGER_WORD_DICTIONARY[num] !== void 0) {
        return exports2.INTEGER_WORD_DICTIONARY[num];
      } else if (num === "a" || num === "an") {
        return 1;
      } else if (num.match(/few/)) {
        return 3;
      } else if (num.match(/half/)) {
        return 0.5;
      } else if (num.match(/couple/)) {
        return 2;
      } else if (num.match(/several/)) {
        return 7;
      }
      return parseFloat(num);
    }
    exports2.parseNumberPattern = parseNumberPattern;
    exports2.YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?)`;
    function parseYear(match) {
      if (/v/i.test(match)) {
        return -parseInt(match.replace(/[^0-9]+/gi, ""));
      }
      if (/n/i.test(match)) {
        return parseInt(match.replace(/[^0-9]+/gi, ""));
      }
      const rawYearNumber = parseInt(match);
      return years_1.findMostLikelyADYear(rawYearNumber);
    }
    exports2.parseYear = parseYear;
    var SINGLE_TIME_UNIT_PATTERN = `(${exports2.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports2.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    exports2.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
    function parseTimeUnits(timeunitText) {
      const fragments = {};
      let remainingText = timeunitText;
      let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      }
      return fragments;
    }
    exports2.parseTimeUnits = parseTimeUnits;
    function collectDateTimeFragment(fragments, match) {
      const num = parseNumberPattern(match[1]);
      const unit = exports2.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
      fragments[unit] = num;
    }
  }
});

// node_modules/chrono-node/dist/locales/de/parsers/DEWeekdayParser.js
var require_DEWeekdayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/de/parsers/DEWeekdayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants2();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var weeks_1 = require_weeks();
    var PATTERN = new RegExp(`(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:a[mn]\\s*?)?(?:(diese[mn]|letzte[mn]|n(?:\xE4|ae)chste[mn])\\s*)?(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(diese|letzte|n(?:\xE4|ae)chste)\\s*woche)?(?=\\W|$)`, "i");
    var PREFIX_GROUP = 1;
    var SUFFIX_GROUP = 3;
    var WEEKDAY_GROUP = 2;
    var DEWeekdayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[SUFFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord.match(/letzte/)) {
          modifier = "last";
        } else if (modifierWord.match(/chste/)) {
          modifier = "next";
        } else if (modifierWord.match(/diese/)) {
          modifier = "this";
        }
        const date = weeks_1.toDayJSWeekday(context.refDate, offset, modifier);
        return context.createParsingComponents().assign("weekday", offset).imply("day", date.date()).imply("month", date.month() + 1).imply("year", date.year());
      }
    };
    exports2.default = DEWeekdayParser;
  }
});

// node_modules/chrono-node/dist/locales/de/refiners/DEMergeDateRangeRefiner.js
var require_DEMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/de/refiners/DEMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateRangeRefiner_1 = __importDefault(require_AbstractMergeDateRangeRefiner());
    var DEMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner_1.default {
      patternBetween() {
        return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i;
      }
    };
    exports2.default = DEMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/de/refiners/DEMergeDateTimeRefiner.js
var require_DEMergeDateTimeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/de/refiners/DEMergeDateTimeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateTimeRefiner_1 = __importDefault(require_AbstractMergeDateTimeRefiner());
    var DEMergeDateTimeRefiner = class extends AbstractMergeDateTimeRefiner_1.default {
      patternBetween() {
        return new RegExp("^\\s*(T|um|am|,|-)?\\s*$");
      }
    };
    exports2.default = DEMergeDateTimeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/de/parsers/DECasualTimeParser.js
var require_DECasualTimeParser = __commonJS({
  "node_modules/chrono-node/dist/locales/de/parsers/DECasualTimeParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dayjs_1 = __importDefault(require_dayjs_min());
    var index_1 = require_dist();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_2 = require_dayjs();
    var timeunits_1 = require_timeunits();
    var DECasualTimeParser = class _DECasualTimeParser extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const timeKeywordPattern = match[2].toLowerCase();
        const component = context.createParsingComponents();
        dayjs_2.implySimilarTime(component, targetDate);
        return _DECasualTimeParser.extractTimeComponents(component, timeKeywordPattern);
      }
      static extractTimeComponents(component, timeKeywordPattern) {
        switch (timeKeywordPattern) {
          case "morgen":
            component.imply("hour", 6);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
          case "vormittag":
            component.imply("hour", 9);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
          case "mittag":
          case "mittags":
            component.imply("hour", 12);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
          case "nachmittag":
            component.imply("hour", 15);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.PM);
            break;
          case "abend":
            component.imply("hour", 18);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.PM);
            break;
          case "nacht":
            component.imply("hour", 22);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.PM);
            break;
          case "mitternacht":
            if (component.get("hour") > 1) {
              component = timeunits_1.addImpliedTimeUnits(component, { "day": 1 });
            }
            component.imply("hour", 0);
            component.imply("minute", 0);
            component.imply("second", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
        }
        return component;
      }
    };
    exports2.default = DECasualTimeParser;
  }
});

// node_modules/chrono-node/dist/locales/de/parsers/DECasualDateParser.js
var require_DECasualDateParser = __commonJS({
  "node_modules/chrono-node/dist/locales/de/parsers/DECasualDateParser.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dayjs_1 = __importDefault(require_dayjs_min());
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_2 = require_dayjs();
    var DECasualTimeParser_1 = __importDefault(require_DECasualTimeParser());
    var references = __importStar(require_casualReferences());
    var PATTERN = new RegExp(`(jetzt|heute|morgen|\xFCbermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?(?=\\W|$)`, "i");
    var DATE_GROUP = 1;
    var TIME_GROUP = 2;
    var DECasualDateParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return PATTERN;
      }
      innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
        const timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
        let component = context.createParsingComponents();
        switch (dateKeyword) {
          case "jetzt":
            component = references.now(context.refDate);
            break;
          case "heute":
            component = references.today(context.refDate);
            break;
          case "morgen":
            dayjs_2.assignTheNextDay(component, targetDate);
            break;
          case "\xFCbermorgen":
          case "uebermorgen":
            targetDate = targetDate.add(1, "day");
            dayjs_2.assignTheNextDay(component, targetDate);
            break;
          case "gestern":
            targetDate = targetDate.add(-1, "day");
            dayjs_2.assignSimilarDate(component, targetDate);
            dayjs_2.implySimilarTime(component, targetDate);
            break;
          case "vorgestern":
            targetDate = targetDate.add(-2, "day");
            dayjs_2.assignSimilarDate(component, targetDate);
            dayjs_2.implySimilarTime(component, targetDate);
            break;
          default:
            if (dateKeyword.match(/letzte\s*nacht/)) {
              if (targetDate.hour() > 6) {
                targetDate = targetDate.add(-1, "day");
              }
              dayjs_2.assignSimilarDate(component, targetDate);
              component.imply("hour", 0);
            }
            break;
        }
        if (timeKeyword) {
          component = DECasualTimeParser_1.default.extractTimeComponents(component, timeKeyword);
        }
        return component;
      }
    };
    exports2.default = DECasualDateParser;
  }
});

// node_modules/chrono-node/dist/locales/de/parsers/DEMonthNameLittleEndianParser.js
var require_DEMonthNameLittleEndianParser = __commonJS({
  "node_modules/chrono-node/dist/locales/de/parsers/DEMonthNameLittleEndianParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var constants_1 = require_constants2();
    var constants_2 = require_constants2();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`(?:am\\s*?)?(?:den\\s*?)?([0-9]{1,2})\\.(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\\u2013|\\s)\\s*([0-9]{1,2})\\.?)?\\s*(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?(?=\\W|$)`, "i");
    var DATE_GROUP = 1;
    var DATE_TO_GROUP = 2;
    var MONTH_NAME_GROUP = 3;
    var YEAR_GROUP = 4;
    var DEMonthNameLittleEndianParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
          match.index = match.index + match[DATE_GROUP].length;
          return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
          const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
          result.start.assign("year", yearNumber);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
          const endDate = parseInt(match[DATE_TO_GROUP]);
          result.end = result.start.clone();
          result.end.assign("day", endDate);
        }
        return result;
      }
    };
    exports2.default = DEMonthNameLittleEndianParser;
  }
});

// node_modules/chrono-node/dist/locales/de/index.js
var require_de = __commonJS({
  "node_modules/chrono-node/dist/locales/de/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConfiguration = exports2.createCasualConfiguration = exports2.parseDate = exports2.parse = exports2.strict = exports2.casual = void 0;
    var configurations_1 = require_configurations();
    var chrono_1 = require_chrono();
    var SlashDateFormatParser_1 = __importDefault(require_SlashDateFormatParser());
    var ISOFormatParser_1 = __importDefault(require_ISOFormatParser());
    var DETimeExpressionParser_1 = __importDefault(require_DETimeExpressionParser());
    var DEWeekdayParser_1 = __importDefault(require_DEWeekdayParser());
    var DEMergeDateRangeRefiner_1 = __importDefault(require_DEMergeDateRangeRefiner());
    var DEMergeDateTimeRefiner_1 = __importDefault(require_DEMergeDateTimeRefiner());
    var DECasualDateParser_1 = __importDefault(require_DECasualDateParser());
    var DECasualTimeParser_1 = __importDefault(require_DECasualTimeParser());
    var DEMonthNameLittleEndianParser_1 = __importDefault(require_DEMonthNameLittleEndianParser());
    exports2.casual = new chrono_1.Chrono(createCasualConfiguration());
    exports2.strict = new chrono_1.Chrono(createConfiguration(true));
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
    function createCasualConfiguration(littleEndian = true) {
      const option = createConfiguration(false, littleEndian);
      option.parsers.unshift(new DECasualTimeParser_1.default());
      option.parsers.unshift(new DECasualDateParser_1.default());
      return option;
    }
    exports2.createCasualConfiguration = createCasualConfiguration;
    function createConfiguration(strictMode = true, littleEndian = true) {
      return configurations_1.includeCommonConfiguration({
        parsers: [
          new ISOFormatParser_1.default(),
          new SlashDateFormatParser_1.default(littleEndian),
          new DETimeExpressionParser_1.default(),
          new DEMonthNameLittleEndianParser_1.default(),
          new DEWeekdayParser_1.default()
        ],
        refiners: [new DEMergeDateRangeRefiner_1.default(), new DEMergeDateTimeRefiner_1.default()]
      }, strictMode);
    }
    exports2.createConfiguration = createConfiguration;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRCasualDateParser.js
var require_FRCasualDateParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRCasualDateParser.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dayjs_1 = __importDefault(require_dayjs_min());
    var index_1 = require_dist();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_2 = require_dayjs();
    var references = __importStar(require_casualReferences());
    var FRCasualDateParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
          case "maintenant":
            return references.now(context.refDate);
          case "aujourd'hui":
            return references.today(context.refDate);
          case "hier":
            return references.yesterday(context.refDate);
          case "demain":
            return references.tomorrow(context.refDate);
          default:
            if (lowerText.match(/cette\s*nuit/)) {
              dayjs_2.assignSimilarDate(component, targetDate);
              component.imply("hour", 22);
              component.imply("meridiem", index_1.Meridiem.PM);
            } else if (lowerText.match(/la\s*veille/)) {
              targetDate = targetDate.add(-1, "day");
              dayjs_2.assignSimilarDate(component, targetDate);
              component.imply("hour", 0);
            }
        }
        return component;
      }
    };
    exports2.default = FRCasualDateParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRCasualTimeParser.js
var require_FRCasualTimeParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRCasualTimeParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var index_1 = require_dist();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var FRCasualTimeParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const suffixLower = match[2].toLowerCase();
        const component = context.createParsingComponents();
        switch (suffixLower) {
          case "apr\xE8s-midi":
          case "aprem":
            component.imply("hour", 14);
            component.imply("minute", 0);
            component.imply("meridiem", index_1.Meridiem.PM);
            break;
          case "soir":
            component.imply("hour", 18);
            component.imply("minute", 0);
            component.imply("meridiem", index_1.Meridiem.PM);
            break;
          case "matin":
            component.imply("hour", 8);
            component.imply("minute", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
          case "a midi":
            component.imply("hour", 12);
            component.imply("minute", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
          case "\xE0 minuit":
            component.imply("hour", 0);
            component.imply("meridiem", index_1.Meridiem.AM);
            break;
        }
        return component;
      }
    };
    exports2.default = FRCasualTimeParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRTimeExpressionParser.js
var require_FRTimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRTimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractTimeExpressionParser_1 = require_AbstractTimeExpressionParser();
    var FRTimeExpressionParser = class extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
      primaryPrefix() {
        return "(?:(?:[\xE0a])\\s*)?";
      }
      followingPhase() {
        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|[\xE0a]|\\?)\\s*";
      }
      extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
          return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
      }
    };
    exports2.default = FRTimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/refiners/FRMergeDateTimeRefiner.js
var require_FRMergeDateTimeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/refiners/FRMergeDateTimeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateTimeRefiner_1 = __importDefault(require_AbstractMergeDateTimeRefiner());
    var FRMergeDateTimeRefiner = class extends AbstractMergeDateTimeRefiner_1.default {
      patternBetween() {
        return new RegExp("^\\s*(T|\xE0|a|vers|de|,|-)?\\s*$");
      }
    };
    exports2.default = FRMergeDateTimeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/fr/refiners/FRMergeDateRangeRefiner.js
var require_FRMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/refiners/FRMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateRangeRefiner_1 = __importDefault(require_AbstractMergeDateRangeRefiner());
    var FRMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner_1.default {
      patternBetween() {
        return /^\s*(à|a|-)\s*$/i;
      }
    };
    exports2.default = FRMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/fr/constants.js
var require_constants3 = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseTimeUnits = exports2.TIME_UNITS_PATTERN = exports2.parseYear = exports2.YEAR_PATTERN = exports2.parseOrdinalNumberPattern = exports2.ORDINAL_NUMBER_PATTERN = exports2.parseNumberPattern = exports2.NUMBER_PATTERN = exports2.TIME_UNIT_DICTIONARY = exports2.INTEGER_WORD_DICTIONARY = exports2.MONTH_DICTIONARY = exports2.WEEKDAY_DICTIONARY = void 0;
    var pattern_1 = require_pattern();
    exports2.WEEKDAY_DICTIONARY = {
      "dimanche": 0,
      "dim": 0,
      "lundi": 1,
      "lun": 1,
      "mardi": 2,
      "mar": 2,
      "mercredi": 3,
      "mer": 3,
      "jeudi": 4,
      "jeu": 4,
      "vendredi": 5,
      "ven": 5,
      "samedi": 6,
      "sam": 6
    };
    exports2.MONTH_DICTIONARY = {
      "janvier": 1,
      "jan": 1,
      "jan.": 1,
      "f\xE9vrier": 2,
      "f\xE9v": 2,
      "f\xE9v.": 2,
      "fevrier": 2,
      "fev": 2,
      "fev.": 2,
      "mars": 3,
      "mar": 3,
      "mar.": 3,
      "avril": 4,
      "avr": 4,
      "avr.": 4,
      "mai": 5,
      "juin": 6,
      "jun": 6,
      "juillet": 7,
      "juil": 7,
      "jul": 7,
      "jul.": 7,
      "ao\xFBt": 8,
      "aout": 8,
      "septembre": 9,
      "sep": 9,
      "sep.": 9,
      "sept": 9,
      "sept.": 9,
      "octobre": 10,
      "oct": 10,
      "oct.": 10,
      "novembre": 11,
      "nov": 11,
      "nov.": 11,
      "d\xE9cembre": 12,
      "decembre": 12,
      "dec": 12,
      "dec.": 12
    };
    exports2.INTEGER_WORD_DICTIONARY = {
      "un": 1,
      "deux": 2,
      "trois": 3,
      "quatre": 4,
      "cinq": 5,
      "six": 6,
      "sept": 7,
      "huit": 8,
      "neuf": 9,
      "dix": 10,
      "onze": 11,
      "douze": 12,
      "treize": 13
    };
    exports2.TIME_UNIT_DICTIONARY = {
      "sec": "second",
      "seconde": "second",
      "secondes": "second",
      "min": "minute",
      "mins": "minute",
      "minute": "minute",
      "minutes": "minute",
      "h": "hour",
      "hr": "hour",
      "hrs": "hour",
      "heure": "hour",
      "heures": "hour",
      "jour": "d",
      "jours": "d",
      "semaine": "week",
      "semaines": "week",
      "mois": "month",
      "trimestre": "quarter",
      "trimestres": "quarter",
      "ans": "year",
      "ann\xE9e": "year",
      "ann\xE9es": "year"
    };
    exports2.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports2.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|une?|quelques?|demi-?)`;
    function parseNumberPattern(match) {
      const num = match.toLowerCase();
      if (exports2.INTEGER_WORD_DICTIONARY[num] !== void 0) {
        return exports2.INTEGER_WORD_DICTIONARY[num];
      } else if (num === "une" || num === "un") {
        return 1;
      } else if (num.match(/quelques?/)) {
        return 3;
      } else if (num.match(/demi-?/)) {
        return 0.5;
      }
      return parseFloat(num);
    }
    exports2.parseNumberPattern = parseNumberPattern;
    exports2.ORDINAL_NUMBER_PATTERN = `(?:[0-9]{1,2}(?:er)?)`;
    function parseOrdinalNumberPattern(match) {
      let num = match.toLowerCase();
      num = num.replace(/(?:er)$/i, "");
      return parseInt(num);
    }
    exports2.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    exports2.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])`;
    function parseYear(match) {
      if (/AC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
      }
      if (/AD/i.test(match) || /C/i.test(match)) {
        match = match.replace(/[^\d]+/i, "");
        return parseInt(match);
      }
      let yearNumber = parseInt(match);
      if (yearNumber < 100) {
        if (yearNumber > 50) {
          yearNumber = yearNumber + 1900;
        } else {
          yearNumber = yearNumber + 2e3;
        }
      }
      return yearNumber;
    }
    exports2.parseYear = parseYear;
    var SINGLE_TIME_UNIT_PATTERN = `(${exports2.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports2.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    exports2.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
    function parseTimeUnits(timeunitText) {
      const fragments = {};
      let remainingText = timeunitText;
      let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      }
      return fragments;
    }
    exports2.parseTimeUnits = parseTimeUnits;
    function collectDateTimeFragment(fragments, match) {
      const num = parseNumberPattern(match[1]);
      const unit = exports2.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
      fragments[unit] = num;
    }
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRWeekdayParser.js
var require_FRWeekdayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRWeekdayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var weeks_1 = require_weeks();
    var PATTERN = new RegExp(`(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:(?:ce)\\s*)?(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(dernier|prochain)\\s*)?(?=\\W|\\d|$)`, "i");
    var WEEKDAY_GROUP = 1;
    var POSTFIX_GROUP = 2;
    var FRWeekdayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
        if (offset === void 0) {
          return null;
        }
        let suffix = match[POSTFIX_GROUP];
        suffix = suffix || "";
        suffix = suffix.toLowerCase();
        let modifier = null;
        if (suffix == "dernier") {
          modifier = "last";
        } else if (suffix == "prochain") {
          modifier = "next";
        }
        const date = weeks_1.toDayJSWeekday(context.refDate, offset, modifier);
        return context.createParsingComponents().assign("weekday", offset).imply("day", date.date()).imply("month", date.month() + 1).imply("year", date.year());
      }
    };
    exports2.default = FRWeekdayParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRSpecificTimeExpressionParser.js
var require_FRSpecificTimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRSpecificTimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var index_1 = require_dist();
    var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)(?:(?:[\xE0a])\\s*)?(\\d{1,2})(?:h|:)?(?:(\\d{1,2})(?:m|:)?)?(?:(\\d{1,2})(?:s|:)?)?(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?(?=\\W|$)", "i");
    var SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\\u2013|\\~|\\\u301C|[\xE0a]|\\?)\\s*(\\d{1,2})(?:h|:)?(?:(\\d{1,2})(?:m|:)?)?(?:(\\d{1,2})(?:s|:)?)?(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?(?=\\W|$)", "i");
    var HOUR_GROUP = 2;
    var MINUTE_GROUP = 3;
    var SECOND_GROUP = 4;
    var AM_PM_HOUR_GROUP = 5;
    var FRSpecificTimeExpressionParser = class _FRSpecificTimeExpressionParser {
      pattern(context) {
        return FIRST_REG_PATTERN;
      }
      extract(context, match) {
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
        if (result.text.match(/^\d{4}$/)) {
          match.index += match[0].length;
          return null;
        }
        result.start = _FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
        if (!result.start) {
          match.index += match[0].length;
          return null;
        }
        const remainingText = context.text.substring(match.index + match[0].length);
        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
        if (secondMatch) {
          result.end = _FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
          if (result.end) {
            result.text += secondMatch[0];
          }
        }
        return result;
      }
      static extractTimeComponent(extractingComponents, match) {
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
          minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60 || hour > 24) {
          return null;
        }
        if (hour >= 12) {
          meridiem = index_1.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
          if (hour > 12)
            return null;
          const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
          if (ampm == "a") {
            meridiem = index_1.Meridiem.AM;
            if (hour == 12) {
              hour = 0;
            }
          }
          if (ampm == "p") {
            meridiem = index_1.Meridiem.PM;
            if (hour != 12) {
              hour += 12;
            }
          }
        }
        extractingComponents.assign("hour", hour);
        extractingComponents.assign("minute", minute);
        if (meridiem !== null) {
          extractingComponents.assign("meridiem", meridiem);
        } else {
          if (hour < 12) {
            extractingComponents.imply("meridiem", index_1.Meridiem.AM);
          } else {
            extractingComponents.imply("meridiem", index_1.Meridiem.PM);
          }
        }
        if (match[SECOND_GROUP] != null) {
          const second = parseInt(match[SECOND_GROUP]);
          if (second >= 60)
            return null;
          extractingComponents.assign("second", second);
        }
        return extractingComponents;
      }
    };
    exports2.default = FRSpecificTimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRMonthNameLittleEndianParser.js
var require_FRMonthNameLittleEndianParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRMonthNameLittleEndianParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var constants_1 = require_constants3();
    var constants_2 = require_constants3();
    var constants_3 = require_constants3();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`(?:on\\s*?)?(${constants_3.ORDINAL_NUMBER_PATTERN})(?:\\s*(?:au|\\-|\\\u2013|jusqu'au?|\\s)\\s*(${constants_3.ORDINAL_NUMBER_PATTERN}))?(?:-|/|\\s*(?:de)?\\s*)(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?(?=\\W|$)`, "i");
    var DATE_GROUP = 1;
    var DATE_TO_GROUP = 2;
    var MONTH_NAME_GROUP = 3;
    var YEAR_GROUP = 4;
    var FRMonthNameLittleEndianParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
          match.index = match.index + match[DATE_GROUP].length;
          return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
          const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
          result.start.assign("year", yearNumber);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
          const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
          result.end = result.start.clone();
          result.end.assign("day", endDate);
        }
        return result;
      }
    };
    exports2.default = FRMonthNameLittleEndianParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRTimeUnitAgoFormatParser.js
var require_FRTimeUnitAgoFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRTimeUnitAgoFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var timeunits_1 = require_timeunits();
    var FRTimeUnitAgoFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      constructor() {
        super();
      }
      innerPattern() {
        return new RegExp(`il y a\\s*(${constants_1.TIME_UNITS_PATTERN})(?=(?:\\W|$))`, "i");
      }
      innerExtract(context, match) {
        const timeUnits = constants_1.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, outputTimeUnits);
      }
    };
    exports2.default = FRTimeUnitAgoFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRTimeUnitWithinFormatParser.js
var require_FRTimeUnitWithinFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRTimeUnitWithinFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var FRTimeUnitWithinFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return new RegExp(`(?:dans|en|pour|pendant)\\s*(${constants_1.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
      }
      innerExtract(context, match) {
        const timeUnits = constants_1.parseTimeUnits(match[1]);
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
      }
    };
    exports2.default = FRTimeUnitWithinFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/parsers/FRTimeUnitRelativeFormatParser.js
var require_FRTimeUnitRelativeFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/parsers/FRTimeUnitRelativeFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants3();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var timeunits_1 = require_timeunits();
    var pattern_1 = require_pattern();
    var FRTimeUnitAgoFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      constructor() {
        super();
      }
      innerPattern() {
        return new RegExp(`(?:les?|la|l'|du|des?)\\s*(${constants_1.NUMBER_PATTERN})?(?:\\s*(prochaine?s?|derni[e\xE8]re?s?|pass[\xE9e]e?s?|pr[\xE9e]c[\xE9e]dents?|suivante?s?))?\\s*(${pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY)})(?:\\s*(prochaine?s?|derni[e\xE8]re?s?|pass[\xE9e]e?s?|pr[\xE9e]c[\xE9e]dents?|suivante?s?))?`, "i");
      }
      innerExtract(context, match) {
        const num = match[1] ? constants_1.parseNumberPattern(match[1]) : 1;
        const unit = constants_1.TIME_UNIT_DICTIONARY[match[3].toLowerCase()];
        let timeUnits = {};
        timeUnits[unit] = num;
        let modifier = match[2] || match[4] || "";
        modifier = modifier.toLowerCase();
        if (!modifier) {
          return;
        }
        if (/derni[eè]re?s?/.test(modifier) || /pass[ée]e?s?/.test(modifier) || /pr[ée]c[ée]dents?/.test(modifier)) {
          timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
        }
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
      }
    };
    exports2.default = FRTimeUnitAgoFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/fr/index.js
var require_fr = __commonJS({
  "node_modules/chrono-node/dist/locales/fr/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConfiguration = exports2.createCasualConfiguration = exports2.parseDate = exports2.parse = exports2.strict = exports2.casual = void 0;
    var configurations_1 = require_configurations();
    var chrono_1 = require_chrono();
    var FRCasualDateParser_1 = __importDefault(require_FRCasualDateParser());
    var FRCasualTimeParser_1 = __importDefault(require_FRCasualTimeParser());
    var SlashDateFormatParser_1 = __importDefault(require_SlashDateFormatParser());
    var FRTimeExpressionParser_1 = __importDefault(require_FRTimeExpressionParser());
    var FRMergeDateTimeRefiner_1 = __importDefault(require_FRMergeDateTimeRefiner());
    var FRMergeDateRangeRefiner_1 = __importDefault(require_FRMergeDateRangeRefiner());
    var FRWeekdayParser_1 = __importDefault(require_FRWeekdayParser());
    var FRSpecificTimeExpressionParser_1 = __importDefault(require_FRSpecificTimeExpressionParser());
    var FRMonthNameLittleEndianParser_1 = __importDefault(require_FRMonthNameLittleEndianParser());
    var FRTimeUnitAgoFormatParser_1 = __importDefault(require_FRTimeUnitAgoFormatParser());
    var FRTimeUnitWithinFormatParser_1 = __importDefault(require_FRTimeUnitWithinFormatParser());
    var FRTimeUnitRelativeFormatParser_1 = __importDefault(require_FRTimeUnitRelativeFormatParser());
    exports2.casual = new chrono_1.Chrono(createCasualConfiguration());
    exports2.strict = new chrono_1.Chrono(createConfiguration(true));
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
    function createCasualConfiguration(littleEndian = true) {
      const option = createConfiguration(false, littleEndian);
      option.parsers.unshift(new FRCasualDateParser_1.default());
      option.parsers.unshift(new FRCasualTimeParser_1.default());
      option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
      return option;
    }
    exports2.createCasualConfiguration = createCasualConfiguration;
    function createConfiguration(strictMode = true, littleEndian = true) {
      return configurations_1.includeCommonConfiguration({
        parsers: [
          new SlashDateFormatParser_1.default(littleEndian),
          new FRMonthNameLittleEndianParser_1.default(),
          new FRTimeExpressionParser_1.default(),
          new FRSpecificTimeExpressionParser_1.default(),
          new FRTimeUnitAgoFormatParser_1.default(),
          new FRTimeUnitWithinFormatParser_1.default(),
          new FRWeekdayParser_1.default()
        ],
        refiners: [new FRMergeDateTimeRefiner_1.default(), new FRMergeDateRangeRefiner_1.default()]
      }, strictMode);
    }
    exports2.createConfiguration = createConfiguration;
  }
});

// node_modules/chrono-node/dist/locales/ja/constants.js
var require_constants4 = __commonJS({
  "node_modules/chrono-node/dist/locales/ja/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toHankaku = void 0;
    function toHankaku(text) {
      return String(text).replace(/\u2019/g, "'").replace(/\u201D/g, '"').replace(/\u3000/g, " ").replace(/\uFFE5/g, "\xA5").replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
    }
    exports2.toHankaku = toHankaku;
    function alphaNum(token) {
      return String.fromCharCode(token.charCodeAt(0) - 65248);
    }
  }
});

// node_modules/chrono-node/dist/locales/ja/parsers/JPStandardParser.js
var require_JPStandardParser = __commonJS({
  "node_modules/chrono-node/dist/locales/ja/parsers/JPStandardParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants4();
    var years_1 = require_years();
    var dayjs_1 = __importDefault(require_dayjs_min());
    var PATTERN = /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
    var SPECIAL_YEAR_GROUP = 1;
    var TYPICAL_YEAR_GROUP = 2;
    var ERA_GROUP = 3;
    var YEAR_NUMBER_GROUP = 4;
    var MONTH_GROUP = 5;
    var DAY_GROUP = 6;
    var JPStandardParser = class {
      pattern() {
        return PATTERN;
      }
      extract(context, match) {
        const month = parseInt(constants_1.toHankaku(match[MONTH_GROUP]));
        const day = parseInt(constants_1.toHankaku(match[DAY_GROUP]));
        const components = context.createParsingComponents({
          day,
          month
        });
        if (match[SPECIAL_YEAR_GROUP] && match[SPECIAL_YEAR_GROUP].match("\u540C|\u4ECA|\u672C")) {
          const moment = dayjs_1.default(context.refDate);
          components.assign("year", moment.year());
        }
        if (match[TYPICAL_YEAR_GROUP]) {
          const yearNumText = match[YEAR_NUMBER_GROUP];
          let year = yearNumText == "\u5143" ? 1 : parseInt(constants_1.toHankaku(yearNumText));
          if (match[ERA_GROUP] == "\u4EE4\u548C") {
            year += 2018;
          } else if (match[ERA_GROUP] == "\u5E73\u6210") {
            year += 1988;
          } else if (match[ERA_GROUP] == "\u662D\u548C") {
            year += 1925;
          }
          components.assign("year", year);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          components.imply("year", year);
        }
        return components;
      }
    };
    exports2.default = JPStandardParser;
  }
});

// node_modules/chrono-node/dist/locales/ja/refiners/JPMergeDateRangeRefiner.js
var require_JPMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/ja/refiners/JPMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateRangeRefiner_1 = __importDefault(require_AbstractMergeDateRangeRefiner());
    var JPMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner_1.default {
      patternBetween() {
        return /^\s*(から|ー|-)\s*$/i;
      }
    };
    exports2.default = JPMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/ja/parsers/JPCasualDateParser.js
var require_JPCasualDateParser = __commonJS({
  "node_modules/chrono-node/dist/locales/ja/parsers/JPCasualDateParser.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dayjs_1 = __importDefault(require_dayjs_min());
    var index_1 = require_dist();
    var references = __importStar(require_casualReferences());
    var PATTERN = /今日|当日|昨日|明日|今夜|今夕|今晩|今朝/i;
    var JPCasualDateParser = class {
      pattern() {
        return PATTERN;
      }
      extract(context, match) {
        const text = match[0];
        const date = dayjs_1.default(context.refDate);
        const components = context.createParsingComponents();
        switch (text) {
          case "\u6628\u65E5":
            return references.yesterday(context.refDate);
          case "\u660E\u65E5":
            return references.tomorrow(context.refDate);
          case "\u4ECA\u65E5":
          case "\u5F53\u65E5":
            return references.today(context.refDate);
        }
        if (text == "\u4ECA\u591C" || text == "\u4ECA\u5915" || text == "\u4ECA\u6669") {
          components.imply("hour", 22);
          components.assign("meridiem", index_1.Meridiem.PM);
        } else if (text.match("\u4ECA\u671D")) {
          components.imply("hour", 6);
          components.assign("meridiem", index_1.Meridiem.AM);
        }
        components.assign("day", date.date());
        components.assign("month", date.month() + 1);
        components.assign("year", date.year());
        return components;
      }
    };
    exports2.default = JPCasualDateParser;
  }
});

// node_modules/chrono-node/dist/locales/ja/index.js
var require_ja = __commonJS({
  "node_modules/chrono-node/dist/locales/ja/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConfiguration = exports2.createCasualConfiguration = exports2.parseDate = exports2.parse = exports2.strict = exports2.casual = void 0;
    var JPStandardParser_1 = __importDefault(require_JPStandardParser());
    var JPMergeDateRangeRefiner_1 = __importDefault(require_JPMergeDateRangeRefiner());
    var JPCasualDateParser_1 = __importDefault(require_JPCasualDateParser());
    var chrono_1 = require_chrono();
    exports2.casual = new chrono_1.Chrono(createCasualConfiguration());
    exports2.strict = new chrono_1.Chrono(createConfiguration());
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
    function createCasualConfiguration() {
      const option = createConfiguration();
      option.parsers.unshift(new JPCasualDateParser_1.default());
      return option;
    }
    exports2.createCasualConfiguration = createCasualConfiguration;
    function createConfiguration() {
      return {
        parsers: [new JPStandardParser_1.default()],
        refiners: [new JPMergeDateRangeRefiner_1.default()]
      };
    }
    exports2.createConfiguration = createConfiguration;
  }
});

// node_modules/chrono-node/dist/locales/pt/constants.js
var require_constants5 = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseYear = exports2.YEAR_PATTERN = exports2.MONTH_DICTIONARY = exports2.WEEKDAY_DICTIONARY = void 0;
    exports2.WEEKDAY_DICTIONARY = {
      "domingo": 0,
      "dom": 0,
      "segunda": 1,
      "segunda-feira": 1,
      "seg": 1,
      "ter\xE7a": 2,
      "ter\xE7a-feira": 2,
      "ter": 2,
      "quarta": 3,
      "quarta-feira": 3,
      "qua": 3,
      "quinta": 4,
      "quinta-feira": 4,
      "qui": 4,
      "sexta": 5,
      "sexta-feira": 5,
      "sex": 5,
      "s\xE1bado": 6,
      "sabado": 6,
      "sab": 6
    };
    exports2.MONTH_DICTIONARY = {
      "janeiro": 1,
      "jan": 1,
      "jan.": 1,
      "fevereiro": 2,
      "fev": 2,
      "fev.": 2,
      "mar\xE7o": 3,
      "mar": 3,
      "mar.": 3,
      "abril": 4,
      "abr": 4,
      "abr.": 4,
      "maio": 5,
      "mai": 5,
      "mai.": 5,
      "junho": 6,
      "jun": 6,
      "jun.": 6,
      "julho": 7,
      "jul": 7,
      "jul.": 7,
      "agosto": 8,
      "ago": 8,
      "ago.": 8,
      "setembro": 9,
      "set": 9,
      "set.": 9,
      "outubro": 10,
      "out": 10,
      "out.": 10,
      "novembro": 11,
      "nov": 11,
      "nov.": 11,
      "dezembro": 12,
      "dez": 12,
      "dez.": 12
    };
    exports2.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
    function parseYear(match) {
      if (match.match(/^[0-9]{1,4}$/)) {
        let yearNumber = parseInt(match);
        if (yearNumber < 100) {
          if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
          } else {
            yearNumber = yearNumber + 2e3;
          }
        }
        return yearNumber;
      }
      if (match.match(/a\.?\s*c\.?/i)) {
        match = match.replace(/a\.?\s*c\.?/i, "");
        return -parseInt(match);
      }
      return parseInt(match);
    }
    exports2.parseYear = parseYear;
  }
});

// node_modules/chrono-node/dist/locales/pt/parsers/PTWeekdayParser.js
var require_PTWeekdayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/parsers/PTWeekdayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants5();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var weeks_1 = require_weeks();
    var PATTERN = new RegExp(`(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:(este|esta|passado|pr[o\xF3]ximo)\\s*)?(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(este|esta|passado|pr[\xF3o]ximo)\\s*semana)?(?=\\W|\\d|$)`, "i");
    var PREFIX_GROUP = 1;
    var WEEKDAY_GROUP = 2;
    var POSTFIX_GROUP = 3;
    var PTWeekdayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
        if (offset === void 0) {
          return null;
        }
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let norm = prefix || postfix || "";
        norm = norm.toLowerCase();
        let modifier = null;
        if (norm == "passado") {
          modifier = "this";
        } else if (norm == "pr\xF3ximo" || norm == "proximo") {
          modifier = "next";
        } else if (norm == "este") {
          modifier = "this";
        }
        const date = weeks_1.toDayJSWeekday(context.refDate, offset, modifier);
        return context.createParsingComponents().assign("weekday", offset).imply("day", date.date()).imply("month", date.month() + 1).imply("year", date.year());
      }
    };
    exports2.default = PTWeekdayParser;
  }
});

// node_modules/chrono-node/dist/locales/pt/parsers/PTTimeExpressionParser.js
var require_PTTimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/parsers/PTTimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractTimeExpressionParser_1 = require_AbstractTimeExpressionParser();
    var PTTimeExpressionParser = class extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
      primaryPrefix() {
        return "(?:(?:ao?|\xE0s?|das|da|de|do)\\s*)?";
      }
      followingPhase() {
        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|a(?:o)?|\\?)\\s*";
      }
    };
    exports2.default = PTTimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/locales/pt/refiners/PTMergeDateTimeRefiner.js
var require_PTMergeDateTimeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/refiners/PTMergeDateTimeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateTimeRefiner_1 = __importDefault(require_AbstractMergeDateTimeRefiner());
    var PTMergeDateTimeRefiner = class extends AbstractMergeDateTimeRefiner_1.default {
      patternBetween() {
        return new RegExp("^\\s*(?:,|\xE0)?\\s*$");
      }
    };
    exports2.default = PTMergeDateTimeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/pt/refiners/PTMergeDateRangeRefiner.js
var require_PTMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/refiners/PTMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateRangeRefiner_1 = __importDefault(require_AbstractMergeDateRangeRefiner());
    var PTMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner_1.default {
      patternBetween() {
        return /^\s*(?:-)\s*$/i;
      }
    };
    exports2.default = PTMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/pt/parsers/PTMonthNameLittleEndianParser.js
var require_PTMonthNameLittleEndianParser = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/parsers/PTMonthNameLittleEndianParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var constants_1 = require_constants5();
    var constants_2 = require_constants5();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`([0-9]{1,2})(?:\xBA|\xAA|\xB0)?(?:\\s*(?:desde|de|\\-|\\\u2013|ao?|\\s)\\s*([0-9]{1,2})(?:\xBA|\xAA|\xB0)?)?\\s*(?:de)?\\s*(?:-|/|\\s*(?:de|,)?\\s*)(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})(?:\\s*(?:de|,)?\\s*(${constants_2.YEAR_PATTERN}))?(?=\\W|$)`, "i");
    var DATE_GROUP = 1;
    var DATE_TO_GROUP = 2;
    var MONTH_NAME_GROUP = 3;
    var YEAR_GROUP = 4;
    var PTMonthNameLittleEndianParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
          match.index = match.index + match[DATE_GROUP].length;
          return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
          const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
          result.start.assign("year", yearNumber);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
          const endDate = parseInt(match[DATE_TO_GROUP]);
          result.end = result.start.clone();
          result.end.assign("day", endDate);
        }
        return result;
      }
    };
    exports2.default = PTMonthNameLittleEndianParser;
  }
});

// node_modules/chrono-node/dist/locales/pt/parsers/PTCasualDateParser.js
var require_PTCasualDateParser = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/parsers/PTCasualDateParser.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var references = __importStar(require_casualReferences());
    var PTCasualDateParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
          case "agora":
            return references.now(context.refDate);
          case "hoje":
            return references.today(context.refDate);
          case "amanha":
          case "amanh\xE3":
            return references.tomorrow(context.refDate);
          case "ontem":
            return references.yesterday(context.refDate);
        }
        return component;
      }
    };
    exports2.default = PTCasualDateParser;
  }
});

// node_modules/chrono-node/dist/locales/pt/parsers/PTCasualTimeParser.js
var require_PTCasualTimeParser = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/parsers/PTCasualTimeParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var index_1 = require_dist();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_1 = require_dayjs();
    var dayjs_2 = __importDefault(require_dayjs_min());
    var PTCasualTimeParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const targetDate = dayjs_2.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
          case "tarde":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 15);
            break;
          case "noite":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 22);
            break;
          case "manha":
          case "manh\xE3":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 6);
            break;
          case "meia-noite":
            dayjs_1.assignTheNextDay(component, targetDate);
            component.imply("hour", 0);
            component.imply("minute", 0);
            component.imply("second", 0);
            break;
          case "meio-dia":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 12);
            break;
        }
        return component;
      }
    };
    exports2.default = PTCasualTimeParser;
  }
});

// node_modules/chrono-node/dist/locales/pt/index.js
var require_pt = __commonJS({
  "node_modules/chrono-node/dist/locales/pt/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConfiguration = exports2.createCasualConfiguration = exports2.parseDate = exports2.parse = exports2.strict = exports2.casual = void 0;
    var configurations_1 = require_configurations();
    var chrono_1 = require_chrono();
    var SlashDateFormatParser_1 = __importDefault(require_SlashDateFormatParser());
    var PTWeekdayParser_1 = __importDefault(require_PTWeekdayParser());
    var PTTimeExpressionParser_1 = __importDefault(require_PTTimeExpressionParser());
    var PTMergeDateTimeRefiner_1 = __importDefault(require_PTMergeDateTimeRefiner());
    var PTMergeDateRangeRefiner_1 = __importDefault(require_PTMergeDateRangeRefiner());
    var PTMonthNameLittleEndianParser_1 = __importDefault(require_PTMonthNameLittleEndianParser());
    var PTCasualDateParser_1 = __importDefault(require_PTCasualDateParser());
    var PTCasualTimeParser_1 = __importDefault(require_PTCasualTimeParser());
    exports2.casual = new chrono_1.Chrono(createCasualConfiguration());
    exports2.strict = new chrono_1.Chrono(createConfiguration(true));
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
    function createCasualConfiguration(littleEndian = true) {
      const option = createConfiguration(false, littleEndian);
      option.parsers.push(new PTCasualDateParser_1.default());
      option.parsers.push(new PTCasualTimeParser_1.default());
      return option;
    }
    exports2.createCasualConfiguration = createCasualConfiguration;
    function createConfiguration(strictMode = true, littleEndian = true) {
      return configurations_1.includeCommonConfiguration({
        parsers: [
          new SlashDateFormatParser_1.default(littleEndian),
          new PTWeekdayParser_1.default(),
          new PTTimeExpressionParser_1.default(),
          new PTMonthNameLittleEndianParser_1.default()
        ],
        refiners: [new PTMergeDateTimeRefiner_1.default(), new PTMergeDateRangeRefiner_1.default()]
      }, strictMode);
    }
    exports2.createConfiguration = createConfiguration;
  }
});

// node_modules/chrono-node/dist/locales/nl/refiners/NLMergeDateRangeRefiner.js
var require_NLMergeDateRangeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/refiners/NLMergeDateRangeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateRangeRefiner_1 = __importDefault(require_AbstractMergeDateRangeRefiner());
    var NLMergeDateRangeRefiner = class extends AbstractMergeDateRangeRefiner_1.default {
      patternBetween() {
        return /^\s*(tot|-)\s*$/i;
      }
    };
    exports2.default = NLMergeDateRangeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/nl/refiners/NLMergeDateTimeRefiner.js
var require_NLMergeDateTimeRefiner = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/refiners/NLMergeDateTimeRefiner.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractMergeDateTimeRefiner_1 = __importDefault(require_AbstractMergeDateTimeRefiner());
    var NLMergeDateTimeRefiner = class extends AbstractMergeDateTimeRefiner_1.default {
      patternBetween() {
        return new RegExp("^\\s*(om|na|voor|in de|,|-)?\\s*$");
      }
    };
    exports2.default = NLMergeDateTimeRefiner;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLCasualDateParser.js
var require_NLCasualDateParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLCasualDateParser.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var references = __importStar(require_casualReferences());
    var NLCasualDateParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
          case "nu":
            return references.now(context.refDate);
          case "vandaag":
            return references.today(context.refDate);
          case "morgen":
          case "morgend":
            return references.tomorrow(context.refDate);
          case "gisteren":
            return references.yesterday(context.refDate);
        }
        return component;
      }
    };
    exports2.default = NLCasualDateParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLCasualTimeParser.js
var require_NLCasualTimeParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLCasualTimeParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var index_1 = require_dist();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var dayjs_1 = __importDefault(require_dayjs_min());
    var dayjs_2 = require_dayjs();
    var DAY_GROUP = 1;
    var MOMENT_GROUP = 2;
    var NLCasualTimeParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        if (match[DAY_GROUP] === "deze") {
          component.assign("day", context.refDate.getDate());
          component.assign("month", context.refDate.getMonth() + 1);
          component.assign("year", context.refDate.getFullYear());
        }
        switch (match[MOMENT_GROUP].toLowerCase()) {
          case "namiddag":
          case "'s namiddags":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 15);
            break;
          case "avond":
          case "'s avonds'":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 20);
            break;
          case "middernacht":
            dayjs_2.assignTheNextDay(component, targetDate);
            component.imply("hour", 0);
            component.imply("minute", 0);
            component.imply("second", 0);
            break;
          case "ochtend":
          case "'s ochtends":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 6);
            break;
          case "middag":
          case "'s middags":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 12);
            break;
        }
        return component;
      }
    };
    exports2.default = NLCasualTimeParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/constants.js
var require_constants6 = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseTimeUnits = exports2.TIME_UNITS_PATTERN = exports2.parseYear = exports2.YEAR_PATTERN = exports2.parseOrdinalNumberPattern = exports2.ORDINAL_NUMBER_PATTERN = exports2.parseNumberPattern = exports2.NUMBER_PATTERN = exports2.TIME_UNIT_DICTIONARY = exports2.ORDINAL_WORD_DICTIONARY = exports2.INTEGER_WORD_DICTIONARY = exports2.MONTH_DICTIONARY = exports2.WEEKDAY_DICTIONARY = void 0;
    var pattern_1 = require_pattern();
    var years_1 = require_years();
    exports2.WEEKDAY_DICTIONARY = {
      zondag: 0,
      zon: 0,
      "zon.": 0,
      zo: 0,
      "zo.": 0,
      maandag: 1,
      ma: 1,
      "ma.": 1,
      dinsdag: 2,
      din: 2,
      "din.": 2,
      di: 2,
      "di.": 2,
      woensdag: 3,
      woe: 3,
      "woe.": 3,
      wo: 3,
      "wo.": 3,
      donderdag: 4,
      dond: 4,
      "dond.": 4,
      do: 4,
      "do.": 4,
      vrijdag: 5,
      vrij: 5,
      "vrij.": 5,
      vr: 5,
      "vr.": 5,
      zaterdag: 6,
      zat: 6,
      "zat.": 6,
      "za": 6,
      "za.": 6
    };
    exports2.MONTH_DICTIONARY = {
      januari: 1,
      jan: 1,
      "jan.": 1,
      februari: 2,
      feb: 2,
      "feb.": 2,
      maart: 3,
      mar: 3,
      "mar.": 3,
      april: 4,
      apr: 4,
      "apr.": 4,
      mei: 5,
      juni: 6,
      jun: 6,
      "jun.": 6,
      juli: 7,
      jul: 7,
      "jul.": 7,
      augustus: 8,
      aug: 8,
      "aug.": 8,
      september: 9,
      sep: 9,
      "sep.": 9,
      sept: 9,
      "sept.": 9,
      oktober: 10,
      okt: 10,
      "okt.": 10,
      november: 11,
      nov: 11,
      "nov.": 11,
      december: 12,
      dec: 12,
      "dec.": 12
    };
    exports2.INTEGER_WORD_DICTIONARY = {
      een: 1,
      twee: 2,
      drie: 3,
      vier: 4,
      vijf: 5,
      zes: 6,
      zeven: 7,
      acht: 8,
      negen: 9,
      tien: 10,
      elf: 11,
      twaalf: 12
    };
    exports2.ORDINAL_WORD_DICTIONARY = {
      eerste: 1,
      tweede: 2,
      derde: 3,
      vierde: 4,
      vijfde: 5,
      zesde: 6,
      zevende: 7,
      achtste: 8,
      negende: 9,
      tiende: 10,
      elfde: 11,
      twaalfde: 12,
      dertiende: 13,
      veertiende: 14,
      vijftiende: 15,
      zestiende: 16,
      zeventiende: 17,
      achttiende: 18,
      negentiende: 19,
      twintigste: 20,
      "eenentwintigste": 21,
      "twee\xEBntwintigste": 22,
      "drieentwintigste": 23,
      "vierentwintigste": 24,
      "vijfentwintigste": 25,
      "zesentwintigste": 26,
      "zevenentwintigste": 27,
      "achtentwintig": 28,
      "negenentwintig": 29,
      "dertigste": 30,
      "eenendertigste": 31
    };
    exports2.TIME_UNIT_DICTIONARY = {
      sec: "second",
      second: "second",
      seconden: "second",
      min: "minute",
      mins: "minute",
      minute: "minute",
      minuten: "minute",
      h: "hour",
      hr: "hour",
      hrs: "hour",
      uur: "hour",
      uren: "hour",
      dag: "d",
      dagen: "d",
      week: "week",
      weken: "week",
      maand: "month",
      maanden: "month",
      jaar: "year",
      jr: "year",
      jaren: "year"
    };
    exports2.NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports2.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|een?|halve?)`;
    function parseNumberPattern(match) {
      const num = match.toLowerCase();
      if (exports2.INTEGER_WORD_DICTIONARY[num] !== void 0) {
        return exports2.INTEGER_WORD_DICTIONARY[num];
      } else if (num === "een") {
        return 1;
      } else if (num.match(/halve?/)) {
        return 0.5;
      }
      return parseFloat(num);
    }
    exports2.parseNumberPattern = parseNumberPattern;
    exports2.ORDINAL_NUMBER_PATTERN = `(?:${pattern_1.matchAnyPattern(exports2.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:ste|de)?)`;
    function parseOrdinalNumberPattern(match) {
      let num = match.toLowerCase();
      if (exports2.ORDINAL_WORD_DICTIONARY[num] !== void 0) {
        return exports2.ORDINAL_WORD_DICTIONARY[num];
      }
      num = num.replace(/(?:ste|de)$/i, "");
      return parseInt(num);
    }
    exports2.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
    exports2.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])`;
    function parseYear(match) {
      if (/voor Christus/i.test(match)) {
        match = match.replace(/voor Christus/i, "");
        return -parseInt(match);
      }
      if (/na Christus/i.test(match)) {
        match = match.replace(/na Christus/i, "");
        return parseInt(match);
      }
      const rawYearNumber = parseInt(match);
      return years_1.findMostLikelyADYear(rawYearNumber);
    }
    exports2.parseYear = parseYear;
    var SINGLE_TIME_UNIT_PATTERN = `(${exports2.NUMBER_PATTERN})\\s{0,5}(${pattern_1.matchAnyPattern(exports2.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
    var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
    exports2.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern(`(?:(?:binnen|in)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
    function parseTimeUnits(timeunitText) {
      const fragments = {};
      let remainingText = timeunitText;
      let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
      }
      return fragments;
    }
    exports2.parseTimeUnits = parseTimeUnits;
    function collectDateTimeFragment(fragments, match) {
      const num = parseNumberPattern(match[1]);
      const unit = exports2.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
      fragments[unit] = num;
    }
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLTimeUnitWithinFormatParser.js
var require_NLTimeUnitWithinFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLTimeUnitWithinFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants6();
    var results_1 = require_results();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var NLTimeUnitWithinFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return new RegExp(`(?:binnen|in|binnen de|voor)\\s*(` + constants_1.TIME_UNITS_PATTERN + `)(?=\\W|$)`, "i");
      }
      innerExtract(context, match) {
        const timeUnits = constants_1.parseTimeUnits(match[1]);
        return results_1.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
      }
    };
    exports2.default = NLTimeUnitWithinFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLWeekdayParser.js
var require_NLWeekdayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLWeekdayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants6();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var weeks_1 = require_weeks();
    var PATTERN = new RegExp(`(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:op\\s*?)?(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?(${pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY)})(?=\\W|$)`, "i");
    var PREFIX_GROUP = 1;
    var WEEKDAY_GROUP = 2;
    var POSTFIX_GROUP = 3;
    var NLWeekdayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "vorige") {
          modifier = "last";
        } else if (modifierWord == "volgende") {
          modifier = "next";
        } else if (modifierWord == "deze") {
          modifier = "this";
        }
        const date = weeks_1.toDayJSWeekday(context.refDate, offset, modifier);
        return context.createParsingComponents().assign("weekday", offset).imply("day", date.date()).imply("month", date.month() + 1).imply("year", date.year());
      }
    };
    exports2.default = NLWeekdayParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLMonthNameMiddleEndianParser.js
var require_NLMonthNameMiddleEndianParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLMonthNameMiddleEndianParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var years_1 = require_years();
    var constants_1 = require_constants6();
    var constants_2 = require_constants6();
    var constants_3 = require_constants6();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`(?:on\\s*?)?(${constants_2.ORDINAL_NUMBER_PATTERN})(?:\\s*(?:tot|\\-|\\\u2013|until|through|till|\\s)\\s*(${constants_2.ORDINAL_NUMBER_PATTERN}))?(?:-|/|\\s*(?:of)?\\s*)(` + pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY) + `)(?:(?:-|/|,?\\s*)(${constants_3.YEAR_PATTERN}(?![^\\s]\\d)))?(?=\\W|$)`, "i");
    var MONTH_NAME_GROUP = 3;
    var DATE_GROUP = 1;
    var DATE_TO_GROUP = 2;
    var YEAR_GROUP = 4;
    var NLMonthNameMiddleEndianParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
          match.index = match.index + match[DATE_GROUP].length;
          return null;
        }
        const components = context.createParsingComponents({
          day,
          month
        });
        if (match[YEAR_GROUP]) {
          const year = constants_3.parseYear(match[YEAR_GROUP]);
          components.assign("year", year);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, day, month);
          components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
          return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
      }
    };
    exports2.default = NLMonthNameMiddleEndianParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLMonthNameParser.js
var require_NLMonthNameParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLMonthNameParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants6();
    var years_1 = require_years();
    var pattern_1 = require_pattern();
    var constants_2 = require_constants6();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})\\s*(?:[,-]?\\s*(${constants_2.YEAR_PATTERN})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, "i");
    var MONTH_NAME_GROUP = 1;
    var YEAR_GROUP = 2;
    var NLMonthNameParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const components = context.createParsingComponents();
        components.imply("day", 1);
        const monthName = match[MONTH_NAME_GROUP];
        const month = constants_1.MONTH_DICTIONARY[monthName.toLowerCase()];
        components.assign("month", month);
        if (match[YEAR_GROUP]) {
          const year = constants_2.parseYear(match[YEAR_GROUP]);
          components.assign("year", year);
        } else {
          const year = years_1.findYearClosestToRef(context.refDate, 1, month);
          components.imply("year", year);
        }
        return components;
      }
    };
    exports2.default = NLMonthNameParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLSlashMonthFormatParser.js
var require_NLSlashMonthFormatParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLSlashMonthFormatParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})", "i");
    var MONTH_GROUP = 1;
    var YEAR_GROUP = 2;
    var NLSlashMonthFormatParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
      }
    };
    exports2.default = NLSlashMonthFormatParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLTimeExpressionParser.js
var require_NLTimeExpressionParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLTimeExpressionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractTimeExpressionParser_1 = require_AbstractTimeExpressionParser();
    var NLTimeExpressionParser = class extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
      primaryPrefix() {
        return "(?:(?:om)\\s*)?";
      }
      followingPhase() {
        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|om|\\?)\\s*";
      }
      extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
          return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
      }
    };
    exports2.default = NLTimeExpressionParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLCasualYearMonthDayParser.js
var require_NLCasualYearMonthDayParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLCasualYearMonthDayParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants6();
    var pattern_1 = require_pattern();
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s](?:(${pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]([0-9]{1,2})(?=\\W|$)`, "i");
    var YEAR_NUMBER_GROUP = 1;
    var MONTH_NAME_GROUP = 2;
    var MONTH_NUMBER_GROUP = 3;
    var DATE_NUMBER_GROUP = 4;
    var NLCasualYearMonthDayParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern() {
        return PATTERN;
      }
      innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP] ? parseInt(match[MONTH_NUMBER_GROUP]) : constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
          return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
          day,
          month,
          year
        };
      }
    };
    exports2.default = NLCasualYearMonthDayParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/parsers/NLCasualDateTimeParser.js
var require_NLCasualDateTimeParser = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/parsers/NLCasualDateTimeParser.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var AbstractParserWithWordBoundary_1 = require_AbstractParserWithWordBoundary();
    var index_1 = require_dist();
    var dayjs_1 = require_dayjs();
    var dayjs_2 = __importDefault(require_dayjs_min());
    var DATE_GROUP = 1;
    var TIME_OF_DAY_GROUP = 2;
    var NLCasualDateTimeParser = class extends AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking {
      innerPattern(context) {
        return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i;
      }
      innerExtract(context, match) {
        const dateText = match[DATE_GROUP].toLowerCase();
        const timeText = match[TIME_OF_DAY_GROUP].toLowerCase();
        const component = context.createParsingComponents();
        const targetDate = dayjs_2.default(context.refDate);
        switch (dateText) {
          case "gisteren":
            dayjs_1.assignSimilarDate(component, targetDate.add(-1, "day"));
            break;
          case "van":
            dayjs_1.assignSimilarDate(component, targetDate);
            break;
          case "morgen":
            dayjs_1.assignTheNextDay(component, targetDate);
            break;
        }
        switch (timeText) {
          case "ochtend":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 6);
            break;
          case "middag":
            component.imply("meridiem", index_1.Meridiem.AM);
            component.imply("hour", 12);
            break;
          case "namiddag":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 15);
            break;
          case "avond":
            component.imply("meridiem", index_1.Meridiem.PM);
            component.imply("hour", 20);
            break;
        }
        return component;
      }
    };
    exports2.default = NLCasualDateTimeParser;
  }
});

// node_modules/chrono-node/dist/locales/nl/index.js
var require_nl = __commonJS({
  "node_modules/chrono-node/dist/locales/nl/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConfiguration = exports2.createCasualConfiguration = exports2.parseDate = exports2.parse = exports2.strict = exports2.casual = void 0;
    var configurations_1 = require_configurations();
    var chrono_1 = require_chrono();
    var NLMergeDateRangeRefiner_1 = __importDefault(require_NLMergeDateRangeRefiner());
    var NLMergeDateTimeRefiner_1 = __importDefault(require_NLMergeDateTimeRefiner());
    var NLCasualDateParser_1 = __importDefault(require_NLCasualDateParser());
    var NLCasualTimeParser_1 = __importDefault(require_NLCasualTimeParser());
    var SlashDateFormatParser_1 = __importDefault(require_SlashDateFormatParser());
    var NLTimeUnitWithinFormatParser_1 = __importDefault(require_NLTimeUnitWithinFormatParser());
    var NLWeekdayParser_1 = __importDefault(require_NLWeekdayParser());
    var NLMonthNameMiddleEndianParser_1 = __importDefault(require_NLMonthNameMiddleEndianParser());
    var NLMonthNameParser_1 = __importDefault(require_NLMonthNameParser());
    var NLSlashMonthFormatParser_1 = __importDefault(require_NLSlashMonthFormatParser());
    var NLTimeExpressionParser_1 = __importDefault(require_NLTimeExpressionParser());
    var NLCasualYearMonthDayParser_1 = __importDefault(require_NLCasualYearMonthDayParser());
    var NLCasualDateTimeParser_1 = __importDefault(require_NLCasualDateTimeParser());
    exports2.casual = new chrono_1.Chrono(createCasualConfiguration());
    exports2.strict = new chrono_1.Chrono(createConfiguration(true));
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
    function createCasualConfiguration(littleEndian = true) {
      const option = createConfiguration(false, littleEndian);
      option.parsers.unshift(new NLCasualDateParser_1.default());
      option.parsers.unshift(new NLCasualTimeParser_1.default());
      option.parsers.unshift(new NLCasualDateTimeParser_1.default());
      return option;
    }
    exports2.createCasualConfiguration = createCasualConfiguration;
    function createConfiguration(strictMode = true, littleEndian = true) {
      return configurations_1.includeCommonConfiguration({
        parsers: [
          new SlashDateFormatParser_1.default(littleEndian),
          new NLMonthNameMiddleEndianParser_1.default(),
          new NLMonthNameParser_1.default(),
          new NLTimeExpressionParser_1.default(),
          new NLTimeUnitWithinFormatParser_1.default(),
          new NLSlashMonthFormatParser_1.default(),
          new NLWeekdayParser_1.default(),
          new NLCasualYearMonthDayParser_1.default()
        ],
        refiners: [new NLMergeDateTimeRefiner_1.default(), new NLMergeDateRangeRefiner_1.default()]
      }, strictMode);
    }
    exports2.createConfiguration = createConfiguration;
  }
});

// node_modules/chrono-node/dist/index.js
var require_dist = __commonJS({
  "node_modules/chrono-node/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseDate = exports2.parse = exports2.casual = exports2.strict = exports2.nl = exports2.pt = exports2.ja = exports2.fr = exports2.de = exports2.Meridiem = exports2.Chrono = exports2.en = void 0;
    var en = __importStar(require_en());
    exports2.en = en;
    var chrono_1 = require_chrono();
    Object.defineProperty(exports2, "Chrono", { enumerable: true, get: function() {
      return chrono_1.Chrono;
    } });
    var Meridiem;
    (function(Meridiem2) {
      Meridiem2[Meridiem2["AM"] = 0] = "AM";
      Meridiem2[Meridiem2["PM"] = 1] = "PM";
    })(Meridiem = exports2.Meridiem || (exports2.Meridiem = {}));
    var de = __importStar(require_de());
    exports2.de = de;
    var fr = __importStar(require_fr());
    exports2.fr = fr;
    var ja = __importStar(require_ja());
    exports2.ja = ja;
    var pt = __importStar(require_pt());
    exports2.pt = pt;
    var nl = __importStar(require_nl());
    exports2.nl = nl;
    exports2.strict = en.strict;
    exports2.casual = en.casual;
    function parse(text, ref, option) {
      return exports2.casual.parse(text, ref, option);
    }
    exports2.parse = parse;
    function parseDate(text, ref, option) {
      return exports2.casual.parseDate(text, ref, option);
    }
    exports2.parseDate = parseDate;
  }
});

// node_modules/jsonschema/lib/helpers.js
var require_helpers2 = __commonJS({
  "node_modules/jsonschema/lib/helpers.js"(exports2, module2) {
    "use strict";
    var uri = require("url");
    var ValidationError = exports2.ValidationError = function ValidationError2(message, instance, schema, path, name, argument) {
      if (Array.isArray(path)) {
        this.path = path;
        this.property = path.reduce(function(sum, item) {
          return sum + makeSuffix(item);
        }, "instance");
      } else if (path !== void 0) {
        this.property = path;
      }
      if (message) {
        this.message = message;
      }
      if (schema) {
        var id = schema.$id || schema.id;
        this.schema = id || schema;
      }
      if (instance !== void 0) {
        this.instance = instance;
      }
      this.name = name;
      this.argument = argument;
      this.stack = this.toString();
    };
    ValidationError.prototype.toString = function toString() {
      return this.property + " " + this.message;
    };
    var ValidatorResult = exports2.ValidatorResult = function ValidatorResult2(instance, schema, options, ctx) {
      this.instance = instance;
      this.schema = schema;
      this.options = options;
      this.path = ctx.path;
      this.propertyPath = ctx.propertyPath;
      this.errors = [];
      this.throwError = options && options.throwError;
      this.throwFirst = options && options.throwFirst;
      this.throwAll = options && options.throwAll;
      this.disableFormat = options && options.disableFormat === true;
    };
    ValidatorResult.prototype.addError = function addError(detail) {
      var err;
      if (typeof detail == "string") {
        err = new ValidationError(detail, this.instance, this.schema, this.path);
      } else {
        if (!detail) throw new Error("Missing error detail");
        if (!detail.message) throw new Error("Missing error message");
        if (!detail.name) throw new Error("Missing validator type");
        err = new ValidationError(detail.message, this.instance, this.schema, this.path, detail.name, detail.argument);
      }
      this.errors.push(err);
      if (this.throwFirst) {
        throw new ValidatorResultError(this);
      } else if (this.throwError) {
        throw err;
      }
      return err;
    };
    ValidatorResult.prototype.importErrors = function importErrors(res) {
      if (typeof res == "string" || res && res.validatorType) {
        this.addError(res);
      } else if (res && res.errors) {
        Array.prototype.push.apply(this.errors, res.errors);
      }
    };
    function stringizer(v, i) {
      return i + ": " + v.toString() + "\n";
    }
    ValidatorResult.prototype.toString = function toString(res) {
      return this.errors.map(stringizer).join("");
    };
    Object.defineProperty(ValidatorResult.prototype, "valid", { get: function() {
      return !this.errors.length;
    } });
    module2.exports.ValidatorResultError = ValidatorResultError;
    function ValidatorResultError(result) {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ValidatorResultError);
      }
      this.instance = result.instance;
      this.schema = result.schema;
      this.options = result.options;
      this.errors = result.errors;
    }
    ValidatorResultError.prototype = new Error();
    ValidatorResultError.prototype.constructor = ValidatorResultError;
    ValidatorResultError.prototype.name = "Validation Error";
    var SchemaError = exports2.SchemaError = function SchemaError2(msg, schema) {
      this.message = msg;
      this.schema = schema;
      Error.call(this, msg);
      Error.captureStackTrace(this, SchemaError2);
    };
    SchemaError.prototype = Object.create(
      Error.prototype,
      {
        constructor: { value: SchemaError, enumerable: false },
        name: { value: "SchemaError", enumerable: false }
      }
    );
    var SchemaContext = exports2.SchemaContext = function SchemaContext2(schema, options, path, base, schemas) {
      this.schema = schema;
      this.options = options;
      if (Array.isArray(path)) {
        this.path = path;
        this.propertyPath = path.reduce(function(sum, item) {
          return sum + makeSuffix(item);
        }, "instance");
      } else {
        this.propertyPath = path;
      }
      this.base = base;
      this.schemas = schemas;
    };
    SchemaContext.prototype.resolve = function resolve(target) {
      return uri.resolve(this.base, target);
    };
    SchemaContext.prototype.makeChild = function makeChild(schema, propertyName) {
      var path = propertyName === void 0 ? this.path : this.path.concat([propertyName]);
      var id = schema.$id || schema.id;
      var base = uri.resolve(this.base, id || "");
      var ctx = new SchemaContext(schema, this.options, path, base, Object.create(this.schemas));
      if (id && !ctx.schemas[base]) {
        ctx.schemas[base] = schema;
      }
      return ctx;
    };
    var FORMAT_REGEXPS = exports2.FORMAT_REGEXPS = {
      "date-time": /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])[tT ](2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])(\.\d+)?([zZ]|[+-]([0-5][0-9]):(60|[0-5][0-9]))$/,
      "date": /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-(3[01]|0[1-9]|[12][0-9])$/,
      "time": /^(2[0-4]|[01][0-9]):([0-5][0-9]):(60|[0-5][0-9])$/,
      "email": /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
      "ip-address": /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "ipv6": /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
      // TODO: A more accurate regular expression for "uri" goes:
      // [A-Za-z][+\-.0-9A-Za-z]*:((/(/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?)?)?#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|(/(/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~])|/?%[0-9A-Fa-f]{2}|[!$&-.0-;=?-Z_a-z~])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*(#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*)?|/(/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+(:\d*)?|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?:\d*|\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)?)?
      "uri": /^[a-zA-Z][a-zA-Z0-9+-.]*:[^\s]*$/,
      "uri-reference": /^(((([A-Za-z][+\-.0-9A-Za-z]*(:%[0-9A-Fa-f]{2}|:[!$&-.0-;=?-Z_a-z~]|[/?])|\?)(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|([A-Za-z][+\-.0-9A-Za-z]*:?)?)|([A-Za-z][+\-.0-9A-Za-z]*:)?\/((%[0-9A-Fa-f]{2}|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|(\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?)?))#(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|(([A-Za-z][+\-.0-9A-Za-z]*)?%[0-9A-Fa-f]{2}|[!$&-.0-9;=@_~]|[A-Za-z][+\-.0-9A-Za-z]*[!$&-*,;=@_~])(%[0-9A-Fa-f]{2}|[!$&-.0-9;=@-Z_a-z~])*((([/?](%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*)?#|[/?])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*)?|([A-Za-z][+\-.0-9A-Za-z]*(:%[0-9A-Fa-f]{2}|:[!$&-.0-;=?-Z_a-z~]|[/?])|\?)(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|([A-Za-z][+\-.0-9A-Za-z]*:)?\/((%[0-9A-Fa-f]{2}|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)(:\d*)?[/?]|[!$&-.0-;=?-Z_a-z~])(%[0-9A-Fa-f]{2}|[!$&-;=?-Z_a-z~])*|\/((%[0-9A-Fa-f]{2}|[!$&-.0-9;=A-Z_a-z~])+(:\d*)?|(\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?:\d*|\[(([Vv][0-9A-Fa-f]+\.[!$&-.0-;=A-Z_a-z~]+)?|[.0-:A-Fa-f]+)\])?)?|[A-Za-z][+\-.0-9A-Za-z]*:?)?$/,
      "color": /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/,
      // hostname regex from: http://stackoverflow.com/a/1420225/5628
      "hostname": /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
      "host-name": /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,
      "alpha": /^[a-zA-Z]+$/,
      "alphanumeric": /^[a-zA-Z0-9]+$/,
      "utc-millisec": function(input) {
        return typeof input === "string" && parseFloat(input) === parseInt(input, 10) && !isNaN(input);
      },
      "regex": function(input) {
        var result = true;
        try {
          new RegExp(input);
        } catch (e) {
          result = false;
        }
        return result;
      },
      "style": /\s*(.+?):\s*([^;]+);?/,
      "phone": /^\+(?:[0-9] ?){6,14}[0-9]$/
    };
    FORMAT_REGEXPS.regexp = FORMAT_REGEXPS.regex;
    FORMAT_REGEXPS.pattern = FORMAT_REGEXPS.regex;
    FORMAT_REGEXPS.ipv4 = FORMAT_REGEXPS["ip-address"];
    exports2.isFormat = function isFormat(input, format, validator) {
      if (typeof input === "string" && FORMAT_REGEXPS[format] !== void 0) {
        if (FORMAT_REGEXPS[format] instanceof RegExp) {
          return FORMAT_REGEXPS[format].test(input);
        }
        if (typeof FORMAT_REGEXPS[format] === "function") {
          return FORMAT_REGEXPS[format](input);
        }
      } else if (validator && validator.customFormats && typeof validator.customFormats[format] === "function") {
        return validator.customFormats[format](input);
      }
      return true;
    };
    var makeSuffix = exports2.makeSuffix = function makeSuffix2(key) {
      key = key.toString();
      if (!key.match(/[.\s\[\]]/) && !key.match(/^[\d]/)) {
        return "." + key;
      }
      if (key.match(/^\d+$/)) {
        return "[" + key + "]";
      }
      return "[" + JSON.stringify(key) + "]";
    };
    exports2.deepCompareStrict = function deepCompareStrict(a, b) {
      if (typeof a !== typeof b) {
        return false;
      }
      if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
          return false;
        }
        if (a.length !== b.length) {
          return false;
        }
        return a.every(function(v, i) {
          return deepCompareStrict(a[i], b[i]);
        });
      }
      if (typeof a === "object") {
        if (!a || !b) {
          return a === b;
        }
        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
          return false;
        }
        return aKeys.every(function(v) {
          return deepCompareStrict(a[v], b[v]);
        });
      }
      return a === b;
    };
    function deepMerger(target, dst, e, i) {
      if (typeof e === "object") {
        dst[i] = deepMerge(target[i], e);
      } else {
        if (target.indexOf(e) === -1) {
          dst.push(e);
        }
      }
    }
    function copyist(src, dst, key) {
      dst[key] = src[key];
    }
    function copyistWithDeepMerge(target, src, dst, key) {
      if (typeof src[key] !== "object" || !src[key]) {
        dst[key] = src[key];
      } else {
        if (!target[key]) {
          dst[key] = src[key];
        } else {
          dst[key] = deepMerge(target[key], src[key]);
        }
      }
    }
    function deepMerge(target, src) {
      var array = Array.isArray(src);
      var dst = array && [] || {};
      if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(deepMerger.bind(null, target, dst));
      } else {
        if (target && typeof target === "object") {
          Object.keys(target).forEach(copyist.bind(null, target, dst));
        }
        Object.keys(src).forEach(copyistWithDeepMerge.bind(null, target, src, dst));
      }
      return dst;
    }
    module2.exports.deepMerge = deepMerge;
    exports2.objectGetPath = function objectGetPath(o, s) {
      var parts = s.split("/").slice(1);
      var k;
      while (typeof (k = parts.shift()) == "string") {
        var n = decodeURIComponent(k.replace(/~0/, "~").replace(/~1/g, "/"));
        if (!(n in o)) return;
        o = o[n];
      }
      return o;
    };
    function pathEncoder(v) {
      return "/" + encodeURIComponent(v).replace(/~/g, "%7E");
    }
    exports2.encodePath = function encodePointer(a) {
      return a.map(pathEncoder).join("");
    };
    exports2.getDecimalPlaces = function getDecimalPlaces(number) {
      var decimalPlaces = 0;
      if (isNaN(number)) return decimalPlaces;
      if (typeof number !== "number") {
        number = Number(number);
      }
      var parts = number.toString().split("e");
      if (parts.length === 2) {
        if (parts[1][0] !== "-") {
          return decimalPlaces;
        } else {
          decimalPlaces = Number(parts[1].slice(1));
        }
      }
      var decimalParts = parts[0].split(".");
      if (decimalParts.length === 2) {
        decimalPlaces += decimalParts[1].length;
      }
      return decimalPlaces;
    };
    exports2.isSchema = function isSchema(val) {
      return typeof val === "object" && val || typeof val === "boolean";
    };
  }
});

// node_modules/jsonschema/lib/attribute.js
var require_attribute = __commonJS({
  "node_modules/jsonschema/lib/attribute.js"(exports2, module2) {
    "use strict";
    var helpers = require_helpers2();
    var ValidatorResult = helpers.ValidatorResult;
    var SchemaError = helpers.SchemaError;
    var attribute = {};
    attribute.ignoreProperties = {
      // informative properties
      "id": true,
      "default": true,
      "description": true,
      "title": true,
      // arguments to other properties
      "additionalItems": true,
      "then": true,
      "else": true,
      // special-handled properties
      "$schema": true,
      "$ref": true,
      "extends": true
    };
    var validators = attribute.validators = {};
    validators.type = function validateType(instance, schema, options, ctx) {
      if (instance === void 0) {
        return null;
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      var types = Array.isArray(schema.type) ? schema.type : [schema.type];
      if (!types.some(this.testType.bind(this, instance, schema, options, ctx))) {
        var list = types.map(function(v) {
          if (!v) return;
          var id = v.$id || v.id;
          return id ? "<" + id + ">" : v + "";
        });
        result.addError({
          name: "type",
          argument: list,
          message: "is not of a type(s) " + list
        });
      }
      return result;
    };
    function testSchemaNoThrow(instance, options, ctx, callback, schema) {
      var throwError = options.throwError;
      var throwAll = options.throwAll;
      options.throwError = false;
      options.throwAll = false;
      var res = this.validateSchema(instance, schema, options, ctx);
      options.throwError = throwError;
      options.throwAll = throwAll;
      if (!res.valid && callback instanceof Function) {
        callback(res);
      }
      return res.valid;
    }
    validators.anyOf = function validateAnyOf(instance, schema, options, ctx) {
      if (instance === void 0) {
        return null;
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      var inner = new ValidatorResult(instance, schema, options, ctx);
      if (!Array.isArray(schema.anyOf)) {
        throw new SchemaError("anyOf must be an array");
      }
      if (!schema.anyOf.some(
        testSchemaNoThrow.bind(
          this,
          instance,
          options,
          ctx,
          function(res) {
            inner.importErrors(res);
          }
        )
      )) {
        var list = schema.anyOf.map(function(v, i) {
          var id = v.$id || v.id;
          if (id) return "<" + id + ">";
          return v.title && JSON.stringify(v.title) || v["$ref"] && "<" + v["$ref"] + ">" || "[subschema " + i + "]";
        });
        if (options.nestedErrors) {
          result.importErrors(inner);
        }
        result.addError({
          name: "anyOf",
          argument: list,
          message: "is not any of " + list.join(",")
        });
      }
      return result;
    };
    validators.allOf = function validateAllOf(instance, schema, options, ctx) {
      if (instance === void 0) {
        return null;
      }
      if (!Array.isArray(schema.allOf)) {
        throw new SchemaError("allOf must be an array");
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      var self = this;
      schema.allOf.forEach(function(v, i) {
        var valid = self.validateSchema(instance, v, options, ctx);
        if (!valid.valid) {
          var id = v.$id || v.id;
          var msg = id || v.title && JSON.stringify(v.title) || v["$ref"] && "<" + v["$ref"] + ">" || "[subschema " + i + "]";
          result.addError({
            name: "allOf",
            argument: { id: msg, length: valid.errors.length, valid },
            message: "does not match allOf schema " + msg + " with " + valid.errors.length + " error[s]:"
          });
          result.importErrors(valid);
        }
      });
      return result;
    };
    validators.oneOf = function validateOneOf(instance, schema, options, ctx) {
      if (instance === void 0) {
        return null;
      }
      if (!Array.isArray(schema.oneOf)) {
        throw new SchemaError("oneOf must be an array");
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      var inner = new ValidatorResult(instance, schema, options, ctx);
      var count = schema.oneOf.filter(
        testSchemaNoThrow.bind(
          this,
          instance,
          options,
          ctx,
          function(res) {
            inner.importErrors(res);
          }
        )
      ).length;
      var list = schema.oneOf.map(function(v, i) {
        var id = v.$id || v.id;
        return id || v.title && JSON.stringify(v.title) || v["$ref"] && "<" + v["$ref"] + ">" || "[subschema " + i + "]";
      });
      if (count !== 1) {
        if (options.nestedErrors) {
          result.importErrors(inner);
        }
        result.addError({
          name: "oneOf",
          argument: list,
          message: "is not exactly one from " + list.join(",")
        });
      }
      return result;
    };
    validators.if = function validateIf(instance, schema, options, ctx) {
      if (instance === void 0) return null;
      if (!helpers.isSchema(schema.if)) throw new Error('Expected "if" keyword to be a schema');
      var ifValid = testSchemaNoThrow.call(this, instance, options, ctx, null, schema.if);
      var result = new ValidatorResult(instance, schema, options, ctx);
      var res;
      if (ifValid) {
        if (schema.then === void 0) return;
        if (!helpers.isSchema(schema.then)) throw new Error('Expected "then" keyword to be a schema');
        res = this.validateSchema(instance, schema.then, options, ctx.makeChild(schema.then));
        result.importErrors(res);
      } else {
        if (schema.else === void 0) return;
        if (!helpers.isSchema(schema.else)) throw new Error('Expected "else" keyword to be a schema');
        res = this.validateSchema(instance, schema.else, options, ctx.makeChild(schema.else));
        result.importErrors(res);
      }
      return result;
    };
    function getEnumerableProperty(object, key) {
      if (Object.hasOwnProperty.call(object, key)) return object[key];
      if (!(key in object)) return;
      while (object = Object.getPrototypeOf(object)) {
        if (Object.propertyIsEnumerable.call(object, key)) return object[key];
      }
    }
    validators.propertyNames = function validatePropertyNames(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var subschema = schema.propertyNames !== void 0 ? schema.propertyNames : {};
      if (!helpers.isSchema(subschema)) throw new SchemaError('Expected "propertyNames" to be a schema (object or boolean)');
      for (var property in instance) {
        if (getEnumerableProperty(instance, property) !== void 0) {
          var res = this.validateSchema(property, subschema, options, ctx.makeChild(subschema));
          result.importErrors(res);
        }
      }
      return result;
    };
    validators.properties = function validateProperties(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var properties = schema.properties || {};
      for (var property in properties) {
        var subschema = properties[property];
        if (subschema === void 0) {
          continue;
        } else if (subschema === null) {
          throw new SchemaError('Unexpected null, expected schema in "properties"');
        }
        if (typeof options.preValidateProperty == "function") {
          options.preValidateProperty(instance, property, subschema, options, ctx);
        }
        var prop = getEnumerableProperty(instance, property);
        var res = this.validateSchema(prop, subschema, options, ctx.makeChild(subschema, property));
        if (res.instance !== result.instance[property]) result.instance[property] = res.instance;
        result.importErrors(res);
      }
      return result;
    };
    function testAdditionalProperty(instance, schema, options, ctx, property, result) {
      if (!this.types.object(instance)) return;
      if (schema.properties && schema.properties[property] !== void 0) {
        return;
      }
      if (schema.additionalProperties === false) {
        result.addError({
          name: "additionalProperties",
          argument: property,
          message: "is not allowed to have the additional property " + JSON.stringify(property)
        });
      } else {
        var additionalProperties = schema.additionalProperties || {};
        if (typeof options.preValidateProperty == "function") {
          options.preValidateProperty(instance, property, additionalProperties, options, ctx);
        }
        var res = this.validateSchema(instance[property], additionalProperties, options, ctx.makeChild(additionalProperties, property));
        if (res.instance !== result.instance[property]) result.instance[property] = res.instance;
        result.importErrors(res);
      }
    }
    validators.patternProperties = function validatePatternProperties(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var patternProperties = schema.patternProperties || {};
      for (var property in instance) {
        var test = true;
        for (var pattern in patternProperties) {
          var subschema = patternProperties[pattern];
          if (subschema === void 0) {
            continue;
          } else if (subschema === null) {
            throw new SchemaError('Unexpected null, expected schema in "patternProperties"');
          }
          try {
            var regexp = new RegExp(pattern, "u");
          } catch (_e) {
            regexp = new RegExp(pattern);
          }
          if (!regexp.test(property)) {
            continue;
          }
          test = false;
          if (typeof options.preValidateProperty == "function") {
            options.preValidateProperty(instance, property, subschema, options, ctx);
          }
          var res = this.validateSchema(instance[property], subschema, options, ctx.makeChild(subschema, property));
          if (res.instance !== result.instance[property]) result.instance[property] = res.instance;
          result.importErrors(res);
        }
        if (test) {
          testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
        }
      }
      return result;
    };
    validators.additionalProperties = function validateAdditionalProperties(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      if (schema.patternProperties) {
        return null;
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      for (var property in instance) {
        testAdditionalProperty.call(this, instance, schema, options, ctx, property, result);
      }
      return result;
    };
    validators.minProperties = function validateMinProperties(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var keys = Object.keys(instance);
      if (!(keys.length >= schema.minProperties)) {
        result.addError({
          name: "minProperties",
          argument: schema.minProperties,
          message: "does not meet minimum property length of " + schema.minProperties
        });
      }
      return result;
    };
    validators.maxProperties = function validateMaxProperties(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var keys = Object.keys(instance);
      if (!(keys.length <= schema.maxProperties)) {
        result.addError({
          name: "maxProperties",
          argument: schema.maxProperties,
          message: "does not meet maximum property length of " + schema.maxProperties
        });
      }
      return result;
    };
    validators.items = function validateItems(instance, schema, options, ctx) {
      var self = this;
      if (!this.types.array(instance)) return;
      if (!schema.items) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      instance.every(function(value, i) {
        var items = Array.isArray(schema.items) ? schema.items[i] || schema.additionalItems : schema.items;
        if (items === void 0) {
          return true;
        }
        if (items === false) {
          result.addError({
            name: "items",
            message: "additionalItems not permitted"
          });
          return false;
        }
        var res = self.validateSchema(value, items, options, ctx.makeChild(items, i));
        if (res.instance !== result.instance[i]) result.instance[i] = res.instance;
        result.importErrors(res);
        return true;
      });
      return result;
    };
    validators.minimum = function validateMinimum(instance, schema, options, ctx) {
      if (!this.types.number(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (schema.exclusiveMinimum && schema.exclusiveMinimum === true) {
        if (!(instance > schema.minimum)) {
          result.addError({
            name: "minimum",
            argument: schema.minimum,
            message: "must be greater than " + schema.minimum
          });
        }
      } else {
        if (!(instance >= schema.minimum)) {
          result.addError({
            name: "minimum",
            argument: schema.minimum,
            message: "must be greater than or equal to " + schema.minimum
          });
        }
      }
      return result;
    };
    validators.maximum = function validateMaximum(instance, schema, options, ctx) {
      if (!this.types.number(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (schema.exclusiveMaximum && schema.exclusiveMaximum === true) {
        if (!(instance < schema.maximum)) {
          result.addError({
            name: "maximum",
            argument: schema.maximum,
            message: "must be less than " + schema.maximum
          });
        }
      } else {
        if (!(instance <= schema.maximum)) {
          result.addError({
            name: "maximum",
            argument: schema.maximum,
            message: "must be less than or equal to " + schema.maximum
          });
        }
      }
      return result;
    };
    validators.exclusiveMinimum = function validateExclusiveMinimum(instance, schema, options, ctx) {
      if (typeof schema.exclusiveMaximum === "boolean") return;
      if (!this.types.number(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var valid = instance > schema.exclusiveMinimum;
      if (!valid) {
        result.addError({
          name: "exclusiveMinimum",
          argument: schema.exclusiveMinimum,
          message: "must be strictly greater than " + schema.exclusiveMinimum
        });
      }
      return result;
    };
    validators.exclusiveMaximum = function validateExclusiveMaximum(instance, schema, options, ctx) {
      if (typeof schema.exclusiveMaximum === "boolean") return;
      if (!this.types.number(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var valid = instance < schema.exclusiveMaximum;
      if (!valid) {
        result.addError({
          name: "exclusiveMaximum",
          argument: schema.exclusiveMaximum,
          message: "must be strictly less than " + schema.exclusiveMaximum
        });
      }
      return result;
    };
    var validateMultipleOfOrDivisbleBy = function validateMultipleOfOrDivisbleBy2(instance, schema, options, ctx, validationType, errorMessage) {
      if (!this.types.number(instance)) return;
      var validationArgument = schema[validationType];
      if (validationArgument == 0) {
        throw new SchemaError(validationType + " cannot be zero");
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      var instanceDecimals = helpers.getDecimalPlaces(instance);
      var divisorDecimals = helpers.getDecimalPlaces(validationArgument);
      var maxDecimals = Math.max(instanceDecimals, divisorDecimals);
      var multiplier = Math.pow(10, maxDecimals);
      if (Math.round(instance * multiplier) % Math.round(validationArgument * multiplier) !== 0) {
        result.addError({
          name: validationType,
          argument: validationArgument,
          message: errorMessage + JSON.stringify(validationArgument)
        });
      }
      return result;
    };
    validators.multipleOf = function validateMultipleOf(instance, schema, options, ctx) {
      return validateMultipleOfOrDivisbleBy.call(this, instance, schema, options, ctx, "multipleOf", "is not a multiple of (divisible by) ");
    };
    validators.divisibleBy = function validateDivisibleBy(instance, schema, options, ctx) {
      return validateMultipleOfOrDivisbleBy.call(this, instance, schema, options, ctx, "divisibleBy", "is not divisible by (multiple of) ");
    };
    validators.required = function validateRequired(instance, schema, options, ctx) {
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (instance === void 0 && schema.required === true) {
        result.addError({
          name: "required",
          message: "is required"
        });
      } else if (this.types.object(instance) && Array.isArray(schema.required)) {
        schema.required.forEach(function(n) {
          if (getEnumerableProperty(instance, n) === void 0) {
            result.addError({
              name: "required",
              argument: n,
              message: "requires property " + JSON.stringify(n)
            });
          }
        });
      }
      return result;
    };
    validators.pattern = function validatePattern(instance, schema, options, ctx) {
      if (!this.types.string(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var pattern = schema.pattern;
      try {
        var regexp = new RegExp(pattern, "u");
      } catch (_e) {
        regexp = new RegExp(pattern);
      }
      if (!instance.match(regexp)) {
        result.addError({
          name: "pattern",
          argument: schema.pattern,
          message: "does not match pattern " + JSON.stringify(schema.pattern.toString())
        });
      }
      return result;
    };
    validators.format = function validateFormat(instance, schema, options, ctx) {
      if (instance === void 0) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (!result.disableFormat && !helpers.isFormat(instance, schema.format, this)) {
        result.addError({
          name: "format",
          argument: schema.format,
          message: "does not conform to the " + JSON.stringify(schema.format) + " format"
        });
      }
      return result;
    };
    validators.minLength = function validateMinLength(instance, schema, options, ctx) {
      if (!this.types.string(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var hsp = instance.match(/[\uDC00-\uDFFF]/g);
      var length = instance.length - (hsp ? hsp.length : 0);
      if (!(length >= schema.minLength)) {
        result.addError({
          name: "minLength",
          argument: schema.minLength,
          message: "does not meet minimum length of " + schema.minLength
        });
      }
      return result;
    };
    validators.maxLength = function validateMaxLength(instance, schema, options, ctx) {
      if (!this.types.string(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var hsp = instance.match(/[\uDC00-\uDFFF]/g);
      var length = instance.length - (hsp ? hsp.length : 0);
      if (!(length <= schema.maxLength)) {
        result.addError({
          name: "maxLength",
          argument: schema.maxLength,
          message: "does not meet maximum length of " + schema.maxLength
        });
      }
      return result;
    };
    validators.minItems = function validateMinItems(instance, schema, options, ctx) {
      if (!this.types.array(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (!(instance.length >= schema.minItems)) {
        result.addError({
          name: "minItems",
          argument: schema.minItems,
          message: "does not meet minimum length of " + schema.minItems
        });
      }
      return result;
    };
    validators.maxItems = function validateMaxItems(instance, schema, options, ctx) {
      if (!this.types.array(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (!(instance.length <= schema.maxItems)) {
        result.addError({
          name: "maxItems",
          argument: schema.maxItems,
          message: "does not meet maximum length of " + schema.maxItems
        });
      }
      return result;
    };
    function testArrays(v, i, a) {
      var j, len = a.length;
      for (j = i + 1, len; j < len; j++) {
        if (helpers.deepCompareStrict(v, a[j])) {
          return false;
        }
      }
      return true;
    }
    validators.uniqueItems = function validateUniqueItems(instance, schema, options, ctx) {
      if (schema.uniqueItems !== true) return;
      if (!this.types.array(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (!instance.every(testArrays)) {
        result.addError({
          name: "uniqueItems",
          message: "contains duplicate item"
        });
      }
      return result;
    };
    validators.dependencies = function validateDependencies(instance, schema, options, ctx) {
      if (!this.types.object(instance)) return;
      var result = new ValidatorResult(instance, schema, options, ctx);
      for (var property in schema.dependencies) {
        if (instance[property] === void 0) {
          continue;
        }
        var dep = schema.dependencies[property];
        var childContext = ctx.makeChild(dep, property);
        if (typeof dep == "string") {
          dep = [dep];
        }
        if (Array.isArray(dep)) {
          dep.forEach(function(prop) {
            if (instance[prop] === void 0) {
              result.addError({
                // FIXME there's two different "dependencies" errors here with slightly different outputs
                // Can we make these the same? Or should we create different error types?
                name: "dependencies",
                argument: childContext.propertyPath,
                message: "property " + prop + " not found, required by " + childContext.propertyPath
              });
            }
          });
        } else {
          var res = this.validateSchema(instance, dep, options, childContext);
          if (result.instance !== res.instance) result.instance = res.instance;
          if (res && res.errors.length) {
            result.addError({
              name: "dependencies",
              argument: childContext.propertyPath,
              message: "does not meet dependency required by " + childContext.propertyPath
            });
            result.importErrors(res);
          }
        }
      }
      return result;
    };
    validators["enum"] = function validateEnum(instance, schema, options, ctx) {
      if (instance === void 0) {
        return null;
      }
      if (!Array.isArray(schema["enum"])) {
        throw new SchemaError("enum expects an array", schema);
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (!schema["enum"].some(helpers.deepCompareStrict.bind(null, instance))) {
        result.addError({
          name: "enum",
          argument: schema["enum"],
          message: "is not one of enum values: " + schema["enum"].map(String).join(",")
        });
      }
      return result;
    };
    validators["const"] = function validateEnum(instance, schema, options, ctx) {
      if (instance === void 0) {
        return null;
      }
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (!helpers.deepCompareStrict(schema["const"], instance)) {
        result.addError({
          name: "const",
          argument: schema["const"],
          message: "does not exactly match expected constant: " + schema["const"]
        });
      }
      return result;
    };
    validators.not = validators.disallow = function validateNot(instance, schema, options, ctx) {
      var self = this;
      if (instance === void 0) return null;
      var result = new ValidatorResult(instance, schema, options, ctx);
      var notTypes = schema.not || schema.disallow;
      if (!notTypes) return null;
      if (!Array.isArray(notTypes)) notTypes = [notTypes];
      notTypes.forEach(function(type) {
        if (self.testType(instance, schema, options, ctx, type)) {
          var id = type && (type.$id || type.id);
          var schemaId = id || type;
          result.addError({
            name: "not",
            argument: schemaId,
            message: "is of prohibited type " + schemaId
          });
        }
      });
      return result;
    };
    module2.exports = attribute;
  }
});

// node_modules/jsonschema/lib/scan.js
var require_scan = __commonJS({
  "node_modules/jsonschema/lib/scan.js"(exports2, module2) {
    "use strict";
    var urilib = require("url");
    var helpers = require_helpers2();
    module2.exports.SchemaScanResult = SchemaScanResult;
    function SchemaScanResult(found, ref) {
      this.id = found;
      this.ref = ref;
    }
    module2.exports.scan = function scan(base, schema) {
      function scanSchema(baseuri, schema2) {
        if (!schema2 || typeof schema2 != "object") return;
        if (schema2.$ref) {
          var resolvedUri = urilib.resolve(baseuri, schema2.$ref);
          ref[resolvedUri] = ref[resolvedUri] ? ref[resolvedUri] + 1 : 0;
          return;
        }
        var id = schema2.$id || schema2.id;
        var ourBase = id ? urilib.resolve(baseuri, id) : baseuri;
        if (ourBase) {
          if (ourBase.indexOf("#") < 0) ourBase += "#";
          if (found[ourBase]) {
            if (!helpers.deepCompareStrict(found[ourBase], schema2)) {
              throw new Error("Schema <" + ourBase + "> already exists with different definition");
            }
            return found[ourBase];
          }
          found[ourBase] = schema2;
          if (ourBase[ourBase.length - 1] == "#") {
            found[ourBase.substring(0, ourBase.length - 1)] = schema2;
          }
        }
        scanArray(ourBase + "/items", Array.isArray(schema2.items) ? schema2.items : [schema2.items]);
        scanArray(ourBase + "/extends", Array.isArray(schema2.extends) ? schema2.extends : [schema2.extends]);
        scanSchema(ourBase + "/additionalItems", schema2.additionalItems);
        scanObject(ourBase + "/properties", schema2.properties);
        scanSchema(ourBase + "/additionalProperties", schema2.additionalProperties);
        scanObject(ourBase + "/definitions", schema2.definitions);
        scanObject(ourBase + "/patternProperties", schema2.patternProperties);
        scanObject(ourBase + "/dependencies", schema2.dependencies);
        scanArray(ourBase + "/disallow", schema2.disallow);
        scanArray(ourBase + "/allOf", schema2.allOf);
        scanArray(ourBase + "/anyOf", schema2.anyOf);
        scanArray(ourBase + "/oneOf", schema2.oneOf);
        scanSchema(ourBase + "/not", schema2.not);
      }
      function scanArray(baseuri, schemas) {
        if (!Array.isArray(schemas)) return;
        for (var i = 0; i < schemas.length; i++) {
          scanSchema(baseuri + "/" + i, schemas[i]);
        }
      }
      function scanObject(baseuri, schemas) {
        if (!schemas || typeof schemas != "object") return;
        for (var p in schemas) {
          scanSchema(baseuri + "/" + p, schemas[p]);
        }
      }
      var found = {};
      var ref = {};
      scanSchema(base, schema);
      return new SchemaScanResult(found, ref);
    };
  }
});

// node_modules/jsonschema/lib/validator.js
var require_validator = __commonJS({
  "node_modules/jsonschema/lib/validator.js"(exports2, module2) {
    "use strict";
    var urilib = require("url");
    var attribute = require_attribute();
    var helpers = require_helpers2();
    var scanSchema = require_scan().scan;
    var ValidatorResult = helpers.ValidatorResult;
    var ValidatorResultError = helpers.ValidatorResultError;
    var SchemaError = helpers.SchemaError;
    var SchemaContext = helpers.SchemaContext;
    var anonymousBase = "/";
    var Validator = function Validator2() {
      this.customFormats = Object.create(Validator2.prototype.customFormats);
      this.schemas = {};
      this.unresolvedRefs = [];
      this.types = Object.create(types);
      this.attributes = Object.create(attribute.validators);
    };
    Validator.prototype.customFormats = {};
    Validator.prototype.schemas = null;
    Validator.prototype.types = null;
    Validator.prototype.attributes = null;
    Validator.prototype.unresolvedRefs = null;
    Validator.prototype.addSchema = function addSchema(schema, base) {
      var self = this;
      if (!schema) {
        return null;
      }
      var scan = scanSchema(base || anonymousBase, schema);
      var ourUri = base || schema.$id || schema.id;
      for (var uri in scan.id) {
        this.schemas[uri] = scan.id[uri];
      }
      for (var uri in scan.ref) {
        this.unresolvedRefs.push(uri);
      }
      this.unresolvedRefs = this.unresolvedRefs.filter(function(uri2) {
        return typeof self.schemas[uri2] === "undefined";
      });
      return this.schemas[ourUri];
    };
    Validator.prototype.addSubSchemaArray = function addSubSchemaArray(baseuri, schemas) {
      if (!Array.isArray(schemas)) return;
      for (var i = 0; i < schemas.length; i++) {
        this.addSubSchema(baseuri, schemas[i]);
      }
    };
    Validator.prototype.addSubSchemaObject = function addSubSchemaArray(baseuri, schemas) {
      if (!schemas || typeof schemas != "object") return;
      for (var p in schemas) {
        this.addSubSchema(baseuri, schemas[p]);
      }
    };
    Validator.prototype.setSchemas = function setSchemas(schemas) {
      this.schemas = schemas;
    };
    Validator.prototype.getSchema = function getSchema(urn) {
      return this.schemas[urn];
    };
    Validator.prototype.validate = function validate2(instance, schema, options, ctx) {
      if (typeof schema !== "boolean" && typeof schema !== "object" || schema === null) {
        throw new SchemaError("Expected `schema` to be an object or boolean");
      }
      if (!options) {
        options = {};
      }
      var id = schema.$id || schema.id;
      var base = urilib.resolve(options.base || anonymousBase, id || "");
      if (!ctx) {
        ctx = new SchemaContext(schema, options, [], base, Object.create(this.schemas));
        if (!ctx.schemas[base]) {
          ctx.schemas[base] = schema;
        }
        var found = scanSchema(base, schema);
        for (var n in found.id) {
          var sch = found.id[n];
          ctx.schemas[n] = sch;
        }
      }
      if (options.required && instance === void 0) {
        var result = new ValidatorResult(instance, schema, options, ctx);
        result.addError("is required, but is undefined");
        return result;
      }
      var result = this.validateSchema(instance, schema, options, ctx);
      if (!result) {
        throw new Error("Result undefined");
      } else if (options.throwAll && result.errors.length) {
        throw new ValidatorResultError(result);
      }
      return result;
    };
    function shouldResolve(schema) {
      var ref = typeof schema === "string" ? schema : schema.$ref;
      if (typeof ref == "string") return ref;
      return false;
    }
    Validator.prototype.validateSchema = function validateSchema(instance, schema, options, ctx) {
      var result = new ValidatorResult(instance, schema, options, ctx);
      if (typeof schema === "boolean") {
        if (schema === true) {
          schema = {};
        } else if (schema === false) {
          schema = { type: [] };
        }
      } else if (!schema) {
        throw new Error("schema is undefined");
      }
      if (schema["extends"]) {
        if (Array.isArray(schema["extends"])) {
          var schemaobj = { schema, ctx };
          schema["extends"].forEach(this.schemaTraverser.bind(this, schemaobj));
          schema = schemaobj.schema;
          schemaobj.schema = null;
          schemaobj.ctx = null;
          schemaobj = null;
        } else {
          schema = helpers.deepMerge(schema, this.superResolve(schema["extends"], ctx));
        }
      }
      var switchSchema = shouldResolve(schema);
      if (switchSchema) {
        var resolved = this.resolve(schema, switchSchema, ctx);
        var subctx = new SchemaContext(resolved.subschema, options, ctx.path, resolved.switchSchema, ctx.schemas);
        return this.validateSchema(instance, resolved.subschema, options, subctx);
      }
      var skipAttributes = options && options.skipAttributes || [];
      for (var key in schema) {
        if (!attribute.ignoreProperties[key] && skipAttributes.indexOf(key) < 0) {
          var validatorErr = null;
          var validator = this.attributes[key];
          if (validator) {
            validatorErr = validator.call(this, instance, schema, options, ctx);
          } else if (options.allowUnknownAttributes === false) {
            throw new SchemaError("Unsupported attribute: " + key, schema);
          }
          if (validatorErr) {
            result.importErrors(validatorErr);
          }
        }
      }
      if (typeof options.rewrite == "function") {
        var value = options.rewrite.call(this, instance, schema, options, ctx);
        result.instance = value;
      }
      return result;
    };
    Validator.prototype.schemaTraverser = function schemaTraverser(schemaobj, s) {
      schemaobj.schema = helpers.deepMerge(schemaobj.schema, this.superResolve(s, schemaobj.ctx));
    };
    Validator.prototype.superResolve = function superResolve(schema, ctx) {
      var ref = shouldResolve(schema);
      if (ref) {
        return this.resolve(schema, ref, ctx).subschema;
      }
      return schema;
    };
    Validator.prototype.resolve = function resolve(schema, switchSchema, ctx) {
      switchSchema = ctx.resolve(switchSchema);
      if (ctx.schemas[switchSchema]) {
        return { subschema: ctx.schemas[switchSchema], switchSchema };
      }
      var parsed = urilib.parse(switchSchema);
      var fragment = parsed && parsed.hash;
      var document = fragment && fragment.length && switchSchema.substr(0, switchSchema.length - fragment.length);
      if (!document || !ctx.schemas[document]) {
        throw new SchemaError("no such schema <" + switchSchema + ">", schema);
      }
      var subschema = helpers.objectGetPath(ctx.schemas[document], fragment.substr(1));
      if (subschema === void 0) {
        throw new SchemaError("no such schema " + fragment + " located in <" + document + ">", schema);
      }
      return { subschema, switchSchema };
    };
    Validator.prototype.testType = function validateType(instance, schema, options, ctx, type) {
      if (type === void 0) {
        return;
      } else if (type === null) {
        throw new SchemaError('Unexpected null in "type" keyword');
      }
      if (typeof this.types[type] == "function") {
        return this.types[type].call(this, instance);
      }
      if (type && typeof type == "object") {
        var res = this.validateSchema(instance, type, options, ctx);
        return res === void 0 || !(res && res.errors.length);
      }
      return true;
    };
    var types = Validator.prototype.types = {};
    types.string = function testString(instance) {
      return typeof instance == "string";
    };
    types.number = function testNumber(instance) {
      return typeof instance == "number" && isFinite(instance);
    };
    types.integer = function testInteger(instance) {
      return typeof instance == "number" && instance % 1 === 0;
    };
    types.boolean = function testBoolean(instance) {
      return typeof instance == "boolean";
    };
    types.array = function testArray(instance) {
      return Array.isArray(instance);
    };
    types["null"] = function testNull(instance) {
      return instance === null;
    };
    types.date = function testDate(instance) {
      return instance instanceof Date;
    };
    types.any = function testAny(instance) {
      return true;
    };
    types.object = function testObject(instance) {
      return instance && typeof instance === "object" && !Array.isArray(instance) && !(instance instanceof Date);
    };
    module2.exports = Validator;
  }
});

// node_modules/jsonschema/lib/index.js
var require_lib = __commonJS({
  "node_modules/jsonschema/lib/index.js"(exports2, module2) {
    "use strict";
    var Validator = module2.exports.Validator = require_validator();
    module2.exports.ValidatorResult = require_helpers2().ValidatorResult;
    module2.exports.ValidatorResultError = require_helpers2().ValidatorResultError;
    module2.exports.ValidationError = require_helpers2().ValidationError;
    module2.exports.SchemaError = require_helpers2().SchemaError;
    module2.exports.SchemaScanResult = require_scan().SchemaScanResult;
    module2.exports.scan = require_scan().scan;
    module2.exports.validate = function(instance, schema, options) {
      var v = new Validator();
      return v.validate(instance, schema, options);
    };
  }
});

// src/parse-task.js
var parse_task_exports = {};
__export(parse_task_exports, {
  default: () => parse_task_default
});
module.exports = __toCommonJS(parse_task_exports);
var import_yamljs = __toESM(require_Yaml(), 1);
var import_front_matter = __toESM(require_front_matter(), 1);
var import_marked = __toESM(require_marked(), 1);

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

// src/parse-task.js
var import_chrono_node = __toESM(require_dist(), 1);
var import_jsonschema = __toESM(require_lib(), 1);

// src/parse-markdown.js
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

// src/parse-task.js
function compileDescription(data) {
  const description = [];
  if ("raw" in data) {
    description.push(data.raw.content.replace(/[\r\n]{3}/g, "\n\n").trim());
  }
  for (let heading in data) {
    if (["raw", "Metadata", "Sub-tasks", "Relations", "Comments"].indexOf(heading) !== -1) {
      continue;
    }
    description.push(
      /^# (.*)/.test(data[heading].heading) ? "" : data[heading].heading,
      data[heading].content
    );
  }
  return description.join("\n\n").trim();
}
function validateMetadataFromMarkdown(metadata) {
  const result = (0, import_jsonschema.validate)(metadata, {
    type: "object",
    properties: {
      "created": {
        oneOf: [
          { type: "string" },
          { type: "date" }
        ]
      },
      "updated": {
        oneOf: [
          { type: "string" },
          { type: "date" }
        ]
      },
      "started": {
        oneOf: [
          { type: "string" },
          { type: "date" }
        ]
      },
      "completed": {
        oneOf: [
          { type: "string" },
          { type: "date" }
        ]
      },
      "due": {
        oneOf: [
          { type: "string" },
          { type: "date" }
        ]
      },
      "progress": {
        type: "number"
      },
      "tags": {
        type: "array",
        items: { type: "string" }
      }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map((error) => `
${error.property} ${error.message}`).join(""));
  }
}
function validateMetadataFromJSON(metadata) {
  const result = (0, import_jsonschema.validate)(metadata, {
    type: "object",
    properties: {
      "created": { type: "date" },
      "updated": { type: "date" },
      "started": { type: "date" },
      "completed": { type: "date" },
      "due": { type: "date" },
      "progress": { type: "number" },
      "tags": {
        type: "array",
        items: { type: "string" }
      },
      "assigned": { type: "string" }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map((error) => `
${error.property} ${error.message}`).join(""));
  }
}
function validateSubTasks(subTasks) {
  const result = (0, import_jsonschema.validate)(subTasks, {
    type: "array",
    items: {
      type: "object",
      properties: {
        "text": { type: "string" },
        "completed": { type: "boolean" }
      }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map((error) => `
${error.property} ${error.message}`).join(""));
  }
}
function validateRelations(relations) {
  const result = (0, import_jsonschema.validate)(relations, {
    type: "array",
    items: {
      type: "object",
      properties: {
        "type": { type: "string" },
        "task": { type: "string" }
      }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map((error) => `
${error.property} ${error.message}`).join(""));
  }
}
function validateComments(comments) {
  const result = (0, import_jsonschema.validate)(comments, {
    type: "array",
    items: {
      type: "object",
      properties: {
        "author": { type: "string" },
        "date": { type: "date" },
        "text": { type: "string" }
      }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map((error) => `
${error.property} ${error.message}`).join(""));
  }
}
var parse_task_default = {
  /**
   * Convert markdown into a task object
   * @param {string} data
   * @return {object}
   */
  md2json(data) {
    let id = "", name = "", description = "", metadata = {}, subTasks = [], relations = [], comments = [];
    try {
      if (!data) {
        throw new Error("data is null or empty");
      }
      if (typeof data !== "string") {
        throw new Error("data is not a string");
      }
      if (import_front_matter.default.test(data)) {
        ({ attributes: metadata, body: data } = (0, import_front_matter.default)(data));
        if (typeof metadata !== "object") {
          throw new Error("invalid front matter content");
        }
      }
      let task = null;
      try {
        task = parseMarkdown(data);
      } catch (error) {
        throw new Error(`invalid markdown (${error.message})`);
      }
      const taskHeadings = Object.keys(task);
      if (taskHeadings.length === 0 || taskHeadings[0] === "raw") {
        throw new Error("data is missing a name heading");
      }
      name = taskHeadings[0];
      id = utility_default.getTaskId(name);
      if ("Metadata" in task) {
        const embeddedMetadata = import_yamljs.default.parse(task["Metadata"].content.trim().replace(/```(yaml|yml)?/g, ""));
        if (typeof embeddedMetadata !== "object") {
          throw new Error("invalid metadata content");
        }
        metadata = Object.assign(metadata, embeddedMetadata);
        delete task["Metadata"];
      }
      validateMetadataFromMarkdown(metadata);
      if ("created" in metadata && !(metadata.created instanceof Date)) {
        const dateValue = import_chrono_node.default.parseDate(metadata.created);
        if (dateValue === null) {
          throw new Error("unable to parse created date");
        }
        metadata.created = dateValue;
      }
      if ("updated" in metadata && !(metadata.updated instanceof Date)) {
        const dateValue = import_chrono_node.default.parseDate(metadata.updated);
        if (dateValue === null) {
          throw new Error("unable to parse updated date");
        }
        metadata.updated = dateValue;
      }
      if ("started" in metadata && !(metadata.started instanceof Date)) {
        const dateValue = import_chrono_node.default.parseDate(metadata.started);
        if (dateValue === null) {
          throw new Error("unable to parse started date");
        }
        metadata.started = dateValue;
      }
      if ("completed" in metadata && !(metadata.completed instanceof Date)) {
        const dateValue = import_chrono_node.default.parseDate(metadata.completed);
        if (dateValue === null) {
          throw new Error("unable to parse completed date");
        }
        metadata.completed = dateValue;
      }
      if ("due" in metadata && !(metadata.due instanceof Date)) {
        const dateValue = import_chrono_node.default.parseDate(metadata.due);
        if (dateValue === null) {
          throw new Error("unable to parse due date");
        }
        metadata.due = dateValue;
      }
      if ("progress" in metadata) {
        const numberValue = parseFloat(metadata.progress);
        if (isNaN(numberValue)) {
          throw new Error("progress value is not numeric");
        }
        metadata.progress = numberValue;
      }
      if ("Sub-tasks" in task) {
        try {
          subTasks = import_marked.default.lexer(task["Sub-tasks"].content)[0].items.map((item) => ({
            text: item.text.trim(),
            completed: item.checked || false
          }));
        } catch (error) {
          throw new Error("sub-tasks must contain a list");
        }
        delete task["Sub-tasks"];
      }
      if ("Relations" in task) {
        try {
          relations = import_marked.default.lexer(task["Relations"].content)[0].items.map((item) => {
            const parts = item.tokens[0].tokens[0].text.split(" ");
            return parts.length === 1 ? {
              task: parts[0].trim(),
              type: ""
            } : {
              task: parts.pop().trim(),
              type: parts.join(" ").trim()
            };
          });
        } catch (error) {
          throw new Error("relations must contain a list");
        }
        delete task["Relations"];
      }
      if ("Comments" in task) {
        try {
          const parsedComments = import_marked.default.lexer(task["Comments"].content)[0].items;
          for (let parsedComment of parsedComments) {
            const comment = { text: [] };
            const parts = parsedComment.text.split("\n");
            for (let part of parts) {
              if (part.startsWith("date: ")) {
                const dateValue = import_chrono_node.default.parseDate(part.substring("date: ".length));
                if (dateValue === null) {
                  throw new Error("unable to parse comment date");
                }
                comment.date = dateValue;
              } else if (part.startsWith("author: ")) {
                comment.author = part.substring("author: ".length);
              } else {
                comment.text.push(part);
              }
            }
            comment.text = comment.text.join("\n").trim();
            comments.push(comment);
          }
        } catch (error) {
          throw new Error("comments must contain a list");
        }
        delete task["Comments"];
      }
      description = compileDescription(task);
    } catch (error) {
      throw new Error(`Unable to parse task: ${error.message}`);
    }
    return { id, name, description, metadata, subTasks, relations, comments };
  },
  /**
   * Convert a task object into markdown
   * @param {object} data
   * @return {string}
   */
  json2md(data) {
    const result = [];
    try {
      if (!data) {
        throw new Error("data is null or empty");
      }
      if (typeof data !== "object") {
        throw new Error("data is not an object");
      }
      if (!("name" in data)) {
        throw new Error("data object is missing name");
      }
      if ("metadata" in data && data.metadata !== null) {
        validateMetadataFromJSON(data.metadata);
        if (Object.keys(data.metadata).length > 0) {
          result.push(
            `---
${import_yamljs.default.stringify(data.metadata, 4, 2).trim()}
---`
          );
        }
      }
      result.push(`# ${data.name}`);
      if ("description" in data) {
        result.push(data.description);
      }
      if ("subTasks" in data && data.subTasks !== null) {
        validateSubTasks(data.subTasks);
        if (data.subTasks.length > 0) {
          result.push(
            "## Sub-tasks",
            data.subTasks.map((subTask) => `- [${subTask.completed ? "x" : " "}] ${subTask.text}`).join("\n")
          );
        }
      }
      if ("relations" in data && data.relations !== null) {
        validateRelations(data.relations);
        if (data.relations.length > 0) {
          result.push(
            "## Relations",
            data.relations.map(
              (relation) => `- [${relation.type ? `${relation.type} ` : ""}${relation.task}](${relation.task}.md)`
            ).join("\n")
          );
        }
      }
      if ("comments" in data && data.comments !== null) {
        validateComments(data.comments);
        if (data.comments.length > 0) {
          result.push(
            "## Comments",
            data.comments.map((comment) => {
              const commentOutput = [];
              if ("author" in comment && comment.author) {
                commentOutput.push(`author: ${comment.author}`);
              }
              if ("date" in comment && comment.date) {
                commentOutput.push(`date: ${comment.date.toISOString()}`);
              }
              commentOutput.push(...comment.text.split("\n"));
              return `- ${commentOutput.map((v, i) => i > 0 ? `  ${v}` : v).join("\n")}`;
            }).join("\n")
          );
        }
      }
    } catch (error) {
      throw new Error(`Unable to build task: ${error.message}`);
    }
    return `${result.filter((l) => !!l).join("\n\n")}
`;
  }
};
