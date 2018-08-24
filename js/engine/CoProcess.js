app.coprocess.init = function(){


    app.editor.resize_document();
    app.editor.resize_scrollview();
    

    // WINDOW RESIZE
    window.onresize = function(e){
        var delegate = app.editor.delegate_window_onresize;
        app.coprocess.execute_delegate(delegate,this,e);
    };

    // WINDOW SCROLL
    window.onscroll = function(e){
        var delegate = app.editor.delegate_window_onscroll;
        app.coprocess.execute_delegate(delegate,this,e);
    };

    // DOCUMENT KEYDOWN
    app.editor.lastElemClicked = null;
    document.onkeydown = function(e){
        var delegate = app.editor.delegate_document_onkeydown;
        app.coprocess.execute_delegate(delegate,this,e);
    };

    // DOCUMENT MOUSEUP
    app.editor.lastElemClicked = null;
    document.onmouseup = function(e){
        var delegate = app.editor.delegate_document_onmouseup;
        app.coprocess.execute_delegate(delegate,this,e);
    };

    // WORKAREA CLICK
    app.workarea.onclick = function(e){
        var delegate = app.editor.delegate_workarea_onclick;
        app.coprocess.execute_delegate(delegate,this,e);
    }

    // WORKAREA KEYDOWN
    app.workarea.onkeydown = function(e){
        var delegate = app.editor.delegate_workarea_onkeydown;
        app.coprocess.execute_delegate(delegate,this,e);
    }

    // WORKAREA PASTE
    app.workarea.onpaste = function(e){
        var delegate = app.editor.delegate_workarea_onpaste;
        app.coprocess.execute_delegate(delegate,this,e);
    }

    // EVERY 100 MILLISEC
    app.editor.animValue = 0;
    window.setInterval(function(){
        var val = app.editor.animValue;
        var delegate = app.editor.delegate_onframe;
        app.coprocess.execute_delegate(delegate, val);

        val += 0.1;
        if(val >= 1) val = 0;
        app.editor.animValue = val;
    }, 100);
    
    // EVERY FRAME
    (app.editor.everyFrameFunction = function(){
        var delegate = app.editor.delegate_requestAnimationFrame;
        app.coprocess.execute_delegate(delegate);

        requestAnimationFrame(app.editor.everyFrameFunction);
    })();

};




app.coprocess.execute_delegate = function(delegate,elem,event){
    for(var i=0; i<delegate.length; i++)
        delegate[i](elem,event);
};


// permet de mettre re-ajuster la taille de html et body
// en fonction de la taille de window
app.editor.resize_document = function(){
    document.documentElement.style.height = innerHeight;
    document.body.style.height = innerHeight;
};

// permet de mettre re-ajuster la taille de scrollview
// en fonction de la taille de window et de la taille de la toolbar
app.editor.resize_scrollview = function(){
    app.scrollview.style.height = innerHeight - app.toolbar.height;
};



// workarea onclick delegate
app.editor.ACTION_clickLink = function(that, e){
    if(e.button != 1) e.preventDefault();
};
// workarea onkeydown delegate
app.editor.ACTION_undo = function(that, e){
    // si ALT + Z
    if(e.altKey == true && e.keyCode == 90){
        var workareaClone = app.workarea.cloneNode(true);
        app.editor.load_stat();
        app.editor.statsave = workareaClone;
    }
};



// window onresize delegate
app.editor.ACTION_resizeEditor = function(that, e){
    app.editor.resize_document();
    app.toolbar.check_height();
    app.editor.resize_scrollview();
};

app.editor.ACTION_webBrowserPaste = function(that, e){
    var docSelection = getSelection();
    var range = docSelection.getRangeAt(0);
    range.deleteContents();
    var clipboard = e.clipboardData.getData("text/plain")
    document.execCommand("insertText",false,clipboard);
    e.preventDefault();
};

// window onscroll delegate
app.editor.ACTION_preventScrollPage = function(that, e){
    that.scrollTo(0,0);
};

app.editor.ACTION_preventBackspaceKey = function(that, e){
    activeElem = document.activeElement;
    if(e.keyCode == 8)
        if(activeElem.type != "text"
        && activeElem.type != "textarea"
        && activeElem.type != "number"
        && activeElem.contentEditable != "true")
            e.preventDefault();
}



/* **************************************************************** */
/* *                        DELEGATES                             * */
/* * - WORKAREA CLICK                                             * */
/* * - WORKAREA KEYDOWN                                           * */
/* * - DOCUMENT MOUSEUP                                           * */
/* * - WINDOW   RESIZE                                            * */
/* * - WINDOW   SCROLL                                            * */
/* *                                                              * */
/* * - (WINDOW)   SETINTERVAL 100                                 * */
/* * - (WINDOW)   REQUESTANIMATIONFRAME                           * */
/* **************************************************************** */

app.editor.delegate_workarea_onclick = [
    app.editor.ACTION_clickOverMenu,
    app.editor.ACTION_clickLink
];

app.editor.delegate_workarea_onkeydown = [
    app.editor.ACTION_arrowkeySelection,
    app.editor.ACTION_enterkeyTextEdit,
    app.editor.ACTION_undo
];

app.editor.delegate_workarea_onpaste = [
    app.editor.ACTION_webBrowserPaste
];

app.editor.delegate_document_onkeydown = [
    app.editor.ACTION_preventBackspaceKey
];

app.editor.delegate_document_onmouseup = [
    app.editor.ACTION_mouseUpOnMemo
];

app.editor.delegate_window_onresize = [
    app.editor.ACTION_resizeEditor
];

app.editor.delegate_window_onscroll = [
    app.editor.ACTION_preventScrollPage
];

app.editor.delegate_onframe = [
    app.selections.anim,
    app.dragNdrop.destAnim
];

app.editor.delegate_requestAnimationFrame = [
    app.editor.ACTION_focusingManager
];



