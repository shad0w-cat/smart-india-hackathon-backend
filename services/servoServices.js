const db = require('./db');
const helper = require('../helpers/helper');
const config = require('../config');

async function fetchServoStats(servoInfo) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const result = await db.query(
        `SELECT unlockStatus FROM services WHERE droneId = '${servoInfo}' AND completed = 0;`
    );
    const data = helper.emptyOrRows(result.pop());

    return data;
}

async function setServoStats(loginDetails) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const result = await db.query(
        `SELECT count(*) as "totalUsers", usertype FROM users WHERE mobilenumber = '${loginDetails.number}' AND password = '${loginDetails.password}' `
    );
    const data = helper.emptyOrRows(result.pop());

    return { data }
}

module.exports = {
    fetchServoStats,
    setServoStats
}