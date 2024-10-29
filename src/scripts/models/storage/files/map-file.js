/******************************************************************************\
|                                                                              |
|                                  map-file.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a map file.                                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import ImageFile from '../../../models/storage/media/image-file.js';
import VideoFile from '../../../models/storage/media/video-file.js';
import Place from '../../../models/places/place.js';
import FileUtils from '../../../utilities/files/file-utils.js';

export default File.extend({

	//
	// attributes
	//

	templates: {
		kml: template(`
			<?xml version="1.0" encoding="UTF-8"?>
			<kml xmlns="http://www.opengis.net/kml/2.2">
			<Document>

			<LookAt>
				<longitude><%= -longitude.toPrecision(7) %></longitude>
				<latitude><%= latitude.toPrecision(7) %></latitude>
				<zoomLevel><%= zoom_level.toPrecision(3) %></zoomLevel>
			</LookAt>

			<% if (photos) { %><%= photos %><% } %><% if (videos) { %><%= videos %><% } %><% if (overlays) { %><%= overlays %><% } %><% if (places) { %><%= places %><% } %></Document>
			</kml>`),

		photo: template(`
			<PhotoOverlay>
				<name><%= name %></name>
			</PhotoOverlay>`),

		video: template(`
			<VideoOverlay>
				<name><%= name %></name>
			</VideoOverlay>`),

		overlay: template(`
			<GroundOverlay>
				<name><%= name %></name>
			</GroundOverlay>`),

		place: template(`
			<Placemark>
				<name><%= name %></name>
				<% if (description) { %><description><%= description %></description><% } %>
				<Point>
					<coordinates><%= -longitude.toPrecision(7) %>,<%= latitude.toPrecision(7) %>,0</coordinates>
				</Point>
				<zoomLevel><%= zoom_level.toPrecision(3) %></zoomLevel>
			</Placemark>`),

		marker: template(`
			<Placemark>
				<name><%= name %></name>
				<% if (description) { %><description><%= description %></description><% } %>
				<Point>
					<coordinates><%= -longitude.toPrecision(7) %>,<%= latitude.toPrecision(7) %>,0</coordinates>
				</Point>
				<zoomLevel><%= zoom_level.toPrecision(3) %></zoomLevel>
				<Icon>
					<path><%= icon_path %></path>
				</Icon>
			</Placemark>`)
	},

	//
	// querying methods
	//

	hasThumbnail: function() {
		return false;
	},

	//
	// file parsing methods
	//

	parseLookAt: function(element) {

		// parse attributes from element
		//
		let latitude = $(element.getElementsByTagName('latitude')[0]).html();
		let longitude = $(element.getElementsByTagName('longitude')[0]).html();
		let zoomLevel = $(element.getElementsByTagName('zoomLevel')[0]).html();

		return new Place({
			latitude: parseFloat(latitude), 
			longitude: parseFloat(-longitude), 
			zoom_level: parseFloat(zoomLevel) || this.getChildView('content').default_zoom_level
		});
	},

	parsePhoto: function(element) {

		// parse attributes from element
		//
		let name = $(element.getElementsByTagName('name')[0]).html();

		// create new image file
		//
		let imageFile = new ImageFile({
			path: name
		});

		// attach photo to map
		//
		imageFile.parent = this;

		return imageFile;
	},

	parseVideo: function(element) {

		// parse attributes from element
		//
		let name = $(element.getElementsByTagName('name')[0]).html();

		// create new video file
		//
		let videoFile = new VideoFile({
			path: name
		});

		// attach video to map
		//
		videoFile.parent = this;

		return videoFile;
	},

	parsePlace: function(element) {

		// parse attributes from element
		//
		let name = $(element.getElementsByTagName('name')[0]).html();
		let icon = element.getElementsByTagName('Icon')[0];
		let iconPath = icon? $(icon.getElementsByTagName('path')[0]).html() : undefined;
		let description = $(element.getElementsByTagName('description')[0]).html();
		let coordinates = $(element.getElementsByTagName('coordinates')[0]).html().split(',');
		let zoomLevel = $(element.getElementsByTagName('zoomLevel')[0]).html();
		
		return new Place({
			name: name,
			icon_path: iconPath,
			description: description,
			latitude: parseFloat(coordinates[1]), 
			longitude: parseFloat(-coordinates[0]), 
			zoom_level: parseFloat(zoomLevel),
			created_at: this.get('created_at'),
			updated_at: this.get('modified_at')
		});
	},

	parseKML: function(text, options) {
		let self = this;
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(text, 'text/xml');
		let photoCount = 0, numPhotos;
		let videoCount = 0, numVideos;
		let overlayCount = 0, numOverlays;

		function isDone() {
			return videoCount == numVideos &&
				photoCount == numPhotos &&
				overlayCount == numOverlays;
		}

		function addPhoto(photo) {

			// fetch photo info
			//
			photo.fetch({

				// callbacks
				//
				success: (photo) => {

					// attach photo to map
					//
					photo.parent = self;

					// add geolocated images
					//
					if (photo.hasGeolocation && photo.hasGeolocation()) {
						if (options.photos && !options.photos.containsPath(photo.get('path'))) {
							options.photos.add(photo);
							if (options && options.onchange) {
								options.onchange();
							}
						}
					}

					// check if we are done
					//
					photoCount++;
					if (isDone()) {
						if (options && options.onload) {
							options.onload();
						}
					}
				}		
			});
		}

		function addVideo(video) {

			// fetch video info
			//
			video.fetch({

				// callbacks
				//
				success: (video) => {

					// attach video to map
					//
					video.parent = self;

					// add geolocated videos
					//
					if (video.hasGeolocation && video.hasGeolocation()) {
						if (options.videos && !options.videos.containsPath(video.get('path'))) {
							options.videos.add(video);
							if (options && options.onchange) {
								options.onchange();
							}
						}
					}

					// check if we are done
					//
					videoCount++;
					if (isDone()) {
						if (options && options.onload) {
							options.onload();
						}
					}
				}		
			});
		}

		function addOverlay(overlay) {

			// fetch video info
			//
			overlay.fetch({

				// callbacks
				//
				success: (overlay) => {

					// attach photo to map
					//
					overlay.parent = self;

					// add geopositioned overlays
					//
					if (overlay.hasGeoposition && overlay.hasGeoposition()) {
						if (options.overlays && !options.overlays.containsPath(overlay.get('path'))) {
							options.overlays.add(overlay);
							if (options && options.onchange) {
								options.onchange();
							}
						}
					}

					// check if we are done
					//
					overlayCount++;
					if (isDone()) {
						if (options && options.onload) {
							options.onload();
						}
					}
				}
			});
		}

		// parse look at from file
		//
		let place = this.parseLookAt(xmlDoc.getElementsByTagName('LookAt')[0]);

		// parse places from file
		//
		if (options && options.places) {
			options.places.reset();
			let elements = xmlDoc.getElementsByTagName('Placemark');
			for (let i = 0; i < elements.length; i++) {
				options.places.add(this.parsePlace(elements[i]));
			}
		}

		// parse photos and videos from file
		//
		if (options && (options.photos || options.videos)) {
			if (options.photos) {
				options.photos.reset();
			}
			if (options.videos) {
				options.videos.reset();
			}
			if (options.overlays) {
				options.overlays.reset();
			}

			// get
			//
			let photos = xmlDoc.getElementsByTagName('PhotoOverlay');
			let videos = xmlDoc.getElementsByTagName('VideoOverlay');
			let overlays = xmlDoc.getElementsByTagName('GroundOverlay');

			if (photos.length > 0 || videos.length > 0 || overlays.length > 0) {

				// parse photos
				//
				numPhotos = photos.length;
				for (let i = 0; i < photos.length; i++) {
					addPhoto(this.parsePhoto(photos[i]));
				}

				// parse videos
				//
				numVideos = videos.length;
				for (let i = 0; i < videos.length; i++) {
					addVideo(this.parseVideo(videos[i]));
				}

				// parse overlays
				//
				numOverlays = overlays.length;
				for (let i = 0; i < overlays.length; i++) {
					addOverlay(this.parsePhoto(overlays[i]));
				}
			}
		}

		return place;
	},

	//
	// kml conversion methods
	//

	photosToKML: function(photos) {
		let kml = '';
		for (let i = 0; i < photos.length; i++) {
			let photo = photos.at(i);
			kml += this.templates.photo({
				name: photo.get('path')
			});
			kml += "\n\n";
		}
		return kml;
	},

	videosToKML: function(videos) {
		let kml = '';
		for (let i = 0; i < videos.length; i++) {
			let video = videos.at(i);
			kml += this.templates.video({
				name: video.get('path')
			});
			kml += "\n\n";
		}
		return kml;
	},

	overlaysToKML: function(overlays) {
		let kml = '';
		for (let i = 0; i < overlays.length; i++) {
			let overlay = overlays.at(i);
			kml += this.templates.overlay({
				name: overlay.get('path')
			});
			kml += "\n\n";
		}
		return kml;
	},

	placesToKML: function (places) {
		let kml = '';
		for (let i = 0; i < places.length; i++) {
			let place = places.at(i);
			if (place.has('icon_path')) {
				kml += this.templates.marker({
					name: place.get('name'),
					icon_path: place.get('icon_path'),
					description: place.get('description'),
					latitude: place.get('latitude'),
					longitude: place.get('longitude'),
					zoom_level: place.get('zoom_level')
				});
			} else {
				kml += this.templates.place({
					name: place.get('name'),
					description: place.get('description'),
					latitude: place.get('latitude'),
					longitude: place.get('longitude'),
					zoom_level: place.get('zoom_level')
				});			
			}
			kml += "\n\n";
		}
		return kml;
	},

	toKML: function(place, options) {
		let kml = this.templates.kml({
			latitude: place.get('latitude'),
			longitude: place.get('longitude'),
			zoom_level: place.get('zoom_level'),
			photos: options && options.photos? this.photosToKML(options.photos) : '',
			videos: options && options.videos? this.photosToKML(options.videos) : '',
			overlays: options && options.overlays? this.overlaysToKML(options.overlays) : '',
			places: options && options.places? this.placesToKML(options.places) : ''
		});

		return kml;
	}
}, {

	//
	// static attributes
	//

	extensions: config.files.maps.extensions,
	defaultName: 'Untitled.kml',

	//
	// static methods
	//

	isValidExtension: function(extension) {
		return extension && this.extensions.contains(extension.toLowerCase());
	},

	isValidPath: function(path) {
		return this.isValidExtension(FileUtils.getFileExtension(path));
	}
});