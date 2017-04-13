var ATTRIBUTE_MENU = document.getElementById('blockAttributeDropdown');
var ATTRIBUTE_SEARCH = document.getElementById('propSearch');
var ATTRIBUTE_RESULTS = document.getElementById('attributeResults');

var CLICKED_ATTR;

// both optional
function Attr(name, value) {
	this.elem = document.createElement('span');
	this.elem.classList.add('attr-holder');
	
	this.name = (name === undefined) ? '\u00A0' : name;
	this.dropdown = document.createElement('span');
	this.dropdown.classList.add('attr-dropdown')
	this.dropdown.appendChild(document.createTextNode(this.name));
	this.elem.appendChild(this.dropdown);
	
	this.elem.appendChild(document.createTextNode('='));
	
	this.value = (value === undefined) ? '' : value;
	this.input = document.createElement('span');
	this.input.classList.add('attr-dropdown')
	this.input.setAttribute('contenteditable', 'true');
	this.input.appendChild(document.createTextNode(this.value));
	this.elem.appendChild(this.input);
	this.input.addEventListener('input', cleanse_contenteditable);
	
	var attr = this;
	this.input.addEventListener('input', function(e) {
		attr.value = attr.input.textContent;
	});
	
	this.dropdown.addEventListener('click', function(e) {
		ATTRIBUTE_MENU.classList.remove('hidden');
		ATTRIBUTE_MENU.style.top = attr.top() + attr.elem.offsetHeight + 'px';
		ATTRIBUTE_MENU.style.left = attr.left() + 'px';
		CLICKED_ATTR = attr;
		
		ATTRIBUTE_SEARCH.focus();
		setTimeout(function() {
			document.body.addEventListener('click', function dropdown_blur(e2) {
				ATTRIBUTE_MENU.classList.add('hidden');
				CLICKED_ATTR = null;
				document.body.removeEventListener('click', dropdown_blur);
				attr.name =  attr.dropdown.textContent;
			});
		}, 0);
	});
	
	this.left = function() {
    var elem = attr.elem;
    var offsetLeft = 0;
    do {
        if ( !isNaN( elem.offsetLeft ) )
        {
            offsetLeft += elem.offsetLeft;
        }
    } while( elem = elem.offsetParent );
    return offsetLeft;
  };
  
  this.top = function() {
    var elem = attr.elem;
    var offsetTop = 0;
    do {
        if ( !isNaN( elem.offsetTop ) )
        {
            offsetTop += elem.offsetTop;
        }
    } while( elem = elem.offsetParent );
    return offsetTop;
  };
	
	this.toStringable = function() {
		return {
			name: attr.name,
			value: attr.value
		};
	}
}

function add_attr(block, name, value) {
		var attr = new Attr(name, value);
		block.header.insertBefore(attr.elem, block.attrControls);
		block.attrs.push(attr);
}
function remove_attr(block) {
		var attrs = block.attr.pop();
		block.header.removeChild(attr.elem);
}

// uses array called attrNames...

function attrSearch(ev) {
	var searchString = ev.target.value;
	var validAttrs = attrNames.filter(function(attr) {
		return attr.indexOf(searchString) > -1;
	});
	var newHtml = [];
	for (var i = 0; i < validAttrs.length; i++) {
		var attrName = validAttrs[i];
		newHtml.push('<li>' + attrName + '</li>');
	}
	newHtml = newHtml.join('');
	ATTRIBUTE_RESULTS.innerHTML = newHtml;
}

ATTRIBUTE_SEARCH.addEventListener('keyup', attrSearch);
ATTRIBUTE_SEARCH.addEventListener('paste', attrSearch);

ATTRIBUTE_RESULTS.addEventListener('click', function(ev) {
	var attr = ev.target.textContent;
	CLICKED_ATTR.dropdown.textContent = attr;
});

// initialize the stuff in the menu
var attrString = '';
for (var i = 0; i < attrNames.length; i++) {
    attrString += '<li>' + attrNames[i] + '</li>';
}
ATTRIBUTE_RESULTS.innerHTML = attrString;
