const socket = io()


socket.on('message',(mes)=>{
  document.getElementById('message').innerText = mes
})
const messageForm = document.querySelector('form');


messageForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const search = e.target.elements.msg;
  socket.emit('sendMessage', search.value)
  search.value = ''
})

document.querySelector('#sendLoc').addEventListener('click',() => {  
  if(!navigator.geolocation){
    console.log('location failed...')  
    return alert('You cant hadle this feature')
  }
    navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
    //const mes = 'Location: ' + position.coords.latitude + ',' + position.coords .longitude
    socket.emit('sendLocation', {
      'lat': position.coords.latitude,
      'long': position.coords.longitude
    })
  }, () =>{
    console.log('location failed...')
  },{maximumAge:60000, timeout:5000, enableHighAccuracy:false})
})








// socket.on('countUpdated', (count) => {
//   console.log('count updated -> ' + count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
// socket.emit('increment')
// })