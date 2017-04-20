function $(e) {
    if (e.split(' ')[e.split(' ').length - 1][0] == '#') {
        return document.getElementById(e.substr(1, e.length - 1));
    }
    arr = Array.prototype.slice.call(document.querySelectorAll(e));
    arr.forEach = function(callback) {
        for (var i = 0; i < arr.length; i++) {
            callback(arr[i], i);            
        }
    };
    arr.each = arr.forEach;
    arr.on = function(event, callback) {
        arr.forEach(function(item) {
            item.addEventListener(event, callback);
        });
        return arr;
    };
    return arr;
}

// really should have a functions.js file for this

function parentHasClass(element, className) {
    var regex = new RegExp('\\b' + className + '\\b');
    do {
        if (element.classList !== undefined) {
            if (element.classList.contains(className)) {
                return true;
            }
        } else {
            if (regex.exec(element.className)) {
                return true;
            }
        }
        element = element.parentNode;
    } while (element);
    return false;
}

function stringToHtml(str) {
    var d = document.createElement('div');
    d.innerHTML = str;
    return d.firstChild;
}

function arrContainsFromArr(arr1, arr2) {
    for (var i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) > -1) {
            return true;
        }
    }
    return false;
}

var fileData = {};
var fileNames = ['index.html']; // make this work later
var currentFile = 'index.html';

// All you have to do to do it right is be lazy -- liam
// (just kidding)
//var stackElements = ['e-img', 'e-text', 'e-CSS', 'e-style', ];
//var wrapperElements = ['e-div', 'e-body',  'e-a', 'e-h1', 'e-h2', 'e-h3', 'e-code', 'e-pre', 'e-p'];
var stackElements = [];
var wrapperElements = [];
filter.blocks.forEach(function(block) {
    if (block.type === 'cblock') {
        wrapperElements.push('e-' + block.name);
    } else if (block.type === 'stack') {
        stackElements.push('e-' + block.name);
    } else {
        console.warn('Invalid block type "' + block.type + '" for element ' + block.name);
    }
});

var unnamedWrapperElements = wrapperElements.map(function(item) {
    return item.substr(2, item.length - 1);
});
var textInput = 'text';

function getCSSAttributesHTML(attributes) {
    var pushedHtml = [];
    for (attr in attributes) {
        var attrValue = attributes[attr];
        pushedHtml.push('<li class="stack e-rule">rule <span class="script-input css-attr-dropdown" contenteditable="true">' + attr + '</span>: <span class="script-input" contenteditable="true">' + attrValue + '</span></li>');
    }
    return pushedHtml.join('');
}

function generateBlocks(jsonData, ext) {
  function generateBlock(block) {
    if(!block.type) return null;
    let newBlock;
    if(block.type == 'blockWrapper') {
      newBlock = new BlockWrapper();
      topLevelBlocks.push(newBlock)
    } else if( block.type == 'stack'
            || block.type == 'cblock') {
              newBlock = new Block(block.type, block.name, {
                  hasAttrs: block.hasAttrs,
                  hasQuickText: block.hasQuickText,
                  inputs: block.inputs,
                  inPalette: false,
                  unmoveable: block.unmoveable,
                  ftype: block.ftype
                });
              for(let attr of block.attrs) {
                add_attr(newBlock, attr.name, attr.value);
              }
    } else {
      return null; // other types of Draggies are generated in block constructors
    }
    newBlock.setPosition(block.x, block.y);
    for(let child of block.children) {
      let newChild = generateBlock(child);
      if(newChild) newBlock.insertChild(newChild, -1);
    }
    return newBlock;
  }
  if(ext == 'css') {
    clearBlocks(currentFile);
    replaceBody(new BlockWrapper());
    BODY.type = 'CSSStart';
    
    let newBodyScript = jsonData[0];
    for(let block of newBodyScript.children) {
      let newBlock = generateBlock(block);
      if(newBlock) {
        mainScript.insertChild(newBlock, -1)
      }
    }
    
    for(let i = 1, block; i < jsonData.length; i++) {
      block = jsonData[i];
      let newBlock = generateBlock(block);
      if(newBlock) {
        SCRIPTING_AREA.insertBefore(newBlock.elem, SCRIPTING_AREA.firstChild);
      }
    }
  } else if(ext == 'html') {
    let body;
    for(let block of jsonData) {
      if (block.name == 'body') {
        body = block;
        break;
      }
    }
    clearBlocks();
    let newBody = generateBlock(body);
    replaceBody(newBody);
    for(let block of jsonData) {
      if(block != body) {
        let newBlock = generateBlock(block);
        if(newBlock) {
          SCRIPTING_AREA.insertBefore(newBlock.elem, SCRIPTING_AREA.firstChild);
        }
      }
    }
  }
}

function loadFile(filename, el) {
    if (el) {
        setFrameContent(); // save json
    }

    currentFile = filename;
    var fileJson = fileData[filename];

    if (el) {
        // first deselect other files...
        $('.filePane .file.selected').each(function(elem) {
            elem.classList.remove('selected');
        });
        // select this one...
        el.parentNode.classList.add('selected');
    }

    blockArea = $('.scriptingArea')[0];
    generateBlocks(fileJson, getExt(filename));
    setFrameContent();
    setZebra();
}

