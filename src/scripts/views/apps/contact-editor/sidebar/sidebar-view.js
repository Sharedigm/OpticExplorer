/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import ContainableSelectable from '../../../../views/behaviors/containers/containable-selectable.js';
import ContactsPanelView from '../../../../views/apps/contact-editor/sidebar/panels/contacts-panel-view.js';

export default SideBarView.extend(_.extend({}, ContainableSelectable, {

	//
	// attributes
	//

	panels: ['contacts'],

	//
	// attribute methods
	//

	enabled: function() {
		return {
			'contacts': !application.isAdmin()
		};
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('contacts')) {
			this.getChildView('contacts').each(callback, filter, options);
		}
	},

	//
	// setting methods
	//

	setSelected: function(model, options) {
		this.getChildView('contacts').setSelectedModel(model, options);
		
		// scroll into view
		//
		this.scrollToView(this.getChildView('contacts').getSelected()[0]);
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'contacts':
				this.showContactsPanel();
				break;
		}
	},

	showContactsPanel: function() {
		this.showChildView('contacts', new ContactsPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		}));		
	}
}));