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

    $($(this).find(".button")).each(function (j, obj) {
        var btnId = $(this).attr("id");
        $(this).attr("id", id + "-" + btnId);
    });

    $($(this).find(".tab")).each(function (j, obj) {
        var btnId = $(this).attr("id");
        $(this).attr("id", id + "-" + btnId);
    });
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
    scroll_To(val);
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
        //viewport.target = ("#" + currentViewport);
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

function scroll_To(id) {

    if (currentViewport !== targetViewport) {

    }

    console.log("Scrolling to: " + id);
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

    for (var i = 0; i < viewportList.length; i++) {
        if ($(this).attr("id") === viewportList[i] + "-tech") {
            $(this).addClass("button-selected");
            $(".button#" + viewportList[i] + "-visual").removeClass("button-selected");
            $(".tab#" + viewportList[i] + "-tech").show();
            $(".tab#" + viewportList[i] + "-visual").hide();
        } else if ($(this).attr("id") === viewportList[i] + "-visual"){
            $(this).addClass("button-selected");
            $(".button#" + viewportList[i] + "-tech").removeClass("button-selected");
            $(".tab#" + viewportList[i] + "-tech").hide();
            $(".tab#" + viewportList[i] + "-visual").show();
        }
    }

})


// TOUCH HANDLER
document.addEventListener('touchstart', handleTouchStart, false); //bind & fire - evento di inizio tocco
document.addEventListener('touchmove', handleTouchMove, false); // bind & fire - evento di movimento durante il tocco
var xDown = null;
var yDown = null;
function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

var initialY = 0;
var currentY = 0;
var distance = 0;

function handleTouchMove(evt) {


    var scrollPos = document.documentElement.scrollTop;
    console.log(scrollPos);
    
    distance = initialY - currentY;
    currentY = evt.touches[0].clientY;
    window.scrollTo(0, 10000 + distance);

    if (!xDown || !yDown) {
        return;
    } //nessun movimento

    initialY = evt.touches[0].clientY;

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);


    //window.scrollTo(top, left);


    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*Trovo quello più significativo sulle assi X e Y*/
        if (xDiff > 0) {
            /* swipe sinistra */
            console.log("Swipe sx");
        } else {
            /* swipe destra */
            console.log("Swipe dx");
        }//right
    } else {
        if (yDiff > 0) {
            /* swipe alto */
            console.log("Swipe UP");
            if (currentViewportPos < viewportList.length - 1) {
                currentViewportPos++;
            }
            
            //viewport.target = "#" + viewportList[currentViewportPos]
            //scroll_to(_sections[currentSection]);
        } else {
            /* swipe basso */
            console.log("Swipe DOWN");
            if (currentViewportPos > 0) {
                currentViewportPos--;
            }
            
            //viewport.target = "#" + viewportList[currentViewportPos];
            //scroll_to(_sections[currentSection]);
        }

        
    }
    /* reset values */
    xDown = null;
    yDown = null;
};
