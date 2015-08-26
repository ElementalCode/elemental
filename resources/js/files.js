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

// function arrContainsFromArr(arr1, arr2) {
//     for (var i = 0; i < arr2.length; i++) {
//         if (arr1.indexOf(arr2[i]) > -1) {
//             return true;
//         }
//     }
//     return false;
// }

var fileData = {};
var currentFile = 'index.html';

var stackElements = ['e-img', 'e-a', 'e-h1', 'e-h2', 'e-h3', 'e-text'];
var attrNames = ['src', 'class', 'id', 'href', ]; //add attrs
var wrapperElements = ['e-div', 'e-body', ];
var unnamedWrapperElements = wrapperElements.map(function(item) {
    return item.substr(2, item.length - 1);
});
var textInput = 'text';

function getBlockHtml(tag) {
    if (tag) {
        return filter.blocks.filter(function(item) {
            return item.name == tag;
        })[0].htmlString;
    } else {
        return filter.blocks.filter(function(item) {
            return item.name == 'text';
        })[0].htmlString;
    }
}

function generateWrapperBlocks(jsonData) {
    var wrapperHtml = [
        '<ul class="c-wrapper e-' + jsonData.tag + '">',
            '<li class="c-header">' + jsonData.tag + '</li>',
            '<ul class="c-content">',
    ];

    for (var i = 0; i < jsonData.child.length; i++) {
        var curEl = jsonData.child[i];
        if (stackElements.indexOf('e-' + curEl.tag) > -1 || curEl.tag === '') {  // if it's a stack or plain text
            wrapperHtml.push(getBlockHtml(curEl.tag));
        }
        if (unnamedWrapperElements.indexOf(curEl.tag) > -1) {
            // repeat down tree...
            wrapperHtml.push(generateWrapperBlocks(curEl));
        }
    }

    wrapperHtml.push(
        '</ul><li class="c-footer"></li></ul>'
    );

    return wrapperHtml.join('');
}

function generateBlocks(jsonData) {
    var baseHtml = [
        '<ul class="script">',
            '<li class="hat">&lt;!DOCTYPE html&gt;</li>',
            '<ul class="c-wrapper e-body">',
                '<li class="c-header">&lt;body&gt;</li>',
                '<ul class="c-content">',
    ];

    for (var i = 0; i < jsonData.length; i++) {
        var curEl = jsonData[i];
        if (stackElements.indexOf('e-' + curEl.tag) > -1 || curEl.tag === '') {  // if it's a stack or plain text
            baseHtml.push(getBlockHtml(curEl.tag));
        }
        if (unnamedWrapperElements.indexOf(curEl.tag) > -1) {
            // repeat down tree...
            baseHtml.push(generateWrapperBlocks(curEl));
        }
    }

    
    baseHtml.push('</ul><li class="c-footer">&lt;/body&gt;</li></ul></ul>');
    // debugger;
    return baseHtml.join('');
}

function loadFile(filename, el) {
    currentFile = filename;

    var fileJson = fileData[filename];

    // first deselect other files...
    $('.filePane .file.selected').each(function(elem) {
        elem.classList.remove('selected');
    });

    // select this one...
    el.parentNode.classList.add('selected');

    // render the HTML somehow from the blocks
    blockArea = $('.scriptingArea')[0];
    blockArea.innerHTML = generateBlocks(fileJson.child);
    setFrameContent();  // this is somehow messing up the JSON....
    setZebra();
}

function createFile() {
    //we need something better than this
    var fileName = prompt('Enter a file name', '.html');
    if (fileName && !fileData.hasOwnProperty(fileName)) {
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

        // set the fileData for it to be basic...
        fileData[fileName] = {
          "tag": "body",
          "attr": {},
          "child": []
        };
        blockArea = $('.scriptingArea')[0];
        blockArea.innerHTML = generateBlocks([]);

        //clear preview window
        var previewWindow = document.getElementsByClassName('previewBody')[0];
        previewWindow = (previewWindow.contentWindow) ? previewWindow.contentWindow : (previewWindow.contentDocument.document) ? previewWindow.contentDocument.document : previewWindow.contentDocument;

        previewWindow.document.open();
        previewWindow.document.write('');
        previewWindow.document.close();
    }
}

var FILE_MENU = document.querySelector('.context-menu.files');
var RIGHT_CLICKED;

$('.filePane').on('click', function(ev) {
    var el = ev.target;
    if (el.classList.contains('file') || parentHasClass(el, 'file')) {
        // loadFile(el.dataset.file);  // oops have to get the child's dataset if the parent is the one clicked
        if (el.classList && el.classList.contains('file')) {
            loadFile(el.children[0].dataset.file, el.children[0]);
        } else if (parentHasClass(el, 'file')) {
            loadFile(el.dataset.file, el);
        }
        ev.stopPropagation();
    } else if (el.classList.contains('add-file') || parentHasClass(el, 'add-file')) {
        createFile();
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
            default:
                //nothing
        }
    }
    RIGHT_CLICKED = undefined;
    FILE_MENU.style.display = 'none';
});