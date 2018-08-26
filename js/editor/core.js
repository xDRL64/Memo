



app.bloc.create = function(){

    // get engine css
    var _E = app.engineCSS.built;

    // créer les element qui compose un bloc
    var blocborder = document.createElement("DIV");
    blocborder.classList.add(_E.blocBorder,
        _E.editRclick, _E.blocsys, _E.root);
    blocborder.draggable = true;

    var bloc = document.createElement("DIV");
    bloc.classList.add(_E.bloc,
        _E.editRclick, _E.blocsys);

    var bloctitle = document.createElement("DIV");
    bloctitle.classList.add(_E.blocTitle,
        _E.editRclick, _E.blocsys, _E.bloctitle);

    var blocbodyborder = document.createElement("DIV");
    blocbodyborder.classList.add(_E.blocBorder,
        _E.editRclick, _E.blocsys);

    var blocbody = document.createElement("DIV");
    blocbody.classList.add(_E.blocBody,
        _E.editRclick, _E.blocsys, _E.blocbody);

    // assemble les element qui composent un bloc
    blocborder.appendChild(bloc);
    bloc.appendChild(bloctitle);
    bloc.appendChild(blocbodyborder);
    blocbodyborder.appendChild(blocbody);

    return blocborder;
};




app.bloc.find_root = function(blocComponent){
    var engineCSS = app.engineCSS.built;
    var o = blocComponent;
    while(!o.classList.contains(engineCSS.root)){
        o = o.parentElement;
        if(o === app.workarea) break;
    }
    return o;
};


app.bloc.find_body = function(blocComponent){
    var engineClass = app.engineCSS.built.blocbody;
    var blocRoot = this.find_root(blocComponent);
    if(blocRoot.classList.contains(app.engineCSS.built.root)){
        var blocBody = blocRoot.getElementsByClassName(engineClass)[0];
        return blocBody;
    }
};

// retourn workarea et l'element avant workarea, si trouve rien
// sinon retourne la racine du bloc trouvé
app.bloc.hasBlocParents = function(elem, stopSearchingElem=app.workarea){
    var rootStyle = app.engineCSS.built.root;
    var o = elem;
    while(o !== stopSearchingElem){

        if(o.classList.contains(rootStyle))
            break;

        if(o.parentElement === stopSearchingElem)
            var lastElem = o;
        
        o = o.parentElement;
    }

    if(!lastElem)
        return [o];
    else
        return [o, lastElem];
};




// remonte ses anscetres jusqu'a stopSearchingElem
// retourne le derniere element avant stopSearchingElem
// retourne workarea si stopSearchingElem n'est pas un anscetre de elem
app.editor.getElemBeforeStopElem = function(elem, stopSearchingElem){
    var o = elem;
    while(o !== stopSearchingElem){

        if(o.parentElement === stopSearchingElem)
            var lastElem = o;
        
        o = o.parentElement;

        if(stopSearchingElem && o === app.workarea)
            return app.workarea;
    }

    if(!lastElem)
        return o;
    else
        return lastElem;
};


app.editor.script_preventDragoverNdropEvent =
    "<SCRIPT type='text/javascript'>" +
        "document.ondragover = function(e){e.preventDefault();};" +
        "document.ondrop = function(e){e.preventDefault();};" +
    "</SCRIPT>";

app.editor.iframeDefaultScript =
    "Veuillez dropper le contenu dans la marge de l'iframe" +
    "<SCRIPT type='text/javascript'>" +
        "document.ondragover = function(e){e.preventDefault();};" +
        "document.ondrop = function(e){e.preventDefault();};" +
        "document.body.style.backgroundColor = 'red';" +
    "</SCRIPT>";



app.editor.check_newElement = function(elem, target){
    if(elem.tagName == "IFRAME"){
        var dataURL = "data:text/html;charset=utf-8," + encodeURIComponent(this.iframeDefaultScript);
        elem.src = dataURL;
        return;
    }

    app.editor.tableDefaultHtmlCode = 
        "<tbody class='"+app.engineCSS.built.htmlElem+"'></tbody>";
    if(elem.tagName == "TABLE"){
        elem.border = "1";
        elem.innerHTML = app.editor.tableDefaultHtmlCode;
        return;
    }
};




app.editor.generate_memoIframe = function(){
    var iframe = document.createElement("IFRAME");
    iframe.textContent = "New IFRAME";
    iframe.draggable = true;
    iframe.classList.add(
        app.engineCSS.built.editRclick,
        app.engineCSS.built.htmlElem
    );
    return iframe;
};











