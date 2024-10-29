/******************************************************************************\
|                                                                              |
|                                  permissions.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for dealing with Unix style file permissions.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	indices: {
		'owner': {
			'r': 0,
			'w': 1,
			'x': 2
		},
		'group': {
			'r': 3,
			'w': 4,
			'x': 5
		},
		'other': {
			'r': 6,
			'w': 7,
			'x': 8
		}
	},

	//
	// querying methods
	//

	isReadable: function(permissions, group) {
		return this.octalToString(permissions)[this.indices[group].r] == 'r';
	},

	isWritable: function(permissions, group) {
		return this.octalToString(permissions)[this.indices[group].w] == 'w';
	},

	isExecutable: function(permissions, group) {
		return this.octalToString(permissions)[this.indices[group].x] == 'x';
	},

	//
	// converting methods
	//

	byGroup: function(permissions, group) {
		return {
			readable: this.isReadable(permissions, group),
			writable: this.isWritable(permissions, group),
			executable: this.isExecutable(permissions, group),				
		};
	},
	
	toObject: function(permissions) {
		return {
			owner: this.byGroup(permissions, 'owner'),
			group: this.byGroup(permissions, 'group'),
			other: this.byGroup(permissions, 'other')
		};
	},

	octalDigitToString: function(digit) {
		let binary = digit.toString(2);
		let string = '';
		string += (parseInt(binary[0])? 'r' : '-');
		string += (parseInt(binary[1])? 'w' : '-');
		string += (parseInt(binary[2])? 'x' : '-');
		return string;
	},

	octalToString: function(octal) {
		let string = '';
		for (let i = 0; i < octal.length; i++) {
			string += this.octalDigitToString(parseInt(octal[i]));
		}
		return string;
	},

	stringToOctalDigit: function(string) {
		let value = 0;

		// convert to numeric
		//
		let placeValue = 1;
		for (let i = 0; i < 3; i++) {
			value += string[2 - i] == '-'? 0 : placeValue;
			placeValue *= 2;
		}
		return value;
	},

	stringToOctal: function(string) {
		let octal = '';
		octal += this.stringToOctalDigit(string.substr(0, 3));
		octal += this.stringToOctalDigit(string.substr(3, 6));
		octal += this.stringToOctalDigit(string.substr(6, 9));
		return octal;
	},

	//
	// setting methods
	//

	setReadable: function(permissions, group, readable) {
		let string = this.octalToString(permissions);
		string = string.replaceAt([this.indices[group].r], (readable? 'r' : '-'));
		return this.stringToOctal(string);
	},

	setWritable: function(permissions, group, writable) {
		let string = this.octalToString(permissions);
		string = string.replaceAt([this.indices[group].w], (writable? 'w' : '-'));
		return this.stringToOctal(string);
	},

	setExecutable: function(permissions, group, executable) {
		let string = this.octalToString(permissions);
		string = string.replaceAt([this.indices[group].x], (executable? 'x' : '-'));
		return this.stringToOctal(string);
	}
};