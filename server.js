import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ server });

// Guardamos los jugadores conectados
const players = new Map(); // ws -> {id, color}

wss.on("connection", (ws) => {
  console.log("Jugador conectado");

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch(e) {
      console.log("Mensaje inválido:", msg.toString());
      return;
    }

    // Guardar datos del jugador si es "join"
    if(data.type === "join") {
      players.set(ws, { id: data.id, color: data.color });
      console.log(`Jugador ${data.id} se unió con color ${data.color}`);
    }

    // Reenviar a todos los demás
    wss.clients.forEach(client => {
      if(client !== ws && client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    const p = players.get(ws);
    if(p) {
      console.log(`Jugador ${p.id} desconectado`);
      players.delete(ws);
      // avisar a los demás que se fue
      wss.clients.forEach(client => {
        if(client.readyState === ws.OPEN) {
          client.send(JSON.stringify({type:"leave", id: p.id}));
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});
