const fs = require('fs').promises;
const path = require('path');

class FileSystem {
    static async ensureDirectory(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
        }
    }

    static async writeJsonFile(filePath, data) {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error(`Failed to write file ${filePath}: ${error.message}`);
        }
    }

    static async readJsonFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error.message}`);
        }
    }

    static async listFiles(dirPath, extension) {
        try {
            const files = await fs.readdir(dirPath);
            return files.filter(file => path.extname(file) === extension);
        } catch (error) {
            throw new Error(`Failed to list files in ${dirPath}: ${error.message}`);
        }
    }
}

module.exports = { FileSystem };