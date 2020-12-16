const minimist = require('minimist');
const path = require('path');
const utility = require('./src/utility');

module.exports = async () => {
  require('dotenv').config({ path: path.join(__dirname, '.env') });

  // Parse arguments
  const args = minimist(process.argv.slice(2), {
    boolean: [
      'version',
      'help',
      'interactive',
      'force',
      'index',
      'quiet',
      'json',
      'save',
      'ascending',
      'descending',
      'relative'
    ],
    string: [
      'id',
      'name',
      'description',
      'column',
      'sub-task',
      'remove-sub-task',
      'count-sub-tasks',
      'tag',
      'remove-tag',
      'count-tags',
      'relation',
      'remove-relation',
      'count-relations',
      'created',
      'updated',
      'started',
      'completed',
      'due',
      'sprint',
      'date',
      'workload',
      'assigned',
      'position'
    ],
    alias: {
      'version': ['v'],
      'help': ['h'],
      'interactive': ['i'],
      'name': ['n'],
      'description': ['d'],
      'column': ['c'],
      'untracked': ['u'],
      'force': ['f'],
      'index': ['x'],
      'quiet': ['q'],
      'json': ['j'],
      'due': ['e'],
      'sub-task': ['s'],
      'tag': ['t'],
      'relation': ['r'],
      'sprint': ['p'],
      'workload': ['w'],
      'ascending': ['a'],
      'descending': ['z']
    }
  });

  // Get first command
  let command = args._[0] || '';

  // Check for command shortcuts
  if (command === 'i') {
    command = 'init';
  }
  if (command === 'a') {
    command = 'add';
  }
  if (command === 'e') {
    command = 'edit';
  }
  if (command === 'ren') {
    command = 'rename';
  }
  if (command === 'rm') {
    command = 'remove';
  }
  if (command === 'mv') {
    command = 'move';
  }
  if (command === 't') {
    command = 'task';
  }
  if (command === 'f') {
    command = 'find';
  }
  if (command === 's') {
    command = 'status';
  }
  if (command === 'sp') {
    command = 'sprint';
  }
  if (command === 'b') {
    command = 'board';
  }
  if (args.version || command === 'v') {
    command = 'version';
  }
  if (args.help || command === 'h') {
    command = 'help';
  }

  // Run command
  switch (command) {
    case 'version':
      require('./commands/version')(args);
      break;
    case 'init':
      await require('./commands/init')(args);
      break;
    case 'add':
      await require('./commands/add')(args);
      break;
    case 'edit':
      await require('./commands/edit')(args);
      break;
    case 'rename':
      await require('./commands/rename')(args);
      break;
    case 'remove':
      await require('./commands/remove')(args);
      break;
    case 'move':
      await require('./commands/move')(args);
      break;
    case 'task':
      await require('./commands/task')(args);
      break;
    case 'find':
      await require('./commands/find')(args);
      break;
    case 'status':
      await require('./commands/status')(args);
      break;
    case 'validate':
      await require('./commands/validate')(args);
      break;
    case 'sort':
      await require('./commands/sort')(args, process.argv.slice(3));
      break;
    case 'sprint':
      await require('./commands/sprint')(args);
      break;
    case 'board':
      await require('./commands/board')(args);
      break;
    case 'nuclear':
      await require('./commands/nuclear')(args);
      break;
    case '':
    case 'help':
      require('./commands/help')(args);
      break;
    default:
      utility.error(`"${command}" is not a valid command`, true);
  }
};
