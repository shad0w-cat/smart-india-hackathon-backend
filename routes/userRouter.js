const express = require('express');
const router = express.Router();
const userServices = require('../services/userServices');

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
        const match = await bcrypt.compare(req.body.password, userDetails.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = req.body.number;
        const name = userDetails.name;
        const email = userDetails.email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.JWT_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        await userServices.update({ refreshToken, userId });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Email not found" });
    }
});
module.exports = router;