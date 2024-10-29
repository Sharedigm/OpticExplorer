/******************************************************************************\
|                                                                              |
|                                minimizable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for minimizing dialogs.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Dialog from '../../../models/dialogs/dialog.js';
import ModalView from '../../../views/dialogs/modal-view.js';
import BaseCollection from '../../../collections/base-collection.js';

//
// static attributes
//

let minimized = new BaseCollection();

export default {

	//
	// attributes
	//

	minimizable: true,

	//
	// querying methods
	//

	isMinimized: function() {
		return this.$el.hasClass('minimized');
	},

	//
	// getting methods
	//

	getMinimized: function() {
		return minimized;
	},

	getModals: function() {
		if (this.isMaximized()) {
			return application.getChildView('modals');
		} else {
			return application.desktop.getCurrentApp().modals;
		}
	},

	//
	// minimizing methods
	//

	minimize: function(options) {

		// check if already minimized
		//
		if (this.isMinimized()) {
			return;
		}

		// animate
		//
		switch (ModalView.effects.minimize) {
			case 'slide':
				this.$el.addClass('sliding-to-bottom');
				break;
			case 'zoom':
				this.$el.addClass('shrinking-to-bottom');
				break;
			case 'fade':
				this.$el.addClass('fading-out');
				break;
		}
		
		// add to tray after a delay
		//
		this.setTimeout(() => {
			let modals = this.modals;

			// hide dialog
			//
			this.$el.find('.modal-dialog').hide();

			// unanimate
			//
			switch (ModalView.effects.minimize) {
				case 'slide':
					this.$el.removeClass('sliding-to-bottom');
					break;
				case 'zoom':
					this.$el.removeClass('shrinking-to-bottom');
					break;
				case 'fade':
					this.$el.removeClass('fading-out');
					break;
			}

			// update element
			//
			this.$el.addClass('minimized');

			// add to list of minimized windows
			//
			this.minimized = minimized.add(
				new Dialog({
					icon: this.getIcon(),
					title: this.getTitle(),
					view: this.modals.pluck(this)
				})
			);

			// play minimize sound
			//
			application.play('minimize');

			// focus top dialog or desktop
			//
			if (!modals.isEmpty()) {
				modals.getTop().focus();
			} else if (application.desktop) {
				application.desktop.focus();
			}

			// perform callback
			//
			if (options && options.done) {
				options.done();
			}		
		}, this.constructor.getTransitionDuration('minimize'));
	},

	unminimize: function(options) {

		// check if already unminimized
		//
		if (!this.isMinimized()) {
			return;
		}

		// destroy minimized view
		//
		this.minimized.destroy();

		// add to modals
		//
		this.getModals().push(this);

		// enter maximized mode
		//
		if (this.options && this.options.maximized) {
			if (this.maximize) {
				this.maximize({
					full_screen: this.options.full_screen
				});
			}
		}

		// show dialog
		//
		this.$el.find('.modal-dialog').show();

		// animate
		//
		switch (ModalView.effects.unminimize) {
			case 'slide':
				this.$el.addClass('sliding-from-bottom');
				break;
			case 'zoom':
				this.$el.addClass('growing-from-bottom');
				break;
			case 'fade':
				this.$el.addClass('fading-in');
				break;
		}

		// update element
		//
		this.$el.removeClass('minimized');
		this.onResize();

		// restore after a delay
		//
		this.setTimeout(() => {

			// unanimate
			//
			switch (ModalView.effects.unminimize) {
				case 'slide':
					this.$el.removeClass('sliding-from-bottom');
					break;
				case 'zoom':
					this.$el.removeClass('growing-from-bottom');
					break;
				case 'fade':
					this.$el.removeClass('fading-in');
					break;
			}

			// play restore sound
			//
			application.play('restore');

			// perform callback
			//
			if (options && options.done) {
				options.done();
			}
		}, this.constructor.getTransitionDuration('unminimize'));
	},

	//
	// activating methods
	//

	activate: function() {
		if (this.isMinimized()) {
			this.unminimize();
		}
		this.focus();
	}
};