const vscode = require('vscode');
const keytar = require('keytar');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor() {
        this.SERVICE_NAME = 'security-reports-extension';
        this.ACCOUNT_NAME = 'platform-dashboard';
    }

    async login(username, password) {
        try {
            const response = await this._authenticateWithPlatform(username, password);
            await this._storeToken(response.token);
            return true;
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    async logout() {
        try {
            await keytar.deletePassword(this.SERVICE_NAME, this.ACCOUNT_NAME);
            return true;
        } catch (error) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    async getToken() {
        try {
            return await keytar.getPassword(this.SERVICE_NAME, this.ACCOUNT_NAME);
        } catch (error) {
            throw new Error(`Failed to retrieve token: ${error.message}`);
        }
    }

    async isAuthenticated() {
        try {
            const token = await this.getToken();
            if (!token) return false;
            
            const decoded = jwt.decode(token);
            return decoded && decoded.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }

    async _authenticateWithPlatform(username, password) {
        // Simulated platform authentication
        return {
            token: jwt.sign(
                { username, exp: Math.floor(Date.now() / 1000) + (60 * 60) },
                'secret'
            )
        };
    }

    async _storeToken(token) {
        await keytar.setPassword(this.SERVICE_NAME, this.ACCOUNT_NAME, token);
    }
}

module.exports = { AuthService };