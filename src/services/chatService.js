const vscode = require('vscode');
const io = require('socket.io-client');
const { Logger } = require('../utils/logger');

class ChatService {
    constructor() {
        this._socket = null;
        this._onMessageReceived = new vscode.EventEmitter();
        this.onMessageReceived = this._onMessageReceived.event;
    }

    async connect() {
        try {
            if (this._socket) {
                return;
            }

            this._socket = io('wss://security-bot-service.example.com', {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            });

            this._socket.on('connect', () => {
                Logger.info('Connected to chat service');
            });

            this._socket.on('message', (message) => {
                this._onMessageReceived.fire(message);
            });

            this._socket.on('error', (error) => {
                Logger.error('Chat service error', error);
            });

            this._socket.on('disconnect', () => {
                Logger.warning('Disconnected from chat service');
            });
        } catch (error) {
            Logger.error('Failed to connect to chat service', error);
            throw error;
        }
    }

    async sendMessage(message) {
        try {
            if (!this._socket?.connected) {
                await this.connect();
            }

            this._socket.emit('message', {
                content: message,
                timestamp: new Date().toISOString(),
                type: 'user'
            });
        } catch (error) {
            Logger.error('Failed to send message', error);
            throw error;
        }
    }

    disconnect() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
        }
    }
}

module.exports = { ChatService };