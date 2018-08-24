app.toolbar.init_textbar = function(){

    // TEXTBAR
    this.textbar = document.getElementById("textbar");
    this.textbar.theapp = {};
    this.textbar.theapp.defHeight = parseInt(getComputedStyle(this.textbar).height);
    this.textbar.style.marginTop = "-"+(2*this.textbar.theapp.defHeight)+"px";
    this.check_height(false);

    // BUTTONS
    this.buttons = {
        exit : document.getElementById("toolbar_exit"),
        cleanStyles : document.getElementById("cleanStyles"),
        addInStyles : document.getElementById("addInStyles"),
        addOutStyles : document.getElementById("addOutStyles"),
        addLink : document.getElementById("addLink"),
        removeLink : document.getElementById("removeLink")
    };





    // open/close routine for animation
    //this.textbar.theapp = {};
    this.textbar.ontransitionstart = function(){
        this.theapp.routine = setInterval(function(){
            app.toolbar.check_height();
        },50);
    };
    this.textbar.ontransitionend = function(){
        clearInterval(this.theapp.routine);
    };




    // OPEN/CLOSE TEXTBAR
    ////////////////////////////////
    app.editor.runningMode = "NONE";
    // OPEN (double click sur text de syselem)
    app.workarea.ondblclick = function(e){
        // get la node double clické qu'elle soit text ou element
        var target = e.explicitOriginalTarget;

        // verifie que la node double clicked est dans workarea
        if(app.lib.isDescendantsOf(app.workarea, target)){
            // verifie que le mode d'edition n'est actif sur aucun autre element
            if(app.editor.runningMode === "NONE"){
                // si la node est du text
                if(target.nodeType == 3){
                    var syselemParent = app.lib.find_nearestParentSysElement(target, app.workarea);
                    var draggableParents = app.lib.getTab_allDraggableParent(syselemParent, app.workarea);
                    app.editor.runningMode = "HTMLTEXT";
                    app.lib.setDraggable_tabElem(draggableParents, false);
                    app.editor.draggableElemsToRestor = draggableParents;

                    app.toolbar.textbar.style.marginTop = "0px";

                    syselemParent.contentEditable = true;
                    syselemParent.draggable = false;
                    syselemParent.classList.add(app.engineCSS.built.txtEdit);
                    app.editor.editingElem = syselemParent;
                }
            }
        }
    };
    // CLOSE (click sur boutton quit)
    this.buttons.exit.onclick = function(){
        if(app.editor.runningMode === "HTMLTEXT"){
            app.editor.runningMode = "NONE";
            var draggableParents = app.editor.draggableElemsToRestor;
            app.lib.setDraggable_tabElem(draggableParents, true);
            app.editor.draggableElemsToRestor = [];
    
            app.toolbar.textbar.style.marginTop = "-"+(2*app.toolbar.textbar.theapp.defHeight)+"px";
    
            app.editor.editingElem.contentEditable = false;
            app.editor.editingElem.draggable = true;
            app.editor.editingElem.classList.remove(app.engineCSS.built.txtEdit);

            app.lib.removeIllegalBR(app.editor.editingElem);
            app.editor.editingElem = null;
        }
    }






    // BUTTON : CLEAN STYLE
    this.buttons.cleanStyles.onclick = function(e){
        // system : save for undo
        app.editor.save_stat();

        // seulement si il y a une selection de text
        if(getSelection().toString().length > 0){
            // bold puis removeformat permet de casser les node text meme si il n'y a pas de style a la base
            document.execCommand("bold");
            document.execCommand("removeFormat",false);
    
            // re-selection le text mais avec l'ancre et le focus sur 
            // la textNode venant de subir le removeFormat
            var sel = getSelection();

            if(sel.anchorNode !== sel.focusNode)
                if(sel.anchorOffset != 0){
                    var newAnchor = app.lib.getNextTextNodeAfter(sel.anchorNode, app.editor.editingElem);
                    if(newAnchor)
                        sel.setBaseAndExtent(newAnchor,0, sel.focusNode,sel.focusOffset);
                }
        }
    };

    
    // BUTTON : ADD IN STYLE
    this.buttons.addInStyles.onclick = function(e){
        // system : save for undo
        app.editor.save_stat();

        var newClassList = app.toolbar.make_classListFromStyleList();
        // obtien le text de la selection
        var select = getSelection();
        var selectRange = select.getRangeAt(0);
        var selectProps = app.toolbar.get_selectionProperties(selectRange);
        var mainParent = selectProps.mainParent;

        // test si la selection est dans le sys elem en train d'etre edité
        var anElem = app.lib.find_nearestParentSysElement(mainParent);
        if(anElem === app.editor.editingElem)
            var willAddStyle = true;
        else
            var willAddStyle = false;
        
        if(willAddStyle)
        // si il y a des style selection
        // et si il y a du text selectionné
        if(newClassList != ""
        && select.toString().length > 0){
            var editRclickClass = app.engineCSS.built.editRclick;
            var usrStyleClass = app.engineCSS.built.usrStyle;
            
            var keepSelectClass = app.engineCSS.built.keepSelect;

            // termine la string de tout les nom de style
            newClassList += editRclickClass +" "+ usrStyleClass +" "+ keepSelectClass;
            // creer le model de span avec tout les style de newClassList
            var modelSpan = document.createElement("SPAN");
            modelSpan.classList = newClassList;
            
            
            // si la selection est entierement dans la meme node text
            if(mainParent.nodeType == 3){
                var node = app.toolbar.makeOneNodeInSelect(selectProps, modelSpan);
                var pos = node.textContent.length;
                //replace le curseur (editingElem recuper le focus grace a app.editor.ACTION_focusingManager);
                select.setBaseAndExtent(node,pos,node,pos);
                // si la selection n'est pas entierement dans la meme node text
            }else{
                var children = mainParent.childNodes;
                for(var i=0; i<children.length; i++){
    
                    // si trouve l'elem qui contien le debut de la selection
                    if(children[i] === selectProps.firstElem){
                        var firstElemFound = true;
                        continue;
                    }

                    if(firstElemFound){
                        if(children[i] === selectProps.lastElem)
                            break;
                        else{
                            // si l'elem dans la selection n'est pas une textNode
                            if(children[i].nodeType != 3){
                                // cherche les nodes qu'il contient
                                // et process l'encapsulation par le style, sur les nodes trouvées
                                app.toolbar.checkNmakeNodeInSelect(children[i], selectProps, modelSpan);
                            }else
                                app.toolbar.textNodeIntoElem(children[i], modelSpan);
                        }
                    }
                }
                // si l'elem qui contien le debut de la selection n'est pas une textNode
                // cherche les nodes qu'il contient
                // et process l'encapsulation par le style, sur les nodes trouvées
                if(selectProps.firstElem.nodeType != 3)
                    app.toolbar.checkNmakeNodeInSelect(selectProps.firstElem, selectProps, modelSpan);
                app.toolbar.makeFirstNodeInSelect(selectProps, modelSpan);

                if(selectProps.lastElem.nodeType != 3)
                    app.toolbar.checkNmakeNodeInSelect(selectProps.lastElem, selectProps, modelSpan);
                var lastnode = app.toolbar.makeLastNodeInSelect(selectProps, modelSpan);
                var lastpos = lastnode.textContent.length;
                //replace le curseur (editingElem recuper le focus grace a app.editor.ACTION_focusingManager);
                select.setBaseAndExtent(lastnode,lastpos,lastnode,lastpos);

            }
            
        }
    };



    // BUTTON : ADD OUT STYLE
    this.buttons.addOutStyles.onclick = function(e){
        // system : save for undo
        app.editor.save_stat();

        var newClassList = app.toolbar.make_classListFromStyleList();
        // obtien le text de la selection
        var select = getSelection();

        // si il y a des style selectionné
        // et si il y a du text selectionné
        if(newClassList != ""
        && select.toString().length > 0){
            var editRclickClass = app.engineCSS.built.editRclick;
            var usrStyleClass = app.engineCSS.built.usrStyle;
            var keepSelectClass = app.engineCSS.built.keepSelect;

            // termine la string de tout les nom de style
            newClassList += editRclickClass +" "+ usrStyleClass +" "+ keepSelectClass;


            var selectRange = select.getRangeAt(0);
            var clone_htmlTxtSelected = selectRange.cloneContents();
            var childNodes = clone_htmlTxtSelected.childNodes;
            var allOuterHTML = "";
            for(var i=0; i<childNodes.length; i++){
                if(childNodes[i].nodeType != 3)
                    allOuterHTML += childNodes[i].outerHTML;
                else
                    allOuterHTML += childNodes[i].textContent;
            }
            var newContentTag = document.createElement("SAPN");
            newContentTag.innerHTML = allOuterHTML;
            newContentTag.classList = newClassList;
            var selectionModified = newContentTag.outerHTML;
            //app.toolbar.buttons.cleanStyles.onclick();
            document.execCommand("delete");
            document.execCommand("insertHTML",false,selectionModified);

        }
    };





    // BUTTON : ADD LINK
    this.buttons.addLink.onclick = function(e){
        // system : save for undo
        app.editor.save_stat();

        if(getSelection().toString().length > 0){
            var link = app.toolbar.linkInput.value;
            document.execCommand("unlink");
            document.execCommand("createLink", false, link);
        }
    };
    // BUTTON : REMOVE LINK
    this.buttons.removeLink.onclick = function(e){
        // system : save for undo
        app.editor.save_stat();
    
        if(getSelection().toString().length > 0)
            document.execCommand("unlink");
    };

};



