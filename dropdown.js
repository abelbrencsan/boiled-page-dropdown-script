/**
 * Dropdown - v1.1.0
 * Copyright 2021 Abel Brencsan
 * Released under the MIT License
 */

var Dropdown = function(options) {

	'use strict';

	// Test required options
	if (typeof options.element !== 'object') throw 'Dropdown "element" option must be an object';
	if (typeof options.trigger !== 'object') throw 'Dropdown "trigger" option must be an object';

	// Default dropdown instance options
	var defaults = {
		element: null,
		trigger: null,
		closeButton: null,
		isIndependent: false,
		setHeight: true,
		initCallback: null,
		openCallback: null,
		closeCallback: null,
		recalcHeightCallback: null,
		destroyCallback: null,
		isOpenedClass: 'is-opened',
		isActiveClass: 'is-active',
		hasOpenedDropdownClass: 'has-opened-dropdown'
	};

	// Extend dropdown instance options with defaults
	for (var key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Dropdown instance variables
	this.isOpened = false;
	this.isInitialized = false;

};

Dropdown.prototype = function () {

	'use strict';

	var dropdown = {

		items: [],

		/**
		 * Initialize dropdown. (public)
		 */
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				dropdown.handleEvents.call(this, event);
			};
			if (!dropdown.items.length) {
				document.body.addEventListener('keydown', dropdown.onEscKeydown);
				document.body.addEventListener('click', dropdown.onBodyClick);
				document.body.addEventListener('touchend', dropdown.onBodyClick);
			}
			if (this.closeButton) this.closeButton.addEventListener('click', this);
			this.trigger.addEventListener('click', this);
			this.trigger.addEventListener('touchend', this);
			this.element.addEventListener('click', this);
			this.element.addEventListener('touchend', this);
			this.trigger.setAttribute('aria-expanded','false');
			this.trigger.setAttribute('aria-haspopup','true');
			this.element.setAttribute('aria-hidden','true');
			this.isInitialized = true;
			dropdown.items.push(this);
			if (this.initCallback) this.initCallback.call(this);
		},

		/**
		 * Open dropdown by given instance, set maximum height of its element. (public)
		 * @param item object
		 */
		open: function(item) {
			if (!item) item = this;
			item.trigger.classList.add(item.isActiveClass);
			item.trigger.setAttribute('aria-expanded','true');
			item.element.classList.add(item.isOpenedClass);
			item.element.parentNode.classList.add(item.hasOpenedDropdownClass);
			item.element.setAttribute('aria-hidden','false');
			if (item.setHeight) item.element.style.maxHeight = dropdown.calcHeight.call(this, item.element);
			item.isOpened = true;
			if (item.openCallback) item.openCallback.call(item);
		},

		/**
		 * Close dropdown by given instance, reset maximum height of its element. (public)
		 * @param item object
		 */
		close: function(item) {
			if (!item) item = this;
			item.trigger.classList.remove(item.isActiveClass);
			item.trigger.setAttribute('aria-expanded','false');
			item.element.classList.remove(item.isOpenedClass);
			item.element.parentNode.classList.remove(item.hasOpenedDropdownClass);
			item.element.setAttribute('aria-hidden','true');
			if (item.setHeight) item.element.style.maxHeight = '0px';
			item.isOpened = false;
			if (item.element.contains(document.activeElement)) item.trigger.focus();
			if (item.closeCallback) item.closeCallback.call(item);
		},

		/**
		 * Close all dropdowns except independent ones when "closeIndependents" parameter is true. (private)
		 * @param closeIndependents bool
		 */
		closeAll: function(closeIndependents) {
			var dropdownItemsLength = dropdown.items.length;
			for (var i = 0; i < dropdownItemsLength; i++) {
				if (closeIndependents) {
					if (dropdown.items[i].isOpened) {
						dropdown.items[i].close.call(this, dropdown.items[i]);
					}
				}
				else {
					if (dropdown.items[i].isOpened && !dropdown.items[i].isIndependent) {
						dropdown.items[i].close.call(this, dropdown.items[i]);
					}
				}
			}
		},

		/**
		 * Recalculate maximum height of opened dropdown's element. Call this function when inner height has been possibly changed (window resize, breakpoint change, etc...). (public)
		 * @param item object
		 */
		recalcHeight: function(item) {
			if (!item) item = this;
			if (item.setHeight && item.isOpened) item.element.style.maxHeight = dropdown.calcHeight.call(this, item.element);
			if (item.recalcHeightCallback) item.recalcHeightCallback.call(item);
		},

		/**
		 * Calculate maximum height of opened dropdown's element. (private)
		 * @param item object
		 */
		calcHeight: function(item) {
			return item.scrollHeight + 'px';
		},

		/**
		 * Close all dropdowns on document body click. (private)
		 */
		onBodyClick: function(event) {
			dropdown.closeAll(true);
		},

		/**
		 * Close all dropdowns on ESC keydown. (private)
		 * @param event object
		 */
		onEscKeydown: function(event) {
			if (event.keyCode == 27) dropdown.closeAll(true);
		},

		/**
		 * Handle events. (private)
		 * On trigger click: close dropdown if it is opened, or open it and close all other dropdowns.
		 * On close trigger click: Close dropdown.
		 * @param event object
		 */
		handleEvents: function(event) {
			if (event.type == 'click') {
				if (this.trigger.contains(event.target)) {
					event.preventDefault();
					event.stopPropagation();
					if (this.isOpened) {
						dropdown.close.call(this);
					}
					else {
						dropdown.closeAll(false);
						dropdown.open.call(this);
					}
				}
				else if (this.closeButton && this.closeButton.contains(event.target)) {
					event.preventDefault();
					dropdown.close.call(this);
				}
				else if (this.element.contains(event.target)) {
					event.stopPropagation();
				}
			}
			else if (event.type == 'touchend') {
				if (this.element.contains(event.target) || this.trigger.contains(event.target)) {
					event.stopPropagation();
				}
			}
		},

		/**
		 * Destroy dropdown. It removes all related classes, attributes and events. (public)
		 */
		destroy: function() {
			if (!this.isInitialized) return;
			if (this.isOpened) dropdown.close.call(this);
			if (this.closeButton) this.closeButton.removeEventListener('click', this);
			this.trigger.removeEventListener('click', this);
			this.trigger.removeEventListener('touchend', this);
			this.element.removeEventListener('click', this);
			this.element.removeEventListener('touchend', this);
			this.trigger.removeAttribute('aria-expanded');
			this.trigger.removeAttribute('aria-haspopup');
			this.element.removeAttribute('aria-hidden');
			this.isInitialized = false;
			var index = dropdown.items.indexOf(this);
			if(index != -1) dropdown.items.splice(index, 1);
			if (!dropdown.items.length) {
				document.body.removeEventListener('keydown', dropdown.onEscKeydown);
				document.body.removeEventListener('click', dropdown.onBodyClick);
				document.body.removeEventListener('touchend', dropdown.onBodyClick);
			}
			if (this.destroyCallback) this.destroyCallback.call(this);
		}
	};

	return {
		init: dropdown.init,
		open: dropdown.open,
		close: dropdown.close,
		recalcHeight: dropdown.recalcHeight,
		destroy: dropdown.destroy
	};

}();