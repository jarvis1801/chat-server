// denpend
const UserModel = require('../models/user');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const _ = require('lodash');

const storage = multer.diskStorage({
    destination: './public/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const host = "http://jarvisdomain.ddns.net";

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
        _.set(bodyObj, 'avatar', `${host}/${req.file.filename}`);
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

module.exports = router