// workare onkeydown delegate
app.editor.ACTION_enterkeyTextEdit = function(that, e){
    if(e.keyCode == 13
    && document.activeElement === app.editor.editingElem){
        e.preventDefault();

        var docSelect = getSelection();
        var select = [docSelect.anchorNode,docSelect.anchorOffset,
                      docSelect.focusNode,docSelect.focusOffset];
        // si il n'y a pas de selection text
        if(docSelect.toString.length == 0
        && select[0] === select[2]){
            
            var textNode = select[0];
            var text = textNode.textContent;
            var cursor = select[1]

            var A_str = text.substring(0,cursor);
            var B_str = text.substring(cursor);
            var C_str = A_str + "\n" + B_str;

            textNode.textContent = C_str;

            var newCursorPos = cursor + 1;
            docSelect.setBaseAndExtent(textNode,newCursorPos, textNode,newCursorPos);
        }
    }
};



app.toolbar.get_selectionProperties = function(selectRange){
    var mainParent = selectRange.commonAncestorContainer;
    var firstTxt = selectRange.startContainer;
    var firstPos = selectRange.startOffset;
    var lastTxt = selectRange.endContainer;
    var lastPos = selectRange.endOffset;

    var firstElem = app.editor.getElemBeforeStopElem(firstTxt, mainParent);
    var lastElem = app.editor.getElemBeforeStopElem(lastTxt, mainParent);

    return {
        mainParent : mainParent,
        firstTxt : firstTxt,
        firstPos : firstPos,
        lastTxt : lastTxt,
        lastPos : lastPos,
        firstElem : firstElem,
        lastElem : lastElem,
        range : selectRange
    };
};


