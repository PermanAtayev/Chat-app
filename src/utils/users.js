const users = [];

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if(!username || !room){
        return {
            error: "Username and room are required"
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return (user.username === username && user.room === room);
    });

    // Validate username
    if(existingUser){
        return {
            error: "Username is in use for that room"
        }
    }

    // Store the user
    const user = {id, username, room};
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// Find a user with the given id
const getUser = (id) => {
    return users.find((user) => (user.id === id));
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => {
        return user.room === room.trim().toLowerCase();
    })
    return usersInRoom;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}