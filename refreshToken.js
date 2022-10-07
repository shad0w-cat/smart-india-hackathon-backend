const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const userServices = require('./services/userServices')

router.get('/', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        // query to find user with given token
        const user = await userServices.fetchUser(refreshToken);
        console.log(user)
        if (!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const mNumber = user[0].mobileNumber;
            const name = user[0].firstName;
            const email = user[0].emailAddress;
            const usertype = user[0].usertype;
            const accessToken = jwt.sign({ mNumber, name, email, usertype }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;