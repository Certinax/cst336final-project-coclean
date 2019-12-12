/**
 * Console Out.
 * @description This function simplifies the console log
 * function.
 * @param {string} msg - The message.
 * @param {string} colorName - The color.
 * */
export function cout(msg, colorName = '') {

	// * Init. color combination object.
	const combo = colorCombo(colorName);

	console.log(
		'%c' + msg,
		'color: ' + combo.color + ';' +
		'background: ' + combo.background + ';' +
		'padding: 4px 6px;' +
		'border-radius: 5px;' +
		'border: 3px solid ' + combo.border + ';'
	);
}


/**
 * Bootstrap Colors
 * @type {{border: {LIGHT: string, DARK: string}, DANGER: string, WHITE: string, SUCCESS: string, HWITE50: string, BLACK50: string, LIGHT: string, SECONDARY: string, DARK: string, PRIMARY: string, HVITE50: string, INFO: string, WARNING: string, NUTED: string}}
 */
const BOOTSTRAP_COLORS = {
	PRIMARY:      '#007bff',
	SECONDARY:    '#6c757d',
	SUCCESS:      '#28a745',
	DANGER:       '#dc3545',
	WARNING:      '#ffc107',
	INFO:         '#17a2b8',
	NUTED:        '#6c757d',
	LIGHT:        '#f8f9fa',
	DARK:         '#343a40',
	WHITE:        '#ffffff',
	HWITE50:      'rgba(255,255,255,.5)',
	HVITE50:      'rgba(0,0,0,.5)',
	BLACK50:			'rgba(0,0,0,0)',
	border: {
		LIGHT: 'rgba(255,255,255,0.2)',
		DARK: 'rgba(0,0,0,0.2)'
	},
};




/**
 * Color Combo
 * @param {string} color The main color.
 * @returns {{border: string, color: string, background: string}}
 */
function colorCombo(color) {

	// * Init. object of standard Bootstrap colors.
	const colors = {
		primary:      '#007bff',
		secondary:    '#6c757d',
		success:      '#28a745',
		danger:       '#dc3545',
		warning:      '#ffc107',
		info:         '#17a2b8',
		muted:        '#6c757d',
		light:        '#f8f9fa',
		dark:         '#343a40',
		white:        '#ffffff',
		white50:      'rgba(255,255,255,.5)',
		black50:      'rgba(0,0,0,.5)',
		none:         'rgba(0,0,0,0)',
		border: {
			light: 'rgba(255,255,255,0.2)',
			dark: 'rgba(0,0,0,0.2)'
		}
	};

	// * Init. color combination object.
	const combo = {color: '', background: '', border: ''};

	switch (color) {
		case Object.keys(colors)[0]:
			combo.color = colors.white;
			combo.background = colors.primary;
			combo.border = colors.border.light;
			break;
		case Object.keys(colors)[1]:
			combo.color = colors.white;
			combo.background = colors.secondary;
			combo.border = colors.border.dark;
			break;
		case Object.keys(colors)[2]:
			combo.color = colors.white;
			combo.background = colors.success;
			combo.border = colors.border.light;
			break;
		case Object.keys(colors)[3]:
			combo.color = colors.light;
			combo.background = colors.danger;
			combo.border = colors.border.light;
			break;
		case Object.keys(colors)[4]:
			combo.color = colors.dark;
			combo.background = colors.warning;
			combo.border = colors.border.dark;
			break;
		case Object.keys(colors)[5]:
			combo.color = colors.light;
			combo.background = colors.info;
			combo.border = colors.border.light;
			break;
		case Object.keys(colors)[6]:
			combo.color = colors.white50;
			combo.background = colors.muted;
			combo.border = colors.border.light;
			break;
		case Object.keys(colors)[7]:
			combo.color = colors.dark;
			combo.background = colors.light;
			combo.border = colors.border.dark;
			break;
		case Object.keys(colors)[8]:
			combo.color = colors.light;
			combo.background = colors.dark;
			combo.border = colors.border.light;
			break;
		case Object.keys(colors)[9]:
			combo.color = colors.dark;
			combo.background = colors.white;
			combo.border = colors.border.dark;
			break;
		default:
			combo.color = colors.light;
			combo.background = colors.dark;
			combo.border = colors.border.light;
			break;
	}
	return combo;
}


