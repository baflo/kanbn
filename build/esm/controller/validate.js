import kanbn from "../main.js";
import utility from "../utility.js";
import yaml from "yamljs";
var validate_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  kanbn.validate(args.save).then((result) => {
    if (result === true) {
      console.log("Everything OK");
    } else {
      utility.error(
        `${result.length} errors found in task files:
${args.json ? JSON.stringify(result, null, 2) : yaml.stringify(result, 4, 2)}`
      );
    }
  }).catch((error) => {
    utility.error(error);
  });
};
export {
  validate_default as default
};
