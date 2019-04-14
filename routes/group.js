const GroupModel = require('../models/group');
const MessageModel = require('../models/message');
const UserModel = require('../models/user');
const _ = require('lodash');
const async = require("async");
const express = require('express');
const router = express.Router();
const moment = require('moment');
const constants = require("../constants.js")

const host = constants.host;

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

            MessageModel.find({
                group_id: { $in: idList }
            }, null, { sort: { posted_at: "-1" } })
                .populate('group')
                .then(doc => {
                    const uniqArray = _.uniqBy(doc, "group_id");

                    results = [];
                    async.each(uniqArray, (message, callback) => { 
                        const user1 = message['group']['user1'];
                        const user2 = message['group']['user2'];

                        let other_user;
                        if (user1 != req.params.username) {
                            other_user = user1;
                        } else {
                            other_user = user2;
                        }

                        UserModel.findOne({ username: other_user }, (err, user) => {
                            const obj = message.toObject();
                            obj['other_user'] = user;
                            _.set(obj.other_user, 'avatar', host + obj.other_user.avatar);
                            results.push(obj);
                            callback(err);
                        });            
                    },
                    (err) => {
                        if (err) res.status(500).json(err);
                        results = _.reverse(_.sortBy(results, [(msg) => { return moment(msg.posted_at).valueOf(); }]));
                        res.status(200).json(results)
                    });
                })
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/api/group', (req, res) => {

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