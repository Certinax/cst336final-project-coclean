import {cout, Http,	get, getAll, flushChildren, isJSON, make, attr} from '../../functions/functions.js';

let API_BASE_URL = `${window.location.origin}/api`;
const TABLE_BODY_SELECTOR = '#chore-table-body';

function getUserId() {
	return parseInt(get(TABLE_BODY_SELECTOR).getAttribute('data-id'));
}

function makeTableRow(name, desc, timesCompleted, frequency, choreId) {
	return `
		<tr data-id="${choreId}">
				<td class="text-left align-middle chore-name" colspan="2" data-toggle="collapse" data-target=".item${choreId}">${name}</td>
				<td class="align-middle chore-frequency" data-toggle="collapse" data-target=".item${choreId}">
					<span class="chore-completed-num">${timesCompleted}</span>/<span class="chore-frequency-num">${frequency}</span>
				</td>
				<td><button data-id="${choreId}" data-type="chore-button" class="btn btn-finish btn-sm m-0 lightFont" data-toggle="modal" data-target="#editChore">Edit</button></td>
		</tr>
		<tr data-desc="${choreId}">
			<td class="hiddenRow" colspan="4">
				<div class="chore-description collapse item${choreId} text-left">${((desc && desc.length > 0) ? desc : 'No description')}</div>
			</td>
		</tr>
		`;
}

function emptyTable(callback) {
	const tbody = get(TABLE_BODY_SELECTOR);
	flushChildren(tbody, function () {
		callback();
	})
}

function updateChoreModal(e){
	const self = e.target;
	const choreId = parseInt(self.getAttribute('data-id'));
	const choreName = get(`tr[data-id="${choreId}"] > .chore-name`).innerText;
	const choreFrequency = get(`tr[data-id="${choreId}"] > .chore-frequency > .chore-frequency-num`).innerText;
	const choreDesc = get(`tr[data-desc="${choreId}"] .chore-description`).innerText;

	get('#chore-update-name').value = choreName;
	get('#chore-update-frequency').value = choreFrequency;
	get('#chore-update-description').value = choreName;
}

function addEventListenersOnEditButtons(callback) {
	const buttons = getAll('button[data-type="chore-button"]');
	for (let i=0; i<buttons.length; i++) {
		buttons[i].onclick = updateChoreModal;
	}
	callback();
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

window.onload = function() {
	const userId = getUserId();
	drawTable(userId, function () {
		addEventListenersOnEditButtons(function () {
			console.log('ELs added.');
		})
	})
};