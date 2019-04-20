const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, findIframeElementBySource} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:videoId', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders a single video and its fields', async () => {
            const video = await seedItemToDatabase({
                description: "My favorite item", 
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });

            const response = await request(app)
                .get(`/videos/${video._id}`)
                .send();

            assert.equal(response.status, 200);
            assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
            assert.include(parseTextFromHTML(response.text, '.video-description'), video.description);
            const playerElement = findIframeElementBySource(response.text, video.videoUrl);
            assert.equal(playerElement.src, video.videoUrl);
        });
    });
});