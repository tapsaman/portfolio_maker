var StyleEditor = {

    build: function() 
    {
        var select = document.getElementById('style_editor_select'),
            selTag = select.value,
            selTitle = $( "#style_editor_select option:selected" ).text(),
            $target_elem = $('<'+selTag+' id="temporary_element"></'+selTag+'>').appendTo(Target.doc.body),
            local_elem = document.createElement(selTag);
        
        local_elem.id = "local_elem_example";
        local_elem.innerHTML = selTitle;
        
        for (var i in PropLib.Style) {
            if ( PropLib.Style.hasOwnProperty( i ) ) 
                $(local_elem).css(i, $target_elem.css(i) );
        }
        
        $('#style_example')
            .empty()
            .append('<p>Previous Paragraph, Previous Paragraph, Previous Paragraph, Previous Paragraph, Previous Paragraph, Previous Paragraph, Previous Paragraph</p>',
                   local_elem,
                   '<p>Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph, Following Paragraph</p>'
                   );
    
        $(Target.doc.getElementById('temporary_element')).remove();
    }

};