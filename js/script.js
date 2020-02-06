//
// Initializing viewport list
//
const viewportClass = ".viewport";
const viewportID = "viewport";
var viewportList = [];
var mostVisible = "undefined";
var mostVisiblePrec = "undefined";

$(viewportClass).each(function (i, obj) {
    var id = viewportID + i;
    viewportList.push(id);
    $(this).attr('id', id);
});

var currentViewportPos = 0;

var currentViewport = viewportList[0];
var targetViewport = viewportList[0];

viewport = {
    targetInternal: viewportList[0],
    targetListener: function(val) {},
    set target(val) {
        this.targetInternal = val;
        this.targetListener(val);
    },
    get target() {
        return this.targetInternal;
    },
    registerListener: function(listener) {
        this.targetListener = listener;
    }
}

viewport.registerListener(function(val) {
    scrollTo(val);
    console.log("New target: " + val);
});

//
// On scroll update
//
checkVisibility();

$(window).scroll(function () {

    checkVisibility();

});

function checkVisibility() {
    var currentVisibility = 0;

    $(viewportClass).each(function (i, obj) {
        var tmp = elementVisibility(viewportClass, "#" + viewportList[i]);

        if (currentVisibility < tmp) {
            currentVisibility = tmp;
            currentViewport = viewportList[i];
            currentViewportPos = i;
        }
    });

    console.log(currentViewport + " is visible!");

    if  (currentViewport !== mostVisiblePrec) {
        viewport.target = ("#" + currentViewport);
    }

    mostVisiblePrec = currentViewport;
}

//
// Helpers
//
function elementVisibility(elementClass, elementId) {

    class Element {
        constructor(top, bottom) {
            this.top = top;
            this.bottom = bottom;
            this.height = bottom - top;
        }
    }

    var element = new Element($(elementClass + elementId).offset().top,
        $(elementClass + elementId).offset().top + $(elementClass + elementId).outerHeight());
    var screen = new Element($(window).scrollTop(), $(window).scrollTop() + $(window).innerHeight());


    if ((element.bottom < screen.top) || (element.top > screen.bottom)) {
        return 0;
    }

    if (element.top <= screen.top) {
        return (1 / screen.height) * (element.bottom - screen.top);
    }

    if (element.bottom <= screen.bottom) {
        return (screen.bottom - element.top)
    } else {
        return (1 / screen.height) * (screen.bottom - element.top);
    }

}

var page = $("html, body");

function scrollTo(id) {

    if (currentViewport !== targetViewport) {

    }

    console.log("scrolling");
    //page.stop();    
    $('html,body').animate({
        scrollTop: $(id).offset().top
    }, 250, function () {
        //page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
    });
}

page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
    //page.stop();
});

var isScrolling = false;
var scrollValuePrec = 0;
var scrollValue = 0;

window.addEventListener("wheel", event => {

    if (scrollValue == 0) {

        if (event.deltaY > 0) {
            // Increase current page
            if (currentViewportPos < viewportList.length - 1) {
                currentViewportPos++;
            }
        } else {
            // Decrease current page
            if (currentViewportPos > 0) {
                currentViewportPos--;
            }
        }
        viewport.target = "#" + viewportList[currentViewportPos];
        scrollValue = event.deltaY;
    }

    scrollValuePrec = event.deltaY;
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
        // Run the callback
        console.log(event.deltaY + ' Scrolling has stopped.');
        scrollValue = 0;
        scrollValuePrec = 0;
    }, 250);
}, false);


var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, { passive: false }); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    document.removeEventListener('wheel', preventDefault, { passive: false }); // Enable scrolling in Chrome
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

document.addEventListener('wheel', preventDefault, { passive: false });

$(".button").click(function() {
    //alert("click on " + $(this).attr("class") + " " + $(this).attr("id"));
    if ($(this).attr("id") === "tech") {
        $(this).addClass("button-selected");
        $(".button#visual").removeClass("button-selected");
        $(".detail-row#tech").show();
        $(".detail-row#visual").hide();
    } else {
        $(this).addClass("button-selected");
        $(".button#tech").removeClass("button-selected");
        $(".detail-row#tech").hide();
        $(".detail-row#visual").show();
    }

})