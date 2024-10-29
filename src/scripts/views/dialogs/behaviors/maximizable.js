/******************************************************************************\
|                                                                              |
|                                 maximizable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior for maximizing dialogs.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Browser from '../../../utilities/web/browser.js';

export default {

	//
	// attributes
	//

	maximizable: true,

	//
	// querying methods
	//

	isMaximized: function() {
		return this.$el.find('.modal-dialog').hasClass('maximized');
	},

	isExpanded: function() {
		return this.$el.find('.modal-dialog').css('postion') == 'fixed';
	},

	isFullScreen: function() {
		return this.$el.hasClass('full-screen');
	},

	//
	// stacking methods
	//

	detach: function() {
		this.modals.pluck(this);
	},

	attachTo: function(modals) {
		modals.push(this);
	},

	globalize: function() {
		this.detach();

		// move to global modals
		//
		this.attachTo(application.getChildView('modals'));
	},

	localize: function() {
		this.detach();

		// move to desktop modals
		//
		this.attachTo(application.getModals());
	},

	//
	// maximizing methods
	//

	maximize: function(options) {

		// save size and position
		//
		this.saveSize();
		this.savePosition();

		// set size and position
		//
		this.$el.find('.modal-dialog').css({
			width: '100%',
			height: '100%',
			position: options && options.full_screen? 'fixed' : 'absolute',
			top: 0,
			left: 0
		});

		// disable dragging
		//
		if (this.isDraggable()) {
			this.disableDrag();
		}

		// set class
		//
		this.$el.find('.modal-dialog').addClass('maximized');

		// add full screen button
		//
		if (options && options.full_screen) {
			this.$el.addClass('full-screen');
			this.addOverlayControls();
		}

		// move to global modals
		//
		this.globalize();

		// update
		//
		if (!options || !options.silent) {
			this.onResize();

			// play maximize sound
			//
			application.play('maximize');
		}

		// perform callback
		//
		if (this.options.onMaximize) {
			this.options.onMaximize(options.full_screen);
		}
	},

	unmaximize: function(options) {
		let isFullScreen = this.isFullScreen();

		if (!this.isMaximized()) {
			return;
		}

		// enable dragging
		//
		if (this.isDraggable()) {
			this.reenableDrag();
		}

		// move to desktop modals
		//
		this.localize();

		// reset size and position
		//
		this.restoreSize();
		this.restorePosition();

		// unmaximize dialog unless phone (which are always maximized)
		//
		if (Browser.device != 'phone') {
			this.$el.find('.modal-dialog').removeClass('maximized');
		}

		// reset class
		//
		this.$el.find('.modal-dialog').removeClass('resized');

		// update
		//
		if (!options || !options.silent) {
			this.onResize();

			// play restore sound
			//
			application.play('restore');
		}

		// remove overlay controls / collapse button
		//
		if (this.overlayControls) {
			this.overlayControls.remove();
			this.overlayControls = undefined;
		}

		if (this.isFullScreen()) {
			this.$el.removeClass('full-screen');
		}

		// perform callback
		//
		if (this.options.onUnmaximize) {
			this.options.onUnmaximize(isFullScreen);
		}
	},

	//
	// rendering methods
	//

	addOverlayControls: function() {
		this.overlayControls = $(
			'<div class="overlay-controls">' +
			'<div class="content">' +
			'<button class="collapse-window btn btn-sm" data-toggle="tooltip" title="Collapse" data-placement="left">' +
			'<i class="fa fa-compress"></i>' + 
			'</button>' +
			'</div>' +
			'</div>');

		// append overlay controls to dom
		//
		this.$el.find('.modal-dialog').append(this.overlayControls);

		// add tooltip triggers
		//
		this.addTooltips({
			container: this.el
		});
	},

	//
	// expansion methods
	//

	expand: function() {
		this.maximize({
			full_screen: true
		});
	},

	collapse: function() {
		this.unmaximize();

		// remove tooltips
		//
		$('.tooltip').remove();
	}
};