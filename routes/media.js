// denpend
// const UserModel = require('../models/user');
const MediaModel = require('../models/media');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const _ = require('lodash');
const constants = require("../constants.js")

const storage = multer.diskStorage({
    destination: './public/media',
    filename: (req, file, cb) => {
        cb(null, `${req.body.username}-${Date.now()}${path.extname(file.originalname)}`)
    }
})
const host = constants.host;

const upload = multer({
    storage: storage
}).single('media');

// create
router.post('/api/media', upload, (req, res) => {
    const bodyObj = _.clone(req.body);

    if (!bodyObj) {
        return res.status(400).send('Request body is missing');
    }

    if (req.file) {
        _.set(req.file, 'filename', req.file.filename);
        _.set(bodyObj, 'url', `${host}media/${req.file.filename}`);
    }

    const media = new MediaModel(bodyObj)
    media.save()
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

// reset db
router.delete('/api/media/all', (req, res) => {
    MediaModel.remove({}, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.end('success');
        }
    });

})
  
module.exports = router