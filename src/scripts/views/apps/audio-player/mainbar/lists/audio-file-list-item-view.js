/******************************************************************************\
|                                                                              |
|                        audio-file-list-item-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a file within a directory list.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileItemView from '../../../../../views/apps/file-browser/mainbar/files/lists/file-item-view.js';

export default FileItemView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="info">
		
			<div class="status icon"<% if (!is_playing) { %> style="visibility:hidden"<% } %>>
				<i class="fa fa-volume-up"></i>
			</div>
		
			<div class="icon">
				<i class="fa fa-spinner spinning"></i>
				<%= icon %>
			</div>
			
			<span class="name" spellcheck="false"><%= name %></span>
			
			<div class="specifics">
				<span class="details"><%= details %></span>
				<div class="badges"></div>
		
				<% if (owner) { %>
				<div class="owner small tile" data-toggle="tooltip" data-html="true" title="shared by <%= owner.getName() %>">
					<% if (owner.hasProfilePhoto()) { %>
					<div class="thumbnail" style="background-image:url(<%= owner.getProfilePhotoUrl({min_size: 25}) %>)" >
						<img src="<%= owner.getProfilePhotoUrl({min_size: 25}) %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</div>
				<% } %>
			</div>
		</div>
	`),

	events: _.extend({}, FileItemView.prototype.events, {
		'click .status': 'onClickStatus'
	}),

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FileItemView.prototype.initialize.call(this);

		// set initial state
		//
		this.focused = true;	
		
		// listen to model for changes
		//
		this.listenTo(this.model, 'load', this.onLoad);
		this.listenTo(this.model, 'play', this.onPlay);
		this.listenTo(this.model, 'pause', this.onPause);
		this.listenTo(this.model, 'unload', this.onUnload);
	},

	//
	// querying methods
	//

	isPlaying: function() {
		return this.model? this.model.isPlaying() : false;
	},

	//
	// getting methods
	//

	getStatus: function() {
		let icon = this.$el.find('.status i');
		if (icon.hasClass('fa-volume-up')) {
			return 'playing';
		} else if (icon.hasClass('fa-volume-off')) {
			return 'paused';
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.getIcon(),
			name: this.getName(),
			details: this.hasDetails()? decodeURIComponent(escape(this.getDetails())) : undefined,
			owner: this.getOwner(),
			is_playing: this.isPlaying()
		};
	},

	showStatus: function(className) {
		this.$el.find('.status i').attr('class', className);
		this.$el.find('.status').css('visibility', 'visible');		
	},

	hideStatus: function() {
		this.$el.find('.status').css('visibility', 'hidden');
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.showStatus('fa fa-spinner');
		this.listenToOnce(this.model, 'loaded', this.onLoaded);
	},

	onLoaded: function() {
		if (this.focused) {
			this.showStatus('fa fa-volume-off');
		} else {
			this.hideStatus();
		}
	},

	onUnload: function() {
		this.model.stop();
		this.hideStatus();
	},
	
	//
	// play event handling methods
	//

	onPlay: function() {
		if (this.focused) {
			this.showStatus('fa fa-volume-up');
		}
	},

	onPause: function() {
		if (this.focused) {
			this.showStatus('fa fa-volume-off');
		}
	},

	//
	// mouse event handling methods
	//

	onClickStatus: function() {
		switch (this.getStatus()) {
			case 'playing':

				// perform callback
				//
				if (this.options.onpause) {
					this.options.onpause(this);
				}
				break;
			case 'paused':

				// perform callback
				//
				if (this.options.onplay) {
					this.options.onplay(this);
				}
				break;
		}
	},

	//
	// window event handling methods
	//

	onFocus: function() {
		this.focused = true;
	},

	onBlur: function() {
		this.focused = false;	
	}
});