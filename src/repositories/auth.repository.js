const { structureResponse, hashPassword,comparePassword,generateAccessToken,generateRefreshToken } = require('../utils/common.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/sendEmail.utils');
const otpGenerator = require('otp-generator');
const { Config } = require('../configs/config');
const UserModel = require('../models/user.model');
const ChatModel = require('../models/chat.model');
const { Op, where } = require('sequelize');

const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../connections/database.connection');

const sequelizeInstance = connectDB.getSequelize();


// Define associations
UserModel.hasMany(ChatModel, {
    foreignKey: 'sender_id', // The foreign key in Chat
    sourceKey: 'id'          // The primary key in User
});

UserModel.hasMany(ChatModel, {
    foreignKey: 'receiver_id', // The foreign key in Chat
    sourceKey: 'id'            // The primary key in User
});

ChatModel.belongsTo(UserModel, {
    foreignKey: 'sender_id',   // This references the sender_id in the Chat model
    targetKey: 'id'
});

ChatModel.belongsTo(UserModel, {
    foreignKey: 'receiver_id',  // This references the receiver_id in the Chat model
    targetKey: 'id'
});

const {
    RegistrationFailedException,
    InvalidCredentialsException,
    TokenVerificationException,
    OTPExpiredException,
    OTPGenerationException,
    OTPVerificationException
} = require('../utils/exceptions/auth.exception');

const {
    NotFoundException,
    UpdateFailedException,
    UnexpectedException
} = require('../utils/exceptions/database.exception');


class AuthRepository {


    getAll=async()=>{
        const users=await UserModel.findAll();
        return {
            success: true,
            message: '',
            data: users
        };
    }



    registerUser = async (body) => { 
    
        try{
         body.password=await hashPassword(body.password);
         const dublicateEmail = await UserModel.findOne({ where: { email: body.email } });
           if(dublicateEmail){
            return {"success":false,"message":"Email already exists!"};
           }
           
           body.auth_type = "NORMAL";
            const newUser = await UserModel.create(body);

        if (!newUser) {
            throw new RegistrationFailedException();
        }
        return structureResponse("", true, "You are Registered Successfully.");
    }
    catch(error){
        console.error("Error creating user:", error);
        throw error; 
    }
        // return this.userLogin(body.email, pass, true);
    };

    


    userLogin = async (email, pass, is_register = false) => {
        const user = await UserModel.findOne({ where: { email: email } });
        if (!user) {
            throw new InvalidCredentialsException('Email not registered');
        }

           const isMatch = await bcrypt.compare(pass, user.password);

           if (!isMatch) {
            throw new InvalidCredentialsException('Incorrect password');
           }

        const auth_token=generateAccessToken(user.id,user.created_at,user.email);
        const refreshToken=generateRefreshToken(user.id,user.created_at,user.email);

        const updates={auth_token:auth_token,refresh_token:refreshToken}

        const [numAffectedRows, affectedRows] = await UserModel.update(updates, {
            where: { email: email }
        });

      if(affectedRows<=0){
        throw new UpdateFailedException("AuthToken Updation Failed.");
      }
        let message = "";
        let responseBody = "";
        if (is_register){ 
            message = "Registered"; 
            user.auth_token=auth_token;
            responseBody =  user;
        } else {
            message = "Authenticated";
            user.auth_token=auth_token;
            responseBody = user;
        }
        return structureResponse(responseBody, true, message);
    };



    sendMessage = async (body) => {
        try{
            const newChat = await ChatModel.create(body);

            // Check if newChat was created successfully
            if (!newChat) {
                throw new Error("Chat creation failed");
            }

           return structureResponse("", true, "Message Sent");
       }
       catch(error){
           console.error("Error creating user:", error);
           throw error; 
       }
    }




    getAllUsers = async (body) => {
        try{
            const newChat = await ChatModel.create(body);

            // Check if newChat was created successfully
            if (!newChat) {
                throw new Error("Chat creation failed");
            }

           return structureResponse("", true, "Message Sent");
       }
       catch(error){
           console.error("Error creating user:", error);
           throw error; 
       }
    }



