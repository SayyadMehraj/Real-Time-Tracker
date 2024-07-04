
import express from "express";  //Express is used for the routing purposes
import { createServer } from "http"; //It used to the server
import { Server } from "socket.io"; // It is used to create a real-time connection

import { dirname,join } from 'path';
import { fileURLToPath } from 'url';

const app = express()
const server = createServer(app);
const io = new Server(server);

app.set("view engine","ejs");

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname,"public"))) 


io.on("connection",(socket) => {
    socket.on("send-location",(locationInfo) => {
        io.emit("receive-location",{id:socket.id,...locationInfo})
    })

    socket.on("disconnect",() => {
        io.emit("user-disconnected",socket.id)
    })

    console.log("Connected Successfully");
})



app.get("/",(req,res) => {
    res.render("index")
})

const port = 3000

server.listen(port,() => {
    console.log("Listening on the port",port);
})