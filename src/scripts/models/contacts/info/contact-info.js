/******************************************************************************\
|                                                                              |
|                                contact-info.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a contact's personal address.                 |
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
	// converting methods
	//

	toVCF: function() {
		return this.constructor.JSONtoVCF(this.attributes);
	},

	fromVCF: function(lines) {
		this.set(this.constructor.VCFtoJSON(lines));
		return this;
	}
});
