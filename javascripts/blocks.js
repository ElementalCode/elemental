function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

$(function() {
    bindEvents();
});

var active = false;
var dropElement = false;

function bindEvents() {
    $('.block').on('mousedown', function(event) {
        if (active == false && $(this).hasClass("end") == false) {
            active = true;

            var thisBlock = this;
            console.log(thisBlock);

            var xOffset = event.pageX - $(this).closest('.script').offset().left;
            var yOffset = event.pageY - $(this).closest('.script').offset().top - 50;
            console.log(xOffset + " : " + yOffset);

            var x = event.pageX - xOffset;
            var y = event.pageY + yOffset;

            var id = makeid();
            var html = "";
            html = html + '<ul class="script" id="' + id + '" unselectable="on" style="left:' + x + 'px; top:' + y + 'px; ">';
            $(this).nextAll().addBack().each(function() {
                html = html + $(this)[0].outerHTML;
            });
            html = html + '</ul>';
            $('.scripting-area').append(html);
            bindEvents();
            $(this).nextAll().addBack().each(function() {
                $(this).remove();
            });

            $(document).on("mousemove", function(event) {
                //console.log( "pageX: " + event.pageX + ", pageY: " + event.pageY );
                $('#' + id).css("left", event.pageX - xOffset + "px").css("top", event.pageY + yOffset + "px");

                $('.block').each(function(i, e) {
                    if ($('#' + id).offset().top > $(e).offset().top) {
                        if ($('#' + id).offset().top < $(e).offset().top + $(e).height()) {
                            if ($('#' + id).offset().left < $(e).offset().left + $(e).width()) {
                                if ($('#' + id).offset().left > $(e).offset().left) {
                                    $(e).addClass('snap');
                                    defSnapBlock(e, id);

                                } else {
                                    $(e).removeClass('snap');
                                }
                            } else {
                                $(e).removeClass('snap');
                            }
                        } else {
                            $(e).removeClass('snap');
                        }
                    } else {
                        $(e).removeClass('snap');
                    }
                });
            });

        }
    });
    $(document).unbind('mouseup').bind('mouseup', function(event) {
        if (active == true) {
            active = false;
            $(document).unbind("mousemove");
        }
    });
}

function defSnapBlock(element, id) {
    $(document).unbind('mouseup').bind('mouseup', function(event) {
        if (active == true) {
            active = false;
            if (element != undefined) {
                if ($(element).hasClass("c")&&!$(element).hasClass("end")) {
                    $(element).next().first().prepend($('#' + id).html());
                    $(element).removeClass('snap');
                    $('#' + id).remove();
                } else {
                    $(element).after($('#' + id).html());
                    $(element).removeClass('snap');
                    $('#' + id).remove();
                }
            }

            $(document).unbind("mousemove");
            bindEvents();
        }
    });
}