const mongoose = require('mongoose');
const config = require('../src/Configs/claves');

const URI = 'mongodb://localhost:27017/supermercado';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB is connected');
})