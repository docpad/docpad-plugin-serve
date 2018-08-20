'use strict'

const PluginTester = require('docpad-plugintester')

class ServeTester extends PluginTester {
	testCustom () {
		this.suite('serve', function (suite, test) {
			// @todo make this work
		})
	}
}

module.exports = ServeTester
