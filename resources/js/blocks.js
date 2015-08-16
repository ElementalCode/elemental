var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}

function closestElem(elem, offset, initial) { //elem is nodelist, offset is own offset
    var el = null,
        elOffset,
        x = offset.x, //x is my own offset
        y = offset.y, //y is my own offset
        distance,
        dx, dy,
        minDistance;
    elem.each( function(item) {
        if(item == selected) {return false;} // I added this -NN
        elOffset = getOffset(item); //returns object with offsets

        //we'll worry about inside c-blocks later:
        /*if (
        (x >= elOffset.left)  && (x <= elOffset.right) &&
        (y >= elOffset.top)   && (y <= elOffset.bottom)
        ) {
            el = item;
            return false;
        }*/
        
        //let's only test the bottom-left corner
        dx = elOffset.left - x; 
        dy = elOffset.bottom - y;
        distance = Math.sqrt((dx*dx) + (dy*dy)); //dist to each corner
        if (distance <= MIN_DISTANCE && initial != item && !isDescendant(initial, item) && (minDistance === undefined || distance < minDistance)) {
            minDistance = distance;
            el = item;
        }
    });
    return el;
}

function getOffset( elem ) {
    var offsetLeft = (function(elem) {
        var offsetLeft = 0;
        do {
          if ( !isNaN( elem.offsetLeft ) )
          {
              offsetLeft += elem.offsetLeft;
          }
        } while( elem = elem.offsetParent );
        return offsetLeft;
    })(elem);
    
    var offsetTop = (function(elem) {
        var offsetTop = 0;
        do {
          if ( !isNaN( elem.offsetTop ) )
          {
              offsetTop += elem.offsetTop;
          }
        } while( elem = elem.offsetParent );
        return offsetTop;
    })(elem);
    
    var offsetRight = offsetLeft + elem.offsetWidth; //sure, want coords not distances
    
    var offsetBottom = offsetTop + elem.offsetHeight;
    
    return {left: offsetLeft, top:offsetTop, right:offsetRight, bottom:offsetBottom};
    
}

// ancestor has parent
function parentHasClass(element, className) {
    do {
        if (element.classList.contains(className)) {
            return true;
        }
        element = element.parentNode;
    } while (element);
    return false;
}

