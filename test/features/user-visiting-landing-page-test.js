const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

const generateRandomUrl = (domain) => {
    return `http://${domain}/${Math.random()}`;
};

const setupVideoData = (video) => {
    browser.url('/videos/create');
    browser.setValue('#title-input', video.title);
    browser.setValue('#description-input', video.description);
    browser.setValue('#videoUrl-input', video.videoUrl);
    browser.click('#submit-button');
    browser.url('/');
}

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

            setupVideoData(video);
    
            assert.include(browser.getText('#videos-container'), video.title);
            assert.include(browser.getText('#videos-container'), video.description);
        });

        it('can navigate to a single video', () => {
            let video = buildItemObject();

            setupVideoData(video);

            browser.click('.video-title a');
            assert.include(browser.getText('.video-title'), video.title);
            assert.include(browser.getText('.video-description'), video.description);
        })
    })

    describe('to create a new item', () => {
        it('provides a form to create a new item', () => {
            browser.url('/');
            browser.click('a[id="create-video-link"]');
            assert.include(browser.getText('button[id="submit-button"]'), 'Save Video');
        });
    });

    
});