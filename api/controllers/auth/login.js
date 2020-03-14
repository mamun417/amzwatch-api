module.exports = async function (req, res) {

    //check already logged in

    let errors = {};

    let email = req.param('email');
    let password = req.param('password');

    if (!email) {
        errors.email = 'email field is required';
    }
    if (!password) {
        errors.password = 'password field is required';
    }

    if (Object.keys(errors).length) {
        return res.json({errors: errors}).status(422);
    }

    let userRecord = await User.withMeta({
        email: email.toLowerCase()
    });

    if (!userRecord) {
        return res.json({message: 'email or password does not match'}).status(404);
    }

    try {
        await sails.helpers.passwords.checkPassword(req.param('password'), userRecord.password);
    } catch (e) {
        return res.json({message: 'email or password does not match'}).status(404);
    }

    delete userRecord.password;

    let appSecret = sails.config.custom.appSecret;
    let jwtTime = sails.config.custom.jwtTime;
    let userWithoutMeta = _.cloneDeep(userRecord); // get userWithUserMeta data copy

    delete userWithoutMeta.meta; //remove meta from userWithUserMeta

    let bearerToken = await sails.JWT.sign({
        data: userWithoutMeta // assign only user data
    }, appSecret, {expiresIn: jwtTime});

    let refreshToken = await sails.JWT.sign({
        data: bearerToken
    }, appSecret, {expiresIn: jwtTime});

    return res.json({
        user: userRecord, // send userWithUserMeta
        bearerToken: bearerToken,
        refreshToken: refreshToken
    }).status(200);
};
