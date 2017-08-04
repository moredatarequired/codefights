var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var GameState = require('./../src/dungeonBlaster');

describe('GameState', function() {
  it('GameState can be created', function() {
    let simpleDungeon = [
      '#*',
      '^ '
    ];
    let frozen = '2;2;#*:^ ';
    expect(GameState.toFrozen(simpleDungeon)).to.equal(frozen);
    let gs = new GameState(frozen);
    expect(gs.freeze()).to.equal(frozen);
  });
});
