document.getElementById('downloadButton').addEventListener('click', function() {
	var zip = new JSZip();
	var jsonFiles = zip.folder('_elem');

	for (fileName in fileData) {
		zip.file(fileName, json2html(fileData[fileName]));
		jsonFiles.file(fileName.split('.')[0] + '.json', JSON.stringify(fileData[fileName]));
	}

	var content = zip.generate({type: 'blob'});
	saveAs(content, 'project.zip');
});