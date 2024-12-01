const vscode = require('vscode');

class Logger {
    static info(message) {
        console.log(message);
        vscode.window.showInformationMessage(message);
    }

    static error(message, error) {
        const errorMessage = error ? `${message}: ${error.message}` : message;
        console.error(errorMessage);
        vscode.window.showErrorMessage(errorMessage);
    }

    static warning(message) {
        console.warn(message);
        vscode.window.showWarningMessage(message);
    }
}

module.exports = { Logger };