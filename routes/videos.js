const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res, err) => {
    const videos = await Video.find({});
    res.render('videos/index', {videos});
})

router.get('/create', async (req, res, err) => {
    res.render('videos/create', {});
})

router.post('/', async (req, res, err) => {
    const videoTitle = req.body.title;
    const videoDescription = req.body.description;

    const video = new Video({
        title: videoTitle,
        description: videoDescription
    });

    video.validateSync();

    if (video.errors) {
        res.status(400).render('videos/create', {newVideo: video});
    } else {
        await video.save();
        res.status(201).send(`
            <h1>${videoTitle}</h1>
            <p>${videoDescription}</>
        `);
    }
});

module.exports = router;