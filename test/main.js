import main from '../src/main';

import {expect} from 'chai';
import * as RouteCommands from '../src/route-commands';
import * as WatchHosts from '../src/watch-hosts';

describe('main', function() {
  let argv = process.argv;
  afterEach(function() {
    process.argv = argv;
  });

  it('should call route commands', function() {
    this.stub(RouteCommands, 'default');
    process.argv = ['node', 'index.js', 'route'];
    main();

    expect(RouteCommands.default).to.have.been.calledOnce;
  });
  it('should call watch hosts', function() {
    this.stub(WatchHosts, 'default');
    process.argv = ['node', 'index.js', 'watch', 'foo'];
    main();

    expect(WatchHosts.default).to.have.been.calledOnce;
  });
  it('should throw usage error without command', function() {
    process.argv = ['node', 'index.js'];
    expect(main).to.throw(/Usage/);
  });
  it('should throw usage error without hosts file', function() {
    process.argv = ['node', 'index.js', 'watch'];
    expect(main).to.throw(/Usage/);
  });
});
