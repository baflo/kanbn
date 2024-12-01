import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
import getGitUsername from "git-user-name";
async function interactive(text, author) {
  return await inquirer.prompt([
    {
      type: "input",
      name: "text",
      message: "Comment text:",
      default: text || "",
      validate: async (value) => {
        if (!value) {
          return "Comment text cannot be empty";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "author",
      message: "Author:",
      default: author || ""
    }
  ]);
}
function addComment(taskId, text, author) {
  kanbn.comment(taskId, text, author).then((taskId2) => {
    console.log(`Added comment to task "${taskId2}"`);
  }).catch((error) => {
    utility.error(error);
  });
}
var comment_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn comment "task id"{b}');
    return;
  }
  try {
    await kanbn.taskExists(taskId);
  } catch (error) {
    utility.error(error);
    return;
  }
  let commentText = "", commentAuthor = "";
  if (args.text) {
    commentText = utility.strArg(args.text);
  }
  if (args.author && typeof args.author === "string") {
    commentAuthor = utility.strArg(args.author);
  } else {
    commentAuthor = getGitUsername();
  }
  if (args.interactive) {
    interactive(commentText, commentAuthor).then((answers) => {
      addComment(taskId, answers.text, answers.author);
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    addComment(taskId, commentText, commentAuthor);
  }
};
export {
  comment_default as default
};
