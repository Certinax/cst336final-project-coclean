import {cout, Http,	get, getAll, flushChildren, isJSON, make, attr} from '../../functions/functions.js';

let API_BASE_URL = `${window.location.origin}/api`;
const TABLE_BODY_SELECTOR = '#chore-table-body';

function makeTableRow(name, desc, frequency, choreId) {
	const tr = `
		<tr>
				<td class="text-left align-middle" colspan="2" data-toggle="collapse" data-target=".item1">${name}</td>
				<td class="align-middle" data-toggle="collapse" data-target=".item${choreId}">1/7</td>
				<td><button data-id="${choreId}" data-type="chore-button" class="btn btn-finish btn-sm m-0"><span class="lightFont">Done</span></button></td>
		</tr>
		<tr>
			<td class="hiddenRow" colspan="4">
				<div class="collapse item${choreId} text-left">${((desc && desc.length > 0) ? desc : 'No description')}</div>
			</td>
		</tr>
	`;
}

function addEventListeners(type, eventListener, callback) {
	const buttons = getAll(`[data-type="${type}"]`);
	buttons.forEach(btn => {
		btn.onclick = eventListener;
	});
	callback();
}

function emptyTable(callback) {
	flushChildren(get('#chore-table-body'), function() {
		callback();
	});
}

function onClick(e) {
	const self = e.target;
	const choreId = parseInt(self.getAttribute('data-id'));
	incrementChore(choreId, function() {
		drawTable(choreId)
	});
}

function incrementChore(choreId, callback) {
	const URL = `${API_BASE_URL}/chore/${choreId}/increment`;
	Http.request(Http.method.get, URL, null, function(raw) {
		cout(raw);
		callback();
	});
}

function getChores(userId, callback) {
	const URL = `${API_BASE_URL}/user/${userId}/collective/chore`;
	cout(URL, 'danger');
	Http.request(Http.method.get, URL, null, function(raw) {
		if (isJSON(raw)) {
			const JSONObject = JSON.parse(raw);
			const chores = JSONObject['result'];
			console.log(raw);
			callback(chores);
		} else callback();
	});
}

function drawTable(id, callback) {
	getChores(id, function(chores) {
		emptyTable(function() {
			console.table(chores);
			const tableBody = get(TABLE_BODY_SELECTOR);
			chores.forEach(c => {
				const id = c['ID'];
				const title = c['title'];
				const desc = c['description'];
				const freq = c['frequency'];
				tableBody.innerHTML += makeTableRow(title, desc, freq, id);
			});
			callback();
		});
	});
}

window.onload = function() {
	console.log(window.location.origin);
	const userId = parseInt(get(TABLE_BODY_SELECTOR).getAttribute('data-id'));
	drawTable(userId, function () {
		addEventListeners('chore-button', onClick, function () {
			cout('onClick Event listener added.');
		});
	})
};