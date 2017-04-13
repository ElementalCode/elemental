//probably should put this in a local function on prod... fine for now tho

if (!String.prototype.startsWith) {  // sweet polyfill
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

function toArr(nl) {
	return Array.prototype.slice.call(nl);
}

function includesArrItem(str, arr) {
	var includes = false;
	for (var i = 0; i < arr.length; i++) {
		if (str.indexOf(arr[i]) > -1) {
			includes = true;
			break;
		}
	}
	return includes;
}

function getChildElem(parent, cName) {
	var child = null;
	for (var i = 0; i < parent.childNodes.length; i++) {
	    if (parent.childNodes[i].className == cName) {
	        child = parent.childNodes[i];
	        break;
	    }        
	}
	return child;
}

function getElType(node) {
	var classList = node.className.split(' ');
	var type = null;
	for (var i = 0; i < classList.length; i++) {
		if (classList[i].startsWith('e-')) {
			type = classList[i].substr(2, classList[i].length - 1);
			break;
		}
	}
	return type;
}

function getAttrNames(classes) {
	var classList = classes.split(' ');
	var names = [];
	for (var i = 0; i < classList.length; i++) {
		if (attrNames.indexOf(classList[i]) > -1) {
			names.push(classList[i]);
		}
	}
	return names;
}

function getSingleAttrs(element) {
	// get attributes from element
	var attrs = {};
	var attrElems = toArr(element.children);
	for (var i = 0; i < attrElems.length; i++) {
		var attrHolder = attrElems[i];
		if (attrHolder.classList && attrHolder.classList.contains('attr-holder')) {
			var attrName = attrHolder.children[0].textContent;
			var attrValue = attrHolder.children[1].textContent;
			attrs[encodeEntities(attrName)] = encodeEntities(attrValue);
		}
	}
	return attrs;
}

function getWrapperAttrs(element) {
	element = element.children[0];
	var attrs = {};
	var attrElems = toArr(element.children);
	for (var i = 0; i < attrElems.length; i++) {
		var attrHolder = attrElems[i];
		if (attrHolder.classList && attrHolder.classList.contains('attr-holder')) {
			var attrName = attrHolder.children[0].textContent;
			var attrValue = attrHolder.children[1].textContent;
			attrs[encodeEntities(attrName)] = encodeEntities(attrValue);
		}
	}
	return attrs;
}

function encodeEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getText(elem) {
	var text = '';
	var childNodes = toArr(elem.children);
	for (var i = 0; i < childNodes.length; i++) {
		if (childNodes[i].classList.contains(textInput)) {
			text += childNodes[i].children[0].textContent;
		}
	}
	return text;
}

function getInlineText(elem) {
	var text = '';
	var childNodes = toArr(elem.children);
	for (var i = 0; i < childNodes.length; i++) {
		if (childNodes[i].classList.contains(textInput)) {
			text += childNodes[i].textContent;
		}
	}
	return text;
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
	//var script = document.getElementsByClassName('script')[0].cloneNode(true); //should only be one...
	var previewElement = document.getElementsByClassName('previewBody')[0];

	//var directChildren = toArr(script.children);
	//directChildren.shift();

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

// example:
//
// var json = {
//   tag: 'body',
//   attr: {
//     id: '1',
//     class: ['foo']
//   },
//   child: [{
//     tag: 'h2',
//     text: 'sample text with <code>inline tag</code>'
//   },{
//     tag: 'pre',
//     attr: {
//       id: 'demo',
//       class: ['foo', 'bar']
//     }
//   },{
//     tag: 'pre',
//     attr: {
//       id: 'output',
//       class: ['goo']
//     }
//   },{
//     tag: 'input',
//     attr: {
//       id: 'execute',
//       type: 'button',
//       value: 'execute'
//     }
//   }]
// };
