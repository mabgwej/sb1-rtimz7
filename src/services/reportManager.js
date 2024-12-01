const path = require('path');
const { FileSystem } = require('../utils/fileSystem');
const { Report } = require('../models/Report');
const { Logger } = require('../utils/logger');

class ReportManager {
    constructor() {
        this.reportsDir = path.join(__dirname, '../../reports');
    }

    async initialize() {
        try {
            await FileSystem.ensureDirectory(this.reportsDir);
        } catch (error) {
            Logger.error('Failed to initialize reports directory', error);
            throw error;
        }
    }

    async saveReport(report) {
        try {
            await this.initialize();
            const fileName = `report-${Date.now()}.json`;
            const filePath = path.join(this.reportsDir, fileName);
            
            await FileSystem.writeJsonFile(filePath, report);
            Logger.info(`Report saved successfully: ${fileName}`);
            
            return fileName;
        } catch (error) {
            Logger.error('Failed to save report', error);
            throw error;
        }
    }

    async getReports() {
        try {
            await this.initialize();
            const files = await FileSystem.listFiles(this.reportsDir, '.json');
            const reports = [];
            
            for (const file of files) {
                const filePath = path.join(this.reportsDir, file);
                const reportData = await FileSystem.readJsonFile(filePath);
                const report = new Report(reportData);
                reports.push(report.toTreeItem());
            }
            
            return reports.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            Logger.error('Failed to get reports', error);
            throw error;
        }
    }

    async getReportDetails(reportId) {
        try {
            const filePath = path.join(this.reportsDir, `${reportId}.json`);
            const reportData = await FileSystem.readJsonFile(filePath);
            return new Report(reportData);
        } catch (error) {
            Logger.error('Failed to get report details', error);
            throw error;
        }
    }
}

module.exports = { ReportManager };