/******************************************************************************\
|                                                                              |
|                       share-items-message-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing a share invitation message.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import FormView from '../../../../../views/forms/form-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="share-with form-group hidden-xs">
			<label class="control-label"><i class="fa fa-user"></i>Share with</label>
			<div class="controls">
				<div class="items"></div>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="1" maxlength="1000"><%= message %></textarea>
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the message to send with your share invitation."></i>
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
		items: {
			el: '.items',
			replaceElement: true
		}
	},

	//
	// form querying methods
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
		this.showConnections();
	},

	showConnections: function() {
		this.showChildView('items', new UsersView({
			collection: this.collection,

			// options
			//
			preferences: UserPreferences.create('profile_browser', {
				view_kind: 'names',
				detail_kind: null,
				show_hidden_files: true,
				sort_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	}
});
