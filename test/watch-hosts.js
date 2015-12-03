import watchHosts from '../src/watch-hosts';

import {expect} from 'chai';
import * as EventStream from '../src/event-stream';
import fs from 'fs';

describe('watch-hosts', function() {
  describe('events', function() {
    it('should monitor start events', function(done) {
      this.stub(EventStream, 'default', (docker, cb) => cb(undefined, {status: 'start'}));
      doIt({
        listContainers() {
          done();
        }
      });
    });
    it('should monitor stop events', function(done) {
      this.stub(EventStream, 'default', (docker, cb) => cb(undefined, {status: 'stop'}));
      doIt({
        listContainers() {
          done();
        }
      });
    });
    it('should ignore other events', function(done) {
      this.stub(EventStream, 'default', (docker, cb) => {
        cb(undefined, {status: 'foo'});
        setTimeout(done, 0);
      });
      doIt({
        listContainers() {
          throw new Error('should not run');
        }
      });
    });
  });

  describe('file output', function() {
    beforeEach(function() {
      this.stub(EventStream, 'default', (docker, cb) => cb(undefined, {status: 'start'}));
    });

    it('should write hosts file', function(done) {
      this.stub(fs, 'writeFile', (path, data, cb) => {
        expect(path).to.equal('path!');
        expect(data).to.eql('ip! host! bar bat\n');
        cb();
        done();
      });
      doIt();
    });
    it('should throw on write error', function(done) {
      this.stub(fs, 'writeFile', (path, data, cb) => {
        expect(() => cb(new Error('fail'))).to.throw('fail');
        done();
      });
      doIt();
    });
  });

  it('should error in event monitor', function() {
    this.stub(EventStream, 'default', (docker, cb) => cb(new Error('fail')));
    expect(() => doIt({})).to.throw('fail');
  });

  function doIt(options) {
    watchHosts('path!', {
      listContainers(cb) {
        cb(undefined, [{
          Id: 1,
          Names: [
            'bat',
            'foo/bar',
            'bar'
          ]
        }]);
      },
      getContainer(id) {
        expect(id).to.equal(1);
        return {
          inspect(cb) {
            cb(undefined, {
              Config: {
                Hostname: 'host!'
              },
              NetworkSettings: {
                IPAddress: 'ip!'
              }
            });
          }
        };
      },
      ...options
    });
  }
});
