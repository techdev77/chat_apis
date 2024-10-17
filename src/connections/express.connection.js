const express = require("express");
const bodyParser = require('body-parser');
// require('../s')
// const cors = require("cors");
const fs = require('fs').promises;
const path = require('path');
class ExpressLoader {
    static init () {
        const app = express();
        // app.use(express.static(__dirname + "src"));
        // Middleware that transforms the raw string of req.body into json
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.json());
        app.use('/storage', express.static(path.join(__dirname, '../storage')));
        // parses incoming requests with JSON payloads
        // app.use(cors());
        // app.options("*", cors());

        return app;
    }
}

module.exports = { ExpressLoader };