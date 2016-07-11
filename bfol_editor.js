var Editor = {};
Editor.selection = null;
Editor.selectionOutline = "#55f dashed 2px";
Editor.outlineSaveForSelection = "";
Editor.pasteElementStrorage = null;

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

Editor.setSelection = function(elem)
{
    //alert('setsel_old:'+ $("#ifr").contents().find(".editorselection")+"\nnew:"+elem);
    
	// For previous selection: restore outline and remove class
	//$("#ifr").contents().find(".editorselection")
    
	$(Editor.selection)
        .css("outline",Editor.outlineSaveForSelection)
        .removeClass("editorselection");
		
	$("#mainNodeList .itemDiv.selected")
		.removeClass("selected");
	
	if (!elem.tagName) {
		// elem is not a DOMElement
		Editor.selection = null;
		EditorWindow.update();
		return false;
	}
	else {
        //alert("elem===HTMLElement");
		Editor.selection = elem;
		Editor.outlineSaveForSelection = elem.style.outline;
		elem.style.outline = Editor.selectionOutline;
		elem.className += " editorselection";
		
		EditorWindow.update();
		return true;
	}
}

Editor.getElementTitle = function(elem) {

	var title = "";

    if (elem.id !== "") 
        title = '"' + elem.id + '" ';
	else 
	{
        var elemData = ElemLib.get(elem);
        
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