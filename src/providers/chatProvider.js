const vscode = require('vscode');
const { marked } = require('marked');
const { Logger } = require('../utils/logger');

class ChatProvider {
    constructor(chatService) {
        this._chatService = chatService;
        this._messages = [];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;

        this._chatService.onMessageReceived(message => {
            this._messages.push(message);
            this._onDidChangeTreeData.fire();
        });
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        const treeItem = new vscode.TreeItem(
            this._formatMessagePreview(element),
            vscode.TreeItemCollapsibleState.None
        );

        treeItem.tooltip = this._formatMessageTooltip(element);
        treeItem.iconPath = this._getMessageIcon(element);
        treeItem.command = {
            command: 'security-reports.openChatMessage',
            title: 'View Message',
            arguments: [element]
        };

        return treeItem;
    }

    getChildren() {
        return this._messages;
    }

    _formatMessagePreview(message) {
        const preview = message.content.substring(0, 50);
        return preview.length < message.content.length ? `${preview}...` : preview;
    }

    _formatMessageTooltip(message) {
        return `${message.type === 'user' ? 'You' : 'Bot'} - ${new Date(message.timestamp).toLocaleString()}\n\n${message.content}`;
    }

    _getMessageIcon(message) {
        return new vscode.ThemeIcon(
            message.type === 'user' ? 'account' : 'hubot'
        );
    }

    async showChatMessage(message) {
        try {
            const panel = vscode.window.createWebviewPanel(
                'chatMessage',
                'Chat Message',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = this._getChatMessageWebviewContent(message);
        } catch (error) {
            Logger.error('Failed to show chat message', error);
        }
    }

    _getChatMessageWebviewContent(message) {
        const messageHtml = marked(message.content);
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { padding: 20px; }
                    .message { margin-bottom: 20px; }
                    .metadata { color: #666; font-size: 0.9em; }
                    .content { margin-top: 10px; }
                    code { background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
                    pre { background-color: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
                </style>
            </head>
            <body>
                <div class="message">
                    <div class="metadata">
                        <strong>${message.type === 'user' ? 'You' : 'Security Bot'}</strong>
                        <span> - ${new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="content">
                        ${messageHtml}
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

module.exports = { ChatProvider };