app.editor.statsave = null;
app.editor.save_stat = function(){
    app.editor.statsave = app.workarea.cloneNode(true);
};

app.editor.load_stat = function(){
    // attention a l'ordre des instruction dans cette fonction
    //////////////////////////////////////////////////////////
    // clean txt editing content systems (bloctitle & textbar)
    app.autosave.cleanWorkareaClone(app.editor.statsave);
    // load stat
    app.workarea.innerHTML = app.editor.statsave.innerHTML;
    // ferme la textbar
    app.toolbar.buttons.exit.onclick();
    // clean les selections savé
    app.selections.clean();
    // clean eventuel dropdest
    app.editor.cleanDropdest(app.workarea);
};



app.editor.tableTargetManager = function(elem, target){

    if(target.tagName == "TR")
        target = target.parentElement.parentElement;

    if(target.tagName == "TBODY")
        target = target.parentElement;

    if(target.tagName == "TABLE"){
        
        var tbody = target.getElementsByTagName("TBODY")[0];

        if(!tbody){
            alert("table ne contient pas de tbody");
            return target;
        }

        if(elem.tagName == "TR")
            return tbody;

        var rows = tbody.getElementsByTagName("TR");
        // si tbody ne contient pas de ligne
        // vide et retourne tbody
        if(rows.length == 0){
            tbody.textContent = "";
            return tbody;
        // si tbody n'est pas vide
        }else{
            // pour chaque ligne du tableau
            for(var i=0; i<rows.length; i++){
                var cells = rows[i].getElementsByTagName("TD");
                // si la ligne n'a pas de cell
                // vide et retourne la ligne
                if(cells.length == 0){
                    rows[i].textContent = "";
                    return rows[i];
                }
            }
        }

        // default
        return tbody;

    }
    // default
    return target;

};


app.editor.isClonageAllowed = function(){
    if(app.editor.runningMode != "NONE"){
        alert("impossible de cloner. un element est en train d'être edité");
        return false;
    }
    if(app.selections.all.length > 0){
        alert("impossible de cloner. un ou plusieurs elements sont selectionnés");
        return false;
    }
    return true;
};


/*
// converti la hauteur de elem en valeur equivale dans l'espace de la scrollbar de scrollElem
app.editor.get_verticalScrollOffset = function(elem, scrollElem){
    // get la hauteur total du contenu de scrollElem
    var h_scroll = scrollElem.scrollHeight;
    // divise cette hauteur par 100 pour obtenir 1% en pixel
    var onePercentOf_hScrollContent = h_scroll / 100;
    // assure la propriete boxSizing:border-box pour le calcule de la hauteur de elem
    var tmpsaveprop = elem.style.boxSizing;
    elem.style.boxSizing = "border-box";
    // get la hauteur en pixel de l'elem dans scrollElem
    var h_elem = parseInt( getComputedStyle(elem).height );
    // restor prop boxSizing de elem
    elem.style.boxSizing = tmpsaveprop;
    // calcule le pourcentage de la hauteur de elem par rapport au contenu total de scrollElem 
    var h_elemPercents_of_hScrollContent = h_elem / onePercentOf_hScrollContent;
    // divise la valeur maximum du scoll de scrollElem par 100 pour obtenir un 1% du max
    // puis multiplie par le pourcentage 'h_elemPercents_of_hScrollContent'
    // = la valeur necessaire pour scroller un element d'une hauteur de 'elem' (en pixel)
    var result = (scrollElem.scrollTopMax/100) * h_elemPercents_of_hScrollContent

    return result;
};*/
// converti la hauteur de elem en valeur equivale dans l'espace de la scrollbar de scrollElem
app.editor.get_verticalScrollPercent = function(elem, scrollElem){
    // get la hauteur total du contenu de scrollElem
    var h_scroll = scrollElem.scrollHeight;
    // get la position top de elem dans la hauteur total de scrollElem
    var y_elemPos = elem.offsetTop;
    // calcule le pourcentage de y_elemPos dans h_scroll
    var onePercentHscroll = h_scroll / 100;
    var yElemPercentOfHscroll = y_elemPos / onePercentHscroll;

    return yElemPercentOfHscroll;
};








app.lib.HTMLemptyElementList = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];









app.lib.check_textContent = function(content){
    fixed = "";
    for(var i=0; i<content.length; i++)
        if(content.charCodeAt(i) != 160)
            fixed += content.charAt(i);
        else
            fixed += "\t";
            //fixed += " ";
    return fixed;
};






