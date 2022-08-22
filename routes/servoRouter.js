const express = require('express');
const router = express.Router();
const servoServices = require('../services/servoServices.js');

router.get('/', async function (req, res, next) {
    try {
        res.send({ 'Message': "OK" });
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.get('/motorStats/:id', async function (req, res, next) {
    try {
        res.send(await servoServices.fetchServoStats(req.params.id));
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.get('/setMotorStats', async function (req, res, next) {
    try {
        res.send(await servoServices.setServoStats(req.body));
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});
module.exports = router;