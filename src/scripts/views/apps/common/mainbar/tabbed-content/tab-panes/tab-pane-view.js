/******************************************************************************\
|                                                                              |
|                               tab-pane-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying tab panes.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'tab-pane',

	template: template(`
		<div class="tab-content"></div>
	`),

	attributes: {
		'role': 'tabpanel'
	},

	regions: {
		content: {
			el: '.tab-content',
			replaceElement: true
		}
	},

	//
	// querying methods
	//

	id: function() {
		return 'tab-pane' + (this.options.index);
	},

	isActive: function() {
		return this.$el.hasClass('active');
	},

	hasTab: function() {
		return this.parent.parent.hasTabView(this.getIndex());
	},

	//
	// getting methods
	//

	getIndex: function() {
		return this.options.index;
	},

	getTab: function() {
		return this.parent.parent.getTabView(this.getIndex());
	},

	//
	// setting methods
	//

	setActive: function(active) {

		// update tab pane view
		//
		if (active) {
			this.toTop();
			this.$el.addClass('active');
			this.$el.focus();
		} else {
			this.$el.removeClass('active');
		}

		// update child views
		//
		if (this.hasChildView('content') && this.getChildView('content').setActive) {
			this.getChildView('content').setActive(active);
		}
	},

	setOption: function(key, value) {
		this.getChildView('content').setOption(key, value);
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {

		// set attributes
		//
		if (model) {
			this.model = model;
		}

		// check if file requires loading
		//
		if (model && model.isNew()) {
			this.onLoad();
			return;
		}

		// read text file contents
		//
		this.readFile(model, {

			// callbacks
			//
			success: (data) => {
				this.onLoad();

				// perform callback
				//
				if (options && options.success) {
					options.success(data);
				}
			}
		});
	},

	//
	// reading methods
	//

	readFile: function(file) {
		file.read({

			// callbacks
			//
			success: (text) => {
				this.getParentView('app').parseFile(file, text, {

					// callbacks
					//
					success: (model) => {

						// update views
						//
						if (this.hasChildView('content')) {
							this.getChildView('content').setModel(model);
						}

						this.onLoad();
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not read file.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showContent();
	},

	showContent: function() {
		this.showChildView('content', this.getContentView());
	},

	onAttach: function() {

		// set initial state
		//
		if (this.options.active) {
			this.setActive(true);
		}
	},

	toTop: function() {
		let parent = this.$el.parent();
		let element = this.$el.detach();
		parent.append(element);
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.loaded = true;

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onActivate: function() {

		// activate tab content
		//
		if (this.hasChildView('content')) {
			if (this.getChildView('content').onActivate) {
				this.getChildView('content').onActivate();
			}
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// resize tab content
		//
		if (this.hasChildView('content')) {
			if (this.getChildView('content').onResize) {
				this.getChildView('content').onResize(event);
			}
		}
	}
});