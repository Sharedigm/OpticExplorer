/******************************************************************************\
|                                                                              |
|                                  contact.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user contact.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {

		// name
		//
		honorific: undefined,
		first_name: undefined,
		preferred_name: undefined,
		middle_name: undefined,
		last_name: undefined,
		titles: undefined,

		// contact info
		//
		organization: undefined,
		info: []
	},

	//
	// getting methods
	//

	getName: function(kind) {
		switch (kind) {
			case 'first':
				return this.get('first_name');
			case 'preferred':
				return this.get('preferred_name');
			case 'middle':
				return this.get('middle_name');
			case 'last':
				return this.get('last_name');
			case 'nick':
				return this.get('preferred_name') || this.get('first_name');
			case 'full':
				return this.getFullName();
			default:
				return this.getShortName();
		}
	},

	getShortName: function() {
		let name = '';

		if (this.has('preferred_name') && this.get('preferred_name') != '') {
			name += this.get('preferred_name').toTitleCase();
		} else {
			name += this.get('first_name');
		}
		if (this.has('last_name')) {
			name += ' ' + this.get('last_name');
		}

		return name;
	},

	getFullName: function() {
		let name = '';

		if (this.has('honorific')) {
			let honorific = this.get('honorific');
			if (honorific != '') {
				name += honorific;
			}
		}
		if (this.has('first_name')) {
			let firstName = this.get('first_name');
			if (firstName != '') {
				if (name != '') {
					name += ' ';
				}
				name += firstName;
			}
		}
		if (this.has('preferred_name')) {
			let preferredName = this.get('preferred_name');
			if (preferredName != '') {
				if (name != '') {
					name += ' ';
				}
				name += '(' + preferredName + ')';
			}
		}
		if (this.has('middle_name')) {
			let middleName = this.get('middle_name');
			if (middleName != '') {
				if (name != '') {
					name += ' ';
				}
				name += middleName;
			}
		}
		if (this.has('last_name')) {
			let lastName = this.get('last_name');
			if (lastName != '') {
				if (name != '') {
					name += ' ';
				}
				name += lastName;
			}
		}
		if (this.has('titles')) {
			let titles = this.get('titles');
			if (titles != '') {
				if (name != '') {
					name += ' ';
				}
				name += titles;
			}
		}

		return name;
	},

	getEmail: function() {
		for (let i = 0; i < this.info.length; i++) {
			let info = this.info[i];
			if (info.has('email_addr')) {
				return info.get('email_addr');
			}
		}
	},

	//
	// converting methods
	//
	
	toVCF: function() {
		let lines = [];
		lines.push('BEGIN:VCARD');
		lines.push('VERSION:3.0');

		// add contact info
		//
		lines = lines.concat(this.constructor.JSONtoVCF(this.attributes));

		// add optional items
		//
		if (this.organization) {
			lines = lines.concat(this.organization.toVCF());
		}
		if (this.info) {
			for (let i = 0; i < this.info.length; i++) {
				lines.push(this.info[i].toVCF());
			}
		}

		lines.push('END:VCARD');
		return lines;
	},

	fromVCF: function(lines) {
		this.set(this.constructor.VCFtoJSON(lines));
		return this;
	}
}, {

	//
	// static methods
	//

	JSONtoVCF: function(json) {
		let lines = [];

		// add name
		//
		let string = '';
		string += (json.last_name || '') + ';';
		string += (json.first_name || '') + ';';
		string += (json.middle_name || '') + ';';
		string += (json.honorific || '') + ';';
		string += (json.titles || '');
		lines.push('N:' + string);

		// add full name
		//
		if (json.full_name) {
			lines.push('FN:' + json.full_name);
		}

		// add nickname
		//
		if (json.preferred_name && json.preferred_name != '') {
			lines.push('NICKNAME:' + json.preferred_name);
		}

		// add gender info
		//
		if (json.gender) {
			lines.push('GENDER:' + json.gender);
		}

		// add profile photo
		//
		if (json.profile_photo) {
			lines.push('PHOTO:' + json.profile_photo);
		}

		return lines;
	},

	VCFtoJSON: function(lines) {
		let json = {};
		let names;

		// parse lines
		//
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// break line into key value pairs
			//
			let pair = line.split(':');
			let key = pair[0];
			let value = pair[1];

			switch (key) {

				// parse name
				//
				case 'N':
					names = value.split(';');
					json.last_name = names[0];
					json.first_name = names[1];
					json.middle_name = names[2];
					json.honorific = names[3];
					json.titles = names[4];
					break;

				// parse nickname
				//
				case 'NICKNAME':
					json.preferred_name = value;
					break;

				// parse gender
				//
				case 'GENDER':
					json.gender = value;
					break;
			}
		}

		return json;
	}
});