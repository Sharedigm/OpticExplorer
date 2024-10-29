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
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" class="about profile option">
			<a class="edit-name"><i class="fa fa-font"></i>Edit Name</a>
		</li>
		
		<li role="presentation" class="about profile option">
			<a class="edit-profile"><i class="fa fa-pencil-alt"></i>Edit Profile</a>
		</li>
		
		<li role="presentation" class="home option" style="display:none">
			<a class="add home"><i class="fa fa-plus"></i>Add Home</a>
		</li>
		
		<li role="presentation" class="home option" style="display:none">
			<a class="edit home"><i class="fa fa-pencil-alt"></i>Edit Home</a>
		</li>
		
		<li role="presentation" class="home option" style="display:none">
			<a class="delete home"><i class="fa fa-trash-alt"></i>Delete Homes<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="work option" style="display:none">
			<a class="add job"><i class="fa fa-plus"></i>Add Job</a>
		</li>
		
		<li role="presentation" class="work option" style="display:none">
			<a class="edit job"><i class="fa fa-pencil-alt"></i>Edit Job</a>
		</li>
		
		<li role="presentation" class="work option" style="display:none">
			<a class="delete job"><i class="fa fa-trash-alt"></i>Delete Jobs<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="family option" style="display:none">
			<a class="add family member"><i class="fa fa-plus"></i>Add Family Member</a>
		</li>
		
		<li role="presentation" class="family option" style="display:none">
			<a class="edit family member"><i class="fa fa-pencil-alt"></i>Edit Family Member</a>
		</li>
		
		<li role="presentation" class="family option" style="display:none">
			<a class="delete family member"><i class="fa fa-trash-alt"></i>Delete Family Members<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="school option" style="display:none">
			<a class="add school"><i class="fa fa-plus"></i>Add School</a>
		</li>
		
		<li role="presentation" class="school option" style="display:none">
			<a class="edit school"><i class="fa fa-pencil-alt"></i>Edit School</a>
		</li>
		
		<li role="presentation" class="school option" style="display:none">
			<a class="delete school"><i class="fa fa-trash-alt"></i>Delete Schools<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="contact option" style="display:none">
			<a class="add contact"><i class="fa fa-plus"></i>Add Contact</a>
		</li>
		
		<li role="presentation" class="contact option" style="display:none">
			<a class="edit contact"><i class="fa fa-pencil-alt"></i>Edit Contact</a>
		</li>
		
		<li role="presentation" class="contact option" style="display:none">
			<a class="delete contact"><i class="fa fa-trash-alt"></i>Delete Contacts<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="affiliations option" style="display:none">
			<a class="add affiliation"><i class="fa fa-plus"></i>Add Affiliation</a>
		</li>
		
		<li role="presentation" class="affiliations option" style="display:none">
			<a class="edit affiliation"><i class="fa fa-pencil-alt"></i>Edit Affiliation</a>
		</li>
		
		<li role="presentation" class="affiliations option" style="display:none">
			<a class="delete affiliation"><i class="fa fa-trash-alt"></i>Delete Affiliations<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="post option" style="display:none">
			<a class="edit post"><i class="fa fa-pencil-alt"></i>Edit Post<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="post option" style="display:none">
			<a class="delete post"><i class="fa fa-trash-alt"></i>Delete Posts<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="comment option" style="display:none">
			<a class="edit comment"><i class="fa fa-pencil-alt"></i>Edit Comment<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="comment option" style="display:none">
			<a class="delete comment"><i class="fa fa-trash-alt"></i>Delete Comment<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="reply option" style="display:none">
			<a class="edit reply"><i class="fa fa-pencil-alt"></i>Edit Reply<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="reply option" style="display:none">
			<a class="delete reply"><i class="fa fa-trash-alt"></i>Delete Reply<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="connections option" style="display:none">
			<a class="delete connections"><i class="fa fa-trash-alt"></i>Delete Connections</a>
		</li>
		
		<li role="presentation" class="sharing option" style="display:none">
			<a class="delete shares"><i class="fa fa-trash-alt"></i>Delete Shares<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="sharing option" style="display:none">
			<a class="edit link"><i class="fa fa-pencil-alt"></i>Edit Link</a>
		</li>
		
		<li role="presentation" class="sharing option" style="display:none">
			<a class="copy link"><i class="fa fa-copy"></i>Copy Link</a>
		</li>
		
		<li role="presentation" class="sharing option" style="display:none">
			<a class="delete link"><i class="fa fa-trash-alt"></i>Delete Link<span class="shortcut">delete</span></a>
		</li>
	`),

	events: {

		// profile options
		//
		'click .edit-name': 'onClickEditName',
		'click .edit-profile': 'onClickEditProfile',

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

		// contact options
		//
		'click .add.contact': 'onClickAddItem',
		'click .edit.contact': 'onClickEditItem',
		'click .delete.contact': 'onClickDeleteItems',

		// affiliation options
		//
		'click .add.affiliation': 'onClickAddItem',
		'click .edit.affiliation': 'onClickEditItem',
		'click .delete.affiliation': 'onClickDeleteItems',

		// connections options
		//
		'click .delete.connections': 'onClickDeleteItems',

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
		this.$el.find('.option').hide();
		this.$el.find('.' + mode + '.option').show();

		if (mode == 'posts') {
			this.$el.find('.post.option').show();
			this.setItemDisabled('edit.post', true);
			this.setItemDisabled('delete.post', true);
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
			this.setMenuMode('post');
		} else if (model instanceof Comment) {
			this.setMenuMode('comment');
		} else if (model instanceof Reply) {
			this.setMenuMode('reply');
		}

		// set enabled / disabled state
		//
		let editable = !model.isOwnedBy || model.isOwnedBy(application.session.user);
		if (editable) {
			this.setItemDisabled('edit', false);
			this.setItemDisabled('delete', false);
		} else {
			this.setItemDisabled('edit', true);
			this.setItemDisabled('delete', true);
		}
	},

	onDeselect: function() {
		this.setItemDisabled('edit', true);
		this.setItemDisabled('delete', true);
	}
});