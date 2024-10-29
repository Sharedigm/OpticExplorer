/******************************************************************************\
|                                                                              |
|                             user-summary-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read-only view of the user's profile info.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../../models/places/place.js';
import BaseView from '../../../../../../views/base-view.js';
import '../../../../../../utilities/time/date-utils.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'form',
	className: 'inline form-horizontal',

	template: template(`
		<% if (typeof bio == 'string') { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-comment form-icon"></i></label>
			<p class="form-control-static"><%= bio %></p>
		</div>
		<% } %>
		
		<% if (typeof age == 'number' || typeof gender == 'string' && gender != '') { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-user form-icon"></i></label>
			<p class="form-control-static">
				<% if (typeof age == 'number') { %>
				<%= age %> year old
				&nbsp;
				<% } %>
				<% if (typeof gender ==  'string' && gender != '') { %>
				<% if (gender == 'male') { %>
				<i class="fa fa-mars"></i>
				<% } else if (gender == 'female') { %>
				<i class="fa fa-venus"></i>
				<% } else if (gender == 'other') { %>
				<i class="fa fa-venus-mars"></i>
				<% } %>
				<% } %>
			</p>
		</div>
		<% } %>
		
		<% if (typeof interests == 'object' && interests && interests.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-snowflake form-icon"></i></label>
			<p class="form-control-static">interested in <%= interests? interests.join(', ') : '' %></p>
		</div>
		<% } %>
		
		<% if (typeof likes == 'object' && likes && likes.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-thumbs-up form-icon"></i></label>
			<p class="form-control-static">likes <%= likes? likes.join(', ') : '' %></p>
		</div>
		<% } %>
		
		<% if (typeof dislikes == 'object' && dislikes && dislikes.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-thumbs-down form-icon"></i></label>
			<p class="form-control-static">dislikes <%= dislikes? dislikes.join(', ') : '' %></p>
		</div>
		<% } %>
		
		<% if (typeof skills == 'object' && skills && skills.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-lightbulb form-icon"></i></label>
			<p class="form-control-static">is skilled at <%= skills? skills.join(', ') : '' %></p>
		</div>
		<% } %>
		
		<% if (typeof skills == 'object' && experiences && experiences.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-lightbulb form-icon"></i></label>
			<p class="form-control-static">experienced <%= skills? experiences.join(', ') : '' %></p>
		</div>
		<% } %>
		
		<% if (typeof skills == 'object' && goals && goals.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-trophy form-icon"></i></label>
			<p class="form-control-static">hopes to <%= skills? goals.join(', ') : '' %></p>
		</div>
		<% } %>
		
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-home form-icon"></i></label>
			<p class="form-control-static">
				living
				<% if (typeof home == 'string') { %>
				in <%= home %>
				<% } else { %>
				on planet Earth
				<% } %>
			</p>
		</div>
		
		<% if (typeof occupation == 'string') { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-briefcase form-icon"></i></label>
			<p class="form-control-static">
				working as a <%= occupation %>
			</p>
		</div>
		<% } %>
		
		<% if (typeof family == 'object' && model.hasSiblings()) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-user-circle form-icon"></i></label>
			<p class="form-control-static">
				<% let brothers = family['brother']; %>
				<% let sisters = family['sister']; %>
				with
				<% if (!brothers) { %>
				no brothers
				<% } else if (brothers == 1) { %>
				one brother
				<% } else { %>
				<%= brothers %> brothers
				<% } %>
				and
				<% if (!sisters) { %>
				no sisters
				<% } else if (sisters == 1) { %>
				one sister
				<% } else { %>
				<%= sisters %> sisters
				<% } %>
			</p>
		</div>
		<% } %>
		
		<% if (model.isMarried() || model.hasPartner()) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-heart form-icon"></i></label>
			<p class="form-control-static">
				<% if (model.isMarried()) { %>
				is married
				<% } else if (model.hasPartner()) { %>
				is in a relationship
				<% } else { %>
				is single
				<% } %>
			</p>
		</div>
		<% } %>
		
		<% if (model.hasChildren()) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-user-circle form-icon"></i></label>
			<p class="form-control-static">
				<% if (gender == 'male') { %>
				father to
				<% } else if (gender = 'female') { %>
				mother to
				<% } else { %>
				parent to
				<% } %>
				<% let sons = family['son']; %>
				<% let daughters = family['daughter']; %>
				<% if (sons == 1) { %>
				one son
				<% } else if (sons > 1) { %>
				<%= sons %> sons
				<% } %>
				<% if (sons > 0 && daughters > 0) { %>
				and
				<% } %>
				<% if (daughters == 1) { %>
				one daughter
				<% } else if (daughters > 1) { %>
				<%= daughters %> daughters
				<% } %>
			</p>
		</div>
		<% } %>
		
		<% if (typeof education == 'string') { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-university form-icon"></i></label>
			<p class="form-control-static">
				educated at <%= education %>
			</p>
		</div>
		<% } %>
		
		<% if (typeof affiliation_names == 'object' && affiliation_names && affiliation_names.length > 0) { %>
		<div class="form-group">
			<label class="form-label form-label-static"><i class="fa fa-users form-icon"></i></label>
			<p class="form-control-static">
				affiliated with <%= affiliation_names.join(', ') %>
			</p>
		</div>
		<% } %>
		
		<% if (user.has('check_in')) { %>
		<div class="check-in form-group">
			<label class="form-label form-label-static"><i class="fa fa-map-marker form-icon"></i></label>
			<p class="form-control-static">
				checked in at <a class="where"><%= user.get('check_in').get('name') %></a> <a class="when"><%= user.get('check_in').when() %></a>
			</p>
		</div>
		<% } %>
	`),

	events: {
		'click .where': 'onClickWhere',
		'click .when': 'onClickWhen'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model,

			// options
			//
			user: this.options.user,

			// capabilitiess
			//
			collapsable: this.options.collapsable,
			editable: this.options.editable
		};
	},

	//
	// mouse event handling methods
	//

	onClickWhere: function() {
		application.launch('map_viewer', {
			place: new Place(this.options.user.get('check_in').attributes)
		});
	},

	onClickWhen: function() {
		application.launch('calendar', {
			date: this.options.user.get('check_in').get('created_at')
		});
	}
});