function manuallyCreateFile() {
    //we need something better than this
    var fileName = prompt('Enter a file name', '.html');
    if(!fileName) {
      alert('File name required.');
      return;
    }
    var ext = getExt(fileName);
    var allowedExts = ['html', 'css'];
    if (allowedExts.indexOf(ext) != -1) {
        if (!fileData.hasOwnProperty(fileName)) {
            generateFile(fileName);
        } else {
          alert('A file with that name already exists.')
        }
    } else {
        alert('File type "' + ext + '" not supported.');
    }
}

function getExt(fileName) {
  return fileName.match(/\w+$/)[0];
}

function generateFile(fileName) {
    var ext = getExt(fileName);
    currentFile = fileName;

    var finalFile = $('.add-file')[0];

    // first deselect the other files...
    $('.filePane .file.selected').each(function(el) {
        el.classList.remove('selected');
    });

    // then insert the new file selector...
    var fileSelector = document.createElement('div');
    fileSelector.className = 'file selected';
    fileSelector.innerHTML = [
        '<div class="file-name" data-file="' + fileName + '">',
            fileName,
        '</div>'].join('');
    finalFile.parentNode.insertBefore(fileSelector, finalFile);

    if (ext == 'html') {
        clearBlocks();
        replaceBody();
    } else if (ext == 'css') {
        clearBlocks(currentFile);
        replaceBody(new BlockWrapper());
        BODY.type = 'CSSStart';
        
        // add default blocks
        let defaultSelector = new Block('cblock', 'selector', {
            hasAttrs: false,
            hasQuickText: false,
            inputs: ['.selector'],
            inPalette: false,
            ftype: 'css'
          });
        mainScript.insertChild(defaultSelector, -1);
        
        let defaultRule = new Block('stack', 'rule', {
            hasAttrs: false,
            hasQuickText: false,
            inputs: ['background-color', 'red'],
            inPalette: false,
            ftype: 'css'
          });
        defaultSelector.insertChild(defaultRule, -1);
    } else {
        throw 'File type "' + ext + '" not supported.';
    }
    blockArea = $('.scriptingArea')[0];

    //clear preview window
    var previewWindow = document.getElementsByClassName('previewBody')[0];
    previewWindow = (previewWindow.contentWindow) ? previewWindow.contentWindow : (previewWindow.contentDocument.document) ? previewWindow.contentDocument.document : previewWindow.contentDocument;

    previewWindow.document.open();
    previewWindow.document.write('');
    previewWindow.document.close();
}

var FILE_MENU = document.querySelector('.context-menu.files');
var RIGHT_CLICKED;

$('.filePane').on('click', function(ev) {
    var el = ev.target;
    if (el.classList.contains('file') || parentHasClass(el, 'file')) { 
        if (el.classList && el.classList.contains('file')) {
            loadFile(el.children[0].dataset.file, el.children[0]);
        } else if (parentHasClass(el, 'file')) {
            loadFile(el.dataset.file, el);
        }
        ev.stopPropagation();
    } else if (el.classList.contains('add-file') || parentHasClass(el, 'add-file')) {
        manuallyCreateFile();
        ev.stopPropagation();
    }
    FILE_MENU.style.display = 'none';
    RIGHT_CLICKED = undefined;
}).on('contextmenu', function(ev) {
    var el = ev.target;
    if (el.classList.contains('file') || parentHasClass(el, 'file')) {
        var fileName;
        var clickedEl;
        if (el.classList && el.classList.contains('file')) {
            fileName = el.children[0].dataset.file;
            clickedEl = el;
        } else if (parentHasClass(el, 'file')) {
            fileName = el.dataset.file;
            clickedEl = el.parentNode;
        }

        RIGHT_CLICKED = {file: fileName, el: clickedEl};

        FILE_MENU.style.display = 'block';
        FILE_MENU.style.top = ev.pageY + 'px';
        FILE_MENU.style.left = ev.pageX + 'px';

        ev.preventDefault();
    } else if (el.classList.contains('add-file') || parentHasClass(el, 'add-file')) {
        ev.preventDefault();
    }
});

$('.context-menu.files .menu-item').on('click', function(ev) {
    if (RIGHT_CLICKED) {
        switch (this.dataset.action) {
            case 'delete-file':
                if (Object.keys(fileData).length > 1) {
                    if (RIGHT_CLICKED.file == currentFile) {
                        loadFile(Object.keys(fileData)[0], document.querySelector('.filePane .file').children[0]);
                    }
                    RIGHT_CLICKED.el.parentNode.removeChild(RIGHT_CLICKED.el);
                    delete fileData[RIGHT_CLICKED.file];
                }
                break;

            case 'rename-file':
                var newName = prompt('Enter the new file name:', RIGHT_CLICKED.file);
                if (newName && !fileData.hasOwnProperty(newName)) {
                    RIGHT_CLICKED.el.children[0].textContent = newName;
                    RIGHT_CLICKED.el.children[0].dataset.file = newName;
                    fileData[newName] = fileData[RIGHT_CLICKED.file];
                    delete fileData[RIGHT_CLICKED.file];
                    currentFile = newName;
                }
                break;

            case 'duplicate-file':
                var oldName = RIGHT_CLICKED.file.split('.');
                var newName = oldName[oldName.length - 2] + '-copy.' + oldName[oldName.length - 1];  //there should be a better way...
                if (!fileData.hasOwnProperty(newName)) {
                    generateFile(newName, oldName[oldName.length - 1], fileData[RIGHT_CLICKED.file]);
                }
                break;

            default:
                //nothing
        }
    }
    RIGHT_CLICKED = undefined;
    FILE_MENU.style.display = 'none';
});
