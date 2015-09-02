var ATTRIBUTE_MENU = document.getElementById('blockAttributeDropdown');

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
		console.log(el.style.height);
		ATTRIBUTE_MENU.style.top = getOffset(el).top + el.offsetHeight + 'px';
        ATTRIBUTE_MENU.style.left = getOffset(el).left + 'px';
	} else {
		ATTRIBUTE_MENU.classList.add('hidden');
	}	
});