app.toolbar.tell_nodeImplicationInSelection = function(node, selectProps){

    var range = selectProps.range;
    // si entieremenet selectionné
    if(range.isPointInRange(node,0)
    && range.isPointInRange(node,node.textContent.length))
        return "in";
    // sinon si contient le debut de la selection
    else if(node === selectProps.firstTxt)
        return "first";
    // sinon si contient la fin de la selection
    else if(node === selectProps.lastTxt)
        return "last";
    // sinon ne fait pas parti de la selection
    else
        return "out";
}

app.toolbar.textNodeIntoElem = function(txtNode, elemModel){
    var newSpan = elemModel.cloneNode();
    var txtNodeParent = txtNode.parentElement;
    txtNodeParent.insertBefore(newSpan,txtNode);
    newSpan.appendChild(txtNode);
};

app.toolbar.makeFirstNodeInSelect = function(selectProps, elemModel){
                        
    var txtNode = selectProps.firstTxt;
    var nodeTxt = txtNode.textContent;
    var offset = selectProps.firstPos;

    var stayTxtPart = nodeTxt.substring(0,offset);
    var selectTxtPart = nodeTxt.substring(offset);
    var stayTxtNode = document.createTextNode(stayTxtPart);
    var selectTxtNode = document.createTextNode(selectTxtPart);
    var newElem = elemModel.cloneNode();
    newElem.appendChild(selectTxtNode);

    var parent = txtNode.parentElement;
    parent.insertBefore(stayTxtNode, txtNode);
    parent.insertBefore(newElem, txtNode);
    parent.removeChild(txtNode);
};

