app.selections.init = function(){
    this.all = [];

    app.editor.lastFocus = document.body;
    app.editor.currentFocus = document.body;

};


//ancienement app.workarea.onmouseup
//a besoin de l'objet "e" (event) pour fonctionner
app.selections.do_selection = function(e){
    var syselemStyle = app.engineCSS.built.htmlElem;
    var selectedStyle = app.engineCSS.built.selected;
    var freeIndex = app.selections.all.length;
    var attributeName = selectedStyle+"_index";
    var mode = app.editor.runningMode;
    
    // click gauche obligatoir
    if(e.button == 0)

    // si click sur sys element
    if(e.target.classList.contains(syselemStyle)){

        // si l'element n'est pas encore selectionné
        if(!e.target.classList.contains(selectedStyle)){
            // si on maintien pas la touche L_Shift
            // annuler selection multiple
            if(!e.shiftKey){
                app.selections.clean();
                freeIndex = 0;
            }
            // si edit mode desactivé
            if(mode == "NONE"
            // ou si edit mode activé mais click n'est pas sur l'element edité
            || mode == "HTMLTEXT" && e.target!==app.editor.editingElem
            // ou si edit mode activé et click est pas sur l'element edité mais que shift est pressée
            || mode == "HTMLTEXT" && e.target===app.editor.editingElem && e.shiftKey ){
                // selectionne l'element
                e.target.classList.add(selectedStyle);
                e.target.setAttribute(attributeName,""+freeIndex);
                app.selections.all[freeIndex] = e.target;
            }
                
        // si l'element deja selectionné
        // deselection
        }else{
            // si la touche shift est pressée
            // retire l'element de la selection multiple
            if(e.shiftKey){
                // trouve l'index a supprimer
                var index = parseInt(e.target.getAttribute(attributeName),10);
                // retire class et attribu de l'element html
                e.target.classList.remove(selectedStyle);
                e.target.removeAttribute(attributeName);
                e.target.style.backgroundColor = "";
                // re-index les element (modifie attribu)
                for(var i=index+1; i<freeIndex; i++)
                    app.selections.all[i].setAttribute(attributeName,""+(i-1));
                // retire un element de app.selections.all
                var leftAll = app.selections.all.slice(0, index);
                var rightAll = app.selections.all.slice(index+1);
                var newAll = leftAll.concat(rightAll);
                app.selections.all = newAll;
                
                // si on ne maintien pas la touche L_Shift
                // deselectionne tout
            }else{
                app.selections.clean();
            }
        }

    // si click sur workarea
    }else{
        // deselectionne tout (click dans le vide)
        app.selections.clean();
    }
}


app.editor.lastElemClicked = null;
app.editor.editingBlocTitle = false;
app.editor.ACTION_mouseUpOnMemo = function(that, e){
    if(!app.editor.editingBlocTitle)
        app.editor.lastElemClicked = e.target;
    app.editor.lastClickEvent = e;
};


app.editor.ACTION_focusingManager = function(){
    var usrStyleClass = app.engineCSS.built.usrStyle;
    var bloctitleClass = app.engineCSS.built.bloctitle;
    var selectedClass = app.engineCSS.built.selected;

    var lastElemClicked = app.editor.lastElemClicked

    if(lastElemClicked){

        app.editor.lastFocus = app.editor.currentFocus;

        // si lastElemClicked est un element de workarea
        if(app.lib.isDescendantsOf(app.scrollview, lastElemClicked)){

            app.editor.currentFocus = app.workarea;

            // permet de conserver le focus sur editingElem
            if(app.editor.lastFocus === app.editor.editingElem
            && lastElemClicked === app.editor.editingElem)
                app.editor.currentFocus = app.editor.editingElem;
            // permet de conserver le focus sur un title bloc
            if(app.editor.lastFocus.classList.contains(bloctitleClass)
            && lastElemClicked.classList.contains(bloctitleClass))
                app.editor.currentFocus = app.editor.lastFocus;

            // si workarea avait deja le focus avant ce click
            if(app.editor.lastFocus === app.workarea){

                // permet le focus sur editingElem ou bloc title
                if(lastElemClicked === app.editor.editingElem
                || lastElemClicked.classList.contains(bloctitleClass))
                    app.editor.currentFocus = lastElemClicked;
                else if(lastElemClicked.classList.contains(usrStyleClass)){
                    var parent = app.lib.find_nearestParentSysElement(lastElemClicked, app.workarea);
                    if(parent === app.editor.editingElem)
                        app.editor.currentFocus = parent;
                }

            }
            
            // si on a une selection et qu'on perd le focus sur workarea
            // en clickant par exemple sur toolbar
            // on ne veut pas perdre la selection en recuperant le focus sur workarea
            if(app.editor.lastFocus === app.workarea
            || app.editor.lastFocus === app.editor.editingElem){
                // effectue selection
                app.selections.do_selection(app.editor.lastClickEvent);

                // donne le focus a workarea au cas ou c'est editingElem qui vient d'etre selectionné
                if(app.editor.editingElem)
                if(app.editor.editingElem.classList.contains(selectedClass))
                    app.editor.currentFocus = app.workarea;
            }
            
        }else app.editor.currentFocus = lastElemClicked;
        
        // for other process
        //app.editor.save_lastElemClicked = app.editor.lastElemClicked;

        app.editor.clickTextbarButtonsGiveFocusOnEditingElem(lastElemClicked);

        app.editor.lastElemClicked = null;
        app.editor.currentFocus.focus();
    }

};


