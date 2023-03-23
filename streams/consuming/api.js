import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto';
import { clearInterval } from 'timers';

const PORTS = {
    1: 3000,
    2: 4000,
}

function handler_one(req, res) {
    let count = 0;
    const maxItems = 99

    const readable = new Readable({
        read() {
            const everySecond = (intervalContext) => {
                if(count++ <= maxItems) {
                    this.push(JSON.stringify({
                        id: randomUUID(),
                        count: `count: ${count}`,
                        api: 1
                    }) + '\n')
                    return
                }
                clearInterval(intervalContext)
                this.push(null)
            }

            setInterval(function() {everySecond(this)})
        }
    })

    readable.pipe(res)
}

function handler_two(req, res) {
    let count = 0;
    const maxItems = 99

    const readable = new Readable({
        read() {
            const everySecond = (intervalContext) => {
                if(count++ <= maxItems) {
                    this.push(JSON.stringify({
                        id: randomUUID(),
                        count: `count: ${count}`,
                        api: 2
                    }) + '\n')
                    return
                }
                clearInterval(intervalContext)
                this.push(null)
            }

            setInterval(function() {everySecond(this)})
        }
    })

    readable.pipe(res)

}

http.createServer(handler_one).listen(PORTS[1], () => console.log(`Server running at http://localhost:${PORTS[1]}`))
http.createServer(handler_two).listen(PORTS[2], () => console.log(`Server running at http://localhost:${PORTS[2]}`))