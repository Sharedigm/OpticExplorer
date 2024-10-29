/******************************************************************************\
|                                                                              |
|                              post-attachments.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of post attachments.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PostAttachment from '../../models/topics/post-attachment.js';
import TimestampedCollection from '../../collections/utilities/timestamped-collection.js';

export default TimestampedCollection.extend({

	//
	// attributes
	//

	model: PostAttachment,

	//
	// ajax methods
	//

	fetchPublic: function(options) {
		return this.fetch(_.extend(options, {
			url: PostAttachment.prototype.urlRoot + '/public',
			silent: true
		}));
	},
});