app.toolbar.makeLastNodeInSelect = function(selectProps, elemModel){
                        
    var txtNode = selectProps.lastTxt;
    var nodeTxt = txtNode.textContent;
    var offset = selectProps.lastPos;

    var stayTxtPart = nodeTxt.substring(offset);
    var selectTxtPart = nodeTxt.substring(0,offset);
    var stayTxtNode = document.createTextNode(stayTxtPart);
    var selectTxtNode = document.createTextNode(selectTxtPart);
    var newElem = elemModel.cloneNode();
    newElem.appendChild(selectTxtNode);

    var parent = txtNode.parentElement;
    parent.insertBefore(newElem, txtNode);
    parent.insertBefore(stayTxtNode, txtNode);
    parent.removeChild(txtNode);

    return selectTxtNode;
};

app.toolbar.makeOneNodeInSelect = function(selectProps, elemModel){
                        
    var txtNode = selectProps.mainParent;
    var parent = txtNode.parentElement;
    var nodeTxt = txtNode.textContent;
    var firstOffset = selectProps.firstPos;
    var lastOffset = selectProps.lastPos;

    if(firstOffset != 0){
        var leftPart = nodeTxt.substring(0,firstOffset);
        var leftNode = document.createTextNode(leftPart);
        parent.insertBefore(leftNode,txtNode);
    }

    var middlePart = nodeTxt.substring(firstOffset,lastOffset);
    var middleNode = document.createTextNode(middlePart);
    var newElem = elemModel.cloneNode();
    newElem.appendChild(middleNode);
    parent.insertBefore(newElem,txtNode);

    if(lastOffset != nodeTxt.length){
        var rightPart = nodeTxt.substring(lastOffset);
        var rightNode = document.createTextNode(rightPart);
        parent.insertBefore(rightNode,txtNode);
    }

    parent.removeChild(txtNode);

    return middleNode;
};

app.toolbar.checkNmakeNodeInSelect = function(mainParent, selectProps, elemModel){
    var allTxtNodes = app.lib.getAllTextNodeOf(mainParent);
    for(var iNode=0; iNode<allTxtNodes.length; iNode++){
        var implication = app.toolbar.tell_nodeImplicationInSelection(allTxtNodes[iNode], selectProps);
        if(implication == "in")
            app.toolbar.textNodeIntoElem(allTxtNodes[iNode], elemModel);
    }
}





app.toolbar.hardCleanSelection = function(){

    //var newClassList = app.toolbar.make_classListFromStyleList();
    // obtien le text de la selection
    var select = getSelection();

    // si il y a des style selectionné
    // et si il y a du text selectionné
    if(/*newClassList != "" && */select.toString().length > 0){
        //var editRclickClass = app.engineCSS.built.editRclick;
        //var usrStyleClass = app.engineCSS.built.usrStyle;
        //var keepSelectClass = app.engineCSS.built.keepSelect;

        // termine la string de tout les nom de style
        //newClassList += editRclickClass +" "+ usrStyleClass +" "+ keepSelectClass;


        var selectRange = select.getRangeAt(0);
        var clone_htmlTxtSelected = selectRange.cloneContents();
        var childNodes = clone_htmlTxtSelected.childNodes;
        var allOuterHTML = "";
        for(var i=0; i<childNodes.length; i++){
            if(childNodes[i].nodeType != 3)
                allOuterHTML += childNodes[i].innerText;
            else
                allOuterHTML += childNodes[i].textContent;
        }
        //var newContentTag = document.createElement("SAPN");
        //newContentTag.innerHTML = allOuterHTML;
        //newContentTag.classList = newClassList;
        var selectionModified = allOuterHTML;
        //app.toolbar.buttons.cleanStyles.onclick();
        //document.execCommand("delete");
        selectRange.deleteContents();
        document.execCommand("insertHTML",false,selectionModified);

        
    }
};