/******************************************************************************\
|                                                                              |
|                              tab-panes-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying tab panes.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import EditableTabPanesView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-panes-view.js';
import TabPaneView from '../../../../../../views/apps/optic-editor/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import OpticsToolbarView from '../../../../../../views/apps/optic-editor/mainbar/toolbar/optics-toolbar-view.js';

export default EditableTabPanesView.extend({

	//
	// attributes
	//

	childView: TabPaneView,

	template: template(`
		<svg>
			<defs>
				<%= filters %>
				<%= markers %>
				<%= gradients %>
			</defs>
		</svg>
		<div class="optics panes"></div>
		<div class="toolbar"></div>
	`),

	childViewContainer: '.panes',

	regions: {
		'toolbar': {
			el: '.toolbar',
			replaceElement: true
		}
	},

	filters: `
		<!-- shadow effect filters -->

		<filter id="hard-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
		</filter>

		<filter id="offset" width="200%" height="200%">
			<feOffset in="SourceGraphic" dx="5" dy="10" />
		</filter>

		<filter id="colored-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feColorMatrix type="matrix" values=
				".5  0  0  0  0
				  0 .5  0  0  0
				  0  0 .5  0  0
				  0  0  0  1  0" />
		</filter>

		<!-- soft shadow effect filters -->

		<filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="0.025" />
		</filter>

		<filter id="colored-soft-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceGraphic" stdDeviation=".025" />
			<feColorMatrix type="matrix" values=
				".5  0  0  0  0
				  0 .5  0  0  0
				  0  0 .5  0  0
				  0  0  0  1  0" />
		</filter>

		<!-- softer shadow effect filters -->

		<filter id="softer-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="0.1" />
		</filter>

		<filter id="colored-softer-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceGraphic" stdDeviation=".1" />
			<feColorMatrix type="matrix" values=
				".5  0  0  0  0
				  0 .5  0  0  0
				  0  0 .5  0  0
				  0  0  0  1  0" />
		</filter>

		<!-- softest shadow effect filters -->

		<filter id="softest-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="0.25" />
		</filter>

		<filter id="colored-softest-shadow" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox" filterRes="100">
			<feGaussianBlur in="SourceGraphic" stdDeviation=".25" />
			<feColorMatrix type="matrix" values=
				".5  0  0  0  0
				  0 .5  0  0  0
				  0  0 .5  0  0
				  0  0  0  1  0" />
		</filter>

		<!-- drop shadowed effect filters -->

		<filter id="drop-shadowed" x="-50%" y="-50%" width="200%" height="200%" primitiveUnits="objectBoundingBox">
			<feGaussianBlur in="SourceAlpha" stdDeviation="0" /> 
			<feOffset dx="0.25" dy=".125" result="offsetblur" />
			<feComponentTransfer>
				<feFuncA type="linear" slope="0.2" />
			</feComponentTransfer>
			<feMerge> 
				<feMergeNode/>
				<feMergeNode in="SourceGraphic" /> 
			</feMerge>
		</filter>

		<linearGradient id="highlight" x1="0%" x2="0%" y1="0%" y2="100%">
			<stop offset="0%" stop-color="white" stop-opacity="0" />
			<stop offset="20%" stop-color="white" stop-opacity="1.0" />
			<stop offset="25%" stop-color="white" stop-opacity="1.0" />
			<stop offset="50%" stop-color="white" stop-opacity="0.25" />
			<stop offset="100%" stop-color="white" stop-opacity="0" />
		</linearGradient>

		<linearGradient id="inverse-highlight" x1="0%" x2="0%" y1="100%" y2="0%">
			<stop offset="0%" stop-color="white" stop-opacity="0" />
			<stop offset="20%" stop-color="white" stop-opacity="1.0" />
			<stop offset="25%" stop-color="white" stop-opacity="1.0" />
			<stop offset="50%" stop-color="white" stop-opacity="0.25" />
			<stop offset="100%" stop-color="white" stop-opacity="0" />
		</linearGradient>

		<!-- background filters -->

		<filter x="-.05" y="0" width="1.1" height="1" id="white-background">
			<feFlood flood-color="white"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0" width="1.1" height="1" id="black-background">
			<feFlood flood-color="black"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0" width="1.1" height="1" id="dark-background">
			<feFlood flood-color="#333b55"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<filter x="-.05" y="0" width="1.1" height="1" id="dark-colored-background">
			<feFlood flood-color="#273060"/>
			<feComposite in="SourceGraphic"/>
		</filter>

		<!-- glow effect filters -->

		<filter id="glowing" x="-500%" y="-500%" width="1000%" height="1000%" primitiveUnits="objectBoundingBox">
			<feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
			<feColorMatrix type="matrix" in="blur" result="blur" values=
				"1  0  0  0  0
				 0  1  0  0  0
				 0  0  1  0  0
				 0  0  0  1  0"/>
			<feMerge> 
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/> 
			</feMerge>
		</filter>

		<filter id="very-lightly-glowing" x="-5%" y="-5%" width="110%" height="110%" primitiveUnits="objectBoundingBox">
			<feGaussianBlur in="SourceGraphic" stdDeviation="0.005" result="blur"/>
			<feColorMatrix type="matrix" in="blur" result="blur" values=
				"1  0  0  0  0
				 0  1  0  0  0
				 0  0  1  0  0
				 0  0  0  1  0"/>
			<feMerge> 
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/> 
			</feMerge>
		</filter>

		<filter id="lightly-glowing" x="-125%" y="-125%" width="250%" height="250%" primitiveUnits="objectBoundingBox">
			<feGaussianBlur in="SourceGraphic" stdDeviation="0.1" result="blur"/>
			<feColorMatrix type="matrix" in="blur" result="blur" values=
				"1  0  0  0  0
				 0  1  0  0  0
				 0  0  1  0  0
				 0  0  0  1  0"/>
			<feMerge> 
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/> 
			</feMerge>
		</filter>

		<filter id="strongly-glowing" x="-250%" y="-250%" width="500%" height="500%" primitiveUnits="objectBoundingBox">
			<feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
			<feColorMatrix type="matrix" in="blur" result="blur" values=
				"2  0  0  0  0
				 0  2  0  0  0
				 0  0  2  0  0
				 0  0  0  2  0"/>
			<feMerge> 
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/> 
			</feMerge>
		</filter>
	`,

	gradients: `
		<linearGradient id="highlight" x1="0%" x2="0%" y1="0%" y2="100%">
			<stop offset="0%" stop-color="white" stop-opacity="0" />
			<stop offset="20%" stop-color="white" stop-opacity="1.0" />
			<stop offset="25%" stop-color="white" stop-opacity="1.0" />
			<stop offset="50%" stop-color="white" stop-opacity="0.25" />
			<stop offset="75%" stop-color="white" stop-opacity="0.5" />
			<stop offset="80%" stop-color="white" stop-opacity="0.5" />
			<stop offset="100%" stop-color="white" stop-opacity="0" />
		</linearGradient>
	`,

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			
			// mainbar options
			//
			case 'scheme':
				this.setChildOptions(key, value);
				this.getChildView('toolbar').getChildView('current_material').update();
				break;

			default:
				this.setChildOptions(key, value);
		}
	},

	setChildOptions: function(key, value) {
		for (let i = 0; i < this.children.length; i++) {
			this.getChildViewAt(i).setOption(key, value);
		}
	},

	setToolbarVisibility: function(visible) {
		if (visible) {
			this.getChildView('toolbar').$el.show();
		} else {
			this.getChildView('toolbar').$el.hide();
		}
	},

	//
	// rendering methods
	//


	templateContext: function() {
		return {
			filters: this.filters,
			markers: this.markers,
			gradients: this.gradients
		};
	},

	onAttach: function() {
		this.showChildView('toolbar', new OpticsToolbarView({
			parent: this
		}));

		// hide toolbar
		//
		if (this.options.preferences) {
			let toolbars = this.options.preferences.get('toolbars');
			if (!toolbars.includes('optics')) {
				this.setToolbarVisibility(false);
			}
		}
	}
});