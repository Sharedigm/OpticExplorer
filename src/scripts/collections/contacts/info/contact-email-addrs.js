/******************************************************************************\
|                                                                              |
|                            contact-email-addrs.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of contact email addresses.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContactEmailAddr from '../../../models/contacts/info/contact-email-addr.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: ContactEmailAddr,

	//
	// converting methods
	//

	toVCF: function() {
		let lines = [];

		// add email addrs to lines
		//
		for (let i = 0; i < this.length; i++) {
			lines.push(this.at(i).toVCF());
		}

		return lines;
	}
});
