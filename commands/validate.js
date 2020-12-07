const kanbn = require('../lib/main');
const utility = require('../lib/utility');
const Spinner = require('cli-spinner').Spinner;

module.exports = async args => {

  // Make sure kanbn has been initialised
  if (!await kanbn.initialised()) {
    utility.error('Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}', true);
  }

  // Validate kanbn files
  const spinner = new Spinner('Validating index and task files...');
  spinner.setSpinnerString(18);
  spinner.start();
  kanbn.validate(args.save)
  .then(result => {
    spinner.stop(true);
    if (result === true) {
      console.log('Everything ok');
    } else {
      utility.error(`${result.length} errors found in task files:\n${result.join('\n')}`, true);
    }
  })
  .catch(error => {
    spinner.stop(true);
    utility.error(error, true);
  });
};
