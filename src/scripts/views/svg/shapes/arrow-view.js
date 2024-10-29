/******************************************************************************\
|                                                                              |
|                                arrow-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for an annotation and markup element.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import LineView from '../../../views/svg/shapes/line-view.js';

export default LineView.extend({

	//
	// attributes
	//

	className: 'arrow',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		LineView.prototype.initialize.call(this);

		// set attributes
		//
		if (this.options.dimensioning) {
			this.className = 'dimensioning arrow';
		}
	}
});