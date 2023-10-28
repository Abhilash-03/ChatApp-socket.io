const socket = io('ws://localhost:5000')
const inputMsg = document.getElementById('inputMsg');
const form = document.getElementById('textMsg');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = inputMsg.value;
    if(inputMsg.value){
      socket.emit('message', msg);
      inputMsg.value = "";
    }

    inputMsg.focus();
})

function msgFormat(msg){
    activity.textContent = '';

    let li = document.createElement('li');
    li.className = 'post-msg';
    li.innerHTML = `
        <div class="userInfo">
            <span class="userName">User</span>
            <span class="time">5:30 P.M</span>
        </div>
        <div class="usermsg">
            <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1698409334~exp=1698409934~hmac=9695f95e0e9113d03f1557ff5373143a6b68e7c7f8b742b7acf9a2e07b5526ac"
                alt="user image" class="image" width="50" height="50">
            <span id="text-msg">${msg}</span>
        </div>
    `
    const ul = document.querySelector('ul');
    ul.appendChild(li);
}

socket.on('message', (data) => {
    msgFormat(data);
})

// activity detection
inputMsg.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5));
})

let activityTimer;

socket.on('activity', (name) => {
    const activity = document.getElementById('activity');
    activity.textContent = `${name} typing...`;

    clearTimeout(activityTimer);

    activityTimer = setTimeout(() => {
        activity.textContent = '';
    }, 1500);
})