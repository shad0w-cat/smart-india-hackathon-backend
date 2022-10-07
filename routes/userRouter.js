const express = require('express');
const router = express.Router();
const userServices = require('../services/userServices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
router.get('/', async function (req, res, next) {
    try {
        res.send({ 'Message': "OK" });
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});

router.post('/signup', async function (req, res, next) {
    const { fName, lName, number, aadhaar, email, password, cpassword } = req.body;
    if (password !== cpassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        res.send(await userServices.signUpUser({ fName, lName, number, aadhaar, email, hashPassword }));
    } catch (err) {
        console.error(`Error while loading data`, err.message);
        next(err);
    }
});
router.post('/login', async function (req, res, next) {
    try {
        const userDetails = await userServices.loginUser(req.body.number);
        console.log(userDetails, req.body.password, userDetails.password)
        const match = await bcrypt.compare(req.body.password, userDetails.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const mNumber = req.body.number;
        const name = userDetails.name;
        const email = userDetails.email;
        const usertype = userDetails.usertype;
        const accessToken = jwt.sign({ mNumber, name, email, usertype }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ mNumber, name, email, usertype }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        await userServices.update({ refreshToken, mNumber });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken: accessToken, type: userDetails.usertype });
    } catch (error) {
        console.log(error)
        res.status(404).json({ msg: "User with given mobile number not found" });
    }
});

router.get('/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    //Query to find user with given refresh token
    const user = await userServices.fetchUser(refreshToken);
    if (!user[0]) return res.sendStatus(204);
    const mNumber = user[0].mobileNumber;
    // query to set user to null where id / mno match
    await userServices.logout(mNumber);
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
});

module.exports = router;