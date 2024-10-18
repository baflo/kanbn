import kanbn from "../main.js";
import utility from "../utility.js";
import * as chrono from "chrono-node";
import yaml from "yamljs";
var status_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  let sprint = null;
  if (args.sprint) {
    sprint = utility.strArg(args.sprint);
    const sprintNumber = parseInt(sprint);
    if (!isNaN(sprintNumber)) {
      sprint = sprintNumber;
    }
  }
  let dates = null;
  if (args.date) {
    dates = utility.arrayArg(args.date);
    if (dates.length) {
      for (let i = 0; i < dates.length; i++) {
        const dateValue = chrono.parseDate(dates[i]);
        if (dateValue === null) {
          utility.error("Unable to parse date");
          return;
        }
        dates[i] = dateValue;
      }
    }
  }
  kanbn.status(
    args.quiet,
    args.untracked,
    args.due,
    sprint,
    dates
  ).then((output) => {
    if (args.quiet && args.untracked && !args.json) {
      console.log(
        output.length ? output.join("\n") : "No untracked tasks found"
      );
    } else {
      console.log(args.json ? JSON.stringify(output, null, 2) : yaml.stringify(output, 4, 2));
    }
  }).catch((error) => {
    utility.error(error);
  });
};
export {
  status_default as default
};