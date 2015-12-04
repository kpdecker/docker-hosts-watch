import Docker from 'dockerode';
import watchHosts from './watch-hosts';
import routeCommands from './route-commands';

export default function main() {
  let action = process.argv[2],
      arg = process.argv[3];

  let docker = new Docker();

  if (action === 'route') {
    routeCommands(arg || 'add', docker);
  } else if (action === 'watch') {
    if (!arg) {
      usage();
    }
    watchHosts(arg, docker);
  } else {
    usage();
  }

  function usage() {
    throw new Error(`Usage: ${process.argv[1]} [watch $hostsFile] | [route $command]`);
  }
}

/* istanbul ignore next */
process.on('unhandledRejection', function(err) {
  throw err;
});
