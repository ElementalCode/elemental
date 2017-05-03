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
  var out = null;
  
  // attempt at garbage collection
  if(block.htmlElem) {
    block.htmlElem.removeEventListener('mouseover', block.block_mouse_over);
    block.htmlElem.removeEventListener('mouseout', block.block_mouse_out);
    if(block.htmlElem.parentNode) block.htmlElem.parentNode.removeChild(block.htmlElem);
    block.htmlElem = null;
  }
  
  if(block.type !== BLOCK_TYPES.stack && block.type !== BLOCK_TYPES.cblock) {
    out = null;
  } else if(block.name == 'text') {
    out = document.createTextNode(block.inputs[0].value);
  } else {
    out = document.createElement(block.name);
    for(let attr of block.attrs) {
      if(attr.name.trim() && attr.value.trim()) out.setAttribute(attr.name, attr.value);
    }
    for(let child of block.children) {
      let parsedChild = blockToHTML(child);
      if(parsedChild) out.appendChild(parsedChild);
    }
    block.htmlElem = out;
    
    out.addEventListener('mouseover', block.block_mouse_over);
    out.addEventListener('mouseout', block.block_mouse_out);
  }
  return out;
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
