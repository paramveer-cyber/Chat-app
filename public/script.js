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
    element.innerText = `${name} joined the chat`
    element.classList.add("user_msg")
    query.append(element)
}
function user_disconnect_msg(name){
    if (name==="Hello world!"){return 0}
    let element = document.createElement("div")
    element.innerText = `${name} left the chat`
    element.classList.add("user_msg")
    query.append(element)
}
function send_msg(msg){
    let element = document.createElement("div")
    element.innerText = `You: ${msg}`
    element.classList.add("msg")
    element.classList.add("text2")
    query.append(element)
}
function receive_msg(name, msg){
    let element = document.createElement("div")
    element.innerText = `${name}: ${msg}`
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