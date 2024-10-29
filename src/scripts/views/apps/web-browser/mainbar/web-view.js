/******************************************************************************\
|                                                                              |
|                                 web-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for browsing the web.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import Url from '../../../../utilities/web/url.js';
import Browser from '../../../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'web',
	tagName: 'iframe',
	template: template(''),
	referrerpolicy: 'no-referrer',
	sandbox: 'allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts',

	//
	// browser attributes
	//

	use_proxy: true,
	check_iframes: false,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.url != undefined) {
			this.url = this.options.url;
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			case 'url':
				this.loadUrl(value);
				break;
		}
	},
	
	//
	// loading methods
	//

	loadUrl: function(url) {

		// add protocol
		//
		if (!url.startsWith('http')) {
			url = 'http://' + url;
		}

		// clear previous content
		//
		// this.$el.find('iframe').remove();

		// check headers to see if iframes are allowed
		//
		if (this.check_iframes) {
			this.checkIFrames(url);
		} else {
			this.loadFrame(url);
		}
	},

	loadFrame: function(src) {
		this.$el.on('load', (event) => {
			this.onLoad(event);
		});
		this.$el.attr('src', src);
	},

	checkIFrames: function(url) {
		$.ajax({
			url: this.use_proxy? config.servers.api + '/proxy/headers?url=' + Url.encode(url) : url,

			// callbacks
			//
			success: (headers) => {
				if (!headers || Browser.xFramesAllowed(headers)) {

					// load content into frame
					//
					this.loadFrame(url);
				} else if (this.options.useProxy) {

					// load proxied content into frame
					//
					this.loadFrame(this.use_proxy? config.servers.api + '/proxy?url=' + Url.encode(url) : url);
				} else {

					// iframes not allowed
					//
					this.loadFrame('about:blank');
					this.onError('This web site does not allow frames.');
				}
			},

			error: (event) => {

				// diagnose error
				//
				if (event && event.status == '404') {
					this.onError('This web page could not be found.');
				} else {
					this.onError('This web page could not be loaded');
				}
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// load source from url
		//
		if (this.url) {
			this.loadUrl(this.url);
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onError: function(message) {

		// perform callback
		//
		if (this.options.onerror) {
			this.options.onerror(message);
		}
	}
});