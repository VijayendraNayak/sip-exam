const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userrouter = require('./routers/userrouter.js');
const cookieParser = require('cookie-parser');

dotenv.config()
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connected to mongo successfully"))
    .catch((err) => console.error("Failed to connect mangodb"))
const app = express();
app.use(express.json())
app.use(cookieParser());

app.use('/api/user', userrouter); // Mount the user routes

app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.PORT}!`);
});

