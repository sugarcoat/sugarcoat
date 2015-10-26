# AMD Dependency Sequence #

## Flow for an Abstract Example ##

                            page
                              |
                              |
                          bootstrap
                              |
                              |
                          mediator
                              |
                              |
                  -------------------------
                  |                       |                   
                  |                       |                   
                module                  module
          -----------------       -----------------
          |               |       |               |
          |               |       |               |
        module          module  module          module
        
        

## Applied to the [AMD Dependency Sequence Demonstration](../../../amd) ##


                                    home.php
                                        |
                                        |
                                  boot-home.js
                                        |
                                        |
                                mediators/home.js
                                        |
                                        |
              -----------------------------------------------------
              |                         |                         |
              |                         |                         |
        modules/jquery.js     modules/jquery.alpha.js   modules/jquery.beta.js
                                        |                         |
                                        |                         |
                                  modules/jquery.js         modules/jquery.js
        
                           