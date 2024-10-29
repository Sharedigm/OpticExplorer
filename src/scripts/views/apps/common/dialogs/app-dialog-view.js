/******************************************************************************\
|                                                                              |
|                               app-dialog-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view used for application windows.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../views/dialogs/dialog-view.js';
import Browser from '../../../../utilities/web/browser.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="<%= icon %>"></i>
					</div>
					<div class="title">
						<%= title %>
					</div>
				</div>
			</div>
		
			<div class="modal-content"> 
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div>
		</div>
	`),

	regions: {
		content: {
			el: '.modal-content',
			replaceElement: false
		},
		body: {
			el: '.modal-body',
			replaceElement: false
		},
		footer: {
			el: '.modal-footer',
			replaceElement: false
		}
	},

	//
	// constructor
	//

	initialize: function(options) {

		// set attributes
		//
		this.app = options.app;
		this.app.dialog = this;

		// set attributes
		//
		if (this.app.size != undefined) {
			this.size = this.app.size;
		}
		if (this.app.min_size != undefined) {
			this.min_size = this.app.min_size;
		}
		if (this.app.resizable != undefined) {
			this.resizable = this.app.resizable;
		}
		if (this.app.maximizable != undefined) {
			this.maximizable = this.app.maximizable;
		}
		if (this.app.closeable != undefined) {
			this.closeable = this.app.closeable;
		}
		if (this.app.max_height != undefined) {
			this.max_height = this.app.max_height;
		}

		if (Browser.is_mobile) {
			this.options.maximized = true;
			this.maximizable = false;
		}

		// call superclass constructor
		//
		DialogView.prototype.initialize.call(this, options);
	},

	//
	// getting methods
	//

	getDefaultWidth: function() {
		return this.app.size? this.app.size[0] : DialogView.prototype.getDefaultWidth();
	},

	getDefaultHeight: function() {
		return this.app.size? this.app.size[1] : DialogView.prototype.getDefaultHeight();
	},

	getDefaultSize: function(sizes) {
		if (!sizes) {
			sizes = this.app.sizes;
		}
		return DialogView.prototype.getDefaultSize.call(this, sizes);
	},

	getMaxWidth: function() {
		let maxWidth = DialogView.prototype.getMaxWidth.call(this);
		if (this.app.preferences.has('window_size')) {
			let windowSize = this.app.preferences.get('window_size');
			let size = config.defaults.dialogs.sizes[windowSize];
			if (size[0] < maxWidth) {
				maxWidth = size[0];
			}
		}
		return maxWidth;
	},

	getMaxHeight: function() {
		let maxHeight = DialogView.prototype.getMaxHeight.call(this);
		if (this.app.preferences.has('window_size')) {
			let windowSize = this.app.preferences.get('window_size');
			let size = config.defaults.dialogs.sizes[windowSize];
			if (size[1] < maxHeight) {
				maxHeight = size[1];
			}
		}
		return maxHeight;
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// set attributes
		//
		this.app.model = model;

		// update dialog header
		//
		this.updateHeader();
	},
	
	setSize: function(size) {
		DialogView.prototype.setSize.call(this, size);
		
		// fixed size apps
		//
		if (Browser.is_mobile && !this.app.resizable) {
			this.$el.find('.body').css({
				'width': size[0],
				// 'height': size[1],
				'margin': 'auto'
			});
		}
	},

	setColor: function(color) {
		if (color && color != 'none') {
			this.$el.find('.modal-dialog').addClass('colored ' + color);
		}
	},

	//
	// show / hide methods
	//

	hide: function() {
		if (this.app.close) {

			// allow body to control close
			//
			this.app.close();
		} else {

			// close dialog
			//
			DialogView.prototype.hide.call(this);
		}
	},

	//
	// minimize / maximize functions
	//

	minimize: function(options) {

		// call superclass method
		//
		DialogView.prototype.minimize.call(this, options);

		// alert app
		//
		if (this.app.onMinimize) {
			this.app.onMinimize(options);
		}
	},

	unminimize: function(options) {

		// call superclass method
		//
		DialogView.prototype.unminimize.call(this, options);

		// alert app
		//
		if (this.app.onUnminimize) {
			this.app.onUnminimize(options);
		}
	},

	maximize: function(options) {

		// call superclass method
		//
		DialogView.prototype.maximize.call(this, options);

		// alert app
		//
		if (this.app.onMaximize) {
			this.app.onMaximize(options);
		}
	},

	unmaximize: function(options) {

		// call superclass method
		//
		DialogView.prototype.unmaximize.call(this, options);

		// alert app
		//
		if (this.app.onUnmaximize) {
			this.app.onUnmaximize(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: _.result(this.app, 'icon'),
			title: _.result(this.app, 'title')
		};
	},

	onRender: function() {

		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// add dialog color
		//
		// this.setColor(this.app.getColor());
	},

	onShow: function() {

		// call superclass method
		//
		DialogView.prototype.onShow.call(this);

		// show child views
		//
		this.showChildView('content', this.app);
	},

	updateHeader: function() {
		this.setIcon(_.result(this.app, 'icon'));
		this.setTitle(_.result(this.app, 'title'));
	},

	//
	// window event handling methods
	//

	onFocus: function() {
		if (this.hasChildView('content') && this.getChildView('content').onFocus) {
			this.getChildView('content').onFocus();
		}
	},

	onBlur: function() {
		if (this.hasChildView('content') && this.getChildView('content').onBlur) {
			this.getChildView('content').onBlur();
		}
	},

	onResize: function(event) {

		// call superclass method
		//
		DialogView.prototype.onResize.call(this, event);

		// notify app
		//
		if (this.app && this.app.onResize) {
			this.app.onResize(event);
		}
	},

	onOrientationChange: function(event) {

		// call superclass method
		//
		DialogView.prototype.onOrientationChange.call(this, event);

		// notify app
		//
		if (this.app && this.app.onOrientationChange) {
			this.app.onOrientationChange(event);
		}
	}
});