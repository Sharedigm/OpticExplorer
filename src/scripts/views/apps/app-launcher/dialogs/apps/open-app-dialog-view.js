/******************************************************************************\
|                                                                              |
|                           open-app-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to select an app to open.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../../views/dialogs/dialog-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">

			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<%= icon %>
					</div>
					<div class="title">
						<%= title %>
					</div>
				</div>
			</div>

			<div class="modal-content">
				<div class="modal-body"></div>

				<div class="modal-footer">
					<div class="address-bar"></div>

					<div class="buttons">
						<button class="open btn btn-primary" data-dismiss="modal" disabled>
							<i class="fa fa-check"></i>Open
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		app_launcher: {
			el: '.modal-body',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click button.open': 'onClickOpenButton'
	}),

	//
	// dialog attributes
	//

	icon: '<i class="fa fa-rocket"></i>',
	title: "Open App",

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (this.options.title) {
			this.title = this.options.title;
		}

		// call superclass constructor
		//
		DialogView.prototype.initialize.call(this);

		// set default attributes
		//
		if (!this.model) {
			this.model = application.getDirectory();
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

	onShow: function() {

		// call superclass method
		//
		DialogView.prototype.onShow.call(this);

		// show child views
		//
		this.showAppLauncher();
	},

	showAppLauncher: function() {
		this.showChildApp('app_launcher', {
			collection: this.collection,

			// state
			//
			selected: this.options.selected,

			// callbacks
			//
			onopen: (item) => this.onOpen(item)
		});
	},

	update: function() {

		// update buttons
		//
		this.$el.find('.modal-footer .open').prop('disabled', false);
	},

	//
	// mouse event handling methods
	//

	onClickOpenButton: function() {

		// open selected item
		//
		if (this.item && this.options.onopen) {
			this.options.onopen(this.item.model);
		}

		this.close();
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {
		if (item) {
			this.item = item;
		}
		this.update();
	},

	//
	// window event handling methods
	//

	onResize: function(event) {

		// call superclass method
		//
		DialogView.prototype.onResize.call(this, event);

		// resize contents
		//
		this.getChildView('app_launcher').onResize(event);
	}
});