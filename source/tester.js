// @ts-nocheck
'use strict'

// Import
const fetch = require('node-fetch')
const { equal } = require('assert-helpers')
const PluginTester = require('docpad-plugintester')

class ServeTester extends PluginTester {
	testCustom() {
		const tester = this
		this.suite('serve', function (suite, test) {
			// url
			suite('server', function (suite, test) {
				const siteURL = tester.docpad.getPlugin('serve').url
				const url = siteURL + '/marked.html'
				test(url, function (done) {
					fetch(url)
						.then((r) => r.text())
						.then(function (content) {
							const actual = content.toString().trim()
							const expected = '<h1 id="hello">Hello</h1>'
							equal(
								actual,
								expected,
								'result from welcome URL contains expected content'
							)
							done()
						})
						.catch(done)
				})
			})
		})
	}
}

module.exports = ServeTester
