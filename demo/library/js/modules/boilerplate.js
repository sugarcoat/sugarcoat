/**
 * 
 * @module Module Boilerplate
 * @desc Use this to define your module and its dependencies.
 * 
 */
define(

    // Declare any dependencies
    [ 
        'path/to/module-one',
        'path/to/module-two',
        'path/to/module-three'
    ],

    // Pass in our modules as an argument to our factory
    function(
        one,
        two,
        three
    ) {
        
        // Define constructor
        function MyModule( options ) {
            
        }
        
        // Add methods to constructor's prototype
        MyModule.prototype = {
            
            init: function() {
                
                // jQuery DOMContentReady
                $( this.initUI.bind( this ) );
            },
            
            initUI: function() {
                
            }
        }
        
        // Return a function that returns a new instance of the constructor
        return function( options ) {
            
            return new MyModule( options );
        };
    }
);