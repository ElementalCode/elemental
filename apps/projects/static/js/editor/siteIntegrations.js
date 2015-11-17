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

		var previewWindow = document.getElementsByClassName('previewBody')[0];
		html2canvas(previewWindow.contentWindow.document.body).then(function(canvas) {
			document.body.appendChild(canvas);
			thumbnail = canvas.toDataURL();
			console.log(thumbnail);
			if (NEW_PROJECT) {
				request = axios.post('/rest/projects/project/', {
					data: JSON.stringify(fileData),
					name: 'untitled',
					thumbnail: thumbnail,
				}, config);
			} else {
				request = axios.patch('/rest/projects/project/' + P_ID, {
					data: JSON.stringify(fileData),
					thumbnail: thumbnail,
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
		});
	}
});