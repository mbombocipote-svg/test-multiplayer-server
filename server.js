import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  // Aviso de nuevo usuario
  ws.send("✅ Bienvenido al chat!");

  ws.on("message", (msg) => {
    console.log("Mensaje recibido:", msg.toString());

    // Reenviar a TODOS menos al que lo envió
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => console.log("Cliente desconectado"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});
