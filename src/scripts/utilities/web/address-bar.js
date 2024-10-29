/******************************************************************************\
|                                                                              |
|                                address-bar.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file contains some javascript utilities that are used to         |
|        deal with the browser address bar.                                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

function base(location) {
	let index;

	// get location before question mark symbol
	//
	index = location.indexOf('?');
	if (index != -1) {
		location = location.substr(0, index);
	}

	// get location before hash symbol
	//
	index = location.indexOf('#');
	if (index != -1) {
		location = location.substr(0, index);
	}

	return location;
}

function fragment(location) {

	// get location after hash mark symbol
	//
	if (location) {
		let strings = location.split('#');
		return strings[1];
	}
}

export default {

	// valid attributes for querying
	//
	attributes: [
		'location',
		'base',
		'fragment',
		'hash', 
		'host', 
		'hostname', 
		'href', 
		'origin', 
		'pathname', 
		'port', 
		'protocol'
	],

	//
	// getting methods
	//

	get: function(attribute) {
		switch (attribute) {
			case 'location':
				return window.top.location.href;
			case 'base':
				return base(window.top.location.href);
			case 'fragment':
				return fragment(window.top.location.href);
			default:
				return window.top.location[attribute];
		}
	},
	
	//
	// setting methods
	//

	set: function(location, options) {
		if (options && options.silent) {
			window.history.replaceState('', '', location);
		} else {
			window.top.location.href = location;
		}
	}
};