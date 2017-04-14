//probably should put this in a local function on prod... fine for now tho

if (!String.prototype.startsWith) {  // sweet polyfill
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

function blockToCSS(blockList) {
  function blockToCSS_(block) {
    if(block.name == 'selector') {
      let out = '';
      for(let child of block.children) {
        out += blockToCSS_(child);
      }
      return `${block.inputs[0]} {\n${out}}\n`
    } else if(block.name == 'rule') {
      return `  ${block.inputs[0]}: ${block.inputs[1]};\n`
    } else {
      let out = '';
      for(let child of block.children) {
        out += blockToCSS_(child);
      }
      return out;
    }
  }
  var css = '';
  for(let block of blockList) {
    css += blockToCSS_(block);
  }
  return css;
}

function blockToHTML(block) {
  if(block.type !== 'stack' && block.type !== 'cblock') {
    return null;
  } else if(block.name == 'text') {
    return document.createTextNode(block.inputs[0].value);
  } else {
    var element = document.createElement(block.name);
    for(let attr of block.attrs) {
      if(attr.name.trim() && attr.value.trim()) element.setAttribute(attr.name, attr.value);
    }
    for(let child of block.children) {
      let parsedChild = blockToHTML(child);
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
		var parsedHtml = blockToHTML(BODY);
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
