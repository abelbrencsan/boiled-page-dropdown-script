# Boiled Page dropdown script

A simple, lightweight and customizable dropdown JavaScript module for Boiled Page frontend framework that can be used for subnavigations, offset navigations, popovers, etc...

## Install

Place `dropdown.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts. You can also find two related SCSS packages, a button dropdown component and a navbar singleton that work well with this JavaScript module.

- Button dropdown component: <https://www.github.com/abelbrencsan/boiled-page-button-component>
- Navbar singleton: <https://www.github.com/abelbrencsan/boiled-page-navbar-singleton>

## Usage

To create a new dropdown instance, call `Dropdown` constructor the following way:

```js
// Create new dropdown instance
var dropdown = new Dropdown(options);

// Initialize dropdown instance
dropdown.init();
```

## Options

Available options for dropdown constructor:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`element` | Object | null | Yes | Element is opened and closed on dropdown's trigger click.
`trigger` | Object | null | Yes | Trigger opens and closes dropdown's element on click.
`closeButton` | Object | null | No | Close dropdown on close button click.
`isIndependent` | Boolean | false | No | Prevent closing dropdown when an inner dropdown is used.
`setHeight` | Boolean | true | No | Set maximum height of dropdown's element if it is opened.
`initCallback` | Function | null | No | Callback function after dropdown is initialized.
`openCallback` | Function | null | No | Callback function after dropdown is opened.
`closeCallback` | Function | null | No | Callback function after dropdown is closed.
`recalcHeightCallback` | Function | null | No | Callback function after maximum height of dropdown's element is recalculated.
`destroyCallback` | Function | null | No | Callback function after dropdown is destroyed.
`isOpenedClass` | String | 'is-opened' | No | Class added to element when dropdown is opened.
`isActiveClass` | String | 'is-active' | No | Class added to element when dropdown is closed.
`hasOpenedDropdownClass` | String | 'has-opened-dropdown' | No | Class added to the parent node of element when dropdown is closed.

## Methods

### Initialize dropdown

`init()` - Initialize dropdown.

### Open dropdown by given instance

`open(instance)` - Open dropdown by given instance, set maximum height of its element.

Parameter | Type | Required | Description
----------|------|----------|------------
`instance` | Object | No | Dropdown instance to be opened. When no parameter is given, the current instance will be passed.

### Close dropdown by given instance

`close(instance)` - Close dropdown by given instance, reset maximum height of its element.

Parameter | Type | Required | Description
----------|------|----------|------------
`instance` | Object | No | Dropdown instance to be closed. When no parameter is given, the current instance will be passed.

### Recalculate maximum height of dropdown element by given instance

`recalcHeight(instance)` - Recalculate maximum height of opened dropdown's element. Call this function when inner height has been possibly changed (window resize, breakpoint change, etc...).

Parameter | Type | Required | Description
----------|------|----------|------------
`instance` | Object | No | Dropdown instance to be recalculated. When no parameter is given, the current instance will be passed.

### Destroy dropdown

`destroy()` - Destroy dropdown. It removes all related classes, attributes and events.

