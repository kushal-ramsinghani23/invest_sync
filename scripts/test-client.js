// test-client.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server as: ", socket.id);
});

socket.on("disconnect", (socket) => {
    console.log("Disconnected from server");
});

socket.on("companyCreated", (data) => {
    console.log("Create Company broadcast: ", data);
})

socket.on("companyUpdated", (data) => {
    console.log("Update Company broadcast: ", data);
})

socket.on("companyDeleted", (data) => {
    console.log("Delete Company broadcast: ", data);
})