// http://jsfiddle.net/mekwall/up4nu/ modified to keep track of two sets fo nav items
// http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation javascript scroll to function
// Cache selectors
var lastId
    , lastId2
    , scrollTimeout
    , nav = document.querySelector( '.sugar-nav' )
    , primaryItems = document.querySelectorAll( '.sugar-nav-item' )
    , secondaryItems = document.querySelectorAll( '.sugar-nav-subitem' )
    , navToggle = document.querySelector( '.sugar-nav-toggle' )
    , isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    ;

/**
 * 
 * Helper Functions
 *
 */
// grab all href values from an obj array
function getHrefValues( obj ) {

    var hrefArray = [];

    for ( var i = 0; i < obj.length; i++ ) {
        
        var href = obj[ i ].getAttribute( 'href' );
        
        hrefArray[ i ] = document.querySelectorAll( href )[ 0 ];
    }

    return hrefArray;
}

// recursive function to animate scroll position. 
function scrollToEl(elem, pos) {
    
    var y = elem.scrollTop;
    
    y += Math.round( ( pos - y ) * 0.3 );
    
    if ( Math.abs( y - pos ) < 2 ) {
        
        elem.scrollTop = pos;
        return;
    }
    
    elem.scrollTop = y;
    scrollTimeout = setTimeout( scrollToEl, 40, elem, pos );
}

// find item to scroll to, and change its active class
function changeActiveItem( items, scrollItems, last, isPrimary ) {
    
    var current = 0;
    
    for ( var j = 0; j < scrollItems.length; j++ ) {
        
        var offset = scrollItems[ j ].getBoundingClientRect().top - 5;        
        
        if ( offset < 0 ) {

            current = j;
        }
        else {
            
            break;
        }
    }
    if ( last !== current ) {
        
        if ( items[ last ]) {
            
            items[ last ].classList.remove( 'active' );
        }
        items[ current ].classList.add( 'active' );
        
        // need to change global variable tracking the Id
        if ( isPrimary ) {
            lastId = current;
        }
        else {
            lastId2 = current;
        }
    }
}

var primaryScrollItems = getHrefValues( primaryItems );
var secondaryScrollItems = getHrefValues( secondaryItems );


/**
 * 
 * Events
 *
 */
nav.addEventListener( 'click', function( e ) {
    
    if ( e.target.tagName === 'A' ) {
        
        e.preventDefault();
        // kill previous click scrolling
        clearTimeout( scrollTimeout );
        
        var href = e.target.getAttribute( 'href' );
        var element = document.querySelector( href );
        
        // document.body is deprecated in ff
        var body = isFirefox ? document.documentElement : document.body;
        
        scrollToEl( body, element.offsetTop );
    }
});

// scroll event to track active element on the page
window.addEventListener( 'scroll', function( e ) {
    
    changeActiveItem( primaryItems, primaryScrollItems, lastId, true );
    changeActiveItem( secondaryItems, secondaryScrollItems, lastId2, false );
});

// toggle function for mobile viewport
navToggle.addEventListener( 'click', function( e ) {
    
    var classList = document.body.classList;
    
    if ( classList.contains( 'sugar-nav-open' )) {
        
        classList.remove( 'sugar-nav-open' );
    }
    else {
        classList.add( 'sugar-nav-open' );
    }
});