/**
 * Debug
 * @param {string} context The context of the message.
 * @param {string} message The message.
 * @param {string} color The color of the message.
 */
export function debug(context, message, color=''){

	// * Init. color combo object.
	const combo = colorCombo(color);

	console.log(
		'%c' + context + ': ' +
		'%c' + message,
		'font-weight: 700',
		'color: ' + combo.color + ';' +
		'background: ' + combo.background + ';' +
		'padding: 4px 6px;' +
		'border-radius: 5px;' +
		'border: 3px solid ' + combo.border + ';'
	);
}


/**
 * AJAX Fetch
 *
 * @author Isak Hauge
 *
 * @param {string} searchValue - The search value.
 * @param {string} url - The path and filename of the PHP AJAX handler.
 * @param {function} callback - A callback function.
 * */
export function ajaxFetch(searchValue, url, callback){

	// Instantiate AJAX object.
	const AJAX = new XMLHttpRequest();

	// Init. on-ready event handler.
	AJAX.onreadystatechange = function () {

		// ? If data was successfully received.
		if (this.readyState === 4 && this.status === 200) {

			// Send debug message to console.
			console.log('AJAX request initiated.');

			// Callback.
			callback(this.responseText);

		}

	};

	// Open connection to PHP file.
	AJAX.open('GET', url + searchValue, true);

	// Send data through GET API.
	AJAX.send();

}




/**
 * AJAX Send JSON
 * */
export function ajaxJSON(jsonObject, url, callback){

	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200){
			callback(this.responseText);
		}
	};

	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(jsonObject));

}




/**
 * Is JSON.
 *
 * @description This function will return a boolean value based on whether the given string
 * data is JSON format compliant.
 *
 * @param {string} data - The data string to be analyzed.
 * @returns {boolean}
 * */
export function isJSON(data) {

	try {

		const testObject = JSON.parse(data);
		return Object.values(testObject).length > 0;

	} catch (e) {

		return false;

	}

}




/**
 * Get
 * @param selector
 * @returns {HTMLElement}
 */
export function get(selector) {
	return document.querySelector(selector);
}




/**
 * Get All
 * @param selector
 * @returns {NodeListOf<HTMLElementTagNameMap[*]>}
 */
export function getAll(selector) {
	return document.querySelectorAll(selector);
}


/**
 * Make
 * @param {string} tagName The tag name of the element.
 * @param innerHTML
 * @returns {HTMLElement}
 */
export function make(tagName, innerHTML=null) {
	const elem = document.createElement(tagName);
	if (innerHTML)
		elem.innerHTML = innerHTML;
	return elem;
}




/**
 * Flush Children.
 * @param node The node who's children shall be flushed.
 * @param {function} callback
 */
export function flushChildren(node, callback) {
	while (node.hasChildNodes())
		node.firstChild.remove();
	callback();
}




/**
 * Http
 * @author Isak Hauge
 * @type {{request: Http.request}}
 */
export const Http = {

	/**
	 * Method
	 * @typedef {string} HttpMethod
	 */
	method: {
		get: 'GET',
		post: 'POST',
		put: 'PUT',
		delete: 'DELETE'
	},


	/**
	 * Request
	 * @param {HttpMethod} method
	 * @param {string} url
	 * @param {object|null} requestBody
	 * @param {function} callback
	 */
	request: function (method, url, requestBody, callback) {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
				console.log("HTTP " + method.toUpperCase() + " response was received.");
			callback(xhr.responseText);
		};
		console.log("HTTP " + method.toUpperCase() + " request was sent.");
		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		// ? If HTTP request method is GET or there is no valid request body object.
		if (method === Http.method.get || !requestBody)
			xhr.send(); // Send request without body.
		else
			xhr.send(JSON.stringify(requestBody)); // Send request with body.
	},
};




export function attr(node, key, value) {
	node.setAttribute(key, value);
}