import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface Options {
    server: Server;
    path?: string, //* WS
}


export class WssService {

    private static _instance: WssService;
    private wss: WebSocketServer;

    private constructor(options: Options) {
        const { server, path = '/ws' } = options;

        this.wss = new WebSocketServer({ server, path });
        this.start();

    }

    public static get instance(): WssService {
        if (!WssService._instance) {
            throw 'WssService is not initialized';
        }
        return WssService._instance;
    }

    public static initWss(options: Options) {
        WssService._instance = new WssService(options);
    }

    public sendMessage(type: string, payload: Object) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type, payload}))
            }
        })
    }



    public start() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log("Client connected");
            ws.on('close', () => {
                console.log('Client disconnected')
            })
        });
    }

}