/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying edit dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Post from '../../../../../../models/topics/post.js';
import Comment from '../../../../../../models/comments/comment.js';
import Reply from '../../../../../../models/comments/reply.js';
import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//

	events: {

		// profile options
		//
		'click .edit.name': 'onClickEditName',
		'click .edit.profile': 'onClickEditProfile',

		// home options
		//
		'click .add.home': 'onClickAddItem',
		'click .edit.home': 'onClickEditItem',
		'click .delete.home': 'onClickDeleteItems',

		// work options
		//
		'click .add.job': 'onClickAddItem',
		'click .edit.job': 'onClickEditItem',
		'click .delete.job': 'onClickDeleteItems',

		// family options
		//
		'click .add.family.member': 'onClickAddItem',
		'click .edit.family.member': 'onClickEditItem',
		'click .delete.family.member': 'onClickDeleteItems',

		// school options
		//
		'click .add.school': 'onClickAddItem',
		'click .edit.school': 'onClickEditItem',
		'click .delete.school': 'onClickDeleteItems',

		// publication options
		//
		'click .add.publications': 'onClickAddItem',
		'click .edit.publications': 'onClickEditItem',
		'click .delete.publications': 'onClickDeleteItems',

		// contact options
		//
		'click .add.contact': 'onClickAddItem',
		'click .edit.contact': 'onClickEditItem',
		'click .delete.contact': 'onClickDeleteItems',

		// affiliation options
		//
		'click .add.affiliations': 'onClickAddItem',
		'click .edit.affiliations': 'onClickEditItem',
		'click .delete.affiliations': 'onClickDeleteItems',

		// topic options
		//
		'click .edit.topic': 'onClickEditTopic',
		'click .delete.topic': 'onClickDeleteTopic',

		// post options
		//
		'click .edit.post': 'onClickEditItem',
		'click .delete.post': 'onClickDeleteItems',

		// comment options
		//
		'click .edit.comment': 'onClickEditItem',
		'click .delete.comment': 'onClickDeleteItems',
		
		// reply options
		//
		'click .edit.reply': 'onClickEditItem',
		'click .delete.reply': 'onClickDeleteItems'
	},

	//
	// setting methods
	//

	setMenuMode: function(mode) {
		this.$el.find('li.option').hide();
		this.$el.find('li.' + mode + '.option').show();

		switch (mode) {
			case 'about':
			case 'news':
			case 'connections':
			case 'files':
			case 'photos':
				this.reset();
				this.setItemEnabled('name.option');
				this.setItemEnabled('profile.option');
				break;
			case 'posts':
				this.$el.find('li.post.option').show();
				this.setItemDisabled('edit.post');
				this.setItemDisabled('delete.post');
				break;
			default:
				this.setItemEnabled('add');
				this.setItemDisabled('edit');
				this.setItemDisabled('delete');
		}
	},

	//
	// mouse event handling methods
	//

	onClickEditName: function() {
		this.parent.app.editName();
	},

	onClickEditProfile: function() {
		this.parent.app.editProfile();
	},

	onClickAddItem: function() {
		this.parent.app.addItem();
	},

	onClickEditItem: function() {
		if (this.parent.app.hasSelected()) {
			this.parent.app.getSelected()[0].edit();
		}
	},

	onClickDeleteItems: function(event) {
		if (this.parent.app.hasSelected()) {
			this.parent.app.deleteItems(this.parent.app.getSelected(), {
				confirm: !(event.metaKey || event.ctrlKey)
			});
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(view) {
		if (view.length > 0) {
			view = view[0];
		}
		
		// show / hide applicable menu options
		//
		let model = view.model;
		if (model instanceof Post) {
			this.setMenuMode('posts');
		} else if (model instanceof Comment) {
			this.setMenuMode('comments');
		} else if (model instanceof Reply) {
			this.setMenuMode('replies');
		}

		// set enabled / disabled state
		//
		let editable = !model.isOwnedBy || model.isOwnedBy(application.session.user);
		if (editable) {
			this.setItemEnabled('edit');
			this.setItemEnabled('delete');
		} else {
			this.setItemDisabled('edit');
			this.setItemDisabled('delete');
		}
	},

	onDeselect: function() {
		this.setItemDisabled('edit');
		this.setItemDisabled('delete');
	},

	reset: function() {
		this.$el.find('.option').hide();
		this.$el.find('.name.option').show();
		this.$el.find('.profile.option').show();
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		EditMenuView.prototype.onRender.call(this);

		// set initial menu state
		//
		this.reset();
	}
});