
/*
app.options.add_title = function(){
    alert(this.theapp.params);
}
*/

app.options.add_bloc = function(){
    // system : save for undo
    app.editor.save_stat();

    var bloc = app.bloc.create();
    this.theapp.params.target.appendChild(bloc);
    // system : close menu
    app.menu.check_current();
}

app.options.clone_bloc = function(){
    // system : save for undo
    app.editor.save_stat();

    var willClone = true;
    if(app.editor.runningMode != "NONE"){
        willClone = false;
        alert("impossible de cloner. un element est en train d'être edité");
    }
    if(app.selections.all.length > 0){
        willClone = false;
        alert("impossible de cloner. un ou plusieurs elements sont selectionnés");
    }
    if(willClone == true){
        var bloc = this.theapp.params.blocTarget;
        var clone = bloc.cloneNode(true);
        bloc.parentElement.appendChild(clone);
    }
    // system : close menu
    app.menu.check_current();
}

app.options.remove_bloc = function(){
    // system : save for undo
    app.editor.save_stat();

    var bloc = this.theapp.params.blocTarget;
    if(app.selections.all.length != 0)
        if(!confirm(
            "Memo va deselectionné tout les elements selectionnés avant de supprimer le bloc.\n"+
            "Etes-vous sur de vouloir supprimer le bloc ?"
        )){ app.menu.check_current(); return; }

        app.selections.clean();
        // quitte edite mode si le bloc contient l'element en cours d'edition
        if(app.editor.runningMode != "NONE"
        && app.lib.isDescendantsOf(bloc, app.editor.editingElem))
            app.toolbar.buttons.exit.onclick();
        // delete bloc
        app.workarea.removeChild(bloc);
    // system : close menu
    app.menu.check_current();
}



app.options.new_element = function(e){
    var target = this.theapp.params.target;
    if(app.lib.isContainingOnly_sysElement(target)
    || target === app.workarea){
        var params = {
            target : target
        };
        app.menu.instanciate("newelem", e.clientX,e.clientY, params);
    }else{
        alert("l'element contient du text");
        // system : close menu
        app.menu.check_current();
    }
};

app.options.set_titleBloc = function(){
    // system : save for undo
    app.editor.save_stat();

    if(!app.editor.editingBlocTitle){
        var title = this.theapp.params.titleTarget;
        if(title.textContent == "") title.textContent = "New Bloc Title";

        app.editor.editingBlocTitle = true;
        title.setAttribute("contenteditable", "true");
        title.theapp = {params:{}};
        title.theapp.params.rootParent = this.theapp.params.blocTarget;
        title.theapp.params.rootParent.draggable = false;
    
        title.onblur = function (e){
            app.editor.editingBlocTitle = false;
            this.removeAttribute("contenteditable");
            this.theapp.params.rootParent.draggable = true;
        };
    }

    // system : close menu
    app.menu.check_current();
};

app.options.clone_element = function(){
    // system : save for undo
    app.editor.save_stat();

    var willClone = app.editor.isClonageAllowed();
    if(willClone == true){
        var ref = this.theapp.params.target;
        var clone = ref.cloneNode(true);
        ref.parentElement.appendChild(clone);
    }
    // system : close menu
    app.menu.check_current();
};

app.options.clear_text = function(e){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    if(target.children.length == 0)
        target.textContent = "";
    // system : close menu
    app.menu.check_current();
};

app.options.add_text = function(e){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    //if(target.textContent == "")
    if(target.childNodes.length == 0)
        target.textContent = "New Text Content";
    // system : close menu
    app.menu.check_current();
};



app.options.show_elemStyles = function(e){
    var target = this.theapp.params.target;
    var styles = app.toolbar.styleList.children;
    for(var i=0; i<styles.length; i++){
        if(target.classList.contains(styles[i].theapp.value))
            styles[i].theapp.selected = false;
        else
            styles[i].theapp.selected = true;
        app.toolbar.toggle_stylelisteOption(styles[i],true);
    }
    // system : close menu
    app.menu.check_current();
};

