const db = require('./db');
const helper = require('../helpers/helper');
const config = require('../config');

async function loginUser(mobileNumber) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const result = await db.query(
        `SELECT count(*) as "totalUsers", usertype, password, CONCAT_WS(' ',firstName, lastName) AS "Name", emailAddress FROM users WHERE mobileNumber = '${mobileNumber}'; `
    );
    const data = helper.emptyOrRows(result.pop());

    return data
}

async function signUpUser(userDetails) {
    let message = 'Error in creating new user';
    let success = 'error';
    try {
        const result = await db.query(
            `INSERT INTO users
        (firstName, lastName, mobileNumber, aadhaarNumber, emailAddress, password, usertype)
        VALUES
        (?, ?, ?, ?, ?, ?, 'user')`,
            [userDetails.fName, userDetails.lName, userDetails.number, userDetails.aadhaar, userDetails.email, userDetails.hashPassword]
        );

        if (result.affectedRows) {
            message = 'New User Created Successfully';
            success = 'ok';
        }
    }
    catch (error) {
        if (error.errno === 1062)
            message = "User already exist!"
    }
    return { success, message };
}

async function update(tokenData) {
    try {
        await db.query('UPDATE users SET refreshToken = ? WHERE mobilenumber = ?', [tokenData.refreshToken, tokenData.mNumber]);
    }
    catch (error) {
        console.log(error)
    }
}

async function fetchUser(refreshToken) {
    try {
        const result = await db.query('SELECT * from users WHERE refreshToken = ?', [refreshToken]);
        const data = helper.emptyOrRows(result);

        return data
    }
    catch (error) {
        console.log(error)
    }
}

async function logout(mNumber) {
    try {
        await db.query('UPDATE users SET refreshToken = null WHERE mobilenumber = ?', [mNumber]);
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    loginUser,
    signUpUser,
    update,
    fetchUser,
    logout
}