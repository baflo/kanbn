import mockArgv from 'mock-argv';
import captureConsole from 'capture-console';
import kanbn from '../../index.js';

QUnit.module('version controller tests', {
  before() {
    require('../qunit-contains');
  }
});

QUnit.test('Get kanbn version', async assert => {
  const output = [];
  captureConsole.startIntercept(process.stdout, s => {
    output.push(s);
  });

  await mockArgv(['version'], kanbn);

  captureConsole.stopIntercept(process.stdout);
  assert.contains(output, /v\d+\.\d+\.\d+/);
});
