/******************************************************************************\
|                                                                              |
|                           material-viewer-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing materials.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Lens from '../../../models/optics/elements/lens.js';
import Material from '../../../models/optics/materials/material.js';
import MaterialMap from '../../../models/optics/materials/material-map.js';
import ColorScheme from '../../../models/optics/materials/color-scheme.js';
import Translator from '../../../models/optics/translators/translator.js';
import Items from '../../../collections/storage/items.js';
import Elements from '../../../collections/optics/elements/elements.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import HeaderBarView from '../../../views/apps/material-map-viewer/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/material-map-viewer/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/material-map-viewer/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/material-map-viewer/footer-bar/footer-bar-view.js';
import Yaml from '../../../../library/js-yaml/js-yaml.js';

export default AppSplitView.extend(_.extend({}, Multifile, SelectableContainable, ItemShareable, {

	//
	// attributes
	//
	
	name: 'material_map_viewer',

	events: {
		'click > .body': 'onClick',
		'change > .body input[type="file"]': 'onChangeFile'
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppSplitView.prototype.initialize.call(this);

		// set model
		//
		if (this.collection && !this.model) {
			this.model = this.collection.at(0);
		}
		if (!this.model) {
			this.model = new File({
				path: this.preferences.get('initial_file')
			});
		}

		// create collection
		//
		if (!this.collection) {
			if (this.model) {
				this.collection = new Items([this.model]);
			} else {
				this.collection = new Items();
			}
		}

		// set attributes
		//
		this.directory = (this.model && this.model.parent) || new Directory({
			path: this.preferences.get('home_directory')
		});
		this.sharedDirectory = new Directory({
			path: config.apps.material_map_viewer.material_maps_directory
		});
	},

	//
	// attribute methods
	//

	title: function() {
		return this.directory? (this.directory.getName() || 'Material Maps'): config.apps[this.name].name;	
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let viewport = this.getActiveViewport();
			viewport.materialMarkersView.each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	hasMaterials: function() {
		return this.hasActivePaneView() && this.getActiveViewport().materialMarkersView.hasMaterials();
	},

	hasSelectedItems: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems();
		}
	},

	hasSelectedMaterials: function() {
		return this.hasActivePaneView() && this.getActiveViewport().materialMarkersView.hasSelected();
	},

	hasClipboardItems: function() {
		return this.constructor.clipboard.length > 0;
	},

	//
	// counting methods
	//

	numMaterials: function() {
		return this.hasActivePaneView()? this.getActiveViewport().materialMarkersView.collection.length : 0;
	},

	numSelectedMaterials: function() {
		return this.numSelected();
	},

	//
	// getting methods
	//

	getValue: function(options) {
		return this.toYaml(this.getActiveViewport().collection.toObjects(), {
			filename: options.file.getName()
		});
	},

	getSideBarItemView: function(model) {
		return this.getChildView('sidebar').getItemView(model);
	},

	getSelectedItemModels: function() {
		return this.getChildView('sidebar').getSelectedModels();
	},

	getActiveViewport: function() {
		if (this.hasActiveView()) {
			return this.getActiveView().getChildView('mainbar');
		}
	},

	getZoom: function() {
		if (this.hasActiveView()) {
			return this.getActiveViewport().scale * 100;
		} else {
			return 100;
		}
	},

	getScale: function() {
		return this.getActiveViewport().scale;
	},

	getLocation: function() {
		if (this.hasActivePaneView()) {
			return this.getActiveViewport().location;
		}
	},

	getSelectedChildView: function(which) {
		return this.getActiveView().getChildView('sidebar materials-list').getSelectedRow(which);
	},

	getClipboardItems: function() {
		let materials = [];
		let clipboard = this.constructor.clipboard;
		for (let i = 0; i < clipboard.length; i++) {
			materials.push(clipboard[i].clone());
		}
		return materials;
	},

	//
	// file getting methods
	//

	getHomeDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return application.getDirectory(this.preferences.get('home_directory'));
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use home directory
			//
			return application.getDirectory();
		}
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// toolbar options
			//
			case "toolbars":
				this.setToolbarsVisible(value);
				break;
		}

		// call superclass method
		//
		AppSplitView.prototype.setOption.call(this, key, value);
	},

	setDirectory: function(directory) {

		// set attributes
		//
		this.directory = directory;

		// set sidebar
		//
		this.getChildView('sidebar maps').setDirectory(directory);
	},

	setClipboard: function(items) {
		this.constructor.clipboard = items;
	},

	//
	// toolbar setting methods
	//

	setToolbarsVisible: function(visible) {

		// call superclass method
		//
		AppSplitView.prototype.setToolbarsVisible.call(this, visible);

		// show / hide main toolbar
		//
		if (visible == true) {
			this.setMainToolbarVisible(true);
		} else if (visible == false) {
			this.setMainToolbarVisible(false);
		} else if (visible.includes('map')) {
			this.setMainToolbarVisible(true);
		} else {
			this.setMainToolbarVisible(false);
		}
	},

	//
	// map option setting methods
	//

	setShowGrid: function(showGrid) {
		this.getActiveViewport().setShowGrid(showGrid);
	},

	setLocation: function(latitude, longitude) {
		this.getActiveViewport().setLocation(latitude, longitude);
	},

	setScale: function(scale) {
		this.getActiveViewport().setScale(scale);
	},

	setOffset: function(offset) {
		this.getActiveViewport().setOffset(offset);
	},

	setElements: function(elements) {
		this.getActiveView().setElements(elements);
	},

	//
	// map creating methods
	//

	newTab: function() {
		this.newFile();
	},

	newFile: function() {

		// open new file
		//
		this.loadFile(new File());
	},

	newFolder: function() {
		let directoryName = this.directory.getUniqueName(Directory.defaultName);
		this.directory.createDirectory(directoryName, {

			// callbacks
			//
			success: (model) => {
			
				// play new sound
				//
				application.play('new');

				// add grow effect
				//
				let itemView = this.getSideBarItemView(model);
				if (itemView.grow) {

					// edit directory name after grow
					//
					itemView.grow(() => itemView.setEditable());
				} else {

					// edit directory name
					//
					itemView.setEditable();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create new directory.",
					response: response
				});
			}
		});
	},

	//
	// file opening methods
	//

	openFile: function(file, options) {

		// check if item is already open
		//
		if (this.isAlreadyOpen(file)) {

			// activate existing tab
			//
			this.setActiveModel(file);

		// open new file
		//
		} else {
			this.loadFile(file);
		}

		// perform callback
		//
		if (options && options.success) {
			options.success(file);
		}
	},

	openItem: function(item, options) {

		// show image
		//
		if (item instanceof File) {
			this.openFile(item, options);
		}
	},

	openSelected: function() {

		// if no selected items, show open dialog
		//
		if (!this.hasSelected()) {
			this.showOpenDialog();
		} else {
			let selected = this.getSelectedModels();
			let item = selected[0];
			this.openItem(item);
		}
	},

	openMaterial: function(material) {
		let catalog = material.get('catalog');
		let name = material.get('name');

		if (catalog && name) {
			application.launch('material_editor', {
				model: new File({
					path: config.apps['material_editor'].materials_directory + '/' + catalog + '/' + name + '.mtrl'
				})
			});
		}
	},

	//
	// parsing methods
	//

	parseYaml: function(model, text, options) {
		MaterialMap.parseYaml(model.getName(), text, {

			// callbacks
			//
			success: (materialMap) => {
				this.getActiveViewport().model = materialMap;

				// add markers
				//
				if (materialMap.has('materials')) {
					let materials = materialMap.get('materials');
					if (materials.length > 0) {
						this.addMaterials(materials.models);
					}
				}

				// add elements
				//
				if (materialMap.has('elements')) {
					let elements = materialMap.get('elements');
					if (elements.length > 0) {
						this.addElements(elements.models);
					}
				}

				// perform callback
				//
				if (options && options.success) {
					options.success(materialMap);
				}
			}
		});
	},

	importOptics: function(file, text, options) {
		Translator.import(file, text, {

			// callbacks
			//
			success: (optics) => {
				this.addElements(optics.elements);

				// perform callback
				//
				if (options && options.success) {
					options.success(optics);
				}
			}
		});
	},

	parseFile: function(file, text, options) {
		let extension = file.getFileExtension();
		switch (extension) {
			case 'abbe':
			case 'optc':
				this.parseYaml(file, text, options);
				break;
			case 'zmx':
				this.importOptics(file, text, options);
				break;
		}
	},

	addMaterial: function(material) {
		this.getActiveViewport().collection.add(new Material({
			name: material.get('name') || 'Untitled',
			catalog: material.get('catalog'),
			kind: 'abbe',
			index_of_refraction: material.get('index_of_refraction'),
			abbe_number: material.get('abbe_number')
		}));
	},

	addMaterials: function(materials) {
		for (let i = 0; i < materials.length; i++) {
			// this.addMaterial(materials[i]);
			this.getActiveViewport().collection.add(materials[i]);
		}
		this.getActiveView().getChildView('sidebar materials').sortItems();
	},

	addElements: function(elements) {
		this.addLenses(new Elements(elements.filter((element) => {
			return element instanceof Lens;
		})));
	},

	addLenses: function(lenses) {
		this.addMaterials(lenses.getUniqueMaterials());
		this.setElements(lenses);
	},

	//
	// file exporting methods
	//

	toYaml: function(objects, options) {
		let yaml = this.toYamlHeader({
			filename: options? options.filename : undefined,
			author: application.session.user.getName()
		});

		// add body yaml
		//
		yaml += '\n';
		yaml += '\n';
		yaml += this.toYamlBody(objects).replaceAll("'", '');

		// add spaces between elements
		//
		yaml = yaml.replaceAll("\n  - type: ", "\n\n  - type: ");

		return yaml;
	},

	toYamlHeader: function(options) {
		let header = this.constructor.yamlHeader({
			filename: options.filename,
			author: options.author
		});
		let lines = header.split('\n');

		// adjust line lengths
		//
		lines[2] = '#' + this.toSpaces(Math.trunc(39 - options.filename.length / 2)) + options.filename +
			this.toSpaces(Math.ceil(39 - options.filename.length / 2)) + '#';
		lines[8] = '#        Author(s): ' + options.author + this.toSpaces(80 - options.author.length - 21) + '#';		
	
		return lines.join('\n');
	},

	toSpaces: function(numSpaces) {
		let string = '';
		for (let i = 0; i < numSpaces; i++) {
			string = string + ' ';
		}
		return string;
	},

	toYamlBody: function(objects) {
		return Yaml.dump({
			MATERIALS: objects
		}, {
			indent: 2
		});
	},

	toJson: function(object) {
		return JSON.stringify(object, null, '\t');
	},

	//
	// file deleting methods
	//

	deleteItems: function(items, options) {

		// check if there are items to delete
		//
		if (items.length == 0) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Error",
				message: "No items selected."
			});

			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + (items.length == 1? '"' + items[0].getName() + '"' : "these " + items.length + " items") + "?",

				// callbacks
				//
				accept: () => {
					this.deleteItems(items, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {
			this.getChildView('sidebar maps items').deleteItems(items, {

				// callbacks
				//
				success: () => {

					// play delete sound
					//
					application.play('delete');
				}
			});
		}
	},

	deleteSelectedItems: function(options) {
		this.deleteItems(this.getSelectedItemModels(), options);
	},

	//
	// editing methods
	//

	addNewMaterial: function() {
		this.showAddMaterialDialog();
	},

	editMaterial: function(material) {
		this.showEditMaterialDialog(material);
	},

	editSelected: function() {
		this.editMaterial(this.getSelectedModel());
	},

	cutSelected: function() {
		let selectedMaterials = this.getSelectedModels();
		let collection = this.getActiveViewport().collection;

		// cut materials
		//
		for (let i = 0; i < selectedMaterials.length; i++) {
			collection.remove(selectedMaterials[i]);
		}
		this.setClipboard(selectedMaterials);

		// update
		//
		this.onChange();

		// play cut sound
		//
		application.play('cut');
	},

	copySelected: function() {
		let selectedMaterials = this.getSelectedModels({
			clone: true
		});
		this.setClipboard(selectedMaterials);

		// update
		//
		this.onChange();

		// play copy sound
		//
		application.play('copy');
	},

	pasteSelected: function() {
		let items = this.getClipboardItems();
		let collection = this.getActiveViewport().collection;

		// paste elements
		//
		for (let i = 0; i < items.length; i++) {
			collection.add(items[i]);
		}

		// update
		//
		this.onChange();

		// play paste sound
		//
		application.play('paste');
	},

	putSelected: function() {
		this.pasteSelected();
		this.clearClipboard();

		// update
		//
		this.onChange();
	},

	//
	// material deleting methods
	//

	deleteMaterials: function(materials, options) {

		// check if there are materials to delete
		//
		if (materials.length == 0) {

			// show notification
			//
			application.notify({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete Error",
				message: "No materials selected."
			});

			return;
		}

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-trash-alt"></i>',
				title: "Delete",
				message: "Are you sure you want to delete " + (materials.length == 1? "this material" : "these " + materials.length + " materials") + "?",

				// callbacks
				//
				accept: () => {
					this.deleteMaterials(materials, _.extend({}, options, {
						confirm: false
					}));
				}
			});
		} else {
			let collection = this.getActiveViewport().collection;

			// delete all materials
			//
			for (let i = 0; i < materials.length; i++) {
				collection.remove(materials[i]);
			}

			// update
			//
			this.onChange();

			// play 'delete' sound
			//
			application.play('remove');
		}
	},

	deleteSelected: function() {
		this.deleteMaterials(this.getSelectedModels());
	},

	clearClipboard: function() {
		this.constructor.clipboard = [];

		// update
		//
		this.onChange();

		// play clear sound
		//
		application.play('clear');
	},

	//
	// navigating methods
	//

	zoomIn: function() {
		this.getActiveViewport().scaleTo(this.getScale() * 2, {
			duration: this.preferences.get('zoom_duration')
		});
	},

	zoomOut: function() {
		this.getActiveViewport().scaleTo(this.getScale() / 2, {
			duration: this.preferences.get('zoom_duration')
		});
	},

	scaleTo: function(scale) {
		this.getActiveViewport().scaleTo(scale, {
			duration: this.preferences.get('pan_duration')
		});
	},

	panTo: function(offset) {
		this.getActiveViewport().panTo(offset, {
			duration: this.preferences.get('pan_duration')
		});
	},

	panToDirection: function(direction) {
		this.getActiveViewport().panToDirection(direction, {
			duration: this.preferences.get('pan_duration')
		});
	},

	transformTo: function(offset, scale) {
		this.getActiveViewport().transformTo(offset, scale, {
			duration: this.preferences.get('pan_duration')
		});	
	},

	//
	// loading methods
	//

	loadColorSchemes: function(options) {
		fetch('config/optics/color-schemes.json').then((response) => response.json()).then((json) => {

			// create default color schemes
			//
			let keys = Object.keys(json);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				ColorScheme.setScheme(key, new ColorScheme(json[key]), {
					silent: true
				});
			}

			// set current color scheme
			//
			ColorScheme.setCurrent('standard');

			// listen for changes to color scheme
			//
			this.listenTo(ColorScheme.current, 'change', () => {
				this.setOption('scheme', ColorScheme.getCurrentName());
				this.getChildView('header menu view').setScheme(ColorScheme.getCurrentName());
			});

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		AppSplitView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showHeaderBar();

		// show footer bar
		//
		if (!application.isEmbedded() && (!this.options.hidden || !this.options.hidden['footer-bar'])) {
			this.showFooterBar();
		} else {
			this.$el.find('.footer-bar').remove();
		}
	},

	onAttach: function() {

		// call superclass method
		//
		AppSplitView.prototype.onAttach.call(this);

		// show contents
		//
		this.loadColorSchemes({

			// callbacks
			//
			success: () => {

				// show optics
				//
				this.showContents();

				// show initial help message
				//
				if (!this.model) {
					this.showHelpMessage();
				}
			}
		});
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getSideBarView: function() {
		return new SideBarView({

			// options
			//
			panels: this.preferences.get('sidebar_panels'),
			view_kind: this.preferences.get('sidebar_view_kind'),

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item)
		});
	},

	getContentView: function() {
		return new TabbedContentView({
			collection: this.collection,

			// options
			//
			preferences: this.preferences,
			icons: this.constructor.icons,

			// callbacks
			//
			onload: () => this.onLoad(),
			onactivate: () => this.onActivate(),
			onchange: (attribute) => this.onChange(attribute),
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropin: (items) => this.onDropIn(items),
			onchangetab: () => this.onChange(),
			onclose: (index) => this.closeTab(index),
			onmousemove: (event) => this.onMouseMove(event)
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No material maps.", {
			icon: '<i class="far fa-map"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
		});
	},

	//
	// dialog rendering methods
	//

	showOpenDialog: function(directory) {
		import(
			'../../../views/apps/file-browser/dialogs/files/open-items-dialog-view.js'
		).then((OpenItemsDialogView) => {

			// show open dialog
			//
			this.show(new OpenItemsDialogView.default({

				// start with shared directory
				//
				model: directory || this.sharedDirectory,

				// options
				//
				title: "Open Map",

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},

	showInfoDialog: function() {
		import(
			'../../../views/apps/material-map-viewer/dialogs/info/material-map-info-dialog-view.js'
		).then((MaterialMapInfoDialogView) => {

			// show material map info dialog
			//
			this.show(new MaterialMapInfoDialogView.default({
				model: this.getActiveViewport().model
			}));
		});
	},

	showAddMaterialDialog: function() {
		import(
			'../../../views/apps/material-map-viewer/dialogs/materials/add-material-dialog-view.js'
		).then((AddMaterialDialogView) => {

			// show add material dialog
			//
			this.show(new AddMaterialDialogView.default({

				// callbacks
				//
				onsubmit: (material) => {
					let viewport = this.getActiveViewport();
					viewport.collection.add(material);

					// play 'add' sound
					//
					application.play('add');
				}
			}));
		});
	},

	showEditMaterialDialog: function(material) {
		import(
			'../../../views/apps/material-map-viewer/dialogs/materials/edit-material-dialog-view.js'
		).then((EditMaterialDialogView) => {

			// show edit material dialog
			//
			this.show(new EditMaterialDialogView.default({
				model: material,

				// callbacks
				//
				onsubmit: () => {

					// play 'change' sound
					//
					application.play('move');
				}
			}));
		});
	},

	showPreferencesDialog: function() {
		import(
			'../../../views/apps/material-map-viewer/dialogs/preferences/preferences-dialog-view.js'
		).then((PreferencesDialogView) => {

			// show preferences dialog
			//
			this.show(new PreferencesDialogView.default({
				model: this.preferences
			}));
		});
	},

	//
	// event handling methods
	//

	onActivate: function() {

		// show footer bar
		//
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
			this.showFooterBar();
		}

		// activate toolbar views
		//
		this.getChildView('header').onActivate();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange('tab');
		}
	},

	onChange: function(attribute) {

		// update child views
		//
		switch (attribute) {
			case 'offset':
				this.getStatusBar().onChange(attribute);
				break;
			case 'scale':
				this.getChildView('header').onChange(attribute);
				break;
			case 'size':
				break;
			case 'material':
				if (this.getActivePaneView().loaded) {
					this.setDirty();
				}
				break;
			case 'colors':
				break;
			default:
				this.getChildView('header').onChange(attribute);
				break;
		}
		
		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	},

	//
	// mouse event handling methods
	//

	onMouseMove: function() {
		if (this.hasStatusBar()) {
			this.getStatusBar().onMouseMove();
		}
	}
}), {

	//
	// static attributes
	//

	defaultName: 'Untitled.abbe',
	clipboard: [],
	yamlHeader: template(`
		################################################################################
		#                                                                              #
		#                               <%= filename %>                                #
		#                                                                              #
		################################################################################
		#                                                                              #
		#        This is a description of an OpticExplorer material map.               #
		#                                                                              #
		#        Author(s): <%= author %>                                              #
		#                                                                              #
		################################################################################
		#        Made with OpticExplorer, opticexplorer.com, Optics for Everyone       #
		################################################################################
	`),

	icons: {

		//
		// lens icons
		//

		biconvex: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 45, 5 c -9, 9.2 -15, 25.9 -15, 45c0, 19.1, 6, 35.8, 15, 45 h 10 c 9 -9.2, 15 -25.9, 15 -45 c 0 -19.1 -6 -35.8 -15 -45 H 45 z M 50.4, 85 h -0.8 c -6 -8.1 -9.6 -21.1 -9.6 -35 s 3.6 -26.9, 9.6 -35 h 0.8 c 6, 8.1, 9.6, 21.1, 9.6, 35 S 56.4, 76.9, 50.4, 85 z"/>
				</svg>
			</i>
		`,
		biconcave: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 25, 5 c 6, 9.2, 10, 25.9, 10, 45 c 0, 19.1 -4, 35.8 -10, 45h50c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 25 z M 59.8, 85 H 40.2 C 43.3, 74.9, 45, 62.8, 45, 50 s -1.7 -24.9 -4.8 -35 h 19.5 C 56.7, 25.1, 55, 37.2, 55, 50 S 56.7, 74.9, 59.8, 85 z"/>
				</svg>
			</i>
		`,
		planar: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 30, 5 v 90 h 35 c 0 0, 0 0 0 -45 c 0 0, 0 0, 0 -45 H 30 z M 54.8, 85 H 40 V 15 h 14.8 z "/>
				</svg>
			</i>
		`,
		plano_convex: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path transform="translate(50, 50) scale(-1, 1) translate(-50, -50)" d="M 65, 95 V 5 H 50 c -9, 9.2 -15, 25.9 -15, 45 c 0, 19.1, 6, 35.8, 15, 45 H 65 z M 54.6, 15 H 55 v 70 h -0.4 c -6 -8.1 -9.6 -21.1 -9.6 -35 S 48.6, 23.1, 54.6, 15 z" />
				</svg>
			</i>
		`,
		plano_concave: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 30, 5 v 90 h 40 c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 30 z M 54.8, 85 H 40 V 15 h 14.8 C 51.7, 25.1, 50, 37.2, 50, 50 S 51.7, 74.9, 54.8, 85 z "/>
				</svg>
			</i>
		`,
		convex_plano: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 65, 95 V 5 H 50 c -9, 9.2 -15, 25.9 -15, 45 c 0, 19.1, 6, 35.8, 15, 45 H 65 z M 54.6, 15 H 55 v 70 h -0.4 c -6 -8.1 -9.6 -21.1 -9.6 -35 S 48.6, 23.1, 54.6, 15 z" />
				</svg>
			</i>
		`,
		concave_plano: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path transform="translate(50, 50) scale(-1, 1) translate(-50, -50)" d="M 30, 5 v 90 h 40 c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 30 z M 54.8, 85 H 40 V 15 h 14.8 C 51.7, 25.1, 50, 37.2, 50, 50 S 51.7, 74.9, 54.8, 85 z "/>
				</svg>
			</i>
		`,
		positive_meniscus: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 50, 5 c -12, 9.2 -20, 25.9 -20, 45 c 0, 19.1, 8, 35.8, 20, 45 h 20 c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 50 z M 54.8, 85 h -1.1 C 45.2, 77, 40, 64, 40, 50 s 5.2 -27, 13.7 -35 h 1.1 C 51.7, 25.1, 50, 37.2, 50, 50 S 51.7, 74.9, 54.8, 85 z" />
				</svg>
			</i>
		`,
		negative_meniscus: `
			<i class="icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 75, 5 H 35 c -6, 9.2 -10, 25.9 -10, 45c0, 19.1, 4, 35.8, 10, 45 h 40 c -12 -9.2 -20 -25.9 -20 -45 C 55, 30.9, 63, 14.2, 75, 5z M53.7, 85 H 41 c -3.1 -7.2 -6 -19.3 -6 -35 c0 -15.7, 2.9 -27.8, 6 -35 h 12.7 C 48.1, 25.1, 45, 37.2, 45, 50 C 45, 62.8, 48.1, 74.9, 53.7, 85 z" />
				</svg>
			</i>
		`
	}
});