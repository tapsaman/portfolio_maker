// PREOPERTY LIBRARY GROUPED BY CATEGORY
var PropGroupLib = {
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

Style: {

    color: { 
        defValue: 'inherit'
    },
    backgroundColor: { 
        defValue: 'inherit'
    },
    
    marginTop: {
        defValue: 0
    },
    marginRight: {
        defValue: 0
    },
    marginBottom: {
        defValue: 0
    },
    marginLeft: {
        defValue: 0
    },
    paddingTop: {
        defValue: 0
    },
    paddingRight: {
        defValue: 0
    },
    paddingBottom: {
        defValue: 0
    },
    paddingLeft: {
        defValue: 0
    }
    
},
    
Text: {
    
    fontSize: {
        defValue: 'medium'
    },
    
    fontFamily: {
        defValue: '"Times New Roman", Georgia, Serif',
        opt: ['"Times New Roman"'],
        fallbacks: ['Serif']
    },
    
    textAlign: {
        defValue: 'left',
        opt: ['left','right','center','justify','inherit']
    },
    
    lineHeight: {
        defValue: 'normal'
    },
    
    fontWeight: {
        defValue: 'normal',
        opt: ['normal','bold','bolder','lighter','inherit']
    },
    
    fontStyle: {
        defValue: 'normal',
        opt: ['normal','italic','oblique','inherit']
    },
    
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