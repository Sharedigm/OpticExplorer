/******************************************************************************\
|                                                                              |
|                                user-article.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's journal article publication.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPublication from '../../../../models/users/profile/user-publication.js';

export default UserPublication.extend({

	//
	// attributes
	//

	defaults: {

		// who
		//
		authors: undefined,

		// what
		//
		title: undefined,
		subjects: undefined,

		// when
		//
		date: undefined,

		// where
		//
		journal: undefined,
		publisher: undefined,
		city: undefined,
		state: undefined,
		country: undefined,

		// why / how
		//
		issn_number: undefined,
		url: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/articles',

	//
	// getting methods
	//

	getUrl: function() {
		if (this.has('url') && this.get('url') != '') {
			let url = this.get('url');

			// add protocol
			//
			if (url.startsWith('http')) {
				return url;
			} else {
				return 'http://' + url;
			}
		}
	},

	getLocation: function() {
		let name;
		if (this.has('city')) {
			name = this.get('city');
		}
		if (this.has('state')) {
			let state = this.get('state');
			if (name && state.length > 0) {
				name += ', ';
			}
			name += state;
		} else if (this.has('country')) {
			let country = this.get('country');
			if (country != 'United States') {
				if (name && country.length > 0) {
					name += ', ';
				}
				name += this.get('country');
			}
		}
		return name;
	},

	//
	// converting methods
	//

	toString: function() {
		let name = this.get('title');
		if (this.has('journal') && this.get('journal') != '') {
			name += ' in ' + this.get('journal');
		}
		return name;
	}
});
