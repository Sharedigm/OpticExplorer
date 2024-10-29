/******************************************************************************\
|                                                                              |
|                              contact-website.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a contacts's personal website url.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContactInfo from '../../../models/contacts/info/contact-info.js';

export default ContactInfo.extend({

	//
	// attributes
	//

	defaults: {
		website_kind: undefined,
		protocol: 'http',
		url: undefined
	}
}, {

	//
	// static methods
	//

	getProtocol: function(url) {

		// determine protocol from url
		//
		if (url.startsWith('https')) {
			return 'https';
		} else {
			return 'http';
		}
	},

	getUrl: function(href) {

		// return url without protocol
		//
		if (href.startsWith('https://')) {
			return href.replace('https://', '');
		} else if (href.startsWith('http://')) {
			return href.replace('http://', '');
		} else {
			return href;
		}
	},

	JSONtoVCF: function(json) {
		let line = '';
		let url = json.url;

		line += 'URL';
		if (json.website_kind) {
			line += ';TYPE=' + json.website_kind;
		}
		
		// strip protocol from url
		//
		if (url.startsWith('http')) {
			url = url.replace('http://', '');
		} else if (url.startsWith('https')) {
			url = url.replace('https://', '');
		}

		line += ':';
		line += url;
		
		return line;	
	},

	VCFtoJSON: function(line) {
		let pair = line.split(':');
		let key = pair[0];
		let value = pair.slice(1).join(':');
		let kind;

		// parse website type
		//
		if (key.contains('TYPE=')) {
			pair = key.split('TYPE=');
			kind = pair[1];
		}

		return {
			'website_kind': kind,
			'url': value
		};
	}
});
