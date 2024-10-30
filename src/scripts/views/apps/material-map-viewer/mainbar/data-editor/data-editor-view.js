/******************************************************************************\
|                                                                              |
|                             data-editor-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing optics lens data info.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Material from '../../../../../models/optics/materials/material.js';
import Element from '../../../../../models/optics/elements/element.js';
import Materials from '../../../../../collections/optics/materials/materials.js';
import Elements from '../../../../../collections/optics/elements/elements.js';
import BaseView from '../../../../../views/base-view.js';
import Scrollable from '../../../../../views/behaviors/layout/scrollable.js';
import MaterialsListView from '../../../../../views/apps/material-map-viewer/mainbar/data-editor/materials-list/materials-list-view.js';
import ElementsListView from '../../../../../views/apps/material-map-viewer/mainbar/data-editor/elements-list/elements-list-view.js';
import Browser from '../../../../../utilities/web/browser.js';
import '../../../../../../vendor/bootstrap/js/tab.js';

export default BaseView.extend(_.extend({}, Scrollable, {

	//
	// attributes
	//

	className: 'data-editor',

	template: template(`
		<ul class="nav nav-tabs flush" role="tablist">
			<li role="presentation" id="map-materials-tab<%= index %>" class="active">
				<a href="#map-materials-pane<%= index %>" aria-controls="materials" role="tab" data-toggle="tab">
					<i class="fa fa-gem"></i>Materials
				</a>
			</li>

			<li role="presentation" id="elements-tab<%= index %>">
				<a href="#map-elements-pane<%= index %>" aria-controls="elements" role="tab" data-toggle="tab">
					<i class="fa fa-database rotated flipped"></i>Elements
				</a>
			</li>
		</ul>

		<div class="tab-content">
			<div role="tabpanel" id="map-materials-pane<%= index %>" class="tab-pane active">
				<div id="materials-list"></div>
			</div>

			<div role="tabpanel" id="map-elements-pane<%= index %>" class="tab-pane">
				<div id="elements-list"></div>
			</div>
		</div>

		<label id="error" class="error" style="display:none">This field is required.</label>
	`),

	regions: {
		materials: '#materials-list',
		elements: '#elements-list'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.elements = this.options.elements || new Elements();

		// index is used to create unique ids for tabs
		//
		this.index = this.constructor.count++;
	},

	//
	// setting methods
	//

	setActiveTab: function(tab) {
		this.$el.find('li.active').removeClass('active');
		this.$el.find('#map-' + tab + '-tab' + this.index).addClass('active');
		this.$el.find('.tab-pane.active').removeClass('active');
		this.$el.find('#map-' + tab + '-pane' + this.index).addClass('active');
	},

	setElements: function(elements) {
		this.collection = new Materials(elements.getUniqueMaterials());
		this.elements = elements;
		this.onRender();
	},

	addElements: function(elements) {
		this.elements.add(elements);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			index: this.index
		};
	},

	onRender: function() {

		// show subviews
		//
		this.showMaterialsList();
		this.showElementsList();
	},

	showMaterialsList: function() {
		this.showChildView('materials', new MaterialsListView({
			collection: this.collection,

			// options
			//
			viewport: this.options.viewport,
			show_numbering: true,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (view) => this.onSelect(view),
			ondeselect: (view) => this.onDeselect(view),
			onopen: (item) => this.onOpen(item)
		}));

		// remove rounded corners
		//
		this.getChildView('materials').$el.addClass('flush');
	},

	showElementsList: function() {
		this.showChildView('elements', new ElementsListView({
			collection: this.elements,

			// options
			//
			viewport: this.options.viewport,
			show_numbering: !Browser.is_safari,
			sort: false,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (view) => this.onSelect(view),
			ondeselect: (view) => this.onDeselect(view)
		}));

		// remove rounded corners
		//
		this.getChildView('elements').$el.addClass('flush');
	},

	showError: function(error) {
		this.$el.find('#error').html(error).show();
	},

	hideError: function() {
		this.$el.find('#error').hide();
	},

	//
	// validation methods
	//

	isValid: function() {
		return this.getChildView('materials').isValid() && this.getChildView('elements').isValid();
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (!this.getChildView('elements').isValid()) {

			// show error message
			//
			this.showError(this.getChildView('elements').validate());
		} else {

			// hide error message
			//
			this.hideError();
		}
	},

	onSelect: function(item) {

		// show appropriate tab
		//
		if (item.model instanceof Material) {
			this.setActiveTab('materials');
		} else if (item.model instanceof Element) {
			this.setActiveTab('elements');
		}

		this.scrollToView(item, {
			margin: 3
		});

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function() {

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect();
		}
	},

	onOpen: function(item) {

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	}
}), {

	//
	// static attributes
	//

	count: 0
});