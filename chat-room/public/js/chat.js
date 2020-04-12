var socket = io(); 
var me = null;
// event from server
socket.on('init-member', res => {
  renderMemberList (res);
});

// 有用户离开聊天界面
socket.on('person-out', res => {
  console.log('out', res);
  if (res.person && Array.isArray(res.newMemberList)) {
    $('#onlineMemebers').html("");
    renderMemberList (res.newMemberList);
    renderNameIntip (res.person, getCurDate(), '离开');
  }
}); 

socket.on('loginSuc', res => {
  $('#namePopup').css('display', 'none'); 
  me = res.person;
  socket.on('receive-msg', res => {
    console.log(res);
    renderMsg(res);
  });
});

// 有用户进入聊天界面
socket.on('person-enter', res => {
  $('#onlineMemebers').html("");
  renderMemberList (res.newMemberList);
  renderNameIntip (res.person, getCurDate(), '进入');

  $('#messageList').scrollTop($('#messageList')[0].scrollHeight);
});

// 登录失败， 有名字重复
socket.on('loginErr', res => {
  alert(res.msg);
});


function getCurDate () {
  return new Date().toTimeString().substr(0, 8);  
}

function renderNameIntip (person, date, action) {
  $('#messageList').append(
    `<li class='member-enter'>
      ${date} <br/> ${person.name} ${action}了聊天室
    </li>`
  );
}

function renderNameInlist (person) {
  $('#onlineMemebers').append(
    `<div class="room-memeber">
      <img src = "img/${person.img}">
      <span class="memeber-name" title="${person.name}">${person.name}</span>                      
    </div> `
  ); 
}

function renderMemberList (nameList) {
  nameList.forEach(d => {
    renderNameInlist (d);
  });
}

function renderMsg (data) {
  if (({}).toString.call(data) === '[object Object]') {
    if (data.side === 'right') {
      str =`<li>
              <div class="message-item ${data.side}">
                <div class="message-text-wrapper ${data.side}">
                  <span class="sender-name ${data.side}">${data.name}</span>
                  <div class="message-text">
                    <p>${data.msg}</p>
                    <span class = "trangle"></span>
                  </div>
                </div> 
                <div class="head-portrait">
                  <img src="img/${data.img}"/>
                </div>                                      
              </div>
            </li>`;
    } else {
      str = `<li>
              <div class="message-item ${data.side}">
              <div class="head-portrait">
                  <img src="img/${data.img}"/>
              </div>
              <div class="message-text-wrapper ${data.side}">
                  <span class="sender-name">${data.name}</span>
                  <div class="message-text">
                      <p>${data.msg}</p>
                      <span class = "trangle"></span>
                  </div>
              </div>   
              </div>      
            </li>`;
    }
    $('#messageList').append(str); 
  } 
}



