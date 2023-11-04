const express = require('express');
const { signup, signin, signout } = require('../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const User = require('../models/user');
const { requireSignin, requireSigninVendor } = require('../common-middleware');

const router = express.Router();


router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/signout', signout)

router.get("/user-auth", requireSignin, (req, res) => {
    if (req.user.role === "vendor") res.status(200).send({ ok: true })
    else res.status(400).send({ ok: false })
})


router.put("/", requireSigninVendor, (req, res) => {
    User.findOne({ _id: req.user._id })
        .then((vendor) => {
            var vendorToken = vendor.token
            vendorToken++
            User.findByIdAndUpdate(req.user._id, {
                $set: { token: vendorToken }
            }, {
                new: true
            }).then((Result) => {
                User.findOne({ roll: req.body.roll })
                    .then((user) => {
                        var currentToken = user.token
                        currentToken--
                        User.findByIdAndUpdate(user._id, {
                            $set: { token: currentToken }
                        }, {
                            new: true
                        }).then((finalResult) => {
                            res.json({ success: true })
                        }).catch(error => { return res.status(422).json({ error: error }) });
                    })
                    .catch(err => { console.log(err) });
            }).catch(error => { return res.status(422).json({ error: error }) });
        })
    })

    module.exports = router;