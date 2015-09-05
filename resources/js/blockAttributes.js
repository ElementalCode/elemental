var ATTRIBUTE_MENU = document.getElementById('blockAttributeDropdown');
var ATTRIBUTE_SEARCH = document.getElementById('propSearch');
var ATTRIBUTE_RESULTS = document.getElementById('attributeResults');

SCRIPTING_AREA.addEventListener('click', function(ev) {
	var el = ev.target;
	if (ev.target.classList.contains('add-attr')) {
		var newAttrString = [
			'<span class="attr-holder">',
				'<span class="attr-dropdown">&nbsp;</span>',
				'=',
				'<span class="attr-input" contenteditable="true"></span>',
			'</span>'
		].join('');
		var newAttr = stringToHtml(newAttrString);
		el.parentNode.parentNode.insertBefore(newAttr, el.parentNode);
	} else if (ev.target.classList.contains('remove-attr')) {
		var prev = el.parentNode.previousElementSibling;
		if (prev) {
			prev.parentNode.removeChild(prev);
		}
	}

	if (ev.target.classList.contains('attr-dropdown')) {
		ATTRIBUTE_MENU.classList.remove('hidden');
		ATTRIBUTE_MENU.style.top = getOffset(el).top + el.offsetHeight + 'px';
        ATTRIBUTE_MENU.style.left = getOffset(el).left + 'px';
	} else {
		ATTRIBUTE_MENU.classList.add('hidden');
	}
});

// uses array called attrNames...

function attrSearch(ev) {
	var searchString = ev.target.value;
	var validAttrs = attrNames.filter(function(attr) {
		return attr.indexOf(searchString) > -1;
	});
	console.log(validAttrs);
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