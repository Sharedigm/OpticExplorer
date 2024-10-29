/******************************************************************************\
|                                                                              |
|                             contact-addresses.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of contact addresses.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContactAddress from '../../../models/contacts/info/contact-address.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: ContactAddress,

	//
	// converting methods
	//

	toVCF: function() {
		let lines = [];

		// add contact addresses to lines
		//
		for (let i = 0; i < this.length; i++) {
			lines.push(this.at(i).toVCF());
		}

		return lines;
	}
});
