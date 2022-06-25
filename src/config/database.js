const mongoose = require('mongoose');

// const { MONGO_URI } = process.env;

const connectToDatabase = () => {
    mongoose
        .connect('mongodb://localhost:27017/')
        .then(() => {
            console.log('Successfully connected to database');
        })
        .catch((error) => {
            console.log('database connection failed. exiting now...');
            console.error(error);
            process.exit(1);
        });
};

module.exports = connectToDatabase;
