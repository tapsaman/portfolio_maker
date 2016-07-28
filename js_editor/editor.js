var Editor = {
	
	// Selected element in editing document (Target.doc)
	selection: null,
	
	lastSelection: null,
	// Holder for data of this selection
	selectionData: null,
	// Selection indicator
	selectionOutline: "#55f dashed 2px",
	// Holder for cut/copied element(s)
	pasteElementStrorage: null
};
/* PROPER WAY to deselect everything:
    Editor.setSelection( null );
*/


Editor.update = function()
{
    console.log("Editor.update()...");
    
    var ifr = document.getElementById('ifr'),
        hCB = document.getElementById('headerCheck'),
        fCB = document.getElementById('footerCheck'),
        hArea = ifr.contentWindow.document.getElementById('headerArea'),
        fArea = ifr.contentWindow.document.getElementById('footerArea');
    
    if (hArea && $(hArea).is(":visible"))
        hCB.checked = true;
    else
        hCB.checked = false;
    
    if (fArea && $(fArea).is(":visible"))
        fCB.checked = true;
    else
        fCB.checked = false;    
}

Editor.headerAreaOnOff = function(event)
{
    var ha = document.getElementById('ifr').contentWindow.document.getElementById('headerArea');
    
    // HEADER on
    if (event.target.checked)
    {
        if (!ha) {
            // No headerArea found, create new
            $(document.getElementById('ifr').contentWindow.document.body)
                .prepend('<div id="headerArea" data-bfol_type="headerArea">\
                                <div id="headerContent" class="bfol_unselectable">\
                                    <h1 style="float:left">Pertti</h1>\
                                    <h3 style="float:right">Olen tietokoneäijä</h3>\
                                </div>\
                          </div>');
        }
        else if (!$(ha).is(":visible"))
            $(ha).show();
    }
    // HEADER off
    else 
    {
        if (ha) $(ha).hide();
    }
}

Editor.footerAreaOnOff = function(event)
{
    var fa = document.getElementById('ifr').contentWindow.document.getElementById('footerArea');
    
    // HEADER on
    if (event.target.checked)
    {
        if (!fa) {
            // No headerArea found, create new
            $(document.getElementById('ifr').contentWindow.document.body)
                .append('<div id="footerArea" data-bfol_type="footerArea">\
                                <div id="footerContent" class="bfol_unselectable">\
                                    <p>Moi äiti</p>\
                                </div>\
                            </div>');
        }
        else if (!$(fa).is(":visible"))
            $(fa).show();
    }
    // HEADER off
    else 
    {
        if (fa) $(fa).hide();
    }
}

Editor.removeSelectionFrom = function(elem)
{
	$(elem)
		.css('outline',elem.getAttribute('data-outlinesave'))
		.removeClass('editorselection')
		.removeAttr('data-outlinesave');
	    
    if ($(elem).data("ui-draggable"))
        $(elem).draggable('destroy');

    if ($(elem).data("ui-resizable"))
        $(elem).resizable('destroy');
}

// To remove and restore editor influence on Target.doc 
// when needed to done temporarily  
// (on and off in the same function, e.g. UndoRedo.saveState)
// DOES NOT update or affect anything EDITOR related
Editor.pauseSelection = function(toggle /* true or false */)
{
	var elem = Editor.selection;
	
	if (!elem) return;
	
	if (toggle === true)
	{
		$(elem).each(function () 
		{
			Editor.removeSelectionFrom(this);
		});
	}
	else if (toggle === false) 
	{
		elem.setAttribute('data-outlinesave',elem.style.outline)
		elem.style.outline = Editor.selectionOutline;
		elem.className += " editorselection";
		
		if ( !($(elem).hasClass('editor_locked')) ) {
            $(elem).draggable({
                //grid: [5, 5],
                containment: 'parent'
                //snap: true
            });

            $(elem).resizable({
                //ghost: true
                //containment: 'parent'
                //helper: "ui-resizable-helper"
            });
        }
	}
}

Editor.setSelection = function(elem)
{	
	$(Editor.selection).each(function () 
	{
		Editor.removeSelectionFrom(this);
	});
    
	Editor.selection = null;
	Editor.selectionData = null;
	
	Updates.selectionChanged = true;
	
	if (elem && elem.tagName) 
	{
		Editor.selection = elem;
		Editor.lastSelection = elem;
		Editor.selectionData = ElemLib.getData(elem);
		elem.setAttribute('data-outlinesave',elem.style.outline)
		elem.style.outline = Editor.selectionOutline;
		elem.className += " editorselection";
        
		QuickEditor.build();
		
        if ( !($(elem).hasClass('editor_locked')) ) {
            $(elem).draggable({
                //grid: [5, 5],
                containment: 'parent'
                //snap: true
            });

            $(elem).resizable({
                //ghost: true
                //containment: 'parent'
                //helper: "ui-resizable-helper"
            });
        }
		
		return true;
	}
	else {
		return false;
	}
}

Editor.addSelection = function(elem)
{
    if (Editor.selection.constructor === Array) {
        // Selection is already an array
        
    }
}

Editor.getElementTitle = function(elem) {

	var title = "";

    if (elem.id !== "") 
        title = '"' + elem.id + '" ';
	else 
	{
        var elemData = ElemLib.getData(elem);
        
        title = '&lt;' + elemData.name + '&gt;';
    }
	
    return title;
}

Editor.snapOff = function(elem) 
{
    var offset = $(elem).offset(),
        previousParent = elem.parentNode;
    
    if ( !($(previousParent).hasClass('gs-w')) ) 
    {
        alert(previousParent + ' is not a grid item!');
        return;
    }
    
    $(elem)
        .appendTo(elem.ownerDocument.body)
        .addClass('bfol_absolutelyPositioned')
        .css('left',offset.left)
        .css('top',offset.top)
        .css('right','')
        .css('bottom','');
    
    document.getElementById('ifr').contentWindow.toggleEdit(true);
    
    if ($(previousParent).hasClass('gs-w') && previousParent.children.length === 0)
        previousParent.parentNode.removeChild(previousParent);
}

Editor.snapToGrid = function(elem)
{
    var offset = $(elem).offset();
    
    $(elem)
        .appendTo(elem.ownerDocument.body)
        .css('position','absolute')
        .css('left',offset.left)
        .css('top',offset.top)
        .css('right','')
        .css('bottom','');
}

Editor.validateCSSinput = function(elem, property, input) 
{
	if (input.value == elem.style[property]) 
		return false;
		
	console.log("property:"+property+" input.value:"+input.value);
	
	var success = false;
    
	var oldValue = elem.style[property];
	$(elem).css(property, input.value);
	var newValue = elem.style[property];
	
	// Property updated so input value is valid
	if (oldValue != newValue)
	{
		success = true;
		console.log("updated!");
	}
	else {
		// Try again with +'px'
		$(elem).css(property, input.value + 'px');
		var newValue = elem.style[property];
		
		if (oldValue != newValue) {
			success = true;
			console.log("updated!");
		}
		else
			console.log("wasn't updated... old value:" + oldValue + " input:" + input.value);
	}
	
	input.value = newValue;
	
	return success;
}

Editor.tryToChangeCSS = function(elem)
{
    
}