app.editor.clickTextbarButtonsGiveFocusOnEditingElem = function(lastElemClicked){
    if(lastElemClicked === app.toolbar.buttons.cleanStyles
    || lastElemClicked === app.toolbar.buttons.addInStyles
    || lastElemClicked === app.toolbar.buttons.addOutStyles
    || lastElemClicked === app.toolbar.buttons.addLink
    || lastElemClicked === app.toolbar.buttons.removeLink)
        app.editor.currentFocus = app.editor.editingElem;
}



// key left/up right/down
// deplace l'element selectionné dans le parent
// workarea onkeydown delegate
app.editor.ACTION_arrowkeySelection = function(that, e){
    LOG(document.activeElement)
    var mode = app.editor.runningMode;
    if(app.selections.all.length == 1)
    if(mode == "NONE" || mode == "HTMLTEXT" && document.activeElement === app.workarea)
    if(!document.activeElement.classList.contains(app.engineCSS.built.bloctitle))
    {

        // obtien la position de l'element selectionné,
        // en %, par rapport a la hauteur du contenu de scrollview
        // _getVSP est juste un nom abregé pour 'app.editor.get_verticalScrollPercent'
        var _getVSP = app.editor.get_verticalScrollPercent;
                       
        var currentScrollPos = app.scrollview.scrollTop;

        var elem = app.selections.all[0];
        var prev = elem.previousElementSibling;
        var next = elem.nextElementSibling;

        // deplace l'element
        var arrowKey=false;
        if(e.code == "ArrowLeft"  || e.code == "ArrowUp")
            if(prev){
                elem.parentElement.insertBefore(elem,prev);
                arrowKey = true;
            }
        if(e.code == "ArrowRight" || e.code == "ArrowDown")
            if(next){
                next.insertAdjacentElement("afterend", elem);
                arrowKey = true;
            }

        // deplace le scrolling
        if(arrowKey){
            // positions apres deplacement de l'element selectionné
            var elemPosPercent = _getVSP(elem,app.scrollview);
            // pourcentage equivalent a la hauteur de elem par rapport scrollview total content height
            var heightElem = app.lib.getHeightElemWithMargin(elem);
            var hElemPercent = heightElem / (scrollview.scrollHeight/100);
            // deplacement equivalent pour la scrollbar avec la difference de pourcentage contenu dans elemPosPercent
            var oneScrollPercent = (app.scrollview.scrollTopMax/100)
            var moveScroll = oneScrollPercent * elemPosPercent;
            
            // prend en compte la hauteur de l'elem et sa position par
            // rapport a la moitier du scrolling. pour ajuster parfaitement le scrolling
            var scrollSide = (moveScroll <= app.scrollview.scrollTopMax/2) ? -1 : +1;
            // [up side : -1] ; [down side : +1]
            var sideSens = scrollSide;
            var offsetHelem = oneScrollPercent * hElemPercent * sideSens;

            // replace le scrolling
            app.scrollview.scrollTo(0,moveScroll+offsetHelem);
        }
        
        // desactive le scroling automatique du navigateur
        if(document.activeElement === app.workarea)
            e.preventDefault();
    }
}




// anim color selection
app.selections.anim = function(val){
    // in  val :  0.0 -> 1.0
    // out val : -128 -> 128
    val = ((val - 0.5) * 2) * 128;
    val = parseInt(val);

    var all = app.selections.all;
    for(var i=0; i<all.length; i++){
        all[i].style.backgroundColor = "";
        var styles = getComputedStyle(all[i]);
        var c = app.lib.getRgbaTab_fromCSSstring(styles.backgroundColor);
        var color = "rgb("+(c[0]+val)+","+(c[1]+val)+","+(c[2]+val)+")";
        all[i].style.backgroundColor = color;
    }
};



// libere la liste des element selection
// clean les element selection (class et autre attribut)
app.selections.clean = function(){
    var selectedStyle = app.engineCSS.built.selected;
    var all = [...app.workarea.getElementsByClassName(selectedStyle)];
    var attributeName = selectedStyle+"_index";
    for(var i=0; i<all.length; i++){
        all[i].classList.remove(selectedStyle);
        all[i].removeAttribute(attributeName);
        all[i].style.backgroundColor = "";
    }
    this.all = [];
};






