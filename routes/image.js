const express = require('express');
const router = express.Router();

router.get('/api/image', (req, res) => {
    UserModel.find()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json(err)
        })
})