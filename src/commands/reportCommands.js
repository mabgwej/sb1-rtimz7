const { Logger } = require('../utils/logger');

class ReportCommands {
    constructor(securityScanner, reportManager, reportsProvider, authService) {
        this.securityScanner = securityScanner;
        this.reportManager = reportManager;
        this.reportsProvider = reportsProvider;
        this.authService = authService;
    }

    showReports() {
        this.reportsProvider.refresh();
    }

    async runScan() {
        try {
            if (!await this.authService.isAuthenticated()) {
                Logger.warning('Please login first');
                return;
            }

            Logger.info('Starting security scan...');
            const results = await this.securityScanner.scan();
            await this.reportManager.saveReport(results);
            this.reportsProvider.refresh();
            Logger.info('Security scan completed successfully!');
        } catch (error) {
            Logger.error('Scan failed', error);
        }
    }
}

module.exports = { ReportCommands };