console.log('May Node be with you');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const getIP = require('ipware')().get_ip;
const moment = require("moment-timezone");
const IpRecordModel = require("./models/ipRecord.js");

// conect to mongo
// mongoose.connect('mongodb://test:test123@ds161804.mlab.com:61804/jarvis-chat', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true })

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    const ipInfo = getIP(req);
    const obj = {
        ip: ipInfo.clientIp,
        datetime: moment().utcOffset(480).format()
    }
    const ipRecord = new IpRecordModel(obj)
    ipRecord.save()
        .then(doc => {
            if (!doc || doc.length === 0) {
                console.log("Error")
            }
            console.log(doc)
        })
        .catch(err => {
            console.log(err);
        })
    next();
});

// routes
app.use(require('./routes/user'));
app.use(require('./routes/message'));
app.use(require('./routes/group'));
app.use(require('./routes/media'));
app.use(express.static('public'));

app.listen(80, () => {
    console.log("listen on 80");
});