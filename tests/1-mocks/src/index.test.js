const {error} = require('./constants.js');
const File = require('./file.js');
const assert = require('assert');

(async () => {
    {
        const filePath = __dirname + '/mocks/empty-file-invalid.csv'
        const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)

        assert.rejects(result, expected)
    }

    {
        const filePath = __dirname + '/mocks/invalid-header.csv'
        const expected = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)

        assert.rejects(result, expected)
    }

    {
        const filePath = __dirname + '/mocks/five-items-invalid.csv'
        const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)

        assert.rejects(result, expected)
    }

    {
        const filePath = __dirname + '/mocks/three-items-valid.csv'
        const expected = [
            {
                id: '1',
                name: "alberto costa",
                profession: "developer",
                age: '25'
            },
            {
                id: '2',
                name: "matias da silva",
                profession: "driver",
                age: '30'
            },
            {
                id: '3',
                name: "vitor hugo de souza",
                profession: "barber",
                age: '26'
            }
        ]
        const result = await File.csvToJson(filePath)

         assert.deepStrictEqual(result, expected)
    }
})()