app.lib.getHeightElemWithMargin = function(elem){
    // assure la propriete boxSizing:border-box pour le calcule de la hauteur de elem
    var tmpsaveprop = elem.style.boxSizing;
    elem.style.boxSizing = "border-box";
    // calcule les styles
    var styles = getComputedStyle(elem);
    // calcule la hauteur
    var marginT = parseInt(styles.marginTop);
    var marginB = parseInt(styles.marginBottom);
    var height =  parseInt(styles.height) + marginT + marginB;
    // restor prop boxSizing de elem
    elem.style.boxSizing = tmpsaveprop;
    return height;
};


app.lib.isDescendantsOf = function(elem, childToTest){
    if(childToTest.nodeType == 3)
        childToTest = childToTest.parentElement;
    childToTest.classList.add("_ENGNIE-potentialDescendants");
    var child = elem.getElementsByClassName("_ENGNIE-potentialDescendants")[0];
    childToTest.classList.remove("_ENGNIE-potentialDescendants");
    if(child == undefined) return false;
    else return true;
};

// return true si elem contien au moins une textnode
app.lib.isContainingTextNode = function(elem){
    for(var i=0; i<elem.childNodes.length; i++)
        if(elem.childNodes[i].nodeType == 3){
console.log(elem.childNodes[i])
            return true;
        }
    return false;
};


// return true si elem contien que des syselem
// return true si elem contien ne contien rien
app.lib.isContainingOnly_sysElement = function(elem){
    var childNode = elem.childNodes;
    var syselemClass = app.engineCSS.built.htmlElem;
    for(var i=0; i<childNode.length; i++){
        if(childNode[i].nodeType == 3)
            return false;
        if(childNode[i].nodeType == 1)
            if(!childNode[i].classList.contains(syselemClass))
                return false;
    }
    return true;
};





/*
app.editor.instanciate = function(type, elem){

};
*/





/*
app.lib.getSize_textNode = function(node){
    var span = document.createElement("SPAN");
    var nodeclone = node.cloneNode(true);
    span.appendChild(nodeclone);
    span.style.position = "fixed";
    span.style.bottom = window.innerHeight;
    span.style.whiteSpace = "pre";
    document.body.appendChild(span);
    var spanrect = span.getBoundingClientRect();
    var w = spanrect.width;
    var h = spanrect.height;
    //document.body.removeChild(span);
    console.log(spanrect);
    return { w:w, h:h };
}*/

app.lib.getSize_textNode = function(node){
    var parentclone = node.parentElement.cloneNode(true);
    parentclone.style.position = "fixed";
    parentclone.style.display  = "inline";
    parentclone.style.margin   = "0px";
    parentclone.style.padding  = "0px";
    parentclone.style.left     = "auto";
    parentclone.style.right    = "auto";
    parentclone.style.top      = "auto";
    parentclone.style.bottom   = window.innerHeight;
    document.body.appendChild(parentclone);
    var spanrect = parentclone.getBoundingClientRect();
    var w = spanrect.width;
    var h = spanrect.height;
    document.body.removeChild(parentclone);
    return { w:w, h:h };
};




app.lib.find_nearestParentSysElement = function(node, stopSearchingElem=document.body){
    if(node.nodeType == 3)
        var o = node.parentElement;
    else
        var o = node;
    var syselemclass = app.engineCSS.built.htmlElem;
    while(!o.classList.contains(syselemclass)
    &&     o !== stopSearchingElem){
        o = o.parentElement;
    }
    return o;
};


app.lib.getTab_allDraggableParent = function(elem, stopSearchingElem=document.body, dragVal=true){
    var o = elem.parentElement;
    var result = [];
    while(o !== stopSearchingElem){
        if(o.draggable === dragVal)
            result[result.length] = o;
        o = o.parentElement;
    }
    return result;
};

app.lib.setDraggable_tabElem = function(tab,value){
    tab.forEach(function(anElem){
        anElem.draggable = value;
    });
};

app.lib.htmlStructureToArray = function(htmlStruct){
    var result = [];
    for(var i=0; i<htmlStruct.length; i++)
        result[i] = htmlStruct[i];
    return result;
};

app.lib.removeIllegalBR = function(elem){
    var BRclass = app.engineCSS.built.BR;
    var BRcollec = elem.getElementsByTagName("BR");
    //var BRtab = this.htmlStructureToArray(BRcollec);
    var BRtab = [...BRcollec];
    //console.log(BRcollec);
    //var size = BRcollec.length;
    for(var i=0; i<BRtab.length; i++)
        if(!BRtab[i].classList.contains(BRclass))
            BRtab[i].parentElement.removeChild(BRtab[i]);
        
};

