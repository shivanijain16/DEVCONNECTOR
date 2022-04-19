const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const Profile = require('../../model/Profile');
const Post = require('../../model/Post');
const { check, validationResult } = require('express-validator');

//@route api/profile/me
//@desc : get all user profiles

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    console.log('prfoile', profile);

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route api/profile
//@desc : create / update user profiles

router.post(
  '/',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      // company,
      website,
      // location,
      // bio,
      // status,
      // githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
      ...rest
    } = req.body;

    // const profileFields = {};

    // if (company) profileFields.company = company;
    // if (website) profileFields.website = website;
    // if (location) profileFields.location = location;
    // if (bio) profileFields.bio = bio;
    // if (status) profileFields.status = status;
    // if (githubusername) profileFields.githubusername = githubusername;
    // //trim is used to remove spaces
    // if (skills) {
    //   // profileFields.skills = skills.split(",").map(skill=>skill.trim());
    //   skills.split(',').map((skill) => skill.trim());
    // }
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      ...rest,
    };
    console.log('skills', skills);

    //  build profile social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let update = {
        $set: profileFields,
      };
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        update,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

//@route api/profile
//@desc : get all user profiles

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    console.log('prof', profiles);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

//@route api/profile/userId/:userId
//@desc : get userById

router.get('/userId/:userId', async (req, res) => {
  try {
    console.log('parameter of url', req.params.userId);
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      'user',
      ['name', 'avatar']
    );
    console.log(profile);
    if (!profile) res.status(404).json({ msg: 'User Id not found!' });
    else res.json(profile);
  } catch (error) {
    console.log(error.message);
    console.log(error.kind);
    if (error.kind == 'ObjectId') {
      res.status(404).json({ msg: "User Id doesn't exist" });
    } else res.status(500).json({ msg: 'Server error' });
  }
});

//@route api/profile
//@desc : delete user

router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

//@route api/profile/experience
//@desc : add an experience

router.put(
  '/experience',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .not()
    .isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);
      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route api/profile/experience/:exp_id
//@desc : delete an experience

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    let previousLength = foundProfile.experience.length;
    console.log(previousLength);
    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    let newLength = foundProfile.experience.length;
    console.log(newLength);
    if (newLength == previousLength)
      res.status(404).json({ msg: 'Experience id not found' });
    else res.status(200).json(foundProfile);
    //  else
    //  res.status(404).json({msg:"Experience Id not found"})
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route api/profile/education
//@desc : add an education

router.put(
  '/education',
  auth,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of Study is required').notEmpty(),
  check(
    'from',
    'From date is required and needs to be from the past'
  ).notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);
      profile.education.unshift(req.body);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route api/profile/education/:del_id
//@desc : delete an education

router.delete('/education/:del_id', auth, async (req, res) => {
  console.log('printing id', req.params.del_id);

  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    let previousLength = foundProfile.education.length;
    console.log(previousLength);
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.del_id
    );

    await foundProfile.save();
    let newLength = foundProfile.education.length;
    console.log(newLength);
    if (newLength == previousLength)
      res.status(404).json({ msg: 'Education id not found' });
    else res.status(200).json(foundProfile);
    //  else
    //  res.status(404).json({msg:"Experience Id not found"})
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route api/profile/github/:username
//@desc : get user repos from github

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&
      sort=created:asc&client_id=${config.get('githubClientId')}
      &client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode != 200)
        return res.status(404).json({ msg: 'No Github Profile Found' });

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
