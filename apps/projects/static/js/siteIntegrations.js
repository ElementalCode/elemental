// alert('hi');

var SAVE_BUTTON = $('#shareMenu');

SAVE_BUTTON.addEventListener('click', function(ev) {
	if (ev.target.matches('#saveButton')) {
		var request;
		var config = {
			headers: {
				"X-CSRFToken": CSRF_TOKEN
			}
		};
		if (NEW_PROJECT) {
			request = axios.post('/rest/projects/project/', {
				data: JSON.stringify(fileData),
				name: 'test name'
			}, config);
		} else {
			request = axios.patch('/rest/projects/project/' + P_ID, {
				data: JSON.stringify(fileData),
				name: 'new name'
			}, config);
		}
		request.then(function(data) {
			if (NEW_PROJECT) {
				console.log('created');
				P_ID = data.data.id;
				NEW_PROJECT = false;
			} else {
				console.log('updated');
			}
		}).catch(function(err) {
			console.log(err);
		});
	}
});