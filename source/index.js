/* eslint class-methods-use-this:0 */
'use strict'

// External
const BasePlugin = require('docpad-baseplugin')
const handler = require('serve-handler')
const http = require('http')
const hostenv = require('hostenv')

// Define plugin
class ServePlugin extends BasePlugin {
	get name () {
		return 'serve'
	}

	get initialConfig () {
		return {
			listenOptions: {
				port: hostenv.PORT || 9778,
				host: hostenv.HOSTNAME || null
			},
			serveOptions: {}
		}
	}

	constructor (...args) {
		super(...args)
		this.serverClientError = this.serverClientError.bind(this)
		this.serverError = this.serverError.bind(this)
	}

	runAfter (opts, next) {
		// Add the server if the action is run
		this.createServer(next)

		// Chain
		return this
	}

	serverClientError (err) {
		this.docpad.warn(err)
		return this
	}

	serverError (err) {
		this.docpad.error(err)
		return this
	}

	createServer (next) {
		const config = this.getConfig()
		const { listenOptions } = config
		const serveOptions = Object.assign({
			public: this.docpad.getConfig().outPath
				.replace(process.cwd(), '').trim('/').trim('\\') // workaround until https://github.com/zeit/serve-handler/pull/50 merges
		}, config.serveOptions || {})

		if (this.server) {
			this.destroyServer(function (err) {
				if (err) next(err)
				this.createServer(next)
			})
			return this
		}

		this.docpad.log('info', 'Starting the server...')
		this.server = http.createServer(function (request, response) {
			handler(request, response, serveOptions)
		})
		this.server.on('error', this.serverError)
		this.server.on('clientError', this.serverClientError)
		this.server.listen(listenOptions, () => {
			const { port, address } = this.server.address()
			const host = address === '::' ? '0.0.0.0' : address
			this.docpad.log('info', `...server started on http://${host}:${port}`)
			next()
		})

		return this
	}

	destroyServer (next) {
		if (this.server) {
			this.docpad.log('info', 'Shutting down the server...')
			this.server.off('error', this.serverError)
			this.server.off('clientError', this.serverClientError)
			this.server.close((...args) => {
				this.docpad.log('info', '...shutdown down the server')
				next(...args)
			})
			this.server = null
		}
		else {
			next()
		}

		return this
	}

	docpadDestroy (opts, next) {
		this.destroyServer(next)
		return this
	}
}

module.exports = ServePlugin
