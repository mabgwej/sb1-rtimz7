const vscode = require('vscode');
const { Logger } = require('../utils/logger');

class ChatCommands {
    constructor(chatService, chatProvider, authService) {
        this.chatService = chatService;
        this.chatProvider = chatProvider;
        this.authService = authService;
    }

    async openChat() {
        try {
            if (!await this.authService.isAuthenticated()) {
                Logger.warning('Please login first');
                return;
            }

            await this.chatService.connect();
            this.chatProvider.refresh();
        } catch (error) {
            Logger.error('Failed to open chat', error);
        }
    }

    async sendMessage() {
        const message = await vscode.window.showInputBox({
            prompt: 'Type your message',
            placeHolder: 'Ask a question about security...'
        });

        if (message) {
            try {
                await this.chatService.sendMessage(message);
                this.chatProvider.refresh();
            } catch (error) {
                Logger.error('Failed to send message', error);
            }
        }
    }
}

module.exports = { ChatCommands };