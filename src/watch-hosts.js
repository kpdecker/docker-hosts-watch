import _ from 'lodash';
import fs from 'fs';

import eventStream from './event-stream';

export default function watchHosts(hostsFile, docker) {
  return eventStream(docker, (err, data) => {
    if (err) {
      throw err;
    }

    if (data.status === 'start' || data.status === 'stop') {
      console.log(data.status, data.from);
      lookupHosts(docker)
          .then((hosts) => {
            console.log('Hosts updated');
            fs.writeFile(hostsFile, hosts, function(err) {
              if (err) {
                throw err;
              }
            });
          });
    }
  });
}

function lookupHosts(docker) {
  return new Promise((resolve, reject) => {
    docker.listContainers(function(err, containers) {
      /* istanbul ignore next */
      if (err) {
        return reject(err);
      }

      let hosts = [];
      resolve(
        Promise.all(containers.map(function(container) {
          let names = _.unique(container.Names.map(function(name) { return name.replace(/^.*\//, ''); })).sort();

          return new Promise(function(resolve, reject) {
            docker.getContainer(container.Id).inspect(function(err, info) {
              /* istanbul ignore if */
              if (err) {
                reject(err);
              } else {
                hosts.push(`${info.NetworkSettings.IPAddress} ${info.Config.Hostname} ${names.join(' ')}`);
                resolve();
              }
            });
          });
        }))
        .then(() => `${hosts.sort().join('\n')}\n`)
      );
    });
  });
}
