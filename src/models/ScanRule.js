class ScanRule {
    constructor(id, name, severity, description) {
        this.id = id;
        this.name = name;
        this.severity = severity;
        this.description = description;
    }

    async execute() {
        try {
            // Simulate rule execution
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                ruleId: this.id,
                ruleName: this.name,
                severity: this.severity,
                status: 'PASSED',
                details: `Executed ${this.name} successfully`,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                ruleId: this.id,
                ruleName: this.name,
                severity: this.severity,
                status: 'FAILED',
                details: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = { ScanRule };