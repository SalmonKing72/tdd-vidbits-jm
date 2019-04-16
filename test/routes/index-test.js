const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
        it('renders an item with a title and image', async () => {
            const video = await seedItemToDatabase();
      
            const response = await request(app)
                .get(`/`);
      
            assert.include(parseTextFromHTML(response.text, '#videos-container'), video.title);
            assert.include(parseTextFromHTML(response.text, '#videos-container'), video.description);
          });
    });
});