app.lib.convert_BRtoTextNode = function(elem){
    var BRcollec = elem.getElementsByTagName("BR");
    var BRtab = [...BRcollec];

    for(var i=0; i<BRtab.length; i++){
        var new_NextLineTextNode = document.createTextNode("\n");
        //BRtab[i].parentElement.insertBefore(new_NextLineTextNode, BRtab[i]);
        var parent = BRtab[i].parentElement;
        parent.appendChild(new_NextLineTextNode);
        parent.removeChild(BRtab[i]);
    }
};

app.lib.DOMdocumentToString = function(DOMdoc){
    var xmlSrlz = new XMLSerializer();
    var str = xmlSrlz.serializeToString(DOMdoc);
    //var loop = true;
    while(last != str){
        var last = str;
        str = str.replace('xmlns=\"http://www.w3.org/1999/xhtml\"','');
    }
    return str;
};

/*
app.lib.removeAllTextOccurrence = function(str,occ){
    while(str != str.replace(occ,"")){}
};
*/

app.lib.isDataURL = function(str){
    if(str[0] == 'd' && str[1] == 'a' && str[2] == 't'
    && str[3] == 'a' && str[4] == ':') return true;
    return false;
};



app.lib.getRgbaTab_fromCSSstring = function(color){

    var isRGBA = false;
    if(color[3] == 'a') isRGBA = true;

    // si RGBA
    if(isRGBA){
        var regEx = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
        var match = regEx.exec(color);
        if (match !== null)
            return [
                parseInt(match[1]),
                parseInt(match[2]),
                parseInt(match[3]),
                parseInt(match[4]),
            ];
    // si RGB
    }else{
        var regEx = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
        var match = regEx.exec(color);
        if (match !== null)
            return [
                parseInt(match[1]),
                parseInt(match[2]),
                parseInt(match[3])
            ];
    }

    return false;
};




app.lib.remake_styleTag = function(styleTag, value=""){
    var cloneStyleTag = styleTag.cloneNode();
    cloneStyleTag.textContent = value;
    styleTag.parentElement.replaceChild(cloneStyleTag, styleTag);

    cloneStyleTag.sheet.disabled = false;
    
    return cloneStyleTag
};





app.lib.getAllTextNodeOf = function(node){
    var result = [];
    if(node){
        node = node.firstChild;
        while(node != null){
            if(node.nodeType == 3)
            	result[result.length]=node;
            else
            	result = result.concat(this.getAllTextNodeOf(node));
            node= node.nextSibling;
        }
    }
    return result;
}











app.lib._DEBUG_getNextTextNodeAfter = function(txtnode, stopSearchingElem=app.workarea){
    while(txtnode){
        txtnode = app.lib.getNextTextNodeAfter(txtnode, stopSearchingElem);
        LOG(txtnode);
    }
}


app.lib.getNextTextNodeAfter = function(txtnode, stopSearchingElem=app.workarea){

    if(txtnode.nextSibling != null)
        return this.nextElemScaning(txtnode.nextSibling, stopSearchingElem);

    return this.getNextParentSibling(txtnode, stopSearchingElem);
};



app.lib.nextElemScaning = function(node, stopElem){

    if(node.nodeType == 3)
        return node;

    return this.nextElemSearching(node, stopElem);
}

app.lib.nextElemSearching = function(node, stopElem){

    if(node.firstChild != null)
        return this.nextElemScaning(node.firstChild, stopElem);

    if(node.nextSibling != null)
        return this.nextElemScaning(node.nextSibling, stopElem);

    return this.getNextParentSibling(node, stopElem);
    
}

app.lib.getNextParentSibling = function(node, stopElem){
    var node = this.nextParentSiblingSearching(node, stopElem);

    if(node === stopElem)
        return undefined;
    
    return this.nextElemScaning(node, stopElem);
};

app.lib.nextParentSiblingSearching = function(node, stopElem){
    if(node.parentElement === stopElem)
        return stopElem;

    if(node.parentElement.nextSibling != null)
        return node.parentElement.nextSibling;
    else
        return this.nextParentSiblingSearching(node.parentElement, stopElem);
};





