const router = require('express').Router();

router.post('/videos', async (req, res, err) => {
    res.status(201).send();
});

module.exports = router;