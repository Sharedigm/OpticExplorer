/******************************************************************************\
|                                                                              |
|                             optics-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying image files.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Optics from '../../../../../../models/optics/optics.js';
import SplitView from '../../../../../../views/layout/split-view.js';
import OpticsViewportView from '../../../../../../views/apps/optic-editor/mainbar/viewports/optics-viewport-view.js';
import DataEditorView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/data-editor-view.js';

export default SplitView.extend({

	//
	// attributes
	//

	orientation: 'vertical',
	flipped: true,
	sizes: [75, 25],

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		SplitView.prototype.initialize.call(this);

		// make sure that we have a model
		//
		if (!this.model) {
			this.model = new Optics();
		}

		// set initial state
		//
		this.options.show_sidebar = this.options.preferences.get('show_data_editor');
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('mainbar')) {
			return this.getChildView('mainbar').hasSelected();
		}
	},

	//
	// getting methods
	//

	getZoom: function() {
		if (this.hasChildView('mainbar')) {
			return this.getChildView('mainbar').getZoom();
		}
	},

	getValue: function() {
		return this.getChildView('mainbar').toYaml();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'show_data_editor':
				this.setSideBarVisibility(value);
				break;
			case 'data_editor_bar_size':
				this.setSideBarSize(value);
				break;

			default:
				this.getChildView('mainbar').setOption(key, value);
		}
	},

	setZoom: function(zoom) {
		return this.getChildView('mainbar').setZoom(zoom);
	},

	setActive: function(active) {
		return this.getChildView('mainbar').setActive(active);
	},

	//
	// rendering methods
	//

	getSideBarView: function() {
		return new DataEditorView({
			model: this.model,

			// options
			//
			parent: this,

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		});
	},

	getContentView: function() {
		return new OpticsViewportView({
			model: this.model,
			parent: this,

			// optics options
			//
			theme: this.options.preferences.get('theme'),
			move_duration: this.options.preferences.get('move_duration'),

			// viewport options
			//
			show_grid: this.options.preferences.get('show_grid'),
			show_optical_axis: this.options.preferences.get('show_optical_axis'),
			show_perpendicular_axis: this.options.preferences.get('show_perpendicular_axis'),
			show_colored_viewport: this.options.preferences.get('show_colored_viewport'),

			// element options
			//
			show_elements: this.options.preferences.get('show_elements'),
			show_filled_elements: this.options.preferences.get('show_filled_elements'),
			show_stroked_elements: this.options.preferences.get('show_stroked_elements'),
			show_shaded_elements: this.options.preferences.get('show_shaded_elements'),
			show_illustrated_elements: this.options.preferences.get('show_illustrated_elements'),
			show_shadowed_elements: this.options.preferences.get('show_shadowed_elements'),

			// light options
			//
			show_lights: this.options.preferences.get('show_lights'),
			show_filled_lights: this.options.preferences.get('show_filled_lights'),
			show_stroked_lights: this.options.preferences.get('show_stroked_lights'),
			show_transmitted_lights: this.options.preferences.get('show_transmitted_lights'),
			show_obstructed_lights: this.options.preferences.get('show_obstructed_lights'),
			show_reflected_lights: this.options.preferences.get('show_reflected_lights'),

			// object options
			//
			show_objects: this.options.preferences.get('show_objects'),
			show_filled_objects: this.options.preferences.get('show_filled_objects'),
			show_stroked_objects: this.options.preferences.get('show_stroked_objects'),
			show_transmitted_objects: this.options.preferences.get('show_transmitted_objects'),
			show_obstructed_objects: this.options.preferences.get('show_obstructed_objects'),
			show_reflected_objects: this.options.preferences.get('show_reflected_objects'),

			// annotation options
			//
			show_annotations: this.options.preferences.get('show_annotations'),
			arrow_style: this.options.preferences.get('arrow_style'),
			label_style: this.options.preferences.get('label_style'),

			// optic annotation options
			//
			show_thickness: this.options.preferences.get('show_thickness'),
			show_spacing: this.options.preferences.get('show_spacing'),
			show_focal_points: this.options.preferences.get('show_focal_points'),
			show_principal_planes: this.options.preferences.get('show_principal_planes'),

			// callbacks
			//
			onmousemove: this.options.onmousemove,
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchangeselection: this.options.onchangeselection,
			onopen: this.options.onopen,
			ondropin: this.options.ondropin,
			onreorder: this.options.onreorder
		});
	},

	showOptics: function(optics) {

		// show in mainbar
		//
		if (this.hasChildView('mainbar')) {
			this.getChildView('mainbar').showOptics(optics);
		}

		// show in data editor
		//
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').showOptics(optics);
		}
	}
});