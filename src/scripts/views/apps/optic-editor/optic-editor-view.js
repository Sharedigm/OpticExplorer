/******************************************************************************\
|                                                                              |
|                              optic-editor-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing and editing optic files.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Item from '../../../models/storage/item.js';
import File from '../../../models/storage/files/file.js';
import Directory from '../../../models/storage/directories/directory.js';
import Element from '../../../models/optics/elements/element.js';
import Lens from '../../../models/optics/elements/lens.js';
import Spherical from '../../../models/optics/elements/surfaces/spherical.js';
import Planar from '../../../models/optics/elements/surfaces/planar.js';
import ColorScheme from '../../../models/optics/materials/color-scheme.js';
import Light from '../../../models/optics/lights/light.js';
import Translator from '../../../models/optics/translators/translator.js';
import Items from '../../../collections/storage/items.js';
import AppSplitView from '../../../views/apps/common/app-split-view.js';
import Multifile from '../../../views/apps/common/behaviors/tabbing/multifile.js';
import FileUploadable from '../../../views/apps/file-browser/mainbar/behaviors/file-uploadable.js';
import SelectableContainable from '../../../views/behaviors/containers/selectable-containable.js';
import MultiSelectable from '../../../views/behaviors/selection/multi-selectable.js';
import ItemShareable from '../../../views/apps/common/behaviors/sharing/item-shareable.js';
import ItemInfoShowable from '../../../views/apps/file-browser/dialogs/info/behaviors/item-info-showable.js';
import HeaderBarView from '../../../views/apps/optic-editor/header-bar/header-bar-view.js';
import SideBarView from '../../../views/apps/optic-editor/sidebar/sidebar-view.js';
import TabbedContentView from '../../../views/apps/optic-editor/mainbar/tabbed-content/tabbed-content-view.js';
import FooterBarView from '../../../views/apps/optic-editor/footer-bar/footer-bar-view.js';
import Units from '../../../utilities/math/units.js';

export default AppSplitView.extend(_.extend({}, Multifile, FileUploadable, SelectableContainable, MultiSelectable, ItemShareable, ItemInfoShowable, {

	//
	// attributes
	//

	name: 'optic_editor',

	events: {

		// none - let subviews handle selection events
		//
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
			this.model = new File();
		}

		// create collection
		//
		if (!this.collection) {
			this.collection = new Items([this.model]);
		}

		// disable sorting of tabs
		//
		this.collection.comparator = null;

		// set preferences
		//
		if (this.options.show_sidebar == false) {
			this.preferences.set('show_sidebar', false);
		}

		// set attributes
		//
		this.directory = new Directory({
			path: this.preferences.get('home_directory')
		});
		this.uploadsDirectory = new Directory({
			path: this.preferences.get('uploads_directory')
		});
	},

	//
	// attribute methods
	//

	title: function() {
		return this.directory? (this.directory.getName() || 'Home'): config.apps[this.name];
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasActiveView()) {
			let viewport = this.getActiveViewport();
			let elementsView = viewport? viewport.elementsView : undefined;
			if (elementsView) {
				elementsView.each(callback, filter, options);
			}
		}
	},

	//
	// querying methods
	//

	hasElements: function(filter) {
		return this.numElements(filter) > 0;
	},

	hasChanged: function() {
		return this.hasActiveModel() && !this.getActiveModel().isNew();
	},

	hasSelectedItems: function() {
		if (this.hasChildView('sidebar')) {
			return this.getChildView('sidebar').hasSelectedItems();
		}
	},

	hasSelectedElements: function() {
		return this.hasActivePaneView() && this.getActiveViewport().hasSelectedElements();
	},

	hasSelectedSurfaces: function() {
		return this.hasActivePaneView() && this.getActiveViewport().hasSelectedSurfaces();
	},

	hasSelected: function() {
		return this.hasActivePaneView() && this.getActiveViewport().hasSelected();
	},

	hasClipboardItems: function() {
		return this.constructor.clipboard.length > 0;
	},

	//
	// counting methods
	//

	numElements: function(filter) {
		return this.hasActivePaneView()? this.getActiveViewport().numElements(filter) : 0;
	},

	numSelectedElements: function() {
		return this.hasActivePaneView()? this.getActiveViewport().numSelectedElements() : 0;
	},

	//
	// getting methods
	//

	getValue: function(options) {

		// export optics
		//
		return Translator.export(this.getActiveViewport().model, options);
	},

	getLocation: function() {
		if (this.hasActivePaneView()) {
			return this.getActiveViewport().location;
		}
	},

	getActiveViewport: function() {
		return this.getActiveView().getChildView('mainbar');
	},
	
	getHomeDirectory: function() {
		if (application.isSignedIn()) {

			// use directory from preferences
			//
			return new Directory({
				path: this.preferences.get('home_directory')
			});
		} else if (this.model && this.model.parent) {

			// use directory from current file
			//
			return this.model.parent;
		} else {

			// use current directory
			//
			return new Directory();
		}
	},

	getZoom: function() {
		return this.getActiveView().getZoom();
	},

	getScale: function() {
		return this.getZoom() / 100;
	},

	getSideBarItemView: function(model) {
		return this.getChildView('sidebar').getItemView(model);
	},

	getSelectedItemViews: function() {
		return this.getChildView('sidebar').getSelected();
	},

	getSelectedItems: function() {
		return this.getChildView('sidebar').getSelectedModels();
	},

	getSelected: function() {
		return this.getActiveViewport().getSelected();
	},

	getSelectedModels: function() {
		return this.getActiveViewport().getSelectedModels();
	},

	getModelsDescription: function(models) {
		let numElements = 0;
		let numLights = 0;
		let numObjects = 0;

		// count models of each type
		//
		for (let i = 0; i < models.length; i++) {
			if (models[i] instanceof Element) {
				numElements++;
			} else if (models[i] instanceof Light) {
				numLights++;
			} else {
				numObjects++;
			}
		}

		// create description of selected items
		//
		let description = "";

		// add elements to description
		//
		if (numElements > 0) {
			description += numElements ==  1? "this " : "these ";
			description += numElements ==  1? " element" : numElements + " elements";
		}

		// add lights to description
		//
		if (numLights > 0) {
			if (description != "") {
				description += " and ";
			}
			description += numLights ==  1? "this " : "these ";
			description += numLights ==  1? "light" : numLights + " lights";
		}

		// add objects to description
		//
		if (numObjects > 0) {
			if (description != "") {
				description += " and ";
			}
			description += numObjects ==  1? "this " : "these ";
			description += numObjects ==  1? "object" : numObjects + " objects";
		}

		return description;
	},

	getSelectedChildView: function(which) {
		if (this.hasSelectedElements()) {
			return this.getSelectedElementView(which);
		} else if (this.hasSelectedSurfaces()) {
			return this.getSelectedSurfaceView(which);
		}		
	},

	getOpticsToolbarView: function() {
		return this.getChildView('contents mainbar panes toolbar');
	},

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// element getting methods
	//

	getSelectedElements: function() {
		return this.getActiveViewport().getSelectedElements();
	},

	getSelectedElementView: function(which) {
		return this.getActiveViewport().getSelectedElementView(which);
	},

	getClipboardItems: function() {
		let elements = [];
		let clipboard = this.constructor.clipboard;
		for (let i = 0; i < clipboard.length; i++) {
			elements.push(clipboard[i].clone());
		}
		return elements;
	},

	getElement: function(kind) {
		switch (kind || 'biconvex_lens') {
			case 'biconvex_lens':
				return this.getBiConvexLens();
			case 'biconcave_lens':
				return this.getBiConcaveLens();
			case 'convex_plano_lens':
				return this.getConvexPlanoLens();
			case 'concave_plano_lens':
				return this.getConcavePlanoLens();
			case 'plano_convex_lens':
				return this.getPlanoConvexLens();
			case 'plano_concave_lens':
				return this.getPlanoConcaveLens();
			case 'positive_meniscus_lens':
				return this.getPositiveMeniscusLens();
			case 'negative_meniscus_lens':
				return this.getNegativeMeniscusLens();
			case 'planar_lens':
				return this.getPlanarLens();
		}
	},

	getBiConvexLens: function() {
		return new Lens({
			front: new Spherical({
				radius_of_curvature: new Units(100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			back: new Spherical({
				radius_of_curvature: new Units(-100, 'mm'),
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(10, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getBiConcaveLens: function() {
		return new Lens({
			front: new Spherical({
				radius_of_curvature: new Units(-100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			back: new Spherical({
				radius_of_curvature: new Units(100, 'mm'),
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(5, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getConvexPlanoLens: function() {
		return new Lens({
			front: new Spherical({
				radius_of_curvature: new Units(100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			back: new Planar({
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(10, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getConcavePlanoLens: function() {
		return new Lens({
			front: new Spherical({
				radius_of_curvature: new Units(-100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			back: new Planar({
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(5, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getPlanoConvexLens: function() {
		return new Lens({
			front: new Planar({
				diameter: new Units(50, 'mm')
			}),
			back: new Spherical({
				radius_of_curvature: new Units(-100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			thickness: new Units(10, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getPlanoConcaveLens: function() {
		return new Lens({
			front: new Planar({
				diameter: new Units(50, 'mm')
			}),
			back: new Spherical({
				radius_of_curvature: new Units(100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			thickness: new Units(5, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getPositiveMeniscusLens: function() {
		return new Lens({
			front: new Spherical({
				radius_of_curvature: new Units(50, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			back: new Spherical({
				radius_of_curvature: new Units(100, 'mm'),
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(10, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getNegativeMeniscusLens: function() {
		return new Lens({
			front: new Spherical({
				radius_of_curvature: new Units(100, 'mm'),
				diameter: new Units(50, 'mm'),
			}),
			back: new Spherical({
				radius_of_curvature: new Units(50, 'mm'),
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(5, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	getPlanarLens: function() {
		return new Lens({
			front: new Planar({
				diameter: new Units(50, 'mm'),
			}),
			back: new Planar({
				diameter: new Units(50, 'mm')
			}),
			thickness: new Units(10, 'mm'),
			spacing: new Units(10, 'mm')
		});
	},

	//
	// surface getting methods
	//

	getSelectedSurfaceView: function(which) {
		return this.getActiveViewport().getSelectedSurfaceView(which);
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
		this.getChildView('sidebar optics').setDirectory(directory);
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
		} else if (visible.includes('optics')) {
			this.setMainToolbarVisible(true);
		} else {
			this.setMainToolbarVisible(false);
		}
	},

	//
	// navigation methods
	//

	pushDirectory: function(directory) {
		this.getChildView('nav').pushDirectory(directory);
	},

	//
	// optic creating methods
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
			
				// play add sound
				//
				application.play('add');

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
	// optic opening methods
	//

	openOptic: function(file, options) {

		// check if item is already open
		//
		if (this.isAlreadyOpen(file)) {

			// activate existing tab
			//
			this.setActiveModel(file);

		// load new map
		//
		} else {

			// open map
			//
			this.loadFile(file);
		}

		// perform callback
		//
		if (options && options.success) {
			options.success(file);
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
			if (item instanceof Item) {
				this.openItem(item);
			} else {
				this.showOpenDialog();
			}
		}
	},

	showMaterialMap: function() {
		application.launch('material_map_viewer', {
			model: this.getActiveModel()
		});
	},

	revertOptic: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				icon: '<i class="fa fa-repeat"></i>',
				title: "Revert",
				message: "Are you sure you want to revert this optic? All changes will be lost.",

				// callbacks
				//
				accept: () => {
					this.revertOptic({
						confirm: false
					});
				}
			});
		} else {
			this.getActiveViewport().clear();
			this.getActivePaneView().loadFile(this.getActiveModel());

			// reset state
			//
			this.setDirty(false);
		}
	},

	uploadOpticItems: function(items, options) {

		// upload items to app's uploads directory
		//
		this.uploadItems(items, this.uploadsDirectory, {
			show_progress: true,
			overwrite: true,

			// callbacks
			//
			success: (items) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(items);
				}
			}
		});
	},

	//
	// file parsing methods
	//

	parseFile: function(file, text, options) {

		// import optics
		//
		return Translator.import(file, text, options);
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
			this.getChildView('sidebar optics items').deleteItems(items, {

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
		this.deleteItems(this.getSelectedItems(), options);
	},

	//
	// editing methods
	//

	addLens: function(elementKind) {
		this.showAddElementDialog(elementKind);
	},

	addStop: function() {
		this.showAddStopDialog();
	},

	addSensor: function() {
		this.showAddSensorDialog();
	},

	addCamera: function() {
		this.showAddCameraDialog();
	},

	addDistantLight: function() {
		this.getOpticsToolbarView().getChildView('light_tools add_distant_light').select();
	},

	addPointLight: function() {
		this.getOpticsToolbarView().getChildView('light_tools add_point_light').select();
	},

	addLightBeam: function() {
		this.getOpticsToolbarView().getChildView('light_tools add_light_beam').select();
	},

	addLightRay: function() {
		this.getOpticsToolbarView().getChildView('light_tools add_light_ray').select();
	},

	addSceneObject: function() {
		this.getOpticsToolbarView().getChildView('object_tools add_scene_object').select();
	},

	addDistantObject: function() {
		this.getOpticsToolbarView().getChildView('object_tools add_distant_object').select();
	},

	editSelected: function() {
		if (this.hasSelected()) {
			let selected = this.getSelected()[0];
			if (selected && selected.edit) {
				selected.edit();
			}
		}
	},

	flipSelectedElements: function() {
		let elements = this.getSelectedElements();

		if (elements.length > 0) {
			this.flipElements(elements);
		} else {
			this.flipAll();
		}
	},

	flipElements: function(elements) {

		// flip individual elements
		//
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			if (element.flip) {
				element.flip();
			}
		}

		// play tap sound
		//
		if (elements.length == 1) {
			application.play('tap');
		}
	},

	flipAll: function() {
		this.getActiveViewport().elementsView.flipAll();

		// play reorder sound
		//
		if (this.numElements() == 1) {
			application.play('reorder');
		}
	},

	cutSelected: function() {
		let elementsView = this.getActiveViewport().elementsView;
		let elements = elementsView.collection;
		let selectedElements = elementsView.getSelectedModels();

		// cut elements
		//
		elementsView.update_viewport_offsets = false;
		for (let i = 0; i < selectedElements.length; i++) {
			elements.remove(selectedElements[i]);
		}
		this.setClipboard(selectedElements);

		// update viewport offsets
		//
		elementsView.update_viewport_offsets = true;
		elementsView.update();

		// update
		//
		this.onChange();

		// play cut sound
		//
		application.play('cut');
	},

	copySelected: function() {
		let elementsView = this.getActiveViewport().elementsView;
		let selectedElements = elementsView.getSelectedModels({
			clone: true
		});
		this.setClipboard(selectedElements);

		// update
		//
		this.onChange();

		// play copy sound
		//
		application.play('copy');
	},

	pasteSelected: function() {
		let clipboardItems = this.getClipboardItems();
		let elementsView = this.getActiveViewport().elementsView;
		let elements = elementsView.collection;
		let index = elementsView.getSelectedIndex();

		// paste elements
		//
		elementsView.update_viewport_offsets = false;
		for (let i = 0; i < clipboardItems.length; i++) {
			elements.add(clipboardItems[i], {
				at: index
			});
			if (index != undefined) {
				index++;
			}
		}

		// update viewport offsets
		//
		elementsView.update_viewport_offsets = true;
		elementsView.update();

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

	duplicateSelected: function() {
		this.copySelected();
		this.pasteSelected();
		this.clearClipboard();

		// update
		//
		this.onChange();
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
	// model deleting methods
	//

	deleteModel: function(model) {
		this.getActiveViewport().deleteModel(model);
	},

	deleteModels: function(models, options) {
		let elementsView = this.getActiveViewport().elementsView;

		if (options && options.duration > 0) {
			let index = models.length - 1;

			// delete elements with a delay between each
			//
			elementsView.update_viewport_offsets = false;
			for (let i = 0; i < models.length; i++) {
				window.setTimeout(() => {
					let model = models[index--];
					this.deleteModel(model);

					// update viewport offsets
					//
					elementsView.update_viewport_offsets = true;
					elementsView.update();

					// update
					//
					this.onChange();

					// play 'delete' sound
					//
					application.play('remove');
				}, i * options.duration);
			}
		} else {
			let deleted = [];

			// immediately delete all elements
			//
			elementsView.update_viewport_offsets = false;
			for (let i = 0; i < models.length; i++) {
				let model = models[i];
				deleted.push(model);
				this.deleteModel(model);
			}

			// update viewport offsets
			//
			elementsView.update_viewport_offsets = true;
			if (deleted.length > 1 || deleted[0].has('thickness') || deleted[0].has('spacing')) {
				elementsView.update();
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
		let models = this.getActiveViewport().getSelectedModels();

		if (models.length == 0) {

			// notify no items
			//
			application.alert({
				title: "Delete",
				message: "No items were selected."
			});
		} else {

			// confirm delete
			//
			application.confirm({
				title: "Delete",
				message: "Are you sure that you want to delete " + this.getModelsDescription(models) + "?",
				
				// callbacks
				//
				accept: () => {
					this.deleteModels(models);
				}
			});
		}
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

	panToDirection: function(direction) {
		this.getActiveViewport().panToDirection(direction, {
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
				ColorScheme.setScheme(key, new ColorScheme(json[key]));
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
	// message rendering methods
	//

	showHelpMessage: function() {
		this.showMessage("No optics.", {
			icon: '<i class="fa fa-database rotated flipped"></i>',

			// callbacks
			//
			onclick: () => this.showOpenDialog()
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
		if (!this.options.hidden || !this.options.hidden['footer-bar']) {
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
			model: this.directory,

			// sidebar preferences
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
			show_sidebar: this.preferences.get('show_data_editor'),
			sidebar_size: this.preferences.get('data_editor_bar_size'),
			// icons: this.constructor.icons,

			// callbacks
			//
			onload: () => this.onLoad(),
			onactivate: () => this.onActivate(),
			onselect: (element) => this.onSelect(element),
			ondeselect: (element) => this.onDeselect(element),
			onchange: (attribute) => this.onChange(attribute),
			onchangeselection: () => this.onChangeSelection(),
			oncopy: () => this.parent.copy(),
			ondropin: (items) => this.onDropIn(items),
			onclose: (tabIndex) => this.closeTab(tabIndex),
			onmousemove: (event) => this.onMouseMove(event),
			onreorder: () => this.onReorder()
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
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

				// start with home directory
				//
				model: directory || this.getHomeDirectory(),

				// options
				//
				title: "Open Optics",

				// callbacks
				//
				onopen: (items) => this.openItems(items)
			}));
		});
	},

	showInfoDialog: function() {
		import(
			'../../../views/apps/optic-editor/dialogs/info/optic-info-dialog-view.js'
		).then((OpticInfoDialogView) => {

			// show optic info dialog
			//
			this.show(new OpticInfoDialogView.default({
				model: this.getActiveViewport().model,
				file: this.getActiveModel()
			}));
		});
	},

	showAddElementDialog: function(elementKind) {
		import(
			'../../../views/apps/optic-editor/dialogs/elements/add-element-dialog-view.js'
		).then((AddElementDialogView) => {

			// show add element dialog
			//
			this.show(new AddElementDialogView.default({
				model: this.getElement(elementKind),
				collection: this.getActiveViewport().model.elements,
				viewport: this.getActiveViewport()
			}));
		});
	},

	showAddStopDialog: function() {
		import(
			'../../../views/apps/optic-editor/dialogs/elements/add-stop-dialog-view.js'
		).then((AddStopDialogView) => {

			// show add stop dialog
			//
			this.show(new AddStopDialogView.default({
				collection: this.getActiveViewport().model.elements,
				viewport: this.getActiveViewport()
			}));
		});
	},

	showAddSensorDialog: function() {
		import(
			'../../../views/apps/optic-editor/dialogs/elements/add-sensor-dialog-view.js'
		).then((AddSensorDialogView) => {

			// show add sensor dialog
			//
			this.show(new AddSensorDialogView.default({
				collection: this.getActiveViewport().model.elements,
				viewport: this.getActiveViewport()
			}));
		});
	},

	showAddCameraDialog: function() {
		import(
			'../../../views/apps/optic-editor/dialogs/elements/add-camera-dialog-view.js'
		).then((AddCameraDialogView) => {

			// show add camera dialog
			//
			this.show(new AddCameraDialogView.default({
				collection: this.getActiveViewport().model.elements,
				viewport: this.getActiveViewport()
			}));
		});
	},

	showPreferencesDialog: function() {
		require([
			'views/apps/code-editor/dialogs/preferences-dialog-view',
		], (PreferencesDialogView) => {

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

		// update attributes
		//
		this.model = this.getActiveModel();

		// activate toolbar views
		//
		this.getChildView('header').onActivate();

		// activate optics toolbar
		//
		this.getChildView('mainbar panes toolbar').onActivate();
	},

	onLoad: function() {

		// call superclass method
		//
		AppSplitView.prototype.onLoad.call(this);

		// update optics toolbar
		//
		this.getChildView('mainbar panes toolbar').onLoad();

		// flag pane view
		//
		this.getActivePaneView().loaded = true;
	},

	onChange: function(attribute) {

		// call superclass method
		//
		AppSplitView.prototype.onChange.call(this, attribute);

		// update optics toolbar
		//
		this.getChildView('mainbar panes toolbar').onChange();

		// set dirty flag
		//
		switch (attribute) {
			case 'element':
				if (this.getActivePaneView().loaded) {
					this.setDirty();
				}
				break;
			case 'colors':
				break;
		}
	},

	onReorder: function() {
		application.play('reorder');
	},

	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// call superclass method
		//
		AppSplitView.prototype.onSelect.call(this, item);

		// update
		//
		this.onChangeSelection();
	},

	onDeselect: function(item) {

		// call superclass method
		//
		AppSplitView.prototype.onDeselect.call(this, item);

		// update
		//
		this.onChangeSelection();
	},

	onChangeSelection: function() {

		// call superclass method
		//
		AppSplitView.prototype.onChangeSelection.call(this);

		// update optics toolbar
		//
		this.getChildView('mainbar panes toolbar').onChangeSelection();
	},

	//
	// mouse event handling methods
	//

	onMouseMove: function() {
		if (this.hasStatusBar()) {
			this.getStatusBar().onMouseMove();
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropIn: function(items) {

		// play upload sound
		//
		application.play('upload');

		// open optics files
		//
		this.openItems(items);
	},

	//
	// file event handling methods
	//

	onSave: function() {

		// update views
		//
		this.getChildView('header menu').onSave();
		this.getChildView('content').onChange();

		// reset changed flag
		//
		this.setDirty(false);
	}
}), {

	//
	// static attributes
	//

	defaultName: 'Untitled.optc',
	clipboard: []
});