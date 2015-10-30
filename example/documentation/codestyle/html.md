# HTML Style Guide #

## Miscellaneous ##

Use soft tabs of 2 spaces. 

## Syntax ##

### Indent all Children ###

*No*

    <div class="parent">
    <p class="some-child">Lorem ipsum.</p>
    </div>
    
***Yes***

    <div class="parent">
      <p class="some-child">Lorem ipsum.</p>
    </div>

    
### Nest all Block-Level Elements on a new Line ###

*No*

    <div class="some-parent"><p class="some-child">Lorem ipsum.</p></div>
    
***Yes***

    <div class="some-parent">
      <p class="some-child">Lorem ipsum.</p>
    </div>



### Put all Block-Level end Tags on a new Line ###

*No*

    <div class="some-parent">
      <p class="some-child">Lorem ipsum.</p></div>
      
***Yes***

    <div class="some-parent">
      <p class="some-child">Lorem ipsum.</p>
    </div>