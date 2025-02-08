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

		// post options
		//
		'click .edit': 'onClickEditItem',
		'click .delete': 'onClickDeleteItem'
	},

	//
	// querying methods
	//

	disabled: function() {
		let post = this.parent.app.model;
		let isEditable = post && post.isOwnedBy(application.session.user);

		return {
			'edit.post': !isEditable,
			'delete.post': !isEditable
		};
	},

	//
	// setting methods
	//

	setMenuMode: function(mode) {
		this.$el.find('.option').hide();
		this.$el.find('.' + mode + '.option').show();
	},

	//
	// mouse event handling methods
	//

	onClickEditItem: function() {
		if (this.parent.app.selected) {
			let model = this.parent.app.selected.model;

			// check permissions
			//
			if (!model.isOwnedBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to edit this item."
				});

				return;
			}

			// edit item
			//
			this.parent.app.selected.edit();

		// edit post
		//
		} else {
			this.parent.app.editPost();
		}
	},

	onClickDeleteItem: function() {
		if (this.parent.app.selected) {
			let model = this.parent.app.selected.model;

			// check permissions
			//
			if (!model.isOwnedBy(application.session.user)) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-lock"></i>',
					title: "Permissions Error",
					message: "You do not have permission to delete this item."
				});

				return;
			}

			// delete item
			//
			this.parent.app.selected.delete();

		// delete post
		//
		} else {
			this.parent.app.deletePost();
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(view) {
		this.model = view.model;

		// show / hide applicable menu options
		//
		let model = view.model;
		if (model instanceof Post) {
			this.setMenuMode('post');
		} else if (model instanceof Comment) {
			this.setMenuMode('comment');
		} else if (model instanceof Reply) {
			this.setMenuMode('reply');
		} else {
			this.setMenuMode();
		}

		// set enabled / disabled state
		//
		let editable = model && model.isOwnedBy(application.session.user);
		if (editable) {
			this.setItemDisabled('edit', false);
			this.setItemDisabled('delete', false);
		} else {
			this.setItemDisabled('edit', true);
			this.setItemDisabled('delete', true);
		}
	},

	onDeselect: function() {
		this.$el.find('.option').hide();
		this.$el.find('.post.option').show();
	}
});