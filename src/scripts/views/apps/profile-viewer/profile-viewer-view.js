/******************************************************************************\
|                                                                              |
|                            profile-viewer-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing a user's profile info.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../../models/connections/connection.js';
import Post from '../../../models/topics/post.js';
import UserProfile from '../../../models/users/profile/user-profile.js';
import Gesture from '../../../models/gestures/gesture.js';
import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Place from '../../../models/places/place.js';
import CheckIn from '../../../models/places/check-in.js';
import Connections from '../../../collections/connections/connections.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import ItemOpenable from '../../../views/apps/common/behaviors/opening/item-openable.js';
import ConnectionShareable from '../../../views/apps/common/behaviors/sharing/connection-shareable.js';
import LinkShareable from '../../../views/apps/common/behaviors/sharing/link-shareable.js';
import HeaderBarView from '../../../views/apps/profile-viewer/header-bar/header-bar-view.js';
import UserPanelsView from '../../../views/apps/profile-viewer/mainbar/user-panels-view.js';
import SideBarView from '../../../views/apps/profile-viewer/sidebar/sidebar-view.js';
import FooterBarView from '../../../views/apps/profile-viewer/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/profile-viewer/forms/preferences/preferences-form-view.js'

export default AppSplitView.extend(_.extend({}, ItemOpenable, ConnectionShareable, LinkShareable, {

	//
	// attributes
	//

	name: 'profile_viewer',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set attributes
		//
		this.tab = 'profile';
		if (!this.model) {
			this.model = application.session.user;
		}

		// set preferences
		//
		if (this.options.nav != undefined) {
			this.preferences.set({
				'detail_kind': this.options.nav
			});
		}

		// listen to model for changes
		//
		this.listenTo(this.model, 'change', this.onChange);
	},

	//
	// attribute methods
	//

	title: function() {
		return this.model? this.model.getName('full') : config.apps[this.name].name;
	},
	
	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasSelected();
		}
	},

	//
	// getting methods
	//

	getFileName: function() {
		return this.model.getName() + '.vcf';
	},
	
	getSelected: function() {
		return this.getChildView('content').getSelected();
	},

	getSelectedModels: function() {
		return this.getChildView('content').getSelectedModels();
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// call superclass method
		//
		AppSplitView.prototype.setModel.call(this, model);

		// update view
		//
		this.onRender();
	},

	//
	// deleting methods
	//

	deleteConnection: function(options) {

		// check if we need to confirm
		//			
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + this.model.getFullName() + " from your connections list?",

				// callbacks
				//
				accept: () => {
					this.deleteConnection(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete connection
			//
			application.session.user.disconnect(this.model, {

				// callbacks
				//
				success: () => {

					// close dialog
					//
					this.dialog.close();
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete connection.",
						response: response
					});
				}
			});
		}
	},

	deleteItems: function(items, options) {
		for (let i = 0; i < items.length; i++) {
			items[i].delete(options);
		}
	},

	deleteSelectedItems: function() {

		// check if current user
		//
		if (!this.model.is(application.session.user)) {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-lock"></i>',
				title: "Permissions Error",
				message: "You do not have permission to delete these items."
			});

			return;
		}

		if (!this.hasSelected()) {
			return;
		}

		// delete selected
		//
		switch (this.tab) {
			case 'profile':
			case 'posts': {
				this.deleteItems(this.getSelected(), {
					confirm: true
				});
				break;
			}
			case 'connections': {
				this.deleteConnections(this.getSelectedModels(), {
					confirm: true
				});
				break;
			}
		}
	},

	//
	// check in methods
	//

	checkIn: function(options) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.checkInAt(new Place({
					name: 'My Location',
					latitude: position.coords.latitude,
					longitude: -position.coords.longitude,
					zoom_level: 9.5
				}));
			}, () => {

				// no location found
				//
				this.checkInAt(null, options);
			});
		} else {

			// no ability to get current location
			//
			this.checkInAt(null, options);
		}
	},

	checkInAt: function(place, options) {
		this.showCheckInDialog(_.extend({
			model: place,

			// callbacks
			//
			accept: (place) => {
				new CheckIn(place.attributes).save(undefined, {

					// callbacks
					//
					success: (model) => {
						this.model.set('check_in', model);
						this.showContent();
					}
				});
			}
		}, options));
	},

	checkOut: function() {
		this.model.get('check_in').checkOut({

			// callbacks
			//
			success: () => {
				this.model.set('check_in', undefined);
				this.showContent();
			}
		});
	},

	//
	// sharing methods
	//

	shareWithSelected: function(options) {
		this.shareWithConnections([this.model], null, options);
	},

	shareItemsWithSelected: function(items, options) {
		this.shareWithConnections([this.model], items, options);
	},

	shareMessage: function() {
		application.launch('chat_viewer', {
			user: this.model
		});
	},

	shareGesture: function(kind) {
		let connection = this.model;
		new Gesture().save({
			kind: kind,
			recipient_id: connection.get('id')
		}, {

			// callbacks
			//
			success: (model) => {

				// play gesture sound
				//
				model.play();

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Gesture Sent',
					message: 'You just sent ' + connection.get('short_name') + ' a ' + kind + '.'
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Could not save gesture.'
				});
			}
		});
	},

	shareByTopic: function(options) {
		this.shareLinkByTopic(this.model.getUrl(), _.extend({}, options, {
			message: this.model.get('short_name') + ': ' + '\n'
		}));
	},

	shareByMessage: function(options) {
		this.shareLinkByMessage(this.model.getUrl(), _.extend({}, options, {
			message: this.model.get('short_name') + ': ' + '\n'
		}));
	},

	shareByLink: function() {
		this.showShareByLinkDialog(this.model.getUrl());
	},

	shareByEmail: function() {
		let connection = this.model;
		if (connection) {
			import(
				'../../../views/apps/profile-viewer/dialogs/sharing/share-by-email-dialog-view.js'
			).then((ShareByEmailDialogView) => {

				// show share by email dialog
				//
				this.show(new ShareByEmailDialogView.default({
					model: connection
				}));
			});
		}
	},

	//
	// user profile methods
	//

	editName: function() {
		import(
			'../../../views/apps/profile-viewer/dialogs/profile/edit/edit-user-name-dialog-view.js'
		).then((EditUserNameDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserNameDialogView.default({
				model: this.model,

				// update header
				//
				onchange: () => {
					application.getChildView('header').updateProfileName();
				}
			}));
		});	
	},

	editProfile: function() {
		this.getChildView('content').getChildView('profile').edit();
	},

	addItem: function() {
		this.getChildView('content').getChildView('profile').getChildView('panels').getSelectedPanel().addItem();
	},
	
	//
	// item opening methods
	//

	openConnection: function(connection) {
		if (this.dialog && this.preferences.get('open_connections_in_new_window')) {

			// show connection's profile info
			//
			application.showUser(connection);
		} else {
			this.setModel(connection);
		}
	},

	openPost: function(post) {
		application.launch('post_viewer', {
			model: post
		});
	},

	//
	// converting methods
	//

	toVCF: function() {
		let lines = [];
		lines.push('BEGIN:VCARD');
		lines.push('VERSION:3.0');

		// add user info
		//
		lines = lines.concat(this.model.toVCF());

		// add job info
		//
		let jobs = this.options.profile.get('jobs');
		if (jobs) {
			let job = jobs.at(0);
			lines = lines.concat(job.toVCF());
		}

		// add address info
		//
		let addresses = this.options.profile.get('addresses');
		if (addresses) {
			lines = lines.concat(addresses.toVCF());
		}

		// add phone info
		//
		let phones = this.options.profile.get('phones');
		if (phones) {
			lines = lines.concat(phones.toVCF());
		}

		// add email info
		//
		let emails = this.options.profile.get('email_addrs');
		if (emails) {
			lines = lines.concat(emails.toVCF());
		}

		// add web info
		//
		let websites = this.options.profile.get('websites');
		if (websites) {
			lines = lines.concat(websites.toVCF());
		}
		
		lines.push('END:VCARD');
		return lines;
	},

	exportNew: function(directory, filename, options) {

		// create new text file
		//
		directory.add(new File({
			path: (directory.get('path') || '') + filename
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				model.write(this.toVCF().join('\n'), {

					// callbacks
					//
					success: () => {

						// perform callback
						//
						if (options && options.success) {
							options.success();
						}
					}, 

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not save contact info file.",
							response: response
						});
					}
				});
			}
		});
	},

	exportAs: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				filename: this.getFileName(),

				// callbacks
				//
				save: (directory, filename) => {
					if (directory.hasItemNamed(filename)) {
						application.confirm({
							title: "Overwrite File",
							message: "A file already exists with this name.  Would you like to overwrite it?",

							// callbacks
							//
							accept: () => {
								let item = directory.getItemNamed(filename);

								// update existing file
								//
								item.update(this.toContactInfo(), {

									// callbacks
									//
									success: () => {

										// perform callback
										//
										if (options && options.success) {
											options.success();
										}
									}
								});
							}
						});
					} else {
						this.exportNew(directory, filename, {

							// callbacks
							//
							success: () => {

								// perform callback
								//
								if (options && options.success) {
									options.success();
								}
							}
						});
					}
				}
			}));
		});
	},

	//
	// setting methods
	//

	setMenuMode: function(mode) {
		let editMenu = this.getChildView('header menu edit');
		editMenu.setMenuMode(mode);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showAppBars();
		
		// fetch user profile
		//
		new UserProfile().fetchByUser(this.model, {

			// callbacks
			//
			success: (model) => {
				this.options.profile = model;
				this.showContents();
				this.onLoad();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's profile.",
					response: response
				});
			}
		});
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.model,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),
			profile: this.options.profile,

			// callbacks
			//
			onopen: (item) => {
				this.onOpen(item);
			}
		});
	},

	getContentView: function() {
		return new UserPanelsView({
			model: this.model,

			// options
			//
			preferences: this.preferences,
			profile: this.options.profile,
			nav: this.options.nav,

			// capabilities
			//
			editable: true,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: () => this.onDeselect(),
			onclicktab: (tab) => this.onClickTab(tab),
			onopen: (item) => this.onOpen(item)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function(connections) {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManagerView) => {
				ConnectionManagerView.showSelectConnectionsDialog({
					collection: connections,

					// callbacks
					//
					select: (items) => this.setModel(items[0])
				});
			}
		});
	},

	showOpenConnectionsDialog: function() {

		// fetch connections
		//
		new Connections().fetchByUser(application.session.user, {
			
			// callbacks
			//
			success: (collection) => {

				// show open dialog
				//
				this.showOpenDialog(collection);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's connections.",
					response: response
				});
			}
		});
	},

	showInfoDialog: function() {
		application.loadAppView('connection_manager', {

			// callbacks
			//
			success: (ConnectionManagerView) => {
				ConnectionManagerView.showConnectionInfoDialog(this.model);
			}
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/profile-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	showCheckInDialog: function(options) {
		application.loadAppView('map_viewer', {

			// callbacks
			//
			success: (MapViewerView) => {
				MapViewerView.showCheckInDialog(options);
			}
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.setTitle(this.title());
	},
	
	//
	// mouse event handling methods
	//

	onClickTab: function(tab) {
		switch (tab) {
			case 'profile': {
				let profileView = this.getChildView('content').getChildView('profile');
				tab = profileView.getChildView('panels').options.tab;
				break;
			}
		}

		this.setMenuMode(tab);
		this.tab = tab;
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.selected = item;

		// update menu
		//
		this.getChildView('header menu').onSelect(item);

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {
		this.selected = null;

		// update menu
		//
		this.getChildView('header menu').onDeselect(item);

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(item);
		}
	},

	//
	// event handling methods
	//

	onOpen: function(item) {
		if (item.model instanceof Connection) {
			this.openConnection(item.model);
		} else if (item.model instanceof Post) {
			this.openPost(item.model);
		} else if (item.model instanceof Directory) {
			this.openDirectory(item.model);
		} else if (item.model instanceof File) {
			this.openFile(item.model);
		}
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	}
});