// classList of node inclu
// classList of stopElem exclu
// si trouve rien, retourne ""
// accept les textNode pour startElem
app.lib.get_allAncestorStyles = function(startElem, stopElem=app.workarea){
    if(startElem.nodeType == 3) startElem = startElem.parentElement;

    if(startElem !== stopElem){
        var o = startElem;
        var styleCollector = document.createElement("SPAN");
        this.add_AllStyleOfClassList(startElem.classList, styleCollector);
        while(o !== stopElem){
            if(o.parentElement !== stopElem)
                this.add_AllStyleOfClassList(o.parentElement.classList, styleCollector);
            o = o.parentElement;
        }
        return styleCollector.classList;
    }
    return "";
}

// ajoute tout les style de classList dans elem.classList
app.lib.add_AllStyleOfClassList = function(classList, elem){
    for(var i=0; i<classList.length; i++)
        elem.classList.add(classList[i]);
};

app.lib.checkClassList_userStyle = function(elem){
    var editRclickClass = app.engineCSS.built.editRclick;
    var usrStyleClass = app.engineCSS.built.usrStyle;

    if(!elem.classList.contains(editRclickClass))
        elem.classList.add(editRclickClass);

    if(!elem.classList.contains(usrStyleClass))
        elem.classList.add(usrStyleClass);
}




app.lib.stringToClipboard = function(str){
    var txtarea = document.createElement("TEXTAREA");
    txtarea.style.height      = "0px";
    txtarea.style.width       = "0px";
    txtarea.style.margin      = "0px";
    txtarea.style.padding     = "0px";
    txtarea.style.borderWidth = "0px";
    txtarea.style.opacity     = "0";
    txtarea.style.position    = "fixed";
    txtarea.style.overflow    = "hidden";
    txtarea.value = str;
    document.body.appendChild(txtarea);
    txtarea.select();
    document.execCommand("copy");
    setTimeout(function(){
        txtarea.parentElement.removeChild(txtarea);
    },50);
};






app.lib.resizeMax_dataUrlIframe = function(iframe){

    var tmp_iframe = document.createElement("IFRAME");
    tmp_iframe.theapp = {
        iframe : iframe,
    };

    var dataUrl = iframe.src.split("data:text/html;charset=utf-8,")[1];
    var htmlData = decodeURIComponent(dataUrl);

    tmp_iframe.onload = function(){
        var App = this.theapp;

        var styles_showAll = "white-space: nowrap; overflow: hidden; width: -moz-fit-content;"
        this.contentDocument.documentElement.style = styles_showAll;
        this.contentDocument.body.style = styles_showAll;

        var styles = getComputedStyle(this.contentDocument.documentElement);
        // retarde la suite a cause de getComputedStyle qui met du temps a s'executer
            var that = this;
            setTimeout(function(){
                App.iframe.style.width  = Math.ceil(parseFloat(styles.width))  + "px";
                App.iframe.style.height = Math.ceil(parseFloat(styles.height)) + "px";
                that.parentElement.removeChild(that);
            },50);

    };
    document.body.appendChild(tmp_iframe);
    tmp_iframe.srcdoc = htmlData;

};





/*app.lib.areFilesAvailable = function(){
    var o = new XMLHttpRequest();
    o.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == "200"){}
    };
    o.overrideMimeType("application/text");
    o.open('GET', src, true);
    o.send(null);
};*/

app.lib.isFileAvailable = function(path){

    // verifie le chemin d'access au fichier
    // si le path utilise le protocole File:///
    if(path.split("file:///").length > 1){
        var docUrlBroken = document.URL.split("/");
        docUrlBroken.pop();
        var docUrlwithoutMemoEditorFileName = docUrlBroken.join("/");
        var isPathAvailable = path.split(docUrlwithoutMemoEditorFileName);
        // si le chemin est accessible
        if(isPathAvailable.length > 1)
            path = "."+isPathAvailable[1];
        else
            return false;
    }

    // verifie la presence du fichier
    var o = new XMLHttpRequest();
    o.overrideMimeType("application/text");
    o.open('GET', path, false);
    o.send(null);
    LOG("o.readyState : "+o.readyState);
    if (o.readyState == 4 /*&& o.status == "200"*/)
        return true;
    else{
        LOG("notgood : "+path);
        
        return false;
    }
};










app.lib.revome_children = function(parent){
    while(parent.firstChild) parent.removeChild(parent.firstChild);
};

app.lib.revome_childrenButExclude = function(parent,excludeds){
    var staticChildrenArray = [...parent.childNodes];
    var toExclude;
    for(let child of staticChildrenArray){
        toExclude = false;
        for(let excluded of excludeds)
            toExclude = child===excluded? true : toExclude;
        
        if(!toExclude) parent.removeChild(child);
    }
};













