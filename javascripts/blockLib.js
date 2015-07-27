function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var scriptId = "";

var blocks = {};
blocks.scripts = [];
blocks.moving = false;

blocks.createContainer = function() {
    var id = makeid();
    console.log($('#scripting-area').element);
    $('#scripting-area').append('<ul class="script" id="'+id+'"></ul>');
    return id;
};

blocks.dragHandler = function(){
    $('.block').on('mousedown', function(event){

        // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && event.clientX != null ) {
            var doc = document.documentElement, body = document.body;
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0);
        }

        var xOffset = event.clientX - $(this).element.style.left;
        var yOffset = event.clientY - $(this).element.style.top;

        scriptId = blocks.createContainer();
        var elements = $(this).nextAll().element;

        var html = "";
        for (var i = 0; i < elements.length; i++){
            html += elements[i].outerHTML;
            //elements[i].parentElement.removeChild(elements[i]); // WHY DoesSNT this WoRk!
            // TODO: delete elements when moving
        }

        $('#'+scriptId).append(html);
        console.log(html);

        var moveListener = function(event){
            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && event.clientX != null ) {
                var doc = document.documentElement, body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0);
            }

            var x = event.pageX-100;
            var y = event.pageY-20;

            $('#'+scriptId).element.style.top = y+"px";
            $('#'+scriptId).element.style.left = x+"px";
        };

        var mouseupListener = function(event) {
            $(document).element.removeEventListener('mousemove',moveListener);
            blocks.rebind();
        };

        $(document).element.addEventListener('mousemove',moveListener);

        $(document).element.addEventListener('mouseup',mouseupListener);
    });
};

blocks.rebind = function() {
    blocks.dragHandler();
};

