const express = require('express');
const { signup, signin, signout } = require('../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const User = require('../models/user');
const { requireSignin } = require('../common-middleware');

const router = express.Router();


router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/signout', signout)

router.get("/user-auth", requireSignin, (req, res) => {
    if(req.user.role === "student") res.status(200).send({ ok: true })
    else  res.status(400).send({ ok: false })
})

router.get('/getBalance', requireSignin, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        console.log(user.token);
        return res.json(JSON.parse(user.token))
    } catch (error) {
        console.log(error)
    }
});

/* router.put("/edit", requireSignin, async (req, res) => {
    const { firstName, lastName, email, contactNumber, linkedinLink, githubLink } = req.body;
    const newMember = {}
    if (firstName) { newMember.firstName = firstName }
    if (lastName) { newMember.lastName = lastName }
    if (email) { newMember.email = email }
    if (contactNumber) { newMember.contactNumber = contactNumber }
    if (githubLink) { newMember.githubLink = githubLink }
    if (linkedinLink) { newMember.linkedinLink = linkedinLink } 


    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: newMember }, { new: true })
        res.json(updatedUser)
    } catch (error) {
        console.log(error.message)
        res.status(500).json("Internal server Error")
    }
});*/


module.exports = router;