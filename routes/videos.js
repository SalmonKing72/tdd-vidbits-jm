const router = require('express').Router();
const Video = require('../models/video');

router.post('/videos', async (req, res, err) => {
    const videoTitle = req.body.title;
    const videoDescription = req.body.description;

    await Video.create({
        title: videoTitle,
        description: videoDescription
    });
    
    res.status(201).send();
});

module.exports = router;