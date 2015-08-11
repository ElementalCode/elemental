/*
If you are not on the teams page, add yourself. Add a bio to the bios array and make an image tag like on line 19 of team.html.
there is too many team members :p
*/

function $(e) {
    if (e.split(' ')[e.split(' ').length - 1][0] == '#') {
        return document.getElementById(e.substr(1, e.length - 1));
    }
    arr = Array.prototype.slice.call(document.querySelectorAll(e));
    arr.forEach = function(callback) {
        for (var i = 0; i < arr.length; i++) {
            callback(arr[i], i);
        }
    };
    arr.each = arr.forEach;
    arr.on = function(event, callback) {
        arr.forEach(function(item) {
            item.addEventListener(event, callback);
        });
    };
    return arr;
}

var bios = {
    'PullJosh': 'PullJosh is an awesome guy. He\'s very good at web design and made the front page.',
    'Firedrake969': 'Firedrake969 pretty much does everything. He did the backend, along with a lot of the block editor.  He\'s bugged by how his logo isn\'t centered perfectly in the circle.  Someone please fix that.  At least his hair isn\'t cut short... because dragons don\'t have hair.',
    'an-OK-squirrel': 'an-OK-squirrel is Nancy Sanchez\'s pet squirrel. He became sentient and spends his time coding (when Nancy is away, of course!) <br /> He\'s not actually that good at anything (or so he thinks), but the team kept him because he\'s a squirrel.',
};

$('.teamIcon').on('click', function(data) {
    $('#memberName').classList.add("fadeout");
    $('#memberBio').classList.add("fadeout");
    window.setTimeout(function() {
        console.log($('#memberName'));
        $('#memberName').innerHTML = data.target.id.substr(5);
        $('#memberBio').innerHTML = bios[data.target.id.substr(5)];
        $('#memberName').classList.remove("fadeout");
        $('#memberBio').classList.remove("fadeout");
    }, 1000);
});
