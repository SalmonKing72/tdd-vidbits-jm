const {assert} = require('chai');

describe('User visits root', () => {
    describe('without existing videos', () => {
      it('starts blank', () => {
        browser.url('/');
        assert.equal(browser.getText('#videos-container'), '');
      });
    });
});