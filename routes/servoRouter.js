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
        console.log(123);
        res.send(await servoServices.fetchServoStats(req.params.id));
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.get('/services/:number', async function (req, res, next) {
    try {
        res.send(await servoServices.getServices(req.params.number));
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.get('/services/unlock/:id', async function (req, res, next) {
    try {
        res.send(await servoServices.setServoStats(req.params.id));
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.post('/services/create', async function (req, res, next) {
    try {
        res.send(await servoServices.createService(req.body));
    } catch (err) {
        console.error(`Error while creating service`, err.message);
        next(err);
    }
});

module.exports = router;