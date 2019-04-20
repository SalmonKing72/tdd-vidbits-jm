const {assert} = require('chai');
const request = require('supertest');

const Video = require('../../models/video');
const app = require('../../app');

const {parseTextFromHTML, parseValueFromHTMLInput, buildItemObject, seedItemToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:videoId/edit', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders a form to update a video', async () => {
            const video = await seedItemToDatabase({
                description: "My favorite item", 
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });

            const response = await request(app)
                    .get(`/videos/${video._id}/edit`)
                    .send();

            assert.include(parseValueFromHTMLInput(response.text, '#title-input'), video.title);
            assert.include(parseValueFromHTMLInput(response.text, '#description-input'), video.description);
            assert.include(parseValueFromHTMLInput(response.text, '#videoUrl-input'), video.videoUrl);
            assert.include(parseTextFromHTML(response.text, 'body'), 'Back');
            assert.include(parseTextFromHTML(response.text, 'body'), 'Save Video');
        });
    });
});

describe('Server path: /videos/:videoId/updates', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('POST', () => {
        it('updates the video', async () => {
            const video = await seedItemToDatabase({
                description: "My favorite item", 
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });

            const videoUpdateInput = buildItemObject({
                description: "updated video description", 
                title: video.title,
                videoUrl: video.videoUrl
            });

            const response = await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(videoUpdateInput);

            const updatedVideo = await Video.findOne({_id: video._id});

            assert.isNotNull(updatedVideo);
            //check to see if we redirect to the video's view
            assert.strictEqual(response.status, 302);
            assert.equal(response.headers.location, `/videos/${updatedVideo._id}`);
        });

        it('presents errors for invalid update', async () => {
            const video = await seedItemToDatabase({
                description: "My favorite item", 
                title: "69 Camaro SS",
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8'
            });

            const videoUpdateInput = {
                title: video.title,
                videoUrl: video.videoUrl
            };

            const response = await request(app)
                .post(`/videos/${video._id}/updates`)
                .type('form')
                .send(videoUpdateInput);

            //check to see if proper response and error messages are displayed
            assert.strictEqual(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'required');

            //check to see if video data is still the original
            const currentVideo = await Video.findOne({_id: video._id});
            assert.equal(currentVideo.title, video.title);
            assert.equal(currentVideo.description, video.description);
            assert.equal(currentVideo.videoUrl, video.videoUrl);
        });
    });
});