const {assert} = require('chai');
const request = require('supertest');

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
});