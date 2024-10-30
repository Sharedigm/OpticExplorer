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

import Element from '../../../../../models/optics/elements/element.js';
import Surface from '../../../../../models/optics/elements/surfaces/surface.js';
import Material from '../../../../../models/optics/materials/material.js';
import Light from '../../../../../models/optics/lights/light.js';
import BaseObject from '../../../../../models/optics/objects/base-object.js';
import Materials from '../../../../../collections/optics/materials/materials.js';
import BaseView from '../../../../../views/base-view.js';
import Scrollable from '../../../../../views/behaviors/layout/scrollable.js';
import ElementsListView from '../../../../../views/apps/optic-editor/mainbar/data-editor/elements-list/elements-list-view.js';
import SurfacesListView from '../../../../../views/apps/optic-editor/mainbar/data-editor/surfaces-list/surfaces-list-view.js';
import MaterialsListView from '../../../../../views/apps/optic-editor/mainbar/data-editor/materials-list/materials-list-view.js';
import LightsListView from '../../../../../views/apps/optic-editor/mainbar/data-editor/lights-list/lights-list-view.js';
import ObjectsListView from '../../../../../views/apps/optic-editor/mainbar/data-editor/objects-list/objects-list-view.js';
import Browser from '../../../../../utilities/web/browser.js';
import '../../../../../../vendor/bootstrap/js/tab.js';

