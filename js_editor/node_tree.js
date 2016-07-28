var NodeTree = {
	easytree: null,
	elemToNode: function(elem)
	{
		if (elem.id == "")
		{
			// Generate random id
			var n_id = elem.tagName.toLowerCase();
			while (elem.ownerDocument.getElementById(n_id))
				n_id = elem.tagName.toLowerCase() + "_" + Math.floor( 10000*Math.random() );
				
			elem.id = n_id;
		}
		
		var c = elem.children,
			children = [],
			data = ElemLib.getData(elem);
            //title = Editor.getElementTitle(elem);
		
		for (var i=0; i < c.length; i++)
			children.push( NodeTree.elemToNode(c[i]) );
        
		return {
			"isExpanded":true,
			"isFolder": !!data.isContainer,
			"id": ("nt_" + elem.id),
			"text": (data.faHTML + '&lt;' + data.name + '&gt;'),
			"tooltip": elem.id,//title.split('"').join(''),
			"children": children
		};
	},
	build: function()
	{
		var jsonData = [ NodeTree.elemToNode(Target.doc.body) ];
		
		NodeTree.easytree = $('#node_tree').easytree({
			data: jsonData,
			allowActivate: true,
			enableDnd: true,
			disableIcons: true,
			// Runs when a node is drag&dropped on another
			dropped: function(event, nodes, isSourceNode, source, isTargetNode, target) 
			{
				console.log('Dropped: ' + source.text + ' to ' + target.text + 
							' (' + source.id + ' to ' + target.id +')');
							
				$( Target.doc.getElementById(target.id.replace("nt_", "")) )
					.append( Target.doc.getElementById(source.id.replace("nt_", "")) );
			},
			stateChanged: function()
			{
				if ( $('.easytree-active').length === 0 )
					return;
				
                var new_selection = Target.doc.getElementById( $('.easytree-active')[0].id.replace("nt_", "") );
                
                if ( new_selection !== Editor.selection )
                {
                    // Select highlighted element
                    Editor.setSelection( 
                        Target.doc.getElementById( $('.easytree-active')[0].id.replace("nt_", "") )
                    );
                }
			}
			
		});
	}
};