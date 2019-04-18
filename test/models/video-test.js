const Video = require('../../models/video');
const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Model: Video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('Video\'s title field', () => {
    it('should be a string', async () => {
      const testTitle = 3;

      const video = await Video.create({
        title: testTitle,
        description: 'test',
        videoUrl: 'test'
      });

      assert.strictEqual(testTitle.toString(), video.title);
    });
  });

  describe('Video\'s description field', () => {
    it('should be a string', async () => {
      const testDescription = 3;

      const video = await Video.create({
        title: 'test',
        description: testDescription,
        videoUrl: 'test'
      });

      assert.strictEqual(testDescription.toString(), video.description);
    });
  });

  describe('Video\'s url field', () => {
    it('should be a string', async () => {
      const testUrl = 3;

      const video = await Video.create({
        title: 'test',
        description: 'test',
        videoUrl: testUrl
      });

      assert.strictEqual(testUrl.toString(), video.videoUrl);
    });
  });
});