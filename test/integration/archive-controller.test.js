import mockRequire from 'mock-require';
import mockArgv from 'mock-argv';
import captureConsole from 'capture-console';
import {
  config as mockConfig,
  kanbn as mockKanbn
} from '../mock-kanbn.js';

let kanbn;

QUnit.module('archive controller tests', {
  before() {
    require('../qunit-contains');
    mockRequire('../../src/main', mockKanbn);
    kanbn = require('../../index');
  },
  beforeEach() {
    mockConfig.initialised = false;
    mockConfig.output = null;
  }
});

QUnit.test('Archive task in uninitialised folder', async assert => {
  const output = [];
  captureConsole.startIntercept(process.stderr, s => {
    output.push(s);
  });

  await mockArgv(['archive'], kanbn);

  captureConsole.stopIntercept(process.stderr);
  assert.contains(output, /Kanbn has not been initialised in this folder/);
});

QUnit.test('List archived tasks', async assert => {
  const output = [];
  captureConsole.startIntercept(process.stdout, s => {
    output.push(s);
  });

  mockConfig.initialised = true;
  mockConfig.archivedTasks = [
    'task-1',
    'task-2',
    'task-3'
  ];
  await mockArgv(['archive', '-l'], kanbn);

  captureConsole.stopIntercept(process.stdout);
  assert.contains(output, /task-1/);
  assert.contains(output, /task-2/);
  assert.contains(output, /task-3/);
});

QUnit.test('Archive a task with no task specified', async assert => {
  const output = [];
  captureConsole.startIntercept(process.stderr, s => {
    output.push(s);
  });

  mockConfig.initialised = true;
  await mockArgv(['archive'], kanbn);

  captureConsole.stopIntercept(process.stderr);
  assert.contains(output, /No task id specified/);
});

QUnit.test('Archive a task that does not exist', async assert => {
  const output = [];
  captureConsole.startIntercept(process.stderr, s => {
    output.push(s);
  });

  mockConfig.initialised = true;
  await mockArgv(['archive', 'task-1'], kanbn);

  captureConsole.stopIntercept(process.stderr);
  assert.contains(output, /No task file found with id "task-1"/);
});

QUnit.test('Archive a task', async assert => {
  const output = [];
  captureConsole.startIntercept(process.stdout, s => {
    output.push(s);
  });

  mockConfig.initialised = true;
  mockConfig.taskExists = true;
  await mockArgv(['archive', 'task-1'], kanbn);

  captureConsole.stopIntercept(process.stdout);
  assert.contains(output, /Archived task "task-1"/);
  assert.deepEqual(
    mockConfig.output,
    {
      taskId: 'task-1'
    }
  );
});
