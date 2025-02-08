/******************************************************************************\
|                                                                              |
|                                  dialog-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base class for displaying non-modal dialogs.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../views/dialogs/modal-view.js';
import DialogButtonsView from '../../views/dialogs/buttons/dialog-buttons-view.js';
import ReverseDialogButtonsView from '../../views/dialogs/buttons/reverse-dialog-buttons-view.js';
import Resizable from '../../views/dialogs/behaviors/resizable.js';
import Minimizable from '../../views/dialogs/behaviors/minimizable.js';
import Maximizable from '../../views/dialogs/behaviors/maximizable.js';
import Browser from '../../utilities/web/browser.js';

export default ModalView.extend(_.extend({}, Resizable, Minimizable, Maximizable, {

	//
	// attributes
	//

	closeable: true,

	attributes: {
		'role': 'dialog',
		'data-backdrop': 'false'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .window-size.toolbar .shrink-window': 'onClickShrinkWindow',
		'click .window-size.toolbar .grow-window': 'onClickGrowWindow',
		'click .window-size.toolbar .expand-window': 'onClickExpandWindow',
		'click .collapse-window': 'onClickCollapseWindow'
	}),

	//
	// constructor
	//

	initialize: function() {
		
		// call superclass constructor
		//
		ModalView.prototype.initialize.call(this);

		// set default size
		//
		if (this.resizable) {
			let size = this.size || this.getDefaultSize();
			if (!this.options.width) {
				this.options.width = size[0];
			}
			if (!this.options.height) {
				this.options.height = size[1];
			}
		}

		// set options
		//
		if (this.options.width == undefined) {
			this.options.width = this.getDefaultWidth();
		}
		if (this.options.height == undefined) {
			this.options.height = this.getDefaultHeight();
		}
		if (this.options.maximized == undefined) {
			this.options.maximized = Browser.is_mobile;
		}

		// disable minimizing / maximizing
		//
		if (!application.desktop) {
			this.minimizable = false;
		}
		if (!this.resizable) {
			this.maximizable = false;
		}

		// set attributes
		//
		this.index = this.constructor.count++;
	},

	//
	// getting methods
	//

	getDefaultWidth: function() {
		if (this.size && this.size[0]) {
			return Math.min(this.size[0], $(window).width());
		}
	},

	getDefaultHeight: function() {
		if (this.size && this.size[1]) {
			if ($(window).height() < this.size[1]) {
				return $(window).height() - 20;
			} else {
				return Math.min(this.size[1], $(window).height());
			}			
		}
	},

	//
	// focusing methods
	//

	focus: function() {
		if (this.isMinimized()) {
			return;
		}
		ModalView.prototype.focus.call(this);
	},

	blur: function() {
		if (this.isMinimized()) {
			return;
		}
		ModalView.prototype.blur.call(this);
	},

	isFocused: function() {
		if (this.isMinimized()) {
			return false;
		}
		return ModalView.prototype.isFocused.call(this);
	},

	//
	// button adding methods
	//

	addLeftButtons: function() {
		let buttons = new ReverseDialogButtonsView();
		buttons.parent = this;
		let element = $(buttons.render().$el).addClass('left');
		$(element).insertBefore(this.$el.find('.heading'));
	},

	addRightButtons: function() {
		let buttons = new DialogButtonsView();
		buttons.parent = this;
		let element = $(buttons.render().$el).addClass('right');
		$(element).insertAfter(this.$el.find('.heading'));
	},

	addButtons: function() {
		this.addLeftButtons();
		this.addRightButtons();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// set size
		//
		if (this.options.width || this.options.height) {
			this.$el.find('.modal-dialog').css({
				'width': this.options.width,
				'height': this.options.height
			});
		}

		// set window styles
		//
		if (!this.resizable) {

			// add fixed size class
			//
			if ((this.size && this.size[0]) || this.options.width) {
				this.$el.find('.modal-dialog').addClass('fixed-width');
			}
			if ((this.size && this.size[1]) || this.options.height) {
				this.$el.find('.modal-dialog').addClass('fixed-height');
			}
		}

		// use maximized windows for mobile
		//
		if (Browser.device == 'phone') {
			this.maximize({
				silent: true
			});
		}

		// add dialog buttons
		//
		if (this.closable || this.resizable || this.minimizable || this.maximizable) {
			this.addButtons();
		}

		// enable window features
		//
		if (this.resizable && !Browser.is_mobile) {
			this.enableResize();
		}

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);
	},

	show: function() {

		// call superclass method
		//
		ModalView.prototype.show.call(this);

		// enter maximized mode
		//
		if (this.options && this.options.maximized) {
			if (this.maximize) {
				this.maximize({
					full_screen: this.options.full_screen
				});
			}
		}
	},

	showChildApp: function(appName, options) {
		application.loadResources(appName, {

			// callbacks
			//
			success: (resources) => {
				application.loadAppView(appName, {

					// callbacks
					//
					success: (AppView) => {

						// create new view
						//
						let view = new AppView(_.extend({
							dialog: this,
							hidden: {
								'footer-bar': true
							},
						}, options));

						// set app attributes
						//
						view.constructor.resources = resources;

						// render app
						//
						this.showChildView(appName, view);
					}
				});
			}
		});
	},

	//
	// dialog event handling methods
	//

	onShown: function() {
		
		// check for window resize
		//
		$(window).on('resize', (event) => {
			if (this.isMaximized()) {
				this.onResize(event);
			}
		});

		// call superclass method
		//
		ModalView.prototype.onShown.call(this);
	},
	
	//
	// mouse event handling methods
	//

	onDoubleClickHandle: function() {

		// call superclass method
		//
		ModalView.prototype.onDoubleClickHandle.call(this);

		// reset size of resizeable dialogs
		//
		if (this.resizable) {
			this.resetSize();
		}
	},

	onClickShrinkWindow: function() {
		this.shrink();
	},

	onClickGrowWindow: function() {
		this.grow();
	},

	onClickExpandWindow: function() {
		this.expand();
	},

	onClickCollapseWindow: function() {
		this.collapse();
	}
}, {
	
	//
	// static attributes
	//

	count: 0
}));