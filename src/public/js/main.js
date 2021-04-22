
$(function () {

    const socket = io();

    //Obtaining DOM elements from interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    const $chatError = $('#chatError');
    const $chatUsersCount = $('#chatUsersCount');
    const $emojibtn = $('#emojibtn');
    var $emoji = $('div#emoji');
    //Obtaining DOM elementes from nickname Form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');
    const $users = $('#usernames');
    let clientname;

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#backgroundWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                <div class="alert alert-danger">
                    That username already exits.
                </div>
                `);
            }
            clientname = $nickname.val();
            $nickname.val('')
        });
    });

    //Events
    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<b><p><i class="far fa-user"></i> ${data[i]}</p></b>`
        }
        $users.html(html);
        $chatUsersCount.html(`<p class="countusers">Users ${data.length}</p>`)
    });
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            if (data == '') return $chatError.html(``)
            $chatError.html(`<div class="alert alert-danger">
            ${data}
        </div>`)
        });
        $messageBox.val('');
        $chat.animate({ scrollTop: 20000000 }, "slow");
    });

    socket.on('new message', function (data) {
        if (data.nick == clientname) {
            $chat.append(`<div class="message">
            <div class="content">
                <p>${data.msg}</p>
                <p class="time">${data.time}</p>
            </div>
        </div>`);
        } else {
            $chat.append(`<div class="message-other">
            <h6>${data.nick}</h6>
            <div class="content-other">
                <p>${data.msg}</p>
                <p class="time">${data.time}</p>
            </div>
        </div>`);
        }
    });

    /* Emoji */

    function addEmoji(emoji) {
        let drawer = document.getElementById('drawer');
        if(drawer.classList.contains('hidden')) return;
        let text = $messageBox.val()
        let textemoji = text + emoji;
        $messageBox.val(textemoji)
    };

    function toggleEmojiDrawer() {
        let drawer = document.getElementById('drawer');
        if (drawer.classList.contains('hidden')) {
            drawer.classList.remove('hidden');
            drawer.classList.add('nothidden');
        } else {
            drawer.classList.add('hidden');
            drawer.classList.remove('nothidden');
        }
    };
    $emojibtn.click(function () {
        toggleEmojiDrawer()
    });
    $emoji.click(function (emoji) {
        addEmoji(emoji.target.innerHTML)
    });

    /*Text*/
    
})