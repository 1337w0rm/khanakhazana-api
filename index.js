const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, (error) => {
	if(!error)
		logger.info(`The server is running on PORT ${config.PORT}`)
	else
		logger.error('Error occured, server can not started', error)
})
