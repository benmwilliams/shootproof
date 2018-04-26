# shootproof

Code for the recruiting exercise @ https://github.com/ShootProof/recruiting-front-end

[codepen here](https://codepen.io/williasm/pen/OZXrwV)

### Notes

there are now some differences between this code and the code on the pen. Handling the dropdown with pure DOM manipulation, basically trying to manage state with jQuery, but without jQuery, got too weird. Instead, I set up a model of the UI in an array, and it makes the dropdown mechanics much more managable, and data-driven. Unfortunately, a substantial logic error showed itself, either in the building of the model, but more likely in the way I'm initially sorting the data that is scrambling up which nodes have "children" (technically DOM siblings).

#### TODO:

extend color change animation to "un-hover"
