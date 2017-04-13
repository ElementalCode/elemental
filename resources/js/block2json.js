//probably should put this in a local function on prod... fine for now tho

if (!String.prototype.startsWith) {  // sweet polyfill
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

function blockTreeToCSS() {
    function blockToCSS(block) {
    if(block.name == 'selector') {
      let out = '';
      for(let child of block.children) {
        out += blockToCSS(child);
      }
      return `${block.inputs[0].value} {\n${out}}\n`
    } else if(block.name == 'rule') {
      return `  ${block.inputs[0].value}: ${block.inputs[1].value};\n`
    } else {
      return '';
    }
  }
  var css = '';
  for(let block of bodyScript.children) {
    css += blockToCSS(block);
  }
  return css;
}

function blockTreeToHTML(block) {
  if(block.type !== 'stack' && block.type !== 'wrapper') {
    return null;
  } else if(block.name == 'text') {
    return document.createTextNode(block.inputs[0].value);
  } else {
    var element = document.createElement(block.name);
    for(let attr of block.attrs) {
      if(attr.name.trim() && attr.value.trim()) element.setAttribute(attr.name, attr.value);
    }
    for(let child of block.children) {
      let parsedChild = blockTreeToHTML(child);
      if(parsedChild) element.appendChild(parsedChild);
    }
    return element;
  }
}

function setFrameContent(ext) {
	ext = ext || getExt(currentFile);
	var previewElement = document.getElementsByClassName('previewBody')[0];

	if (ext == 'css') {
		blocksToJSON(currentFile);
	} else if (ext == 'html') {
		var parsedHtml = blockTreeToHTML(BODY);
    blocksToJSON(currentFile);

		var previewWindow = previewElement;
		previewWindow = (previewWindow.contentWindow) ? previewWindow.contentWindow : (previewWindow.contentDocument.document) ? previewWindow.contentDocument.document : previewWindow.contentDocument;
    while(previewWindow.document.firstChild) previewWindow.document.removeChild(previewWindow.document.firstChild);
    previewWindow.document.appendChild(parsedHtml);
	} else {
		throw 'this should never be thrown though';
	}
}

setFrameContent();
