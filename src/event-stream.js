import byline from 'byline';

export default function eventStream(docker, callback) {
  docker.getEvents({}, function(err, stream) {
    if (err) {
      return callback(err);
    }

    byline(stream)
      .on('data', function(data) {
        data = JSON.parse(data.toString());
        callback(undefined, data);
      });
  });
}
