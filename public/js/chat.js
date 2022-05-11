const socket = io()

const messageForm = document.querySelector('form');
const sendLoc = document.querySelector('#sendLoc')
const formButton = document.querySelector('button')
const messages = document.getElementById('message')

const messageTemp = document.querySelector('#message-template').innerHTML
const locationTemp = document.querySelector('#location-template').innerHTML
const sidebarTemp = document.querySelector('#sidebar-template').innerHTML
//Option:
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  //New message element:
  const newMessage = messages.lastElementChild
  //Height of new messages:
  const newMessageStyles = getComputedStyle(newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin
  //Visible Height:
  const visibleHeight = messages.offsetHeight

  // Height of message container:
  const containerHeight = messages.scrollHeight

  // How far down are we:
  const scrollOffset = messages.scrollTop + visibleHeight

  if(containerHeight - newMessageHeight<= scrollOffset){
    messages.scrollTop = messages.scrollHeight
  }

}

socket.on('message',(mes)=>{
   const html = Mustache.render(messageTemp, {
     username:mes.username,
     createdAt: moment(mes.createdAt).format('h:mm a'),
     message: mes.text
   })
   messages.insertAdjacentHTML('beforeend', html)
   autoscroll()
})

socket.on('locationMessage',(mes) =>{  
  const html = Mustache.render(locationTemp, {
    username:mes.username,
    createdAt: moment(mes.createdAt).format('h:mm a'),
    url: mes.text
  })
  messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('roomData',({room,users})=>{
  const html = Mustache.render(sidebarTemp, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if(error){
      alert(error)
      location.href ='/'
    }
  })





// socket.on('countUpdated', (count) => {
//   console.log('count updated -> ' + count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
// socket.emit('increment')
// })