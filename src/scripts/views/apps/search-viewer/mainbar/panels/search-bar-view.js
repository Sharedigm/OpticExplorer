/******************************************************************************\
|                                                                              |
|                              search-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing a collection of plots.           |
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

	className: 'search-bar',

	template: template(`
		<div class="input well">
			<span contenteditable="true" contentEditable="plaintext-only"><%= query %></span>
			<div class="buttons">
				<button class="submit success btn btn-sm" data-toggle="tooltip" title="Search" data-placement="top"><i class="fa fa-search"></i></button>
				<button class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top"><i class="fa fa-xmark"></i></button>
			</div>
		</div>
	`),

	events: {
		'paste [contenteditable="true"]': 'onPasteText',
		'click .submit': 'onClickSubmitText',
		'click .clear': 'onClickClearText',
		'keydown': 'onKeyDown'
	},

	//
	// getting methods
	//

	getQuery: function() {
		return this.$el.find('[contenteditable="true"]').html();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'target':
				this.$el.attr('class', value + ' ' + this.className);
				break;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			query: this.options.query
		}
	},

	onRender: function() {

		// set initial state
		//
		if (this.options.preferences) {
			this.setOption('target', this.options.preferences.get('target'));
		}

		// add initial placeholder
		//
		this.updatePlaceholder();

		// add button tooltip triggers
		//
		this.addTooltips();
	},

	hide: function() {
		this.$el.hide();
	},

	clear: function() {
		this.$el.find('[contenteditable="true"]').empty();
	},

	updatePlaceholder: function() {

		// update search placeholder text
		//
		switch (this.kind) {
			case 'url':
				this.$el.removeClass('name');
				this.$el.addClass('url');
				this.$el.find('[contenteditable="true"]').removeAttr('style');
				break;
			default:
				this.$el.removeClass('name');
				this.$el.removeClass('url');
				this.$el.find('[contenteditable="true"]').attr('style', '--search-placeholder: "' + config.defaults.search.placeholder + '"');
				break;
		}
	},

	//
	// event handling methods
	//

	onPasteText: function(event) {
		event.preventDefault();
		var text = event.originalEvent.clipboardData.getData("text/plain");
		document.execCommand("insertHTML", false, text);
	},

	//
	// mouse event handling methods
	//

	onClickSubmitText: function() {

		// perform callback
		//
		if (this.options.onsubmit) {
			this.options.onsubmit(this.getQuery());
		}
	},

	onClickClearText: function() {
		this.clear();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (event.keyCode == 13 && !event.shiftKey) {
			this.onClickSubmitText();
			event.preventDefault();
		}
	}
});