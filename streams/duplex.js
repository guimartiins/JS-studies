import {Duplex} from 'stream'

let count = 0

const server = new Duplex({
    objectMode: true, // it'll works with string instead of buffer, but it'll cost more memory
    read() {
        const everySecond = (intervalContext) => {
            if(count++ <= 5) {
                this.push(`My name is Gui[${count}]\n`)
                return
            }

            clearInterval(intervalContext)
            this.push(null)
        }

        setInterval(function() {everySecond(this)})

    },
    /**
     * write doesn't share the same channel of read,
     * we can see running server.pipe(process.stdout) 
     * and server.write('Hello World') at the same time
     */
    write(chunk, encoding, callback) {
        console.log(`[writable] saving`, chunk)
        callback()
    }
})

// write calls the writable of duplex
server.write('[duplex] hey this is a writable!')

server.on('data', msg => console.log(`[readable] received: ${msg}`))

