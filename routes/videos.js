const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res, err) => {
    const videos = await Video.find({});
    res.render('videos/index', {videos});
})

router.get('/create', async (req, res, err) => {
    res.render('create', {});
})

router.post('/', async (req, res, err) => {
    const videoTitle = req.body.title;
    const videoDescription = req.body.description;

    await Video.create({
        title: videoTitle,
        description: videoDescription
    });

    res.status(201).send(`
        <h1>${videoTitle}</h1>
        <p>${videoDescription}</>
    `);
});

module.exports = router;