class Report {
    constructor(data) {
        this.id = data.id || `report-${Date.now()}`;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.name = data.name || 'Security Scan Report';
        this.results = data.results || [];
        this.summary = data.summary || this.generateSummary();
    }

    generateSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.status === 'PASSED').length;
        const failed = total - passed;
        
        return {
            total,
            passed,
            failed,
            severity: this.calculateOverallSeverity()
        };
    }

    calculateOverallSeverity() {
        const severityLevels = {
            'CRITICAL': 4,
            'HIGH': 3,
            'MEDIUM': 2,
            'LOW': 1
        };

        const highestSeverity = this.results.reduce((max, result) => {
            const currentLevel = severityLevels[result.severity] || 0;
            return currentLevel > max ? currentLevel : max;
        }, 0);

        return Object.keys(severityLevels).find(
            key => severityLevels[key] === highestSeverity
        ) || 'LOW';
    }

    toTreeItem() {
        return {
            name: this.name,
            date: this.timestamp,
            description: `Found ${this.summary.total} issues`,
            severity: this.summary.severity
        };
    }
}

module.exports = { Report };