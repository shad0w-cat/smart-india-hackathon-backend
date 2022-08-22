const express = require("express")
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const userRouter = require('./routes/userRouter');
const servoRouter = require('./routes/servoRouter.js');


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);



app.use("/user", userRouter);
app.use("/servo", servoRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`, dotenv.parsed.JWT_SECRET)
})
