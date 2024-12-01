import fs from 'fs';
import path from 'path';
import utility from '../utility.js';

const dirname = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;

export default async (args, argv, routeId) => {
  const helpRoute = (await import(path.join(dirname, '../../routes', `${routeId}.json`), { assert: { type: "json" } })).default;
  fs.promises.readFile(path.join(dirname, '../../', helpRoute.help), { encoding: 'utf-8' }).then(help => {
    console.log(utility.replaceTags(help).trim());
  });
};
