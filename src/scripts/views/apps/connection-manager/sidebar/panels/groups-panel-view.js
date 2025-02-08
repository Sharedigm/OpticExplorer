/******************************************************************************\
|                                                                              |
|                             groups-panel-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a type of sidebar panel.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Group from '../../../../../models/connections/group.js';
import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Connections from '../../../../../collections/connections/connections.js';
import Groups from '../../../../../collections/connections/groups.js';
import Members from '../../../../../collections/connections/members.js';
import SideBarPanelView from '../../../../../views/apps/common/sidebar/panels/sidebar-panel-view.js';
import GroupsView from '../../../../../views/apps/connection-manager/sidebar/groups/groups-view.js';

export default SideBarPanelView.extend({

	//
	// attributes
	//

	className: 'groups panel',

	template: template(`
		<div class="header">
			<label><i class="fa fa-users"></i>Groups</label>
			
			<div class="buttons">
				<button type="button" class="add-group success btn btn-sm" data-toggle="tooltip" title="Add Group">
					<i class="fa fa-plus"></i>
				</button>
			</div>
		</div>
		
		<div class="items"></div>
	`),

	regions: {
		'items': {
			el: '.items',
			replaceElement: true
		}
	},

	events: {
		'click .add-group': 'onClickAddGroup'
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.ondropon == undefined) {
			this.options.ondropon = (items, view) => {

				// add items to group
				//
				this.addMembers(items, view.model);

				// show group
				//
				view.select();
			};
		}
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').numSelected();
		}
	},

	//
	// getting methods
	//

	getSelected: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelected();
		}
	},

	getSelectedModel: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedModel();
		}
	},

	getSelectedModels: function() {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getSelectedModels();
		}
	},
	
	getItemView: function(model) {
		if (this.hasChildView('items')) {
			return this.getChildView('items').getItemView(model);
		}
	},

	//
	// name getting methods
	//

	getNewGroupName: function() {
		return this.collection.getUniqueName(Group.defaultName);
	},

	getModelNames: function(models) {
		let names = [];
		for (let i = 0; i < models.length; i++) {
			names.push(models[i].getName());
		}
		return names;
	},

	//
	// selecting methods
	//

	selectAll: function() {
		this.getChildView('items').selectAll();
	},

	deselectAll: function() {
		this.getChildView('items').deselectAll();
	},
	
	//
	// adding methods
	//

	addGroup: function() {

		// create and save new group
		//
		this.collection.createGroup(this.getNewGroupName(), {

			// callbacks
			//
			success: (model) => {

				// play new sound
				//
				application.play('new');

				// trigger edit mode
				//
				this.getChildView('items').getItemView(model).setEditable();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create new group.",
					response: response
				});
			}
		});
	},

	addMembers: function(users, group) {
		group.add(users, {

			// callbacks
			//
			success: () => {

				// play copy sound
				//
				application.play('copy');

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not add users to group.",
					response: response
				});
			}
		});
	},

	//
	// deleting methods
	//

	deleteMembers: function(members, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Delete Members",
				message: "Are you sure you want to delete " + Connections.getNames(members).toList() + " from your " + members[0].collection.group.get('name') + " group?",

				// callbacks
				//
				accept: () => {
					this.deleteMembers(members, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete members
			//
			new Members(members).destroy({

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');

					// perform callback
					//
					if (this.options.onchange) {
						this.options.onchange();
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete members.",
						response: response
					});
				}
			});
		}
	},

	deleteGroups: function(groups, options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Delete Groups",
				message: "Are you sure you want to delete " + this.getModelNames(groups).toList() + " from your groups?",

				// callbacks
				//
				accept: () => {
					this.deleteGroups(groups, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// remove groups from your groups list
			//
			for (let i = 0; i < groups.length; i++) {
				if (groups[i].collection) {
					groups[i].collection.remove(groups[i]);
				}
			}

			// delete groups
			//
			new Groups(groups).destroy({

				// callbacks
				//
				success: () => {

					// reset selected group
					//
					this.getParentView('app').onDeselectGroup();

					// play delete sound
					//
					application.play('delete');
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not delete groups.",
						response: response
					});
				}
			});
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SideBarPanelView.prototype.onRender.call(this);
		
		// show child views
		//
		this.fetchAndShowGroups();
	},

	fetchAndShowGroups: function() {
		this.collection.fetchByUser(application.session.user, {

			// callbacks
			//
			success: () => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// show list of groups
				//
				this.showGroups();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not fetch user's groups.",
					response: response
				});
			}
		});		
	},

	showGroups: function() {
		this.showChildView('items', new GroupsView({
			collection: this.collection,
			
			// options
			//
			preferences: new UserPreferences({
				view_kind: this.options.view_kind
			}),
			selected: this.app.hasSelectedGroup()? [this.app.getSelectedGroup()] : [],
			empty: "No groups.",

			// capabilities
			//
			selectable: true,
			editable: true,
			draggable: false,
			droppable: true,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropon: this.options.ondropon
		}));
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.showGroups();
	},

	//
	// mouse event handling methods
	//

	onClickAddGroup: function() {
		this.app.showNewGroupDialog();
	}
});