/******************************************************************************\
|                                                                              |
|                             gallery-item-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a single generic icon.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Items from '../../../collections/storage/items.js';
import ItemView from '../../../views/items/item-view.js';
import Browser from '../../../utilities/web/browser.js';

export default ItemView.extend({

	//
	// attributes
	//
	
	tagName: 'a',
	className: 'jpictura item',

	template: template(`
		<img src="<%= url %>"<% if (title) { %> data-toggle="tooltip" data-placement="bottom" title="<%= title %>"<% } %> />
	`),
	double_clickable: true,

	events: {
	
		// mouse events
		//
		'mousedown': 'onMouseDown',
		'click': 'onClick',
		'dblclick': 'onDoubleClick',
		'mousedown .loading': 'onClickLoading',
		'click .loading': 'onClickLoading',

		// selection events
		//
		'select': 'onSelect',
		'deselect': 'onDeselect',

		// touch events
		//
		'tap': 'onTap'
	},

	//
	// opening methods
	//

	openImage: function() {
		if (this.loading) {
			return;
		}
		this.loading = true;
		this.$el.addClass('loading');

		// add loading spinner
		//
		this.spinner = $('<div class="spinner"></div>');
		this.$el.append(this.spinner);

		// open image viewer
		//
		let selected = this.parent.getSelectedModels();
		this.parent.openImage(this.model, {
			collection: selected.length > 1? new Items(selected) : null,

			// callbacks
			//
			success: () => {
				this.$el.removeClass('loading');

				// remove loading spinner
				//
				this.spinner.remove();
				this.loading = false;
			}
		});	
	},

	//
	// rendering methods
	//
	
	templateContext: function() {
		return {
			resolution: this.getResolution(),
			url: this.getUrl(),
			title: this.getName()
		};
	},

	onRender: function() {

		// call superclass method
		//
		// ItemView.prototype.onRender.call(this);

		// set element attributes
		//
		let resolution = this.getResolution();
		if (resolution) {
			if (resolution[0]) {
				this.$el.attr('data-jpictura-width', resolution[0]);
			}
			if (resolution[1]) {
				this.$el.attr('data-jpictura-height', resolution[1]);
			}
		}

		if (this.options.lightbox) {
			this.$el.addClass('lightbox');
			this.$el.attr('ref', 'group1');
			this.$el.attr('href', this.model.getUrl());
			this.$el.attr('target', '_blank');
			this.$el.attr('title', this.model.getName());
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {
		if (Browser.is_touch_enabled) {
			return;
		}
		if (!this.options.lightbox) {
			this.block(event);
		}
	},

	onClick: function(event) {
		if (Browser.is_touch_enabled) {
			return;
		}
		if (!this.options.lightbox) {
			this.handleClick(event);
		}
	},

	onClickLoading: function(event) {
		this.block(event);
	},

	onDoubleClick: function(event) {
		this.handleClick(event);
	}
});