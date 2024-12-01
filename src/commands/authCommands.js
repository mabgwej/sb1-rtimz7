const vscode = require('vscode');
const { Logger } = require('../utils/logger');

class AuthCommands {
    constructor(authService) {
        this.authService = authService;
    }

    async login() {
        try {
            const username = await vscode.window.showInputBox({
                prompt: 'Enter your username',
                placeHolder: 'Username'
            });

            const password = await vscode.window.showInputBox({
                prompt: 'Enter your password',
                password: true
            });

            if (username && password) {
                await this.authService.login(username, password);
                Logger.info('Successfully logged in!');
            }
        } catch (error) {
            Logger.error('Login failed', error);
        }
    }

    async logout() {
        try {
            await this.authService.logout();
            Logger.info('Successfully logged out!');
        } catch (error) {
            Logger.error('Logout failed', error);
        }
    }
}

module.exports = { AuthCommands };