/******************************************************************************\
|                                                                              |
|                              search-bar-view.js                              |
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
import SearchByNameView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-name-view.js';
import SearchByKindView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-kind-view.js';
import SearchBySizeView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-size-view.js';
import SearchByKeywordView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-keyword-view.js';
import SearchByMeaningView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-meaning-view.js';
import SearchByDateView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-date-view.js';
import SearchByResolutionView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-resolution-view.js';
import SearchByMakeModelView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-make-model-view.js';
import SearchByFocalLengthView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-focal-length-view.js';
import SearchByExposureView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-exposure-view.js';
import SearchByApertureView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-aperture-view.js';
import SearchByIsoView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-iso-view.js';
import SearchByCaptureDateView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-capture-date-view.js';
import SearchSharedWithMeView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-shared-with-me-view.js';
import SearchSharedByMeView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-shared-by-me-view.js';
import SearchByLinksView from '../../../../../views/apps/file-browser/header-bar/search-bar/searches/search-by-links-view.js';

export default SearchBarView.extend({

	//
	// file attribute searching methods
	//

	showSearchByName: function() {

		// show search
		//
		this.showChildView('searches', new SearchByNameView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByKind: function() {

		// show search
		//
		this.showChildView('searches', new SearchByKindView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchBySize: function() {

		// show search
		//
		this.showChildView('searches', new SearchBySizeView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByKeyword: function() {

		// show search
		//
		this.showChildView('searches', new SearchByKeywordView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByMeaning: function() {

		// show search
		//
		this.showChildView('searches', new SearchByMeaningView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	//
	// date attribute searching methods
	//

	showSearchByDate: function(kind) {

		// show search
		//
		this.showChildView('searches', new SearchByDateView({
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
	},

	//
	// exif attribute searching methods
	//

	showSearchByResolution: function() {

		// show search
		//
		this.showChildView('searches', new SearchByResolutionView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByMakeModel: function() {

		// show search
		//
		this.showChildView('searches', new SearchByMakeModelView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByFocalLength: function() {

		// show search
		//
		this.showChildView('searches', new SearchByFocalLengthView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByExposure: function() {

		// show search
		//
		this.showChildView('searches', new SearchByExposureView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByAperture: function() {

		// show search
		//
		this.showChildView('searches', new SearchByApertureView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByIso: function() {

		// show search
		//
		this.showChildView('searches', new SearchByIsoView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByCaptureDate: function() {

		// show search
		//
		this.showChildView('searches', new SearchByCaptureDateView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	//
	// sharing attribute searching methods
	//

	showSearchSharedWithMe: function() {

		// show search
		//
		this.showChildView('searches', new SearchSharedWithMeView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchSharedByMe: function() {

		// show search
		//
		this.showChildView('searches', new SearchSharedByMeView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
	},

	showSearchByLinks: function() {

		// show search
		//
		this.showChildView('searches', new SearchByLinksView({
			model: this.model
		}));

		// perform callback
		//
		if (this.options.onshow) {
			this.options.onshow();
		}
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