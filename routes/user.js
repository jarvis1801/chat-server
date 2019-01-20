// denpend
const UserModel = require('../models/user');
const express = require('express');
const router = express.Router();

// create
router.post('/api/user', (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }

    const user = new UserModel(req.body)
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