app.dragNdrop.init = function(){

    this.fromStyleList = null;
    
    this.currentDrag = null;
    this.currentDest = null;
    this.currentType = null;

    var dropdestClass = app.engineCSS.built.dropdest;
    

    app.workarea.ondragstart = function(e){ console.log("dragstart",e.dataTransfer);//e.preventDefault();
        e.dataTransfer.setData('text/plain',null);
        app.dragNdrop.currentDrag = e.target;
    };

    app.workarea.ondragend = function(e){console.log("dragend",e.dataTransfer);
        app.dragNdrop.currentDrag = null;
        app.dragNdrop.currentDest = null;
        app.dragNdrop.currentType = null;
        var dropdested = document.getElementsByClassName(dropdestClass);
        for(var i=0; i<dropdested.length; i++){
            dropdested[i].classList.remove(dropdestClass);
        }
    };


    app.workarea.ondragover = function(e){
        e.preventDefault();
    };

    app.workarea.ondragenter = function(e){

        // files case (dans le cas de fichier draggé)
        // si le drag contien que des fichier, on quitte la fonction
        console.log("dragenter",e)
        var areTheyAllFile = true;
        console.log("dragenter : data",e.dataTransfer.items.length);
        for(var i=0; i<e.dataTransfer.items.length; i++)
            if(e.dataTransfer.items[0].kind != "file"){
                areTheyAllFile = false;
                break;
            }
        if(areTheyAllFile){
            console.log("dragenter : file")
            return;
        } 



        // style case (dans le cas de style draggé from style list (de la toolbar))
        if(app.dragNdrop.fromStyleList !== null) return;


        // dans le cas ou le drag n'est pas des fichier
        // execute la fonction normalement


        var blocsysClass = app.engineCSS.built.blocsys;
        var htmlElemClass = app.engineCSS.built.htmlElem;
        var target = e.target;
        var maybeText = e.explicitOriginalTarget
        
        
        //console.log(e.explicitOriginalTarget);
        //console.log(target);
        
        // si un element html sous le curseur (pas une textNode)
        if(target.nodeType == 3)
            target = target.parentElement;

        // en survalant un element avec le drag,
        // on quitte les precedent element survolé
        if(app.dragNdrop.currentDest != null){
            app.dragNdrop.currentDest.classList.remove(dropdestClass);
            app.dragNdrop.currentDest = null;
            app.dragNdrop.currentType = null;
        }






        // !!! todo les tag a et span de text edit peuvent avoir une classlist undefined




        
        // si current drag est un sysbloc
        if(app.dragNdrop.currentDrag.classList.contains(blocsysClass)){
            // si drop dest est un sysbloc
            if(target.classList.contains(blocsysClass)){
                var blocRoot = app.bloc.find_root(target);
                var tmpTarget = blocRoot;
            }else{

                var isBloc = app.bloc.hasBlocParents(target);
                // si drop dest n'est pas workarea
                // c'est que drop dest est dans un bloc
                if(isBloc[0] !== app.workarea){
                    var tmpTarget = isBloc[0];
                }
            }

            // si drop dest est un sysbloc
            // ou si drop dest est dans un sysbloc
            if(tmpTarget){
                // sysbloc drag et sysbloc dest sont pas le meme
                if(tmpTarget !== app.dragNdrop.currentDrag)
                    app.dragNdrop.currentType = "fromBLOCtoBLOC";
                // sinon annule tout deplacement
                else
                    tmpTarget = null;
            // si drop dest n'est ni un bloc ni dans un bloc
            }else
                // drop dest peut-etre sur un syselem
                if(isBloc[1]){
                    app.dragNdrop.currentType = "fromBLOCtoELEM";
                    var tmpTarget = isBloc[1];
                }
            
            // si drop dest n'a pas pu etre determiner comme etant soit :
            // un bloc, ou dans un bloc, ou un syselem hors d'un bloc
            if(tmpTarget === null || tmpTarget === undefined)
                // currentDest sera null
                tmpTarget = null;
            else
                // montre currentDest
                tmpTarget.classList.add(dropdestClass);

            // affect currentDest
            app.dragNdrop.currentDest = tmpTarget;
            
        }



        // si current drag est un element html
        if(app.dragNdrop.currentDrag.classList.contains(htmlElemClass)){
            // si drop dest est un sysbloc
            if(target.classList.contains(blocsysClass)){
                var blocBody = app.bloc.find_body(target);
                // si le sysbloc dest n'est pas le parent direct de l'element drag
                if(app.dragNdrop.currentDrag.parentElement !== blocBody){
                    app.dragNdrop.currentDest = blocBody;
                    blocBody.classList.add(dropdestClass);
                    app.dragNdrop.currentType = "NORMAL";
                }
            }else{

                // si elem dest est une balise pour du style
                // alors elem dest devient son plus proche syselem parent
                if(target !== app.workarea)
                    if(!target.classList.contains(htmlElemClass)){
                        var result = app.lib.find_nearestParentSysElement(target,app.workarea);
                        if(result.classList.contains(htmlElemClass))
                            target = result.parentElement;
                    }

                // si elem dest est workarea
                if(target === app.workarea
                // ou si elem dest est un element html
                || target.classList.contains(htmlElemClass)){
                    // si elem dest n'est pas workarea
                    // si elem dest ne contient pas que des syselem
                    // alors son parent de elem dest
                    if(target !== app.workarea)
                        if(!app.lib.isContainingOnly_sysElement(target))
                            target = target.parentElement;
                    // si elem drag et elem dest sont pas le meme
                    if(target !== app.dragNdrop.currentDrag
                    // et si elem dest n'est pas le parent direct de l'elem drag
                    && app.dragNdrop.currentDrag.parentElement !== target){
                        // et si elem dest n'est pas une descendance de elem drag
                        if(!app.lib.isDescendantsOf(app.dragNdrop.currentDrag, target)){
                            app.dragNdrop.currentDest = target;
                            target.classList.add(dropdestClass);
                            app.dragNdrop.currentType = "NORMAL";
                        }
                    }
                }

            }
        }

    };



    app.workarea.ondrop = function(e){
        // system : save for undo
        app.editor.save_stat();
        
        e.preventDefault();

        // syselement et sysbloc
        var currentDrag = app.dragNdrop.currentDrag;
        var currentDest = app.dragNdrop.currentDest;
        if(currentDrag != null && currentDest != null){
            if(app.dragNdrop.currentType == "fromBLOCtoBLOC"
            || app.dragNdrop.currentType == "fromBLOCtoELEM"){
                // DROP
                currentDest.parentElement.insertBefore(currentDrag, currentDest);
            }else if(app.dragNdrop.currentType == "NORMAL"){
                // table tag exception :
                //   si elem dest est un element de tableau
                //   currentDest est modifier
                if(currentDest.tagName == "TABLE"
                || currentDest.tagName == "TBODY"
                || currentDest.tagName == "TR")
                    currentDest = app.editor.tableTargetManager(currentDrag, currentDest);
                // DROP
                currentDest.appendChild(currentDrag);
            }
        }

        // file(s)
        var htmlElemClass = app.engineCSS.built.htmlElem;
        if(currentDrag == null){
            if(e.dataTransfer.files.length > 0){
                if(e.target.classList.contains(htmlElemClass))
                    if(e.target.tagName == "IMG"
                    || e.target.tagName == "IFRAME"){
                        app.dragNdrop.checkingNloading(e.target, e.dataTransfer);
                    }
            }
        }


        // style from list of toolbar
        if(currentDrag == null){
            if(app.dragNdrop.fromStyleList !== null){
                if(e.target.classList.contains(htmlElemClass)){
                    //var style = app.dragNdrop.fromStyleList.theapp.value;
                    var styles = app.toolbar.getSelected_styleList();
                    var selectedStyle = app.engineCSS.built.selected;
                    // si l'element qui recoi le style, est selectionné
                    // le style s'applique a tout les elements selectionnés
                    if(e.target.classList.contains(selectedStyle)){
                        // pour chaque element selectionné
                        for(var i=0; i<app.selections.all.length; i++)
                            // pour chaque style selectionné
                            for(var ii=0; ii<styles.length; ii++)
                                app.selections.all[i].classList.toggle(styles[ii].theapp.value);
                    }
                    else{
                        // pour chaque style selectionné sur l'element selectionné
                        for(var ii=0; ii<styles.length; ii++)
                            e.target.classList.toggle(styles[ii].theapp.value);
                    }
                        
                }
            }
        }



    };



    
};

