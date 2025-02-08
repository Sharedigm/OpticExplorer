/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .add-biconvex-lens': 'onClickAddBiConvexLens',
		'click .add-biconcave-lens': 'onClickAddBiConcaveLens',
		'click .add-convex-plano-lens': 'onClickAddConvexPlanoLens',
		'click .add-concave-plano-lens': 'onClickAddConcavePlanoLens',
		'click .add-plano-convex-lens': 'onClickAddPlanoConvexLens',
		'click .add-plano-concave-lens': 'onClickAddPlanoConcaveLens',
		'click .add-positive-meniscus-lens': 'onClickAddPositiveMeniscusLens',
		'click .add-negative-meniscus-lens': 'onClickAddNegativeMeniscusLens',
		'click .add-planar-lens': 'onClickAddPlanarLens',
		'click .add-stop': 'onClickAddStop',
		'click .add-sensor': 'onClickAddSensor',
		'click .add-camera': 'onClickAddCamera',
		'click .add-distant-light': 'onClickAddDistantLight',
		'click .add-point-light': 'onClickAddPointLight',
		'click .add-light-beam': 'onClickAddLightBeam',
		'click .add-light-ray': 'onClickAddLightRay',
		'click .add-scene-object': 'onClickAddSceneObject',
		'click .add-distant-object': 'onClickAddDistantObject',
		'click .edit-selected': 'onClickEditSelected',
		'click .flip-elements': 'onClickFlipElements',
		'click .cut': 'onClickCut',
		'click .copy': 'onClickCopy',
		'click .paste': 'onClickPaste',
		'click .put': 'onClickPut',
		'click .duplicate': 'onClickDuplicate',
		'click .delete': 'onClickDelete',
		'click .clear-clipboard': 'onClickClearClipboard'
	},
	
	//
	// querying methods
	//

	enabled: function() {
		let hasElements = this.parent.app.hasElements();
		let hasSensor = this.parent.app.hasElements('.sensor');
		let hasSelected = this.parent.app.hasSelected();
		let hasSelectedElements = this.parent.app.hasSelectedElements();
		let hasClipboardItems = this.parent.app.hasClipboardItems();

		return {
			'add-biconvex-lens': true,
			'add-biconcave-lens': true,
			'add-convex-plano-lens': true,
			'add-concave-plano-lens': true,
			'add-plano-convex-lens': true,
			'add-plano-concave-lens': true,
			'add-positive-meniscus-lens': true,
			'add-negative-meniscus-lens': true,
			'add-planar-lens': true,
			'add-stop': true,
			'add-sensor': !hasSensor,
			'add-camera': !hasSensor,
			'add-distant-light': true,
			'add-point-light': true,
			'add-light-beam': true,
			'add-light-ray': true,
			'add-scene-object': true,
			'add-distant-object': true,
			'edit-selected': hasSelected,
			'flip-elements': hasElements,
			'cut': hasSelectedElements,
			'copy': hasSelectedElements,
			'paste': hasClipboardItems,
			'put': hasClipboardItems,
			'duplicate': hasSelectedElements,
			'delete': hasSelected,
			'clear-clipboard': hasClipboardItems
		};
	},

	//
	// mouse event handling methods
	//

	onClickAddBiConvexLens: function() {
		this.parent.app.addLens('biconvex_lens');
	},

	onClickAddBiConcaveLens: function() {
		this.parent.app.addLens('biconcave_lens');
	},

	onClickAddConvexPlanoLens: function() {
		this.parent.app.addLens('convex_plano_lens');
	},

	onClickAddConcavePlanoLens: function() {
		this.parent.app.addLens('concave_plano_lens');
	},

	onClickAddPlanoConvexLens: function() {
		this.parent.app.addLens('plano_convex_lens');
	},

	onClickAddPlanoConcaveLens: function() {
		this.parent.app.addLens('plano_concave_lens');
	},

	onClickAddPositiveMeniscusLens: function() {
		this.parent.app.addLens('positive_meniscus_lens');
	},

	onClickAddNegativeMeniscusLens: function() {
		this.parent.app.addLens('negative_meniscus_lens');
	},

	onClickAddPlanarLens: function() {
		this.parent.app.addLens('planar_lens');
	},

	onClickAddStop: function() {
		this.parent.app.addStop();
	},

	onClickAddSensor: function() {
		this.parent.app.addSensor();
	},

	onClickAddCamera: function() {
		this.parent.app.addCamera();
	},

	onClickAddDistantLight: function() {
		this.parent.app.addDistantLight();
	},

	onClickAddPointLight: function() {
		this.parent.app.addPointLight();
	},

	onClickAddLightBeam: function() {
		this.parent.app.addLightBeam();
	},

	onClickAddLightRay: function() {
		this.parent.app.addLightRay();
	},

	onClickAddSceneObject: function() {
		this.parent.app.addSceneObject();
	},

	onClickAddDistantObject: function() {
		this.parent.app.addDistantObject();
	},

	onClickEditSelected: function() {
		this.parent.app.editSelected();
	},

	onClickFlipElements: function() {
		this.parent.app.flipSelectedElements();
	},

	onClickCut: function() {
		this.parent.app.cutSelected();
	},

	onClickCopy: function() {
		this.parent.app.copySelected();
	},

	onClickPaste: function() {
		this.parent.app.pasteSelected();
	},

	onClickPut: function() {
		this.parent.app.putSelected();
	},

	onClickDuplicate: function() {
		this.parent.app.duplicateSelected();
	},

	onClickDelete: function() {
		this.parent.app.deleteSelected();
	},

	onClickClearClipboard: function() {
		this.parent.app.clearClipboard();
	}
}, {

	//
	// static attributes
	//

	icons: {

		//
		// element icons
		//

		element: `
			<i class="element icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 50 512 562">
					<path d="m 103.6688,334.08496 c 0,119.18143 34.49617,215.79625 77.05269,215.79625 42.55265,0 77.05011,-96.61482 77.05011,-215.79625 0,-119.18143 -34.49746,-215.79625 -77.05011,-215.79625 -42.55652,0 -77.05269,96.61482 -77.05269,215.79625 z M 271.52554,168.2803 c 16.02674,44.88903 24.85413,103.77243 24.85413,165.80466 0,62.03223 -8.82739,120.91433 -24.85413,165.80466 -7.0964,19.87375 -15.48364,36.63374 -24.9957,49.99159 l 59.49057,0 c 42.55524,0 77.05269,-96.61482 77.05269,-215.79625 0,-119.18143 -34.49745,-215.79625 -77.05269,-215.79625 l -59.49057,0 c 9.51206,13.35785 17.8993,30.11654 24.9957,49.99159 z" />
				</svg>
			</i>
		`,
		stop: `
			<i class="stop icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 1000 1000">
					<path d="M608 443.5l-225 -382q47 -8 81 -8 177 0 304 120zm-33 168l233 -395q103 125 103 283 0 53 -16 112l-320 0zm-96 -280l-427 0q37 -91 109 -158t167 -97zm-24 335l423 0q-37 90 -108.5 156.5t-164.5 98.5zm-99 -278l-234 396q-104 -126 -104 -285 0 -52 16 -111l322 0zm-33 165l227 384q-48 9 -86 9 -172 0 -302 -120z" />
				</svg>
			</i>
		`,
		sensor: `
			<i class="sensor icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 24 24">
					<path d="M19 17c0 1.104-.896 2-2 2h-11c-1.104 0-2-.896-2-2v-11c0-1.104.896-2 2-2h11c1.104 0 2 .896 2 2v11zm-11 3v3h-1v-3h1zm4 0v3h-1v-3h1zm2 0v3h-1v-3h1zm-4 0v3h-1v-3h1zm6 0v3h-1v-3h1zm-8-20v3h-1v-3h1zm4 0v3h-1v-3h1zm2 0v3h-1v-3h1zm-4 0v3h-1v-3h1zm6 0v3h-1v-3h1zm4 15h3v1h-3v-1zm0-4h3v1h-3v-1zm0-2h3v1h-3v-1zm0 4h3v1h-3v-1zm0-6h3v1h-3v-1zm-20 8h3v1h-3v-1zm0-4h3v1h-3v-1zm0-2h3v1h-3v-1zm0 4h3v1h-3v-1zm0-6h3v1h-3v-1z"/>
				</svg>
			</i>
		`,
		camera: `
			<i class="fa fa-camera"></i>
		`,

		//
		// lens icons
		//

		biconvex: `
			<i class="biconvex icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 45, 5 c -9, 9.2 -15, 25.9 -15, 45c0, 19.1, 6, 35.8, 15, 45 h 10 c 9 -9.2, 15 -25.9, 15 -45 c 0 -19.1 -6 -35.8 -15 -45 H 45 z M 50.4, 85 h -0.8 c -6 -8.1 -9.6 -21.1 -9.6 -35 s 3.6 -26.9, 9.6 -35 h 0.8 c 6, 8.1, 9.6, 21.1, 9.6, 35 S 56.4, 76.9, 50.4, 85 z"/>
				</svg>
			</i>
		`,
		biconcave: `
			<i class="biconcave icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 25, 5 c 6, 9.2, 10, 25.9, 10, 45 c 0, 19.1 -4, 35.8 -10, 45h50c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 25 z M 59.8, 85 H 40.2 C 43.3, 74.9, 45, 62.8, 45, 50 s -1.7 -24.9 -4.8 -35 h 19.5 C 56.7, 25.1, 55, 37.2, 55, 50 S 56.7, 74.9, 59.8, 85 z"/>
				</svg>
			</i>
		`,
		planar: `
			<i class="planar icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 30, 5 v 90 h 35 c 0 0, 0 0 0 -45 c 0 0, 0 0, 0 -45 H 30 z M 54.8, 85 H 40 V 15 h 14.8 z "/>
				</svg>
			</i>
		`,
		plano_convex: `
			<i class="plano-convex icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path transform="translate(50, 50) scale(-1, 1) translate(-50, -50)" d="M 65, 95 V 5 H 50 c -9, 9.2 -15, 25.9 -15, 45 c 0, 19.1, 6, 35.8, 15, 45 H 65 z M 54.6, 15 H 55 v 70 h -0.4 c -6 -8.1 -9.6 -21.1 -9.6 -35 S 48.6, 23.1, 54.6, 15 z" />
				</svg>
			</i>
		`,
		plano_concave: `
			<i class="plano-concave icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 30, 5 v 90 h 40 c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 30 z M 54.8, 85 H 40 V 15 h 14.8 C 51.7, 25.1, 50, 37.2, 50, 50 S 51.7, 74.9, 54.8, 85 z "/>
				</svg>
			</i>
		`,
		convex_plano: `
			<i class="convex-plano icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 65, 95 V 5 H 50 c -9, 9.2 -15, 25.9 -15, 45 c 0, 19.1, 6, 35.8, 15, 45 H 65 z M 54.6, 15 H 55 v 70 h -0.4 c -6 -8.1 -9.6 -21.1 -9.6 -35 S 48.6, 23.1, 54.6, 15 z" />
				</svg>
			</i>
		`,
		concave_plano: `
			<i class="concave-plano icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path transform="translate(50, 50) scale(-1, 1) translate(-50, -50)" d="M 30, 5 v 90 h 40 c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 30 z M 54.8, 85 H 40 V 15 h 14.8 C 51.7, 25.1, 50, 37.2, 50, 50 S 51.7, 74.9, 54.8, 85 z "/>
				</svg>
			</i>
		`,
		positive_meniscus: `
			<i class="positive-meniscus icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 50, 5 c -12, 9.2 -20, 25.9 -20, 45 c 0, 19.1, 8, 35.8, 20, 45 h 20 c -6 -9.2 -10 -25.9 -10 -45 c 0 -19.1, 4 -35.8, 10 -45 H 50 z M 54.8, 85 h -1.1 C 45.2, 77, 40, 64, 40, 50 s 5.2 -27, 13.7 -35 h 1.1 C 51.7, 25.1, 50, 37.2, 50, 50 S 51.7, 74.9, 54.8, 85 z" />
				</svg>
			</i>
		`,
		negative_meniscus: `
			<i class="negative-meniscus icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 -5 100 100">
					<path d="M 75, 5 H 35 c -6, 9.2 -10, 25.9 -10, 45c0, 19.1, 4, 35.8, 10, 45 h 40 c -12 -9.2 -20 -25.9 -20 -45 C 55, 30.9, 63, 14.2, 75, 5z M53.7, 85 H 41 c -3.1 -7.2 -6 -19.3 -6 -35 c0 -15.7, 2.9 -27.8, 6 -35 h 12.7 C 48.1, 25.1, 45, 37.2, 45, 50 C 45, 62.8, 48.1, 74.9, 53.7, 85 z" />
				</svg>
			</i>
		`,

		//
		// light icons
		//

		distant_light: `
			<i class="distant-light icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
					<polygon points="256,60.082 293.022,225.727 462,209.75 315.903,296.147 383.314,451.918 256,339.67 128.686,451.918 196.097,296.147 50,209.75 218.978,225.727" transform="matrix(1.1,0,0,1.1,-53.76,-53.76)" />
				</svg>
			</i>
		`,
		point_light: `
			<i class="fa fa-lightbulb"></i>
		`,
		light_beam: `
			<i class="light-beam icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
					<path d="M307.5,153 c 0,0 -40.234,27.359 -64.626,42.439 c  -11.919,5.959 -25.062,9.061 -38.374,9.061H81.022
					C64.577,208.289,50,231.239,50,257.467 c 0,25.256,13.948,46.11,31.022,50.033H204.5 c 13.311,0,26.454,2.564,38.374,8.516
					C269.947,332.713,307.5,359,307.5,359V153z M170.167,273.166 c  -9.48,0 -17.167 -7.686 -17.167 -17.166
					 c 0 -9.479,7.687 -17.166,17.167 -17.166 c 9.48,0,17.167,7.687,17.167,17.166C187.333,265.48,179.647,273.166,170.167,273.166z M359,153
					v206h -34.334V153H359z M462,273.166h -68.666v -34.332H462V273.166z M462,161.584l -53.109,37.552l -18.608 -25.75l53.109 -37.552
					L462,161.584z M443.392,376.166l -53.109 -37.551l18.608 -25.75L462,350.416L443.392,376.166z"/>
				</svg>
			</i>
		`,
		light_ray: `
			<i class="light-ray icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24">
					<path d="M17 12c0 2.762-2.238 5-5 5s-5-2.238-5-5 2.238-5 5-5 5 2.238 5 5zm-9.184-5.599l-3.594-3.594-1.414 1.414 3.594 3.595c.402-.537.878-1.013 1.414-1.415zm4.184-1.401c.34 0 .672.033 1 .08v-5.08h-2v5.08c.328-.047.66-.08 1-.08zm5.598 2.815l3.594-3.595-1.414-1.414-3.594 3.595c.536.402 1.012.878 1.414 1.414zm-12.598 4.185c0-.34.033-.672.08-1h-5.08v2h5.08c-.047-.328-.08-.66-.08-1zm11.185 5.598l3.594 3.593 1.415-1.414-3.594-3.594c-.403.537-.879 1.013-1.415 1.415zm-9.784-1.414l-3.593 3.593 1.414 1.414 3.593-3.593c-.536-.402-1.011-.877-1.414-1.414zm12.519-5.184c.047.328.08.66.08 1s-.033.672-.08 1h5.08v-2h-5.08zm-6.92 8c-.34 0-.672-.033-1-.08v5.08h2v-5.08c-.328.047-.66.08-1 .08z" />
				</svg>
			</i>
		`,

		//
		// object icons
		//

		scene_object: `
			<i class="fa fa-arrow-up-long"></i>
		`,

		distant_object: `
			<i class="fa fa-moon"></i>
		`
	}
});