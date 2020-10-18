$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $chat = $('#chat');
    var $msgArea = $('#messagearea');
    var $userFormArea = $('#userformarea');
    var $userForm = $('#userForm');
    var $users = $('#users');
    var $feedback= $('#feedback');
    var $message = $('#message');

    $messageForm.submit(function(e){
        e.preventDefault();
        
        if($message.val() == ""){
            return false;
        }else{
            socket.emit('send message', $message.val());
            $message.val('');
        }
    });

    socket.on('new message', function(data){
        $chat.append('<div class="chat-msg"><strong>' + data.user + '</strong> :' + data.msg + '</div>');
    });

    $userForm.submit(function(e){
        var $username = $('#user').val();
        e.preventDefault();
        if($username == ""){
            alert("please Enter Username");
        }else{
            socket.emit('new user', $username, function (data) {
                if (data) {
                    $userFormArea.hide();
                    $msgArea.show();
                }
            });
            $username;
        }
    });

    socket.on('get users', function(data){
    var html = '';
    for(i=0; i<data.length; i++){
        html += '<li class="list-group-item">' + data[i] + '</li>';
    }
    $users.html(html);
    });

    //add image
    $('#image').on('change', function (e) {
        var file = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function (events) {
            socket.emit('user image', events.target.result);
        };
        reader.readAsDataURL(file);
        $('#image').val('');
    });

    //add files
    $('#otherfile').on('change', function (e) {
        var file = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            socket.emit('other file', evt.target.result);
        };
        reader.readAsDataURL(file);
        $('#otherfile').val('');
    });

    $message.on('keypress', function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $(this).blur();
            $('#submit').focus().click();
        }
    });
});


//upload files
var socket = io();

socket.on('addimage', function (data, image) {
    $('#chat').append($('<b>').text(data + ': '), '<img class="shared-images" src="' + image + '"/>');
});

socket.on('otherformat', function (data, base64file) {
    $('#chat')
        .append(
            $('<p class="fileElement">').append($('<b>').text(data + ': '), '<a target="_blank" href="' + base64file + '">Attached file</a>'
            )
        );
});
