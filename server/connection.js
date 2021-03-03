require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch( e=> {
    console.log(e)
})

module.exports.db = mongoose.connection;

