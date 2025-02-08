/******************************************************************************\
|                                                                              |
|                      share-request-notification-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a type of notification.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../../../../models/connections/connection.js';
import Items from '../../../../../collections/storage/items.js';
import NotificationsListItemView from '../../../../../views/apps/notification-center/mainbar/notifications/lists/notifications-list-item-view.js';
import FileUtils from '../../../../../utilities/files/file-utils.js';

export default NotificationsListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<form class="form-horizontal">
		
			<div class="tile">
				<a class="user">
					<% if (thumbnail_url) { %>
					<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)">
						<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</a>
			</div>
		
			<div class="info">
				<div class="heading">
					<div class="buttons">
						<button type="button" class="accept success btn btn-sm" data-toggle="tooltip" title="Accept" data-placement="bottom">
							<i class="fa fa-plus"></i>
						</button>
						<button type="button" class="decline warning btn btn-sm" data-toggle="tooltip" title="Decline" data-placement="bottom">
							<i class="fa fa-minus"></i>
						</button>
					</div>
		
					<div class="title">
						<a class="user">
							<%= name %>
						</a>
					</div>
				</div>
		
				<div class="fineprint">
					<% if (path && path.endsWith('/')) { %>
					<i class="fa fa-folder"></i>
					<span>Shared a <% if (copy) { %>copy of a <% } %>folder with you.</span>
					<% } else { %>
					<i class="fa fa-file"></i>
					<span>Shared a <% if (copy) { %>copy of a <% } %>file with you.</span>
					<% } %>
					<br />
		
					<a class="when">
						<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at && created_at.format? created_at.format('fullDate') : created_at %>"></i>
						<span class="elapsed-time"><%= when %></span>
					</a>
		
					<div class="expander">
						<button type="button" class="collapse btn-sm">
							<i class="fa fa-caret-up"></i>
						</button>
						<button type="button" class="expand btn-sm">
							<i class="fa fa-caret-down"></i>	
						</button>
					</div>
				</div>
			</div>
		
			<div class="hideable">
				<div class="form-groups">
		
					<% if (message) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-quote-left"></i>Note</label>
						<p class="form-control-static"><%= message %></p>
					</div>
					<% } %>
		
					<div class="form-group">
						<% if (path && path.endsWith('/')) { %>
						<label class="form-label"><i class="fa fa-folder"></i>Folder</label>
						<% } else { %>
						<label class="form-label"><i class="fa fa-file"></i>File</label>
						<% } %>
						<p class="form-control-static"><%= path %></p>
					</div>
					
					<div class="form-group">
						<label class="form-label"><i class="fa fa-calendar-alt"></i>Date</label>
						<p class="form-control-static"><%= created_at && created_at.format? created_at.format('fullDate') : created_at %></p>
					</div>
				</div>
			</div>
		</form>
	`),

	events: {
		'click .user': 'onClickUser',
		'click .when': 'onClickWhen',
		'click .expander': 'onClickExpander',
		'click .accept': 'onClickAccept',
		'click .decline': 'onClickDecline'
	},

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return this.get('share_request').get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},
	
	//
	// accepting methods
	//

	accept: function(directory, filename, options) {
		let path;

		// compose new path
		//
		if (directory.has('path') && directory.get('path') != '') {
			path = directory.get('path') + filename;
		} else {
			path = filename;
		}

		// accept share request
		//
		this.get('share_request').accept({

			// options
			//
			data: {
				dest_path: path
			},

			// callbacks
			//
			success: (data) => {

				// dismiss notification
				//
				this.dismiss();

				// fetch shared item
				//			
				Items.toItem({
					path: path,
					share_id: data.share_id
				}).fetch({

					// callbacks
					//
					success: (data) => {

						// update item
						//
						let item = Items.toItem(data.attributes);

						// update directory
						//	
						directory.add(item);

						// perform callback
						//
						if (options && options.success) {
							options.success(item);
						}
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not accept share request.",
					response: response
				});
			}
		});
	},

	decline: function() {

		// decline share request
		//
		this.get('share_request').decline({

			// callbacks
			//
			success: () => {

				// dismiss notification
				//
				this.dismiss();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not decline share request.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.get('share_request').get('user').get('short_name'),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			message: this.get('share_request').get('message'),
			path: this.get('share_request').get('path'),
			copy: this.get('share_request').get('copy'),
			when: this.model.when()
		};
	},

	//
	// mouse event handling methods
	//

	onClickUser: function() {

		// find connection
		//
		new Connection({
			id: this.get('share_request').get('user').get('id')
		}).fetch({

			// callbacks
			//
			success: (model) => {

				// show connection's profile info
				//
				application.showUser(model);
			},

			error: (response) => {

				// show error message
				//
				application.error({
					message: "Connection not found.",
					reponse: response
				});
			}
		});
	},

	onClickExpander: function() {
		this.toggleCollapse();
	},
	
	onClickAccept: function() {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// get file name
			//
			let path = this.get('share_request').get('path');
			if (FileUtils.isDirectoryPath(path)) {
				path = FileUtils.getFilePath(path);
			}

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				filename: FileUtils.getFileName(path),

				// callbacks
				//
				save: (directory, filename) => {

					// make filename into a directory name, if necessary
					//
					let originalPath = this.get('share_request').get('path');
					if (originalPath.endsWith('/') && !filename.endsWith('/')) {
						filename = filename + '/';
					}

					// save item
					//
					this.accept(directory, filename, {

						// callbacks
						//
						success: () => {

							// play paste sound
							//
							application.play('paste');

							// destroy view
							//
							this.destroy();
						}
					});
				}
			}));
		});
	},

	onClickDecline: function() {
		this.decline({

			// callbacks
			//
			success: () => {

				// remove model from collection
				//
				this.model.collection.remove(this.model);

				// destroy view
				//
				this.destroy();
			}
		});
	}
});
