// @ts-nocheck
/* eslint class-methods-use-this:0 */
'use strict'

// External
const BasePlugin = require('docpad-baseplugin')
const handler = require('serve-handler')
const http = require('http')
const hostenv = require('hostenv')

// Define plugin
class ServePlugin extends BasePlugin {
	get name() {
		return 'serve'
	}

	get initialConfig() {
		return {
			listenOptions: {},
			serveOptions: {},
		}
	}

	// Create the server
	docpadReady(opts, next) {
		this.createServer(opts, next)
	}
	createServer(opts, next) {
		// prepare
		const me = this
		const config = this.getConfig()
		const { docpad } = this
		const docpadConfig = docpad.getConfig()

		if (this.server) {
			this.destroyServer(function (err) {
				if (err) return next(err)
				this.createServer(opts, next)
			})
			return this
		}

		// start
		docpad.log('info', 'Starting the server...')
		this.server = http.createServer(function (request, response) {
			// it is here, as on tracis, out path is false if done earlier
			const outPath = docpad.getPath('out')
			const serveOptions = {
				public: outPath,
				...config.serveOptions,
			}
			docpad.log('debug', 'request:', request.url, serveOptions)
			return handler(request, response, serveOptions)
		})
		this.server.on('error', this.docpad.error)
		this.server.on('clientError', this.docpad.warn)

		// get the port and hostname
		opts = {
			port: docpadConfig.port || hostenv.PORT || 9778,
			host:
				docpadConfig.host || docpadConfig.hostname || hostenv.HOSTNAME || null,
			...config.listenOptions,
			...opts,
		}

		// start listening on the server
		this.server.listen(opts, () => {
			// fetch
			const { port, address } = this.server.address()
			const host = address === '::' ? '0.0.0.0' : address
			// apply
			me.port = port
			me.address = address
			me.host = host
			me.url = `http://${host}:${port}`
			// log
			this.docpad.log('info', `...server started on ${me.url}`)
			next()
		})
	}

	// Destroy the server
	docpadDestroy(opts, next) {
		this.destroyServer(opts, next)
	}
	destroyServer(opts, next) {
		const me = this
		if (this.server) {
			this.docpad.log('info', 'Shutting down the server...')
			this.server.close((...args) => {
				// remove
				this.server.removeAllListeners()

				// reset
				me.server = me.url = me.host = me.address = me.port = false

				// log
				this.docpad.log('info', '...shutdown down the server')
				next(...args)
			})
		} else {
			next()
		}
	}
}

module.exports = ServePlugin
