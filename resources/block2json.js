if (!String.prototype.startsWith) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

function findElemTag(element) {
    var classes = element.classList;

    for (var i = 0; i < classes.length; i++) {
        if (classes[i].startsWith("elem-block-tag")) {
            return classes[i].substr(15)
        }
    }
}
