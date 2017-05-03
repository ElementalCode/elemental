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
  if(block.type !== BLOCK_TYPES.stack && block.type !== BLOCK_TYPES.cblock) {
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

function blocksToJSON(fileName) {
  var ext = getExt(fileName);
  if (ext == 'html') {
    var expArray = [];
    for(let block of topLevelBlocks) {
      if(block) expArray.push(block.toStringable());
    }
    fileData[fileName] = expArray;
  } else if (ext == 'css') {
    var expArray = [mainScript.toStringable()];
    for(let block of topLevelBlocks) {
      if(block && block != BODY && block.type != BLOCK_TYPES.CSSStart) {
        expArray.push(block.toStringable());
      }
    }
    fileData[fileName] = expArray;
  }
}

function setFrameContent(ext) {
	ext = ext || getExt(currentFile);
	var previewElement = document.querySelector('.previewBody');
  if(previewElement.contentWindow) {
    previewWindow = previewElement.contentWindow;
  } else if(previewElement.contentDocument.document) {
    previewWindow = previewElement.contentDocument.document;
  } else {
    previewWindow = previewWindow.contentDocument;
  }
  var previewDocument = previewWindow.document,
    child;
  while(child = previewDocument.firstChild) previewDocument.removeChild(child);

	if (ext == 'css') {
		blocksToJSON(currentFile);
	} else if (ext == 'html') {
		var parsedHtml = blockToHTML(BODY);
    blocksToJSON(currentFile);

    previewWindow.document.appendChild(parsedHtml);
	} else {
		throw 'this should never be thrown though';
	}
}

setFrameContent();
