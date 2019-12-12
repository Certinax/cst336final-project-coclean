import {cout, Http,	get, getAll, flushChildren, isJSON, make, attr} from '../../functions/functions.js';

let API_BASE_URL = `${window.location.origin}/api`;
const TABLE_BODY_SELECTOR = '#chore-table-body';

function getUserId() {
	return parseInt(get(TABLE_BODY_SELECTOR).getAttribute('data-id'));
}

function getCollectiveId() {
	return parseInt(get(TABLE_BODY_SELECTOR).getAttribute('data-collective-id'));
}

function makeTableRow(name, desc, timesCompleted, frequency, choreId) {
	return `
		<tr data-id="${choreId}">
				<td class="text-left align-middle chore-name" colspan="2" data-toggle="collapse" data-target=".item${choreId}">${name}</td>
				<td class="align-middle chore-frequency" data-toggle="collapse" data-target=".item${choreId}">
					<span class="chore-completed-num">${timesCompleted}</span>/<span class="chore-frequency-num">${frequency}</span>
				</td>
				<td><button data-id="${choreId}" data-type="chore-button" class="btn btn-finish btn-sm m-0 lightFont">Done</button></td>
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
	for (let i=0; i<buttons.length; i++) {
		buttons[i].onclick = eventListener;
	}
	callback();
}

function removeEventLinsteners(type, eventListener, callback) {
	const buttons = getAll(`[data-type="${type}"]`);
	for (let i=0; i<buttons.length; i++) {
		buttons[i].removeEventListener('click', eventListener);
	}
	callback();
}

function emptyTable(callback) {
	const tbody = get(TABLE_BODY_SELECTOR);
	removeEventLinsteners('chore-button', onClick, function () {
		flushChildren(tbody, function () {
			callback();
		})
	})
}

function onClick(e) {
	const self = e.target;
	const choreId = parseInt(self.getAttribute('data-id'));
	incrementChore(choreId, function (chore) {
		console.log(chore['result'][0]['times_completed']);
		console.log(chore['result'][0]['frequency']);
		get(`tr[data-id="${choreId}"] span.chore-completed-num`).innerText = chore['result'][0]['times_completed'];
		get(`tr[data-id="${choreId}"] span.chore-frequency-num`).innerText = chore['result'][0]['frequency'];
	})
}

function incrementChore(choreId, callback) {
	const URL = `${API_BASE_URL}/chore/${choreId}/increment`;
	const URL2 = `${API_BASE_URL}/chore/${choreId}`;
	Http.request(Http.method.get, URL, null, function(raw) {
		Http.request(Http.method.get, URL2, null, function (raw2) {
			if (isJSON(raw2)) {
				const JSONObject = JSON.parse(raw2);
				callback(JSONObject);
			} else callback([]);
		});
	});
}

function getChores(userId, callback) {
	const URL = `${API_BASE_URL}/user/${userId}/collective/chore`;
	Http.request(Http.method.get, URL, null, function(raw) {
		if (isJSON(raw)) {
			const JSONObject = JSON.parse(raw);
			const chores = JSONObject['result'];
			callback(chores);
		} else callback([]);
	});
}

function drawTable(userId, callback) {
	getChores(userId, function(chores) {
		const tableBody = get(TABLE_BODY_SELECTOR);
		emptyTable(function () {
			cout(chores.length, 'success');
			for (let i=0; i<chores.length; i++) {
				const id = chores[i]['ID'];
				const title = chores[i]['title'];
				const desc = chores[i]['description'];
				const completed = chores[i]['times_completed'];
				const freq = chores[i]['frequency'];
				tableBody.innerHTML += makeTableRow(title, desc, completed, freq, id);
			}
			callback();
		});
	});
}

function leaveCollective() {
	const userId = getUserId();
	const collectiveId = getCollectiveId();
	Http.request(Http.method.post, `/api/user/${userId}/leave`, {collectiveId}, (result) => {
		console.log(result);
	});
}

function addOnClickLeaveListener() {
	get('#btn-leave').onclick = leaveCollective;
}

window.onload = function() {
	const userId = getUserId();
	drawTable(userId, function () {
		addEventListeners('chore-button', onClick, function () {
			cout('onClick Event listener added.');
		});
	})
};