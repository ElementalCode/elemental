var ATTRIBUTE_MENU = document.getElementById('blockAttributeDropdown');
var ATTRIBUTE_SEARCH = document.getElementById('propSearch');
var ATTRIBUTE_RESULTS = document.getElementById('attributeResults');

var CLICKED_ATTR;

SCRIPTING_AREA.addEventListener('click', function(ev) {
	var el = ev.target;
    
    // Check if click was on rightward arrow
	if (ev.target.classList.contains('add-attr')) {
        
        // If so, add an attribute block
		var newAttrString = [
			'<span class="attr-holder">',
				'<span class="attr-dropdown">&nbsp;</span>',
				'=',
				'<span class="attr-input" contenteditable="true"></span>',
			'</span>'
		].join('');
		var newAttr = stringToHtml(newAttrString);
		el.parentNode.parentNode.insertBefore(newAttr, el.parentNode);
        
    // Check if click was on the leftward arrow
	} else if (ev.target.classList.contains('remove-attr')) {
        
        // If so, remove the last attribute block
		var prev = el.parentNode.previousElementSibling;
		if (prev) {
			prev.parentNode.removeChild(prev);
		}
	}

    // Check if click was on the first input of an attribute block
	if (ev.target.classList.contains('attr-dropdown')) {
        
        // If so, display the searchable dropdown used for attributes
		ATTRIBUTE_MENU.classList.remove('hidden');
        
        // Position dropdown based on input location
		ATTRIBUTE_MENU.style.top = getOffset(el).top + el.offsetHeight + 'px';
        ATTRIBUTE_MENU.style.left = getOffset(el).left + 'px';
        CLICKED_ATTR = ev.target;
        
        ATTRIBUTE_SEARCH.focus(); // Give focus to search input so user can type without clicking
	} else {
        
        // If click was not in one of the previously specified places, hide the dropdown (won't do anything if it was already hidden)
		ATTRIBUTE_MENU.classList.add('hidden');
		CLICKED_ATTR = null;
	}
});

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
	CLICKED_ATTR.textContent = attr;
});

// initialize the stuff in the menu
var attrString = '';
for (var i = 0; i < attrNames.length; i++) {
    attrString += '<li>' + attrNames[i] + '</li>';
}
ATTRIBUTE_RESULTS.innerHTML = attrString;