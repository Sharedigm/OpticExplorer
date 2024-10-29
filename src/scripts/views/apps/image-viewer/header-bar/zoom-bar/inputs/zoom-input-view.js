/******************************************************************************\
|                                                                              |
|                                zoom-input-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a particular type of toolbar input.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import RangeInputView from '../../../../../../views/forms/inputs/range-input-view.js';

export default RangeInputView.extend({

	//
	// attributes
	//
	
	min: 10,
	max: 800,
	scale: 'logarithmic',
	className: 'selectable input',

	//
	// constructor
	//

	initialize: function(options) {

		// call superclass constructor
		//
		RangeInputView.prototype.initialize.call(this, options);

		// set attributes
		//
		if (this.options.levels) {
			this.options.values = [];
			for (let i = 0; i < this.options.levels.length; i++) {
				this.options.values[i] = this.options.levels[i] + '%';
			}
		}
	},

	//
	// getting methods
	//

	getZoom: function() {
		let zoom = parseFloat(this.getValue());
		let minZoom = this.parent.zoomLevels[0];
		let zoomLevels = this.parent.zoomLevels.length;
		let maxZoom = this.parent.zoomLevels[zoomLevels - 1];

		if (zoom && !isNaN(zoom)) {
			if (zoom < minZoom) {
				return minZoom;
			} else if (zoom > maxZoom) {
				return maxZoom;
			} else {
				return zoom;
			}
		} else {
			return this.zoom;
		}
	},

	//
	// setting methods
	//

	setOption: function(option) {
		let zoom = parseInt(option.replace('%', ''));
		this.parent.zoomTo(zoom);
	},

	//
	// event handling methods
	//

	onChange: function() {
		let zoom = this.getZoom();
		if (zoom) {

			// update zoom
			//
			this.zoom = zoom;
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.zoom);
		}
	}
});
