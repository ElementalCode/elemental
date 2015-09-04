// alert('hi');

var SAVE_BUTTON = $('#shareMenu');

SAVE_BUTTON.addEventListener('click', function(ev) {
	if (ev.target.matches('#saveButton')) {
		var request;
		if (NEW_PROJECT) {
			request = axios.post('/rest/projects/project/', {
				data: JSON.stringify(fileData),
				name: 'test name'
			});
		} else {
			// request = axios.patch('/', {
			// 	data: JSON.stringify(fileData)
			// });
		}
		request.then(function(data) {
			if (NEW_PROJECT) {
				P_ID = parseFloat(data);
				NEW_PROJECT = false;
			}
		}).catch(function(err) {
			console.log(err);
		});
	}
});