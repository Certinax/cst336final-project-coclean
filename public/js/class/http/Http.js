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