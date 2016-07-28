var EditorWindow = {};
EditorWindow.selection = "nakitjamuusi";
//EditorWindow.selectionData = null;


EditorWindow.update = function()
{
    console.log("updating editorWindow...")
    
    var editor = document.getElementById("editorWindow");
    
    // No need to update if EditorWindow isn't showing
    if (!$(editor).is(":visible")) {
        return;
    }
    
	var e = Editor.selection,
		eData = ElemLib.getData(e),
        eHead = document.getElementById("edwiHead"),
        eInfo = document.getElementById("edwiInfo");
    
    // Init new selection
    if (e !== EditorWindow.selection) 
    {    
        // Remove everything in window after eInfo
        while (eInfo.nextElementSibling) {
            eInfo.parentNode.removeChild(eInfo.nextElementSibling);
        }
        
        if (!e) {
            eHead.innerHTML = "No element selected";
            eInfo.innerHTML = "";
        }
        else {
            eHead.innerHTML = "Edit " + Editor.getElementTitle(e);
            eInfo.innerHTML = eData.faHTML;
            if (e.id) eInfo.innerHTML += "<" + eData.name + ">";
            
            $("<p class='tip'>Computed values are shown in grey.</p><p class='tip'>Leave input empty for default value.</p>").appendTo(editor);
            
            var tbl = $("<div class='tbl'></div>").appendTo(editor);
            
            for (var group in eData.propGroups) 
            {
                // Check that element has prop group and 'var group' is a native property (not inherited)
                if (eData.propGroups[group] && eData.propGroups.hasOwnProperty(group))
                {
                    tbl.append(EditorWindow.createPropTableHeader(group));
                    tbl.append(EditorWindow.createPropTableGroup(e, group));

                    if (EditorWindow.settings[group+'_open'])
                        tbl.children().last().css('visibility','visible');
                    else
                        tbl.children().last().css('visibility','collapse');                   
                }
            }
            
            $('<div id="gridOnOff" class="divButton"></div>')
                .appendTo(editor);
            
            $('<div class="divButton"><i class="fa fa-trash" aria-hidden="true"></i> Delete</div>')
                .appendTo(editor)
                .click(function() {
                    
                    if (e.children.length === 0)
                        e.parentNode.removeChild(e);
                    else {
                        if (confirm('Selected element and all of its children will be deleted.\nContinue?'))
                            e.parentNode.removeChild(e);
                    }
                        
                });
        }
        
        EditorWindow.selection = e;
    }
	
    // UPDATE input values & open/close table groups
    if ( $(e.parentNode).hasClass('gs-w') )
    {
        $('#gridOnOff')
            .html('<i class="fa fa-th" aria-hidden="true"></i> Snap off grid')
            .click(function() {
                Editor.snapOff(e);
                EditorWindow.update();
            });
    }
    else {
        $('#gridOnOff')
            .html('<i class="fa fa-th" aria-hidden="true"></i> Snap to grid')
            .click(function() {
                Editor.snapToGrid(e);
                EditorWindow.update();
            });
    }
    
	$('#editorWindow .tblhead').each(function() {
		var propGroup = $(this).attr('data-headOf');
			
			var open = EditorWindow.settings[ propGroup + '_open' ];
				
			if (open) {
				$(this).next().css('visibility','');
				
				$(this).children('.input').each(function()
				{
                    var tag = this.tagName.toLowerCase();
                    
                    if (tag === "select")
                        this.value = $(elem).css(prop);
                    else if (tag === "input") {
                        this.value = elem.style[propName];
                        this.placeholder = $(elem).css(prop);
                    }
				});
			}
			else
				$(this).next().css('visibility','collapse');
			
			$(this).children().last()
				.html("<i class='fa fa-chevron-"+(open ? "down" : "up")+"' aria-hidden='true'></i>");
		//}
	});
    
    // Scroll to editing element
    $("#ifr").contents().find('html, body').animate({
        scrollTop: $(e).offset().top
    }, 500)
	
	return true;
}


//////function edit(elem)
/*
    $("#ifr").contents().find(".editorselection")
        .css("outline",Editor.outlineSaveForSelection)
        .removeClass("editorselection");
	
    Editor.outlineSaveForSelection = elem.style.outline;
    
    $(elem).css("outline","#55f dashed 2px")
           .addClass("editorselection");
    
    EditorWindow.settings.Element = elem;
    //EditorWindow.update(elem);
    
	var ew = document.getElementById("editorWindow"),
		head = $('<h2 id="head">Edit '+ Editor.getElementTitle(elem) +'</h2>');
		
	ew.innerHTML = "";
	ew.style.display = "inline";
	$(ew).append(head);
	
	var tbl = $("<div class='tbl'></div>").appendTo(ew);

	function setGroup(groupName) {
	
		tbl.append(EditorWindow.createPropTableHeader(groupName));
		tbl.append(EditorWindow.createPropTableGroup(elem, groupName));
		
		if (EditorWindow.settings[groupName+'_open'])
			tbl.children().last().css('visibility','visible');
		else
			tbl.children().last().css('visibility','collapse');
	}
	
	setGroup('General');
	setGroup('Position');
	setGroup('Text');
    
    console.log(document.getElementById('ifr').contentWindow)
*/
////////

