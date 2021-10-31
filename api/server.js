// implement your server here
// require your posts router and connect it here
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const server = express()

const postsRouter = require('./posts/posts-router')

server.use(helmet())
server.use(cors())
server.use(morgan('dev'))
server.use(express.json())

server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
    res.status(200).json({
        status: 200, 
        message: 'API is running', 
        time: new Date().toLocaleTimeString()
    })
})












module.exports = server 