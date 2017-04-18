// both inputs are optional
function BlockAttribute(name, value) {
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
	this.input.addEventListener('input', attr.on_input = function(e) {
		attr.value = attr.input.textContent;
	});
	
	attachAttrSearch(attr.dropdown, htmlAttrNames, function(value) {
		attr.name =  attr.dropdown.textContent = value;
	})
	
	this.toStringable = function() {
		return {
			name: attr.name,
			value: attr.value
		};
	}
	
	this.deleteAttr = function() {
		attr.elem.removeEventListener('input', attr.on_input);
		if(attr.elem.parent) attr.elem.parent.removeChild(attr.elem);
	}
}

function attachAttrSearch(elem, attrNames, callback) {
	var ATTRIBUTE_MENU = document.getElementById('blockAttributeDropdown');
	var ATTRIBUTE_SEARCH = document.getElementById('propSearch');
	var ATTRIBUTE_RESULTS = document.getElementById('attributeResults');
	
	elem.addEventListener('click', function(e) {
		ATTRIBUTE_MENU.classList.remove('hidden');
		ATTRIBUTE_MENU.style.top = getOffset(e.target).bottom + 'px';
		ATTRIBUTE_MENU.style.left = getOffset(e.target).left + 'px';
		
		ATTRIBUTE_SEARCH.focus();
		
		setTimeout(function() { // if the listener is added immediately it fires immediately
			document.body.addEventListener('click', function(ev) {
				if(ev.target.matches('.attrResult')) callback(ev.target.textContent);
				
				ATTRIBUTE_MENU.classList.add('hidden');
				ATTRIBUTE_SEARCH.removeEventListener('keyup', attrSearch);
				ATTRIBUTE_SEARCH.removeEventListener('paste', attrSearch);
			}, {once: true});
		}, 0)
		
		function attrSearch(ev) {
			var searchString = (ev ? ev.target.value : '');
			var validAttrs = attrNames.filter(function(attr) {
				return attr.indexOf(searchString) > -1;
			});
			var newHtml = [];
			for (var i = 0; i < validAttrs.length; i++) {
				var attrName = validAttrs[i];
				newHtml.push('<li class="attrResult">' + attrName + '</li>');
			}
			newHtml = newHtml.join('');
			ATTRIBUTE_RESULTS.innerHTML = newHtml;
		}

		ATTRIBUTE_SEARCH.addEventListener('keyup', attrSearch);
		ATTRIBUTE_SEARCH.addEventListener('paste', attrSearch);
		attrSearch() // initialize list
	});
}

var htmlAttrNames = [
    'class',
    'for',
    'form',
    'href',
    'id',
    'rel',
    'src',
    'style',
    'type'
]; //add attrs
var cssAttrNames = [
    'background-color',
    'height',
    'width'
]; //add attrs
