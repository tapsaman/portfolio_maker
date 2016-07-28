/*
Updates object gets told if something changes
and check() does something about it WHEN IT CAN
as by the standrard way of how requestAnimationFrame works.

So :
	check() can do anything that can be updated by its next 
	run BUT SOULD NOT be responsible for anything that HAS 
	TO BE DONE AT LEAST ONCE.

y i do tis:
	Running update function every time something changes
	might 1) run multiple times without the need to and 
	2) do too much at possibly the most critical times,
	when as a constantly rerunning check function would
	appear only when it is possible.
*/

var Updates = {
	//allChanged = true,
    targetSiteChanged: false,
	selectionChanged: false,
    selectionEdited: false,
	undoStorageChanged: false,
	nodeTreeChanged: false,
	
	check: function ()
	{	
		requestAnimationFrame(Updates.check);
		
        if (Updates.targetSiteChanged)
		{	
            Target.iframe = document.getElementById("target_iframe");
			
            Target.doc = Target.iframe.contentWindow.document;
			Target.url = Target.iframe.src;
			
			if (Target.doc) {
			
				NodeTree.build();
				UndoRedo.init();
				
				Updates.targetSiteChanged = false; 
			}
        }
        
		if (Updates.selectionChanged)
		{
			//EditorWindow.update();
			if (Editor.selection)
            {
                NodeTree.easytree.activateNode(Editor.selection.id);
            }
			else {
                // DEACTIVATE EASYTREE NODE
            }
			
			Updates.selectionChanged = false;
		}
        
        if (Updates.selectionEdited)
		{
			
			Updates.selectionEdited = false;
		}
		
		if (Updates.undoStorageChanged)
		{
			var undo_button = document.getElementById("undo_button"),
				redo_button = document.getElementById("redo_button");
			
			if (UndoRedo.storagePlace < 0 ||
				UndoRedo.storagePlace > 9 ||
				UndoRedo.storagePlace >= UndoRedo.storage.length)
				alert('[Updates.check()] ERROR! UndoRedo.storagePlace: '+UndoRedo.storagePlace);
		
			// Check if UNDOs exists
			if (UndoRedo.storagePlace > 0) 
			{
                $(undo_button).removeClass("disabled");
				undo_button.title = UndoRedo.storage[ UndoRedo.storagePlace ].descr;
                undo_button.onclick = UndoRedo.undo;
			}
			else {
				$(undo_button).addClass("disabled");
                undo_button.onclick = null;
			}
            
			// Check if REDOs exists
			if (UndoRedo.storagePlace < UndoRedo.storage.length-1)
			{
				$(redo_button).removeClass("disabled");
				redo_button.title = UndoRedo.storage[ UndoRedo.storagePlace+1 ].descr;
                redo_button.onclick = UndoRedo.redo;
			}
			else {
                $(redo_button).addClass("disabled");
                redo_button.onclick = null;
			}
			
			Updates.undoStorageChanged = false;
		}
        
        if (Updates.nodeTreeChanged)
		{
            NodeTree.build();
        }
	}
}