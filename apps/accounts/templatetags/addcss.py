from django.template import Library
register = Library()

@register.filter(name='addcss')
def addcss(value, arg):
    value.field.widget.attrs['class'] = arg 
    return value