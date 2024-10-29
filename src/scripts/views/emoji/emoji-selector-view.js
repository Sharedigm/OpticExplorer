/******************************************************************************\
|                                                                              |
|                             emoji-selector-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for an emoji selector.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import '../../../vendor/bootstrap/js/tab.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	className: 'emoji selector',

	template: template(`
		<ul class="nav nav-tabs compact" role="tablist">
			<li role="presentation" class="active"><a role="tab" data-toggle="tab" title="smileys">😀</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="activities-and-sports">⚽</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="animals-and-nature">🐶</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="flags">🏳</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="food-and-drinks">🍏</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="objects">⌚️</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="people">👶</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="clothing-and-accessories">👚</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="symbols">❤️</a></li>
			<li role="presentation"><a role="tab" data-toggle="tab" title="travel-and-places">🚗</a></li>
		</ul>
		
		<div class="tab-content">
		
			<div role="tabpanel" class="smileys tab-pane active">
				<% for (let i = 0; i < smileys.length; i++) { %>
				<% let item = smileys[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="activities-and-sports tab-pane">
				<% for (let i = 0; i < activities_and_sports.length; i++) { %>
				<% let item = activities_and_sports[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
			
			<div role="tabpanel" class="animals-and-nature tab-pane">
				<% for (let i = 0; i < animals_and_nature.length; i++) { %>
				<% let item = animals_and_nature[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="flags tab-pane">
				<% for (let i = 0; i < flags.length; i++) { %>
				<% let item = flags[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="food-and-drinks tab-pane">
				<% for (let i = 0; i < food_and_drinks.length; i++) { %>
				<% let item = food_and_drinks[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="objects tab-pane">
				<% for (let i = 0; i < objects.length; i++) { %>
				<% let item = objects[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="people tab-pane">
				<% for (let i = 0; i < people.length; i++) { %>
				<% let item = people[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="clothing-and-accessories tab-pane">
				<% for (let i = 0; i < clothing_and_accessories.length; i++) { %>
				<% let item = clothing_and_accessories[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="symbols tab-pane">
				<% for (let i = 0; i < symbols.length; i++) { %>
				<% let item = symbols[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		
			<div role="tabpanel" class="travel-and-places tab-pane">
				<% for (let i = 0; i < travel_and_places.length; i++) { %>
				<% let item = travel_and_places[i]; %>
				<span class="emoji" title="<%= item.description %>"><%= item.emoji %></span>
				<% } %>
			</div>
		</div>
	`),

	events: {
		'mousedown': 'onMouseDown',
		'click .nav-tabs a': 'onClickTab',
		'click .tab-pane .emoji': 'onClickEmoji',
	},

	skinToneModifiers: [
		'1f3fb',		// light
		'1f3fc',		// medium light
		'1f3fd',		// medium
		'1f3fe',		// medium dark
		'1f3ff'			// dark
	],

	//
	// rendering methods
	//

	templateContext: function() {
		let emoji = config.emoji;

		for (let i = 0; i < emoji.length; i++) {
			emoji[i].order = i;
		}

		return {
			smileys: emoji.filter((object) => object.category == 'People' && object.order < 96),
			activities_and_sports: emoji.filter((object) => object.category == 'Activity'),
			animals_and_nature: emoji.filter((object) => object.category == 'Nature'),
			flags: emoji.filter((object) => object.category == 'Flags'),
			food_and_drinks: emoji.filter((object) => object.category == 'Foods'),
			objects: emoji.filter((object) => object.category == 'Objects'),
			people: emoji.filter((object) => object.category == 'People' && object.order > 96 && object.order < 265),
			clothing_and_accessories: emoji.filter((object) => object.category == 'People' && object.order >= 265),
			symbols: emoji.filter((object) => object.category == 'Symbols'),
			travel_and_places: emoji.filter((object) => object.category == 'Places')
		};
	},

	toCodePoints: function(string) {
		let codePoints = [];
		let index = 0;

		function surrogatePairToCodePoint(charCode1, charCode2) {
			return ((charCode1 & 0x3FF) << 10) + (charCode2 & 0x3FF) + 0x10000;
		}

		while (index < string.length) {
			let value1 = string.charCodeAt(index);
			let value2 = string.charCodeAt(index + 1);
			let codePoint = surrogatePairToCodePoint(value1, value2);
			codePoints.push(codePoint);
			index += 2;

			// skip newline
			//
			while (string.charCodeAt(index) == 10) {
				index += 1;
			}
		}

		return codePoints;
	},

	codePointToChar: function(codePoint) {
		return '&#x' + codePoint + ';';
	},

	toLinks: function(string) {
		let html = '';
		let codePoints = this.toCodePoints(string);
		let index = 0;
		let unique = [];

		while (index < codePoints.length) {
			let codePoint = codePoints[index].toString(16);

			if (!unique.contains(codePoint) && !this.skinToneModifiers.contains(codePoint)) {
				if (codePoint.startsWith('1f')) {
					html += '<a href="' + codePoint + '">' + this.codePointToChar(codePoint) + '</a>';	
					index++;
					unique.push(codePoint);		
				} else {
					index++;
				}
			} else {
				index++;
			}
		}

		return html;
	},

	/*
	toLinks: function(string) {
		let html = '';
		let index = 0;

		function surrogatePairToCodePoint(charCode1, charCode2) {
			return ((charCode1 & 0x3FF) << 10) + (charCode2 & 0x3FF) + 0x10000;
		}

		while (index < string.length) {
			let value1 = string.charCodeAt(index);
			let value2 = string.charCodeAt(index + 1);
			let codePoint = surrogatePairToCodePoint(value1, value2).toString(16);

			if (this.skinToneModifiers.contains(codePoint)) {

				// skip
				//
				index += 4;
			} else {
				if (codePoint.startsWith('1f')) {
					html += '<a href="' + codePoint + '">' + '&#x' + codePoint + ';' + '</a>';
				}
				index += 2;
			}

			// skip newline
			//
			while (string.charCodeAt(index) == 10) {
				index += 1;
			}
		}

		return html;
	},
	*/

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {

		// block event from parent
		//
		this.block(event);
	},

	onClickTab: function(event) {
		let tab = $(event.target).closest('li');
		let title = $(event.target).attr('title');

		// set active tab
		//
		this.$el.find('li.active').removeClass('active');
		tab.addClass('active');

		// set active tab pane
		//
		this.$el.find('.tab-pane.active').removeClass('active');
		this.$el.find('.' + title).addClass('active');

		// block event from parent
		//
		this.block(event);
	},

	onClickEmoji: function(event) {
		let description = $(event.target).attr('title');
		let emoji = config.emoji;

		// find emoji by description
		//
		let item = emoji.filter((emoji) => emoji.description == description)[0];

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item.emoji);
		}
		
		// block event from parent
		//
		this.block(event);
	}
});
