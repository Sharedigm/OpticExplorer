/******************************************************************************\
|                                                                              |
|                                  mailable.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a mailable behavior mixin for file system items.         |
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

	//
	// fetching methods
	//

	sendByMail: function(options) {
		return $.ajax(_.extend({}, options, {
			url: this.urlRoot + '/mail',
			type: 'POST',
			data: _.extend({
				'path': this.get('path')
			}, options.data),

			// callbacks
			//
			success: () => {
				options.success();
			},
		}));
	}
};