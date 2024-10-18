import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
import inquirerRecursive from "inquirer-recursive";
inquirer.registerPrompt("recursive", inquirerRecursive);
async function interactive(options, initialised) {
  const columnNames = [];
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project name:",
      default: options.name || "",
      validate: (value) => {
        if (!value) {
          return "Project name cannot be empty";
        }
        return true;
      }
    },
    {
      type: "confirm",
      name: "setDescription",
      message: initialised ? "Edit the project description?" : "Add a project description?"
    },
    {
      type: "editor",
      name: "description",
      message: "Project description:",
      default: options.description || "",
      when: (answers) => answers.setDescription
    },
    {
      type: "recursive",
      initialMessage: "Add a column?",
      message: "Add another column?",
      name: "columns",
      when: () => !initialised,
      prompts: [
        {
          type: "input",
          name: "columnName",
          message: "Column name:",
          validate: (value) => {
            if (value.length === 0) {
              return "Column name cannot be empty";
            }
            if ((options.columns || []).indexOf(value) !== -1 || columnNames.indexOf(value) !== -1) {
              return "Column name already exists";
            }
            columnNames.push(value);
            return true;
          }
        }
      ]
    }
  ]);
}
async function initialise(options, initialised) {
  const mainFolder = await kanbn.getMainFolder();
  kanbn.initialise(options).then(() => {
    if (initialised) {
      console.log(`Reinitialised existing kanbn board in ${mainFolder}`);
    } else {
      console.log(`Initialised empty kanbn board in ${mainFolder}`);
    }
  }).catch((error) => {
    utility.error(error);
  });
}
var init_default = async (args) => {
  let options = {};
  const initialised = await kanbn.initialised();
  if (initialised) {
    try {
      const index = await kanbn.getIndex();
      options.name = index.name;
      options.description = index.description;
      options.columns = Object.keys(index.columns);
    } catch (error) {
      utility.error(error);
      return;
    }
  }
  if (args.name) {
    options.name = utility.strArg(args.name);
  }
  if (args.description) {
    options.description = utility.strArg(args.description);
  }
  if (args.column) {
    options.columns = utility.arrayArg(args.column);
  }
  if (args.interactive) {
    interactive(options, initialised).then(async (answers) => {
      if ("columns" in answers) {
        answers.columns = answers.columns.map((column) => column.columnName);
      }
      await initialise(answers, initialised);
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    await initialise(options, initialised);
  }
};
export {
  init_default as default
};
