const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check');
const User = require('../../model/User');

//@route api/auth
//@desc  get authenticate user

router.get('/', auth, async(req, res) => {
    try{
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
    }
    catch(err){
console.log(err.message);
res.status(500).send('Server Error');

    }
})


//@route POST api/auth
//@desc  Login User

router.post('/', [
    check('email', "Please enter an valid email").isEmail(),
    check("password", "Password is required").exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {

            //if user doesn't exist
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
            }

          const isMatch = await bcrypt.compare(password,user.password);
          if(!isMatch){
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
          }
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