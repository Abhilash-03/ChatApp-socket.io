const socket = io('ws://localhost:5000')
const inputMsg = document.getElementById('inputMsg');
const form = document.getElementById('textMsg');
const username = document.getElementById('username');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(username.value && inputMsg.value){
      socket.emit('message', {
        name: username.value,
        text: inputMsg.value
      });
      inputMsg.value = "";
    }

    inputMsg.focus();
})

const enterInChat = document.querySelector('.join');
enterInChat.addEventListener('submit', (e) => {
    e.preventDefault();
    if(username.value){
        socket.emit('enterChat', {
            name: username.value
        })
    }
})

function msgFormat(data){
    activity.textContent = '';
    const {name, text, time} = data;
    let li = document.createElement('li');
    li.className = 'post-msg';
    if(name === username.value) li.className = 'post post-right';
    if(name !== username.value && name !== 'Bot') li.className = 'post post-left'
    if(name !== 'Bot'){
        li.innerHTML = `
        <div class="userInfo">
            <span class="userName ${name === username.value ? 'userPost' : 'replyPost'} ">${name || 'User'}</span>
            <span class="time">${time}</span>
        </div>
        <div class="usermsg">
            <img src="img/img.jpg"
                alt="user image" class="image" width="50" height="50">
            <span id="text-msg">${text}</span>
        </div>
    `
    } else{
        li.innerHTML = `<div class="post-text">${text}</div>`
    }
   
    const ul = document.querySelector('ul');
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
}

socket.on('message', (data) => {
    msgFormat(data);
})

// activity detection
inputMsg.addEventListener('keypress', () => {
    socket.emit('activity', username.value);
})

let activityTimer;

socket.on('activity', (name) => {
    const activity = document.getElementById('activity');
    if(username.value){
        activity.textContent = `${name} typing...`;
    }

    clearTimeout(activityTimer);

    activityTimer = setTimeout(() => {
        activity.textContent = '';
    }, 1500);
})