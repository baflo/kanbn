import fs from 'fs';
import path from 'path';
import utility from '../utility.js';

export default async (args, argv, routeId) => {
  const helpRoute = await import(path.join(import.meta.dirname, '../../routes', `${routeId}.json`));
  fs.promises.readFile(path.join(import.meta.dirname, '../../', helpRoute.help), { encoding: 'utf-8' }).then(help => {
    console.log(utility.replaceTags(help).trim());
  });
};
