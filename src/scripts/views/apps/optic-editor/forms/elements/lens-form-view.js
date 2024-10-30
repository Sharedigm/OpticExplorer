/******************************************************************************\
|                                                                              |
|                                 lens-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying lens element attributes.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import LensElementFormView from '../../../../../views/apps/optic-editor/forms/elements/lens-element-form-view.js';
import SurfaceFormView from '../../../../../views/apps/optic-editor/forms/surfaces/surface-form-view.js';
import LensMaterialFormView from '../../../../../views/apps/optic-editor/forms/materials/lens-material-form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>
		
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation"<% if (tab == "element") { %> class="active"<% } %>>
				<a href="#element-panel" aria-controls="element-panel" role="tab" data-toggle="tab"><i class="fa fa-database rotated flipped"></i>Element</a>
			</li>
		
			<li role="presentation"<% if (tab == "front") { %> class="active"<% } %>>
				<a href="#front-panel" aria-controls="front-panel" role="tab" data-toggle="tab"><i class="fa fa-step-backward"></i>Front Surface</a>
			</li>
		
			<li role="presentation"<% if (tab == "back") { %> class="active"<% } %>>
				<a href="#back-panel" aria-controls="back-panel" role="tab" data-toggle="tab"><i class="fa fa-step-forward"></i>Back Surface</a>
			</li>
		
			<li role="presentation"<% if (tab == "material") { %> class="active"<% } %>>
				<a href="#material-panel" aria-controls="material-panel" role="tab" data-toggle="tab"><i class="fa fa-gem"></i>Material</a>
			</li>
		</ul>
		
		<div class="tab-content">
			<div role="tabpanel" id="element-panel" class="tab-pane<% if (tab == 'element' || !tab) { %> active<% } %>">
			</div>
		
			<div role="tabpanel" id="front-panel" class="tab-pane<% if (tab == 'front') { %> active<% } %>">
			</div>
			
			<div role="tabpanel" id="back-panel" class="tab-pane<% if (tab == 'back') { %> active<% } %>">
			</div>
		
			<div role="tabpanel" id="material-panel" class="tab-pane<% if (tab == 'material') { %> active<% } %>">
			</div>
		</div>
	`),

	regions: {
		'element-panel': '#element-panel',
		'front-panel': '#front-panel',
		'back-panel': '#back-panel',
		'material-panel': '#material-panel'
	},

	events: {
		'click .nav-tabs a': 'onClickTab'
	},

	//
	// form methods
	//

	apply: function() {
		return this.getChildView('element-panel').apply() &&
			this.getChildView('front-panel').apply() &&
			this.getChildView('back-panel').apply() &&
			this.getChildView('material-panel').apply();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab || 'element'
		};
	},

	onRender: function() {
		this.showElement();
		this.showSurfaces();
		this.showMaterial();
		this.showTab();
	},

	showElement: function() {
		this.showChildView('element-panel', new LensElementFormView({
			model: this.model,
			collection: this.collection,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	showSurfaces: function() {
		this.showChildView('front-panel', new SurfaceFormView({
			model: this.model.front,

			// options
			//
			viewport: this.options.viewport,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
		this.showChildView('back-panel', new SurfaceFormView({
			model: this.model.back,

			// options
			//
			viewport: this.options.viewport,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	showMaterial: function() {
		this.showChildView('material-panel', new LensMaterialFormView({
			model: this.model,

			// options
			//
			viewport: this.options.viewport,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	showTab: function() {

		// show selected tab
		//
		if (this.options.tab) {
			this.$el.find('.nav-tabs a[href="#' + this.options.tab + '"]').tab('show');
		}
	},

	flip: function() {
		this.showSurfaces();
	},

	//
	// form validation methods
	//

	isValid: function() {
		return this.getChildView('element-panel').isValid() && 
			this.getChildView('front-panel').isValid() && 
			this.getChildView('back-panel').isValid();
	},

	//
	// event handling methods
	//

	onChange: function() {

		// validate form
		//
		this.validate();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onClickTab: function(event) {
		let href = $(event.target).attr('href');
		switch (href) {
			case '#element-panel':
				this.model.front.trigger('deselect');
				this.model.back.trigger('deselect');
				this.model.trigger('select');
				break;
			case '#front-panel':
				this.model.trigger('deselect');
				this.model.back.trigger('deselect');
				this.model.front.trigger('select');
				break;
			case '#back-panel':
				this.model.trigger('deselect');
				this.model.front.trigger('deselect');
				this.model.back.trigger('select');
				break;
		}
	}
});
