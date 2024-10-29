/******************************************************************************\
|                                                                              |
|                                search-bar-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for searching files.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import SearchBarView from '../../../../../views/apps/common/header-bar/search-bar/search-bar-view.js';

export default SearchBarView.extend({

	//
	// file attribute searching methods
	//

	showSearchByName: function() {
		import(
			'../../../../../views/apps/common/header-bar/search-bar/searches/search-by-name-view.js'
		).then((SearchByNameView) => {

			// show search
			//
			this.showChildView('searches', new SearchByNameView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByKind: function() {
		import(
			'../../../../../views/apps/common/header-bar/search-bar/searches/search-by-kind-view.js'
		).then((SearchByKindView) => {

			// show search
			//
			this.showChildView('searches', new SearchByKindView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchBySize: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-size-view.js'
		).then((SearchBySizeView) => {

			// show search
			//
			this.showChildView('searches', new SearchBySizeView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByKeyword: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-keyword-view.js'
		).then((SearchByKeywordView) => {

			// show search
			//
			this.showChildView('searches', new SearchByKeywordView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByMeaning: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-meaning-view.js'
		).then((SearchByMeaningView) => {

			// show search
			//
			this.showChildView('searches', new SearchByMeaningView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	//
	// date attribute searching methods
	//

	showSearchByDate: function(kind) {
		import(
			'../../../../../views/apps/common/header-bar/search-bar/searches/search-by-date-view.js'
		).then((SearchByDateView) => {

			// show search
			//
			this.showChildView('searches', new SearchByDateView.default({
				model: this.model,

				// options
				//
				kind: kind
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	//
	// exif attribute searching methods
	//

	showSearchByResolution: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-resolution-view.js'
		).then((SearchByResolutionView) => {

			// show search
			//
			this.showChildView('searches', new SearchByResolutionView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByMakeModel: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-make-model-view.js'
		).then((SearchByMakeModelView) => {

			// show search
			//
			this.showChildView('searches', new SearchByMakeModelView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByFocalLength: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-focal-length-view.js'
		).then((SearchByFocalLengthView) => {

			// show search
			//
			this.showChildView('searches', new SearchByFocalLengthView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByExposure: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-exposure-view.js'
		).then((SearchByExposureView) => {

			// show search
			//
			this.showChildView('searches', new SearchByExposureView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByAperture: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-aperture-view.js'
		).then((SearchByApertureView) => {

			// show search
			//
			this.showChildView('searches', new SearchByApertureView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByIso: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-iso-view.js'
		).then((SearchByIsoView) => {

			// show search
			//
			this.showChildView('searches', new SearchByIsoView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByCaptureDate: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-capture-date-view.js'
		).then((SearchByCaptureDateView) => {

			// show search
			//
			this.showChildView('searches', new SearchByCaptureDateView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	//
	// sharing attribute searching methods
	//

	showSearchSharedWithMe: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-shared-with-me-view.js'
		).then((SearchSharedWithMeView) => {

			// show search
			//
			this.showChildView('searches', new SearchSharedWithMeView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchSharedByMe: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-shared-by-me-view.js'
		).then((SearchSharedByMeView) => {

			// show search
			//
			this.showChildView('searches', new SearchSharedByMeView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	showSearchByLinks: function() {
		import(
			'../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-links-view.js'
		).then((SearchByLinksView) => {

			// show search
			//
			this.showChildView('searches', new SearchByLinksView.default({
				model: this.model
			}));

			// perform callback
			//
			if (this.options.onshow) {
				this.options.onshow();
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		SearchBarView.prototype.onRender.call(this);

		// set search kind
		//
		switch (this.options.kind) {
			
			// file attributes
			//
			case 'name':
				this.showSearchByName();
				break;
			case 'kind':
				this.showSearchByKind();
				break;
			case 'size':
				this.showSearchBySize();
				break;

			// content attributes
			//
			case 'keyword':
				this.showSearchByKeyword();
				break;
			case 'meaning':
				this.showSearchByMeaning();
				break;

			// date attributes
			//
			case 'create_date':
			case 'modify_date':
			case 'access_date':
				this.showSearchByDate(this.options.kind);
				break;

			// exif attributes
			//
			case 'resolution':
				this.showSearchByResolution();
				break;
			case 'make_model':
				this.showSearchByMakeModel();
				break;
			case 'focal_length':
				this.showSearchByFocalLength();
				break;
			case 'exposure':
				this.showSearchByExposure();
				break;
			case 'aperture':
				this.showSearchByAperture();
				break;
			case 'iso':
				this.showSearchByIso();
				break;
			case 'capture_date':
				this.showSearchByCaptureDate();
				break;

			// sharing attributes
			//
			case 'shared_with_me':
				this.showSearchSharedWithMe();
				break;
			case 'shared_by_me':
				this.showSearchSharedByMe();
				break;
			case 'links':
				this.showSearchByLinks();
				break;

			default:
				this.clear();
				break;
		}
	}
});