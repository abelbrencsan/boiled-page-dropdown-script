/**
 * Dropdown
 * Copyright 2024 Abel Brencsan
 * Released under the MIT License
 */
const Dropdown = function(options) {

	'use strict';

	// Test required options
	if (!(options.element instanceof HTMLElement)) {
		throw 'Dropdown "element" must be an `HTMLElement`';
	}
	if (!(options.trigger instanceof HTMLElement)) {
		throw 'Dropdown "trigger" must be an `HTMLElement`';
	}

	// Default dropdown instance options
	let defaults = {
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
	for (let key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Dropdown instance variables
	this.isOpened = false;
	this.isInitialized = false;
};

Dropdown.prototype = function () {

	'use strict';

	let dropdown = {

		items: [],

		/**
		 * Initialize dropdown.
		 * 
		 * @public
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
				document.body.addEventListener('focusin', dropdown.onBodyFocus);
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
		 * Open given dropdown instance and optionally set maximum height of it.
		 * 
		 * @public
		 * @param {Dropdown} item
		 */
		open: function(item) {
			if (!item) item = this;
			item.trigger.setAttribute('aria-expanded','true');
			item.element.setAttribute('aria-hidden','false');
			item.trigger.classList.add(item.isActiveClass);
			item.element.classList.add(item.isOpenedClass);
			item.element.parentNode.classList.add(item.hasOpenedDropdownClass);
			if (item.setHeight) {
				item.element.style.maxHeight = dropdown.calcHeight.call(this, item.element);
			}
			item.isOpened = true;
			if (item.openCallback) item.openCallback.call(item);
		},

		/**
		 * Close given dropdown instance and reset maximum height of it.
		 * 
		 * @public
		 * @param {Dropdown} item
		 */
		close: function(item) {
			if (!item) item = this;
			item.trigger.setAttribute('aria-expanded','false');
			item.element.setAttribute('aria-hidden','true');
			item.trigger.classList.remove(item.isActiveClass);
			item.element.classList.remove(item.isOpenedClass);
			item.element.parentNode.classList.remove(item.hasOpenedDropdownClass);
			if (item.setHeight) item.element.style.maxHeight = '';
			item.isOpened = false;
			if (item.element.contains(document.activeElement)) item.trigger.focus();
			if (item.closeCallback) item.closeCallback.call(item);
		},

		/**
		 * Close all dropdowns except independent ones.
		 * 
		 * @private
		 */
		closeAll: function() {
			for (let i = 0; i < dropdown.items.length; i++) {
				if (dropdown.items[i].isOpened && !dropdown.items[i].isIndependent) {
					dropdown.items[i].close.call(this, dropdown.items[i]);
				}
			}
		},

		/**
		 * Recalculate maximum height of given dropdowns' height.
		 * Call this function when inner height has been changed.
		 * 
		 * @public
		 * @param {Dropdown} item
		 */
		recalcHeight: function(item) {
			if (!item) item = this;
			if (item.setHeight && item.isOpened) {
				item.element.style.maxHeight = dropdown.calcHeight.call(this, item.element);
			}
			if (item.recalcHeightCallback) item.recalcHeightCallback.call(item);
		},

		/**
		 * Calculate maximum height of opened dropdown's element.
		 * 
		 * @private
		 * @param {Element} elem
		 */
		calcHeight: function(elem) {
			return elem.scrollHeight + 'px';
		},

		/**
		 * Close all dropdowns on document body click.
		 * 
		 * @private
		 * @param {Event} event
		 */
		onBodyClick: function(event) {
			dropdown.closeAll();
		},

		/**
		 * Close dropdown when focus is out of it.
		 * 
		 * @private
		 * @param {Event} event
		 */
		onBodyFocus: function(event) {
			for (let i = 0; i < dropdown.items.length; i++) {
				if (dropdown.items[i].isOpened && !dropdown.items[i].isIndependent && (dropdown.items[i].element.contains(event.target) || dropdown.items[i].trigger.contains(event.target))) {
					return;
				}
			}
			dropdown.closeAll();
		},

		/**
		 * Close all dropdowns on ESC keydown.
		 * 
		 * @param {Event} event
		 * @private
		 */
		onEscKeydown: function(event) {
			if (event.key == 'Escape') dropdown.closeAll();
		},

		/**
		 * Handle events.
		 * On trigger click: close or open dropdown and close all other dropdowns.
		 * On close trigger click: close dropdown.
		 * 
		 * @public
		 * @param {Event} event
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
						dropdown.closeAll();
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
		 * Destroy dropdown.
		 * It removes all related classes, attributes and events.
		 * 
		 * @public
		 */
		destroy: function() {
			if (!this.isInitialized) return;
			if (this.isOpened) dropdown.close.call(this);
			if (this.closeButton) this.closeButton.removeEventListener('click', this);
			let index = dropdown.items.indexOf(this);
			this.trigger.removeEventListener('click', this);
			this.trigger.removeEventListener('touchend', this);
			this.element.removeEventListener('click', this);
			this.element.removeEventListener('touchend', this);
			this.trigger.removeAttribute('aria-expanded');
			this.trigger.removeAttribute('aria-haspopup');
			this.element.removeAttribute('aria-hidden');
			this.isInitialized = false;
			if(index != -1) dropdown.items.splice(index, 1);
			if (!dropdown.items.length) {
				document.body.removeEventListener('keydown', dropdown.onEscKeydown);
				document.body.removeEventListener('click', dropdown.onBodyClick);
				document.body.removeEventListener('touchend', dropdown.onBodyClick);
				document.body.removeEventListener('focusin', dropdown.onBodyFocus);
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