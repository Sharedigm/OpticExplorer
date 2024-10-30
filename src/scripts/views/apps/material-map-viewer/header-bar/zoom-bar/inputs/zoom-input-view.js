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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import RangeInputView from '../../../../../../views/forms/inputs/range-input-view.js';

export default RangeInputView.extend({

	//
	// attributes
	//
	
	min: 10,
	max: 1000,
	scale: 'logarithmic',
	className: 'selectable input',

	//
	// attributes
	//

	template: template(`
		<% if (input) { %>
		<% if (!values) { %>
		<input type="text" value="<%= value != undefined? value : min %>" style="width:<%= size %>em">
		<% } else { %>
		<div class="input-group">
			<input type="text" value="<%= value != undefined? value : min %>" style="width:<%= size %>em">
			<div class="input-group-btn">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu dropdown-menu-right" style="min-width:<%= values[values.length - 1].toString().length %>em">
				<% for (let i = 0; i < values.length; i++) { %>
					<li><a value="<%= values[i] %>"><%= labels[i] %></a></li>
				<% } %>
				</ul>
			</div>
		</div>
		<% } %>
		<% } %>
		
		<% if (slider) { %>
		<input type="range" class="hidden-xs" min="<%= min %>" max="<%= max %>" <% if (step != undefined) { %> step="<%= step %>"<% } %>value="<%= range != undefined? range : min %>" />
		<% } %>
	`),

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
			this.options.labels = [];
			for (let i = 0; i < this.options.levels.length; i++) {
				this.options.values[i] = this.options.levels[i];
				this.options.labels[i] = this.zoomToString(this.options.levels[i]);
			}
		}

		this.value = 100;
	},

	//
	// converting methods
	//

	zoomToString: function(zoom) {
		let magnification = zoom / 100;

		if (magnification < 0.1) {
			magnification = Math.round(magnification * 1000) / 1000;
		} else if (magnification < 1) {
			magnification = Math.round(magnification * 100) / 100;
		} else if (magnification < 10) {
			magnification = Math.round(magnification * 10) / 10;
		} else if (magnification < 100) {
			magnification = Math.round(magnification);
		} else {
			magnification = Math.round(magnification / 10) * 10;
		}

		return magnification.toString() + 'X';
	},

	valueToInput: function(value) {
		if (this.step) {
			return this.zoomToString(Math.round(value / this.step) * this.step);
		} else {
			return this.zoomToString(Math.round(value));
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
		let zoom = parseFloat(option.replace('%', ''));
		this.parent.zoomTo(zoom);
	},

	setNumber: function(value) {
		this.$el.find('input[type="text"]').val(this.zoomToString(value));
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			min: this.min,
			max: this.max,
			step: this.step || 'any',
			value: this.valueToInput(this.value),
			range: this.valueToRange(this.value),
			size: this.numChars(this.zoomToString(this.max)),
			values: this.options.values,
			labels: this.options.labels,
			slider: this.options.slider,
			input: this.options.input
		};
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
