=======================
Writing custom elements
=======================

Follow the recommendations on X-Tag.org.

* Dependencies as a last resort
* Stay true to DOM conventions wherever possible
* Failing silently is golden
* Don't break reuse

Custom elements are a container for rendering something onto the screen.

Generally custom elements should not be nested. If a custom element must
communicate with another element, events should be used instead. Elements
should only contain the functionality specific to rendering the element and any
other functionality should be factored out into a reusable lib.