app.options.remove_unusedStyles = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    var styles = app.toolbar.styleList.children;

    var targetClassList = [...target.classList];
    var allClass = app.toolbar.make_classListFromAllStyleList()
                 + app.engineCSS.builtSysClassList.join(" ");

    var styleTester = document.createElement("FOO");
    styleTester.classList = allClass;

    for(var i=0; i<targetClassList.length; i++)
        if( !styleTester.classList.contains(targetClassList[i]) )
            target.classList.remove(targetClassList[i]);

    // system : close menu
    app.menu.check_current();
};

app.options.clone_parent = function(){
    // system : save for undo
    app.editor.save_stat();

    var parent = this.theapp.params.target.parentElement;
    var blocbodyCLass = app.engineCSS.built.blocbody;
    if(parent !== app.workarea
    && !parent.classList.contains(blocbodyCLass)
    && parent.tagName != "TBODY"){
        var willClone = app.editor.isClonageAllowed();
        if(willClone == true){
            var clone = parent.cloneNode(true);
            parent.parentElement.appendChild(clone);
        }
    }
    // system : close menu
    app.menu.check_current();
};

app.options.select_parent = function(){
    var parent = this.theapp.params.target.parentElement;
    var blocbodyCLass = app.engineCSS.built.blocbody;
    if(parent !== app.workarea
    && !parent.classList.contains(blocbodyCLass)
    && parent.tagName != "TBODY"){
        var freeIndex = app.selections.all.length;
        var selectedStyle = app.engineCSS.built.selected;
        var attributeName = selectedStyle+"_index";
        // selectionne l'element
        parent.classList.add(selectedStyle);
        parent.setAttribute(attributeName,""+freeIndex);
        app.selections.all[freeIndex] = parent;
    }
    // system : close menu
    app.menu.check_current();
};


app.options.add_element = function(){
    // system : save for undo
    app.editor.save_stat();

    var tag = this.theapp.fparams.tag;
    var elem = document.createElement(tag);
    var target = this.theapp.params.target;

    elem.innerText = "New " + tag;
    elem.draggable = true;
    elem.classList.add(
        app.engineCSS.built.editRclick,
        app.engineCSS.built.htmlElem
    );

    // gere le cas : iframe
    app.editor.check_newElement(elem, target);

    // si target est un tag table
    // alors elem dest deviens son enfant tbody
    if(target.tagName == "TABLE")
        target = app.editor.tableTargetManager(elem, target);

    target.appendChild(elem);
    // system : close menu
    app.menu.check_current();
};



app.options.remove_elements = function(){
    // system : save for undo
    app.editor.save_stat();

    var selected = app.selections.all;
    if(selected.length > 0){
        app.selections.clean();
        var editingElem = app.editor.editingElem;
        for(var i=0; i<selected.length; i++){
            // si l'element contient l'element en cours d'edition
            // ou si l'element est l'element en cours d'edition
            if(editingElem)
                if(selected[i] === editingElem
                || app.lib.isDescendantsOf(selected[i], editingElem))
                    // quitte edite mode
                    app.toolbar.buttons.exit.onclick();
                    
            selected[i].parentElement.removeChild(selected[i]);
        }
    }else alert("seul les elements selectionnés peuvent être supprimés");

    // system : close menu
    app.menu.check_current();
};

app.options.copy_elements = function(){
    app.editor.elemsClipboard = app.selections.all;
    if(app.selections.all.length == 0)
        alert("seul les elements selectionnés peuvent être copiés");
    // system : close menu
    app.menu.check_current();
};

app.options.past_elements = function(){
    // system : save for undo
    app.editor.save_stat();

    var selected = app.editor.elemsClipboard;
    var syselemClass = app.engineCSS.built.htmlElem;
    if(selected.length > 0){
        var target = this.theapp.params.target;
        
        if(target.classList.contains(syselemClass))
            if(!app.lib.isContainingOnly_sysElement(target))
                target = target.parentElement;
            
        var editingElem = app.editor.editingElem;
        for(var i=0; i<selected.length; i++){
            var willPast = true;
            // si l'element contient l'element en cours d'edition
            // ou si l'element est l'element en cours d'edition
            if(editingElem)
                if(selected[i] === editingElem
                || app.lib.isDescendantsOf(selected[i], editingElem))
                    willPast = false;
            
            if(willPast) target.appendChild(selected[i].cloneNode(true));
        }
        app.selections.clean();
    }

    // system : close menu
    app.menu.check_current();
};



