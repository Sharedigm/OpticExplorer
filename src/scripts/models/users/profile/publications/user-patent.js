/******************************************************************************\
|                                                                              |
|                                 user-patent.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's patent publication.                  |
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
		patent_kind: undefined,
		title: undefined,
		subjects: undefined,

		// when
		//
		year: undefined,

		// where
		//
		country: undefined,

		// why / how
		//
		patent_number: undefined,
		url: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/patents',

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

	//
	// converting methods
	//

	toString: function() {
		let name = this.get('title');
		if (this.has('patent_kind') && this.get('patent_kind') != '') {
			name += ' as ' + this.get('patent_kind');
		}
		return name;
	}
});
