const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.parseTime = (time) => {
    let times = time.split(":");
    let hours = times[0];
    if (hours.length === 1) hours = `0${hours}`; // pad leading 0
    return `${hours}:${times[1]}:${times[2]}`;
};


exports.structureResponse = (body, success, message) => {
    return {
         success, message,
        data: body
    };
};


exports.hashPassword = async (password) => {
    if (password) {
        return password = await bcrypt.hash(password, 8);
    }
};
exports.comparePassword = async (userPass,dbPass) => {
    if (password) {
        return isMatch = await bcrypt.compare(userPass,dbPass);
    }
};

 exports.generateAccessToken = (userId,email,created_at) => {
    return  jwt.sign({ user_id: userId,created_at:created_at,email:email},"jwtAuthToken", { expiresIn: '2d' }); 
};

exports.generateRefreshToken = (userId,email,created_at) => {
    return  jwt.sign({ user_id: userId,created_at:created_at,email:email}, "jwtRefreshToken", { expiresIn: '30d' }); 
};

exports.yearRegex = new RegExp(/^(19[5-9]\d|20[0-4]\d|2050)$/);

exports.OTPRegex = new RegExp(/^[0-9]{4}$/);

exports.seatRegex = new RegExp(/^[A-Z]{1,2}-[0-9]{1,}$/);

exports.timeRegex = new RegExp(/^([01][0-9]|2[0-3]):[0-5][0-9]$/);

exports.datetimeRegex = new RegExp(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/);