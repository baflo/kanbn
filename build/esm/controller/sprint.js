import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
async function interactive(name = null, description = null) {
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Sprint name:",
      default: name || "",
      validate: async (value) => {
        if (!value) {
          return "Sprint name cannot be empty";
        }
        return true;
      }
    },
    {
      type: "confirm",
      name: "setDescription",
      message: "Add a description?",
      default: false
    },
    {
      type: "editor",
      name: "description",
      message: "Sprint description:",
      default: description || "",
      when: (answers) => answers.setDescription
    }
  ]);
}
function startSprint(name, description) {
  kanbn.sprint(name, description, /* @__PURE__ */ new Date()).then((sprint) => {
    console.log(`Started new sprint "${sprint.name}" at ${sprint.start.toISOString()}`);
  }).catch((error) => {
    utility.error(error);
  });
}
var sprint_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  let name = "";
  if (args.name) {
    name = utility.strArg(args.name);
  }
  let description = "";
  if (args.description) {
    description = utility.strArg(args.description);
  }
  if (args.interactive) {
    interactive(name, description).then((answers) => {
      startSprint(answers.name, answers.description || "");
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    startSprint(name, description);
  }
};
export {
  sprint_default as default
};
