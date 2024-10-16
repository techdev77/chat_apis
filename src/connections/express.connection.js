const express = require("express");
const bodyParser = require('body-parser');
// const cors = require("cors");

class ExpressLoader {
    static init () {
        const app = express();

        // Middleware that transforms the raw string of req.body into json
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.json());
        
        // parses incoming requests with JSON payloads
        // app.use(cors());
        // app.options("*", cors());

        return app;
    }
}

module.exports = { ExpressLoader };