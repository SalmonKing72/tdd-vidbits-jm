const {assert} = require('chai');
const request = require('supertest');

const Video = require('../../models/video');
const app = require('../../app');

const {parseTextFromHTML, parseValueFromHTMLInput, buildItemObject, seedItemToDatabase, findIframeElementBySource} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('redirects to the right location', async () => {
            const response = await request(app)
                .get('/');

            assert.strictEqual(response.status, 302);
        });

        it('renders an item with a title and image', async () => {
            const video = await seedItemToDatabase();
      
            const response = await request(app)
                .get(`/videos/`);
      
            assert.include(parseTextFromHTML(response.text, '#videos-container'), video.title);
            assert.include(parseTextFromHTML(response.text, '#videos-container'), video.description);
          });
    });

    describe('POST', () => {
        it('responds successfully', async () => {
            const videoToCreate = buildItemObject();

            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(videoToCreate);

            assert.strictEqual(response.status, 302);
        });

        it('does not persist a video without a title', async () => {
            const invalidItemToCreate = {
                description: 'test',
                videoUrl: 'https://www.youtube.com/embed/6f1AmbR2pzM'
            };
        
            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(invalidItemToCreate);
    
            const videos = await Video.find({});
    
            assert.equal(videos.length, 0);
            assert.strictEqual(response.status, 400);
            assert.include(response.text, invalidItemToCreate.description);
            assert.include(response.text, invalidItemToCreate.videoUrl);
        });

        it('does not persist a video without a url', async () => {
            const invalidItemToCreate = {
                title: 'testing',
                description: 'test'
            };
        
            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(invalidItemToCreate);
    
            const videos = await Video.find({});
    
            assert.equal(videos.length, 0);
            assert.strictEqual(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'required');
            assert.include(response.text, invalidItemToCreate.description);
            assert.include(response.text, invalidItemToCreate.title);
        });

        it('does not persist a video without a description', async () => {
            const invalidItemToCreate = {
                title: 'testing',
                videoUrl: 'test'
            };
        
            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(invalidItemToCreate);
    
            const videos = await Video.find({});
    
            assert.equal(videos.length, 0);
            assert.strictEqual(response.status, 400);
            assert.include(parseTextFromHTML(response.text, 'form'), 'required');
            assert.include(response.text, invalidItemToCreate.title);
            assert.include(response.text, invalidItemToCreate.videoUrl);
        });

        it('renders the video form with errors when the title is empty', async () => {
            const invalidItemToCreate = {
                description: 'test',
                videoUrl: 'https://www.youtube.com/embed/6f1AmbR2pzM'
            };

            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(invalidItemToCreate);

            assert.include(parseTextFromHTML(response.text, 'form'), 'required');
            assert.include(response.text, invalidItemToCreate.description);
            assert.include(response.text, invalidItemToCreate.videoUrl);
        });

        it('creates a video and persists it', async () => {
            const videoToCreate = buildItemObject();

            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(videoToCreate);

            //check to see if the video exists in the DB.
            let createdVideo = await Video.findOne(videoToCreate);
            assert.isNotNull(createdVideo, 'the video was not created in the database');
            
            //check to see if we redirect to the video's view
            assert.strictEqual(response.status, 302);
            assert.equal(response.headers.location, `/videos/${createdVideo._id}`);
        });
    });
});

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

describe('Server path: /videos/create', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders a form to update a video', async () => {
            const response = await request(app)
                    .get('/videos/create')
                    .send();

            assert.include(parseTextFromHTML(response.text, 'form'), 'Title');
            assert.include(parseTextFromHTML(response.text, 'form'), 'Video URL');
            assert.include(parseTextFromHTML(response.text, 'form'), 'Description');
            assert.include(parseTextFromHTML(response.text, 'body'), 'Back');
            assert.include(parseTextFromHTML(response.text, 'body'), 'Save Video');
        });
    });
});

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