angular
=======

A handful of handy AngularJS directives, services, and the like

## Directives

### anchorScroll
Performs a smooth page scroll to an anchor on the same page. So smooth.
```html
<a href="#fun-times" anchor-scroll>Jump to fun times</a>
<div id="fun-times">Oh, you got here nice and smooth</div>
```


### infiniteScroll
Loads more items into a list when the user scrolls to the bottom of the window. Because nobody wants to see your site footer.
```html
<div infinite-scroll="loadMore()" infinite-scroll-disabled="isInfiniteScrollDisabled">
	<div ng-repeat="item in items">Howdy</div>
</div>
```


### masonry
Makes the [Masonry](http://masonry.desandro.com/) plugin play nicely with Angular. Hey! You kids play nice!
```html
<div masonry='{ "itemSelector": ".item", "columnWidth": ".item-masonry-sizer" }'>
	<div class="item-masonry-sizer"></div>			
	<div class="item" masonry-brick ng-repeat="item in items">I'm a brick!</div>
</div>
```


### showOnScroll
Shows and hides an element on the page depending on the user's scrolling direction. Useful for shy elements.
```html
<a href="#top" show-on-scroll="{target: '#tiles-container'}">Back to Top</a>
```


### webFontLoader
Loads web fonts from third parties such as Google and Typekit using Typekit's [Web Font Loader](https://github.com/typekit/webfontloader) and broadcasts an event upon success or failure. Take that, Times New Roman!
```html
<body webfont-loader="FancyFontFamily">	
```


### windowResize
Listens for window resizing and broadcasts an event. Useful for responsive components that activate/deactivate based on certain breakpoints. Also useful for resize-happy UI developers.


## Services

### modalService
Creates a modal element on the page. For when you can't figure out a less annoying way to present content to the user.