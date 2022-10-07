const express = require('express');
const router = express.Router();

router.post('/:id', async function (req, res, next) {
    try {
        console.log(req.body);
        res.send({ 'Message': "OK" });
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        res.send({ 'Message': "OK" });
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

module.exports = router;