     getUsersWithLastChat = async (body) => {
        try {
            // Get all users with their last chat details
            const users = await UserModel.findAll({
                attributes: {
                    include: [
                        // Adding last chat time only if there was an interaction
                        [sequelizeInstance.fn('MAX', sequelizeInstance.literal(`
                            CASE 
                                WHEN Chats.sender_id = ${body.user_id} OR Chats.receiver_id = ${body.user_id} 
                                THEN Chats.created_at 
                                ELSE NULL 
                            END
                        `)), 'lastChatTime'],
                        
                        // Last chat message only if there was an interaction
                        [sequelizeInstance.fn('MAX', sequelizeInstance.literal(`
                            CASE 
                                WHEN Chats.created_at = (
                                    SELECT MAX(created_at) FROM Chats 
                                    WHERE (Chats.sender_id = ${body.user_id} OR Chats.receiver_id = ${body.user_id}) 
                                    AND (Chats.sender_id = User.id OR Chats.receiver_id = User.id)
                                ) 
                                THEN Chats.message 
                                ELSE NULL 
                            END
                        `)), 'lastChatMessage']
                    
                    ]
                },
                include: [{
                    model: ChatModel,
                    attributes: [],
                    required: false, 
                }],
                where: {
                    [Op.not]: [
                        { id: body.user_id }, // Exclude the current user
                    ]
                },
                group: ['User.id'],
                order: [[sequelizeInstance.fn('MAX', sequelizeInstance.col('Chats.created_at')), 'DESC']], // Order by last chat time
            });
    
            users.forEach(user => {
                if (!user.lastChatMessage) {
                    user.lastChatMessage = ''; // Default to an empty string
                }
                if (!user.lastChatTime) {
                    user.lastChatTime = null; // Default to null or any other default value
                }
            });
    
            return structureResponse(users, true, "Message Sent");
        } catch (error) {
            console.error("Error fetching users with last chat:", error);
            throw error;
        }
    };
    
    getChat = async (body) => {
        try{
            const getChats =  await ChatModel.findAll({
                where: {
                    [Op.or]: [
                        {
                            sender_id: body.userId,
                            receiver_id: body.loggedInUserId 
                        },
                        {
                            receiver_id: body.userId,
                            sender_id: body.loggedInUserId 
                        }
                    ]
                },
                order: [['created_at', 'DESC']], // Order by creation time (ascending)
            });

           return structureResponse(getChats, true, "Message Sent");
       }
       catch(error){
           console.error("Error creating user:", error);
           throw error; 
       }
    }


    sendMessageBySocket = async (body) => {
        try{
            const newChat = await ChatModel.create(body);

            // Check if newChat was created successfully
            if (!newChat) {
                throw new Error("Chat creation failed");
            }

           return await ChatModel.findAll({
            where: {
                [Op.or]: [
                    {
                        sender_id: body.receiver_id,
                        receiver_id: body.sender_id 
                    },
                    {
                        receiver_id: body.receiver_id,
                        sender_id: body.sender_id 
                    }
                ]
            },
            order: [['created_at', 'DESC']], // Order by creation time (ascending)
        });;
       }
       catch(error){
           console.error("Error creating user:", error);
           throw error; 
       }
    }


     getChatBySocket = async (userId,loggedInUserId) => {
        try{
            const getChats =  await ChatModel.findAll({
                where: {
                    [Op.or]: [
                        {
                            sender_id: userId,
                            receiver_id: loggedInUserId 
                        },
                        {
                            receiver_id: userId,
                            sender_id: loggedInUserId 
                        }
                    ]
                },
                order: [['created_at', 'DESC']], // Order by creation time (ascending)
            });

        //    return structureResponse(getChats, true, "Message Sent");
           return getChats;
       }
       catch(error){
           console.error("Error creating user:", error);
           throw error; 
       }
    }

}

module.exports = new AuthRepository;