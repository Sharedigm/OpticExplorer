/******************************************************************************\
|                                                                              |
|                             topic-form-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a editable form view of a post topic.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../../models/storage/directories/directory.js';
import Topic from '../../../../../models/topics/topic.js';
import FormView from '../../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="items">
			<div class="icon-grid">
				<div class="item" style="height:75px">
					<div class="row">
						<div class="icon">
							<%= icon %>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="name form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= name %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is the name of the topic."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="icon-path form-group" style="margin:10px 0">
			<label class="control-label"><i class="fa fa-image"></i>Icon</label>
			<div class="controls">
		
				<div class="control-inline">
					<span class="path"><%= icon_path %></span>
				</div>
		
				<div class="buttons-inline">
					<button type="button" class="change success btn btn-sm" data-toggle="tooltip" title="Change" data-placement="top">
						<i class="fa fa-folder"></i>
					</button>
					<button type="button" class="clear warning btn btn-sm" data-toggle="tooltip" title="Clear" data-placement="top">
						<i class="fa fa-xmark"></i>
					</button>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Icon Path Folder" data-content="This is the image file to display to identify the topic." style="display:none"></i>
			</div>
		</div>
		
		<div class="description form-group" style="margin:10px 0">
			<label class="control-label"><i class="fa fa-quote-left"></i>Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="3" maxlength="1000"><%= description %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Description" data-content="This is a description of the topic."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="keywords form-group">
			<label class="control-label"><i class="fa fa-key"></i>Keywords</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" value="<%= keywords %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Keywords" data-content="This is a set of keywords to make the topic easier to find."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="privacy form-group">
			<label class="control-label"><i class="fa fa-lock"></i>Privacy</label>
			<div class="controls">
		
				<div class="radio-inline">
					<label><input type="radio" name="privacy" value="connections"<% if (!public && !private) { %> checked<% } %>><i class="fa fa-user-friends" data-toggle="tooltip" title="Connections"></i></label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="privacy" value="private"<% if (private) { %> checked<% } %>><i class="fa fa-lock" data-toggle="tooltip" title="Private (Invitation Only)"></i></label>
				</div>
		
				<div class="radio-inline">
					<label><input type="radio" name="privacy" value="public"<% if (public) { %> checked<% } %>><i class="fa fa-globe" data-toggle="tooltip" title="Public"></i></label>
				</div>
		
				<i class="active fa fa-question-circle" data-toggle="popover" title="Privacy" data-content="This is defines who can view this topic."></i>
			</div>
		</div>
	`),

	events: _.extend({}, FormView.prototype.events, {
		'click .icon-path button.change': 'onClickChangeIconPath',
		'click .icon-path button.clear': 'onClickClearIconPath'
	}),

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'icon_path':
				return this.$el.find('.icon-path .path').text();
			case 'description':
				return this.$el.find('.description textarea').val();
			case 'keywords':
				return this.$el.find('.keywords input').val();
			case 'privacy':
				return this.$el.find('.privacy input:checked').val();
		}
	},

	getValues: function() {
		return {
			name: this.getValue('name'),
			icon_path: this.getValue('icon_path'),
			description: this.getValue('description'),
			keywords: this.getValue('keywords'),
			public: this.getValue('privacy') == 'public',
			private: this.getValue('privacy') == 'private',
		};
	},

	//
	// setting methods
	//

	setValue: function(key, value) {
		switch (key) {
			case 'icon_path':
				this.$el.find('.icon-path .path').text(value);
				break;
		}
	},

	setIcon: function(iconPath) {
		this.$el.find('.icon').html(new Topic({
			user: application.session.user,
			icon_path: iconPath
		}).getIcon());
	},

	selectIconPath: function() {

		// load pictures directory
		//
		new Directory({
			path: config.apps.topic_viewer.topic_icon_selector_path
		}).load({

			// callbacks
			//
			success: (model) => {

				// select from directory's parent
				//
				this.showIconPathDialog(model, {
					selected: model.getItemNamed(this.model.get('icon_path'))
				});
			},

			error: () => {

				// select from home directory
				//
				this.showIconPathDialog(application.getDirectory());
			}
		});
	},

	//
	// rendering methods
	//
	
	templateContext: function() {
		return {
			icon: this.model.getIcon()
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'body'
		});
	},

	//
	// dialog rendering methods
	//

	showIconPathDialog: function(directory, options) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show select uploads dialog
			//
			application.show(new OpenItemsDialogView.default({
				model: directory,

				// options
				//
				title: "Select Topic Icon",
				selected: options? options.selected : null,
			
				// callbacks
				//
				onopen: (items) => {

					// update icon path
					//
					if (items.length > 0) {
						let iconPath = items[0].get('path');

						// update form
						//
						this.setValue('icon_path', iconPath);

						// update icon
						//
						this.setIcon(iconPath);

						// update parent
						//
						this.onChange();
					}
				}
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickChangeIconPath: function() {
		this.selectIconPath();
	},

	onClickClearIconPath: function() {
		this.setValue('icon_path', null);
		this.setIcon(null);
	},
});