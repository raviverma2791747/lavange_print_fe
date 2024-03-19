import { io } from "socket.io-client";

const socket = io("ws://localhost:3132");


socket.on("connect", () => {
    console.log("connected");
});

export default socket;