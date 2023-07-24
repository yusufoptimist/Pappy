// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
    user = document.getElementById('user'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    listUser = document.getElementById('listUser'),
    feedback = document.getElementById('feedback'),
    title = document.getElementById('title');

var userID = localStorage.getItem('userName'); // set userID if exists 
if(userID != '')    {
    user.value = userID;

    socket.emit('join',user.value);  
}

function onSend(e) {
    if(user.value == '') {
        alert("Name is required");
    }
    else if(message.value != '') {
        if(userID != user.value) {
            socket.emit('join',user.value);  
            userID = user.value;  // update
            localStorage.setItem('userName', user.value)  // save userID
        }
           
        var date = new Date();
        var timestamp = Math.floor(date.getTime()/1000);
        
        const chatmsg = {
            user: user.value,
            timestamp: timestamp,
            message: message.value
        };

        const msgJSON = JSON.stringify(chatmsg);
        console.log(msgJSON);

        socket.emit('chat', msgJSON);
    }

    message.value = "";
}

// Button - to send a message
btn.addEventListener('click', onSend);

// message box
message.addEventListener('keypress', function(e){
    socket.emit('typing', name.value);

    if(e.keyCode==13) {
        onSend(e);
    }
})

// Listen for events 
socket.on('chat', function(data){
    feedback.innerHTML = '';
    const fchar = "Hope"
    // const vv = fchar.CharAt(0)

    var date = new Date(data.Timestamp * 1000);
    var timestr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  
    if(data.EvtType == 'join' && data.User != '')
        listUser.innerHTML = `<div style=" display: flex; flex-direction: row; justify-contents: center;">
        <div style=" display: flex; justify-content: center; align-items: center; border-radius: 500px; border: 2px solid green; background: white; width: 50px; height: 50px; color: red;"><h2>${fchar.charAt(0)}</h2></div>
        <p style="padding: 0 12px;">${data.User}</p>
        </div>`;
    else if(data.EvtType == 'leave' && data.User != '')
    
        listUser.innerHTML = `<div style=" display: flex; flex-direction: row; justify-contents: center;  ">
        <div style=" display: flex; justify-content: center; align-items: center; border-radius: 500px; border: 2px solid yellow; background: white; width: 50px; height: 50px; color: red; weight: 500"><h2>${fchar.charAt(0)}</h2></div>
        <p style="padding: 0 12px">${data.User}</p>
        </div>`;
    else if(data.EvtType == 'message') {
        if(data.User == userID)
        output.innerHTML += `<div class="speech-bubble">
        <div>${data.User}</div>
        <div class>${data.Text}</div>
        <div style="float: right; color: #eee; font-size: 12px;">${timestr}</div>
        </div>
        

        </div>`     
        else 
        output.innerHTML += '<div class="cht">'+ '<p style="color: #111;"'+ timestr+ data.Text + '</div>'; 
            // output.innerHTML += '<strong>' + data.User  + ': </strong>' + data.Text +'     <strong>('+ timestr+')</strong></p>';      
    }
        
    output.scrollIntoView(false);
  });

// Listen for events 
socket.on('participant', function(data){
    title.textContent += data;
    console.log('update participants');
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});