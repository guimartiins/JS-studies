const { readFile } = require('fs/promises')
const { error } = require('./constants')

const DEFAULT_OPTIONS = {
    maxLines: 3,
    fields: ['id', 'name', 'profession', 'age']
}

class File {
    static async csvToJson(path) {
        const content = await readFile(path, 'utf8')
        const validation = this.isValid(content, DEFAULT_OPTIONS)

        if(!validation.valid) {
            throw new Error(validation.error)
        }

        const result = this.parseCsvToJson(content)
        return result
    }

    static isValid(csvString, options) {
        const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/)

        if(!fileWithoutHeader.length || fileWithoutHeader.length > options.maxLines) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        const isHeaderValid = header === options.fields.join(',')
        if (!isHeaderValid) {
           return {
            error: error.FILE_FIELDS_ERROR_MESSAGE,
            valid: false
           }
        }

        return {
            error: null,
            valid: true
        }
    }

    static parseCsvToJson(csvString) {
        const lines = csvString.split(/\r?\n/)
        const firstLine = lines.shift()
        const header = firstLine.split(',')

        const json = lines.map(line => {
            const columns = line.split(',')
            let lineObj = {}

            for(const index in columns) {
                lineObj[header[index]] = columns[index].trim()
            }

            return lineObj
        })
        return json
    }
}

module.exports = File