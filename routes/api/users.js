const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check');

const User = require('../../model/User');
const config = require('config');

//@route POST api/users
//@desc  Register User

router.post('/', [
    check('name', "Name is required").not().isEmpty(),
    check('email', "Please enter an valid email").isEmail(),
    check("password", "Please enter password having minimum 6 characters").isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        try {

            //if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: "User Already Exist" }] })
            }

            //get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                password,
                avatar
            })


            //encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            //return JWT token
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({token:token});
                })


        }
        catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }



    })

module.exports = router;