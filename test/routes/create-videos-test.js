const {assert} = require('chai');
const request = require('supertest');

const Video = require('../../models/video');
const app = require('../../app');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

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

describe('Server path: /videos', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

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
            //create invalid video to post.
            const invalidItemToCreate = {
                description: 'test',
                videoUrl: 'https://www.youtube.com/embed/6f1AmbR2pzM'
            };

            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(invalidItemToCreate);

            // check to see if error messages are displayed
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