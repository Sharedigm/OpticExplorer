/******************************************************************************\
|                                                                              |
|                                  contacts.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of contacts.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Contact from '../../models/contacts/contact.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Contact
});