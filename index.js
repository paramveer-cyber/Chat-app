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
    <script defer src="http://localhost:8000/socket.io/socket.io.js"></script>
    <script defer src="script.js"></script>
    <link rel="stylesheet" href="style.css">
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
</html>
`

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
  res.type('html').send(html)
})
app.listen(port, () => {
})