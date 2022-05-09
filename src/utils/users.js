const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()
  
  // Validate data:
  if(!username || !room){
    return {
      error: 'Username and room are required'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })
  // Validate username:
  if (existingUser) {
    return {
      error: 'Username in use'
    }
  }

  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  if(index !== -1){
    // return 1st removed item:
    return users.splice(index, 1)[0] 
  }
}
// Find first user with given id:
const getUser = (id) =>{  
  return users.find((user) => user.id === id)
}


// get all users with 
const getUsersInRoom = (room) =>{
  return users.filter((user => user.room === room))
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

// // TEST:
// addUser({
//   id: 22,
//   username: '  Paul ' ,
//   room: '  77'
// })

// addUser({
//   id: 23,
//   username: '  Julie ' ,
//   room: '  77'
// })

// console.log(users)

// const res = addUser({
//   id: 92,
//   username: 'Jojo',
//   room: 'pp'
// })
// console.log()
// console.log(users)
// console.log()
// const removedUser = removeUser(92)
// console.log(removedUser)
// console.log()
// console.log(users)
// console.log()
// console.log(getUser(22))
// console.log()
// console.log(getUsersInRoom('74'))