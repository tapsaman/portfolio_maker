UndoRedo = {
	
	storage: [],
	storagePlace: -1,

	init: function()
	{
		UndoRedo.storage = [];
		UndoRedo.storagePlace = -1;
		
		UndoRedo.saveState('INITIAL');
	},
	
	/* State should be saved _after_ every 
	result-wise relevant change to Target.doc
	along with a description */
	saveState: function(changeDescr)
	{
		// Pause selection to "clean" Target.doc
		Editor.pauseSelection(true);
		
		// Remove existing REDOs
		if (UndoRedo.storagePlace <= UndoRedo.storage.length-1)
		{
			UndoRedo.storage.splice( UndoRedo.storagePlace+1 );
		}
		
		UndoRedo.storage.push(
		{
			descr: changeDescr,
			html: $(Target.iframe).contents().find('html').html()
		});
		
		if (++UndoRedo.storagePlace != UndoRedo.storage.length-1) {
			alert('[UndoRedo.saveState()] ERROR! UndoRedo.storagePlace: '+UndoRedo.storagePlace + ' .storage.length: ' + UndoRedo.storage.length);
		}
		
		// Keep storage at a maximum of 10 save states
		if (UndoRedo.storage.length > 10) {
			UndoRedo.storage.splice(10);
			UndoRedo.storagePlace--;
		}
		
		//  Revert Target.doc
		Editor.pauseSelection(false);
		
		// Flash undo_button (because new UNDO exists)
		if (changeDescr !== 'INITIAL')
			$('#undo_button').effect('highlight',{color:"#ff0"});
		
		Updates.undoStorageChanged = true;
	},
	
	undo: function()
	{
		//alert('undo');
        
        UndoRedo.storagePlace--;
        
        // Update HTML
        $(Target.iframe).contents().find('html')[0].innerHTML = UndoRedo.storage[ UndoRedo.storagePlace ].html;
        
		// Flash redo_button
		$('#redo_button').effect('highlight',{color:"#ff0"});
		
        Updates.undoStorageChanged = true;
    },
	redo: function()
	{
		//alert('redo');
        
        UndoRedo.storagePlace++;
        
        // Update HTML
        $(Target.iframe).contents().find('html')[0].innerHTML = UndoRedo.storage[ UndoRedo.storagePlace ].html;
        
		// Flash redo_button
		$('#undo_button').effect('highlight',{color:"#ff0"});
		
        Updates.undoStorageChanged = true;
	}
};