// Will be called when user starts dragging an element
function _drag_init(elem, ev) {
    var relativeX = ev.pageX - getOffset(elem).left;
    var relativeY = ev.pageY - getOffset(elem).top;
    // Store the object of the element which needs to be moved
    var wrapper = document.createElement("ul");
    wrapper.classList.add('draggy');
    SCRIPTING_AREA.insertBefore(wrapper, SCRIPTING_AREA.firstChild);
    selected = elem;
    //var curX = getOffset(elem).left;
    //var curY = getOffset(elem).top;
    var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
        curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
    var childs = Array.prototype.slice.call(elem.parentElement.children);
    for(var i = childs.indexOf(elem); i < childs.length; i++) {
        childs[i].removeAttribute('style');
        wrapper.appendChild(childs[i]);
    }
    wrapper.style.left = curX - relativeX + 'px';
    wrapper.style.top = curY - relativeY + 'px';
    selected = wrapper;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

function _palette_drag_init(elem, ev) {
    var relativeX = ev.pageX - getOffset(elem).left;
    var relativeY = ev.pageY - getOffset(elem).top;
    // Clone element
    var newElem = elem.cloneNode(true);
    newElem.classList.remove('paletteBlock');
    // Store the object of the element which needs to be moved
    var wrapper = document.createElement("ul");
    wrapper.classList.add('draggy');
    SCRIPTING_AREA.insertBefore(wrapper, SCRIPTING_AREA.firstChild);
    selected = newElem;
    //var curX = getOffset(elem).left;
    //var curY = getOffset(elem).top;
    var curX = ev.pageX - getOffset(SCRIPTING_AREA).left,
        curY = ev.pageY - getOffset(SCRIPTING_AREA).top;
    wrapper.appendChild(newElem);
    wrapper.style.left = curX - relativeX + 'px';
    wrapper.style.top = curY - relativeY + 'px';
    selected = wrapper;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX + SCRIPTING_AREA.scrollLeft;
    y_pos = document.all ? window.event.clientY : e.pageY + SCRIPTING_AREA.scrollTop;
    if (selected !== null) {
        $(SNAP_CLASSES).each(function(item) {
            if (item.classList.contains('drop-area')) {
                item.classList.remove('drop-area');
            }
        });
        var el = closestElem(
            $(SNAP_CLASSES),
            {
                y: getOffset(selected).top,
                x: getOffset(selected).left
            },
            selected
        )
        if (el !== null && !el.classList.contains('paletteBlock') && !parentHasClass(el, 'paletteBlock')) {
            el.classList.add('drop-area');
        }
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}

// Destroy the object when we are done
function _destroy(ev) {
    $(SNAP_CLASSES).each(function(item) {
       if (item.classList.contains('drop-area')) {
           item.classList.remove('drop-area');
       }
    });
    var topEl = null;
    if (selected !== null) {
        topEl = closestElem(
            $(SNAP_CLASSES),
            {
                y: getOffset(selected).top,
                x: getOffset(selected).left
            },
            selected
        );
    }
    if (topEl !== null && !topEl.classList.contains('paletteBlock') && !parentHasClass(topEl, 'paletteBlock')) {
        for(var i = selected.children.length - 1; i >= 0; i--) {
            // for ome reason for/in desn't work here;
            var elem = selected.children[i];
            if (topEl.classList.contains('stack') || topEl.classList.contains('hat')) {
                elem.removeAttribute('style');
                topEl.parentNode.insertBefore(elem, topEl.nextElementSibling);   
            } else if (topEl.classList.contains('c-header')) {
                elem.removeAttribute('style');
                topEl.nextElementSibling.insertBefore(elem, topEl.nextElementSibling.firstElementChild);
            } else if (topEl.classList.contains('c-footer')) {
                elem.removeAttribute('style');
                topEl.parentNode.parentNode.insertBefore(elem, topEl.parentNode.nextElementSibling);
            }
        }
        selected.parentNode.removeChild(selected);
    } else {
        if (selected !== null) {
            if (ev.pageY - getOffset(SCRIPTING_AREA).top < 0) {
                selected.style.top = 0;
            }
            if (ev.pageX - getOffset(SCRIPTING_AREA).left < 0) {
                selected.style.left = 0;
            }
        }
    }
    selected = null;
}

//http://jsfiddle.net/tovic/Xcb8d/light/

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

// function draggy(e) {
//     $(e).on('mousedown', function(ev) {
//         if (ev.target.className =='script-input') {
//             ev.stopPropagation();
//             return;
//         }
//         _drag_init(this, ev);
//         ev.stopPropagation();
//         setZebra();
//         return false;
//     });
    
//     // $(e).on('mousemove', _move_elem);
// }

var SNAP_CLASSES = '.stack, .c-header, .c-footer, .hat';
var MIN_DISTANCE = 50;
var SCRIPTING_AREA = $('.scriptingArea')[0];
var BLOCK_PALETTE = $('.blockArea')[0];

var DRAGGABLE_ELEMENTS = ([
    '.c-wrapper',
    '.stack',
]).map(function(item) {
    return '.scriptingArea ' + item;
}).join(', ');

var C_ELEMENTS = ([
    '.c-header',
    '.c-content',
    '.c-footer'
]).map(function(item) {
    return '.scriptingArea ' + item;
}).join(', ');

var DRAGGABLE_PALETTE_ELEMENTS = ([
    '.c-wrapper',
    '.stack',
]).map(function(item) {
    return '.blockArea ' + item;
}).join(', ');

var C_PALETTE_ELEMENTS = ([
    '.c-header',
    '.c-content',
    '.c-footer'
]).map(function(item) {
    return '.blockArea ' + item;
}).join(', ');

BLOCK_PALETTE.addEventListener('mousedown', function(ev) {
    if (ev.target.className =='script-input') {
        ev.stopPropagation();
        return;
    }
    if (ev.target.matches(DRAGGABLE_PALETTE_ELEMENTS)) {
        _palette_drag_init(ev.target, ev);  // DO A NEW DRAG_INIT FOR PALETTE DRAGGING
        ev.stopPropagation();
        setZebra();
    } else if (ev.target.matches(C_PALETTE_ELEMENTS)) {
        _palette_drag_init(ev.target.parentElement, ev);  // DO A NEW DRAG_INIT FOR PALETTE DRAGGING
        ev.stopPropagation();
        setZebra();
    }
});

SCRIPTING_AREA.addEventListener('mousedown', function(ev) {
    if (ev.target.className =='script-input') {
        ev.stopPropagation();
        return;
    }
    if (ev.target.matches(DRAGGABLE_ELEMENTS)) {
        _drag_init(ev.target, ev);
        ev.stopPropagation();
        setZebra();
    } else if (ev.target.matches(C_ELEMENTS)) {
        _drag_init(ev.target.parentElement, ev);
        ev.stopPropagation();
        setZebra();
    }
});

// draggy('.c-wrapper');
// draggy('.stack');
$('body').on('mousemove', _move_elem);
$('body').on('mouseup', function(ev) {
    _destroy(ev);
    setZebra();
});
setZebra();

// zebra stuff


function zebra(parent, nestcount) {
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
        if(children[i].className.indexOf('c-wrapper') != -1) {
            children[i].classList.remove('zebra')
            if((nestcount % 2) == 1) {children[i].classList.add('zebra');}
            zebra(children[i].children[1], nestcount + 1);
        }
    }
}

function setZebra() {
    for(i = 0; i < document.querySelectorAll('.script, .draggy').length; i++) {
        zebra(document.querySelectorAll('.script, .draggy')[i], 0);
    }
}