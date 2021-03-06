
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getMaxListeners, findOne } = require('../models/userModel');
const { hidden } = require('colors');


//@desc login
//@route POST /api/login
//@access Private
const login = asyncHandler(async (req, res) => {



    const { email, password } = req.body

    //validate user input
    if (!(email && password)) {
        res.status(400)
        throw new Error('email or password are  required')
    }

    const user = await User.findOne({ email }).select('+password').select('+role')

    if (user) {
        if ((await bcrypt.compare(password, user.password))) {
           
            //save token in uuser
            const oldUser = await User.findOne({ email }).select('+role')
            console.log(`old user is :${oldUser}`)
            const token = jwt.sign(
                { user_id: user._id, email ,role:oldUser.role},
                process.env.TOKEN_KEY, {
                expiresIn: "20s"
            })
            //if want to deselect _id await User.findOne({ email }, '-_id')
            oldUser.token = token
            res.status(200).json(oldUser)
        }

    }
    else {
        res.status(400)
        throw new Error('wrong userName')

    }
    res.status(400)
    throw new Error('wrong password')


})








module.exports = {
    login
}