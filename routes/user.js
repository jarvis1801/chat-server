// denpend
const UserModel = require('../models/user');
const GroupModel = require('../models/group');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const _ = require('lodash');
const constants = require("../constants.js")

const storage = multer.diskStorage({
    destination: './public/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const host = constants.host;

const upload = multer({
    storage: storage
}).single('avatar');

// create
router.post('/api/user', upload, (req, res) => {
    const bodyObj = _.clone(req.body);
    if (!bodyObj) {
        return res.status(400).send('Request body is missing');
    }

    if (req.file) {
        _.set(bodyObj, 'avatar', `${req.file.filename}`);
    }

    const user = new UserModel(bodyObj)
    user.save()
        .then(doc => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc)
            }

            res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        })

})

// update
router.put('/api/user/:username', (req, res) => {

    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }

    UserModel.findOneAndUpdate({ username: req.params.username },
        { $set: req.body }, { returnOriginal: false })
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send("doc")
            }
            UserModel.findOne({ username: req.params.username })
                .then((doc) => {
                    res.status(201).send(doc);
                })
                .catch((err) => {
                    res.status(500).send(err);
                })
        })
        .catch((err) => {
            return res.status(500).send(err)
        });
})

// get user list
router.get('/api/user', (req, res) => {
    UserModel.find()
        .then(doc => {
            doc = _.map(doc, (val, key) => {
                _.set(val, 'avatar', host + val.avatar);
                return val;
            });
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

// get user by username
router.get('/api/user/:username', (req, res) => {
    UserModel.findOne({
        username: req.params.username
    })
        .then(doc => {
            if (doc) {
                _.set(doc, 'avatar', host + doc.avatar);
                return res.status(200).json(doc);
            }
            res.status(500).json({
                error: "cannot get user",
                statusCode: "500"
            });
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.get('/api/user/getRandom/:username', (req, res) => {
    GroupModel.find({
        $or: [
            {
                user1: req.params.username
            },
            {
                user2: req.params.username
            }
        ]
    })
        .then(doc => {
            const userList = _.reduce(doc, (result, val) => {
                const userId = _.get(val, "user1", null) != req.params.username ? 
                    _.get(val, "user1", null) : _.get(val, "user2", null);
                if (_.size(userId) > 0) {
                    result.push(userId)
                }
                return result;
            }, []);
            userList.push(req.params.username)
            UserModel.find({
                username: { $nin: userList }
            })
                .then(doc => {
                    let randomList = _.sampleSize(doc, 5)
                    randomList = _.map(randomList, (val, key) => {
                        _.set(val, 'avatar', host + val.avatar);
                        return val;
                    });
                    res.status(200).json(randomList)
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router