/******************************************************************************\
|                                                                              |
|                                    item.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a file or directory.                          |
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
import User from '../../models/users/user.js';
import Place from '../../models/places/place.js';
import Downloadable from '../../models/storage/behaviors/downloadable.js';
import Compressable from '../../models/storage/behaviors/compressable.js';
import Geolocatable from '../../models/storage/behaviors/geolocatable.js';
import Shareable from '../../models/storage/sharing/behaviors/shareable.js';
import Linkable from '../../models/storage/sharing/behaviors/linkable.js';
import Mailable from '../../models/storage/sharing/behaviors/mailable.js';
import Permissions from '../../utilities/files/permissions.js';
import FileUtils from '../../utilities/files/file-utils.js';
import DateUtils from '../../utilities/time/date-utils.js';
import QueryString from '../../utilities/web/query-string.js';

export default BaseModel.extend(_.extend({}, Downloadable, Compressable, Geolocatable, Shareable, Linkable, Mailable, {

	//
	// attributes
	//
	
	defaults: {
		owner: undefined,
		num_shares: 0,
		num_links: 0,

		// access control
		//
		permissions: '755',

		// timestamps
		//
		created_at: undefined,
		modified_at: undefined,
		accessed_at: undefined
	},

	//
	// querying methods
	//

	is: function(model) {
		return model && model.get && this.get('path') == model.get('path');
	},

	isOwnedBy: function(user) {
		return !this.isShared() && user.isCurrent();
	},

	isNew: function() {
		return !this.has('path');
	},

	isSaved: function() {
		return this.has('path');
	},

	isHidden: function() {
		return FileUtils.getItemName(this.get('path')).startsWith('.');
	},

	isIndexable: function() {
		return false;
	},

	hasIndex: function() {
		return this.has('index_id');
	},

	hasThumbnail: function() {
		return false;
	},

	//
	// directory structure querying methods
	//

	isTop: function() {
		return this.parent == undefined;
	},

	hasTop: function() {
		return true;
	},

	hasParent: function() {
		if (this.parent) {
			return true;
		} else {
			let path = this.get('path');
			if (path) {
				if (path.startsWith('/')) {
					return path.substring(1).contains('/');
				} else {
					return path.contains('/');
				}
			} else {
				return false;
			}
		}
	},

	hasRelated: function(name) {

		// find if item or item's ancestor has attribute
		//
		return this.has(name) || (this.parent? this.parent.hasRelated(name) : false);
	},

	hasLink: function() {

		// check if item or its parents have a link
		//
		if (this.has('link')) {
			return true;
		} else if (this.parent) {
			return this.parent.hasLink();
		} else {
			return false;
		}
	},

	//
	// getting methods
	//

	getName: function() {
		if (this.has('path')) {
			return FileUtils.getFileName(this.get('path'));
		} else if (this.has('link')) {
			return this.get('link').get('target').getName();		
		}
	},

	getBaseName: function() {
		return FileUtils.getItemBaseName(this.getName());
	},

	getDirectoryPath: function() {
		return FileUtils.getDirectoryPath(this.get('path'));
	},

	getDirectory: function() {
		return application.getDirectory(this.getDirectoryPath());
	},

	getRelativePath: function() {
		let path = this.get('path');

		// check for home path
		//
		if (path && path.startsWith('~/')) {
			path = path.substring(2, path.length);
		}

		return path;
	},
	
	getFileExtension: function() {
		return FileUtils.getFileExtension(this.get('path'));
	},

	getDate: function(kind, dateFormat) {
		return this.get(kind).format(DateUtils.getDateFormat(dateFormat));
	},

	getDateString: function(kind, dateFormat) {
		switch (kind) {
			case 'created_at':
				return this.has(kind)? 'created ' + this.getDate(kind, dateFormat) : undefined;
			case 'modified_at':
				return this.has(kind)? 'modified ' + this.getDate(kind, dateFormat) : undefined;
			case 'accessed_at':
				return this.has(kind)? 'accessed ' + this.getDate(kind, dateFormat) : undefined;
		}		
	},

	getLink: function() {

		// get link from item or its parents
		//
		let link = this.get('link');
		if (!link && this.parent) {
			return this.parent.getLink();
		}
		return link;
	},

	getPermissions: function() {
		if (this.hasLink()) {
			return this.getLink().get('target').get('permissions');
		} else {
			return this.get('permissions');
		}
	},

	getCreateDate: function() {
		return this.get('created_at');
	},

	getModifyDate: function() {
		return this.get('modified_at');
	},

	getAccessDate: function() {
		return this.get('accessed_at');
	},

	//
	// permissions querying methods
	//

	isReadable: function() {
		return this.isReadableBy(application.session.user);
	},

	isWritable: function() {
		return this.isWritableBy(application.session.user);
	},

	isExecutable: function() {
		return this.isExecutableBy(application.session.user);
	},

	//
	// user permissions querying methods
	//

	isReadableBy: function(user) {
		let permissions = this.getPermissions() || '755';
		let group = user? user.getGroup(this) : 'other';
		return Permissions.isReadable(permissions, group);
	},

	isWritableBy: function(user) {
		let permissions = this.getPermissions() || '755';
		let group = user? user.getGroup(this) : 'other';
		return Permissions.isWritable(permissions, group);
	},

	isExecutableBy: function(user) {
		let permissions = this.getPermissions() || '755';
		let group = user? user.getGroup(this) : 'other';
		return Permissions.isExecutable(permissions, group);
	},

	//
	// metadata querying methods
	//

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'size':
				return true;
			case 'create_date':
				return this.has('created_at');
			case 'modify_date':
				return this.has('modified_at');
			case 'access_date':
				return this.has('accessed_at');
			default:
				return this.has(attributeName);
		}
	},

	getAttribute: function(attributeName, preferences) {	
		switch (attributeName) {
			case 'size':
				return this.getSize(preferences? preferences.get('show_hidden_files') : undefined);
			case 'create_date':
				return this.getDateString('created_at', preferences? preferences.get('date_format') : undefined);
			case 'modify_date':
				return this.getDateString('modified_at', preferences? preferences.get('date_format') : undefined);
			case 'access_date':
				return this.getDateString('accessed_at', preferences? preferences.get('date_format') : undefined);
			default:
				return this.get(attributeName);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'size':
				return this.getSortableSize();
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
	// data getting methods
	//

	getData: function(data) {

		// set optional parameter defaults
		//
		if (!data) {
			data = {};
		}

		// add path to data
		//
		if (this.has('path') && !this.has('link')) {
			data.path = this.getRelativePath('path');
		}

		// add image's map data
		//
		if (this.parent && this.parent.parseKML) {

			// add map link id
			//
			if (this.parent.has('link')) {
				data.map_link_id = this.parent.get('link').get('id');

			// add map share id
			//
			} else if (this.parent.has('share_id')) {
				data.map_share_id = this.parent.get('share_id');
			}			
		}

		// add volume info
		//
		if (this.hasRelated('volume')) {
			data.volume = this.getRelated('volume');
		}

		// add sharing info
		//
		if (this.hasRelated('share_id')) {
			data.share_id = this.getRelated('share_id');
		}

		// add file info
		//
		if (this.hasRelated('file_id')) {
			data.file_id = this.getRelated('file_id');
		}

		// add link to data
		//
		if (this.hasRelated('link')) {
			data = this.getRelated('link').getData(data);
		}

		// add user public id to data
		//
		if (this.hasRelated('public_id')) {
			data.public_id = this.getRelated('public_id');
		}

		// add post attachment id to data
		//
		if (this.hasRelated('post_attachment_id')) {
			data.post_attachment_id = this.getRelated('post_attachment_id');
		} else if (this.hasRelated('comment_attachment_id')) {
			data.comment_attachment_id = this.getRelated('comment_attachment_id');
		} else if (this.hasRelated('reply_attachment_id')) {
			data.reply_attachment_id = this.getRelated('reply_attachment_id');
		} else if (this.hasRelated('chat_attachment_id')) {
			data.chat_attachment_id = this.getRelated('chat_attachment_id');
		}

		return data;
	},

	getQueryString: function(options) {
		return QueryString.encode(this.getData(options));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = BaseModel.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.owner) {
			data.owner = new User(data.owner, {
				parse: true
			});
		}

		// parse place
		//
		if (data.place) {
			data.place = new Place(data.place, {
				parse: true
			});
		}

		// parse timestamps
		//
		if (data.created_at) {
			data.created_at = new Date(data.created_at * 1000);
		}
		if (data.modified_at) {
			data.modified_at = new Date(data.modified_at * 1000);
		}
		if (data.accessed_at) {
			data.accessed_at = new Date(data.accessed_at * 1000);
		}

		return data;
	}
}), {
	
	//
	// static methods
	//

	getBaseName: function(path) {
		if (!path) {
			return '';
		}

		// return string after the last slash
		//
		if (path.contains('/')) {
			return path.substr(path.lastIndexOf('/') + 1, path.length);
		} else if (path.contains('\\')) {
			return path.substr(path.lastIndexOf('\\') + 1, path.length);
		} else {
			return path;
		}
	}
});