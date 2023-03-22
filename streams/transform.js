import {Readable, Writable, Transform} from 'stream';
import { createWriteStream } from 'fs';


function* generateData() {
    for(let index = 0; index < 1e6; index++) {
        const person = {id: Date.now() + index, name: `name-${index}`};
        const data = JSON.stringify(person);
        yield data;
    }
}



const readable = new Readable({
    read() {
        for (const data of generateData()) {
            this.push(data);
        }
        this.push(null)
    }
})


const mapFields = new Transform({
    transform(chunk, encoding, callback) {
        const person = JSON.parse(chunk.toString());
        const result = `${person.id},${person.name.toUpperCase()}\n`
        callback(null, result);
    }
}) 

const mapHeaders = new Transform({
    transform(chunk, encoding, callback) {
        this.counter = this.counter ?? 0;
        if(this.counter) {
            return callback(null, chunk);
        }

        this.counter++;
        callback(null, "id,name\n".concat(chunk))
    }
})

const writable = new Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
})

readable
    .pipe(mapFields)
    .pipe(mapHeaders)
    .pipe(createWriteStream('output.csv'))