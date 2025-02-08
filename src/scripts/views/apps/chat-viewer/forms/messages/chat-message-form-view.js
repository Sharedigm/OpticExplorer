/******************************************************************************\
|                                                                              |
|                           chat-message-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for creating or editing a chat message.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ChatMessage from '../../../../../models/chats/chat-message.js';
import Directory from '../../../../../models/storage/directories/directory.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Items from '../../../../../collections/storage/items.js';
import FormView from '../../../../../views/forms/form-view.js';
import Emotable from '../../../../../views/emoji/behaviors/emotable.js';
import FileMovable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-movable.js';
import FileCopyable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-copyable.js';
import FileUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import DroppableUploadable from '../../../../../views/apps/file-browser/mainbar/behaviors/droppable-uploadable.js';
import Geolocatable from '../../../../../views/apps/map-viewer/mainbar/maps/behaviors/geolocatable.js';
import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import HtmlUtils from '../../../../../utilities/web/html-utils.js';
import Browser from '../../../../../utilities/web/browser.js';
import '../../../../../../vendor/jquery/insert/jquery.insert.js';

export default FormView.extend(_.extend({}, Emotable, FileMovable, FileCopyable, FileUploadable, DroppableUploadable, Geolocatable, {

	//
	// attributes
	//

	template: template(`
		<input type="file" multiple style="display:none"/>
		
		<div class="message flex-row">
			<div class="tile">
				<% if (thumbnail_url) { %>
				<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>); width:<%= thumbnail_size %>">
					<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
					<i class="placeholder far fa-user"></i>
				</div>
				<% } else { %>
				<div class="thumbnail">
					<i class="fa fa-user"></i>
				</div>
				<% } %>
			</div>
			<div class="info">
				<div class="comment-bubble right">
					<div class="comment-inner form-control" contenteditable="true"><%= message %></div>
					<div class="comment-arrow"></div>
				</div>
			</div>
		</div>
		
		<div class="options">

			<% if (sharing) { %>
			<div class="buttons">
		
				<% if (sharing.emoji) { %>
				<button class="add-emoji btn btn-sm" data-toggle="tooltip" title="Add Emoji">
					<i class="fa fa-grin"></i>
				</button>
				<% } %>

				<% if (sharing.files && sharing.files.Pictures) { %>
				<button class="optional add-pictures btn btn-sm" data-toggle="tooltip" title="Add Pictures">
					<i class="fa fa-image"></i>
				</button>
				<% } %>

				<% if (sharing.files && sharing.files.Files) { %>
				<button class="add-files btn btn-sm" data-toggle="tooltip" title="Add Files">
					<i class="fa fa-file"></i>
				</button>
				<% } %>
		
				<% if (sharing.uploads) { %>
				<button class="upload-file btn btn-sm" data-toggle="tooltip" title="Upload File">
					<i class="fa fa-upload"></i>
				</button>
				<% } %>
		
				<% if (sharing.locations) { %>
				<button class="check-in btn btn-sm" data-toggle="tooltip" title="Check In"<% if (typeof check_in != 'undefined' && check_in) { %> style="display:none"<% } %>>
					<i class="fa fa-map-marker-alt"></i>
				</button>
				<button class="check-out btn btn-sm" data-toggle="tooltip" title="Check Out"<% if (typeof check_in == 'undefined' || !check_in) { %> style="display:none"<% } %>>
					<i class="fa fa-xmark"></i>
				</button>
				<% } %>
				
				<% if (sharing.files || sharing.uploads) { %>
				<button class="remove warning btn btn-sm" data-toggle="tooltip" title="Remove Items" style="display:none">
					<i class="active fa fa-file-circle-xmark"></i>
				</button>
				<% } %>
			</div>
			<% } %>
		
			<div class="buttons">
				<% if (submitable) { %>
				<button class="submit btn btn-primary"<% if (!message) { %>disabled<% } %>>
					<i class="fa fa-envelope"></i>Send
				</button>
				<% } %>

				<button class="clear btn"<% if (!message) { %>disabled<% } %>>
					<i class="fa fa-xmark"></i>Clear
				</button>

				<% if (cancelable) { %>
				<button class="cancel warning btn">
					<i class="active fa fa-xmark"></i>Cancel
				</button>
				<% } %>
			</div>

			<div class="where fineprint"<% if (typeof check_in == 'undefined' || !check_in) { %> style="display:none"<% } %>>
				<a><i class="fa fa-map-marker-alt"></i><span class="name"><%= typeof check_in != 'undefined' && check_in? check_in.get('name') : '' %></span></a>
			</div>
		</div>

		<div class="attachments" class="focused"></div>
	`),

	focusable: '[contenteditable="true"]',

	regions: {
		attachments: {
			el: '.attachments'
		}
	},

	events: _.extend({}, Emotable.events, FileUploadable.events, DroppableUploadable.events, Geolocatable.events, {
		'input .comment-inner': 'onInputMessage',
		'focus .comment-inner': 'onFocusMessage',
		'blur .comment-inner': 'onBlurMessage',

		'click .add-emoji': 'onClickAddEmoji',
		'click .add-pictures': 'onClickAddPictures',
		'click .add-files': 'onClickAddFiles',
		'click .upload-file': 'onClickUploadFile',
		'click .remove': 'onClickRemove',
		'click .submit': 'onClickSubmit',
		'click .clear': 'onClickClear',
		'click .cancel': 'onClickCancel',
		'click .popover': 'onClickPopover',

		'tap .add-emoji': 'onTapAddEmoji',
		'tap .add-pictures': 'onTapAddPictures',
		'tap .add-files': 'onTapAddFiles',
		'tap .upload-file': 'onTapUploadFile',
		'tap .remove': 'onTapRemove',
		'tap .submit': 'onTapSubmit',
		'tap .clear': 'onTapClear',
		'tap .cancel': 'onTapCancel',
		'tap .popover': 'onTapPopover',

		'change input[type="file"]': 'onChangeFile'
	}),

	// image attributes
	//
	thumbnailSize: 50,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormView.prototype.initialize.call(this);

		// set optional parameter defaults
		//
		if (this.options.droppable == undefined) {
			this.options.droppable = true;
		}

		this.directories = {
			uploads: new Directory({
				path: this.constructor.paths.uploads
			}),
			messages: new Directory({
				path: this.constructor.paths.messages + this.constructor.getDateOffset() + '/'
			})
		};

		// create collection for attachments
		//
		if (this.model.has('attachments')) {
			this.collection = new Items(
				this.model.get('attachments').toArray()
			);
		} else {
			this.collection = new Items();
		}
	},

	//
	// querying methods
	//

	isEmpty: function() {
		return this.$el.find('.comment-inner').is(':empty') && this.collection.isEmpty();
	},

	hasSelected: function() {
		if (this.hasChildView('attachments')) {
			return this.getChildView('attachments').hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		return this.getChildView('attachments').numSelected();
	},

	//
	// getting methods
	//

	getSelected: function() {
		return this.getChildView('attachments').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('attachments').getSelectedModels();
	},

	getThumbnailUrl: function() {
		return application.session.user.getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	getNewMessageDirectory: function(messagesDirectory) {
		let numMessages = messagesDirectory.numDirectories() || 0;
		let digits = this.constructor.toDigits(numMessages + 1);
		return new Directory({
			path: messagesDirectory.get('path') + 'Message ' + digits + '/'
		});
	},

	//
	// form methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return HtmlUtils.htmlToText(this.$el.find('.comment-inner').html());
			case 'attachments':
				return this.collection;
		}
	},

	getValues: function() {
		return {
			message: this.getValue('message'),
			attachments: this.getValue('attachments')
		};
	},

	//
	// fetching methods
	//

	fetchMessageDirectory: function(messagesDirectory, options) {

		// create new messages directory
		//
		this.getNewMessageDirectory(messagesDirectory).save({

			// callbacks
			//
			success: (model) => {

				// add new directory to messages directory
				//
				messagesDirectory.add(model);

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (response) => {

				// show error message
				//
				application.error({
					message: "Could not create message directory.",
					response: response
				});
			}
		});
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'message':
				this.$el.find('.message .comment-inner').html(value);
				break;
		}
	},

	setChat: function(chat) {
		this.model.set({
			chat_id: chat.get('id')
		});
	},

	//
	// form validating methods
	//

	isValid: function() {
		return this.getValue('message') != '';
	},

	validate: function() {
		let valid = this.isValid();

		// enable / disable buttons
		//
		this.updateButtons();

		// perform callback
		//
		if (this.options.onvalidate) {
			this.options.onvalidate(valid);
		}
	},

	//
	// setting methods
	//

	addAttachments: function(items) {
		this.collection.add(items);

		// update
		//
		this.onChange();
	},

	removeAttachments: function(items) {
		this.collection.remove(items);

		// remove button tooltip
		//
		this.removeTooltips();

		// update
		//
		this.onChange();
	},

	clear: function() {

		// clear message
		//
		this.$el.find('.comment-inner').empty();

		// clear extras
		//
		this.clearAttachments();
		this.clearCheckIn();

		// update
		//
		this.onChange();
	},

	clearAttachments: function() {
		this.collection.reset();
	},

	//
	// uploading methods
	//

	uploadMessageItems: function(items, options) {

		// create uploads directory
		//
		this.directories.uploads.create({

			// callbacks
			//
			success: (model) => {

				// call mixin method
				//
				FileUploadable.uploadItems.call(this, items, model, {
					show_progress: true,
					overwrite: true,

					// callbacks
					//
					success: (items) => {

						// perform callback
						//
						if (options && options.success) {
							options.success(items);
						}
					}
				});
			},

			error: (response) => {

				// show error message
				//
				application.error({
					message: "Could not create uploads directory.",
					response: response
				});
			}
		});
	},

	uploadMessageFiles: function(files, options) {

		// create uploads directory
		//
		this.directories.uploads.create({

			// callbacks
			//
			success: (model) => {

				// call mixin method
				//
				FileUploadable.uploadFiles.call(this, files, model, {
					show_progress: true,
					overwrite: true,

					// callbacks
					//
					success: (files) => {

						// perform callback
						//
						if (options && options.success) {
							options.success(files);
						}
					}
				});
			}
		});
	},

	relocateMessageItems: function(uploadedItems, copyableFiles, messageDirectory, options) {

		// move uploaded items from uploads directory to message directory
		//
		this.moveItems(uploadedItems, messageDirectory, {

			// callbacks
			//
			success: () => {

				// update collection
				//
				this.collection.add(uploadedItems);

				// copy files from other directories to message directory
				//
				this.copyItems(copyableFiles, messageDirectory, {

					// callbacks
					//
					success: (copiedFiles) => {

						// update collection
						//
						this.collection.remove(copyableFiles);
						this.collection.add(copiedFiles);

						// perform callback
						//
						if (options && options.success) {
							options.success();
						}
					},

					error: (response) => {

						// show error message
						//
						application.error({
							message: "Could not copy attached items to chats directory.",
							response: response
						});
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not relocate attached items to chats directory.",
					response: response
				});
			}
		});
	},

	//
	// form submitting methods
	//

	submitMessage: function(options) {

		// create new message
		//
		FormView.prototype.submit.call(this, {

			// callbacks
			//
			success: (message) => {

				// finish
				//
				this.onSubmit(message);

				// perform callback
				//
				if (options && options.success) {
					options.success(message);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not submit message.",
					response: response
				});
			}
		});
	},

	submit: function(options) {

		// check if no attachments to process
		//
		if (this.collection.length == 0 || !this.options.preferences.get('copy_attachments')) {

			// create new message
			//
			this.submitMessage(options);
		} else {

			// find attached items to relocate
			//
			let uploadedItems = this.collection.getContainedBy(this.directories.uploads);
			let existingItems = this.collection.getNotContainedBy(this.directories.uploads);
			let copyableFiles = existingItems.filter(Items.filters.is_file).filter(Items.filters.is_unattached);

			if (uploadedItems.length > 0 || copyableFiles.length > 0) {

				// fetch messages directory
				//
				this.directories.messages.create({

					// callacks
					//
					success: (directory) => {

						// fetch directory for this particular message
						//
						this.fetchMessageDirectory(directory, {

							// callbacks
							//
							success: (directory) => {

								// relocate attached items
								//
								this.relocateMessageItems(uploadedItems, copyableFiles, directory, {

									// callbacks
									//
									success: () => {

										// create new message
										//
										this.submitMessage(options);
									},

									error: () => {

										// show error message
										//
										application.error({
											message: "Could not message items.",
										});
									}
								});
							}
						});
					},

					error: (response) => {

						// show error message
						//
						application.error({
							message: "Could not create uploads directory.",
							response: response
						});
					}
				});
			} else {

				// create new message
				//
				this.submitMessage(options);
			}
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {

			// options
			//
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			message: HtmlUtils.textToHtml(this.model.get('message')),
			sharing: config.defaults.sharing,

			// capabilities
			//
			submitable: this.options.submitable,
			cancelable: this.options.cancelable
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showAttachments();

		// pre-create uploads directory
		//
		/*
		if (this.directories) {
			this.directories.uploads.create();
		}
		*/

		// set initial state
		//
		this.update();

		// add tooltip triggers
		//
		this.addTooltips();
	},

	onShow: function() {

		// set caret position
		//
		// this.$el.find('.comment-inner').setCaretAtEnd();

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showAttachments: function() {
		this.showChildView('attachments', new FilesView({
			collection: this.collection,

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
			selectable: true,
			draggable: false,
			droppable: false,

			// callbacks
			//
			onselect: () => this.onSelect(),
			ondeselect: () => this.onDeselect()
		}));
	},

	setButtonHidden: function(name, hidden) {
		if (hidden || hidden == undefined) {
			this.$el.find('.' + name).hide();
		} else {
			this.$el.find('.' + name).show();
		}
	},

	setButtonDisabled: function(name, disabled) {
		this.$el.find('.' + name).prop('disabled', disabled !== false);
	},

	updateButtons: function() {

		// hide /show buttons
		//
		this.setButtonHidden('remove', this.collection.length == 0);

		// enable / disable buttons
		//
		this.setButtonDisabled('remove', !this.hasSelected());
		this.setButtonDisabled('submit', this.isEmpty());
		this.setButtonDisabled('clear', this.isEmpty());
	},

	update: function() {
		this.updateButtons();

		// mark form as empty
		//
		if (this.isEmpty()) {
			this.$el.addClass('empty');
		} else {
			this.$el.removeClass('empty');
		}
	},

	//
	// dialog rendering methods
	//

	showOpenFilesDialog: function(options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open files dialog
			//
			application.show(new OpenItemsDialogView.default(_.extend({

				// options
				//
				title: "Add " + (options.model? options.model.getName() || "Files" : "Files") + " to Chat",

				// callbacks
				//
				onopen: (items) => {
					if (items) {
						this.addAttachments(items);
					}
				}
			}, options)));
		});
	},

	showOpenImagesDialog: function(options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/images/open-images-dialog-view.js'
		).then((OpenImagesDialogView) => {
			
			// show open images dialog
			//
			application.show(new OpenImagesDialogView.default(_.extend({

				// options
				//
				title: "Add Pictures to Chat",

				// callbacks
				//
				onopen: (items) => {
					if (items) {
						this.addAttachments(items);
					}
				}
			}, options)));
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	onChangePrivacy: function() {

		// perform callback
		//
		if (this.options.onvalidate) {
			this.options.onvalidate(this.isValid());
		}
	},

	onFocusMessage: function() {
		this.$el.addClass('focused');
	},

	onBlurMessage: function() {
		this.$el.removeClass('focused');

		// end key input
		//
		if (Browser.is_mobile) {
			Browser.hideMobileKeyboard();
		}
	},

	//
	// mouse event handling methods
	//

	onClickAddEmoji: function() {
		if (Browser.is_mobile) {
			return;
		}

		// place emoji selector at top since form is at bottom
		//
		this.showEmojiSelector({
			placement: this.options.placement || 'top'
		});

		// block event from parent
		//
		this.block(event);
	},

	onClickPopover: function(event) {
		if (Browser.is_mobile) {
			return;
		}

		// prevent removing of emoji selector on popover click
		//
		this.block(event);
	},

	onClickAddPictures: function() {
		if (Browser.is_mobile) {
			return;
		}

		let files = config.defaults.sharing.files['Pictures'];
		let directoryName = files? files.directory : '';

		this.showOpenImagesDialog({
			model: application.getDirectory(directoryName)
		});
	},

	onClickAddFiles: function() {
		if (Browser.is_mobile) {
			return;
		}

		this.showOpenFilesDialog({
			model: application.getDirectory()
		});
	},

	onClickUploadFile: function() {
		if (Browser.is_mobile) {
			return;
		}

		$(event.target).closest('form').find('input[type="file"]')[0].click();
	},

	onClickRemove: function() {
		if (Browser.is_mobile) {
			return;
		}

		this.removeAttachments(this.getSelectedModels());
	},

	onClickSubmit: function() {
		if (Browser.is_mobile) {
			return;
		}

		this.submit();
	},

	onClickClear: function() {
		if (Browser.is_mobile) {
			return;
		}

		this.clear();
	},

	onClickCancel: function() {
		if (Browser.is_mobile) {
			return;
		}

		this.destroy();

		// perform callback
		//
		if (this.options.oncancel) {
			this.options.oncancel();
		}
	},

	//
	// touch event handling methods
	//

	onTapAddEmoji: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		// place emoji selector at top since form is at bottom
		//
		this.showEmojiSelector({
			placement: this.options.placement || 'top'
		});

		// block from parent
		//
		this.block(event);
	},

	onTapPopover: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		// prevent removing of emoji selector on popover click
		//
		this.block(event);
	},

	onTapAddPictures: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		// end key input
		//
		Browser.hideMobileKeyboard();

		// show dialog
		//
		this.showOpenImagesDialog({
			model: application.getDirectory('Pictures')
		});

		// block from parent
		//
		this.block(event);
	},

	onTapAddFiles: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		// end key input
		//
		Browser.hideMobileKeyboard();

		// show dialog
		//
		this.showOpenFilesDialog({
			model: application.getDirectory()
		});

		// block from parent
		//
		this.block(event);
	},

	onTapUploadFile: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		// end key input
		//
		Browser.hideMobileKeyboard();

		// show native file picker
		//
		$(event.target).closest('form').find('input[type="file"]')[0].click();

		// block from parent
		//
		this.block(event);
	},

	onTapRemove: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		this.removeAttachments(this.getSelectedModels());

		// block from parent
		//
		this.block(event);
	},

	onTapSubmit: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		this.submit();

		// block from parent
		//
		this.block(event);
	},

	onTapClear: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		this.clear();

		// block from parent
		//
		this.block(event);
	},

	onTapCancel: function(event) {
		if (!Browser.is_mobile) {
			return;
		}

		this.destroy();

		// perform callback
		//
		if (this.options.oncancel) {
			this.options.oncancel();
		}

		// block from parent
		//
		this.block(event);
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.onChangeSelection();
	},

	onDeselect: function() {
		this.onChangeSelection();
	},

	onChangeSelection: function() {
		this.updateButtons();
	},

	//
	// form event handling methods
	//

	onInputMessage: function() {
		this.validate();

		// mark form as empty
		//
		if (this.isEmpty()) {
			this.$el.addClass('empty');
		} else {
			this.$el.removeClass('empty');
		}
	},

	onSubmit: function(message) {
		
		// clear new message form view
		//
		this.clear();

		// create new message
		//
		this.model = new ChatMessage({
			chat_id: this.model.get('chat_id')
		});

		// perform callback
		//
		if (this.options.onsubmit) {
			this.options.onsubmit(message);
		}
	},
	
	//
	// file event handling methods
	//

	onChangeFile: function(event) {
		let path = $(event.target).val();
		
		if (path) {
			this.uploadMessageFiles(event.target.files, {

				// callbacks
				//
				success: (items) => {

					// add uploads to attachments
					//
					this.addAttachments(items);

					// play upload sound
					//
					application.play('upload');
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						title: "Upload Error",
						message: "Could not upload '" + model.get('name') + "'. ",
						response: response
					});
				}
			});
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {
		
		// play drop sound
		//
		application.play('drop');

		// add attachments to form
		//
		this.addAttachments(items);
	},

	onDropInItems: function(items) {
		this.uploadMessageItems(items, {

			// callbacks
			//
			success: (items) => {

				// play upload sound
				//
				application.play('upload');
			
				// add uploads to attachments
				//
				this.addAttachments(items);
			}
		});
	},

	onDropInFiles: function(files) {
		this.uploadMessageFiles(files, {

			// callbacks
			//
			success: (items) => {

				// play upload sound
				//
				application.play('upload');

				// add uploads to attachments
				//
				this.addAttachments(items);
			}
		});
	}
}), {

	//
	// static attributes
	//

	paths: {
		uploads: 'Uploads/',
		messages: 'Messages/'
	},

	months: ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	],

	//
	// directory / path methods
	//

	toDigits: function(number) {
		return (number < 10 ? '0' : '') + number;
	},
	
	getDateOffset: function() {
		let offset = '';
		let date = new Date();
		let year = date.getYear() + 1900;
		let month = date.getMonth();
		let dayOfMonth = date.getDate();

		// add year offset
		//
		offset += year + '/';

		// add month offset
		//
		offset += (this.toDigits(month + 1) + ' ' + this.months[month] + '/');

		// add date offset
		//
		offset += (this.months[month] + ' ' + this.toDigits(dayOfMonth));

		return offset;
	}
});