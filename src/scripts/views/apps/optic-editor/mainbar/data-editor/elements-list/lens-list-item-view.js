/******************************************************************************\
|                                                                              |
|                            lens-list-item-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a lens list item.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ElementsListItemView from '../../../../../../views/apps/optic-editor/mainbar/data-editor/elements-list/elements-list-item-view.js';
import Units from '../../../../../../utilities/math/units.js';

export default ElementsListItemView.extend({

	//
	// attributes
	//

	template: _.template(`
		<td class="kind">
			<%= icon %>
			<%= kind %>
		</td>

		<td class="thickness" contenteditable="true">
			<%= thickness %>
		</td>

		<td class="focal-length">
			<%= focal_length %>
		</td>

		<td class="spacing" contenteditable="true">
			<%= spacing %>
		</td>

		<% if (false) { %>
		<td class="beveled td-sm hidden-xs">
			<input type="checkbox"<% if (beveled) { %> checked<% } %>>
		</td>
		<% } %>

		<td class="is-hidden td-sm hidden-xs">
			<input type="checkbox"<% if (hidden) { %> checked<% } %>>
		</td>

		<td class="material hidden-xs">
			<div class="tile" style="background-color: <%= color %>"></div>
			<%= material %>
		</td>
	`),

	events: _.extend({}, ElementsListItemView.prototype.events, {
		'blur .thickness': 'onBlurThickness',
		'blur .spacing': 'onBlurSpacing',
		'click .beveled input': 'onClickBeveled',
		'click .is-hidden input': 'onClickHidden'
	}),

	//
	// form getting methods
	//

	getValue: function(kind) {
		switch (kind) {
			case 'thickness': 
				return Units.parse(this.$el.find('.thickness').text().trim());
			case 'spacing': 
				return Units.parse(this.$el.find('.spacing').text().trim());
			case 'beveled':
				return this.$el.find('.beveled input').is(':checked');
			case 'hidden':
				return this.$el.find('.is-hidden input').is(':checked');
		}
	},

	getValues: function() {
		return {
			thickness: this.getValue('thickness'),
			spacing: this.getValue('spacing'),
			beveled: this.getValue('beveled'),
			hidden: this.getValue('hidden')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		let kind = this.model.getKind();
		let icon = kind.replace(/ /g, '_');

		return {
			icon: this.constructor.icons[icon],
			kind: kind.toTitleCase(),
			thickness: this.model.has('thickness')? this.model.get('thickness').toString() : 0,
			focal_length: this.model.getFocalLength? new Units(this.model.getFocalLength(), 'mm').toString() : 0,
			spacing: this.model.has('spacing')? this.model.get('spacing').toString() : 0,
			beveled: this.model.get('beveled'),
			hidden: this.model.get('hidden'),
			material: this.model.has('material')? this.model.get('material').toString() : '',
			color: this.model.has('material')? this.model.get('material').getColor() : ''
		};
	},

	onRender: function() {

		// make list item grabbable
		//
		this.$el.addClass('grabbable');
		
		// set selected
		//
		let elementView = this.getElementView();
		if (elementView && elementView.isSelected()) {
			this.$el.addClass('selected');
		}

		// perform initial validation
		//
		this.validate();
	},

	//
	// highlighting methods
	//

	highlight: function() {

		// highlight current surface
		//
		this.$el.addClass('highlighted');

		// highlight adjacent surface
		//
		if (this.model.index == 0) {

			// highlight next surface
			//
			this.$el.next().addClass('highlighted');
		} else {

			// highlight prev surface
			//
			this.$el.prev().addClass('highlighted');
		}

		this.onHighlight();
	},

	unhighlight: function() {
		this.$el.removeClass('highlighted');

		// unhighlight adjacent surface
		//
		if (this.model.index == 0) {

			// unhighlight next surface
			//
			this.$el.next().removeClass('highlighted');
		} else {

			// unhighlight prev surface
			//
			this.$el.prev().removeClass('highlighted');
		}

		this.onUnhighlight();
	},

	//
	// validation methods
	//

	validate: function() {
		let thickness = this.getValue('thickness');
		let spacing = this.getValue('spacing');

		// unhighlight errors
		//
		this.hideErrors();

		// check thicknes
		//
		if (typeof thickness == 'string') {
			return this.showError('thickness', thickness);
		} else if (thickness && thickness.value < 0) {
			return this.showError('thickness', "This must be a positive value.");

		// check spacing
		//
		} else if (typeof spacing == 'string') {
			return this.showError('spacing', spacing);
		} else if (spacing && (isNaN(spacing.value) || spacing.value < 0)) {
			return this.showError('spacing', "This must be a positive value.");
		}

		return true;
	},

	//
	// mouse event handling methods
	//

	onBlurThickness: function() {
		this.updateValue('thickness');
	},

	onBlurSpacing: function() {
		this.updateValue('spacing');
	},

	onClickBeveled: function() {
		this.updateValue('beveled');
	},

	onClickHidden: function() {
		this.updateValue('hidden');
	}
}, {
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