export default BaseView.extend(_.extend({}, Scrollable, {

	//
	// attributes
	//

	className: 'data-editor',

	template: template(`
		<ul class="nav nav-tabs flush" role="tablist">
			<li role="presentation" id="elements-tab<%= index %>" class="active">
				<a href="#elements-pane<%= index %>" aria-controls="elements" role="tab" data-toggle="tab">
					<i class="fa fa-database rotated flipped"></i>
					<label>Elements</label>
				</a>
			</li>

			<li role="presentation" id="surfaces-tab<%= index %>">
				<a href="#surfaces-pane<%= index %>" aria-controls="surfaces" role="tab" data-toggle="tab">
					<i class="fa fa-step-backward"></i>
					<label>Surfaces</label>
				</a>
			</li>

			<li role="presentation" id="materials-tab<%= index %>">
				<a href="#materials-pane<%= index %>" aria-controls="materials" role="tab" data-toggle="tab">
					<i class="fa fa-gem"></i>
					<label>Materials</label>
				</a>
			</li>

			<li role="presentation" id="lights-tab<%= index %>">
				<a href="#lights-pane<%= index %>" aria-controls="lights" role="tab" data-toggle="tab">
					<i class="fa fa-lightbulb"></i>
					<label>Lights</label>
				</a>
			</li>

			<li role="presentation" id="objects-tab<%= index %>" class="hidden-xs">
				<a href="#objects-pane<%= index %>" aria-controls="objects" role="tab" data-toggle="tab">
					<i class="fa fa-arrow-up-long"></i>
					<label>Objects</label>
				</a>
			</li>
		</ul>

		<div class="tab-content">
			<div role="tabpanel" id="elements-pane<%= index %>" class="tab-pane active">
				<div id="elements-list"></div>
			</div>
			
			<div role="tabpanel" id="surfaces-pane<%= index %>" class="tab-pane">
				<div id="surfaces-list"></div>
			</div>

			<div role="tabpanel" id="materials-pane<%= index %>" class="tab-pane">
				<div id="materials-list"></div>
			</div>

			<div role="tabpanel" id="lights-pane<%= index %>" class="tab-pane">
				<div id="lights-list"></div>
			</div>

			<div role="tabpanel" id="objects-pane<%= index %>" class="tab-pane">
				<div id="objects-list"></div>
			</div>
		</div>

		<label id="error" class="error" style="display:none">This field is required.</label>
	`),

	regions: {
		elements: '#elements-list',
		surfaces: '#surfaces-list',
		materials: '#materials-list',
		lights: '#lights-list',
		objects: '#objects-list'
	},

	//
	// constructor
	//

	initialize: function() {

		// index is used to create unique ids for tabs
		//
		this.index = this.constructor.count++;

		// listen to collection for changes
		//
		this.listenTo(this.model.elements, 'add', this.onAdd);
		this.listenTo(this.model.elements, 'remove', this.onRemove);
		this.listenTo(this.model.elements, 'reorder', this.onReorder);
	},

	//
	// setting methods
	//

	setActiveTab: function(tab) {
		this.$el.find('li.active').removeClass('active');
		this.$el.find('#' + tab + '-tab' + this.index).addClass('active');
		this.$el.find('.tab-pane.active').removeClass('active');
		this.$el.find('#' + tab + '-pane' + this.index).addClass('active');
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
		this.showOptics(this.model);
	},

	showOptics: function(optics) {
		this.stopListening(this.model.elements);

		// get optics surfaces
		//
		this.model = optics;
		this.collection = this.model.elements.getSurfaces();

		// listen to elements
		//
		this.listenTo(this.model.elements, 'add', this.onAdd);
		this.listenTo(this.model.elements, 'remove', this.onRemove);
		this.listenTo(this.model.elements, 'reorder', this.onReorder);

		// show subviews
		//
		this.showElementsList();
		this.showSurfacesList();
		this.showMaterialsList();
		this.showLightsList();
		this.showObjectsList();
	},

	showElementsList: function() {
		this.showChildView('elements', new ElementsListView({
			collection: this.model.elements,

			// options
			//
			viewport: this.options.viewport,
			show_numbering: !Browser.is_safari,
			sort: false,
			flush: true,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (view) => this.onSelect(view),
			ondeselect: (view) => this.onDeselect(view),
			onreorder: (model, index) => this.onReorder(model, index)
		}));
	},

	showSurfacesList: function() {
		this.showChildView('surfaces', new SurfacesListView({
			collection: this.model.elements.getSurfaces(),

			// options
			//
			viewport: this.options.viewport,
			show_numbering: true,
			flush: true,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (view) => this.onSelect(view),
			ondeselect: (view) => this.onDeselect(view)
		}));
	},

	showMaterialsList: function() {
		this.showChildView('materials', new MaterialsListView({
			collection: new Materials(this.model.elements.getUniqueMaterials()),

			// options
			//
			elements: this.model.elements,
			show_numbering: true,
			flush: true,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	showLightsList: function() {
		this.showChildView('lights', new LightsListView({
			collection: this.model.lights,

			// options
			//
			show_numbering: true,
			flush: true,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (view) => this.onSelect(view),
			ondeselect: (view) => this.onDeselect(view)
		}));
	},

	showObjectsList: function() {
		this.showChildView('objects', new ObjectsListView({
			collection: this.model.objects,

			// options
			//
			show_numbering: true,
			flush: true,

			// callbacks
			//
			onchange: () => this.onChange(),
			onselect: (view) => this.onSelect(view),
			ondeselect: (view) => this.onDeselect(view)
		}));
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
		return this.getChildView('elements').isValid() &&
			this.getChildView('surfaces').isValid();
	},

	//
	// event handling methods
	//

	onAdd: function() {
		this.showSurfacesList();
	},

	onRemove: function() {
		this.showSurfacesList();
	},

	onChange: function() {

		// check for errors
		//
		if (!this.getChildView('elements').isValid()) {

			// show error message
			//
			this.showError(this.getChildView('elements').validate());
		} else if (!this.getChildView('surfaces').isValid()) {

			// show error message
			//
			this.showError(this.getChildView('surfaces').validate());
		} else {

			// hide error message
			//
			this.hideError();
		}
	},

	onSelect: function(item) {

		// show appropriate tab
		//
		if (item.model instanceof Element) {
			this.setActiveTab('elements');
		} else if (item.model instanceof Surface) {
			this.setActiveTab('surfaces');
		} else if (item.model instanceof Material) {
			this.setActiveTab('materials');
		} else if (item.model instanceof Light) {
			this.setActiveTab('lights');
		} else if (item.model instanceof BaseObject) {
			this.setActiveTab('objects');
		}

		this.scrollToView(item, {
			margin: 3
		});

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect();
		}
	},

	onDeselect: function() {

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect();
		}
	},

	onReorder: function(model, index) {

		// reorder collection
		//
		if (model) {
			let preferences = this.getParentView('app').preferences;
			if (index != model.getIndex()) {
				
				// reorder elements
				//
				model.setIndex(index, {
					duration: preferences.get('move_duration'),
				});
			}
		}

		// re-render surface list view
		//
		this.showSurfacesList();
	}
}), {

	//
	// static attributes
	//

	count: 0
});