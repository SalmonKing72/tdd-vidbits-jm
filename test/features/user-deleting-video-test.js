const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User vists create item page.', () => {
    describe('posts a new item.', () => {
        it('deletes the item', () => {
            let videoToDelete = buildItemObject({
                description: "My favorite video",
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });
            browser.url('/videos/create');
            browser.setValue('#title-input', videoToDelete.title);
            browser.setValue('#description-input', videoToDelete.description);
            browser.setValue('#videoUrl-input', videoToDelete.videoUrl);
            browser.click('#submit-button');
            
            //delete the item
            browser.click('#delete-button');
            assert.notInclude(browser.getText('body'), videoToDelete.description);
            assert.notInclude(browser.getText('body'), videoToDelete.title);
        });
    });
});