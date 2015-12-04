export default function routeCommands(docker) {
  if (!docker.modem.host) {
    throw new Error('route command must be run on docker-machine VM host');
  }

  docker.getNetwork('bridge').inspect(function(err, info) {
    /* istanbul ignore next */
    if (err) {
      throw err;
    }

    console.log(`route add ${info.IPAM.Config[0].Subnet} ${docker.modem.host}`);
  });
}
