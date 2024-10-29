/******************************************************************************\
|                                                                              |
|                           contact-organization.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a contact's organization.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {

		// who
		//
		company_name: undefined,

		// what
		//
		title: undefined
	},

	//
	// converting methods
	//

	toVCF: function() {
		return this.constructor.JSONtoVCF(this.attributes);
	},

	fromVCF: function(lines) {
		this.set(this.constructor.VCFtoJSON(lines));
		return this;
	}
}, {

	//
	// static methods
	//

	JSONtoVCF: function(json) {
		let lines = [];

		if (json.title) {
			lines.push('TITLE:' + json.title);
		}
		if (json.company_name) {
			lines.push('ORG:' + json.company_name);
		}

		return lines;
	},

	VCFtoJSON: function(lines) {
		let json = null;

		// parse lines
		//
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// break line into key value pairs
			//
			let pair = line.split(':');
			let key = pair[0];
			let value = pair[1];

			switch (key) {

				// parse title
				//
				case 'TITLE':
					if (!json) {
						json = {};
					}
					json.title = value;
					break;

				case 'ORG':
					if (!json) {
						json = {};
					}
					json.company_name = value;
					break;
			}
		}

		return json;
	},
});
