/******************************************************************************\
|                                                                              |
|                   share-items-with-connections-form-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form view to share files with connections.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../../models/preferences/user-preferences.js';
import ShareRequests from '../../../../../../collections/storage/sharing/share-requests.js';
import Items from '../../../../../../collections/storage/items.js';
import Connections from '../../../../../../collections/connections/connections.js';
import FormView from '../../../../../../views/forms/form-view.js';
import FilesView from '../../../../../../views/apps/file-browser/mainbar/files/files-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal wide',

	template: template(`
		<div class="share-items form-group">
			<label class="control-label"><i class="fa fa-share"></i>Share</label>
			<div class="controls">
				<div class="files"></div>
				<button class="select-files btn">
					<i class="fa fa-file"></i>Select Files
				</button>
			</div>
		</div>

		<div class="with-connections form-group">
			<label class="control-label"><i class="fa fa-user"></i>With</label>
			<div class="controls">
				<div class="connections"></div>
				<button class="select-connections btn" disabled>
					<i class="fa fa-user-friends"></i>Select Connections
				</button>
			</div>
		</div>

		<div class="message form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="1" maxlength="1000"><%= message %></textarea>

					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is an optional message to the recipient(s) of the share invitation."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="share-as form-group">
			<label class="control-label"><i class="fa fa-file"></i>Share as</label>
			<div class="controls">

				<div class="radio-inline">
					<label><input type="radio" name="share-as" value="copy"<% if (sharing == 'copy') { %> checked="checked"<% } %>>Copy</label>
				</div>

				<div class="radio-inline">
					<label><input type="radio" name="share-as" value="reference"<% if (sharing == 'reference') { %> checked="checked"<% } %>>Reference</label>
				</div>

				<i class="active fa fa-question-circle" data-toggle="popover" title="Share as" data-content="When you share an item as a copy, then you and the receipient will each get an independent copy and will not see changes made by the other.  When you share an item as a reference, then you and the recipient will both share access to the same item and will therefore see any changes made by the other. "></i>
			</div>
		</div>
	`),

	regions: {
		files: '.files',
		connections: '.connections'
	},

	events: _.extend({}, FormView.prototype.events, {
		'click .select-files': 'onClickSelectFiles',
		'click .select-connections': 'onClickSelectConnections'
	}),

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.sharing == undefined) {
			this.options.sharing = 'copy';
		}

		// set attributes
		//
		this.items = this.options.items || [];
		this.connections = this.options.connections || [];
		this.collection = new Connections();
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return this.$el.find('.message textarea').val();
			case 'share_as':
				return this.$el.find('.share-as input:checked').val();
		}
	},

	getValues: function() {
		return {
			message: this.getValue('message'),
			share_as: this.getValue('share_as')
		};
	},

	getConnectionNames: function() {
		let names = [];
		if (this.connections) {
			for (let i = 0; i < this.connections.length; i++) {
				names.push(this.connections[i].getName());
			}
		}
		return names;
	},

	//
	// setting methods
	//

	setItems: function(items) {
		this.items = items;
		this.showItems(items);
	},

	setConnections: function(connections) {
		this.connections = connections;
		this.showConnections(connections);
	},

	setDisabled: function(disabled) {
		this.$el.find('.select-connections').prop('disabled', disabled !== false);
	},

	//
	// selecting methods
	//

	selectFiles: function() {
		import(
			'../../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({

				// options
				//
				title: "Select Items to Share",
				selected: this.items,
				model: this.model,

				// callbacks
				//
				onopen: (items) => {
					this.setItems(items);

					// perform callback
					//
					if (this.options.onselect) {
						this.options.onselect(items);
					}
				}
			}));
		});
	},

	selectConnections: function() {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManager) => {
				ConnectionManager.showSelectConnectionsDialog({
					collection: this.collection,

					// options
					//
					selected: this.connections,

					// callbacks
					//
					select: (connections) => {
						this.setConnections(connections);

						// perform callback
						//
						if (this.options.onselect) {
							this.options.onselect(connections);
						}
					}
				});
			}
		});
	},

	//
	// form methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		} else {

			// save collection
			//
			ShareRequests.create(this.items, this.connections, {
				message: this.getValue('message'),
				copy: this.getValue('share_as') == 'copy'
			}).save(options);

			return true;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			message: this.options.message,
			sharing: this.options.sharing || 'copy'
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showItems(this.options.items);
		this.showConnections(this.options.connections);

		// fetch user connections
		//
		this.collection.fetchByUser(application.session.user, {

			// callbacks
			//
			success: () => this.setDisabled(false),
			error: () => this.setDisabled(true)
		});
	},

	showItems: function(items) {
		this.showChildView('files', new FilesView({
			collection: new Items(items, {
				parse: false
			}),

			// options
			//
			preferences: UserPreferences.create('file_browser', {
				view_kind: 'icons',
				detail_kind: null,
				show_hidden_files: true,
				sort_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	},

	showConnections: function(connections) {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManager) => {

				// show users view
				//
				this.showChildView('connections', ConnectionManager.getUsersView({
					collection: new Connections(connections, {
						parse: false
					}),

					// options
					//
					preferences: UserPreferences.create('connection_manager', {
						view_kind: 'icons',
						detail_kind: null
					}),

					// capabilities
					//
					selectable: false
				}));
			}
		});
	},

	//
	// mouse event handling methods
	//

	onClickSelectFiles: function() {
		this.selectFiles();
	},

	onClickSelectConnections: function() {
		this.selectConnections();
	}
});