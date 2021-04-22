const moment = require('moment');
module.exports = function (io) {

    let nicknames = [];
    io.on('connection', socket => {
        //User Enter
        socket.on('new user', (data, cb) => {
            if (nicknames.indexOf(data) != -1) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                nicknames.push(socket.nickname);
                updateNickNames();
            }
        });

        //Message Enter
        socket.on('send message', (data, cb) => {
            var msg = data.trim();
            if(msg)
            if (msg == '') {w
                cb('Error! Please enter your message');
            } else {
                io.sockets.emit('new message', { //New Messagese
                    msg: data,
                    nick: socket.nickname,
                    time: moment().format('h:mm a'),
                });
                cb('')
            }
        });

        //User Leave
        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            updateNickNames();
        });

        //Functions
        function updateNickNames() {
            io.sockets.emit('usernames', nicknames);
        }
    });
}