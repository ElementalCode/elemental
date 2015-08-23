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

function generateWrapperBlocks(jsonData) {
    var wrapperHtml = [
        '<ul class="c-wrapper e-' + jsonData.tag + '">',
            '<li class="c-header">' + jsonData.tag + '</li>',
            '<ul class="c-content">',
    ];

    for (var i = 0; i < jsonData.child.length; i++) {
        var curEl = jsonData.child[i];
        if (stackElements.indexOf('e-' + curEl.tag) > -1 || curEl.tag === '') {  // if it's a stack or plain text
            wrapperHtml.push( // just filler for now...
                "<li class='stack e-text'><span contenteditable='true' class='script-input text'>breadfish.gif</span></li>"
            );
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
            baseHtml.push( // just filler for now...
                "<li class='stack e-text'><span contenteditable='true' class='script-input text'>breadfish.gif</span></li>"
            );
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
});