import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { v4 } from 'uuid'
import { defaultSocketState, GlobalState } from "@/lib/types"
import { shortUUID } from '@/lib/utils';

const server = createServer();
const io = new Server(server, {

    cors: { origin: 'http://localhost:3000' }
});


interface Connection {
    socket: Socket;
    id: string;
};

const connections: Connection[] = [];

let state = JSON.parse(JSON.stringify(defaultSocketState)) as GlobalState;

io.on('connection', (socket: Socket) => {
    const id = v4();

    connections.push({
        socket,
        id
    });

    console.log("New connection: ", shortUUID(id), " | ", connections.length);

    socket.on("ready", () => {
        console.log("Client is ready");
        socket.emit("update", state);
    })

    socket.on('disconnect', () => {
        const index = connections.findIndex((connection: Connection) => connection.id === id);
        if (index > -1) {
            connections.splice(index, 1);
        }
        console.log("Disconnected: ", shortUUID(id), " | ", connections.length);
    });

    socket.on('update', (data: GlobalState) => {
        console.log("Update from client");
        state = JSON.parse(JSON.stringify(data)) as GlobalState;
        emit('update', state, id);
    });

    socket.on("trigger", (data: string) => {
        console.log("trigger", data);
        emit('trigger', data, id);
    })

});



const emit = (event: string, data: unknown, ...ignore: string[]) => {
    connections.forEach(({ socket, id }: Connection) => {
        if (!ignore.includes(id)) socket.emit(event, data);
    });
};



server.listen(3001)
console.log("listening port 3001")