/******************************************************************************\
|                                                                              |
|                                modals-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an parent class for displaying modal dialogs.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../vendor/bootstrap/js/modal.js';
import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'unflickable modals',
	current: undefined,
	template: template(''),

	//
	// constructor
	//

	initialize: function() {

		// initialize stack
		//
		this.stack = [];
	},

	//
	// querying methods
	//

	isEmpty: function() {
		return this.stack.length == 0;
	},

	isTop: function(modalView) {
		return modalView == this.getTop();
	},

	isBottom: function(modalView) {
		return modalView == this.getBottom();
	},

	isCurrent: function() {
		return this.$el.hasClass('current');
	},

	hasFocused: function() {
		for (let i = 0; i < this.stack.length; i++) {
			if (this.stack[i].isFocused()) {
				return true;
			}
		}
		return false;
	},

	//
	// counting methods
	//

	numModals: function() {
		return this.stack.length;
	},

	//
	// getting methods
	//

	getIndex: function(modalView) {
		for (let i = 0; i < this.stack.length - 1; i++) {
			if (modalView == this.stack[i]) {
				return i;
			}
		}
	},

	getTop: function() {
		if (!this.isEmpty()) {
			return this.stack[this.stack.length - 1];
		}
	},

	getBottom: function() {
		if (!this.isEmpty()) {
			return this.stack[1];
		}
	},

	getFocused: function() {
		for (let i = 0; i < this.stack.length; i++) {
			if (this.stack[i].isFocused()) {
				return this.stack[i];
			}
		}
	},

	getOrder: function(modalView) {
		for (let i = 0; i < this.stack.length; i++) {
			if (this.stack[i] == modalView) {
				return i;
			}
		}
	},

	//
	// iterating methods
	//

	each: function(callback) {
		for (let i = 0; i < this.stack.length; i++) {
			let value = callback(this.stack[i]);
			if (value) {
				return value;
			}
		}
		return false;
	},

	//
	// focusing methods
	//

	blurAll: function(options) {
		this.each((modalView) => {
			if (!options || options.except != modalView) {
				if (modalView.blur) {
					modalView.blur();
				}
			}
		});
	},

	//
	// rendering methods
	//

	show: function(modalView) {

		// set current modal
		//
		this.current = modalView;
		this.current.modals = this;

		// add to stack
		//
		this.push(modalView);

		// render to DOM
		//
		this.$el.append(modalView.render().el);

		// trigger attach event
		//
		modalView.trigger('attach');

		// show modal
		//
		modalView.show();
	},

	//
	// closing methods
	//

	closeAll: function() {
		this.each((dialog) => {
			dialog.hide();
		});
	},

	closeNonMinimized: function() {
		this.each((dialog) => {
			if (!dialog.isMinimized || !dialog.isMinimized()) {
				dialog.hide();
			}
		});
	},

	//
	// stacking methods
	//

	push: function(modalView) {
		modalView.modals = this;

		// add to dom
		//
		this.$el.append(modalView.$el);

		// add to stack
		//
		this.stack.push(modalView);
	},

	pop: function() {

		// remove from stack
		//
		let modalView = this.stack.pop();

		// remove from DOM
		//
		modalView.$el.detach();

		return modalView;
	},

	pluck: function(modalView) {

		// pull dialog from DOM
		//
		modalView.$el.detach();

		// remove from stack
		//
		let array = [];
		for (let i = 0; i < this.stack.length; i++) {
			if (this.stack[i] != modalView) {
				array.push(this.stack[i]);
			}
		}
		this.stack = array;

		return modalView;
	},

	//
	// re-ordering methods
	//

	raise: function(modalView) {
		if (this.numModals() > 1 && !this.isTop(modalView)) {

			// move to end of list of dialogs
			//
			this.$el.find('.modal:last-of-type').after(modalView.$el);

			// reorder stack
			//
			let array = [];
			for (let i = 0; i < this.stack.length; i++) {
				if (this.stack[i] != modalView) {
					array.push(this.stack[i]);
				}
			}
			array.push(modalView);
			this.stack = array;
		}
	},

	lower: function(modalView) {
		if (this.numModals() > 1 && !this.isBottom(modalView)) {

			// move to beginning of list of dialogs
			//
			$('.modal:first-of-type').before(modalView.$el);

			// reorder stack
			//
			let array = [modalView];
			for (let i = 0; i < this.stack.length; i++) {
				if (this.stack[i] != modalView) {
					array.push(this.stack[i]);
				}
			}
			this.stack = array;
		}
	},

	//
	// minimizing methods
	//

	minimizeAll: function() {
		if (this.numModals() > 0) {
			for (let i = 0; i < this.stack.length; i++) {
				let modal = this.stack[i];
				if (modal.minimize) {
					modal.minimize();
				}
			}
		}
	},

	//
	// offsetting / parallax-shift methods
	//

	setOffset: function(offset) {
		let use3d = true;

		// offset all modals together as if coplanar
		//
		if (offset) {
			if (use3d) {
				this.el.style.transform = 'translate3D(' + offset + 'px, 0, 0)';
			} else {
				this.el.style.transform = 'translateX(' + offset + 'px)';
			}
		} else {
			this.el.style.transform = '';
		}
	},

	setStackedOffset: function(offset) {
		let use3d = true;

		// offset modals depending upon depth
		//
		for (let i = 0; i < this.stack.length; i++) {
			let modalView = this.stack[i];
			let depth = 0.5 + (i / 2);
			let modal = modalView.$el.find('.modal-dialog')[0];

			// offset modal
			//
			if (offset) {
				if (use3d) {
					modal.style.transform = 'translate3D(' + (offset * depth) + 'px, 0, 0)';
				} else {
					modal.style.transform = 'translateX(' + (offset * depth) + 'px)';
				}
			} else {
				modal.style.transform = '';
			}
		}
	}
});