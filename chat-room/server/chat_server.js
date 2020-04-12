var socketio = require('socket.io');
let memberList = [];

exports.socketioListen = function (server) { 
    var io = socketio.listen(server); 
    io.on('connection', function (socket) {
        // 进入界面，初始化成员列表
        socket.emit('init-member', memberList);

        // 登录成功
        socket.on('login', function (res) {
            let bExist = checkName(memberList, res.name);
            if (bExist) {
                socket.emit('loginErr', { msg: '重复的用户名，请重新输入！' });
            } else {
                memberList.push(res);
                socket.name = res.name;
                socket.emit('loginSuc', { person: res });
                io.emit('person-enter', { person: res, newMemberList: memberList });  
                socket.on('send-msg', function (res) {
                    let img = getPersonImg (res.name, memberList);

                    socket.broadcast.emit('receive-msg', {
                        name: res.name,
                        img: img,
                        msg: formatMsg(res.msg),
                        side: 'left'
                    });

                    socket.emit('receive-msg', {
                        name: res.name,
                        img: img,
                        msg: formatMsg(res.msg),
                        side: 'right'
                    });                    
                })            
            }
        });
        
        // 断开连接时
        socket.on('disconnect', () => {
            disconnect(io, socket);
        });            
    });
}

function getPersonImg (name, memberList) {
    if(!name || !Array.isArray(memberList))return;
    let img = null;
    memberList.every(d => {
        if (d.name === name) { 
            img = d.img;
            return false;
        }
        return true;
    })
    return img;
}

function formatMsg (msg) {
    let msgStr = msg.replace(/\[emoji\d{1,}\]/g, function (match) {
        let imgName = match.substr(1, match.length-2);
        return `<img src="/img/emoji/${imgName}.png"/>`
    });
    return msgStr;
}

function checkName (nameList, checkedName) {
    return nameList.some(d => d.name === checkedName);
}

function disconnect (io, socket) {
    console.log('connect');
    var theName = socket.name; 
    let index = -1;
    memberList.every( (d, i) => {
        if (d.name === theName) {
            index = i;
            return false;
        }
        return true;
    });
    if(~index) { 
        // console.log(theName, index);
        let thePerson = memberList[index];
        memberList.splice(index, 1);
        io.emit('person-out', { person: thePerson, newMemberList: memberList});
    }
}
        