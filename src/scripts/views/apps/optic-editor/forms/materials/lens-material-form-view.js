/******************************************************************************\
|                                                                              |
|                          lens-material-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for specifying lens element material.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../../views/forms/form-view.js';
import Material from '../../../../../models/optics/materials/material.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="catalog form-group">
			<label class="control-label">Catalog</label>
			<div class="controls">
				<input type="text" class="form-control" value="<%= catalog %>" readonly style="width:50%; float:left; margin-right:10px" />
				<div class="checkbox-inline">
					<label><input type="checkbox" name="mode" value="catalog"<% if (catalog) { %> checked<% } %>></label>
				</div>
			</div>
		</div>

		<div class="name form-group">
			<label class="control-label">Name</label>
			<div class="controls">
				<input type="text" class="form-control" value="<%= name %>" style="width:50%; float:left; margin-right:10px" />
				<button class="btn"><i class="fa fa-mouse-pointer"></i>Select</button>
			</div>
		</div>
		
		<div class="index-of-refraction form-group">
			<label class="required control-label">Index</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control"<% if (typeof index_of_refraction != 'undefined') { %> value="<%= index_of_refraction %>"<% } %>>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Index of Refraction" data-content="This is the index of refraction (refractive strength) of the material."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="abbe-number form-group">
			<label class="required control-label">Abbe Number</label>
			<div class="controls">
				<div class="input-group">
					<input type="number" class="required form-control"<% if (typeof abbe_number != 'undefined') { %> value="<%= abbe_number %>"<% } %>>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Abbe Number" data-content="This is the Abbe number (chromatic dispersion) of the material."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'click .catalog input': 'onClickCatalog',
		'click .name button': 'onClickNameButton'
	},

	materials_directory: config.apps.material_editor.materials_directory,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.material = this.model.get('material') || new Material({
			index_of_refraction: 1.5,
			abbe_number: 50
		});
	},

	//
	// querying methods
	//

	isCatalog: function() {
		return this.$el.find('.catalog input').is(':checked');
	},

	getValue: function(key) {
		switch (key) {
			case 'catalog':
				return this.$el.find('.catalog input').val();
			case 'name':
				return this.$el.find('.name input').val();
			case 'index_of_refraction':
				return parseFloat(this.$el.find('.index-of-refraction input').val());
			case 'abbe_number':
				return parseFloat(this.$el.find('.abbe-number input').val());
		}
	},

	getValues: function() {
		return {
			material: new Material({
				catalog: this.isCatalog()? this.getValue('catalog') : undefined,
				name: this.getValue('name'),
				index_of_refraction: this.getValue('index_of_refraction'),
				abbe_number: this.getValue('abbe_number')
			})
		};
	},

	getMaterialsDirectory: function() {
		return application.getDirectory(this.materials_directory);
	},

	//
	// setting methods
	//

	setCatalog: function(catalog) {
		if (catalog) {
			this.$el.find('.catalog input[type="text"]').show();
			this.$el.find('.name input').prop('readonly', true);
			this.$el.find('.name button').css('visibility', 'visible');
			this.$el.find('.index-of-refraction input').prop('readonly', true);
			this.$el.find('.abbe-number input').prop('readonly', true);
		} else {
			this.$el.find('.catalog input[type="text"]').hide();
			this.$el.find('.name input').prop('readonly', false);
			this.$el.find('.name button').css('visibility', 'hidden');
			this.$el.find('.index-of-refraction input').prop('readonly', false);
			this.$el.find('.abbe-number input').prop('readonly', false);
		}
	},

	setValue: function(key, value) {
		switch (key) {
			case 'catalog':
				this.$el.find('.catalog input').val(value);
				break;
			case 'name':
				this.$el.find('.name input').val(value);
				break;
			case 'index_of_refraction':
				this.$el.find('.index-of-refraction input').val(value);
				break;
			case 'abbe_number':
				this.$el.find('.abbe-number input').val(value);
				break;
		}
	},

	setMaterial: function(material) {
		this.setValues({
			catalog: material.get('catalog'),
			name: material.get('name'),
			index_of_refraction: material.get('index_of_refraction'),
			abbe_number: material.get('abbe_number')	
		});
	},

	//
	// loading methods
	//

	loadMaterial: function(file) {
		let self = this;
		let name = file.getBaseName();
		let catalog = file.parent.getName();

		file.read({

			// callbacks
			//
			success: (text) => {
				Material.parseYaml(name, text, {

					// callbacks
					//
					success: function(model) {
						model.set({
							catalog: catalog
						});
						self.setMaterial(model);
					}
				});
			},
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			catalog: this.material.get('catalog'),
			name: this.material.get('name'),
			index_of_refraction: this.material.get('index_of_refraction'),
			abbe_number: this.material.get('abbe_number')
		};
	},

	onRender: function() {
		this.setCatalog(this.material.has('catalog'));
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function(directory) {
		import(
			'../../../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			application.show(new OpenItemsDialogView.default({

				// start with home directory
				//
				model: directory || this.getMaterialsDirectory(),

				// options
				//
				title: "Open Material",

				// callbacks
				//
				onopen: (items) => this.loadMaterial(items[0])
			}));
		});
	},

	//
	// event handling methods
	//
	
	onChange: function() {

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange();
		}
	},

	//
	// mouse event handling methods
	//

	onClickCatalog: function() {
		this.setCatalog(this.isCatalog());
	},

	onClickNameButton: function() {
		this.showOpenDialog();
	}
});