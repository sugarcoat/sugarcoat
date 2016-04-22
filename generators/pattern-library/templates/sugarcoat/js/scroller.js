// http://jsfiddle.net/mekwall/up4nu/ modified to keep track of two sets fo nav items
// Cache selectors
var lastId, lastId2, topMenu = $('#sugar-nav'),
    // topMenuHeight = 0,
    // topMenuHeight = topMenu.outerHeight() + 15,
    // All list items
    menuItems = topMenu.find('a'),
    primaryItems = topMenu.find('.sugar-nav-item'),
    secondaryItems = topMenu.find('.sugar-nav-subitem'),
    // menuItems = topMenu.find("a"), // for highlighting all sections
    // Anchors corresponding to menu items
    // scrollItems = menuItems.map( function(){
    //   var item = $( $( this ).attr( 'href' ));
    //   if ( item.length ) { return item; }
    // });
    scrollPrimaryItems = primaryItems.map(function() {
        var item = $($(this).attr('href'));
        if (item.length) {
            return item;
        }
    }),
    scrollSecondaryItems = secondaryItems.map(function() {
        var item = $($(this).attr('href'));
        if (item.length) {
            return item;
        }
    });

// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e) {
    var href = $(this).attr('href'),
        offsetTop = href === '#' ? 0 : $(href).offset().top + 1;
    // offsetTop = href === '#' ? 0 : $( href ).offset().top - topMenuHeight + 1;
    
    
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 300);
    e.preventDefault();
});

// Bind to scroll
$(window).scroll(function() {
    // Get container scroll position
    var fromTop = $(this).scrollTop();
    // var fromTop = $( this ).scrollTop() + topMenuHeight;
    // Get id of current scroll item
    var cur = scrollPrimaryItems.map(function() {
        if ($(this).offset().top < fromTop) {

            return this;
        }
    });
    var cur2 = scrollSecondaryItems.map(function() {
        if ($(this).offset().top < fromTop) {
            return this;
        }
    });

    // console.log( cur, cur2 );
    // Get the id of the current element
    cur = cur[cur.length - 1];
    cur2 = cur2[cur2.length - 1];

    // console.log( cur2 );
    var id = cur && cur.length ? cur[0].id : '';
    var id2 = cur2 && cur2.length ? cur2[0].id : '';


    if (lastId !== id) {
        lastId = id;
        // Set/remove active class
        primaryItems.parent().removeClass('active')
            .end()
            .filter('[href="#' + id + '"]')
            .parent().addClass('active');
    }
    if (lastId2 !== id2) {
        lastId2 = id2;
        // Set/remove active class
        secondaryItems.parent().removeClass('active');
        secondaryItems.filter( '[href="#' + id2 + '"]').parent().addClass( 'active' );
        
    }
});
