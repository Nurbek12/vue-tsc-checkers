import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { join } from 'path'
import { config } from 'dotenv'

config()

const app = express()
const http = createServer(app)
const io = new Server(http)

class Game {
    // id: string
    white: string = ''
    black: string = ''
    constructor(public id: string){
        Math.random()>0.5?
            this.white = id:
            this.black = id;
    }
}

let rooms: Game[] = []
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(join(__dirname, '../front/dist')))
app.get('*', async (_, res) => res.sendFile(join(__dirname, '../front/dist/index.html')))


io.on('connection', (socket: Socket) => {
    socket.emit('send-room', rooms)
    socket.emit('send-my-id', socket.id)
    socket.on('create-room', () => {
        const newRoom = new Game(socket.id)
        rooms.push(newRoom)
        socket.join(socket.id)
        socket.emit('get-created-room', newRoom)
        io.emit('send-room', rooms)
    })
    socket.on('move', (i: number, p: number, name: string, a: boolean | undefined) => io.to(name).emit('movement', i, p, a))
    socket.on('move-d', (i: number, p: number, name: string) => io.to(name).emit('movement-d', i, p))
    socket.on('atack', (i: number, p: number, name: string) => io.to(name).emit('atacked', i, p))
    socket.on('join-room', (id: string) => {
        socket.join(id)
        const room: Game = rooms.find(game => game.id === id)!
        if(room.black) room.white = socket.id
        else room.black = socket.id
        io.to(id).emit('get-created-room', room)
    })
    socket.on('disconnect', () => {
        if(rooms.find(r=>r.id===socket.id)){
            rooms = rooms.filter(id => id.id !== socket.id)
            io.emit('send-room', rooms)
        }
    })
})

http.listen(process.env.PORT || 5000, () => console.log('server start...'))