/******************************************************************************\
|                                                                              |
|                                 modal-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an base class for displaying modal dialogs.              |
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
import Positionable from '../../views/dialogs/behaviors/positionable.js';
import Draggable from '../../views/dialogs/behaviors/draggable.js';
import Stackable from '../../views/dialogs/behaviors/stackable.js';
import Timeable from '../../views/behaviors/effects/timeable.js';
import Browser from '../../utilities/web/browser.js';
import '../../utilities/scripting/array-utils.js';

export default BaseView.extend(_.extend({}, Positionable, Draggable, Stackable, Timeable, {

	//
	// attributes
	//

	className: 'modal',
	size: undefined,
	title: "Untitled",

	// capabilities
	//
	draggable: true,
	resizable: false,

	attributes: {
		'role': 'dialog',

		// restricts focus to dialog
		//
		'tabindex': -1,

		// prevents dialogs from closing with a
		// click outside of the dialog bounds
		//
		'data-backdrop': 'static'
	},

	events: {

		// mouse events
		//
		'mousedown': 'onMouseDown',
		'dblclick .modal-header .handle': 'onDoubleClickHandle',

		// keyboard events
		//
		'keydown': 'onKeyDown'
	},

	//
	// querying methods
	//

	isFocused: function() {
		return this.$el.hasClass('focused');
	},

	isClosing: function() {
		return this.$el.hasClass('closing');
	},

	//
	// counting methods
	//

	numModals: function() {
		return $('.modals .modal.backdrop').length;
	},

	numDialogs: function() {
		return $('.modals .modal').length;
	},

	//
	// getting methods
	//

	getIcon: function() {
		return this.$el.find('.modal-header .heading .icon i').attr('class');
	},

	getTitle: function() {
		return this.$el.find('.modal-header .heading .title').text();
	},

	//
	// setting metods
	//

	setIcon: function(icon) {
		this.$el.find('.modal-header .heading .icon i').attr('class', icon);
	},

	setTitle: function(title, icon) {
		if (icon) {
			this.setIcon(icon);
		}
		this.$el.find('.modal-header .heading .title').text(title);
	},

	//
	// opening methods
	//

	open: function(options) {

		// raise modal to top
		//
		this.toTop();

		// center vertically
		//
		this.$el.css('display', 'flex');

		// animate
		//
		this.$el.addClass('opening');
		if (!this.options.full_screen) {
			switch (this.constructor.effects.open) {
				case 'slide':
					this.$el.addClass('sliding-from-top');
					break;
				case 'zoom':
					this.$el.addClass('growing-in');
					break;
				case 'fade':
					this.$el.addClass('fading-in');
					break;
			}
		} else {
			this.$el.addClass('zooming-to');
		}

		// focus when opened
		//
		this.setTimeout(() => {
			this.$el.removeClass('opening');

			// unanimate
			//
			if (!this.options.full_screen) {
				switch (this.constructor.effects.open) {
					case 'slide':
						this.$el.removeClass('sliding-from-top');
						break;
					case 'zoom':
						this.$el.removeClass('growing-in');
						break;
					case 'fade':
						this.$el.removeClass('fading-in');
						break;
				}
			} else {
				this.$el.removeClass('zooming-to');
			}

			// set focus
			//
			this.focus();

			// perform callback
			//
			if (options && options.done) {
				options.done();
			}
		}, this.constructor.getTransitionDuration('open'));

		// blur opener
		//
		if (this.options.opener) {
			this.options.opener.blur();
		}

		// play open sound
		//
		application.play('open');
	},

	//
	// closing methods
	//

	close: function(options) {

		// animate
		//
		if (!this.options.full_screen) {
			switch (this.constructor.effects.close) {
				case 'slide':
					this.$el.addClass('sliding-to-top');
					break;
				case 'zoom':
					this.$el.addClass('shrinking-out');
					break;
				case 'fade':
					this.$el.addClass('fading-out');
					break;
			}
		} else {
			this.$el.addClass('zooming-from');
		}

		// play close sound
		//
		application.play('close');

		this.setTimeout(() => {
			this.destroy();

			// perform callback
			//
			if (options && options.done) {
				options.done();
			}
		}, this.constructor.getTransitionDuration('close'));

		// perform callback
		//
		if (this.options.onclose) {
			this.options.onclose();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.icon,
			title: this.title
		};
	},

	onRender: function() {

		// set window size
		//
		if (this.size) {
			if (this.size[0]) {
				this.$el.find('.modal-dialog').css('width', this.size[0] + 'px');
			}
			if (this.size[1]) {
				this.$el.find('.modal-dialog').css('height', this.size[1] + 'px');
			}
		}

		// set dialog maximum height
		//
		if (this.max_height && !Browser.is_mobile) {

			// add modal extents wrapping div
			//
			this.$el.find('.modal-dialog').wrap($('<div class="modal-extents">').css({
				'min-height': this.max_height || this.options.max_height
			}));
			this.$el.find('.modal-dialog').css('max-height', this.max_height);
			this.$el.find('.modal-content').css('overflow', 'auto');
		}

		// use maximized style for phones
		//
		if (Browser.device == 'phone') {
			this.$el.find('.modal-dialog').addClass('maximized');
		}

		// enable window features
		//
		if (this.draggable && !Browser.is_mobile) {
			this.enableDrag();
		}

		// set up callbacks
		//
		this.$el.on('show.bs.modal', (event) => {
			this.onShow(event);
		});
		this.$el.on('hide.bs.modal', (event) => {
			this.onHide(event);
		});

		// add orientation event listener
		//
		window.addEventListener("orientationchange", () => {
			this.onOrientationChange();
		}, false);
	},

	show: function() {

		// trigger plug-in
		//
		this.$el.modal({
			show: true,
			keyboard: false,
			backdrop: false
		});
	},

	hide: function() {

		// trigger plug-in
		//
		this.$el.modal('hide');
	},

	//
	// dialog event handling methods
	//

	onShow: function() {

		// blur parent
		//
		if (this.opener && this.opener.blur) {
			this.opener.blur();
		}

		// notify child views
		//
		let regionNames = Object.keys(this.regions);
		for (let i = 0; i < regionNames.length; i++) {
			let childView = this.getChildView(regionNames[i]);
			if (childView && childView.onShow) {
				childView.onShow();
			}
		}

		// perform opening animation
		//
		this.open({

			// callbcks
			//
			done: () => {
				this.onShown();
			}
		});

		// close when parent closes
		//
		/*
		if (this.parent) {
			this.listenTo(this.parent, 'destroy', () => {
				this.close();
			});
		}
		*/
	},

	onShown: function() {

		// show backdrop
		//
		if (!this.minimizable) {
			this.$el.addClass('backdrop');
		}
		
		// focus form
		//
		if (this.hasChildView('form')) {
			this.getChildView('form').focus();
		}

		// perform callback
		//
		if (this.options.onshown) {
			this.options.onshown();
		}
	},

	onHide: function(event) {

		// close modal
		//
		this.close({

			// callbacks
			//
			done: () => {
				this.onHidden();
			}
		});

		// block event from parent
		//
		this.block(event);
	},

	onHidden: function() {
		this.destroy();

		// perform callback
		//
		if (this.options.onHidden) {
			this.options.onHidden(this);
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// raise modal to top
		//
		if (this.isMaximized && !this.isMaximized()) {
			this.toTop();
		}

		// focus, if not already focused
		//
		if (!this.isFocused()) {
			this.focus();
		}

		// block event from parent
		//
		if (!$(event.originalEvent.target).hasClass('clickable')) {
			event.stopPropagation();
		}

		// skip mouse events if touch enabled
		//
		if (Browser.is_touch_enabled) {
			return;
		}
	},

	onDoubleClickHandle: function() {
		this.resetPosition();
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {

		// delegate key events to modal content
		//
		let view = this.getChildView('content');
		if (view && view.onKeyDown) {
			view.onKeyDown(event);
		}
	},

	//
	// window event handling methods
	//

	onOrientationChange: function(event) {

		// perform callback
		//
		if (this.options.onOrientationChange) {
			this.options.onOrientationChange(event);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// remove from stack
		//
		this.modals.pluck(this);

		// remove backdrops
		//
		$('.modal-backdrop').remove();
	},

	onDestroy: function() {
		let top = this.modals.getTop();
		if (top) {

			// return focus to top dialog
			//
			top.focus();
		} else if (application.desktop) {

			// return focus to desktop
			//
			application.desktop.focus();
		}
	}
}), {

	//
	// static attributes
	//

	transitionDuration: 250,

	effects: {
		open: null,
		close: null,
		minimize: null,
		unminimize: null
	},

	getTransitionDuration: function(type) {
		if (this.effects[type] && this.effects[type] != 'none') {
			return this.transitionDuration;
		} else {
			return 0;
		}
	}
});