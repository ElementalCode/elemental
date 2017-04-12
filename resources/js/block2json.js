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

function traverseTree(parentNode) {
	parentNode = parentNode.children[1];
	var directChildren = toArr(parentNode.children);
	var pushedArr = [];
	for (var i = 0; i < directChildren.length; i++) {
		if (includesArrItem(directChildren[i].className, stackElements)) {  //things like imgs
			var elType = getElType(directChildren[i]);
			if (elType == 'text') {
				elType = '';
			}
			if (elType == 'CSS') {
				var cssFileName = getSingleAttrs(directChildren[i]).href;
				if (fileData.hasOwnProperty(cssFileName)) {
					var cssText = CSSJSON.toCSS({
						children: fileData[cssFileName],
						attributes: {}
					});
					pushedArr.push({
						tag: 'style',
						attr: getSingleAttrs(directChildren[i]),
						text: cssText
					});
				} else {
					pushedArr.push({
						tag: 'style',
						attr: getSingleAttrs(directChildren[i]),
						text: ''
					});
				}
			} else {
				pushedArr.push({
					tag: elType,
					attr: elType ? getSingleAttrs(directChildren[i]) : {},
					text: encodeEntities(getInlineText(directChildren[i]))
				});
			}
		} else if (includesArrItem(directChildren[i].className, wrapperElements)) {  // things that can nest things - ie most elements
			var elType = getElType(directChildren[i]);
			pushedArr.push({
				tag: elType,
				attr: getWrapperAttrs(directChildren[i]),
				child: traverseTree(directChildren[i]),
			});
		}
	}
	return pushedArr;  //recursively get children of blocks
}

function getCSSAttributes(children) {
	var attributes = {};
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		var attrName = encodeEntities(child.children[0].textContent);
		var attrValue = encodeEntities(child.children[1].textContent);
		attributes[attrName] = attrValue;
	}
	return attributes;
}

function blockTreeToHTML(block) {  
  if(block.type !== 'stack' && block.type !== 'wrapper') {
    return null;
  } else if(block.name == 'text') {
    return document.createTextNode(block.scriptInput.textContent);
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
	ext = ext || currentFile.split('.').pop();
	//var script = document.getElementsByClassName('script')[0].cloneNode(true); //should only be one...
	var previewElement = document.getElementsByClassName('previewBody')[0];

	//var directChildren = toArr(script.children);
	//directChildren.shift();

	if (ext == 'css') {
		var jsonFormat = {};
		for (var i = 0; i < directChildren.length; i++) {
			//this should be easier than HTML because it's merely a list of selectors
			var child = directChildren[i];
			// check to make sure it's a selector block
			if (child.classList.contains('e-selector')) {
				var selector = child.children[0].children[0].textContent;
				jsonFormat[selector] = {};
				jsonFormat[selector].attributes = getCSSAttributes(child.children[1].children);
				// console.log(child.children[1].children);
			}
		}
		fileData[currentFile] = jsonFormat;
	} else if (ext == 'html') {
		var parsedHtml = blockTreeToHTML(BODY);

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
