const express = require('express')
const path = require('path')
const http = require('http')
const app = express()

const server = http.createServer(app)
const socketio = require('socket.io')

const io = socketio(server)

const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname,'../public')))


app.get('', (req,res) => {
  res.sendFile('index.html')
})

// let count =0;

io.on('connection', (socket) => {
  console.log('New Websocket connection')
  const mes = "Welcome!"
  socket.emit('message', mes)  
  socket.on('sendMessage', (newMes) =>{
    io.emit('message', newMes)
  })  
  // // setInterval(()=>{    
  // //   socket.emit('countUpdated', count)
  // // }, 1000)
  // socket.emit('countUpdated', count)
  // socket.on('increment',()=>{
  //   count++
  //   socket.emit('countUpdated', count)
  //   io.emit('countUpdated',count)
  // })
})





server.listen(port, () => {
  console.log('Listening on port 3000')
})