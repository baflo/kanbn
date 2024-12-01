import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
function removeAll() {
  kanbn.removeAll().then(() => {
    console.log("kanbn has been removed");
  }).catch((error) => {
    utility.error(error);
  });
}
var remove_all_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  if (args.force) {
    removeAll();
  } else {
    inquirer.prompt([
      {
        type: "confirm",
        message: "Are you sure you want to remove kanbn and all tasks?",
        name: "sure",
        default: false
      }
    ]).then(async (answers) => {
      if (answers.sure) {
        removeAll();
      }
    }).catch((error) => {
      utility.error(error);
    });
  }
};
export {
  remove_all_default as default
};
