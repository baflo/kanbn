import yaml from "yamljs";
import fm from "front-matter";
import marked from "marked";
import utility from "./utility.js";
import * as chrono from "chrono-node";
import { validate } from "jsonschema";
import parseMarkdown from "./parse-markdown.js";
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
  const result = validate(metadata, {
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
  const result = validate(metadata, {
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
  const result = validate(subTasks, {
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
  const result = validate(relations, {
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
  const result = validate(comments, {
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
      if (fm.test(data)) {
        ({ attributes: metadata, body: data } = fm(data));
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
      id = utility.getTaskId(name);
      if ("Metadata" in task) {
        const embeddedMetadata = yaml.parse(task["Metadata"].content.trim().replace(/```(yaml|yml)?/g, ""));
        if (typeof embeddedMetadata !== "object") {
          throw new Error("invalid metadata content");
        }
        metadata = Object.assign(metadata, embeddedMetadata);
        delete task["Metadata"];
      }
      validateMetadataFromMarkdown(metadata);
      if ("created" in metadata && !(metadata.created instanceof Date)) {
        const dateValue = chrono.parseDate(metadata.created);
        if (dateValue === null) {
          throw new Error("unable to parse created date");
        }
        metadata.created = dateValue;
      }
      if ("updated" in metadata && !(metadata.updated instanceof Date)) {
        const dateValue = chrono.parseDate(metadata.updated);
        if (dateValue === null) {
          throw new Error("unable to parse updated date");
        }
        metadata.updated = dateValue;
      }
      if ("started" in metadata && !(metadata.started instanceof Date)) {
        const dateValue = chrono.parseDate(metadata.started);
        if (dateValue === null) {
          throw new Error("unable to parse started date");
        }
        metadata.started = dateValue;
      }
      if ("completed" in metadata && !(metadata.completed instanceof Date)) {
        const dateValue = chrono.parseDate(metadata.completed);
        if (dateValue === null) {
          throw new Error("unable to parse completed date");
        }
        metadata.completed = dateValue;
      }
      if ("due" in metadata && !(metadata.due instanceof Date)) {
        const dateValue = chrono.parseDate(metadata.due);
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
          subTasks = marked.lexer(task["Sub-tasks"].content)[0].items.map((item) => ({
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
          relations = marked.lexer(task["Relations"].content)[0].items.map((item) => {
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
          const parsedComments = marked.lexer(task["Comments"].content)[0].items;
          for (let parsedComment of parsedComments) {
            const comment = { text: [] };
            const parts = parsedComment.text.split("\n");
            for (let part of parts) {
              if (part.startsWith("date: ")) {
                const dateValue = chrono.parseDate(part.substring("date: ".length));
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
${yaml.stringify(data.metadata, 4, 2).trim()}
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
export {
  parse_task_default as default
};
