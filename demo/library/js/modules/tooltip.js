/**
 * 
 * @module tooltip
 * @namespace .tooltip
 * @desc This module adds the '.active' class to a tooltip to open it, and listens for an outside click to close it. 
 * @example $('.tooltip').tooltip();
 * 
 */

define(

    [],

    // Pass in our modules as an argument to our factory
    function() {
        
        // Define constructor
        function Tooltip( options ) {
            
        }
        
        // Add methods to constructor's prototype
        Tooltip.prototype = {
            
            init: function() {
                
                // jQuery DOMContentReady
                $( this.initUI.bind( this ) );
            },
            
            initUI: function() {
                
            }
        }
        
        // Return a function that returns a new instance of the constructor
        return function( options ) {
            
            return new Tooltip( options );
        };
    }
);