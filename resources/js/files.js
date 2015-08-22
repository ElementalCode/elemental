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

var fileData = {};
var currentFile = 'index.html';

var stackElements = ['e-img', 'e-a', 'e-h1', 'e-h2', 'e-h3', 'e-text'];
var attrNames = ['src', 'class', 'id', 'href', ]; //add attrs
var wrapperElements = ['e-div', 'e-body', ];
var textInput = 'text';

function generateBlocks(jsonData) {
    // console.log(jsonData);
    var baseHtml = [
        '<ul class="script">',
            '<li class="hat">&lt;!DOCTYPE html&gt;</li>'
    ];
    baseHtml.push('</ul>');
    return baseHtml.join('');
}

// function loadFile(filename) {
//     currentFile = filename;

//     if (!fileData.hasOwnProperty(filename)) {
//         fileData[filename] = {};
//     }

//     var fileJson = fileData[filename];

//     // render the HTML somehow from the blocks
//     blockArea = $('.scriptingArea')[0];
//     blockArea.innerHTML = generateBlocks(fileJson.child);
//     setFrameContent();
// }

function createFile() {
    //we need something better than this
    var fileName = prompt('Enter a file name', '.html');

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
    }
    blockArea = $('.scriptingArea')[0];
    blockArea.innerHTML = generateBlocks([]);
    setFrameContent();
}

$('.filePane').on('click', function(ev) {
    var el = ev.target;
    if (el.classList.contains('file') || parentHasClass(el, 'file')) {
        // loadFile(el.dataset.file);  // oops have to get the child's dataset if the parent is the one clicked
        ev.stopPropagation();
    } else if (el.classList.contains('add-file') || parentHasClass(el, 'add-file')) {
        createFile();
        ev.stopPropagation();
    }
});