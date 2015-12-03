import eventStream from '../src/event-stream';

import {Readable} from 'stream';
import {expect} from 'chai';

describe('event-stream', function() {
  it('should monitor events', function(done) {
    let stream = new Readable(),
        getEvents = this.spy((opt, cb) => cb(undefined, stream));

    stream.push(JSON.stringify({foo: 'bar'}));
    stream.push(null);
    eventStream({getEvents}, (err, data) => {
      expect(err).to.not.exist;
      expect(data).to.eql({foo: 'bar'});
      done();
    });
  });
  it('should error in event monitor', function(done) {
    eventStream({
      getEvents(opt, cb) { cb(new Error('fail')); }
    }, (err) => {
      expect(err).to.match(/fail/);
      done();
    });
  });
});
