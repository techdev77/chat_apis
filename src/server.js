const connectDB= require('./connections/database.connection');
const { ExpressLoader } = require('./connections/express.connection');
// const { MiddlewareLoader } = require('./connections/middleware.connection');
const { Config } = require('./configs/config');






// // connect database
connectDB.init();
const { RoutesLoader } = require('./connections/route.connection');
const AuthRepository = require('./repositories/auth.repository')

// // load express
const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

// // init middleware
// MiddlewareLoader.init(app);



const server = require('http').createServer();
const io = require('socket.io')(app.listen(4000,()=>{

}))

const connectedUsers = {}; 
// Handle Socket.IO connections
io.on('connection', (socket) => {

  console.log('A user connected');
  console.log(socket);
  socket.on('disconnect', () => {
    console.log('User disconnected');
    const userId = connectedUsers[socket.id];
    io.to('someRoom').emit('offline event', userId);
  });

  socket.on('chat message', async (msg) => {
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

});



// starting the server
const port = Number(Config.PORT);
app.listen(port, () => console.log(`
  ==================================
  🚀 Server running on port ${port}!🚀
  ==================================
`));

module.exports = app;