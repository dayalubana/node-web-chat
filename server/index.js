const path=require('path')
const express=require('express');
const socketIO=require('socket.io');
const http=require('http')
const {generateMessage}=require('./util/message.js')
const {isRealString}=require('./util/validation')
const {Users}=require('./util/users')

var user=new Users()

var publicPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000
var app=express();
app.use(express.static(__dirname+'/../public'))


var server= http.createServer(app)
var io=socketIO(server)
io.on('connection',(socket)=>{
  console.log('New user connected');

  // socket.emit('newEmail',{
  //   from:'jen@ksl',
  //   text:'hey',
  //   createdAt:123
  // })
  //
  // socket.on('createEmail',function(Email){
  //   console.log(Email);
  // })

  // socket.emit('newMessage',{
  //   from:'jen@mds',
  //   text:'hepppp',
  //   createdAt:123
  // })

  socket.on('join',(param,callback)=>{
    console.log(param);
    if(!isRealString(param.name)||!isRealString(param.room)){
      return callback('Name and    Room value are required')
    }

    socket.join(param.room)

    user.removeUser(socket.id)
    user.addUser(socket.id,param.name,param.room)

    io.to(param.room).emit('updateUserList',user.getUserList(param.room))

    socket.broadcast.to(param.room).emit('newMessage',generateMessage('Admin',param.name+' has joined'))

    socket.emit('newMessage',generateMessage('Admin','Welcome   to Chat App'))

    callback()
  })



  socket.on('createMessage',(newMessage,callback)=>{
    console.log('newMessage',newMessage);
    	var user1=user.getUser(socket.id)
      if(user1&&isRealString(newMessage.text)){
        io.to(user1.room).emit('newMessage',generateMessage(user1.name,newMessage.text));
      }

    callback();
    // socket.broadcast.emit('newMessage',{
    //   to:newMessage.to,
    //   text:newMessage.text,
    //   createdAt:new Date().getTime()
    // })
  })

  socket.on('disconnect',()=>{
    var us=user.removeUser(socket.id)
    if(us){
      io.to(us.room).emit('updateUserList',user.getUserList(us.room))
      io.to(us.room).emit('newMessage',generateMessage('Admin',us.name +' has left'))
    }
  })
})
server.listen(port)
