const { ScanRule } = require('../models/ScanRule');
const { Report } = require('../models/Report');
const { Logger } = require('../utils/logger');

class SecurityScanner {
    constructor() {
        this.rules = [
            new ScanRule('SEC001', 'Dependency Check', 'HIGH', 'Scans for vulnerable dependencies'),
            new ScanRule('SEC002', 'Code Analysis', 'MEDIUM', 'Analyzes code for security issues'),
            new ScanRule('SEC003', 'Secret Detection', 'CRITICAL', 'Detects hardcoded secrets'),
            new ScanRule('SEC004', 'Configuration Check', 'MEDIUM', 'Validates security configurations')
        ];
    }

    async scan() {
        try {
            Logger.info('Starting security scan...');
            const results = await Promise.all(
                this.rules.map(rule => this._executeSingleRule(rule))
            );

            const report = new Report({
                name: `Security Scan ${new Date().toLocaleString()}`,
                results: results
            });

            Logger.info('Security scan completed successfully');
            return report;
        } catch (error) {
            Logger.error('Security scan failed', error);
            throw error;
        }
    }

    async _executeSingleRule(rule) {
        try {
            Logger.info(`Executing rule: ${rule.name}`);
            return await rule.execute();
        } catch (error) {
            Logger.error(`Rule execution failed: ${rule.name}`, error);
            throw error;
        }
    }
}

module.exports = { SecurityScanner };