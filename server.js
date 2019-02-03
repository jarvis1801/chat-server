console.log('May Node be with you');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// conect to mongo
mongoose.connect('mongodb://test:test123@ds161804.mlab.com:61804/jarvis-chat', { useNewUrlParser: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use(require('./routes/user'));
app.use(require('./routes/message'));
app.use(require('./routes/group'));
app.use(express.static('public'));

app.listen(80, () => {
    console.log("listen on 80");
});