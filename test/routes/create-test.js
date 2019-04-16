const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');

const {buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Server path: /videos', () => {
    beforeEach(connectDatabaseAndDropData);

    afterEach(disconnectDatabase);

    describe('POST', () => {
        it('responds successfully', async () => {
            const videoToCreate = buildItemObject();

            const response = await request(app)
                .post('/videos')
                .type('form')
                .send(videoToCreate);

            assert.strictEqual(response.status, 201);
        });

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