import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  ws.send("Hola! El servidor te ve 👀");

  ws.on("message", (msg) => {
    console.log("Recibido:", msg.toString());
    ws.send("Eco: " + msg.toString());
  });

  ws.on("close", () => console.log("Cliente desconectado"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});
