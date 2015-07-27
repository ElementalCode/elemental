/* Because I'm not allowed to use jQuery, I needed to write some helpful functions to make me happy :) */
var lib = {};
lib.element = undefined;

lib.on = function(event,cb) {
    if (!this.element.hasOwnProperty('addEventListener')) {
        for (var i = 0; i < lib.element.length; i++) {
            this.element[i].addEventListener(event, cb);
        }
    }else{
        this.element.addEventListener(event, cb);
    }
};

lib.hasClass = function(cls) {
    return (' ' + this.element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

/* Get the next sibling */
lib.next = function() {
    var query = this;
    query.element = this.element.nextSibling;
    return query;
};

lib.nextAll = function() {
    console.log(typeof this.element);
    var result = [];
    var sib = this.element;
    while (sib) {
        result.push(sib);
        console.log(sib);
        sib = sib.nextElementSibling;
    }
    console.log(result);
    var query = this;
    query.element = result;
    return query;
};

lib.append = function(string) {
    this.element.innerHTML += string;
    return this;
};

lib.prepend = function(string) {
    this.element.innerHTML = string + this.element.innerHTML;
    return this;
};

lib.width = function() {
    return this.element.offsetWidth;
};

lib.height = function() {
    return this.element.offsetHeight;
};

/* Called function */
function $(id) {
    var query = lib;
    if (typeof id == 'object' && id != null){
        query.element = id;
        return query;
    }else if (id.charAt(0) == "#") {
        query.element = document.getElementById(id.replace('#', ''));
        return query;
    } else if (id.charAt(0) == ".") {
        query.element = document.getElementsByClassName(id.replace('.', ''));
        return query;
    }
}