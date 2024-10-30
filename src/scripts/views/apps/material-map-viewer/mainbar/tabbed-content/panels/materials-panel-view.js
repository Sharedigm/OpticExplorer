/******************************************************************************\
|                                                                              |
|                           materials-panel-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying materials.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Materials from '../../../../../../collections/optics/materials/materials.js';
import Elements from '../../../../../../collections/optics/elements/elements.js';
import SplitView from '../../../../../../views/layout/split-view.js';
import AbbeDiagramView from '../../../../../../views/apps/material-map-viewer/mainbar/abbe-diagram/abbe-diagram-view.js';
import DataEditorView from '../../../../../../views/apps/material-map-viewer/mainbar/data-editor/data-editor-view.js';

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
		if (!this.collection) {
			this.collection = new Materials();
		}
		if (!this.elements) {
			this.elements = new Elements();
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

	setScale: function(scale) {
		return this.getChildView('mainbar').setScale(scale);
	},

	setActive: function(active) {
		return this.getChildView('mainbar').setActive(active);
	},

	setElements: function(elements) {
		this.getChildView('mainbar').addLensMarkers(elements);
		this.getChildView('sidebar').setElements(elements);
	},

	//
	// rendering methods
	//

	getSideBarView: function() {
		return new DataEditorView({
			collection: this.collection,
			elements: this.elements,

			// options
			//
			parent: this
		});
	},

	getContentView: function() {
		return new AbbeDiagramView({
			collection: this.collection,
			elements: this.elements,

			// options
			//
			theme: this.options.preferences.get('theme'),
			move_duration: this.options.preferences.get('move_duration'),
			parent: this,

			// viewport options
			//
			show_grid: this.options.preferences.get('show_grid'),
			show_abbe_axis: this.options.preferences.get('show_abbe_axis'),
			show_index_axis: this.options.preferences.get('show_index_axis'),
			show_colored_viewport: this.options.preferences.get('show_colored_viewport'),

			// diagram options
			//
			show_regions: this.options.preferences.get('show_regions'),
			show_edges: this.options.preferences.get('show_edges'),
			show_vertices: this.options.preferences.get('show_vertices'),
			show_labels: this.options.preferences.get('show_labels'),
			show_shading: this.options.preferences.get('show_shading'),
			show_shadows: this.options.preferences.get('show_shadows'),

			// callbacks
			//
			onmousemove: this.options.onmousemove,
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropin: this.options.ondropin
		});
	}
});