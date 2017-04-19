//when listenerElement has an eventType event, exit introToExit, then wait until observerElement contains a selectorTest to do callback.
// if listenerElement doesn't exist, just create the observer
// if introToExit doesn't exist, it's up to you to kill the intro
// long-story-short, wait until a block has been dragged into the right spot.
// I use this surprisingly often
function introObserve(listenerElement, eventType, introToExit, observerElement, selectorTest, callback) {
  var listener = function() {
    if(introToExit) {
      introToExit.exit();
    }
    if(listenerElement) {
      listenerElement.removeEventListener(eventType, listener);
    }
    var introObserver = new MutationObserver(function(mutations) {
      while(introToExit && document.querySelector(".introjs-overlay")) { //delete any old intros' overlays
        document.querySelector(".introjs-overlay").remove();
      }
      if (document.querySelector(selectorTest)) {
        introObserver.disconnect(); // if the change is the right change, stop firing.
        callback();
      }
    });
    introObserver.observe(observerElement, {'childList': true, 'subtree': true,});
  }

  if(listenerElement) {
    listenerElement.addEventListener(eventType, listener);
  } else {
    listener();
  }
}

var tutorials = [
  "1: The Basics",
  "2: Attributes"
];

window.addEventListener("load", function() {
  var menuContents = document.querySelector('#tutorialsMenu .menuContents');
  for(let i = 0; i < tutorials.length; i++) {
    let menuItem = document.createElement("li");
    menuItem.innerHTML = tutorials[i];
    menuItem.addEventListener('click', function() {
    	location.search = "?tutorial=" + (i + 1);
      //location.reload();
    });
    menuContents.appendChild(menuItem);
  }
})

//dynamic loader - have to be very careful making sure everything loads/runs in the right order
if(window.location.search.match(/tutorial=\d*/i)) {
  var tutnum = parseInt(window.location.search.match(/tutorial=\d*/i)[0].replace("tutorial=", ""));
  if(tutnum < tutorials.length + 1) {
    document.head.innerHTML += "<link rel=\"stylesheet\" href=\"resources\/css\/intro.css\">";
    var script = document.createElement('script');
    script.src = "resources\/js\/intro.min.js";
    document.head.appendChild(script);
    script.onload = function() {
      var script2 = document.createElement('script');
      script2.src = "resources\/js\/tutorials\/" + tutnum + ".js";
      document.head.appendChild(script2);
      script2.onload = function() {
        if(document.readyState == "complete") {
          startTutorial();
        } else {
          window.addEventListener("load", function() {
            startTutorial();
          });
        }
      }
    }
  } else {
    console.error("Tutorial %s does not exist.", tutnum);
  }
}
// Code to work-around the bug in which all elements are shifted upwards
function setOffSet() {
  var topBar = document.getElementsByClassName("topBar")[0];
  var offset = document.getElementById("offset");
  var helperLayer = document.getElementsByClassName("introjs-helperLayer")[0];
  var check = function() { // Taken from http://stackoverflow.com/a/7557433 and modified
    var rect = topBar.getBoundingClientRect();
    if (rect.top < -1) { // For some reason, rect.top = -1
      offset.style.height = -1 * rect.top;
      offset.style.display = "";
    } else if (rect.top != -1) { // See above
      offset.style.display = "none";
    }
  }
  
  window.setInterval(check, 100);
}
