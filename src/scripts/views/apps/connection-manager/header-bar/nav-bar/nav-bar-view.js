/******************************************************************************\
|                                                                              |
|                                nav-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a nav toolbar.                              |
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
import BackButtonView from '../../../../../views/apps/connection-manager/header-bar/nav-bar/buttons/back-button-view.js';
import ForwardButtonView from '../../../../../views/apps/connection-manager/header-bar/nav-bar/buttons/forward-button-view.js';
import AddButtonView from '../../../../../views/apps/connection-manager/header-bar/nav-bar/buttons/add-button-view.js';
import DeleteButtonView from '../../../../../views/apps/connection-manager/header-bar/nav-bar/buttons/delete-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="back" data-toggle="tooltip" title="Back" data-placement="bottom"></div>
		<div class="forward" data-toggle="tooltip" title="Forward" data-placement="bottom"></div>
		<div class="add" data-toggle="tooltip" title="Add Connection" data-placement="bottom"></div>
		<div class="delete" data-toggle="tooltip" title="Delete Connections" data-placement="bottom"></div>
	`),

	regions: {
		back: '.back',
		forward: '.forward',
		add: '.add',
		delete: '.delete'
	},

	current: null,
	history: {
		prev: [],
		next: []			
	},

	//
	// querying methods
	//

	hidden: function() {
		let hasSelected = this.parent.app.hasSelected();

		return {
			back: false,
			forward: false,
			add: hasSelected,
			delete: !hasSelected
		};
	},

	disabled: function() {
		let hasSelected = this.parent.app.hasSelected();

		return {
			back: this.history.prev.length == 0,
			forward: this.history.next.length == 0,
			add: hasSelected,
			delete: !hasSelected
		};
	},

	//
	// setting methods
	//

	reset: function() {
		this.current = null;
		this.history = {
			prev: [],
			next: []
		};
		this.update();
	},

	//
	// navigating methods
	//

	push: function(next) {

		// save previous search
		//
		this.history.prev.push(this.current);
		this.current = next;
		this.update();
	},

	prev: function() {
		if (this.history.prev.length > 0) {

			// save current search
			//
			this.history.next.push(this.current);
			this.current = this.history.prev.pop();
			this.update();
		}
	},

	next: function() {
		if (this.history.next.length > 0) {

			// save current search
			//
			this.history.prev.push(this.current);
			this.current = this.history.next.pop();
			this.update();
		}
	},

	goto: function(next, options) {

		// check for change
		//
		if (next == this.current) {
			return;
		}

		this.push(next);

		// check if done
		//
		if (options && options.silent) {
			return;
		}
		
		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(next, options);
		}
	},

	back: function(options) {
		this.prev();

		// check if done
		//
		if (options && options.silent) {
			return;
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.current, options);
		}
	},

	forward: function(options) {
		this.next();

		// check if done
		//
		if (options && options.silent) {
			return;
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.current, options);
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		
		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('back', new BackButtonView());
		this.showChildView('forward', new ForwardButtonView());
		this.showChildView('add', new AddButtonView());
		this.showChildView('delete', new DeleteButtonView());

		// set initial state
		//
		this.$el.find('.back .button').addClass('hidden');
		this.$el.find('.forward .button').addClass('hidden');
		this.$el.find('.delete .button').addClass('hidden');
	}
});