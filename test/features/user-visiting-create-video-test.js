const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');


describe('User visits create item page', () => {
    describe('posts a new item', () => {
        it('renders the newly created video', () => {
            let video = buildItemObject({
                description: "My favorite video",
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });

            browser.url('/videos/create');
            browser.setValue('#title-input', video.title);
            browser.setValue('#description-input', video.description);
            browser.setValue('#videoUrl-input', video.videoUrl);
            browser.click('#submit-button');

            assert.include(browser.getText('body'), video.title);
            assert.include(browser.getText('body'), video.description);
        });
    });
});
