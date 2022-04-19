const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDb = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log("mongoDb connected..");
    }
    catch (err) {
        console.error(err.message);
        // exit the process failure
        process.exit(1);
    }
}

module.exports = connectDb;