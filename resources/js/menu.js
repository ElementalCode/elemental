// toggle highlighting in menu-item
var toggleHighlight = document.querySelector('#toggleHighlight');
toggleHighlight.addEventListener('click', function(e) {
  if(highlight) {
    highlight = false;
    toggleHighlight.textContent = 'Highlight On';
  } else {
    highlight = true;
    toggleHighlight.textContent = 'Highlight Off';
  }
});
