// require your server and launch it here

const server = require('./api/server')
require('colors')


const port = 8000;

server.use('/', (req, res) => {
    res.status(200).send(`\*** API is up and running on port ${port}`)
})

server.listen(port, () => console.log(`\n*** API is running on port ${port} ***`.bgGreen))