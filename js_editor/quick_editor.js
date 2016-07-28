var QuickEditor = {
	
	// Reference to Editor.selection
	selection: null,
    
    build: function()
    {
		$qe = $('#quick_editor');
		
		if (QuickEditor.selection !== Editor.selection)
		{
			QuickEditor.selection = Editor.selection;
			QuickEditor.update();
			$qe.hide()
		}
		
		// Update quick_editor location
		var rect = QuickEditor.selection.getBoundingClientRect(),
			qe_width  = parseFloat( $qe.css('width') ),
			qe_height = parseFloat( $qe.css('height')),
			left = (rect.right + qe_width < window.innerWidth ? rect.right : window.innerWidth - qe_width),
			top = (rect.top + 75 + qe_height < window.innerHeight ? rect.top + 75 : window.innerHeight - qe_height);

		$qe	.css('top',top)
			.css('left',left);
			
		if ( !($qe.is(":visible")) ) 
		{ 
			$qe.hide().slideDown();
		}
    },
    
	update: function()
	{
		
	},
	
    // Toggle style.width between 100% and none
    width: function()
    {
        var success = true;
        
        /*
        if ( PropLib['General']['width'].validate )
            // Run custom validation
            success = PropLib['General']['width'].validate(elem,'',this);
        else
            // Run default CSS validation
            success = Editor.validateCSSinput(elem, prop, this);
        */
        
        if (Editor.selection.style.width != '100%') {
			Editor.selection.style.width = '100%';
			Editor.selection.style.display = 'block';
		}
		else {
			Editor.selection.style.width = '';
			Editor.selection.style.display = 'inline-block';
		}
		
		//Editor.tryToChangeCSS(Editor.selection, 'width', '100%');
        
		UndoRedo.saveState("Changed " + Editor.getElementTitle(Editor.selection) + " width");
		
        Updates.selectionEdited = true;
    },
	
	// Toggle style.height between 100% and none
    height: function()
    {

        if (Editor.selection.style.height != '100%') {
			Editor.selection.style.height = '100%';
		}
		else {
			Editor.selection.style.height = '';
		}
        
		UndoRedo.saveState("Changed " + Editor.getElementTitle(Editor.selection) + " height");
		
        Updates.selectionEdited = true;
    },
    
	// Toggle alignment between 1eft, center and right
	align: function()
	{
		if (Editor.selection.style.marginLeft != 0) {
			Editor.selection.style.marginLeft = '100%';
			Editor.selection.style.marginRight = 'auto';
		}
		else {
			Editor.selection.style.height = '';
		}
        
		UndoRedo.saveState("Changed " + Editor.getElementTitle(Editor.selection) + " height");
		
        Updates.selectionEdited = true;
		
	}
};