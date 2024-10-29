/******************************************************************************\
|                                                                              |
|                               unit-settable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a type of checking behavior.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Units from '../../../utilities/math/units.js';

export default {

	//
	// getting methods
	//

	getUnits: function(selector) {
		let value = this.$el.find(selector + ' input').val();
		let units = this.$el.find(selector + ' .units').val();
		if (value != '') {
			value = parseFloat(value);
		} else {
			value = 0;
		}
		return new Units(value, units);
	},

	//
	// setting methods
	//

	setUnits: function(selector, units, options) {
		let value = units.toStr(options);
		this.$el.find(selector + ' input').val(value);
		this.$el.find(selector + ' span').text(value);
		this.$el.find(selector + ' units').val(units.units);
	}
};