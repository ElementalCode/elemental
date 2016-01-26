decodeHTML = function(str) {
    var map = {"gt":">" /* , … */};
    return str.replace('&amp;','&').replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
};

document.addEventListener("DOMContentLoaded", function(event) {
	axios.get('https://elementalcode.github.io/blog/feed.xml').then(function(data) 
		{
			var parser = new DOMParser();
			var newsFeed = parser.parseFromString(data.data,"text/xml");
			var posts = newsFeed.getElementsByTagName('entry');
			posts_meta = [];
			for (x in posts) {
				if ((x > 4) || (typeof(posts[x]) !== "object")) {
					break;
				}
				var post = document.createElement('div');
				post.className = 'news-post push-tiny--right';
				if (x == 0) {
					post.className = post.className + ' first-news-post'
				} 
				var title = document.createElement('a');
				title.href = posts[x].getElementsByTagName('id')[0].innerHTML
				title.innerHTML = decodeHTML(posts[x].getElementsByTagName('title')[0].innerHTML);
				var desc = document.createElement('div');
				var text = document.createElement('span');
				text.className = 'smalltext';
				text.innerHTML = decodeHTML(posts[x].getElementsByTagName('summary')[0].innerHTML);
				desc.appendChild(text);
				post.appendChild(title);
				post.appendChild(desc)
			document.getElementsByTagName('newsfeed')[0].appendChild(post)
			}
		}
	)	
});