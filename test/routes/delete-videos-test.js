const {assert} = require('chai');
const request = require('supertest');

const Video = require('../../models/video');
const app = require('../../app');

const {buildItemObject, seedItemToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:videoId/deletions', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('POST', () => {
        it('deletes the video', async () => {
            //create a video to delete...
            const videoOptions = {
                description: "My favorite item", 
                videoUrl: 'https://www.youtube.com/embed/UiZxU9Ykhr8',
                title: "69 Camaro SS"
            };
    
            const testVideoInput = buildItemObject(videoOptions);
            const testVideo = await seedItemToDatabase(videoOptions);
    
            const response = await request(app)
                .post(`/videos/${testVideo._id}/deletions`)
                .type('form')
                .send(testVideoInput);
            
            //attempt to fetch the deleted video from the DB.
            const deletedVideo = await Video.findById(testVideo._id)
            
            assert.equal(response.status, 302);
            assert.equal(response.headers.location, '/');
            assert.isNull(deletedVideo, 'item was not deleted from the database');
        });
    }); 
});