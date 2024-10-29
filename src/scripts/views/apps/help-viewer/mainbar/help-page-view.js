/******************************************************************************\
|                                                                              |
|                               help-page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing help pages.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Page from '../../../../models/indices/page.js';
import PageView from '../../../../views/layout/page-view.js';

export default PageView.extend({

	//
	// attributes
	//

	template: template(''),
	className: 'help',

	events: {
		'click a:not(.lightbox)': 'onClickLink'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show help page contents
		//
		if (this.model && this.model instanceof Page) {
			this.showContents(this.model.get('url'));
		}
	},

	showContents: function(address) {
		let url = './templates/' + address.replace('#help/apps', '#apps').replace('#', '') + '.tpl';

		fetch(url).then((response) => response.text()).then((HelpTemplate) => {

			// replace home breadcrumb with help
			//
			let homeBreadcrumb = '<li><a href="#"><i class="fa fa-home"></i>Home</a></li>';
			let helpBreadcrumb = '<li><a href="#help"><i class="fa fa-question-circle"></i>Help</a></li>';

			// render page
			//
			let html = template(HelpTemplate.replace(homeBreadcrumb, helpBreadcrumb))();
			this.$el.empty().append(html);
			this.onAttach();
		});
	},

	//
	// mouse event handling methods
	//

	onClickLink: function(event) {
		let url = $(event.target).attr('href');

		// check for callback
		//
		if (this.options.onclicklink) {

			// suppress default link handling
			//
			event.preventDefault();

			// perform callback
			//
			this.options.onclicklink(url);
		}
	}
});