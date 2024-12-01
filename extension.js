const vscode = require('vscode');
const { ReportsProvider } = require('./src/providers/reportsProvider');
const { ChatProvider } = require('./src/providers/chatProvider');
const { SecurityScanner } = require('./src/services/securityScanner');
const { ReportManager } = require('./src/services/reportManager');
const { ChatService } = require('./src/services/chatService');
const { AuthService } = require('./src/services/authService');
const { AuthCommands } = require('./src/commands/authCommands');
const { ChatCommands } = require('./src/commands/chatCommands');
const { ReportCommands } = require('./src/commands/reportCommands');

function activate(context) {
    // Initialize services
    const authService = new AuthService();
    const reportManager = new ReportManager();
    const securityScanner = new SecurityScanner();
    const chatService = new ChatService();

    // Initialize providers
    const reportsProvider = new ReportsProvider(reportManager);
    const chatProvider = new ChatProvider(chatService);

    // Initialize command handlers
    const authCommands = new AuthCommands(authService);
    const chatCommands = new ChatCommands(chatService, chatProvider, authService);
    const reportCommands = new ReportCommands(securityScanner, reportManager, reportsProvider, authService);

    // Register Tree Data Providers
    vscode.window.registerTreeDataProvider('securityReportsList', reportsProvider);
    vscode.window.registerTreeDataProvider('securityChat', chatProvider);

    // Register Commands
    let commands = [
        vscode.commands.registerCommand('security-reports.showReports', () => reportCommands.showReports()),
        vscode.commands.registerCommand('security-reports.runScan', () => reportCommands.runScan()),
        vscode.commands.registerCommand('security-reports.login', () => authCommands.login()),
        vscode.commands.registerCommand('security-reports.logout', () => authCommands.logout()),
        vscode.commands.registerCommand('security-reports.openChat', () => chatCommands.openChat()),
        vscode.commands.registerCommand('security-reports.sendMessage', () => chatCommands.sendMessage())
    ];

    context.subscriptions.push(...commands);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};