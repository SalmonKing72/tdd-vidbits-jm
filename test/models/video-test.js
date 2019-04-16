const Video = require('../../models/video');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Video', () => {
  beforeEach(async function connectDatabase() {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async function disconnectDatabase() {
    await mongoose.disconnect();
  });

  describe('Video\'s title field', () => {
    it('should be a string', async () => {
      const testTitle = 3;

      const video = await Video.create({
        title: testTitle,
        description: 'test'
      });

      assert.strictEqual(testTitle.toString(), video.title);
    });
  });
});