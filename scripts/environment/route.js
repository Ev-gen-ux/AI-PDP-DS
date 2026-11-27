import { main, routeTask } from './check.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { routeRequest } from './request-route.js';
const args = process.argv.slice(2);
if (args[0] === '--request') {
  try {
    if (args.length !== 2) throw Error('Use --request followed by one complete request');
    const suggestion = routeRequest(args[1]);
    if (suggestion.intent === 'work' && suggestion.object) {
      const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
      suggestion.route = routeTask(root, suggestion);
    }
    console.log(JSON.stringify(suggestion, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
} else main('route');