app.options.define_attribute = function(e){
    var target = this.theapp.params.target;
    var params = {
        target : target
    };
    app.menu.instanciate("defattrib", e.clientX,e.clientY, params);
};

app.options.define_srcAtrrib = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    if(target.tagName == "IMG"
    || target.tagName == "IFRAME")
        target.src = app.toolbar.linkInput.value;
    // system : close menu
    app.menu.check_current();
};

app.options.define_hrefAtrrib = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    if(target.tagName == "A")
        target.href = app.toolbar.linkInput.value;
    // system : close menu
    app.menu.check_current();
};



app.options.copy_code = function(){
    var target = this.theapp.params.target;
    var blocTarget = this.theapp.params.blocTarget;

    // contrainte pour copier
    if( app.editor.runningMode == "NONE"
    && !app.editor.editingBlocTitle
    && app.selections.all.length == 0){

        // Bloc
        if(blocTarget)
            app.lib.stringToClipboard(blocTarget.outerHTML);
        // Elem
        else
            app.lib.stringToClipboard(target.outerHTML);

    }else alert("veillez deselectionner tout les elements," +
                "et desactiver les edit mode (element et titre de bloc)");

    // system : close menu
    app.menu.check_current();
};

app.options.convert_textContentToOuterHTML = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    var DP = new DOMParser();
    var DOC = DP.parseFromString(target.textContent, "text/html");
    target.parentElement.replaceChild(DOC.body.children[0], target);
    // system : close menu
    app.menu.check_current();
};


app.options.transform_divIntoIframe = function(e){
    var target = this.theapp.params.target;
    var params = {
        target : target
    };
    app.menu.instanciate("divtoiframe", e.clientX,e.clientY, params);
};

app.options.divToIframeAsBody = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    var iframe = app.editor.generate_memoIframe();

    var script = app.editor.script_preventDragoverNdropEvent;

    //var body = app.lib.check_textContent(target.textContent);
    var body = target.textContent;

    var style = "style = 'overflow:hidden;' ";
    var doc = "<html "+style+"><head>"+script+"</head><body>"+body+"</body></html>";
    var originalDoc = "<html "+style+"><head></head><body>"+body+"</body></html>";

    var dataURL = "data:text/html;charset=utf-8," + encodeURIComponent(doc);
    var originalDataURL = "data:text/html;charset=utf-8," + encodeURIComponent(originalDoc);

    iframe.src = dataURL;
    iframe.setAttribute("originalDataURL", originalDataURL);
    app.lib.resizeMax_dataUrlIframe(iframe);
    target.parentElement.replaceChild(iframe, target);

    // system : close menu
    app.menu.check_current();
};

app.options.divToIframeAsHtml = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;

    var iframe = app.editor.generate_memoIframe();

    var script = app.editor.script_preventDragoverNdropEvent;

    //var html = app.lib.check_textContent(target.textContent);
    var html = target.textContent;

    var style = "style = 'overflow:hidden;' ";
    var doc = "<html "+style+">"+script+html+"</html>";
    var originalDoc = "<html "+style+">"+html+"</html>";

    var dataURL = "data:text/html;charset=utf-8," + encodeURIComponent(doc);
    var originalDataURL = "data:text/html;charset=utf-8," + encodeURIComponent(originalDoc);

    iframe.src = dataURL;
    iframe.setAttribute("originalDataURL", originalDataURL);
    app.lib.resizeMax_dataUrlIframe(iframe);
    target.parentElement.replaceChild(iframe, target);

    // system : close menu
    app.menu.check_current();
};


