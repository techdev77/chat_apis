/* Routes */
const authRouter = require('../routes/auth.routes');


class RoutesLoader {
    static initRoutes (app, version) {
        app.use(`/api/${version}`, authRouter);
    
    }
}

module.exports = {RoutesLoader};