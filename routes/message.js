// denpend
const MessageModel = require('../models/message');
const express = require('express');
const router = express.Router();
const moment = require('moment');

// create
router.post('/api/message', (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }

    req.body['posted_at'] = moment().format();

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
router.get('/api/message', (req, res) => {
    const pageNo = parseInt(req.query.pageNo)
    const size = parseInt(req.query.size)
    const query = {}
    if (pageNo < 0 || pageNo === 0 || pageNo === null || pageNo === 'all') {
        return MessageModel.find().sort({posted_at: 'desc'})
            .then(doc => {
                res.json(doc);
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    query.skip = size * (pageNo - 1)
    query.limit = size
    // Find some documents
    MessageModel.find({}, {}, query, (err, data) => {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                response = data;
            }
            res.json(response);
        });
})

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