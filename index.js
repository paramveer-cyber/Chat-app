const server = require('socket.io')(process.env.PORT || 8000);
const users = {}

server.on('connection', socket=>{
    socket.on('join', name_=>{
        users[socket.id] = name_
        socket.broadcast.emit("user-joined",  name_)
    })
    socket.on("send", data=>{
        socket.broadcast.emit("recieve", data)
    })
    socket.on("disconnect", (reason) => {
        socket.broadcast.emit("user-disconnect", users[socket.id])
      });
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1024px-Flat_tick_icon.svg.png">
    <script defer src="./socket.io/socket.io.js"></script>
    <script defer>
      const socket = io("/", { transports: ['websocket', 'polling', 'flashsocket'] })
      let submit_button = document.getElementById("submit-btn")
      let name__ = prompt("Enter your name")
      let listener = ""
      const query = document.querySelector(".text")
      function prompt_(){
          if (document.hidden) {
          } else {
              if (name__ === null){
                  name__ = prompt("Enter your name") 
                  if (name__ == null){}
                  else{
                      socket.emit('join', name__)
                      document.removeEventListener('visibilitychange', prompt_)
                      console.log("removed")
                  }
              }
          }
      }
      document.addEventListener('visibilitychange', prompt_)
      function user_joined_msg(name){
          if (name==="Hello world!"){return 0}
          let element = document.createElement("div")
          element.innerText = name + " joined the chat"
          element.classList.add("user_msg")
          query.append(element)
      }
      function user_disconnect_msg(name){
          if (name==="Hello world!"){return 0}
          let element = document.createElement("div")
          element.innerText = name + " left the chat"
          element.classList.add("user_msg")
          query.append(element)
      }
      function send_msg(msg){
          let element = document.createElement("div")
          element.innerText = "You: " + msg
          element.classList.add("msg")
          element.classList.add("text2")
          query.append(element)
      }
      function receive_msg(name, msg){
          let element = document.createElement("div")
          element.innerText = name + ": " + msg
          element.classList.add("msg")
          element.classList.add("text1")
          query.append(element)
      }
      function send_click(event=null){
          try{event.preventDefault()}
          catch {}
          let mesg = document.getElementById("form-control")
          if (mesg.value === ""){
              return 0;
          }
          send_msg(mesg.value)
          socket.emit("send", [name__, mesg.value])
          mesg.value = ""
      }
      submit_button.addEventListener('click', ()=>{
          socket.emit("join", "Hello world!")
      })
      document.getElementById("submit-btn").addEventListener("click", (e)=>{
          send_click(e)
      })
      socket.on("recieve", data=>{
          receive_msg(data[0], data[1])
      })
      socket.on("user-joined", name=>{user_joined_msg(name)})
      socket.on("user-disconnect", name=>{user_disconnect_msg(name)})
      document.onkeypress =  (e)=> {
          console.log(e)
          if (e.code === "Enter"){
              send_click()
          }
      };
    </script>
    <style>
      .container{
        background-color: #191919;
        height: 90vh;
        width: 170vh;
        margin-top: 10px;
        font-family: 'cascadia code';
        border-radius: 12px;
        font-size: 20px;
    }

    .msg{
        background-color: #00ffff;
        border-radius: 8px;
        padding: 2.5px;
        margin: 7px;
        width: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .text1{
        clear: both;
        float: left;
    }
    .text2{
        clear: both;
        float: right;
    }
    .send__{
        display: flex;
        gap: 5px;
        position: absolute;
        bottom: 25px;
        width: 80%;
    }
    body{
        background-color: mediumaquamarine;
    }
    .text{
        width: 99%;
        height: 90%;
        overflow: auto;
    }
    ::-webkit-scrollbar {
        width: 10px;
      }
    ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #898989; 
    border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
    background: #999999; 
    border-radius: 10px;
    }
    .user_msg{
        clear: both;
        color: rgb(255, 255, 255);
        padding-left: 40%;
        width: 100%;
        background-color: rgba(161, 161, 161, 0.5);
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand text-white">Navbar</a>
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </nav>
      <div class="container">
        <div class="text" id="text">
          <div class="user_msg">You Joined the chat</div>
        </div>
        <div class="send__">
            <input class="form-control" type="text" id="form-control">
            <button class="btn btn-outline-light" id="submit-btn" type="submit">Send</button>
        </div>
      </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>

</body> 
</html>`

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
  res.type('html').send(html)
})
app.listen(port, () => {
})