// si iframe ? save les file names dans une globvar
app.dragNdrop.checkingNloading = function(elem, data){
    this.params_addFromBase = {
        base : elem,
    };
    var imgType = app.dragNdrop.imgType; // from Editor.js
    if(elem.tagName == "IMG")
        if(app.transfer.checkAllType(data.items, "image/", imgType))
            app.transfer.load_file(data.files, "readAsDataURL", this.addFromBase);
    
    var webType = app.dragNdrop.webType;
    if(elem.tagName == "IFRAME")
        if(app.transfer.checkAllType(data.items, "text/", webType))
            app.transfer.get_iframeSize(data.files, function(){
                app.transfer.load_file(data.files, /*"readAsBinaryString"*/"readAsText", app.dragNdrop.hardcode_CSSnJS);
            });
        
};



app.dragNdrop.addFromBase = function(list_src, originalDataURLs, size=undefined){
    var base = app.dragNdrop.params_addFromBase.base;
    var lastElem = base;
    var elem;
    for(var i=0; i<list_src.length; i++){
        if(i == 0)
            elem = base;
        else{
            var newElem = base.cloneNode(true);
            lastElem.insertAdjacentElement("afterend", newElem);
            lastElem = newElem;
            elem = newElem;
        }

        elem.src = list_src[i];
        if(originalDataURLs)
            elem.setAttribute("originalDataURL", originalDataURLs[i]);
        if(size){
            elem.style.width  = size[i].w;
            elem.style.height = size[i].h;
        }
    }
    
};



