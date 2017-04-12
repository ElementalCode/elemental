//hijack the file open script so I don't have to walk user through the basics again
fileData = {"index.html":[{"x":0,"y":0,"type":"wrapper","id":1,"inPalette":false,"name":"body","hasAttrs":true,"hasQuickText":true,"unmoveable":true,"scriptInputContent":null,"attrs":[],"children":[{"x":0,"y":0,"type":"nullWrapperContent","id":2,"inPalette":false,"attrs":[],"children":[]},{"x":0,"y":0,"type":"wrapper","id":53,"inPalette":false,"name":"h1","hasAttrs":true,"hasQuickText":true,"unmoveable":false,"scriptInputContent":null,"attrs":[],"children":[{"x":0,"y":0,"type":"nullWrapperContent","id":54,"inPalette":false,"attrs":[],"children":[]},{"x":0,"y":0,"type":"stack","id":56,"inPalette":false,"name":"text","hasAttrs":false,"hasQuickText":false,"unmoveable":false,"scriptInputContent":"My Awesome Website","attrs":[],"children":[]}]},{"x":0,"y":0,"type":"stack","id":52,"inPalette":false,"name":"text","hasAttrs":false,"hasQuickText":false,"unmoveable":false,"scriptInputContent":"breadfish","attrs":[],"children":[]}]}]};
$('.filePane')[0].innerHTML = '<div class="file selected"><div class="file-name" data-file="index.html">index.html</div></div><div class="add-file"><div class="file-name">+</div></div>';
loadFile("index.html");

function Intro1(){
  var intro1 = introJs();

  intro1.setOptions({
    steps: [
      {
      	tooltipClass: "intro-welcome intro-showskip",
        intro: "<b>Tutorial 2: Attributes</b>Your website is looking awesome so far, but it's still all just text! In this tutorial, you'll learn how to add links and images to your site."
      },
      {
        tooltipClass: "intro-hidebuttons",
        element: document.querySelector('#searchBar'),
        intro: "Use this search bar to find the <code>a</code> block.",
        position: "bottom-right-aligned"
      }
    ]
  });
  intro1.start();

  introObserve(document.querySelector('#searchBar'), "click",
  				intro1, document.querySelector('#filteredBlocksArea'), '.e-a:first-child', Intro2);
}
function Intro2() {
	var intro2 = introJs();

  intro2.setOptions({
    steps: [
      {
        tooltipClass: "intro-hidebuttons",
        element: document.querySelector('#filteredBlocksArea .e-a'),
        intro: "That was easy! <code>a</code> blocks are used to make links to other web pages. Drag it to the bottom of the <code>body</code> tag.",
        position: "right"
      }
    ]
  });
  intro2.start();

  introObserve(document.querySelector('#filteredBlocksArea .e-a'), "mousedown",
  				intro2, document.querySelector('.e-body'), '.e-body .e-a:last-child', Intro3);
}
function Intro3() {
  var intro3 = introJs();

  intro3.setOptions({
    steps: [
      {
        tooltipClass: "intro-hidebuttons",
        element: document.querySelector('.rightSide'),
        intro: "Now add some text to it.<br/><i>Hint: you can find the <code>text</code> block by searching \"text\"</i>",
        position: "left"
      },
      {
      	tooltipClass: "intro-hidebuttons",
      	intro: "Now hit this little triangle to add an empty attribute.",
      	element: document.querySelector('.e-body .e-a .add-attr'),
      	position: "top"
      }
    ]
  });
  intro3.start();
  introObserve(false, "", //this time I may be pushing it, I rewrote part of the function to make this work lol
  				false, document.querySelector('.e-body'), '.e-a .e-text', function() {
  					intro3.nextStep();
  				;});
  intro3.onafterchange(function(e) {
    if (e.classList.contains('add-attr')) {
    	introObserve(document.querySelector('.e-body .e-a .add-attr'), "click",
  								intro3, document.querySelector('.e-body .e-a'), '.e-body .e-a .add-attr', Intro4);
    }
  });
}
function Intro4() {
	var intro4 = introJs();

  intro4.setOptions({
    steps: [
      {
      	intro: "Set the <code>href</code> attribute equal to <code>http://google.com</code>",
      	element: document.querySelector('.e-body .e-a .attr-holder'),
      	position: "top"
      },
      {
      	intro: "And there's your link! Now let's add an image.",
      	element: document.querySelector('.pagePreview'),
      	position: "right"
      }, {
      	tooltipClass: "intro-hidebuttons",
      	intro:"Under the link, add an <code>img</code> tag from the media palette.",
      	element: document.querySelector('.rightSide'),
      	position: "left"
      },
    ]
  });
  intro4.start();
  document.body.classList.add("intro-hideoverlay");
  intro4.onafterchange(function(e) {
    if (e.classList.contains('pagePreview')) {
    	document.body.classList.remove("intro-hideoverlay");
    } else if (e.classList.contains('rightSide')) {
    	introObserve(false, "",
    							false, document.querySelector('.e-body'), '.e-body .e-img:last-child', function() {
    								intro4.exit();
    								Intro5();
    							});
    }
  });
}
function Intro5() {
	//prefill img url, using code stolen from blockAttributes.js
	var el = document.querySelector('.e-body .e-img .add-attr')
	var newAttrString = [
			'<span class="attr-holder">',
				'<span class="attr-dropdown">src</span>',
				'=',
				'<span class="attr-input" contenteditable="true">https://33.media.tumblr.com/tumblr_lm7kcfDP2g1qbkjkd.gif</span>',
			'</span>'
		].join('');
		var newAttr = stringToHtml(newAttrString);
		el.parentNode.parentNode.insertBefore(newAttr, el.parentNode);




	var intro5 = introJs();

  intro5.setOptions({
    steps: [
      {
      	intro: "I went ahead and chose an image for you. I set the <code>src</code> attribute equal to its URL.",
      	element: document.querySelector('.e-body .e-img'),
      	position: "left"
      },
      {
      	tooltipClass: "intro-showskip intro-hideNextPrev",
      	intro: "Viola! Your beautiful website now has a link and an image. That's it for this tutorial, see you next time!",
      	element: document.querySelector('.pagePreview'),
      	position: "right"
      },

    ]
  });
  intro5.start();
}

var startTutorial = Intro1;
