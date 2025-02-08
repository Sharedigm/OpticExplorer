/******************************************************************************\
|                                                                              |
|                               page-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a navigation toolbar.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import NumberInputView from '../../../../../views/forms/inputs/number-input-view.js';
import FirstButtonView from '../../../../../views/apps/pdf-viewer/header-bar/page-bar/buttons/first-button-view.js';
import PrevButtonView from '../../../../../views/apps/pdf-viewer/header-bar/page-bar/buttons/prev-button-view.js';
import NextButtonView from '../../../../../views/apps/pdf-viewer/header-bar/page-bar/buttons/next-button-view.js';
import LastButtonView from '../../../../../views/apps/pdf-viewer/header-bar/page-bar/buttons/last-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="first" data-toggle="tooltip" title="First" data-placement="top"></div>
		<div class="prev" data-toggle="tooltip" title="Prev" data-placement="top"></div>
		<div class="current" data-toggle="tooltip" title="Current" data-placement="top"></div> 
		<div class="num-items info-bar">/ <span class="total"><%= total %></span></div>
		<div class="next" data-toggle="tooltip" title="Next" data-placement="top"></div>
		<div class="last" data-toggle="tooltip" title="Last" data-placement="top"></div>
	`),

	regions: {
		first: '.first',
		prev: '.prev',
		current: '.current',
		next: '.next',
		last: '.last'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.pageNumber = this.options.pageNumber;
		this.numPages = this.options.numPages;
	},

	//
	// getting methods
	//

	getPageNumber: function() {
		if (this.hasChildView('current')) {
			return this.getChildView('current').getValue();
		}
	},

	//
	// setting methods
	//

	setPageNumber: function(pageNumber) {
		this.pageNumber = pageNumber;
		this.getChildView('current').setValue(pageNumber);
		this.update();
	},

	setNumPages: function(numPages) {
		this.numPages = numPages;
		this.$el.find('.total').html(numPages);
		this.getChildView('current').setMax(numPages);
		this.update();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			total: this.numPages
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('first', new FirstButtonView({
			model: this.model
		}));
		this.showChildView('prev', new PrevButtonView({
			model: this.model
		}));
		this.showChildView('current', new NumberInputView({

			// options
			//
			value: this.pageNumber, 
			max: this.numPages,

			// callbacks
			//
			onchange: () => this.parent.setPageNumber(this.getPageNumber())
		}));
		this.showChildView('next', new NextButtonView({
			model: this.model
		}));
		this.showChildView('last', new LastButtonView({
			model: this.model
		}));

		// initially hide nav bar
		//
		if (!this.model) {
			this.$el.hide();
		}
	},

	update: function() {

		// update child views
		//
		this.getChildView('first').onRender();
		this.getChildView('prev').onRender();
		this.getChildView('next').onRender();
		this.getChildView('last').onRender();

		// hide nav bar if one page or less
		//
		if (!this.numPages || this.numPages <= 1) {
			this.$el.hide();
		} else {
			this.$el.show();
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		let numPages = this.app.numPages();
		this.setPageNumber(1);
		this.setNumPages(numPages);
		this.setItemsEnabled(true);
		this.update();
	}
});