app.options.transform_iframeIntoDiv = function(){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    var originalDataURL = target.getAttribute("originalDataURL");
    var src             = target.getAttribute("src");

    if(originalDataURL)
        var dataURL = originalDataURL;
    else if(src)
        if( app.lib.isDataURL(src) )
            var dataURL = src;
    
    if(dataURL){
        var encryptedData = dataURL.split("data:text/html;charset=utf-8,")[1];
        var htmlData = decodeURIComponent(encryptedData);
        var newDiv = document.createElement("DIV");
        newDiv.classList.add(
            app.engineCSS.built.editRclick,
            app.engineCSS.built.htmlElem
        );
        newDiv.textContent = htmlData;
        target.parentElement.replaceChild(newDiv, target);
    }

    // system : close menu
    app.menu.check_current();
};


app.options.copy_text = function(e){
    var target = this.theapp.params.target;
    //var txtNode = this.theapp.params.txtNode;
    var focused = app.lib.find_nearestParentSysElement(target, app.workarea);

    // si focus sur l'element en cours d'edition
    if(focused === app.editor.editingElem){
        var sel = getSelection();
        // si du text est selectionné
        if(!sel.isCollapsed){
            var range = sel.getRangeAt(0);
            var commonAncestor = range.commonAncestorContainer;
            var cloneSelContent = range.cloneContents();
            var childNodes = cloneSelContent.childNodes;
            var htmlCopy = "";
            // creer html text de la selection
            for(var i=0; i<childNodes.length; i++)
                if(childNodes[i].nodeType != 3)
                    htmlCopy += childNodes[i].outerHTML;
                else
                    htmlCopy += childNodes[i].textContent;
            
            // englobe html text avec tout les style des ancetres communs
            var englobe = document.createElement("SPAN");
            englobe.classList = app.lib.get_allAncestorStyles(commonAncestor, focused);
            if(englobe.classList.length != 0){
                englobe.innerHTML = htmlCopy;
                htmlCopy = englobe.outerHTML;
            }
            
            if(htmlCopy != "")
                app.editor.htmlClipboard = htmlCopy;
        }
    }
    // system : close menu
    app.menu.check_current();
}

app.options.past_text = function(e){
    // system : save for undo
    app.editor.save_stat();

    var target = this.theapp.params.target;
    var focused = app.lib.find_nearestParentSysElement(target, app.workarea);
    // si focus sur l'element en cours d'edition
    if(focused === app.editor.editingElem){
        if(app.editor.htmlClipboard){
            var sel = getSelection();
            // si du text est selectionné
            if(!sel.isCollapsed)
                app.toolbar.buttons.cleanStyles.onclick();
            // color le text
            document.execCommand("insertHTML",false,app.editor.htmlClipboard);
        }
    }
    // system : close menu
    app.menu.check_current();
};

app.options.copy_style = function(e){
    var target = this.theapp.params.target;
    var syselem = app.lib.find_nearestParentSysElement(target, app.workarea);
    if(getSelection().toString().length == 0){
        if(target.classList.contains(app.engineCSS.built.usrStyle))
            app.editor.styleClipboard = app.lib.get_allAncestorStyles(target, syselem);
    }
    else
        alert("deselect text and use mouse pointer to copy style");
    
    // system : close menu
    app.menu.check_current();
};

app.options.past_style = function(e){
    // system : save for undo
    app.editor.save_stat();
    
    var target = this.theapp.params.target;
    var txtNode = this.theapp.params.txtNode;
    if(getSelection().toString().length == 0){
        if(app.editor.styleClipboard !== undefined){
            var syselemStyle = app.engineCSS.built.htmlElem;
            if(target.classList.contains(syselemStyle)){
                var newSpan = document.createElement("SPAN");
                newSpan.textContent = txtNode.textContent;
                target.replaceChild(newSpan,txtNode);
                target = newSpan;
            }
            target.classList = app.editor.styleClipboard;
        }
    }
    else
        alert("deselect text and use mouse pointer to past style");

    // system : close menu
    app.menu.check_current();
};