document.getElementById('downloadButton').addEventListener('click', function() {
	var zip = new JSZip();
	var jsonFiles = zip.folder('.elem');

	for (fileName in fileData) {
		zip.file(fileName, json2html(fileData[fileName]));
		// jsonFiles.file(fileName.split('.')[0] + '.json', JSON.stringify(fileData[fileName]));
	}

	jsonFiles.file('project.json', JSON.stringify(fileData));

	var content = zip.generate({type: 'blob'});
	saveAs(content, 'project.zip');
});

document.getElementById('openFileButton').addEventListener('click', function() {
	document.getElementById('projectOpen').click();
});

document.getElementById('projectOpen').addEventListener('change', function() {
	console.log(this.files);
	var opening = this.files[0];

	// var zip = new JSZip();
	// zip.load(this.files[0]);

	var reader = new FileReader();
	reader.onload = function(e) {
		var unzip = new JSZip(e.target.result);
		var newJson = JSON.parse(unzip.files['.elem/project.json'].asText());

		// first, set the json to the new json
		fileData = newJson;

		// then, set the file selectors
		var newHtml = '';
		var first = true;
		for (file in newJson) {
			newHtml += '<div class="file ' + (first ? 'selected' : '') + '"><div class="file-name" data-file="' + file + '">' + file + '</div></div>';
			if (first) {
				first = false;
				currentFile = file;
			}
		}
		newHtml += '<div class="add-file"><div class="file-name">+</div></div>';
		$('.filePane')[0].innerHTML = newHtml;

		// finally, re render
		loadFile(currentFile, $('.filePane')[0].children[0]);
	}
	reader.readAsArrayBuffer(this.files[0]);

	document.getElementById('projectOpen').value = null;  // clear value
});