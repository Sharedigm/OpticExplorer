/******************************************************************************\
|                                                                              |
|                                pager-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for navigation using page controls.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'pager',

	template: template(`
		<div class="items-per-page">
			<input class="title" size="<%= size %>" <% if (items_per_page > 0) { %>value="<%= items_per_page %>"<% } %>>
			<label class="title"><%= item_type %> / page</label>
		</div>
		
		<div class="btn-group">
			<button type="button" class="first btn" data-toggle="tooltip" title="First" data-placement="top"<% if (page_number == 1) { %> disabled<% } %>>
				<i class="fa fa-fast-backward"></i>
			</button>
		
			<button type="button" class="prev btn" data-toggle="tooltip" title="Prev" data-placement="top"<% if (page_number == 1) { %> disabled<% } %>>
				<i class="fa fa-backward"></i>
			</button>
		
			<input class="page-number" size="<%= size %>" value="<%= page_number %>" data-toggle="tooltip" title="Page #" data-placement="top">

			<input class="num-pages<% if (!num_pages) { %> hidden<% } %>" size="<%= size %>" value="/ <%= num_pages %>" readonly />
		
			<button type="button" class="next btn" data-toggle="tooltip" title="Next" data-placement="top">
				<i class="fa fa-forward"></i>
			</button>

			<button type="button" class="last btn<% if (!num_pages) { %> hidden<% } %>" data-toggle="tooltip" title="Last" data-placement="top">
				<i class="fa fa-fast-forward"></i>
			</button>
		</div>
	`),

	events: {
		'change .items-per-page input': 'onChangeItemsPerPage',
		'click .first': 'onClickFirst',
		'click .prev': 'onClickPrev',
		'change .page-number': 'onChangePageNumber',
		'click .next': 'onClickNext',
		'click .last': 'onClickLast'
	},

	itemsPerPage: 10,
	pageNumber: 1,
	numPages: undefined,
	itemType: 'items',
	size: 4,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.items_per_page != undefined) {
			this.itemsPerPage = this.options.items_per_page;
		}
		if (this.options.page_number != undefined) {
			this.pageNumber = this.options.page_number;
		}
		if (this.options.num_pages != undefined) {
			this.numPages = this.options.num_pages;
		}
		if (this.options.item_type != undefined) {
			this.itemType = this.options.item_type;
		}
	},

	//
	// getting methods
	//

	getItemsPerPage: function() {
		return parseInt(this.$el.find('.items-per-page input').val());
	},

	getPageNumber: function() {
		return parseInt(this.$el.find('.page-number').val());
	},

	getRange: function() {

		// get range limits
		//
		let pageNumber = this.getPageNumber();
		let itemsPerPage = this.getItemsPerPage();

		return {
			from: (pageNumber - 1) * itemsPerPage,
			to: pageNumber * itemsPerPage - 1
		};
	},

	//
	// setting methods
	//

	setItemsPerPage: function(itemsPerPage) {
		this.itemsPerPage = itemsPerPage;
		this.$el.find('.items-per-page input').val(itemsPerPage);
		this.update();
	},

	setPageNumber: function(pageNumber) {
		this.$el.find('.page-number').val(pageNumber);

		// enable / disable buttons
		//
		this.update();

		// perform callback
		//
		this.onChange(pageNumber);
	},

	setNumItems: function(numItems) {
		this.numItems = numItems;
		this.setNumPages(Math.ceil(numItems / this.itemsPerPage));
		this.update();
	},

	setNumPages: function(numPages) {
		this.numPages = numPages;
		this.$el.find('.num-pages').val('/ ' + numPages);

		// show num pages and last button
		//
		this.$el.find('.num-pages').removeClass('hidden');
		this.$el.find('.last').removeClass('hidden');
	},

	setNumPageItems: function(numPageItems) {
		this.$el.find('.next').prop('disabled', numPageItems < this.itemsPerPage);
		this.$el.find('.last').prop('disabled', numPageItems < this.itemsPerPage);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			items_per_page: this.itemsPerPage,
			page_number: this.pageNumber,
			num_pages: this.numPages,
			item_type: this.itemType,
			size: this.size
		};
	},

	onRender: function() {
		this.update();

		// add tooltip triggers
		//
		this.addTooltips({
			container: this.parent.$el
		});
	},

	update: function() {
		let pageNumber = this.getPageNumber();
		this.$el.find('.first').prop('disabled', pageNumber == 1);
		this.$el.find('.prev').prop('disabled', pageNumber == 1);
		this.$el.find('.next').prop('disabled', false);

		// check if we know the number of pages
		//
		if (this.numPages != undefined) {
			this.$el.find('.next').prop('disabled', pageNumber >= this.numPages);
			this.$el.find('.last').prop('disabled', pageNumber == this.numPages);
		}

		// check if buttons should be hidden
		//
		if (this.numItems < this.itemsPerPage) {
			this.$el.find('.btn-group').addClass('hidden');
		} else {
			this.$el.find('.btn-group').removeClass('hidden');
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.removeTooltips();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.getPageNumber());
		}
	},

	onChangeItemsPerPage: function() {
		let itemsPerPage = this.getItemsPerPage();

		// check validity
		//
		if (itemsPerPage <= 0) {
			itemsPerPage = 1;
		} else if (itemsPerPage > this.options.maxItemsPerPage) {
			itemsPerPage = this.options.maxItemsPerPage;
		} else if (isNaN(itemsPerPage)) {
			itemsPerPage = this.itemsPerPage;
		}

		// update
		//
		this.setItemsPerPage(itemsPerPage);
		if (this.numItems) {
			this.setNumItems(this.numItems);
		}
		this.onChange();
	},

	onClickFirst: function() {
		this.setPageNumber(1);
	},

	onClickPrev: function() {
		this.setPageNumber(this.getPageNumber() - 1);
	},

	onChangePageNumber: function() {
		let pageNumber = this.getPageNumber();
		if (pageNumber <= 0 || isNaN(pageNumber)) {
			this.setPageNumber(1);
		} else if (pageNumber > this.numPages) {
			this.setPageNumber(this.numPages);
		}
	},

	onClickNext: function() {
		this.setPageNumber(this.getPageNumber() + 1);
	},

	onClickLast: function() {
		this.setPageNumber(this.numPages);
	},
});