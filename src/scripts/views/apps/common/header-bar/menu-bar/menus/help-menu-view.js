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
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';
import AddressBar from '../../../../../../utilities/web/address-bar.js';

export default MenuView.extend({

	//
	// querying methods
	//

	visible: function() {
		return {
			'view-about-info': application.hasApp('help_viewer'),
			'view-app': application.hasApp('help_viewer') && config.defaults.help.show_app,
			'view-topic': application.hasApp('topic_viewer') && config.defaults.help.show_topic,
			'contact-us': config.defaults.help.show_contact
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

	getItems: function() {
		if (this.constructor.items) {
			return this.constructor.items;
		}

		// call superclass method
		//
		let items = MenuView.prototype.getItems.call(this);

		// append app name to first item
		//
		if (items && items[0]) {
			items[0].name = items[0].name + ' ' + this.getAppName();
		}

		// store for future reference
		//
		this.constructor.items = items;

		return items;
	},

	//
	// rendering methods
	//

	showHelp: function(url) {
		application.launch('help_viewer', {
			url: url
		});
	},

	showHelpFile: function() {
		application.launch('pdf_viewer', {
			model: new File({
				path: config.defaults.help.docs
			})
		});
	},

	showHelpTopic: function(topic) {
		application.launch('topic_viewer', {
			topic: topic,

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

	//
	// mouse event handling methods
	//

	onClickViewAboutInfo: function() {
		this.showHelp(this.getUrl());
	},

	onClickViewApp: function() {
		this.showHelp();
	},

	onClickViewPdf: function() {
		this.showHelpFile();
	},

	onClickViewTopic: function() {
		import(
			'../../../../../../models/topics/topic.js'
		).then((Topic) => {
			this.showHelpTopic(new Topic.default({
				name: config.defaults.help.topic
			}));
		});
	},

	onClickContactUs: function() {
		application.showUrl(AddressBar.get('base') + '#contact');
	}
});