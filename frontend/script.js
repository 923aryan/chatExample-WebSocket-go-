var selectedChat = "general";
class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

function routeEvent(event) {
  if (event.type === undefined) {
    alert("no type filed in the event");
  }
  switch (event.type) {
    case "new_message":
      console.log("new message");
      break;
    default:
      console.log("unsupported message type");
      break;
  }
}

function sendEvent(eventName, payload) {
  const event = new Event(eventName, payload);
  conn.send(Json.stringify(event));
}

function changeChatRoom() {
  var newChat = document.getElementById("chatroom");
  if (newChat != null && newChat.value != selectedChat) {
    console.log(newChat);
  }
  return false;
}

function sendMessage() {
  var newMessage = document.getElementById("message");
  if (newMessage != null) {
    sendEvent("send_message", newMessage.value);
  }
  return false;
}

window.onload = function () {
  document.getElementById("chatroom-selection").onsubmit = changeChatRoom;
  document.getElementById("chatroom-message").onsubmit = sendMessage;

  if (window["WebSocket"]) {
    console.log("supports websocket");
    conn = new WebSocket("ws://" + document.location.host + "/ws");

    /* The conn.onmessage in the code you provided is an event handler that
     is assigned to the websocket connection object conn. An event handler 
     is a function that is executed when a certain event occurs. In this case,
      the event is receiving a message from the server through the websocket connection.
       The function takes an argument evt that contains information about the message,
        such as its data, origin, and type. The function then parses the message data 
    from JSON format to an object, creates a new instance of the Event class using the
     object properties, and calls the routeEvent function to handle the event object according
      to its type and payload. This is how the chat application receives and processes events
     from the server in real time without refreshing or reloading the page.*/
    conn.onmessage = function (evt) {
      const eventData = JSON.parse(evt.data);
      const event = Object.assign(new Event(), eventData);
      routeEvent(event);
    };
  } else {
    console.log("browser does not support websocekt");
  }
};

/*
Sure, I can help you understand the code for websocket. Here is a step by step explanation of the flow of execution and some comments on each line of code:

The first line declares a variable selectedChat and assigns it the value "general". This variable will store the name of the current chat room that the user is in.
The next lines define a class Event that has two properties: type and payload. This class will be used to create objects that represent different types of events that can occur in the chat application, such as sending or receiving messages. The type property indicates what kind of event it is, and the payload property contains any additional data associated with the event.
The next lines define a function routeEvent(event) that takes an event object as a parameter and performs different actions depending on the event type. This function will be called whenever an event is received from the server through the websocket connection. The function uses a switch statement to check the event type and execute the corresponding case. For example, if the event type is "new_message", the function will log "new message" to the console. If the event type is not supported, the function will log "unsupported message type" to the console. If the event object does not have a type property, the function will alert "no type filed in the event".
The next lines define a function sendEvent(eventName, payload) that takes two parameters: eventName and payload. This function will be used to create and send an event object to the server through the websocket connection. The function creates a new instance of the Event class using the parameters as arguments, and then converts it to a JSON string using Json.stringify(event). The function then calls conn.send(Json.stringify(event)) to send the JSON string to the server.
The next lines define a function changeChatRoom() that will be used to change the current chat room that the user is in. The function gets the value of the element with id "chatroom" using document.getElementById("chatroom"), which is a select element that allows the user to choose from different chat rooms. The function then checks if the value of this element is not null and not equal to the value of selectedChat, which means that the user has selected a different chat room. If so, the function logs the new chat room to the console using console.log(newChat). The function then returns false, which prevents the default behavior of submitting a form.
The next lines define a function sendMessage() that will be used to send a message from the user to the server. The function gets the value of the element with id "message" using document.getElementById("message"), which is an input element that allows the user to type a message. The function then checks if the value of this element is not null, which means that the user has typed something. If so, the function calls sendEvent("send_message", newMessage.value) to create and send an event object with type "send_message" and payload equal to the message value. The function then returns false, which prevents the default behavior of submitting a form.
The next lines are executed when the window is loaded using window.onload = function () {...}. This means that these lines will run after all elements of the page are loaded. These lines do two things: they assign event handlers to two forms on the page, and they establish a websocket connection with the server.
The first two lines assign event handlers to two forms on the page using document.getElementById(...).onsubmit = .... These forms are used to change chat rooms and send messages, respectively. The event handlers are set to be equal to the functions defined earlier: changeChatRoom and sendMessage. This means that whenever these forms are submitted by clicking a button or pressing enter, these functions will be called instead of sending an HTTP request to a server.
The next lines check if the browser supports websocket using if (window["WebSocket"]) {...}. Websocket is a protocol that allows bidirectional communication between a client and a server without refreshing or reloading the page. If websocket is supported, these lines do two things: they create a new websocket connection with the server using conn = new WebSocket("ws://" + document.location.host + "/ws"), and they assign an event handler to this connection using conn.onmessage = function (evt) {...}. This means that whenever a message is received from the server through this connection, this function will be called with an argument evt that contains information about the message.
The first line inside this function parses the message data from JSON format to an object using const eventData = JSON.parse(evt.data). This converts the JSON string sent by the server to an object that can be accessed by its properties.
The next line creates a new instance of the Event class using Object.assign(new Event(), eventData). This copies the properties of the object parsed from the JSON string to a new event object. This is done to make the object consistent with the class definition and to use the class methods if any.
The last line calls routeEvent(event) to handle the event object according to its type and payload. This function was defined earlier and performs different actions depending on the event type.
If websocket is not supported, these lines log "browser does not support websocekt" to the console using console.log("browser does not support websocekt"). This means that the chat application will not work properly on this browser.
I hope this explanation helps you understand the code for websocket better. If you have any questions, feel free to ask me. 😊
*/

/*
+---------------------+
| Initialize variables|
| Define class Event  |
| Define functions    |
+---------------------+
          |
          v
+---------------------+
| Window onload event |
+---------------------+
          |
          v
+---------------------+
| Assign event handlers|
| Create websocket conn|
+---------------------+
          |
          +------------------------+
          |                       |
          v                       v
+---------------------+   +---------------------+
| Form submit events  |   | Websocket msg event |
+---------------------+   +---------------------+
          |                       |
          v                       v
+---------------------+   +---------------------+
| Create and send     |   | Parse and route     |
| event objects       |   | event objects       |
+---------------------+   +---------------------+

*/
