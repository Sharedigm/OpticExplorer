/******************************************************************************\
|                                                                              |
|                                 menu-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a generic (abstract class) menu view.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/base-view.js';
import Keyboard from '../../../../../../views/keyboard/keyboard.js';
import '../../../../../../../vendor/bootstrap/js/dropdown.js';

export default BaseView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'dropdown-menu',

	itemTemplate: template(`
		<li role="presentation"<% if (itemClass) { %> class="<%= itemClass %>"<% } %><% if (tags) { %> <%= tags %><% } %>>
			<a class="<%= linkClass %><% if (menu) { %> dropdown-toggle<% } %>">
				<% if (select != undefined) { %>
				<i class="fa fa-check"></i>
				<% } %>

				<% if (icon) { %>
				<% if (!icon.includes(' icon')) { %>
				<i class="<%= icon %>"></i>
				<% } else { %>
				<%= icons[icon.replace(' icon', '').replace(/-/g, '_')] %>
				<% } %>
				<% } %>
				<%= name %>

				<% if (menu) { %>
				<i class="fa fa-caret-left"></i>
				<i class="fa fa-caret-right"></i>
				<% } %>

				<% if (shortcut) { %>
				<span class="<%= shortcutClass %>"><%= shortcut %></span>
				<% } %>
			</a>
			<% if (menu) { %>
			<ul class="dropdown-menu" data-toggle="dropdown">
				<%= menu %>
			</ul>
			<% } %>
		</li>
	`),

	divider: '<li role="separator" class="divider"></li>',

	// initial state
	//
	selected: {},
	disabled: {},
	hidden: {},

	//
	// constructor
	//

	initialize: function() {
		window.MenuView = this.constructor;

		// replace click events with tap events
		//
		/*
		if (Browser.is_touch_enabled) {
			for (let key in this.events) {

				// remove click event
				//
				let value = this.events[key];
				delete this.events[key];

				// add tap event
				//
				key = key.replace('click', 'tap');
				this.events[key] = value;
			}
		}
		*/

		// set attributes
		//
		if (this.options.disabled != undefined) {
			this.disabled = this.options.disabled;
		}
		if (this.options.selected != undefined) {
			this.selected = this.options.selected;
		}
		if (this.options.hidden != undefined) {
			this.hidden = this.options.hidden;
		}

		// set menu open callback
		//
		this.$el.on('open', () => {
			this.onOpen();
		});

		// block events from lower elements
		//
		this.$el.on('mousedown', (event) => {
			event.stopPropagation();
		});
	},

	//
	// iterator
	//

	each: function(callback) {
		let items = this.$el.find('li');
		for (let i = 0; i < items.length; i++) {
			if (callback(items[i]) == false) {
				return;
			}
		}
	},

	//
	// querying methods
	//

	isOpen: function() {
		return this.$el.closest('.dropdown').hasClass('open');
	},

	isItemDisabled: function(name) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		return item.hasClass('disabled');
	},

	isItemSelected: function(name) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		return item.hasClass('selected');
	},

	isItemHidden: function(name) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		return item.hasClass('hidden');
	},

	isValidEvent: function(event) {

		// disregard editable or handled or repeated key events
		//
		if (event.isDefaultPrevented() || event.isPropagationStopped() || Keyboard.isAutorepeat(event) || event.originalEvent.repeat) {
			return false;
		}

		// disregard key events on input elements
		//
		if (this.constructor.inputs.includes(event.target.type) || event.target.isContentEditable) {
			return false;
		}

		// disregard delete events for editable items
		//
		/*
		if (event.keyCode == Keyboard.keyCodes['delete'] && (event.target.isContentEditable || ['input', 'text', 'search'].contains(event.target.type))) {
			return false;
		}
		*/

		return true;
	},
	
	//
	// getting methods
	//

	getMenuOrientation: function() {
		let menuWidth = this.$el.width();
		let originLeft = this.$el.parent().position().left;
		let containerWidth = this.$el.closest('.menu-bar').parent().width();
		return originLeft + menuWidth > containerWidth? 'left' : 'right';
	},

	getItem: function(name) {
		let className = name.replace(' ', '.').replace(/_/g, '-');
		if (className) {
			return this.$el.find('.' + className).closest('li');
		}
	},

	getItems: function() {
		if (this.items) {

			// get menu items from menu
			//
			return this.items;
		} else {

			// get menu items from resources
			//
			let appView = this.parent.parent.parent;
			let resourceName = this.region_name + '_menu';
			let resources = appView.getResources(resourceName);

			if (resources) {
				return resources.items;
			} else {
				return [];
			}
		}
	},

	getEnabledItems: function() {
		return this.$el.find('li:not(.divider):not(.disabled):not([style="display:none"])');
	},

	getShortcutKeys: function() {
		let shortcutKeys = [];
		let shortcuts = this.$el.find('.shortcut');
		for (let i = 0; i < shortcuts.length; i++) {

			// find shortcut key
			//
			let key = $(shortcuts[i]).text();
			if (key && key != '') {
				if (!shortcutKeys.contains(key)) {
					shortcutKeys.push(key);
				}
			}
		}
		return shortcutKeys;
	},

	getShortcutKeyCodes: function() {
		let shortcutKeys = this.getShortcutKeys();
		let keyCodes = [];
		for (let i = 0; i < shortcutKeys.length; i++) {
			keyCodes[i] = Keyboard.nameToKeyCode(shortcutKeys[i]);
		}
		return keyCodes;
	},

	getEventHandler: function(className) {
		let keys = Object.keys(this.events);
		for (let i = 0; i < keys.length; i++) {
			let pair = keys[i].split(' ');
			if (pair[1] == '.' + className) {
				return this.events[keys[i]];
			}
		}
	},

	getKeyCodeItem: function(keyCode) {
		let shortcuts = this.$el.find('li:not(.disabled):not(.hidden) .shortcut');
		for (let i = 0; i < shortcuts.length; i++) {
			let shortcut = shortcuts[i];
			let name = $(shortcut).text();
			if (keyCode == Keyboard.nameToKeyCode(name)) {
				return $(shortcut).closest('a').attr('class');
			}
		}
	},

	//
	// setting methods
	//

	setElementVisible: function(selector, visible) {
		if (visible !== false) {
			this.$el.find(selector).removeClass('hidden');
		} else {
			this.$el.find(selector).addClass('hidden');
		}
	},
	
	setItemVisible: function(name, visible) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		if (visible !== false) {
			item.removeClass('hidden');
		} else {
			item.addClass('hidden');
		}

		// hide / show prev divider if last item
		//
		let prev = item.prev();
		let next = item.next();
		if (prev.hasClass('divider') && next.length == 0) {
			if (visible !== false) {
				prev.removeClass('hidden');
			} else {
				prev.addClass('hidden');
			}
		}
	},

	setItemHidden: function(name, hidden) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		if (hidden !== false) {
			item.addClass('hidden');
		} else {
			item.removeClass('hidden');
		}

		// hide / show prev divider if last item
		//
		let prev = item.prev();
		let next = item.next();
		if (prev.hasClass('divider') && next.length == 0) {
			if (hidden !== false) {
				prev.addClass('hidden');
			} else {
				prev.removeClass('hidden');
			}
		}
	},

	setItemEnabled: function(name, enabled) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		if (enabled !== false) {
			item.removeClass('disabled');
		} else {
			item.addClass('disabled');
		}
	},

	setItemDisabled: function(name, disabled) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		if (disabled !== false) {
			item.addClass('disabled');
		} else {
			item.removeClass('disabled');
		}
	},

	setItemSelected: function(name, selected) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		if (selected !== false) {
			item.addClass('selected');
		} else {
			item.removeClass('selected');
		}
	},

	setItemDeselected: function(name, deselected) {
		let item = this.getItem(name);

		if (!item) {
			return;
		}

		if (deselected !== false) {
			item.removeClass('selected');
		} else {
			item.addClass('selected');
		}
	},

	setOptionSelected(className, value) {
		let option = className.replace(/-/g, '_');

		// update menu
		//
		this.setItemSelected(className, value);

		// update parent
		//
		this.parent.app.setOption(option, value);
	},

	//
	// batch setting methods
	//

	setItemsVisible: function(names, visible) {
		for (let i = 0; i < names.length; i++) {
			this.setItemVisible(names[i], visible);
		}
	},

	setItemsHidden: function(names, hidden) {
		for (let i = 0; i < names.length; i++) {
			this.setItemHidden(names[i], hidden);
		}
	},

	setItemsEnabled: function(names, enabled) {
		for (let i = 0; i < names.length; i++) {
			this.setItemEnabled(names[i], enabled);
		}
	},

	setItemsDisabled: function(names, disabled) {
		for (let i = 0; i < names.length; i++) {
			this.setItemDisabled(names[i], disabled);
		}
	},

	setItemsSelected: function(names, selected) {
		for (let i = 0; i < names.length; i++) {
			this.setItemSelected(names[i], selected);
		}
	},

	setItemsDeselected: function(names, deselected) {
		for (let i = 0; i < names.length; i++) {
			this.setItemDeselected(names[i], deselected);
		}
	},

	//
	// group setting methods
	//

	setVisible: function(visible) {
		switch (typeof visible) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemVisible(className, visible);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in visible) {
					this.setItemVisible(name, visible[name]);
				}
				break;
			}
		}
	},

	setHidden: function(hidden) {
		switch (typeof hidden) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemHidden(className, hidden);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in hidden) {
					this.setItemHidden(name, hidden[name]);
				}
				break;
			}
		}
	},

	setEnabled: function (enabled) {
		switch (typeof enabled) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemEnabled(className, enabled);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in enabled) {
					this.setItemEnabled(name, enabled[name]);
				}
				break;
			}
		}
	},

	setDisabled: function(disabled) {
		switch (typeof disabled) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemDisabled(className, disabled);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in disabled) {
					this.setItemDisabled(name, disabled[name]);
				}
				break;
			}
		}
	},

	setSelected: function(selected) {
		switch (typeof selected) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemSelected(className, selected);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in selected) {
					this.setItemSelected(name, selected[name]);
				}
				break;
			}
		}
	},

	setDeselected: function(deselected) {
		switch (typeof deselected) {

			case 'boolean': {

				// set items to value
				//
				let items = this.$el.find('li a');
				for (let i = 0; i < items.length; i++) {
					let className = $(items[i]).attr('class').split(' ')[0];
					this.setItemDeselected(className, deselected);
				}
				break;
			}

			case 'object': {

				// set items to values
				//
				for (let name in deselected) {
					this.setItemDeselected(name, deselected[name]);
				}
				break;
			}
		}
	},

	//
	// opening / closing methods
	//

	open: function() {
		this.$el.closest('.dropdown').addClass('open');
	},

	close: function() {
		this.$el.closest('.dropdown').removeClass('open');
	},

	//
	// toggling methods
	//

	toggleAttribute: function(attributes, name, value) {
		if (attributes[name] == value) {
			attributes[name] = false;
		} else {
			attributes[name] = value;
		}
		return attributes[name];
	},

	toggleMenuItem: function(name) {
		let selected = !this.isItemSelected(name);
		this.setItemSelected(name, selected);
		return selected;
	},

	toggleOption: function(className) {
		if (this.isItemSelected(className)) {
			this.setOptionSelected(className, false);
		} else {
			this.setOptionSelected(className, true);
		}
	},

	//
	// shortcut methods
	//

	getAllShortcuts: function(event) {

		// find enabled, non-hidden menu items
		//
		let $menuItems = this.getEnabledItems();

		// return menu item shortcuts
		//
		if (event.metaKey || event.ctrlKey) {
			if (event.shiftKey) {
				return $menuItems.find('.command.shortcut.shift');
			} else {
				return $menuItems.find('.command.shortcut:not(.shift)');
			}
		} else {
			if (event.shiftKey) {
				return $menuItems.find('.shortcut.shift:not(.command)');
			} else {
				return $menuItems.find('.shortcut:not(.shift):not(.command)');
			}
		}
	},

	getShortcuts(event) {
		let all = this.getAllShortcuts(event);
		let shortcuts = [];

		for (let i = 0; i < all.length; i++) {

			// find shortcut keycode
			//
			let shortcut = $(all[i]);
			let keyCode = Keyboard.nameToKeyCode(shortcut.text());

			// check if event keycode matches shortcut keycode
			//
			if (event.keyCode == keyCode) {
				shortcuts.push(shortcut);
			}
		}

		return shortcuts;
	},

	handleShortcut: function(shortcut) {

		// get event handler for menu item
		//
		let className = $(shortcut).closest('a').attr('class');
		let eventName = className.replace('dropdown-toggle', '');
		let eventHandler = this.getEventHandler(eventName.replace(/ /g, '.'));

		// if event handler not found then look for abbreviated version
		//
		if (!eventHandler) {
			let eventNames = eventName? eventName.split(' ') : null;
			let firstEventName = eventNames? eventNames[0] : null;
			eventHandler = this.getEventHandler(firstEventName.replace(/ /g, '.'));
		}

		// call event handler
		//
		if (eventHandler && this[eventHandler]) {
			this[eventHandler].call(this, event);
		}
	},

	//
	// item rendering methods
	//

	getShortcutName(shortcut) {
		if (!shortcut) {
			return;
		}
		shortcut = shortcut.replace('command-', '');
		shortcut = shortcut.replace('shift-', '');
		return shortcut;
	},

	getShortcutClass(shortcut) {
		let className = 'shortcut';
		if (!shortcut) {
			return;
		}
		if (shortcut.contains('command')) {
			className = 'command ' + className;
		}
		if (shortcut.contains('shift')) {
			className = 'shift ' + className;
		}
		return className;
	},

	tagsToString: function(tags) {
		let string = '';
		let keys = Object.keys(tags);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = tags[key];
			if (string) {
				string += ' ';
			}
			string += key + '=' + value;
		}
		return string;
	},

	itemToHtml: function(item) {
		let className = item.group || '';

		// add to item class
		//
		if (item.menu) {
			className += (className? ' ' : '') + 'dropdown dropdown-submenu';
		}
		if (item.hidden) {
			className += (className? ' ' : '') + 'hidden';
		}

		return this.itemTemplate({
			name: item.name,
			icon: item.icon,
			select: item.select,
			itemClass: className,
			linkClass: item.class,
			shortcut: this.getShortcutName(item.shortcut),
			shortcutClass: this.getShortcutClass(item.shortcut),
			menu: item.menu? this.toHtml(item.menu) : undefined,
			tags: item.tags? this.tagsToString(item.tags) : undefined,
			icons: this.constructor.icons
		});
	},

	//
	// rendering methods
	//

	toHtml: function(items) {
		let html = ''
		if (items) {
			for (let i = 0; i < items.length; i++) {
				let item = items[i];

				// add divider or menu item
				//
				if (item == 'divider') {
					html += this.divider;
				} else {
					html += this.itemToHtml(item);
				}
			}
		}
		return html;
	},

	template: function(data) {
		return data.view.toHtml(data.items);
	},

	templateContext: function() {
		return {
			view: this,
			items: this.getItems(),
			icons: this.constructor.icons
		};
	},

	onRender: function() {

		// set menu items disabled until loaded
		//
		this.setEnabled(false);

		// hide / show menu items
		//
		this.updateVisible();
		
		// find shortcuts from DOM
		//
		this.keyCodes = this.getShortcutKeyCodes();

		// remove last menu item, if hidden
		//
		if (this.parent.app && this.parent.app.isDesktop()) {

			// remove last hidden items
			//
			while (this.$el.find('> li.hidden:last-child').length > 0) {
				this.$el.find('> li.hidden:last-child').remove();
			}

			// remove trailing dividers
			//
			while (this.$el.find('> .divider:last-child').length > 0) {
				this.$el.find('> .divider:last-child').remove();
			}
		}
	},

	setMenuOrientation: function(orientation) {
		let menuWidth = this.$el.width();
		let originLeft = this.$el.parent().position().left;
		let originRight = originLeft + this.$el.parent().width();
		let menuLeft = orientation == 'right'? originLeft : originRight - menuWidth;
		let menuRight = menuLeft + menuWidth;
		let containerWidth = this.$el.closest('.menu-bar').parent().width();

		// set orientation of menu
		//
		switch (orientation) {
			case 'left':
				this.$el.addClass('left');
				break;
			case 'right':
				this.$el.removeClass('left');
				break;
		}

		// set menu offset
		//
		if (menuLeft < 0) {
			this.$el.css('margin-left', -menuLeft);
			menuLeft = 0;
			menuRight = menuWidth;
		} else {
			this.$el.css('margin-left', '');
		}

		// set orientation of submenus
		//
		this.setSubmenuOrientation(this.$el, menuLeft, menuRight, containerWidth);
	},

	setSubmenuOrientation: function(element, menuLeft, menuRight, containerWidth) {

		// set orientation of submenus
		//
		let submenus = element.find('> .dropdown-submenu');
		for (let i = 0; i < submenus.length; i++) {
			let submenu = $(submenus[i]);
			let submenuWidth = $(submenu).width();
			let submenuOrientation = menuRight + submenuWidth > containerWidth? 'left' : 'right';

			switch (submenuOrientation) {

				case 'left': {
					let submenuLeft = menuLeft - submenuWidth;
					submenu.addClass('left');
					
					if (submenuLeft < 0) {
						submenu.find('.dropdown-menu').css('margin-left', -submenuLeft);
					} else {
						submenu.find('.dropdown-menu').css('margin-left', '');
					}		
					break;
				}

				case 'right': {
					let submenuRight = menuRight + submenuWidth;
					submenu.removeClass('left');
					
					if (submenuRight > containerWidth) {
						submenu.find('.dropdown-menu').css('margin-left', containerWidth - submenuRight - 1);
					} else {
						submenu.find('.dropdown-menu').css('margin-left', '');
					}
					break;
				}
			}

			// set subsubmenu orientation
			//
			this.setSubmenuOrientation(submenu, menuLeft, menuRight, containerWidth);
		}
	},

	//
	// updating methods
	//

	updateVisible: function() {

		// set visible / hidden
		//
		if (this.visible != undefined) {
			this.setVisible(_.result(this, 'visible'));
		} else if (this.hidden != undefined) {
			this.setHidden(_.result(this, 'hidden'));
		}
	},

	updateEnabled: function() {

		// set enabled / disabled
		//
		if (this.enabled != undefined) {
			this.setEnabled(_.result(this, 'enabled'));
		} else if (this.disabled != undefined) {
			this.setDisabled(_.result(this, 'disabled'));
		}
	},

	updateSelected: function() {

		// set selected / deselected
		//
		if (this.selected != undefined) {
			this.setSelected(_.result(this, 'selected'));
		} else if (this.deselected != undefined) {
			this.setDeselected(_.result(this, 'deselected'));
		}
	},

	update: function() {

		// update visible / hidden menu items
		//
		this.updateVisible();

		// update enabled / disabled menu items
		//
		this.updateEnabled();

		// update selected menu items
		//
		this.updateSelected();
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.loaded = true;
		this.setEnabled(true);
		this.update();
	},

	onOpen: function() {
		this.setMenuOrientation(this.getMenuOrientation());
	},

	onChange: function() {
		if (this.loaded) {
			this.update();
		}
	},

	onChangeTab: function() {
		if (this.loaded) {
			this.update();
		}
	},

	onCloseTab: function() {
		if (this.loaded) {
			this.update();
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		if (this.loaded) {
			this.updateEnabled();
		}
	},

	onDeselect: function() {
		if (this.loaded) {
			this.updateEnabled();
		}
	},

	onChangeSelection: function() {
		if (this.loaded) {
			this.updateEnabled();
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		let showJson = false;

		// display as json
		//
		if (showJson) {
			if (this.isOpen()) {
				if (event.keyCode == Keyboard.keyCodes['escape']) {
					this.showJson();
				}
			}
		}

		// check if this is a valid menu event
		//
		if (!this.isValidEvent(event) || event.target.type) {
			return;
		}

		if (this.keyCodes && this.keyCodes.contains(event.keyCode)) {
			let shortcuts = this.getShortcuts(event);

			// process control key events
			//
			for (let i = 0; i < shortcuts.length; i++) {

				// find shortcut keycode
				//
				let shortcut = $(shortcuts[i]);

				// check if shortcut menu item is not disabled
				//
				if (!shortcut.closest('li').hasClass('disabled')) {

					// check if shortcut menu item is not hidden
					//
					if (!shortcut.closest('li').hasClass('hidden')) {
						this.handleShortcut(shortcut);

						// block event from parent
						//
						if (!Keyboard.arrowKeys.contains(event.keyCode) || !event.metaKey) {
							this.block(event);
						}

						// finish
						//
						return true;
					}
				}
			}
		}

		return false;
	},

	//
	// json display methods
	//

	showCode: function(file) {
		application.launch('code_editor', {
			model: file
		});
	},

	showJson: function() {
		import(
			'../../../../../../models/storage/files/file.js'
		).then((File) => {
			this.showCode(new File.default({
				contents: this.constructor.toJson(this.el)
			}));
		});
	}
}, {

	//
	// static attributes
	//

	inputs: ['input', 'textarea'],

	//
	// json converting methods
	//

	getShortcutText: function(shortcut) {
		let text = $(shortcut).text();
		let command = shortcut.hasClass('command');
		let shift = shortcut.hasClass('shift');

		// compose shortcut text
		//
		if (command) {
			text = 'command-' + text;
		}
		if (shift) {
			text = 'shift-' + text;
		}

		return text;
	},

	dropdownToObject: function(item) {
		let link = $(item).find('> a');
		let icons = $(link).find('i');
		let itemClass = $(item).attr('class');
		let linkClass = $(link).attr('class');
		let shortcut = $(link).find('.shortcut');
		let selectable = $(link).find('.fa.fa-check').length > 0;
		let dropdown = $(item).find('> .dropdown-menu');

		// get name text
		//
		let clone = link.clone();
		clone.children('.shortcut, i').each(function (child) {
			this.remove(child);
		});
		let name = clone.text().trim();

		// find icon
		//
		let icon;
		if (icons.length > 0) {
			if (icons[0].className.contains('fa-check') && icons.length > 1) {
				icon = icons[1].className;
			} else {
				icon = icons[0].className;
			}
		}

		// format item class
		//
		let mode = undefined;
		let platform = undefined;

		if (itemClass) {
			if (itemClass.contains('selected')) {
				itemClass = itemClass.replace('selected', '').trim();
			}
			if (itemClass.contains('disabled')) {
				itemClass = itemClass.replace('disabled', '').trim();
			}
			if (itemClass.contains('hidden')) {
				itemClass = itemClass.replace('hidden', '').trim();
			}

			// remove dropdown classes
			//
			if (itemClass.contains('dropdown')) {
				itemClass = itemClass.replace('dropdown', '').trim();
			}
			if (itemClass.contains('dropdown-submenu')) {
				itemClass = itemClass.replace('dropdown-submenu', '').trim();
			}

			// parse mode
			//
			if (itemClass.contains('windowed-app-only')) {
				mode = 'windowed';
				itemClass = itemClass.replace('windowed-app-only', '').trim();
			}
			if (itemClass.contains('desktop-app-only')) {
				mode = 'desktop';
				itemClass = itemClass.replace('desktop-app-only', '').trim();
			}

			// parse platform
			//
			if (itemClass.contains('mobile-only')) {
				platform = 'mobile';
				itemClass = itemClass.replace('mobile-only', '').trim();
			}
			if (itemClass.contains('desktop-only')) {
				platform = 'desktop';
				itemClass = itemClass.replace('desktop-only', '').trim();
			}
		}

		// format link class
		//
		if (linkClass) {
			linkClass = linkClass.replace('dropdown-toggle', '').trim();
		}

		// create object
		//
		let object;
		if (name) {
			object = {};

			// set object attributes
			//
			if (linkClass) {
				object.class = linkClass;
			}
			if (itemClass) {
				object.group = itemClass;
			}
			if (icon) {
				object.icon = icon;
			}
			if (name) {
				object.name = name;
			}
			if (shortcut.length > 0) {
				object.shortcut = this.getShortcutText(shortcut);
			}
			if (selectable) {
				object.select = true;
			}
			if (mode) {
				object.mode = mode;
			}
			if (platform) {
				object.platform = platform;
			}
			if (dropdown.length > 0) {
				object.menu = this.getDropdownObjects(dropdown);
			}
		} else {
			object = "divider";
		}

		return object;
	},

	getDropdownObjects: function(element) {
		let elements = $(element).find('> li');
		let items = [];
		for (let i = 0; i < elements.length; i++) {
			let item = elements[i];
			items.push(this.dropdownToObject(item));
		}
		return items;
	},

	toObjects: function(element) {
		return this.getDropdownObjects(element);
	},

	toJson: function(element) {
		return JSON.stringify(this.toObjects(element), null, 4);
	}
});