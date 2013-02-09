==================
Writing formatters
==================

Can take whitespace-delimited args.

“Binding to a subset can also be done with a formatter if it's a generic type
of filter, but if it requires more knowledge of the model that is holding the
collection, it'd probably be nicer as a function on the model (with the source
array as a dependency)”

— https://github.com/mikeric/rivets/issues/56
