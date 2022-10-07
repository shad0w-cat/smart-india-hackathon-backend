const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get('/', (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.mobileNumber = decoded.mobileNumber;
            res.sendStatus(200);
        })
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

module.exports = router;