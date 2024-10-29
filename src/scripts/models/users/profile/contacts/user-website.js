/******************************************************************************\
|                                                                              |
|                                user-website.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal website information.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserContact from '../../../../models/users/profile/user-contact.js';
import '../../../../utilities/scripting/string-utils.js';

export default UserContact.extend({

	//
	// attributes
	//

	defaults: {
		website_kind: undefined,
		protocol: 'http',
		url: undefined,
		order: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/websites',

	//
	// converting methods
	//

	toString: function() {
		return this.get('url');
	},

	toContactInfo: function() {
		let json = {};
		let protocol = this.get('protocol');
		let url = this.get('url');

		if (this.has('website_kind')) {
			json.website_kind  = this.get('website_kind');
		}
		
		// strip protocol from url
		//
		if (url.startsWith('http')) {
			url = url.replace('http://', '');
		} else if (url.startsWith('https')) {
			url = url.replace('https://', '');
		}

		json.url = (protocol + '://' + url || '');
		
		return json;
	},

	toVCF: function() {
		let line = '';
		let protocol = this.get('protocol');
		let url = this.get('url');

		line += 'URL';
		if (this.has('website_kind')) {
			line += ';TYPE=' + this.get('website_kind');
		}
		
		// strip protocol from url
		//
		if (url.startsWith('http')) {
			url = url.replace('http://', '');
		} else if (url.startsWith('https')) {
			url = url.replace('https://', '');
		}

		line += ':';
		line += (protocol + '://' + url || '');
		
		return line;
	},

	fromVCF: function(line) {
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

		// set attributes
		//
		this.set({
			'website_kind': kind,
			'url': value
		});

		return this;
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

	toVCF: function(json) {
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
	}
});
