const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits root', () => {
    describe('without existing videos', () => {
        it('starts blank', () => {
            browser.url('/');
            assert.equal(browser.getText('#videos-container'), '');
        });
    });

    describe('with an existing video', () => {
        it('displays the video', () => {
            let video = buildItemObject();
            browser.url('/videos/create');
            browser.setValue('#title-input', video.title);
            browser.setValue('#description-input', video.description);
            browser.click('#submit-button');
            browser.url('/');

            assert.include(browser.getText('body'), video.title);
            assert.include(browser.getText('body'), video.description);
        })
    })

    describe('to create a new item', () => {
        it('provides a form to create a new item', () => {
            browser.url('/');
            browser.click('a[id="create-video-link"]');
            assert.include(browser.getText('button[id="submit-button"]'), 'Save a video');
        });
    })
});