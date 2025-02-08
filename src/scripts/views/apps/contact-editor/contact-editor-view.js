/******************************************************************************\
|                                                                              |
|                            contact-editor-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and editing your contacts.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import ContainableSelectable from '../../../views/behaviors/containers/containable-selectable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import GoogleContactsImportable from '../../../views/apps/common/behaviors/importing/google-contacts-importable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import HeaderBarView from '../../../views/apps/contact-editor/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/contact-editor/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/contact-editor/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/contact-editor/footer-bar/footer-bar-view.js';
import PreferencesFormView from '../../../views/apps/contact-editor/forms/preferences/preferences-form-view.js';
import Browser from '../../../utilities/web/browser.js';

export default AppSplitView.extend(_.extend({}, Multifile, ContainableSelectable, MultiSelectable, ItemShareable, GoogleContactsImportable, ItemInfoShowable, {

	//
	// attributes
	//

	name: 'contact_editor',

	//
	// constructor
	//

	initialize: function() {
		
		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set model
		//
		if (this.collection && !this.model) {
			this.model = this.collection.at(0);
		}
		if (!this.model) {
			this.model = new File();
		}

		// create collection
		//
		if (!this.collection) {
			this.collection = new Items([this.model]);
		}

		// set attributes
		//
		this.directory = new Directory({
			path: this.preferences.get('home_directory')
		});
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('sidebar')) {
			this.getChildView('sidebar').each(callback, filter, options);
		}
	},

	//
	// converting methods
	//

	toContactInfo: function() {
		return this.getActiveView().toContactInfo();
	},

	toVCF: function() {
		return this.getActiveView().toVCF();
	},

	//
	// counting methods
	//

	numContacts: function() {
		return this.directory.contents.filter((model) => {
			return model instanceof File && model.getFileExtension() == 'vcf';
		}).length;
	},

	//
	// querying methods
	//

	hasOpenContact: function() {
		return !this.collection.isEmpty();
	},

	hasOpenContacts: function() {
		return this.collection.length > 1;
	},

	numOpenContacts: function() {
		return this.collection.length;
	},
	
	//
	// getting methods
	//

	getHomeDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return application.getDirectory(this.preferences.get('home_directory'));
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use home directory
			//
			return application.getDirectory();
		}
	},

	getNewFileName: function() {
		let user = this.getActiveView().model;
		return (user.getName() || File.defaultName) + '.vcf';
	},

	getContactIndex: function(model) {
		return this.directory.contents.indexOf(model) + 1;
	},

	getContactNumber: function(which, options) {
		if (this.directory.contents) {
			switch (which) {
				case 'first':
					return 1;
				case 'prev': {
					let contactNumber = this.getContactNumber();
					if (contactNumber > 1) {
						return contactNumber - 1;
					} else if (options && options.wraparound) {
						return this.numContacts();
					} else {
						return 1;
					}
				}
				case 'next': {
					let contactNumber = this.getContactNumber();
					if (contactNumber < this.numContacts()) {
						return contactNumber + 1;
					} else if (options && options.wraparound) {
						return 1;
					} else {
						return this.numContacts();
					}
				}
				case 'last':
					return this.numContacts();
				default:
					return this.getContactIndex(this.model);
			}
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	getValue: function() {
		return this.toVCF().join("\n");
	},

	//
	// setting methods
	//

	setModel: function(model) {

		// call superclass method
		//
		AppSplitView.prototype.setModel.call(this, model);

		// set selected item in sidebar
		//
		this.setSelected(this.model);
	},

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set sidebar
		//
		this.getChildView('sidebar contacts').setDirectory(directory);
	
		// update count
		//
		this.showFooterBar();
	},

	//
	// navigating methods
	//

	pushDirectory: function(directory) {
		this.getChildView('header nav').pushDirectory(directory);
	},

	//
	// selecting methods
	//

	select: function(which) {
		if (this.hasChildView('sidebar')) {
		
			// select sidebar item
			//
			this.getChildView('sidebar').select(which);
		}
	},

	//
	// opening methods
	//

	open: function(options) {
		if (this.hasSelected()) {
			this.openItems(this.getSelectedModels(), options);
		} else {

			// open new file
			//
			this.showOpenDialog();			
		}
	},

	importFromGoogle: function() {
		this.importGoogleContacts((contacts) => {

			// save new contact files
			//
			this.saveContacts(this.directory, contacts);

			// update sidebar panel
			//
			this.getChildView('sidebar').showContactsPanel();
		});
	},

	showContact: function(data) {
		if (data) {

			// split data to lines
			//
			let lines = data? data.trim('"').split(/\r?\n/) : [];

			// update content view
			//
			this.getActiveView().setVCF(lines);
		} else {
			this.getActiveView().setVCF([]);
		}
	},

	//
	// saving methods
	//

	saveContacts: function(directory, contacts, options) {
		for (let i = 0; i < contacts.length; i++) {
			this.saveContact(directory, contacts[i], options);
		}
	},

	saveContact: function(directory, contact, options) {

		// create new text file
		//
		directory.add(new File({
			path: (directory.get('path') || '') + contact.getFullName() + '.vcf'
		}), {

			// callbacks
			//
			success: (model) => {

				// save file
				//
				model.write(contact.toVCF().join('\n'), {

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
							message: "Could not save contact file.",
							response: response
						});
					}
				});
			}
		});
	},

	saveNew: function(directory, filename, options) {

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
						this.setModel(model);
						this.onSave(model);

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
							message: "Could not save contact file.",
							response: response
						});
					}
				});
			}
		});
	},

	saveAs: function(options) {
		import(
			'../../../views/apps/file-browser/dialogs/files/save-as-dialog-view.js'
		).then((SaveAsDialogView) => {

			// show save as dialog
			//
			application.show(new SaveAsDialogView.default({
				model: this.getHomeDirectory(),
				filename: this.getNewFileName(),

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
								item.update(this.toVCF().join('\n'), {

									// callbacks
									//
									success: () => {
										this.setModel(item);
										this.onSave(item);

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
						this.saveNew(directory, filename, {

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
	// closing methods
	//

	closeContact: function() {

		// close current file
		//
		this.closeFile(() => {

			// close parent dialog
			//
			this.dialog.close();
		});
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView({
			collection: this.collection
		});
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({
			model: this.directory,

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			onload: () => {
				this.onLoad();

				// load initial contact
				//
				if (this.model) {
					this.loadModel(this.model);
				}
			},
		});
	},

	getContentView: function() {			
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			editable: !application.isEmbedded(),

			// handlers
			//
			onload: () => this.onLoad(),	
			onopen: (item) => this.onOpen(item),
			onchange: () => this.onChange(),
			onselect: () => this.onSelect(),
			ondeselect: () => this.onDeselect(),
			onclose: (index) => this.closeTab(index)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView({
			collection: this.collection
		});
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function() {
		import(
			'../../../views/apps/contact-editor/dialogs/contacts/open-contacts-dialog-view.js'
		).then((OpenContactsDialogView) => {

			// show open dialog
			//
			this.show(new OpenContactsDialogView.default({
				model: this.getHomeDirectory(),

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},
	
	showNewContactDialog: function() {
		import(
			'../../../views/apps/contact-editor/dialogs/contacts/new-contact-dialog-view.js'
		).then((NewContactDialogView) => {

			// show new contact dialog
			//
			this.show(new NewContactDialogView.default({

				// callbacks
				//
				accept: (model) => {
					this.collection.add(new File());

					// set contact name
					//
					if (model.getFullName() != '') {
						this.getActiveView().setContact(model);
					}
				}
			}));
		});	
	},

	showInfoDialog: function(options) {
		let current = this.getActiveModel();
		let effect = application.settings.theme.get('icon_open_effect');
		let delay = effect && effect != 'none'? 500 : 0;
		let items;

		// find selected items
		//
		if (current.isSaved()) {
			items = [current];
		} else {
			items = this.getSelectedModels();

			// call attention to selected items 
			//
			this.each((item) => {
				if (item.isSelected()) {
					item.showEffect(effect);
				}
			});
		}

		// show info after delay
		//
		if (items.length > 0) {
			window.setTimeout(() => {
				this.showItemsInfoDialog(items, options);
			}, delay);
		}
	},
	
	showPreferencesDialog: function() {
		import(
			'../../../views/apps/contact-editor/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {
		this.selected = item;

		// call superclass method
		//
		AppSplitView.prototype.onSelect.call(this, item);
	},

	onDeselect: function(item) {
		this.selected = null;

		// call superclass method
		//
		AppSplitView.prototype.onDeselect.call(this, item);
	},

	//
	// collection event handling methods
	//

	onLoad: function() {

		// close sidebar
		//
		if (Browser.device == 'phone') {
			this.getChildView('contents').closeSideBar();
		}

		// import contacts
		//
		if (this.options.import) {
			this.importFromGoogle();
			this.options.import = false;
		}

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);
	},

	onOpen: function(item) {

		// change directory
		//
		if (item.model instanceof Directory) {
			this.pushDirectory(item.model);

		// open item in app
		//
		} else {
			this.openItem(item.model);
		}	
	},

	onAdd: function(item) {

		// update menu
		//
		this.getChildView('header menu').getChildView('edit').onAdd(item);

		// update
		//
		this.onChange();
	},

	onRemove: function(item) {

		// update menu
		//
		this.getChildView('header menu').getChildView('edit').onRemove(item);

		// update
		//
		this.onChange();
	},

	onChange: function() {

		// update menu
		//
		this.getChildView('header menu').onChange();
	},

	//
	// file event handling methods
	//

	onSave: function() {

		// update menu
		//
		this.getChildView('header menu').onSave();

		// mark as changed
		//
		this.getChildView('content').setDirty(false);
	}
}), {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	toJSON: function(contact) {
		let json = contact.toJSON();

		if (contact.organization) {
			json.organization = contact.organization.toJSON();
		}
		if (contact.info) {
			json.info = [];
			for (let i = 0; i < contact.info.length; i++) {
				json.info.push(contact.info[i].toJSON());
			}
		}

		return json;
	}
});