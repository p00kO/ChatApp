const socket = io()

const messageForm = document.querySelector('form');
const sendLoc = document.querySelector('#sendLoc')
const formButton = document.querySelector('button')
const messages = document.getElementById('message')

const messageTemp = document.querySelector('#message-template').innerHTML
const locationTemp = document.querySelector('#location-template').innerHTML

//Option:
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })



socket.on('message',(mes)=>{
   const html = Mustache.render(messageTemp, {
     createdAt: moment(mes.createdAt).format('h:mm a'),
     message: mes.text
   })
   messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage',(mes) =>{
  const html = Mustache.render(locationTemp, {
    createdAt: moment(mes.createdAt).format('h:mm a'),
    url: mes.text
  })
  messages.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', (e)=>{
  e.preventDefault()  

  formButton.setAttribute('disabled','disabled')
  const search = e.target.elements.msg;
  socket.emit('sendMessage', search.value, (error) =>{
    formButton.removeAttribute('disabled')
    search.value = ''
    search.focus()

    if(error){
      return console.log(error)
    }
    console.log('message was delivered')
  })  
})

sendLoc.addEventListener('click',() => {   
  if(!navigator.geolocation){
    console.log('location failed...')    
    return alert('geolocation failed')    
  }
  sendLoc.setAttribute('disabled','disabled')
  navigator.geolocation.getCurrentPosition((position) => {  
    sendLoc.removeAttribute('disabled')
    socket.emit('sendLocation', {
      'lat': position.coords.latitude,
      'long': position.coords.longitude
    },(error) =>{
      console.log(error)
    })
  }, () =>{
    console.log('location failed...')
    sendLoc.removeAttribute('disabled')
  },{maximumAge:60000, timeout:5000, enableHighAccuracy:false})
})

socket.emit('join', { username, room })






// socket.on('countUpdated', (count) => {
//   console.log('count updated -> ' + count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
// socket.emit('increment')
// })