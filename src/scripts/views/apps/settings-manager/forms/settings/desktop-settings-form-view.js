/******************************************************************************\
|                                                                              |
|                         desktop-settings-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a settings form.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SettingsFormView from '../../../../../views/apps/common/forms/settings-form-view.js';
import AppPagerView from '../../../../../views/apps/settings-manager/mainbar/app-pages/app-pager-view.js';

export default SettingsFormView.extend({

	//
	// attributes
	//

	className: 'desktop-settings',

	template: template(`
		<div class="settings icon-grid">
			<div class="item">
				<div class="row">
					<div class="icon colored grey">
						<img src="images/icons/settings/desktop.svg" />
						<i class="fa fa-desktop"></i>
					</div>
				</div>
				<div class="row">
					<div class="name">Desktop</div>
				</div>
			</div>
		</div>

		<ul class="nav nav-tabs" role="tablist">

			<li role="presentation" class="apps-tab<% if (tab == 'apps' || !tab) { %> active<% } %>">
				<a role="tab" data-toggle="tab" href=".apps-settings">
					<i class="fa fa-rocket"></i>
					<label>Apps</label>
				</a>
			</li>
		</ul>

		<div class="tab-content">

			<div role="tabpanel" class="apps-settings tab-pane<% if (tab == 'apps' || !tab) { %> active<% } %>">
				<div class="buttons">
					<button class="add-before btn btn-sm" data-toggle="tooltip" title="Add App Before" data-placement="bottom"><i class="fa fa-plus"></i></button>

					<button class="edit btn btn-sm" data-toggle="tooltip" title="Change App" data-placement="bottom"><i class="fa fa-pencil-alt"></i></button>

					<button class="remove btn btn-sm" data-toggle="tooltip" title="Remove App" data-placement="bottom"><i class="fa fa-minus"></i></button>

					<button class="add-after btn btn-primary btn-sm" data-toggle="tooltip" title="Add App After" data-placement="bottom"><i class="fa fa-plus"></i></button>
				</div>

				<div class="desktop-app form-group">
					<div class="items"></div>
				</div>
			</div>
		</div>
	`),

	regions: {
		items: {
			el: '.items',
			replaceElement: false
		}
	},

	events: {
		'click .add-before': 'onClickAddBefore',
		'click .edit': 'onClickEdit',
		'click .remove': 'onClickRemove',
		'click .add-after': 'onClickAddAfter'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.model = application.settings.desktop;

		// set list of apps to choose from
		//
		this.collection = application.apps.getByIds(this.model.get('desktop_apps'));
	},

	//
	// counting methods
	//

	numItems: function() {
		return this.collection.length;
	},

	//
	// getting methods
	//

	getDesktopApps: function() {
		let apps = [];
		for (let i = 0; i < this.collection.length; i++) {
			apps.push(this.collection.at(i).get('id'));
		}
		return apps;
	},

	getValue: function(key) {
		switch (key) {
			case 'desktop_apps':
				return this.getDesktopApps();
		}
	},

	getIndex: function() {
		return this.getChildView('items').getItemNumber() - 1;
	},

	getCurrentItem: function() {
		return this.getChildView('items').getCurrentItem();
	},

	//
	// setting methods
	//

	setRemoveDisabled: function(disabled) {
		this.$el.find('.remove').prop('disabled', disabled);
	},

	//
	// add / remove methods
	//

	add: function(app, options) {
		this.collection.add(app, options);
		this.render();
		application.play('add');
		this.onChange();
	},

	replace: function(model) {
		let index = this.getIndex();
		this.collection.remove(this.collection.at(index));
		this.collection.add(model, {
			at: index
		});
		this.render();
		application.play('add');
		this.onChange();
	},

	remove: function(app) {
		this.collection.remove(app);
		this.render();
		application.play('remove');
		this.onChange();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab
		};
	},

	onRender: function() {

		// show child views
		//
		this.showCarousel();

		// update buttons
		//
		this.update();

		// add tooltip triggers
		//
		this.addTooltips({
			container: this.parent.$el
		});
	},

	showCarousel: function() {			
		this.showChildView('items', new AppPagerView({
			collection: this.collection,
			
			// capabilities
			//
			playable: false,
			selectable: false
		}));
	},

	update: function() {

		// update buttons
		//
		this.setRemoveDisabled(this.collection.length <= 1);
	},

	//
	// dialog rendering methods
	//

	showOpenWithDialog: function(callback) {
		import(
			'../../../../../views/apps/settings-manager/dialogs/settings/open-desktop-app-dialog-view.js'
		).then((OpenDesktopAppDialogView) => {

			// show open with dialog
			//
			this.getParentView('app').show(new OpenDesktopAppDialogView.default({

				// options
				//
				title: "Add Desktop App",

				// callbacks
				//
				onopen: (model) => {
					callback(model);
				}
			}));
		});
	},

	//
	// event handling methods
	//

	onChange: function() {
		let desktopApps = this.getValue('desktop_apps');

		// update buttons
		//
		this.update();

		// update settings
		//
		this.model.set({
			desktop_apps: desktopApps,
		});

		// notify parent
		//
		if (this.options.onchange) {
			this.options.onchange('desktop_apps', desktopApps);
		}
	},

	//
	// mouse event handling methods
	//

	onClickAddBefore: function() {
		this.showOpenWithDialog((model) => {
			this.add(model, {
				at: this.getIndex()
			});
		});
	},

	onClickEdit: function() {
		this.showOpenWithDialog((model) => {
			this.replace(model);
		});
	},

	onClickRemove: function() {
		this.remove(this.getCurrentItem().model);
	},

	onClickAddAfter: function() {
		this.showOpenWithDialog((model) => {
			this.add(model, {
				at: this.getIndex() + 1
			});
		});
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('items').onKeyDown(event);
	}
});
