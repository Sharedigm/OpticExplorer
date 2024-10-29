/******************************************************************************\
|                                                                              |
|                               contact-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the contact us view of the application.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import ContactFormView from '../../views/contact/forms/contact-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-envelope"></i>Contact Us</h1>
		
		<ol class="breadcrumb">
			<li><a href="#"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-envelope"></i>Contact Us</li>
		</ol>
		
		<div class="content">
			<p><%= description %></p>
			<br />

			<div class="panel">
				<div class="contact-form"></div>
			</div>
		</div>
	`),

	regions: {
		form: '.contact-form'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			description: config.defaults.contact.description
		};
	},

	onRender: function() {
		this.showChildView('form', new ContactFormView({
			subjects: config.defaults.contact.subjects,
			label: config.defaults.contact.label
		}));
	}
});