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

// new file popup
function setFileExtension(filetype) {
  var dot = document.getElementById("fileExtension");
  dot.innerHTML = filetype;
  document.getElementById("fileNameContainer").style.paddingLeft = dot.offsetWidth + "px";
  
  var checked = document.querySelector(".fileTypeButton.checked")
  if(checked) {
    checked.classList.remove("checked");
  }
  document.querySelector(".fileTypeButton[data-ext=\"" + filetype + "\"]").classList.add("checked");
}
function getFileName() {
	var filename = document.getElementById("fileName").textContent;
	var filetype = document.querySelector(".fileTypeButton.checked").getAttribute("data-ext");
  return filename + filetype;
}

openNewFilePopup = function() {
  document.getElementById("newFilePopup").style.display = "block";
  var fn = document.getElementById("fileName");
  fn.innerHTML = "untitled";
  fn.focus();
  var selection = window.getSelection();        
  var range = document.createRange();
  range.selectNodeContents(fn);
  selection.removeAllRanges();
  selection.addRange(range);
  setFileExtension(".html");
};


var fileTypeButtons = document.getElementsByClassName("fileTypeButton");
for(let i = 0; i < fileTypeButtons.length; i++) {
	fileTypeButtons[i].addEventListener("click", function(e) {
  	if(!e.target.classList.contains("disabled") && e.target.getAttribute("data-ext")) {
    	setFileExtension(e.target.getAttribute("data-ext"));
    }
  });
}

document.getElementById("fileName").addEventListener("input", function(e) {
	var popup = document.getElementById("newFilePopup");
	if(!fileData.hasOwnProperty(fileName) && e.target.innerHTML.match(/^[\w,\s-]{1,255}$/)) {
  	popup.classList.remove("error");
  } else {
  	popup.classList.add("error");
  }
});

document.getElementById("closeFileName").addEventListener("click", function() {
	document.getElementById("newFilePopup").style.display = "none";
});
document.getElementById("createFileName").addEventListener("click", function() {
	if(document.getElementById("newFilePopup").classList.contains("error")) {
  	return;
  }
	document.getElementById("newFilePopup").style.display = "none";
	generateFile(getFileName());
});
