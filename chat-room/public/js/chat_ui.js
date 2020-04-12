// 点击输入昵称，回车登录
$('#nameIput').keyup((ev)=> {
    if(ev.which === 13) inputName();
});
$('#nameBtn').click(inputName);

function inputName() {
    let sex = $('#maleRadio')[0].checked ? 'male' : 'female';
    let nameStr = $('#nameIput').val().trim();
    if(!nameStr) {
        alert("请填写完整的名字。");
    } else {
        socket.emit('login', { 
            sex: sex,
            name: $('#nameIput').val(),
            img: assignPicture(sex)
        });  
    }
}

// 分配头像
function assignPicture (sex) {
    let _sex = sex === 'male' ? 'boy' : 'girl'; 
    var imgN = `${_sex}${Math.floor(Math.random()*5)+1}.jpeg`; //分配头像
    return imgN;
}

/* 聊天模块 */

// 页面主体
let roomWrapper = $('#roomWrapper'); 
// 表情icon
let sticker = $('#sticker'); 
// 表情选择框
let stickBox = $('#stickBox'); 
// 输入框
let messageInput = $('#messageInput');

// 点击表情icon以为的位置隐藏表情选择框
roomWrapper.click(function (event) {
    if(!sticker[0].contains(event.target) && !stickBox[0].contains(event.target)) {
        stickBox.css('display', 'none');
    }
});

// 点击表情icon显示表情选择框
sticker.click(function (event) {
    let curStyle = stickBox.css('display');
    stickBox.css('display', curStyle === 'block' ? 'none' : 'block');
});

// 表情选择框
stickBox.click(function (event) {
    if (~event.target.id.indexOf('emoji')) {
        messageInput[0].value += `[${event.target.id}]`
    }   
});


$('#messageInput').keyup(event => {
    if(event.which === 13) {
        event.preventDefault();
        emitMsg();
    }
})
// 发送信息
$('#sendBtn').click(function () {
    emitMsg();
}); 

function emitMsg () {
    let msg = $('#messageInput')[0].value;
    if (msg) {
        socket.emit('send-msg',{
            name: me.name,
            msg: msg
        });
        $('#messageInput')[0].value = '';
    }
}

/* 退出聊天界面 */
$('#existBtn').click(function () {
    // socket.emit('disconnect');
    socket.emit('disconnect');
})






  
