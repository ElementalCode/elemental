var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

var SNAP_CLASSES = '.stack, .c-header, .c-footer, .hat';

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
        if (initial != item && !isDescendant(initial, item) && (minDistance === undefined || distance < minDistance)) {
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

// Will be called when user starts dragging an element
function _drag_init(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
    var curX = getOffset(elem).left;
    var curY = getOffset(elem).top;
    elem.parentElement.removeChild(elem);
    document.body.insertBefore(elem, document.body.firstChild);
    elem.style.position = 'absolute';
    elem.style.left = curX + 'px';
    elem.style['z-index'] = 9999;
    if (elem.className == 'stack') {
        elem.style.top =  curY + 'px';
    } else {
        elem.style.top =  curY - 30 + 'px';
    }
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
            $(SNAP_CLASSES).each(function(item) {
                if (item.classList.contains('drop-area')) {
                    item.classList.remove('drop-area');
                }
            });
            closestElem(
                $(SNAP_CLASSES),
                {
                    y: getOffset(selected).top,
                    x: getOffset(selected).left
                },
                selected
            ).classList.add('drop-area');
        //}
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}

// Destroy the object when we are done
function _destroy() {
    $(SNAP_CLASSES).each(function(item) {
       if (item.classList.contains('drop-area')) {
           item.classList.remove('drop-area');
       }
    });
    var topEl = closestElem(
        $(SNAP_CLASSES),
        {
            y: getOffset(selected).top,
            x: getOffset(selected).left
        },
        selected
    )
    if (topEl.classList.contains('stack') || topEl.classList.contains('hat')) {
        selected.removeAttribute('style');
        topEl.parentNode.insertBefore(selected, topEl.nextElementSibling);   
    } else if (topEl.classList.contains('c-header')) {
        selected.removeAttribute('style');
        topEl.nextElementSibling.insertBefore(selected, topEl.nextElementSibling.firstElementChild);
    } else if (topEl.classList.contains('c-footer')) {
        selected.removeAttribute('style');
        console.log(topEl.parentNode.nextElementSibling);
        topEl.parentNode.parentNode.insertBefore(selected, topEl.parentNode.nextElementSibling);
    }
    selected.style['z-index'] = 1;
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

function draggy(e) {
    $(e).on('mousedown', function(e) {
        if (e.target.className =='script-input') {
            e.stopPropagation();
            return;
        }
        _drag_init(this);
        e.stopPropagation();
        return false;
    });
    
    $(e).on('mousemove', _move_elem);
}

draggy('.c-wrapper');
draggy('.stack');
$('body').on('mouseup', _destroy);