import routeCommands from '../src/route-commands';

import {expect} from 'chai';

describe('route-commands', function() {
  it('should generate route add command', function() {
    this.stub(console, 'log');

    routeCommands({
      modem: {host: 'host!'},
      getNetwork(net) {
        expect(net).to.equal('bridge');
        return {
          inspect(cb) {
            cb(undefined, {
              IPAM: {
                Config: [
                  {Subnet: 'sub!'}
                ]
              }
            });
          }
        };
      }
    });

    expect(console.log).to.have.been.calledWith('route add sub! host!');
  });
  it('should fail if missing ip', function() {
    expect(() => {
      routeCommands({
        modem: {host: undefined}
      });
    }).to.throw(/VM host/);
  });
});
