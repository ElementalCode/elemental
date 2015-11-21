<newsfeed>
    <div>
        <div each={ entries }>
            <a href={ href } target="_blank">{ title }</a>
        </div>
    </div>
    <script>
        function decodeHtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        }

        var request = axios.get('https://elementalcode.github.io/blog/feed.xml')
            .then(function(data) {
                this.entries = xml2json(new DOMParser().parseFromString(data.data, 'text/xml'))
                    .feed.entry
                    .slice(0, 5) // get latest five blog posts
                    .map(function(item) { // get only the relevant info
                        return {
                            title: decodeHtml(item.title['#text']),
                            href: item.link['@attributes'].href
                        };
                    });
                this.update();
            }.bind(this))
            .catch(function(error) {
                console.log(error);
            });
    </script>
</newsfeed>