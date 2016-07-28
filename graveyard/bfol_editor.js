var Editor = {
	
	// Selected element in editing document (Target.doc)
	selection: null,
	
	lastSelectio: null,
	// Holder for data of this selection
	selectionData: null,
	// Selection indicator
	selectionOutline: "#55f dashed 2px",
	// Holder for cut/copied element(s)
	pasteElementStrorage: null,
	
	undoStorage: [],
	undoStoragePlace: 0
};

// Save current target HTML and a description of the change
Editor.saveForUndo = function(changeDescription)
{
	// Add current target site HTML to undoStorage
	var new_place = (Editor.undoStoragePlace === 0 ? 1 : Editor.undoStoragePlace);
	
	Editor.undoStorage[new_place] =
	{
		descr: changeDescription,
		html: $('#ifr').contents().find('html').html()
	};
	
	alert( Editor.undoStorage[ new_place ].html );
	
	// Remove redos
	if (Editor.undoStoragePlace !== 0)
	{
		Editor.saveForUndo.splice(0,Editor.undoStoragePlace);
		Editor.undoStoragePlace = 0;
	}
	
	// Keep undoStorage at a maximum of 10 saves
	if (Editor.saveForUndo.length > 10)
		Editor.saveForUndo.splice(10,Editor.saveForUndo.length-10);
	
	Editor.UPD.undoStorageChanged = true;
}

Editor.undo = function () 
{
	if (Editor.undoStoragePlace === Editor.undoStorage.length)
	{
		alert('can\'t undo');
		return;
	}
		
	if (Editor.undoStoragePlace === 0)
	{
		Editor.undoStorage[0] =
		{
			descr: 'to origin',
			html: $('#ifr').contents().find('html').html()
		};
	}
	
	Editor.undoStoragePlace++;
	
	alert( Editor.undoStorage[ Editor.undoStoragePlace ].html );
	
	// Update HTML
	$('#ifr').contents().find('html')[0].innerHTML = Editor.undoStorage[ Editor.undoStoragePlace ].html;
		
	Editor.UPD.undoStorageChanged = true;
	Editor.UPD.nodeTreeChanged = true;
}

Editor.redo = function () 
{
	if (Editor.undoStoragePlace === 0)
	{
		alert('can\'t redo');
		return;
	}
	
	if (Editor.undoStoragePlace === Editor.undoStorage.length)
	{
		Editor.undoStorage[Editor.undoStoragePlace] =
		{
			descr: 'to last',
			html: $('#ifr').contents().find('html').html()
		};
	}
	
	Editor.undoStoragePlace--;
	
	// Update HTML
	$('#ifr').contents().find('html').html(
		Editor.undoStorage[ Editor.undoStoragePlace ].html );
		
	Editor.UPD.undoStorageChanged = true;
	Editor.UPD.nodeTreeChanged = true;
}

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

Editor.removeSelectionFrom = function (elem)
{
	$(elem)
		.css('outline',elem.getAttribute('data-outlinesave'))
		.removeClass('editorselection')
		.removeAttr('data-outlinesave');
	//elem.removeAttribute("data-bfol_outlinesave")
}

Editor.setSelection = function(elem)
{
    //alert('setsel_old:'+ $("#ifr").contents().find(".editorselection")+"\nnew:"+elem);
    
	// For previous selection: restore outline and remove class
	//$("#ifr").contents().find(".editorselection")
    
	$(Editor.selection).each(function () 
	{
		Editor.removeSelectionFrom(this);
	});
        	
	$("#mainNodeList .itemDiv.selected")
		.removeClass("selected");
	
	if (!elem || !elem.tagName) {
		// elem is not a DOMElement
		Editor.selection = null;
		Editor.selectionData = null;
		
		Updates.selectionChanged = true;
		
		return false;
	}
	else {
		Editor.selection = elem;
		Editor.selectionData = ElemLib.getData(elem);
		elem.setAttribute('data-outlinesave',elem.style.outline)
		elem.style.outline = Editor.selectionOutline;
		elem.className += " editorselection";
		
		Updates.selectionChanged = true;
		
		return true;
	}
}

Editor.addSelection = function(elem)
{
	
	
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

Editor.propGroups = {
Meta:
    {
        id: {
            nickName: 'ID',
            elementAttr: true, // Not a style attribute
            defValue: '',
            validate: function(elem, property, input)
            {
                console.log(property, input.value);

                if (elem.ownerDocument.getElementById(input.value)) 
                {
                    alert("ID already exists!");
                    input.value = elem[property];
                    return false;
                }
                
                elem[property] = input.value;
                input.value = elem[property];
                
                return true;
            }
        }
    },
General: 
    {
        width: {
            defValue: '100%',
        },
        height: { 	
            defValue: '100%',
        },
        visibility: {
            defValue: 'visible',
            opt: ['visible','hidden','collapse','inherit']
        },
        color: { 
            defValue: 'inherit' 
        },
        backgroundColor: { 
            defValue: 'inherit' 
        }
    },
Position: {
    position: {
        defValue: 'static',
        opt: ['static','relative','absolute','fixed']
    },
    top: {
        defValue: 'auto' 
    },
    right:{
        defValue: 'auto' 
    },
    bottom: {
        defValue: 'auto' 
    },
    left: {
        defValue: 'auto' 
    }
},
Text: {
    textContent: {
        nickName: 'text',
        defValue: '',
        elementAttr: true, // Not a style attribute
        validate: function(elem, property, input)
        {
            console.log(property, input.value);
            
            elem[property] = input.value;

            input.value = elem[property];
            
            return true;
        }
    }
}};

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