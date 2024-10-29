/******************************************************************************\
|                                                                              |
|                              contat-websites.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of contact websites.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContactWebsite from '../../../models/contacts/info/contact-website.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: ContactWebsite,

	//
	// converting methods
	//

	toVCF: function() {
		let lines = [];

		// add websites to lines
		//
		for (let i = 0; i < this.length; i++) {
			lines.push(this.at(i).toVCF());
		}

		return lines;
	}
});
