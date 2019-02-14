import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message } from './model/message.model';
import { Room } from './model/room.model';

export class ChatServer {
    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    private rooms = [];
    private histories = [];

    constructor() {
        this.config();
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private sockets(): void {
        this.io = socketIo(this.server);
        // this.chatSpace = this.io.of('/chat');
        // this.roomSpace = this.io.of('/room');
    }


    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log(socket.id, "connected.");

            socket.on('create', (room: Room) => {
                console.log('[server](create): %s', JSON.stringify(room));
                this.io.emit('create', room);
                this.rooms.push(room);
            });

            socket.on('roomlist', () => {
                this.io.emit('roomlist', this.rooms);
            });

            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));

                if (m.action === 0) {
                    socket.join(m.roomId);
                    this.histories[m.roomId] = this.histories[m.roomId] || [];
                    socket.emit('roomhistory', this.histories[m.roomId]);
                    console.log('Joined room %s.', m.roomId);
                } else if (m.action === 1) {
                    socket.leave(m.roomId);
                }

                this.io.to(m.roomId).emit('message', m);
                this.histories[m.roomId].push(m);
            });

            socket.on('disconnect', (reason) => {
                console.log(socket.id, "disconnected.");
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}