EditorWindow.settings = {
	General_open: false,
	Position_open: false,
	Text_open: false
}

EditorWindow.setHandlers = function()
{
    $('#editorWindow').draggable({ handle: "#head", cursor: "move" });
    
	$('#editorWindow').on('click','.tblhead',function() {
                
		var prop_set = $(this).attr('data-headOf');
		
		EditorWindow.settings[ prop_set + '_open' ] = 
			!EditorWindow.settings[ prop_set + '_open' ];
		
        EditorWindow.update();
        
        /*
        
		if ( !EditorWindow.settings[ prop_set + '_open' ] ) {
			$(this).next().css('visibility','collapse');
			$(this).children().last()
				.html("<i class='fa fa-chevron-up' aria-hidden='true'></i>");
		}
		else {
			$(this).next().css('visibility','');
			$(this).children().last()
				.html("<i class='fa fa-chevron-down' aria-hidden='true'></i>");   
		}*/
	});
    
	$('#editorWindow').on('blur','.prop_input',function()
	{
        if (!EditorWindow.selection) {
            alert('no element selected...');
        }
        
        var group = $(this).attr('data-groupName'),
            prop = $(this).attr('name'),
            elem = EditorWindow.selection;
        
        var success = true;
        
        if ( Editor.propGroups[group][prop].validate )
            // Run custom validation
            success = Editor.propGroups[group][prop].validate(elem,prop,this);
        else
            // Run default CSS validation
            success = Editor.validateCSSinput(elem, prop, this);
        
        if (success) EditorWindow.update();
	});
}

EditorWindow.apply = function(elem)
{
	$('#editorWindow .tblrowgroup').each(function()
	{
		var groupName = this.id;
		
		if (EditorWindow.settings[groupName+'_open']) {
		
			console.log('applying '+groupName);
			
			$('#'+groupName + '.prop_input').each(function()
			{
				var prop = $(this).attr('name');
				
				if ( Editor.propGroups[groupName][prop].validate )
					Editor.propGroups[groupName][prop].validate(elem,prop,this);
				else
					Editor.validateCSSinput(elem, prop, this);
			});
		}
	});
}

EditorWindow.createPropTableHeader = function(groupName) 
{  
	var row = $("<div class='tblhead' data-headOf='" + groupName + "'></div>")
  
	var cell1 = $("<div class='tblcell'>" + groupName + "</div>");
	var cell2 = $("<div class='tblcell' style='text-align: right;'></div>")
		.html("<i class='fa fa-chevron-" 
		+ (EditorWindow.settings[groupName+'_open'] ? "down" : "up")
		+ "' aria-hidden='true'></i>")
	
	return row.append(cell1, cell2);
}

EditorWindow.createPropTableGroup = function(elem, groupName)
{
	var group = $("<div class='tblrowgroup' id='"+ groupName +"'></div>"),
		propList = Editor.propGroups[groupName];
		
	for (var i in propList)/*var i=0; i<propList.length; i++*/
	{
		var prop = propList[i],
            propName = i,
			row = $("<div class='tblrow'></div>"),
			cell1 = $("<div class='tblcell'>"+ i +":</div>"),
			cell2 = $("<div class='tblcell'></div>"),
			row = $("<div class='tblrow'></div>");
			input = null;
		
		if (prop.opt) {
			input = document.createElement("select");

			for (var o=0; o<prop.opt.length; o++) {
				
				var option = document.createElement("option");
				option.value = option.text = prop.opt[o];
				if (option.value === prop.defValue)
					option.style.color = '#777';
				input.add(option);
			}
			
			input.value = (elem.style[propName] !== "" ? elem.style[propName] : $(elem).css(prop));
		}
		else {
			input = document.createElement("input");
			$(input)
				.attr('type','text')
				.attr('value', (prop.elementAttr ? elem[propName] : elem.style[propName]))
				.attr('placeholder', $(elem).css(propName));//prop.defValue);
		}
		
		if (input) {
			$(input).addClass('prop_input')
                    .attr('data-groupName',groupName)
					.attr('name',propName)
					.appendTo( cell2 );
		}
		
		row	.append( cell1, cell2 )
			.appendTo( group );
	}
	
	return group;
}