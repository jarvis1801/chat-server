// denpend
const MessageModel = require('../models/message');
const express = require('express');
const router = express.Router();

// create
router.post('/api/message', (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }

    const message = new MessageModel(req.body)
    message.save()
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


// get user list
// router.get('/api/message', (req, res) => {
//     UserModel.find()
//         .then(doc => {
//             res.json(doc);
//         })
//         .catch(err => {
//             res.status(500).json(err)
//         })
// })

// get user by username
router.get('/api/message/:username', (req, res) => {
    MessageModel.find({
        $or: [
            {
                sender: req.params.username
            },
            {
                reciever: req.params.username
            }
        ]
    })
    .then(doc => {
        if (doc) {
            return res.status(201).json(doc);
        }
        res.status(500).json({
            error: "cannot get message",
            statusCode: "500"
        });
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

module.exports = router