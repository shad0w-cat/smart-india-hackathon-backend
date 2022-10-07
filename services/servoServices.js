const db = require('./db');
const helper = require('../helpers/helper');
const config = require('../config');
const { format } = require("date-fns")


async function fetchServoStats(servoInfo) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const result = await db.query(
        `SELECT unlockStatus FROM services WHERE droneId = '${servoInfo}' AND completed = 0;`
    );
    const data = helper.emptyOrRows(result.pop());

    return data;
}

async function getServices(number) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const result = await db.query(
        `SELECT * FROM services WHERE mobilenumber = '${number}';`
    );
    console.log(result)
    const data = helper.emptyOrRows(result);
    console.log(data)

    return data
}

async function setServoStats(serviceId) {
    let message = 'Error in unlocking/locking';
    let success = 'error';
    try {
        const result = await db.query(
            `UPDATE services SET unlockStatus = NOT (unlockStatus) WHERE serviceId = ${serviceId};`
        );
        if (result.affectedRows) {
            message = 'New User Created Successfully';
            success = 'ok';
        }
    }
    catch (error) {
        console.log(error)
    }
    return { success, message };

}

async function createService(data) {
    let message = 'Error in creating service';
    let success = 'error';
    try {
        const result2 = await db.query(
            `UPDATE services SET completed = 1, unlockStatus=0, completionTime = '${format(new Date(), 'yyyy-MM-dd kk:mm:ss')}' WHERE completed=0;`
        );
        const result = await db.query(
            `INSERT INTO services (mobileNumber, droneId, requestTime, unlockStatus, completed) VALUES (?, 1, '${format(new Date(), 'yyyy-MM-dd kk:mm:ss')}', 0, 0);`, [data.number]
        );
        if (result.affectedRows) {
            message = 'New Service Created Successfully';
            success = 'ok';
        }
    }
    catch (error) {
        console.log(error)
    }
    return { success, message };
}

module.exports = {
    fetchServoStats,
    getServices,
    setServoStats,
    createService,
}