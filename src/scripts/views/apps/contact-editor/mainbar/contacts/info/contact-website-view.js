/******************************************************************************\
|                                                                              |
|                           contact-website-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a contact's website info.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CardView from '../../../../../../views/items/cards/card-view.js';
import Expandable from '../../../../../../views/behaviors/expanders/expandable.js';
import HtmlUtils from '../../../../../../utilities/web/html-utils.js';
import '../../../../../../utilities/scripting/string-utils.js';
import '../../../../../../utilities/time/date-utils.js';

export default CardView.extend(_.extend({}, Expandable, {

	//
	// attributes
	//

	className: 'expandable item',

	template: template(`
		<div class="card">
		
			<div class="icon">
				<%= icon %>
			</div>
		
			<div class="info">
				<div class="row">
					<div class="title">			
						<a href="<%= href %>" target="_blank"><%= url %></a>
					</div>
				</div>
				
				<div class="row">
					<% if (website_kind) { %><span class="details"><%= website_kind.isCapitalized()? website_kind : website_kind.toTitleCase() %> Website</span><% } %>
				</div>
			</div>
		</div>
	`),
	editable: false,

	events: _.extend({}, CardView.prototype.events, Expandable.events),

	//
	// getting methods
	//

	getIcon: function() {
		switch (this.model.get('website_kind')) {
			case 'homepage':
				return '<i class="fa fa-home form-icon"></i>';
			case 'blog':
				return '<i class="fa fa-comment form-icon"></i>';
			case 'photos':
				return '<i class="fa fa-camera form-icon"></i>';
			case 'videos':
				return '<i class="fa fa-video form-icon"></i>';
			case 'music':
				return '<i class="fa fa-music form-icon"></i>';
			case 'portfilio':
				return '<i class="fa fa-briefcase form-icon"></i>';
			case 'business':
				return '<i class="fa fa-money-bill form-icon"></i>';
			case 'personal':
				return '<i class="fa fa-smile form-icon"></i>';
			case 'social':
				return '<i class="fa fa-users form-icon"></i>';
			case 'Facebook':
				return '<i class="fab fa-facebook-square form-icon"></i>';
			case 'LinkedIn':
				return '<i class="fab fa-linkedin-square form-icon"></i>';
			case 'Twitter':
				return '<i class="fab fa-twitter-square form-icon"></i>';
			case 'Instagram':
				return '<i class="fab fa-instagram form-icon"></i>';
			case 'Snapchat':
				return '<i class="fab fa-snapchat-ghost form-icon"></i>';
			case 'Pinterest':
				return '<i class="fab fa-pinterest form-icon"></i>';
			case 'Etsy':
				return '<i class="fab fa-etsy form-icon"></i>';
			case 'Flickr':
				return '<i class="fab fa-flickr form-icon"></i>';
			case 'GitHub':
				return '<i class="fab fa-github form-icon"></i>';
			case 'YouTube':
				return '<i class="fab fa-youtube form-icon"></i>';
			case 'Vimeo':
				return '<i class="fab fa-vimeo form-icon"></i>';
			case 'WordPress':
				return '<i class="fab fa-wordpress form-icon"></i>';
			default:
				return '<i class="fa fa-cloud form-icon"></i>';
		}
	},

	getDescription: function() {
		return this.model.get('url') || "this website";
	},

	//
	// opening methods
	//

	open: function() {
		if (this.options.editable) {
			this.edit();
		}
	},

	edit: function() {
		import(
			'../../../../../../views/apps/contact-editor/dialogs/contacts/edit/contacts/edit-user-website-dialog-view.js'
		).then((EditUserWebsiteDialogView) => {
			
			// show edit dialog
			//
			application.show(new EditUserWebsiteDialogView.default({
				model: this.model,

				// callbacks
				//
				onchange: () => this.onChange()
			}));
		});
	},

	delete: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + this.getDescription() + ' from your contacts?',

				// callbacks
				//
				accept: () => {
					this.delete(_.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {

			// delete user website
			//
			this.model.destroy(options);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let protocol = this.model.get('protocol');
		let url = this.model.get('url');

		// strip protocol from url
		//
		if (url.startsWith('http')) {
			url = url.replace('http://', '');
		} else if (url.startsWith('https')) {
			url = url.replace('https://', '');
		}

		return {
			icon: this.getIcon(),
			name: this.getName(),
			href: protocol + '://' + url,
			url: HtmlUtils.encode(protocol + '://' + url)
		};
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update
		//
		this.render();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onDoubleClick: function() {
		this.open();
	}
}));