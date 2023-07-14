var selectedChat = "general";
function changeChatRoom(){
    var newChat = document.getElementById("chatroom")
    if(newChat != null && newChat.value != selectedChat){
        console.log(newChat)
    }
    return false

}

function sendMessage(){
    var newMessage = document.getElementById("message")
    if(newMessage != null ){
        console.log(newMessage)
    }
    return false
}

window.onload = function(){
    document.getElementById("chatroom-selection").onsubmit = changeChatRoom()
    document.getElementById("chatroom-message").onsubmit = sendMessage()

    if(window["WebSocket"]){
        console.log("supports websocket")
       conn = new WebSocket("ws://"+document.location.host + "/ws");
    }else{
        console.log("browser does not support websocekt")
    }

}