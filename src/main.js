import Docker from 'dockerode';
import watchHosts from './watch-hosts';
import routeCommands from './route-commands';

export default function main() {
  let action = process.argv[2],
      hostsFile = process.argv[3];

  let docker = new Docker();

  if (action === 'route') {
    routeCommands(docker);
  } else if (action === 'watch') {
    if (!hostsFile) {
      usage();
    }
    watchHosts(hostsFile, docker);
  } else {
    usage();
  }

  function usage() {
    throw new Error(`Usage: ${process.argv[1]} [watch $hostsFile] | [route]`);
  }
}

/* istanbul ignore next */
process.on('unhandledRejection', function(err) {
  throw err;
});
