/******************************************************************************\
|                                                                              |
|                              help-index-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing help pages.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Section from '../../models/indices/section.js';
import BaseView from '../../views/base-view.js';
import SectionIndexView from '../../views/apps/help-viewer/sidebar/indices/section-index-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-question-circle"></i>Help</h1>
		
		<ol class="breadcrumb">
			<li><i class="fa fa-question-circle"></i>Help</li>
		</ol>
		
		<div class="content">
			<h2 id="table-of-contents">Table of Contents</h2>
			<div class="index">
				<div class="items"></div>
			</div>
		</div>
	`),

	regions: {
		items: '.items'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.model = new Section({
			name: 'Table of Contents',
			url: '#help',
			top: true,
			items: Section.parse(config.help.items, '#help')
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			version: config.help.version,
			description: config.help.description
		};
	},

	onRender: function() {
		this.showChildView('items', new SectionIndexView({
			model: this.model,

			// capabilities
			//
			deselectable: false,
			editable: false,

			// callbacks
			//
			onselect: (item) => {
				if (item.model.has('items')) {

					// expand secton
					//
					item.expand();
				} 

				// show in new page
				//
				application.showUrl(item.model.get('url'))
			}
		}));

		// uncollapse view
		//
		this.$el.find('.collapsed').removeClass('collapsed');
	}
});