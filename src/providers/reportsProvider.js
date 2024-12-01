const vscode = require('vscode');
const { Logger } = require('../utils/logger');

class ReportsProvider {
    constructor(reportManager) {
        this._reportManager = reportManager;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return this._createTreeItem(element);
    }

    async getChildren(element) {
        try {
            if (!element) {
                const reports = await this._reportManager.getReports();
                return reports;
            }
            return [];
        } catch (error) {
            Logger.error('Failed to get reports', error);
            return [];
        }
    }

    _createTreeItem(report) {
        const treeItem = new vscode.TreeItem(
            report.name,
            vscode.TreeItemCollapsibleState.None
        );
        
        treeItem.tooltip = `${report.description}\nSeverity: ${report.severity}`;
        treeItem.description = new Date(report.date).toLocaleString();
        treeItem.iconPath = this._getIconForSeverity(report.severity);
        treeItem.command = {
            command: 'security-reports.openReport',
            title: 'Open Report',
            arguments: [report]
        };

        return treeItem;
    }

    _getIconForSeverity(severity) {
        const iconColor = {
            'CRITICAL': new vscode.ThemeColor('testing.iconFailed'),
            'HIGH': new vscode.ThemeColor('testing.iconErrored'),
            'MEDIUM': new vscode.ThemeColor('testing.iconSkipped'),
            'LOW': new vscode.ThemeColor('testing.iconPassed')
        };

        return new vscode.ThemeIcon('shield', iconColor[severity]);
    }
}

module.exports = { ReportsProvider };