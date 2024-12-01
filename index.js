import minimist from 'minimist';
import path from 'path';
import dotenv from 'dotenv';
import autoload from 'auto-load';

const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;

export default async () => {
  dotenv.config({ path: path.join(dirname, '.env') });

  // Get the command
  const command = process.argv[2] || '';

  // Load route configs and get the current route
  const routes = autoload(path.join(dirname, 'routes')), route = {};
  const found = Object.entries(routes).find(([id, route]) => route.commands.indexOf(command) !== -1);

  // Make sure we have a valid route
  if (found === undefined) {
    utility.error(`"${command}" is not a valid command`);
    return;
  }
  ({ 0: route.id, 1: route.config } = found);

  // Check for help argument and override route if present
  const args = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: { help: ['h'] }
  });
  if (route.id === 'help' || args.help) {
    const helpCommand = (c => args._.filter(arg => c.indexOf(arg) !== -1).pop() || 'help')(
      [...Object.values(routes).map(r => r.commands)].flat()
    );
    route.id = Object.keys(routes).find(k => routes[k].commands.indexOf(helpCommand) !== -1);
    route.config = routes.help;
  }

  // Parse arguments again using route-specific options and pass to the relevant controller
  (await import(`${route.config.controller}.js`)).default(
    minimist(
      process.argv.slice(2),
      route.config.args
    ),
    process.argv,
    route.id
  );
};
