/* 
Target.doc 
	Holds the document object currently under editing.
	Can be used e.g. to retrieve elements by Target.doc.getElementById(...)
	
	Can also be accessed inversely by [ELEMENT IN TARGET.DOC].ownerDocument
*/

var Target = {
	doc: null,
	url: "",
	iframe: null
};
