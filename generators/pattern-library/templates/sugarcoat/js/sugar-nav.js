// http://jsfiddle.net/mekwall/up4nu/ modified to keep track of two sets fo nav items
// http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation javascript scroll to function
// Cache selectors
var lastId
    , lastId2
    , nav = document.querySelector( '.sugar-nav' )
    , primaryItems = document.querySelectorAll( '.sugar-nav-item' )
    , secondaryItems = document.querySelectorAll( '.sugar-nav-subitem' )
    , navToggle = document.querySelector( '.sugar-nav-toggle' )
    , scrollTimeout
    ;

function getHrefValues( obj ) {

    var hrefArray = [];

    for ( var i = 0; i < obj.length; i++ ) {
        
        var href = obj[ i ].getAttribute( 'href' );
        
        hrefArray[ i ] = document.querySelectorAll( href )[ 0 ];
    }

    return hrefArray;
}

function scrollToEl(elem, pos)
{
    var y = elem.scrollTop;
    
    y += Math.round( ( pos - y ) * 0.3 );
    
    if ( Math.abs( y - pos ) < 2 ) {
        
        elem.scrollTop = pos;
        return;
    }
    elem.scrollTop = y;
    
    scrollTimeout = setTimeout( scrollToEl, 40, elem, pos );
}


var primaryScrollItems = getHrefValues( primaryItems );
var secondaryScrollItems = getHrefValues( secondaryItems );

nav.addEventListener( 'click', function( e ) {
    
    if ( e.target.tagName === 'A' ) {
        
        e.preventDefault();
        clearTimeout( scrollTimeout );
        
        var href = e.target.getAttribute( 'href' );
        var element = document.querySelector( href );
        
        scrollToEl( document.body, element.offsetTop );
    }
});

window.addEventListener( 'scroll', function( e ) {
    
    var currentPrimary = 0
        , currentSecondary = 0
        ;
    
    for ( var j = 0; j < primaryScrollItems.length; j++ ) {
        
        var primaryOffset = primaryScrollItems[ j ].getBoundingClientRect().top - 5;        
        
        if ( primaryOffset < 0 ) {

            currentPrimary = j;

        }
        else {
            break;
        }
    }
    for ( var k = 0; k < secondaryScrollItems.length; k++ ) {

        var secondaryOffset = secondaryScrollItems[ k ].getBoundingClientRect().top - 5;        
        
        if ( secondaryOffset < 0 ) {

            currentSecondary = k;
        }
        else {
            break;
        }
    }
    
    if ( lastId !== currentPrimary ) {
        
        if ( primaryItems[ lastId ]) {
            
            primaryItems[ lastId ].classList.remove( 'active' );
        }
        primaryItems[ currentPrimary ].classList.add( 'active' );
        
        lastId = currentPrimary;
    }
    if ( lastId2 !== currentSecondary ) {
        
        if ( secondaryItems[ lastId2 ]) {
            
            secondaryItems[ lastId2 ].classList.remove( 'active' );
        }
        secondaryItems[ currentSecondary ].classList.add( 'active' );
        
        lastId2 = currentSecondary;
    }
});

navToggle.addEventListener( 'click', function( e ) {
    
    var classList = document.body.classList;
    
    if ( classList.contains( 'sugar-nav-open' )) {
        
        classList.remove( 'sugar-nav-open' );
    }
    else {
        classList.add( 'sugar-nav-open' );
    }
});