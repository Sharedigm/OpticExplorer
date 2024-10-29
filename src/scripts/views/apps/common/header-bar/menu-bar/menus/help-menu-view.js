/******************************************************************************\
|                                                                              |
|                              help-menu-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying help dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../../../../models/storage/files/file.js';
import Topic from '../../../../../../models/topics/topic.js';
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';
import AddressBar from '../../../../../../utilities/web/address-bar.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation">
			<a class="view-about-info"><i class="fa fa-info-circle"></i>About <%= app_name %></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<% if (show_app) { %>
		<li role="presentation">
			<a class="view-app"><i class="fa fa-question-circle"></i>View Help Pages</a>
		</li>
		<% } %>

		<% if (show_pdf) { %>
		<li role="presentation">
			<a class="view-pdf"><i class="fa fa-book"></i>View Documentation</a>
		</li>
		<% } %>

		<% if (show_topic) { %>
		<li role="presentation">
			<a class="view-topic"><i class="fa fa-newspaper"></i>Search Community Help</a>
		</li>
		<% } %>

		<% if (show_contact) { %>
		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="contact-us"><i class="fa fa-envelope"></i>Contact Us</a>
		</li>
		<% } %>
	`),

	events: {
		'click .view-about-info': 'onClickViewAboutInfo',
		'click .view-app': 'onClickViewApp',
		'click .view-pdf': 'onClickViewPdf',
		'click .view-topic': 'onClickViewTopic',
		'click .contact-us': 'onClickContactUs'
	},

	//
	// querying methods
	//

	hidden: function() {
		return {
			'search-for-help': !application.isSignedIn()
		};
	},

	//
	// getting methods
	//

	getUrl: function() {
		return '#help/apps/' + this.parent.app.name.replace(/_/g, '-');
	},

	getAppName: function() {
		return config.apps[this.parent.app.name].name;
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			app_name: this.getAppName(),
			show_app: config.defaults.help.show_app,
			show_pdf: config.defaults.help.show_pdf,
			show_topic: config.defaults.help.show_topic,
			show_contact: config.defaults.help.show_contact
		};
	},

	//
	// mouse event handling methods
	//

	onClickViewAboutInfo: function() {
		application.launch('help_viewer', {
			url: this.getUrl()
		});
	},

	onClickViewApp: function() {
		application.launch('help_viewer');
	},

	onClickViewPdf: function() {
		application.launch('pdf_viewer', {
			model: new File({
				path: config.defaults.help.docs
			})
		});
	},

	onClickViewTopic: function() {
		application.launch('topic_viewer', {
			topic: new Topic({
				name: config.defaults.help.topic
			}),

			// options
			//
			search: {
				message: this.getAppName()
			},

			// capabilities
			//
			editable: true
		});
	},

	onClickContactUs: function() {
		application.showUrl(AddressBar.get('base') + '#contact');
	}
});