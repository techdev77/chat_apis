require('dotenv').config();

//    NOT USING  .env /////////
module.exports.Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3331,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '',
    DB_DATABASE: process.env.DB_DATABASE || 'chat_app_db',
    AUTH_SECRET_JWT: process.env.AUTH_SECRET_JWT || "",
    SEND_EMAIL_PASSWORD:process.env.SEND_EMAIL_PASSWORD || "",
};