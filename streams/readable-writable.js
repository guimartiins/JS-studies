import {Readable, Writable} from 'stream';

const readable = new Readable({
    read() {
        this.push('some data');
        this.push('some data 2');
        this.push(null);
    }
})

const writable = new Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
})

readable.pipe(writable);