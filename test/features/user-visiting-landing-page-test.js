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
            browser.click('a[href="/videos/create.html"]');
            assert.include(browser.getText('a[id="create-video-link"]'), 'Save a video');
        });
    })
});