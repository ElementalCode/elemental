//this actually consists of several intro's because the element has to exist before the intro starts.

function Intro1(){
  var intro1 = introJs();
  
  intro1.setOptions({
    steps: [
      { 
        tooltipClass: "intro-welcome intro-showskip",
        intro: "<b>Tutorial 1: The Basics</b>Welcome to the intro tutorial, where you'll design your first website in Elemental. Let's get started!"
      },
      {
        element: document.querySelector('.e-body'),
        intro: "This is a block. Blocks make up the code for your website. This one is the <code>body</code> block, which will hold the rest of your site. Let's put something inside it!",
        position: "right"
      },
      {
        element: document.querySelector('.paletteOptionWrap[data-num="0"]'),
        tooltipClass: "intro-hidebuttons",
        intro: "Click here to go to the text blocks palette.",
      }
    ]
  });
  intro1.start();
  setOffSet();
  intro1.onbeforechange(function(e) {
    if (e.classList.contains('paletteOptionWrap')) {
      
      introObserve(document.querySelector('.paletteOptionWrap[data-num="0"]'), "click",
                  intro1, document.querySelector('#filteredBlocksArea'), '.e-h1', Intro2);
    }
  });
  
}
function Intro2() {
  var intro2 = introJs(); //one of their issues on gh sai that the element scrolling issues might go away if I use
                          // a target element, but I can't get that to work :( 
  document.querySelector('#filteredBlocksArea').scrollTop = 0; //make soure pallate isn't scrolled
  intro2.setOptions({
    steps: [
      {
        tooltipClass: "intro-hidebuttons",
        element: document.querySelector('#filteredBlocksArea .e-h1'),
        intro: "Click-and-drag this <code>heading</code> block into the <code>body</code> block.",
        position: "right"
      },
      {}
    ]
  });
  intro2.start();
  document.body.classList.add("intro-hideoverlay");
  introObserve(document.querySelector('#filteredBlocksArea .e-h1'), "mousedown",
                false, document.querySelector('.e-body'), '.e-body .e-h1', function() {
                  intro2.exit();
                  document.body.classList.remove("intro-hideoverlay");
                  Intro3();
                });
}
function Intro3() {
  document.querySelector('#filteredBlocksArea .e-text').scrollIntoView(false);
  var intro3 = introJs();
  intro3.setOptions({
    steps: [
      {
        element: document.querySelector('.e-body .e-h1'),
        intro: "Good work, but something's wrong here... there's no text inside the <code>heading</code>! Let's add some.",
        position: "right"
      },
      {
        element: document.querySelector('.scriptingArea .e-h1 .c-quicktext'),
        tooltipClass: "intro-hidebuttons",
        intro: "Click this button to add text to the empty <code>heading</code>.",
        position: "right"
      }
    ]
  });
  intro3.start();
  
  intro3.onafterchange(function(e) {
    if (e.classList.contains('c-quicktext')) {
      //accommodate for IntroJS's lame incompatability with scrolling
      document.querySelector('.introjs-helperLayer').style.top = (document.querySelector('.introjs-helperLayer').style.top.replace("px", "") - document.querySelector('#filteredBlocksArea').scrollTop) + "px";
      document.querySelector('.introjs-tooltipReferenceLayer').style.top = (document.querySelector('.introjs-tooltipReferenceLayer').style.top.replace("px", "") - document.querySelector('#filteredBlocksArea').scrollTop) + "px";
      introObserve(document.querySelector('.scriptingArea .e-text'), "mousedown",
                false, document.querySelector('.e-body'), '.e-body .e-h1 .e-text', function() {
                  intro3.exit();
                  Intro4();
                });
    }
  });
  
}
function Intro4() {
  var intro4 = introJs();
  intro4.setOptions({
    steps: [
      {
        element: document.querySelector('#draggablePreview'),
        intro: "When you make a change to your website, this preview will show you how it looks.",
        position: "right"
      },
      {
        element: document.querySelector('.e-body .e-h1 .e-text'),
        intro: "Go ahead and change the text to \"My Awesome Website\"",
        position: "left"
      },
      {
        tooltipClass: "intro-hidebuttons",
        element: document.querySelector('.rightSide'),
        intro: "Great job! Now see if you can figure out how to add smaller text below the <code>heading</code>.",
        position: "left"
      },
      {
        tooltipClass: "intro-showskip intro-hideNextPrev",
        intro: "Congrats, you're a website-building pro! From here on out, what you do with your website is up to you.",
      }
    ]
  });
  intro4.start();
  
  intro4.onafterchange(function(e) { // hide the buttons for step 2
    if (e.classList.contains('rightSide')) {
      introObserve(false, "",
                  false, document.querySelector('.e-body'), '.e-body .e-h1 + .e-text:last-child', function() { // I am a selectors 1337h4x0r
                    intro4.nextStep();
                  });
    }
  });
}

var startTutorial = Intro1;
