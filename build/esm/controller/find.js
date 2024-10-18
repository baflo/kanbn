import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
import * as chrono from "chrono-node";
import yaml from "yamljs";
import inquirerRecursive from "inquirer-recursive";
inquirer.registerPrompt("recursive", inquirerRecursive);
const searchFields = [
  {
    name: "Id",
    field: "id",
    type: "string"
  },
  {
    name: "Name",
    field: "name",
    type: "string"
  },
  {
    name: "Description",
    field: "description",
    type: "string"
  },
  {
    name: "Column",
    field: "column",
    type: "string"
  },
  {
    name: "Created",
    field: "created",
    type: "date"
  },
  {
    name: "Updated",
    field: "updated",
    type: "date"
  },
  {
    name: "Started",
    field: "started",
    type: "date"
  },
  {
    name: "Completed",
    field: "completed",
    type: "date"
  },
  {
    name: "Due",
    field: "due",
    type: "date"
  },
  {
    name: "Progress",
    field: "progress",
    type: "number"
  },
  {
    name: "Sub-tasks",
    field: "sub-task",
    type: "string"
  },
  {
    name: "Count sub-tasks",
    field: "count-sub-tasks",
    type: "number"
  },
  {
    name: "Tags",
    field: "tag",
    type: "string"
  },
  {
    name: "Count tags",
    field: "count-tags",
    type: "number"
  },
  {
    name: "Relations",
    field: "relation",
    type: "string"
  },
  {
    name: "Count relations",
    field: "count-relations",
    type: "number"
  },
  {
    name: "Comments",
    field: "comment",
    type: "string"
  },
  {
    name: "Count comments",
    field: "count-comments",
    type: "number"
  },
  {
    name: "Assigned",
    field: "assigned",
    type: "string"
  }
];
async function interactive() {
  return await inquirer.prompt([
    {
      type: "recursive",
      name: "filters",
      initialMessage: "Add a filter?",
      message: "Add another filter?",
      default: true,
      prompts: [
        {
          type: "rawlist",
          name: "type",
          message: "Filter type:",
          default: searchFields[0].name,
          choices: [
            ...searchFields.map((s) => s.name),
            new inquirer.Separator(),
            "None"
          ]
        },
        {
          type: "input",
          name: "value",
          message: "Filter value:",
          default: "",
          when: (answers) => searchFields.filter((s) => s.type === "string").map((s) => s.name).indexOf(answers.type) !== -1,
          validate: async (value) => {
            if (!value) {
              return "Filter value cannot be empty";
            }
            return true;
          }
        },
        {
          type: "input",
          name: "value",
          message: "Filter value:",
          default: "",
          when: (answers) => searchFields.filter((s) => s.type === "date").map((s) => s.name).indexOf(answers.type) !== -1,
          validate: async (value) => {
            if (!value) {
              return "Filter value cannot be empty";
            }
            if (chrono.parseDate(value) === null) {
              return "Unable to parse date";
            }
            return true;
          }
        },
        {
          type: "input",
          name: "value",
          message: "Filter value:",
          default: "",
          when: (answers) => searchFields.filter((s) => s.type === "number").map((s) => s.name).indexOf(answers.type) !== -1,
          validate: async (value) => {
            if (!value) {
              return "Filter value cannot be empty";
            }
            if (isNaN(value)) {
              return "Filter value must be numeric";
            }
            return true;
          }
        },
        {
          type: "confirm",
          name: "value",
          message: "Filter value:",
          default: true,
          when: (answers) => searchFields.filter((s) => s.type === "boolean").map((s) => s.name).indexOf(answers.type) !== -1
        }
      ]
    }
  ]);
}
function findTasks(filters, quiet, json) {
  const removeEmptyProperties = (o) => Object.fromEntries(Object.entries(o).filter(
    ([k, v]) => !(Array.isArray(v) && v.length == 0) && !!v
  ));
  kanbn.search(filters, quiet).then((results) => {
    if (quiet) {
      console.log(json ? JSON.stringify(results, null, 2) : results.join("\n"));
    } else {
      if (json) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        console.log(`Found ${results.length} task${results.length === 1 ? "" : "s"}`);
        if (results.length > 0) {
          console.log("---");
        }
        console.log(results.map((result) => yaml.stringify(removeEmptyProperties(result), 4, 2).trim()).join("\n---\n"));
      }
    }
  }).catch((error) => {
    utility.error(error);
  });
}
function addFilterValue(filters, filterName, filterValue) {
  if (filters[filterName]) {
    if (Array.isArray(filters[filterName])) {
      filters[filterName].push(filterValue);
    } else {
      filters[filterName] = [filters[filterName], filterValue];
    }
  } else {
    filters[filterName] = filterValue;
  }
}
function convertNumericFilters(filters, filterName) {
  if (Array.isArray(filters[filterName])) {
    for (let i = 0; i < filters[filterName].length; i++) {
      const numericValue = parseInt(filters[filterName][i]);
      if (isNaN(numericValue)) {
        return false;
      }
      filters[filterName][i] = numericValue;
    }
  } else {
    const numericValue = parseInt(filters[filterName]);
    if (isNaN(numericValue)) {
      return false;
    }
    filters[filterName] = numericValue;
  }
  return true;
}
function convertDateFilters(filters, filterName) {
  if (Array.isArray(filters[filterName])) {
    for (let i = 0; i < filters[filterName].length; i++) {
      const dateValue = chrono.parseDate(filters[filterName][i]);
      if (dateValue === null) {
        return false;
      }
      filters[filterName][i] = dateValue;
    }
  } else {
    const dateValue = chrono.parseDate(filters[filterName]);
    if (dateValue === null) {
      return false;
    }
    filters[filterName] = dateValue;
  }
  return true;
}
var find_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  let index;
  try {
    index = await kanbn.getIndex();
  } catch (error) {
    utility.error(error);
    return;
  }
  const columnNames = Object.keys(index.columns);
  if (!columnNames.length) {
    utility.error('No columns defined in the index\nTry running {b}kanbn init -c "column name"{b}');
    return;
  }
  if ("customFields" in index.options) {
    for (let customField of index.options.customFields) {
      searchFields.push({
        name: customField.name,
        field: customField.name,
        type: customField.type
      });
    }
  }
  const filters = {};
  for (let filterProperty of searchFields.map((s) => s.field)) {
    if (args[filterProperty]) {
      filters[filterProperty] = args[filterProperty];
    }
  }
  if ("count-sub-tasks" in filters) {
    if (!convertNumericFilters(filters, "count-sub-tasks")) {
      utility.error("Count sub-tasks filter value must be numeric");
      return;
    }
  }
  if ("count-tags" in filters) {
    if (!convertNumericFilters(filters, "count-tags")) {
      utility.error("Count tags filter value must be numeric");
      return;
    }
  }
  if ("count-relations" in filters) {
    if (!convertNumericFilters(filters, "count-relations")) {
      utility.error("Count relations filter value must be numeric");
      return;
    }
  }
  if ("count-comments" in filters) {
    if (!convertNumericFilters(filters, "count-comments")) {
      utility.error("Count comments filter value must be numeric");
      return;
    }
  }
  if ("workload" in filters) {
    if (!convertNumericFilters(filters, "workoad")) {
      utility.error("Workload filter value must be numeric");
      return;
    }
  }
  if ("progress" in filters) {
    if (!convertNumericFilters(filters, "progress")) {
      utility.error("Progress filter value must be numeric");
      return;
    }
  }
  if ("created" in filters) {
    if (!convertDateFilters(filters, "created")) {
      utility.error("Unable to parse created date");
      return;
    }
  }
  if ("updated" in filters) {
    if (!convertDateFilters(filters, "updated")) {
      utility.error("Unable to parse updated date");
      return;
    }
  }
  if ("started" in filters) {
    if (!convertDateFilters(filters, "started")) {
      utility.error("Unable to parse started date");
      return;
    }
  }
  if ("completed" in filters) {
    if (!convertDateFilters(filters, "completed")) {
      utility.error("Unable to parse completed date");
      return;
    }
  }
  if ("due" in filters) {
    if (!convertDateFilters(filters, "due")) {
      utility.error("Unable to parse due date");
      return;
    }
  }
  if ("customFields" in index.options) {
    for (let customField of index.options.customFields) {
      if (customField.name in args) {
        filters[customField.name] = args[customField.name];
        switch (customField.type) {
          case "boolean":
            if (typeof filters[customField.name] !== "boolean") {
              utility.error(`Custom field "${customField.name}" value is not a boolean`);
              return;
            }
            break;
          case "number":
            if (!convertNumericFilters(filters, customField.name)) {
              utility.error(`Custom field "${customField.name}" value is not a number`);
              return;
            }
            break;
          case "date":
            if (!convertDateFilters(filters, customField.name)) {
              utility.error(`Unable to parse date for custom field "${customField.name}"`);
              return;
            }
            break;
          default:
            break;
        }
      }
    }
  }
  if (args.interactive) {
    interactive().then((answers) => {
      inquirer.prompt([
        {
          type: "confirm",
          name: "nonquiet",
          message: "Show full task details in results?",
          default: !args.quiet
        },
        {
          type: "confirm",
          name: "json",
          message: "Show results in JSON format?",
          default: !!args.json
        }
      ]).then((otherAnswers) => {
        for (let filter of answers.filters) {
          addFilterValue(
            filters,
            searchFields.find((s) => s.name === filter.type).field,
            filter.value
          );
        }
        findTasks(filters, !otherAnswers.nonquiet, otherAnswers.json);
      }).catch((error) => {
        utility.error(error);
      });
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    findTasks(filters, args.quiet, args.json);
  }
};
export {
  find_default as default
};
