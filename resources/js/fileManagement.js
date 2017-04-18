document.getElementById('downloadButton').addEventListener('click', function() {
	var zip = new JSZip();
	var jsonFiles = zip.folder('.elem');
	for(let fileName in fileData) {
		let ext = getExt(fileName);
		let out;
		if(ext == 'html') {
			out = `<html>\n<head></head>`;
			let body = fileData[fileName][0]; // first one should always be body
			out += blockToHTML(body).outerHTML;
			out += '</html>';
		} else if(ext == 'css') {
			out = blockToCSS(fileData[fileName]);
		} else {
			console.log('Can\'t export files of type ' + ext);
			continue;
		}
		zip.file(fileName, out);
	}
	
	jsonFiles.file('project.json', JSON.stringify(fileData, null, 1));

	var content = zip.generate({type: 'blob'});
	saveAs(content, 'project.zip');
});

document.getElementById('openFileButton').addEventListener('click', function() {
	document.getElementById('projectOpen').click();
});

document.getElementById('projectOpen').addEventListener('change', function() {
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
			newHtml += '<div class="file' + (first ? ' selected' : '') + '"><div class="file-name" data-file="' + file + '">' + file + '</div></div>';
			if (first) {
				first = false;
				currentFile = file;
			}
		}
		newHtml += '<div class="add-file"><div class="file-name">+</div></div>';
		$('.filePane')[0].innerHTML = newHtml;

		// finally, re-render
		loadFile(currentFile);
	}
	reader.readAsArrayBuffer(this.files[0]);

	document.getElementById('projectOpen').value = null;  // clear value
});
