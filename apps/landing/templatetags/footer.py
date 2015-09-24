import random

from django import template
register = template.Library()

thingies = [
	";",
	"return 5;", 
	"&lt;div&gt;&lt;font&gt;Elemental: Never be like me again!&lt;/span&gt;;", 
	"<a href='javascript:location.reload()'>please roll again</a>", 
	"I love useless footers", 
	"I'm lonely!", 
	"'); DROP TABLE footers; --", 
	"This footer is the only good thing that ever came out of super-squirrel, but don't tell him that", 
	"how long have you been refreshing the page?",
	"yes, this is completely pointless", 
	"thank mr skeltal", 
	"Good ol' C-x M-c M-butterfly..."
]

@register.simple_tag
def footer():
	return random.choice(thingies)