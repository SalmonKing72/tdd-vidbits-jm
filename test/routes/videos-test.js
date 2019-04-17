const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const Video = require('../../models/video');
const app = require('../../app');

const {parseTextFromHTML, buildItemObject, seedItemToDatabase} = require('../test-utils');
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

            assert.strictEqual(response.status, 201);
            assert.include(response.text, videoToCreate.title);
            assert.include(response.text, videoToCreate.description);
        });

        it('does not persist a video without a title', async () => {
            const invalidItemToCreate = {
                description: 'test',
            };
        
            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(invalidItemToCreate);
    
            const videos = await Video.find({});
    
            assert.equal(videos.length, 0);
            assert.strictEqual(response.status, 400);
        })

        it('creates a video and persists it', async () => {
            const videoToCreate = buildItemObject();

            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(videoToCreate);

            let createdVideo = await Video.findOne(videoToCreate);
            assert.isNotNull(createdVideo, 'the video was not created in the database');
        });
    });
});