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
	
	step: undefined,
	scale: 'linear',
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
		this.min = this.options.levels[0];
		this.max = this.options.levels[this.options.levels.length - 1];
		if (this.options.levels) {
			this.options.values = [];
			for (let i = 0; i < this.options.levels.length; i++) {
				this.options.values[i] = this.options.levels[i];
			}
		}
	},

	//
	// getting methods
	//

	getZoom: function() {
		let zoom = parseFloat(this.getValue());

		if (zoom && !isNaN(zoom)) {
			if (zoom < this.min) {
				return this.min;
			} else if (zoom > this.max) {
				return this.max;
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
