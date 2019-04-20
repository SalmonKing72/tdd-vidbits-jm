const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits edit item page', () => {
    describe('posts an updated item', () => {
        it('renders the newly created video', () => {
            const video = buildItemObject({
                description: "My favorite video",
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });
            const updatedTitle = "69 Camaro SS Video"

            //create the video
            browser.url('/videos/create');
            browser.setValue('#title-input', video.title);
            browser.setValue('#description-input', video.description);
            browser.setValue('#videoUrl-input', video.videoUrl);
            browser.click('#submit-button');
            
            //update the title
            browser.click('#edit-button');
            browser.setValue('#title-input', updatedTitle);
            browser.setValue('#description-input', video.description);
            browser.setValue('#videoUrl-input', video.videoUrl);
            browser.setValue('#submit-button');

            assert.include(browser.getText('body'), updatedTitle);
            assert.include(browser.getText('body'), video.description);
        });
    });
});