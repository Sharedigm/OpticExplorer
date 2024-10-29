/******************************************************************************\
|                                                                              |
|                               contact-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing contact information.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Contact from '../../../../../models/contacts/contact.js';
import ContactOrganization from '../../../../../models/contacts/organizations/contact-organization.js';
import ContactInfo from '../../../../../collections/contacts/info/contact-info.js';
import ContactOrganizations from '../../../../../collections/contacts/organizations/contact-organizations.js';
import Countries from '../../../../../collections/utilities/countries.js';
import BaseView from '../../../../../views/base-view.js';
import ContactOrganizationPanelView from '../../../../../views/apps/contact-editor/mainbar/contacts/panels/contact-organization-panel-view.js';
import ContactInfoPanelView from '../../../../../views/apps/contact-editor/mainbar/contacts/panels/contact-info-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="contact-info">
		
			<div class="name panel">
				<div class="header">
				
					<div class="name form-group">
						<h1><p class="form-control-static"><%= name %></p></h1>
					</div>
		
					<% if (editable) { %>
					<div class="buttons">
						<button type="button" class="edit success btn btn-sm" data-toggle="tooltip" title="Edit Name" data-placement="bottom">
							<i class="fa fa-pencil-alt"></i>
						</button>
					</div>
					<% } %>
				</div>
			</div>
		
			<div class="organization panel"></div>
			<div class="info panel"></div>
		</div>
	`),

	regions: {
		organization: '.organization.panel',
		info: '.info.panel'
	},

	events: {
		'click .edit.btn': 'onClickEditButton'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.model = new Contact();
		this.collection = new ContactInfo();
		this.countries = new Countries();
	},

	//
	// converting methods
	//

	toJSON: function() {
		let json = this.model.toJSON();

		// add job info
		//
		let job = this.getChildView('job').collection.at(0);
		if (job) {
			json.job = job.toContactInfo();
		}

		// add contact info
		//
		let contacts = this.getChildView('contacts').collection;
		if (contacts.length > 0) {
			json.contacts = contacts.toContactInfo();
		}

		return json;
	},

	toVCF: function() {
		let lines = [];
		lines.push('BEGIN:VCARD');
		lines.push('VERSION:3.0');

		// add contact
		//
		lines = lines.concat(this.model.toVCF());

		// add organization
		//
		let organization = this.getChildView('organization').collection.at(0);
		if (organization) {
			lines = lines.concat(organization.toVCF());
		}

		// add contact info
		//
		let info = this.getChildView('info').collection;
		if (info.length > 0) {
			lines = lines.concat(info.toVCF());
		}

		lines.push('END:VCARD');
		return lines;
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.toVCF().join('\n');
	},

	getSelectedContact: function() {
		return this.showChildView('info').getSelectedModels()[0];
	},

	//
	// setting methods
	//

	setValues: function(model, organization, contactInfo) {
		this.setContact(model);
		this.setOrganization(organization);
		this.setContactInfo(contactInfo || []);			
	},

	setContact: function(contact) {

		// set attributes
		//
		this.model = contact;

		// show contact name
		//
		this.showName(contact? contact.getFullName() : 'Anonymous');

		// update
		//
		this.onChange();
	},

	setOrganization: function(organization) {

		// set attributes
		//
		this.organization = organization;

		// show job info
		//
		this.showOrganizationPanel(organization);
	},

	setContactInfo: function(collection) {

		// set attributes
		//
		this.collection.reset(collection.models);

		// show contact info
		//
		this.showContactInfoPanel(this.collection);
	},

	//
	// vcf setting methods
	//

	setVCF: function(lines) {
		this.setContactVCF(lines);
		this.setOrganizationVCF(lines);
		this.setContactInfoVCF(lines);
	},

	setContactVCF: function(lines) {
		let model = new Contact().fromVCF(lines);
		this.setContact(model);
	},

	setOrganizationVCF: function(lines) {
		let json = ContactOrganization.VCFtoJSON(lines);
		if (json) {
			this.setOrganization(new ContactOrganization(json));
		} else {
			this.setOrganization();
		}		
	},

	setContactInfoVCF: function(lines) {
		let collection = new ContactInfo().fromVCF(lines);
		this.setContactInfo(collection);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: 'Anonymous',

			// options
			//
			title: undefined,
			organization: undefined,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	onRender: function() {

		// fetch countries
		//
		this.request = this.countries.fetch({

			// callbacks
			//
			success: () => {

				// show child vies
				//
				this.showName();
				this.showOrganizationPanel(this.organization);
				this.showContactInfoPanel(this.collection);
			},

			error: (model, response) => {
				
				// show error message
				//
				application.error({
					message: "Could not fetch countries.",
					response: response
				});
			}
		});

		// add tooltip triggers
		//
		this.addTooltips();
	},

	showName: function(name) {
		if (name) {
			this.$el.find('.name p').text(name);
		}
	},

	showOrganizationPanel: function(organization) {
		this.showChildView('organization', new ContactOrganizationPanelView({
			collection: organization? new ContactOrganizations([organization]) : new ContactOrganizations(),
			
			// options
			//
			heading: "Organization",
			multicolumn: this.options.multicolumn,
			countries: this.countries,

			// capabilities
			//
			expandable: this.options.expandable,
			selectable: this.options.selectable,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchange: this.options.onchange,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}));
	},

	showContactInfoPanel: function(collection) {
		this.showChildView('info', new ContactInfoPanelView({
			collection: collection,

			// options
			//
			heading: "Contact Info",
			multicolumn: this.options.multicolumn,
			countries: this.countries,

			// capabilities
			//
			expandable: false,
			selectable: this.options.selectable,
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onchange: this.options.onchange,
			onadd: this.options.onadd,
			onremove: this.options.onremove
		}));
	},
	
	//
	// event handling methods
	//

	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange.call(this);
		}
	},

	//
	// mouse event handling methods
	//

	onClickEditButton: function() {
		import(
			'../../../../../views/apps/contact-editor/dialogs/contacts/edit/edit-contact-name-dialog-view.js'
		).then((EditContactNameDialogView) => {

			// show error message
			//
			application.show(new EditContactNameDialogView.default({
				model: this.model,

				// callbacks
				//
				onchange: (model) => this.setContact(model)
			}));
		});
	}
});