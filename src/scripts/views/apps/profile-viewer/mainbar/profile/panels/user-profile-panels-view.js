/******************************************************************************\
|                                                                              |
|                          user-profile-panels-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's profile info panels.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Countries from '../../../../../../collections/utilities/countries.js';
import BaseView from '../../../../../../views/base-view.js';
import UserSummaryPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-summary-panel-view.js';
import UserHomesPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-homes-panel-view.js';
import UserWorkPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-work-panel-view.js';
import UserFamilyPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-family-panel-view.js';
import UserSchoolsPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-schools-panel-view.js';
import UserPublicationsPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-publications-panel-view.js';
import UserContactsPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-contacts-panel-view.js';
import UserAffiliationsPanelView from '../../../../../../views/apps/profile-viewer/mainbar/profile/panels/user-affiliations-panel-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="tabs vertical">
			<ul class="nav nav-tabs secondary side collapsed-xs" role="tablist">
				<li role="presentation" name="about"<% if (tab == 'about' || !tab) { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".about.tab-pane">
						<i class="fa fa-info-circle"></i>
						<label>About</label>
					</a>
				</li>
		
				<% if (editable || profile.get('homes').length > 0) { %>
				<li role="presentation" name="home"<% if (tab == 'home') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".home.tab-pane">
						<i class="fa fa-home"></i>
						<label>Home</label>
					</a>
				</li>
				<% } %>
		
				<% if (editable || profile.get('jobs').length > 0) { %>
				<li role="presentation" name="work"<% if (tab == 'work') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".work.tab-pane">
						<i class="fa fa-briefcase"></i>
						<label>Work</label>
					</a>
				</li>
				<% } %>
		
				<% if (editable || profile.get('family_members').length > 0) { %>
				<li role="presentation" name="family"<% if (tab == 'family') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".family.tab-pane">
						<i class="fa fa-user-circle"></i>
						<label>Family</label>
					</a>
				</li>
				<% } %>
		
				<% if (editable || profile.get('schools').length > 0) { %>
				<li role="presentation" name="school"<% if (tab == 'school') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".school.tab-pane">
						<i class="fa fa-university"></i>
						<label>School</label>
					</a>
				</li>
				<% } %>
		
				<% if (editable || profile.get('books').length > 0 || profile.get('articles').length > 0 || profile.get('patents').length > 0) { %>
				<li role="presentation" name="publications"<% if (tab == 'publications') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".publications.tab-pane">
						<i class="fa fa-book"></i>
						<label>Writing</label>
					</a>
				</li>
				<% } %>
		
				<% if (editable || profile.get('phones').length > 0 || profile.get('addresses').length > 0 || profile.get('email_addrs').length > 0) { %>
				<li role="presentation" name="contact"<% if (tab == 'contact') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".contact.tab-pane">
						<i class="fa fa-envelope"></i>
						<label>Contact</label>
					</a>
				</li>
				<% } %>
		
				<% if (editable || profile.get('affiliations').length > 0) { %>
				<li role="presentation" name="affiliations"<% if (tab == 'affiliations') { %> class="active"<% } %>>
					<a role="tab" data-toggle="tab" href=".affiliations.tab-pane">
						<i class="fa fa-users"></i>
						<label>Groups</label>
					</a>
				</li>
				<% } %>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="about tab-pane<% if (tab == 'about' || !tab) { %> active<% } %>"></div>
		
				<div role="tabpanel" class="home tab-pane<% if (tab == 'home') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="work tab-pane<% if (tab == 'work') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="publications tab-pane<% if (tab == 'publications') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="family tab-pane<% if (tab == 'family') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="school tab-pane<% if (tab == 'school') { %> active<% } %>"></div>
		
				<div role="tabpanel" class="contact tab-pane<% if (tab == 'contact') { %> active<% } %>"></div>
				
				<div role="tabpanel" class="affiliations tab-pane<% if (tab == 'affiliations') { %> active<% } %>"></div>
			</div>
		</div>
	`),

	regions: {
		about: '.about',
		home: '.home',
		work: '.work',
		family: '.family',
		school: '.school',
		publications: '.publications',
		contact: '.contact',
		affiliations: '.affiliations'
	},

	events: {
		'click .nav-tabs [role="tab"]': 'onClickTab'
	},

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.tab == undefined) {
			this.options.tab = 'about';
		}
		if (this.options.expandable == undefined) {
			this.options.expandable = true;
		}
		if (this.options.selectable == undefined) {
			this.options.selectable = true;
		}
		if (this.options.editable == undefined) {
			this.options.editable = false;
		}
		if (this.options.multicolumn == undefined) {
			this.options.multicolumn = true;
		}

		// check to see if info is available for selected tab
		//
		if (this.options.profile && !this.options.editable) {
			switch (this.options.tab) {
				case 'home':
					if (this.options.profile.get('homes').length == 0) {
						this.setTab('about');
					}
					break;
				case 'work':
					if (this.options.profile.get('jobs').length == 0) {
						this.setTab('about');
					}
					break;
				case 'publications':
					if (this.options.profile.get('publications').length == 0) {
						this.setTab('about');
					}
					break;
				case 'family':
					if (this.options.profile.get('family_members').length == 0) {
						this.setTab('about');
					}
					break;
				case 'school':
					if (this.options.profile.get('schools').length == 0) {
						this.setTab('about');
					}
					break;
				case 'contact':
					if (this.options.profile.get('phones').length == 0 &&
						this.options.profile.get('addresses').length == 0 &&
						this.options.profile.get('email_addrs').length == 0) {
						this.setTab('about');
					}
					break;
				case 'affiliations':
					if (this.options.profile.get('affiliations').length == 0) {
						this.setTab('about');
					}
					break;
			}
		}
	},

	//
	// querying methods
	//

	hasSelected: function() {
		if (this.hasSelectedPanel()) {
			return this.getSelectedPanel().hasSelected();
		}
	},

	hasSelectedPanel: function() {
		return this.hasChildView(this.options.tab);
	},

	//
	// getting methods
	//

	getTab: function() {
		return this.$el.find('.nav-tabs li.active').attr('name');
	},

	getSelected: function() {
		return this.getSelectedPanel().getSelected();
	},

	getSelectedModels: function() {
		return this.getSelectedPanel().getSelectedModels();
	},

	getSelectedPanel: function() {
		return this.getChildView(this.options.tab);
	},
	
	//
	// setting methods
	//

	setTab: function(tab) {

		// update attributes
		//
		this.options.tab = tab;

		// find new url
		//
		let url = '#users/' + (this.model.isCurrent()? 'current' : this.model.get('id')) + '/profile' + (tab != 'about'? '/' + tab : '');
		if (this.options.editable) {
			url += '/edit';
		}

		// update url
		//
		application.navigate(url, {
			trigger: false
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			tab: this.options.tab,
			profile: this.options.profile,

			// capabilities
			//
			editable: this.options.editable
		};
	},

	onRender: function() {

		// show child views
		//
		if (!this.options.countries) {
			this.options.countries = new Countries();
			this.request = this.options.countries.fetch({

				// callbacks
				//
				success: () => this.showPanels(),

				error: (model, response) => {
					
					// show error message
					//
					application.error({
						message: "Could not fetch countries.",
						response: response
					});
				}
			});		
		} else {
			this.showPanels();
		}
	},

	showPanels: function() {

		// show user profile panels
		//
		this.showUserSummaryPanel();
		this.showUserHomesPanel();
		this.showUserWorkPanel();
		this.showUserFamilyPanel();
		this.showUserSchoolsPanel();
		this.showUserPublicationsPanel();
		this.showUserContactsPanel();
		this.showUserAffiliationsPanel();

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'body'
		});	
	},

	//
	// panel rendering methods
	//

	showUserSummaryPanel: function() {
		this.showChildView('about', new UserSummaryPanelView(_.extend({}, this.options, {
			model: this.options.profile,

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-info-circle"></i>',
			heading: "About me"
		})));
	},

	showUserHomesPanel: function() {
		this.showChildView('home', new UserHomesPanelView(_.extend({}, this.options, {
			collection: this.options.profile.get('homes'),

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-home"></i>',
			heading: "My homes"
		})));
	},

	showUserWorkPanel: function() {
		this.showChildView('work', new UserWorkPanelView(_.extend({}, this.options, {
			collection: this.options.profile.get('jobs'),

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-briefcase"></i>',
			heading: "My jobs"
		})));
	},

	showUserFamilyPanel: function() {
		this.showChildView('family', new UserFamilyPanelView(_.extend({}, this.options, {
			collection: this.options.profile.get('family_members'),

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-user-circle"></i>',
			heading: "My family"
		})));
	},

	showUserSchoolsPanel: function() {
		this.showChildView('school', new UserSchoolsPanelView(_.extend({}, this.options, {
			collection: this.options.profile.get('schools'),

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-university"></i>',
			heading: "My education"
		})));
	},

	showUserPublicationsPanel: function() {
		this.showChildView('publications', new UserPublicationsPanelView(_.extend({}, this.options, {
			collection: this.options.profile.getPublications(),

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-book"></i>',
			heading: "My publications"
		})));
	},
	
	showUserContactsPanel: function() {
		this.showChildView('contact', new UserContactsPanelView(_.extend({}, this.options, {
			collection: this.options.profile.getContacts(),

			// options
			//
			user: this.model,
			icon: '<i class="fa fa-envelope"></i>',
			heading: "My contact info"
		})));
	},

	showUserAffiliationsPanel: function() {
		this.showChildView('affiliations', new UserAffiliationsPanelView(_.extend({}, this.options, {
			collection: this.options.profile.get('affiliations'),
			
			// options
			//
			user: this.model,
			icon: '<i class="fa fa-users"></i>',
			heading: "My affiliations"
		})));
	},

	//
	// mouse event handling methods
	//

	onClickTab: function(event) {
		/*
		let className = $(event.target).closest('li').attr('class');
		this.options.tab = className.replace('tab', '').trim();
		*/

		this.options.tab = $(event.target).closest('li').attr('name');

		// perform callback
		//
		if (this.options.onclicktab) {
			this.options.onclicktab(this.options.tab);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});