/******************************************************************************\
|                                                                              |
|                             data-editor-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing optics lens data info.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import DataSheetEditorView from '../../../../../views/apps/material-editor/mainbar/data-editor/data-sheet-editor-view.js';
import RefractionEditorView from '../../../../../views/apps/material-editor/mainbar/data-editor/refraction-editor-view.js';
import ReflectionEditorView from '../../../../../views/apps/material-editor/mainbar/data-editor/reflection-editor-view.js';
import TransmissionEditorView from '../../../../../views/apps/material-editor/mainbar/data-editor/transmission-editor-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'data-editor',

	template: template(`
		<div class="data"></div>
	`),

	regions: {
		data: {
			el: '.data',
			replaceElement: true
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'view_kind':

				// set attributes
				//
				this.options.view_kind = value;

				// re-render
				//
				this.showData(value);
		}
	},

	setModel: function(model) {

		// set attributes
		//
		this.model = model;

		// update view
		//
		this.showData(this.options.view_kind);
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showData();
	},

	showData: function(viewKind) {
		switch (viewKind || 'data_sheet') {
			case 'data_sheet':
				this.showDataSheetEditor();
				break;
			case 'refraction':
				this.showRefractionEditor();
				break;
			case 'reflection':
				this.showReflectionEditor();
				break;
			case 'transmission':
				this.showTransmissionEditor();
				break;
		}
	},

	showDataSheetEditor: function() {
		this.showChildView('data', new DataSheetEditorView({
			model: this.model,

			// options
			//
			wavelengths: this.options.wavelengths,
			selected: this.options.selected,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	showRefractionEditor: function() {
		this.showChildView('data', new RefractionEditorView({
			model: this.model,

			// options
			//
			wavelengths: this.options.wavelengths,

			// callbacks
			//
			onchange: this.options.onchange
		}));
	},

	showReflectionEditor: function() {
		this.showChildView('data', new ReflectionEditorView({
			model: this.model,

			// callbacks
			//
			onchange: this.options.onchange
		}));	
	},

	showTransmissionEditor: function() {
		this.showChildView('data', new TransmissionEditorView({
			model: this.model,

			// options
			//
			wavelengths: this.options.wavelengths,

			// callbacks
			//
			onchange: this.options.onchange
		}));	
	}
});