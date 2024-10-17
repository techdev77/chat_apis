const express = require('express');
var multer = require('multer');
var upload = multer();
const router = express.Router();
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const authController = require('../controllers/auth.controller');
const { createUserSchema, passwordUserSchema,emailUserSchema} = require('../middleware/validators/userValidator.middleware');
router.post('/register',upload.fields([]),createUserSchema,awaitHandlerFactory(authController.registerUser)); 
router.post('/login',upload.fields([]), passwordUserSchema,awaitHandlerFactory(authController.userLogin)); 
router.post('/sendMessage',upload.fields([]),awaitHandlerFactory(authController.sendMessage)); 
router.post('/getUsersWithLastChat',upload.fields([]),awaitHandlerFactory(authController.getUsersWithLastChat)); 
router.post('/getChat',upload.fields([]),awaitHandlerFactory(authController.getChat)); 
router.get('/test',(req,res)=>{ 
    console.log(req.query);     //  This route is just for testing 
    res.send("ok");               
}); 

module.exports = router;