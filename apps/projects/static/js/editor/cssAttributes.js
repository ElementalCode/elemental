var CSS_ATTRIBUTE_MENU = document.getElementById('cssAttributeDropdown');
var CSS_ATTRIBUTE_SEARCH = document.getElementById('cssPropSearch');
var CSS_ATTRIBUTE_RESULTS = document.getElementById('cssAttributeResults');

var CSS_CLICKED_ATTR;

SCRIPTING_AREA.addEventListener('click', function(ev) {
    var el = ev.target;

    // Check if click was on the first input of an attribute
    if (ev.target.classList.contains('css-attr-dropdown')) {
        
        // If so, display the searchable dropdown used for attributes
        CSS_ATTRIBUTE_MENU.classList.remove('hidden');
        
        // Position dropdown based on input location
        CSS_ATTRIBUTE_MENU.style.top = getOffset(el).top + el.offsetHeight + 'px';
        CSS_ATTRIBUTE_MENU.style.left = getOffset(el).left + 'px';
        CSS_CLICKED_ATTR = ev.target;
        
        ATTRIBUTE_SEARCH.focus(); // Give focus to search input so user can type without clicking
    } else {
        
        // If click was not in one of the previously specified places, hide the dropdown (won't do anything if it was already hidden)
        CSS_ATTRIBUTE_MENU.classList.add('hidden');
        CSS_CLICKED_ATTR = null;
    }
});

// uses array called cssAttrNames...

function attrSearch(ev) {
    var searchString = ev.target.value;
    var validAttrs = cssAttrNames.filter(function(attr) {
        return attr.indexOf(searchString) > -1;
    });
    var newHtml = [];
    for (var i = 0; i < validAttrs.length; i++) {
        var attrName = validAttrs[i];
        newHtml.push('<li>' + attrName + '</li>');
    }
    newHtml = newHtml.join('');
    CSS_ATTRIBUTE_RESULTS.innerHTML = newHtml;
}

CSS_ATTRIBUTE_SEARCH.addEventListener('keyup', attrSearch);
CSS_ATTRIBUTE_SEARCH.addEventListener('paste', attrSearch);

CSS_ATTRIBUTE_RESULTS.addEventListener('click', function(ev) {
    var attr = ev.target.textContent;
    CSS_CLICKED_ATTR.textContent = attr;
});

// initialize the stuff in the menu
var cssAttrString = '';
for (var i = 0; i < cssAttrNames.length; i++) {
    cssAttrString += '<li>' + cssAttrNames[i] + '</li>';
}
CSS_ATTRIBUTE_RESULTS.innerHTML = cssAttrString;