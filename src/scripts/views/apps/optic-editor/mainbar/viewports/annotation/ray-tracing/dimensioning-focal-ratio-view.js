/******************************************************************************\
|                                                                              |
|                      dimensioning-focal-ratio-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for an annotation and markup element.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DimensioningArcView from '../../../../../../../views/svg/annotation/dimensioning/dimensioning-arc-view.js';

export default DimensioningArcView.extend({

	//
	// attributes
	//
	
	className: 'focal-ratio' + ' ' + DimensioningArcView.prototype.className,

	//
	// querying methods
	//

	getAngle: function(options) {
		return Math.abs(this.model.getAngle(options));
	},

	getFocalRatio: function() {
		return 1 / Math.tan(this.getAngle({
			units: 'radians'
		}) / 2) / 2;
	},

	getText: function() {
		return (this.options.text? this.options.text : '') + this.getFocalRatio().toPrecision(3);
	}
});