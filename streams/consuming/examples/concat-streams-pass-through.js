import {Writable, PassThrough} from 'stream';

import axios from 'axios';
const API_01 = 'http://localhost:3000';
const API_02 = 'http://localhost:4000';

const requests = await Promise.all([
    axios({
        method: 'get',
        url: API_01,
        responseType: 'stream'
    }),
    axios({
        method: 'get',
        url: API_02,
        responseType: 'stream'
    })
])

const result = requests.map(({data}) => data)

const output = new Writable({
    write(chunk, _encoding, callback) {
        const data = chunk.toString().replace(/\n/, '')
        const counter = data.match(/"count: (?<counter>.*)(?:",)/).groups.counter
        console.log(`${counter} - ${data}`)
        callback()
    }
})

function merge(streams) {
    return streams.reduce((prev, current, _index, items) => {
        current.pipe(prev, {end: false})
        current.on('end', () => items.every( s => s.ended) && prev.end())
        return prev
    }, new PassThrough())
}
 
const streams = merge(result).pipe(output)