app.lib.tagFinder = function(htlmStr){
    var tagTxt = htlmStr.match(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/);
    
    if(!tagTxt) return null;

    var iChar  = htlmStr.indexOf(tagTxt);
    
    return {
        tag : tagTxt[0],
        i   : iChar
    };
};

app.lib.isBodyOpenTag = function(htmlStr){
    return htmlStr.test(/< *body[ *\/>]/i);
};
app.lib.isBodyCloseTag = function(htmlStr){
    return htmlStr.test(/< *\/ *body[ *>]/i);
};



app.lib.check_commentsAndDoctype = function(htmlPart){
    var rgx = /<!(?:(--)((?:.|\s)*)-->|(DOCTYPE))/;
    var res = htmlPart.text.match(rgx);
    if(res){
        if(res[1] == '--')
            htmlPart.type = 'comment';
        else if(res[3] == 'DOCTYPE')
            htmlPart.type = 'doctype';
    }
};

app.lib.generate_htmlPart = function(htmlStrPart){
    var rgx = new RegExp('^< *(\\/?) *(\\w+)[ *\\/>]','i');
    var res = htmlStrPart.match(rgx);
    var htmlPart;
    if(res)
        htmlPart = {
            type : 'tag',
            tag  : htmlStrPart,
            name : res[2].toUpperCase(),
            side : res[1]=='' ? 'start':'end'
        };
    else{
        htmlPart = {
            type : 'text',
            text : htmlStrPart
        };
        this.check_commentsAndDoctype(htmlPart);
    }
    return htmlPart;
};



app.lib.get_htmlStrParts = function(str){
    // match tout entre "< ... >" et tout entre "> ... <"
    // (match tag et texte)
    // sources :
    //https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags
    var rgx = new RegExp(`(?:<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|(?:[^<>]*))`,'gm');
    return str.match(rgx);
};



app.lib.generate_htmlParts = function(htmlStr){
    var htmlStrParts = this.get_htmlStrParts(htmlStr);
    var htmlParts = [];
    for(let htmlStrPart of htmlStrParts){
        let htmlPart = this.generate_htmlPart(htmlStrPart);
        htmlParts.push(htmlPart);
    }
    return htmlParts;
};


app.lib.DOMParser = function(htmlStr){
    var ES6DP = new DOMParser(htmlStr);
    var HTMLdoc = ES6DP.parseFromString(htlmStr,'text/html');
    //var htmlTag = HTMLdoc.documentElement;
    this.revome_children(HTMLdoc.head);
    this.revome_children(HTMLdoc.body);
    var htmlParts = this.generate_htmlParts(htmlStr);

};



app.lib.tidyUpHtml = function(htmlParts, DOM){
    var current = DOM;
    var htmlTag = DOM.documentElement;
    var headTag = DOM.head;
    var bodyTag = DOM.body;
    var step    = 'inFile' || 'inHtml' || 'inHead' || 'headBody' || 'inBody' || 'afterBody' || 'afterHtml';

    var isHEADorBODY = function(tagName){
        return tagName=="HEAD" || tagName=="BODY"
    };

    var inFileStepRules = function(htmlPart){
        if(htmlPart.type == 'tag'){
            if(htmlPart.name == "HTML"){
                current = htmlTag;
                step = 'inHtml';
            }
        }
        else if(htmlPart.type == "text")
            overBodyText += htmlPart.text;
        else if(htmlPart.type == "comment")
            continue;
    };


    var overBodyText = "";
    for(let htmlPart of htmlParts){

        if(step == 'inFile') inFileStepRules(htmlPart);

    }

};

app.lib.get_htmlPartsBySide = function(htmlParts, side){
    var output = [];
    for(let htmlPart of htmlParts)
        if(htmlPart.type=='tag' && htmlPart.side == side)
            output.push(htmlPart);
};











app.lib.strSplitOnlyWithFirst = function(str, occ){
    var oLen = occ.length;
    var iChar = str.indexOf(occ);
    var iSlice = iChar + oLen;
    var firstPartWithOcc = str.substr(0,iSlice);
    var secondPartWithoutOcc = str.substr(iSlice);
    var firstPartWithoutOcc = firstPartWithOcc.split(occ)[0];
    //if(firstPartWithoutOcc+occ+secondPartWithoutOcc === str) console.log("strsplitOnlyWithFirst : √");
    return [firstPartWithoutOcc,secondPartWithoutOcc];
};






