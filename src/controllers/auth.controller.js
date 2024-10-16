const { checkValidation } = require('../middleware/validation.middleware');

const AuthRepository = require('../repositories/auth.repository');

class AuthController {

    registerUser = async (req, res, next) => {
        console.log(req.email);
        checkValidation(req);
        const response = await AuthRepository.registerUser(req.body);
        res.json(response);
    };

    getAll = async (req, res, next) => {
        const response = await AuthRepository.getAll();
        res.json(response);
    };

    userLogin = async (req, res, next) => {
        checkValidation(req);
        const response = await AuthRepository.userLogin(req.body.email, req.body.password);
        res.send(response);
    };

    sendMessage = async (req, res, next) => {
        checkValidation(req);
        const response = await AuthRepository.sendMessage(req.body);
        res.send(response);
    };


    getUsersWithLastChat = async (req, res, next) => {
    
        checkValidation(req);
        const response = await AuthRepository.getUsersWithLastChat(req.body);
        res.send(response);
    };


getChat = async (req, res, next) => {

        checkValidation(req);
        const response = await AuthRepository.getChat(req.body);
        res.send(response);
    };
}

module.exports = new AuthController;