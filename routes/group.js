const GroupModel = require('../models/group');
const MessageModel = require('../models/message');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/api/group/:username', (req, res) => {
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
            const idList = _.reduce(doc, (result, val) => {
                const groupId = _.get(val, "_id", null);
                if (_.size(groupId) > 0) {
                    result.push(groupId)
                }
                return result;
            }, []);
            console.log(idList)
            MessageModel.find({
                group_id: { $in: idList }
            }, null, { sort: { posted_at: "-1" } })
                .then(doc => {
                    const uniqArray = _.uniqBy(doc, "group_id");
                    res.status(200).json(uniqArray)
                })
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/api/group', (req, res) => {
    console.log(req.body)
    const group = new GroupModel(req.body)
    group.save()
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

router.get('/api/group/id/:groupid', (req, res) => {
    GroupModel.findOne({ _id: req.params.groupid })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router