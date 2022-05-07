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

io.on('connection', () => {
  console.log('New Websocket connection')
})

server.listen(port, () => {
  console.log('Listening on port 3000')
})