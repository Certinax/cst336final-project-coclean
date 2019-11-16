/**
 * Http
 * @author
 * @example
 * Http.request.get('http://api.web.com/user', function(result) {
 *   console.log(result);
 * });
 */
export class Http {
	static request = {
		/**
		 * HTTP GET
		 * @param {string} url
		 * @param {function} callback
		 */
		get: function (url, callback) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
					callback(xhr.responseText);
			};
			xhr.open('GET', url, true);
			xhr.send();
		},


		/**
		 * HTTP POST
		 * @param {string} url
		 * @param {object} body
		 * @param {function} callback
		 */
		post: function (url, body, callback) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
					callback(xhr.responseText);
			};
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(body));
		},


		/**
		 * HTTP PUT
		 * @param {string} url
		 * @param {object} body
		 * @param {function} callback
		 */
		put: function (url, body, callback) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
					callback(xhr.responseText);
			};
			xhr.open('PUT', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(body));
		},


		/**
		 * HTTP DELETE
		 * @param {string} url
		 * @param {object} body
		 * @param {function} callback
		 */
		delete: function (url, body, callback) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
					callback(xhr.responseText);
			};
			xhr.open('DELETE', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(body));
		}
	};
}