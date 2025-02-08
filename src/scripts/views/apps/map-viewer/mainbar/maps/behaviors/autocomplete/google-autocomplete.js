/******************************************************************************\
|                                                                              |
|                             google-autocomplete.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for showing suggestions for place searches.         |
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
	// methods
	//

	submit: function(value, callback) {
		let sessionId = application.session.get('user_id');
		let apiKey = config.autocomplete.google.apiKey;
		let url = config.autocomplete.google.server + '?input=' + encodeURIComponent(value.trim()) + '&key=' + apiKey + '&sessiontoken=' + sessionId;

		$.ajax({
			url: config.servers.api + '/proxy?url=' + encodeURIComponent(url),
			type: 'GET',

			// callbacks
			//
			success: (data) => {
				let array = JSON.parse(data);
				if (array.predictions) {
					let suggestions = [];
					for (let i = 0; i < array.predictions.length; i++) {
						let prediction = array.predictions[i];
						suggestions.push({
							description: prediction.description,
							primary: prediction.structured_formatting.main_text,
							secondary: prediction.structured_formatting.secondary_text
						});
					}
					callback(suggestions);
				}
			}
		})
	}
};