const socket = io()


socket.on('message',(mes)=>{
  document.getElementById('message').innerText = mes
})
const messageForm = document.querySelector('form');
const search = document.querySelector('input');

messageForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  socket.emit('sendMessage', search.value)
})
// socket.on('countUpdated', (count) => {
//   console.log('count updated -> ' + count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
// socket.emit('increment')
// })