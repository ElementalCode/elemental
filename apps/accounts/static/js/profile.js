// ABOUT ME/WIWO STUFF
var aboutMe = document.getElementById('aboutme');
var wiwo = document.getElementById('workingon');

function editProfileText(mode) {
    var request;
    var reqstr = '/rest/users/user/' + USERID;
    var config = {
        headers: {
            "X-CSRFToken": CSRF_TOKEN
        }
    };
    if (mode == 'About Me') {
        request = axios.patch(reqstr, {
            about_me: aboutMe.textContent
        }, config);
    } else if (mode == 'What I\'m Working On') {
        request = axios.patch(reqstr, {
            working_on: wiwo.textContent
        }, config);
    }
    if (request) {
        request.then(function(data) {
            console.log(data);
        }).catch(function(err) {
            console.log(err);
        });
    }
}

aboutMe.addEventListener('blur', function() {
    editProfileText('About Me');
});

wiwo.addEventListener('blur', function() {
    editProfileText('What I\'m Working On');
});


// LAYOUT STUFF
var FavoritesCount = 1;
var FollowingCount = 1;
var FollowersCount = 1;

function get_first(name) { return document.getElementsByClassName(name)[0]; }

function set_width(object, count, emptymessage, imgsize) {
    if (count > 4) {
        object.style.width = ((imgsize + 18) * count) + "px";
    } else if (count > 0) {
        object.style.width = "710px";
    } else {
        object.parentNode.innerHTML = "<div style='background-color:#C7E1D9;width:700px;height:100px;padding-top:50px;margin:auto;margin-top:20px;border-radius:20px;text-align:center;'>" + emptymessage.replace('%user', USERNAME) + "</div>";
    }
}

var project_carousel = get_first("userpage-shared-section-carousel");
var favorite_carousel = get_first("userpage-favorite-section-carousel");
var following_carousel = get_first("userpage-following-section-carousel");
var followers_carousel = get_first("userpage-followers-section-carousel");

set_width(project_carousel, ProjectsCount, "%user has not shared any creations yet.", 160)
set_width(favorite_carousel, FavoritesCount, "%user has not favorited any creations yet.", 160)
set_width(following_carousel, FollowingCount, "%user is not following anyone yet.", 120)
set_width(followers_carousel, FollowersCount, "Nobody is following %user yet.", 120)