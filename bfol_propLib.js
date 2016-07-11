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