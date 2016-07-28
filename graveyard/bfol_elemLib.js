var ElemLib = {};

ElemLibItem = function( def ) // def holds definitions for a new element
{
    if (!def) { return; }
    
    this.tag  = def.tag;
	this.name = def.name || def.tag;
	
	// If no Font Awesome symbol defined, use question mark
    this.faUnicode = def.faUnicode || '\f29c';
	var fac = def.faClass || 'fa-question-circle';
	this.faHTML = '<i class="fa ' + fac + '" aria-hidden="true"></i>';
    
    // Define prop groups and cancel ones listed in def.noPropGroups
	this.propGroups = {Meta:true,General:true,Position:true,Text:true};
	
    if (def.noPropGroups) {
		for (var i=0; i < def.noPropGroups.length; i++) {
			if (this.propGroups[def.noPropGroups[i]])
				this.propGroups[def.noPropGroups[i]] = false;
    }	}
    
    // Element initalization function
    if (def.init) 
        this.init = def.init;
    
    this.addTo = def.creator || function(target) 
	{
		if (target.tagName && document.createElement) {
			// target is a DOMElement and document is defined
            var elem = document.createElement(this.tag);
            
            if (this.init)
                this.init(elem);
            
			target.appendChild( elem );
			return elem;
		}
		else {
			alert("problem adding "+this+" to "+target);
			console.log("problem adding "+this+" to "+target);
            
			return false;
		}
	}
    
    this.isContainer = def.isContainer || false;
};

// HTML element library
ElemLib = {
	
	// REGULAR TAG ELEMENTS
	body: 
        new ElemLibItem({tag: 'body', faClass: 'fa-object-group', faUnicode: '\f247', isContainer: true, noPropGroups: ['General','Position','Text']}),
	p: 
        new ElemLibItem({tag: 'p', name: 'paragraph', faClass: 'fa-paragraph', faUnicode: '\f1dd', init: function(elem) { elem.textContent = "This is a paragraph"; } }),
	div: 
        new ElemLibItem({tag: 'div', name: 'container', faClass: 'fa-square-o', faUnicode: '\f096', isContainer: true, noPropGroups: ['Text'],
                        init: function(elem) { elem.style.height = "50px"; elem.style.backgroundColor = "#070"; }}),
	canvas: 
        new ElemLibItem({tag: 'canvas', faClass: 'fa-pencil-square-o', faUnicode: '\f044', noPropGroups: ['Text']}),
	ul:
        new ElemLibItem({tag: 'ul', name: 'list', faClass: 'fa-list-ul', faUnicode: '\f0ca', isContainer: true, noPropGroups: ['Text']}),
    ol:
        new ElemLibItem({tag: 'ol', name: 'ordered list', faClass: 'fa-list-ol', faUnicode: '\f0cb', isContainer: true, noPropGroups: ['Text']}),
    li:
        new ElemLibItem({tag: 'li', name: 'list item', faClass: 'fa-map-pin', faUnicode: '\f276', isContainer: true, noPropGroups: ['Text']}),
    
	// CUSTOM ELEMENTS
    headerArea:
        new ElemLibItem({tag: 'div', name: 'headerArea', faClass: 'fa-square-o', faUnicode: '\f096', noPropGroups: ['Text'],
                        init: function(elem) { elem.style.height = "50px"; elem.style.backgroundColor = "#070"; }}),
    gridster:
        new ElemLibItem({tag: 'ul', name: 'gridster', faClass: 'fa-th', faUnicode: '\f00a', isContainer: true, noPropGroups: ['Text']}),
    
	anchorpoint: 
        new ElemLibItem({tag: 'canvas', name: 'anchorpoint', faClass: 'fa-dot-circle-o', faUnicode: '\f192', noPropGroups: ['Text'],
			creator:
				function(target) {
                    
					if (target.tagName && document.createElement && AnchorPoints.getNew) {
						
                        var id = 0;
                        while ( target.ownerDocument.getElementById("anchorpoint"+id) )
                        {   id++;   }
                        
						var a = AnchorPoints.getNew( id );
						
						target.appendChild( a.canvas );
						target.appendChild( a.tooltip );
						
						return true;
					}
					else {
						alert("problem adding "+this+" to "+target);
						return false;
					}
				}
            }),
    
    grid:
        new ElemLibItem({tag: 'div', name: 'grid', faClass: 'fa-th-large', faUnicode: '\f009', noPropGroups: ['Text'],
			init:
				function(elem) {
                    
                    elem.setAttribute('data-pf_elemtype','grid');
                    
					var row = new GridRow(2);
                    row.init();
                    /*var r_elem = row.appendMe();
                    r_elem.setAttribute('data-pf_elemType','gridRow');*/
                    $( row.appendMe() ).appendTo(elem);
                    
                    var row = new GridRow(2);
                    row.init();
                    /*var r_elem = row.appendMe();
                    r_elem.setAttribute('data-pf_elemType','gridRow');*/
                    $( row.appendMe() ).appendTo(elem);
				}
            }),
    
    gridRow:
        new ElemLibItem({tag: 'div', name: 'gridRow', faClass: 'fa-th-large', faUnicode: '\f009', noPropGroups: ['Text']}),
    gridColumn:
        new ElemLibItem({tag: 'div', name: 'gridColumn', faClass: 'fa-th-large', faUnicode: '\f009', noPropGroups: ['Text']}),
		
	// Fetch data for HTML element (and define elemType if needed)
	getData: function(elem)
    {	
        // Try by a previously defined elemType-data attribute
        var prev_type = elem.getAttribute('data-pf_elemtype');
        
        if (prev_type && ElemLib[prev_type]) {
            return ElemLib[prev_type];
        }
        
        // Define a working elemType if none exists
        var tag = elem.tagName.toLowerCase();
        
        if (ElemLib[tag])
        {    
            elem.setAttribute('data-pf_elemtype',tag);
            
			return ElemLib[tag];
		}
		else {
            var et = new ElemLibItem({tag: '?' + tag});
            elem.setAttribute('data-pf_elemtype',tag);
            
			return et;
        }
        
        /*
        //todo: NO CLASS DEFINITONS, CHANGE TO data-elemType for custom element definitions --> simpler & cleaner
		if (elem.classList)
			var c = elem.classList;
		else // For IE9 and older
		{
			alert('shit');
			var c = [];
		}
		
		for (var i=0; i<c.length; i++) {
			if (ElemLib[c[i]] !== undefined)
				return ElemLib[c[i]];
		}
		
		var tag = elem.tagName.toLowerCase();
		
		console.log("tag_"+tag);
		
		if (ElemLib[tag]) {
			return ElemLib[tag];
		}
		else
			return new ElemLibItem({tag: '?' + tag});*/
	}
};

// Element category arrays (for toolbox)
ElemLib.categ = {
		Fields: [ElemLib.div, ElemLib.canvas],
		Text: [ElemLib.p],
		Complex: [ElemLib.anchorpoint, ElemLib.grid]
	};

Object.freeze(ElemLib);