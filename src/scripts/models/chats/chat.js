/******************************************************************************\
|                                                                              |
|                                   chat.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a text messaging chat session.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';
import Connections from '../../collections/connections/connections.js';
import ChatInvitations from '../../collections/chats/sharing/chat-invitations.js';
import DateUtils from '../../utilities/time/date-utils.js';
import Browser from '../../utilities/web/browser.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		id: undefined,
		users: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/chats',

	//
	// querying methods
	//

	isOnline: function() {

		// get online status of first member
		//
		return this.getFirstOtherMember().isOnline();
	},

	isActive: function() {

		// get active status of first member
		//
		return this.getFirstOtherMember().isActive();
	},

	hasUser: function(user) {
		return this.has('members')? this.get('members').includes(user) : false;
	},

	hasFirstOtherMember: function() {
		let members = this.get('members');
		for (let i = 0; i < members.length; i++) {
			let member = members.at(i);
			if (!member.is(application.session.user)) {
				return true;
			}
		}
		return false;
	},

	hasProfilePhoto: function() {

		// has profile photo of first member
		//
		return this.getFirstOtherMember().hasProfilePhoto();
	},

	//
	// getting methods
	//

	getName: function(options) {

		// set default options
		//
		if (!options) {
			options = {
				short: Browser.device == 'phone'
			};
		}

		return this.getMemberName(this.getFirstOtherMember(), options);
	},

	getMemberName: function(member, options) {
		if (member) {
			let name = options && options.short? member.getShortName() : member.getName();
			let numMembers = this.get('members').length;
			let numOthers = numMembers - 2;

			if (numMembers > 2) {
				name += ' and ' + (numOthers == 1? '1 Other' : numOthers + ' Others');
			}

			return name;
		} else {
			return 'you';
		}
	},

	getUser: function() {
		return this.getFirstOtherMember() || this.getFirstInvitee() || this.getFirstMember();
	},

	getFirstOtherMember: function() {
		let members = this.get('members');
		for (let i = 0; i < members.length; i++) {
			let member = members.at(i);
			if (!member.is(application.session.user)) {
				return member;
			}
		}
	},

	getFirstMember: function() {
		return this.get('members').at(0);
	},

	getFirstInvitee: function() {
		let invitations = this.get('invitations');
		for (let i = 0; i < invitations.length; i++) {
			return invitations.at(i).get('connection');
		}
	},

	getProfilePhotoUrl: function() {

		// get profile photo of first member
		//
		return this.getFirstOtherMember().getProfilePhotoUrl();
	},

	getIcon: function(options) {
		if (this.hasProfilePhoto()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getProfilePhotoUrl(options) + ')"></div>';
		} else {
			return '<i class="fa fa-comments"></i>';
		}
	},

	getDate: function(kind, dateFormat) {
		return this.has(kind)? kind.replace('_at', '') + ' ' + this.get(kind).format(DateUtils.getDateFormat(dateFormat)) : null;
	},

	//
	// attributes getting methods
	//

	getAttribute: function(attributeName, preferences) {
		switch (attributeName) {
			case 'name':
				return this.getName();
			case 'members':
				return this.has('members')? 'member'.toPlural(this.get('members').length) : undefined;
			case 'messages':
				return 'message'.toPlural(this.get('num_messages') || 0);
			case 'create_date':
				return this.getDate('created_at', preferences? preferences.get('date_format') : undefined);
			case 'modify_date':
				return this.getDate('modified_at', preferences? preferences.get('date_format') : undefined);
			case 'access_date':
				return this.getDate('accessed_at', preferences? preferences.get('date_format') : undefined);
			default:
				return this.get(attributeName);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'name':
				return this.getName().toLowerCase();
			case 'members':
				return this.get('members').length;
			case 'messages':
				return this.get('num_messages');
			case 'create_date':
				return this.get('created_at');
			case 'modify_date':
				return this.get('modified_at');
			case 'access_date':
				return this.get('accessed_at');
			default:
				return this.get(attributeName);
		}
	},

	//
	// fetching methods
	//

	removeMember: function(user, options) {
		return $.ajax(_.extend({
			url: this.url() + '/members/' + user.get('id') + '/remove',
			type: 'PUT'
		}, options));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.members) {
			data.members = new Connections(data.members, {
				parse: true
			});
		}
		if (data.invitations) {
			data.invitations = new ChatInvitations(data.invitations, {
				parse: true
			});
		}

		return data;
	}
});