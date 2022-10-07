const express = require("express")
const cors = require("cors");
const bodyParser = require('body-parser');
var cookies = require("cookie-parser");
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

const userRouter = require('./routes/userRouter');
const servoRouter = require('./routes/servoRouter.js');
const sensorsRouter = require('./routes/sensorsRouters.js');
// const tokenRouter = require('./verifyToken.js');
const refreshRouter = require('./refreshToken.js');

const app = express();
const port = 9000;

app.get('/', (req, res) => {
    res.status(200).send({ message: 'ok' })
})

app.use(cors({ credentials: true, origin: 'https://dwings.tech' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookies());
app.use(bodyParser.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/user", userRouter);
app.use("/sensors", sensorsRouter);
app.use("/servo", servoRouter);
app.use("/token", refreshRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
