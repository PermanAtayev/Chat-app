const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild
 
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
 
    // Visible height
    const visibleHeight = $messages.offsetHeight
 
    // Height of messages container
    const containerHeight = $messages.scrollHeight
 
    // How far have I scrolled?
    const scrollOffset = Math.ceil($messages.scrollTop + visibleHeight); 
    
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });

    document.querySelector("#sidebar").innerHTML = html;
});

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, 
    {
        username: message.username,
        message : message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, 
    {
        username: message.username,
        message: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    // disable the form for a while, once you submit it
    const message = e.target.elements.message.value;

    // event name, arguments, acknowledgement function
    socket.emit('sendMessage', message, (error) => {
        // acknowledgement callback, once the server responds to our request is called

        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            console.log(error);
        }
    });
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    $locationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        const location = { latitude: position.coords.latitude, longtitude: position.coords.longitude };

        socket.emit('sendLocation', location, () => {
            // acknowledgement callback, once the server responds to our request is called
            $locationButton.removeAttribute('disabled');
        });
    });
})

socket.emit("join", {username, room}, (error) => {
    if(error){
        alert(error);
        location.href = "/";
    }
});