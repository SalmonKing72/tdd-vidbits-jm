const {assert} = require('chai');

describe('User visits root', () => {
    describe('without existing videos', () => {
        it('starts blank', () => {
            browser.url('/');
            assert.equal(browser.getText('#videos-container'), '');
        });
    });

    describe('to create a new item', () => {
        it('provides a form to create a new item', () => {
            browser.url('/');
            browser.click('a[id="create-video-link"]');
            assert.include(browser.getText('a[id="save-video-link"]'), 'Save a video');
        });
    })
});