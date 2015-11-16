module.exports = {

    isEqual: function( value1, value2, options ) {

        if ( arguments.length < 3 ) {

            log.error( 'Handlebars Helper EQUAL needs two parameters' );
        }

        if ( value1 !== value2 ) {
            return options.inverse( this );
        }
        else {
            return options.fn( this );
        }
    },

    notEqual: function( value1, value2, options ) {

        if ( arguments.length < 3 ) {

            log.error( 'Handlebars Helper EQUAL needs two parameters' );
        }

        if ( value1 === value2 ) {
            return options.inverse( this );
        }
        else {
            return options.fn( this );
        }
    },

    toID: function( str, index, context ) {

        context = context === undefined ? index : context;

        index = isNaN( index ) ? '' : '-' + index;

        return 'sugar-' + str.replace( /\s|\/|\./g, '-' ).toLowerCase() + index;
    }
}