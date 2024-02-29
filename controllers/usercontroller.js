const User = require('../models/usermodels')
const { errorHandler } = require('../Utils/errorHandler')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const expiresInDays = 5;
const cookieMaxAge = 24 * 60 * 60 * 1000;

exports.register = async (req, res, next) => {
    const { name, email, password, confirmpassword, phonenumber } = req.body
    if (password !== confirmpassword) { return next(errorHandler(400, "The password and confirmpassword should be same")) }
    const afterAtSymbol = email.split('@')[1];
    if (afterAtSymbol === "kulkundabasaweshwara.com") { role = "admin" }
    else { role = "user" }
    const newpassword = bcrypt.hashSync(password, 10)
    const user = await User.create({ name, email, password: newpassword, role, phonenumber })
    if (!user) { return next(errorHandler(400, "User isn't created")) }
    res.status(200).json({ success: true, user })
}


exports.login = async (req, res, next) => {
    const { phonenumber, password } = req.body;
    const user = await User.findOne({ phonenumber }).select('+password');
    if (!user) {
        return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return next(errorHandler(400, 'Wrong password, try again'));
    }
    // Create a JWT for the user with a 5-day expiration
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * expiresInDays });
    // Exclude sensitive information from the response
    const { password: pass, ...rest } = user._doc;
    // Set a cookie with the access token
    res.cookie('access_token', token, { httpOnly: true,maxAge: cookieMaxAge });
    // Send the response with user details (excluding sensitive information)
    res.status(200).json(rest);
};

exports.google = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * expiresInDays })
        const { password: pass, ...rest } = user._doc
        return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
    }
    else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new User({ name: req.body.name, email: req.body.email, password: hashedPassword, avatar: req.body.avatar });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res.cookie('access_token', token, { httpOnly: true,maxAge: cookieMaxAge }).status(200).json(rest);
    }
}
exports.logout =async (req, res, next) => {
    res.clearCookie('access_token')
    res.status(200).json({ success: true, message: "User logged out successfully" })
}