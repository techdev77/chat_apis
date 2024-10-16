const { Sequelize, DataTypes } = require('sequelize');
const connectDB = require('../connections/database.connection');

const sequelizeInstance = connectDB.getSequelize();

const ChatModel = sequelizeInstance.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    chat_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    media: {
        type: DataTypes.STRING,
        allowNull: true
    },
    read_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0 // Assuming 0 means unread
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'chats',
    timestamps: false // Disable automatic timestamps
});

module.exports = ChatModel;
