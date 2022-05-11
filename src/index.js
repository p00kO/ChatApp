const express = require('express')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')
const {generateMessage} = require('./utils/messages')
const { addUser,removeUser,getUser,getUsersInRoom } = require('./utils/users')
const app = express()

const server = http.createServer(app)
const socketio = require('socket.io')

const io = socketio(server)

const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname,'../public')))


app.get('', (req,res) => {
  res.sendFile('index.html')
})

io.on('connection', (socket) => {
  console.log('New Websocket connection')

  socket.on('join', ({username, room}, callback) => {    
    const {error, user } = addUser({id:socket.id, username, room })
    if(error){
      return callback(error)
    }

    socket.join(user.room)

    socket.emit('message',generateMessage(user.username, 'Welcome'))
    socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${user.username} has joined room ${user.room}`))

    io.to(user.room).emit('roomData',{
      room:user.room,
      users:getUsersInRoom(user.room)
    })
    callback()
  })


  socket.on('sendMessage', (newMes, callback) =>{
    
    const user = getUser(socket.id)
    const filter = new Filter()
    if(filter.isProfane(newMes)){
      return callback('Profanity is not allowed')
    }
    
    //io.emit('message', generateMessage(newMes))
    io.to(user.room).emit('message', generateMessage(user.username,newMes))
    callback()
  })
  
  socket.on('sendLocation', (newLoc, callback) => {
    const user = getUser(socket.id)
    let val = `https://google.com/maps?=${newLoc.lat},${newLoc.long}`   
    io.to(user.room).emit('locationMessage', generateMessage(user.username,val))
    callback('Location shared')
  })

  socket.on('disconnect', () =>{
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('message', generateMessage(user.username,`${user.username} has left`))
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
      })
    }    
  })
})

server.listen(port, () => {
  console.log('Listening on port 3000')
})

  // const mes = "Welcome!"
  // socket.emit('message', generateMessage(mes))  
  // socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    // socket.emit, io.emit, socket.broadcast.emit --> users
    // io.to.emit, socket.broadcast.to.emit --> rooms

// let count =0;

  // // setInterval(()=>{    
  // //   socket.emit('countUpdated', count)
  // // }, 1000)
  // socket.emit('countUpdated', count)
  // socket.on('increment',()=>{
  //   count++
  //   socket.emit('countUpdated', count)
  //   io.emit('countUpdated',count)
  // })