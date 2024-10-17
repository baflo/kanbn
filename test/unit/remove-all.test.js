import mockFileSystem from 'mock-fs';
import kanbn from '../../src/main.js';
import context from '../context.js';

QUnit.module('removeAll tests', {
  beforeEach() {
    require('../fixtures')({
      countTasks: 1
    });
  },
  afterEach() {
    mockFileSystem.restore();
  }
});

QUnit.test('Remove all should remove all kanbn files and folders', async assert => {
  const BASE_PATH = await kanbn.getMainFolder();

  // Kanbn should be initialised
  assert.equal(await kanbn.initialised(), true);

  // Remove everything
  await kanbn.removeAll();

  // Kanbn should not be initialised
  assert.equal(await kanbn.initialised(), false);

  // Verify that the index and folders have been removed
  context.indexExists(assert, BASE_PATH, false);
  context.kanbnFolderExists(assert, BASE_PATH, false);
  context.tasksFolderExists(assert, BASE_PATH, false);
});
