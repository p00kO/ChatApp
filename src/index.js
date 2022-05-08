const express = require('express')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')

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
  const mes = "Welcome!"
  socket.emit('message', mes)  
  
  socket.broadcast.emit('message', 'A new user has joined!')

  socket.on('sendMessage', (newMes, callback) =>{
    const filter = new Filter()
    if(filter.isProfane(newMes)){
      return callback('Profanity is not allowed')
    }

    io.emit('message', newMes)
    callback()
  })
  
  socket.on('sendLocation', (newLoc, callback) => {
    let val = `https://google.com/maps?=${newLoc.lat},${newLoc.long}`   
    io.emit('message', val)
    callback('Location shared')
  })

  socket.on('disconnect', () =>{
    io.emit('message', "User just left :-(")
  })
})

server.listen(port, () => {
  console.log('Listening on port 3000')
})





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