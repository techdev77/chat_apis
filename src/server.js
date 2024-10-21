const connectDB= require('./connections/database.connection');
const { ExpressLoader } = require('./connections/express.connection');
// const { MiddlewareLoader } = require('./connections/middleware.connection');
const { Config } = require('./configs/config');
const moment = require('moment');
const fs = require('fs').promises;
const path = require('path');
// // connect database
connectDB.init();
const { RoutesLoader } = require('./connections/route.connection');
const AuthRepository = require('./repositories/auth.repository')

 var Logger=require('./Helper/logger');
// // load express
const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

// // init middleware
// MiddlewareLoader.init(app);



const server = require('http').createServer();
const io = require('socket.io')(app.listen(4000,()=>{
// Example usage
const logPath = path.join(__dirname, './storage/logs/ex.txt'); // Adjust path as needed
Logger.logType = 'INFO';
Logger.className = 'MyClass';
Logger.methodName = 'MyClass::myMethod';
Logger.lineNo = new Error().stack.split('\n')[1];;
Logger.message = 'This is a log message';
Logger.print(logPath);

}))

const connectedUsers = {}; 
// Handle Socket.IO connections
io.on('connection', (socket) => {

  console.log('A user connected');
  // console.log(socket);
  socket.on('disconnect', () => {
    console.log('User disconnected');
    const userId = connectedUsers[socket.id];
    io.to('someRoom').emit('offline event', userId);
  });

  socket.on('chat message',async (msg) => {
    console.log(msg.media);
       if(msg.media!=null && msg.media!=''){
         msg.media= await getFile(msg.media);
       }
   
   
    console.log(msg.media);
    const response = await AuthRepository.sendMessageBySocket(msg);
    io.to(msg.receiver_id).emit('chat message', response);
    io.emit('chat message', response);
    console.log(msg);
  });


  socket.join('someRoom');

  // When the user comes online
  socket.on('userOnline', (userId) => {
    connectedUsers[socket.id]=userId;
      // Notify everyone in 'someRoom' that this user is online
      io.to('someRoom').emit('online event', userId);
  });


  // When the user comes online
  socket.on('offLine', (userId) => {
    // Notify everyone in 'someRoom' that this user is online
    io.to('someRoom').emit('offline event', userId);
});



async function getFile(message) {

const now = moment(); // Current date and time
  const buffer = Buffer.from(message);
   let chatImage="CHAT_"+now.valueOf()+".png";
  // Specify the output path for the PNG file
  const outputPath = path.join(__dirname, `./storage/images/${chatImage}`); // Adjust the path as needed

  try {

    // Write the buffer to a file
    await fs.writeFile(outputPath, buffer);
    
    // Log success and return the filename
    console.log('PNG file saved successfully:', outputPath);
    return outputPath.split('/').pop(); // or path.basename(outputPath)
  } catch (err) {
    // return '';
    console.error('Error writing file:', err);
    return '';
  }
}


});



// starting the server
const port = Number(Config.PORT);
app.listen(port, () => console.log(`
  ==================================
  🚀 Server running on port ${port}!🚀
  ==================================
`));

module.exports = app;