app.dragNdrop.hardcode_CSSnJS = function(list_docTxt, params){
    var list_doc = [];
    var DP = new DOMParser();

    for(var i=0; i<list_docTxt.length; i++)
        list_doc[i] = DP.parseFromString(list_docTxt[i], "text/html");

    var params = { docs : list_doc };
    app.builder.resourceFormater(true, list_doc, app.transfer.docsToDataURL, params);
};








//transition: height 0.5s;
app.dragNdrop.lastdest = null;
app.dragNdrop.destAnim = function(val){

    val = parseInt(val * 360);

    var lastdest = app.dragNdrop.lastdest;
    if(lastdest){
        app.dragNdrop.cleanDropdestStyles(lastdest);

        app.dragNdrop.lastdest = null;
    }

    if(app.dragNdrop.currentDest){
        var dest = app.dragNdrop.currentDest;
        dest.style.border = "8px solid transparent";
        dest.style.borderImage = "linear-gradient("+val+"deg, #3acfd5 0%, #3a4ed5 100%) 1 round";
        dest.style.transition = "borderImage 0.1s";

        app.dragNdrop.lastdest = dest;
    }
};

app.editor.cleanDropdest = function(rootElem){
    var dropdestClass = app.engineCSS.built.dropdest;
    var dropdested = [...rootElem.getElementsByClassName(dropdestClass)];
    for(var i=0; i<dropdested.length; i++){
        dropdested[i].classList.remove(dropdestClass);
        app.dragNdrop.cleanDropdestStyles(dropdested[i]);
    }
};

app.dragNdrop.cleanDropdestStyles = function(elem){
    elem.style.border = "";
    elem.style.borderImage = "";
    elem.style.transition = "";
};