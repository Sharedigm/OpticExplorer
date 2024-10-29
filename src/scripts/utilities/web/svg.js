/******************************************************************************\
|                                                                              |
|                                   svg.js                                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose HTML formatting utilities.        |
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
	inline: (selector) => {
		$(selector).each((index, element) => {
			let $img = $(element);
			let imgID = $img.attr('id');
			let imgClass = $img.attr('class');
			let imgURL = $img.attr('src');

			// make image svgs into inline svgs
			//
			$.get(imgURL, (data) => {

				// Get the SVG tag, ignore the rest
				//
				let $svg = $(data).find('svg');

				// Add replaced image's ID to the new SVG
				//
				if (typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}

				// Add replaced image's classes to the new SVG
				//
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass+' replaced-svg');
				}

				// Remove any invalid XML tags as per http://validator.w3.org
				//
				$svg = $svg.removeAttr('xmlns:a');

				// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
				// 
				if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
					$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
				}

				// Replace image with new SVG
				//
				$img.replaceWith($svg);
			}, 'xml');
		});
	}
};