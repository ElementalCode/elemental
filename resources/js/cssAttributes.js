var CSS_ATTRIBUTE_MENU = document.getElementById('blockAttributeDropdown');
var CSS_ATTRIBUTE_SEARCH = document.getElementById('propSearch');
var CSS_ATTRIBUTE_RESULTS = document.getElementById('attributeResults');

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
    CLICKED_ATTR.textContent = attr;
});