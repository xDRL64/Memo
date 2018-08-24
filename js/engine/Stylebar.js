app.toolbar.init_stylebar = function(){


    // CSS EDITOR (TEXTAREA TAG)
    this.cssEditor = document.getElementById("css_editor");
    // resize CSS EDITOR
    // update toolbar (height)
    this.cssEditor.onmousemove = function(){
        app.toolbar.check_height();
        app.toolbar.resize_styleList();
    };
    // CSS EDITOR perd le focus
    // sauve les style
    this.cssEditor.onblur = function(){
        // remake styles (internal webbrowser process)
        app.toolbar.userStylesTag = app.lib.remake_styleTag(app.toolbar.userStylesTag, this.value);

        // par precaution : attend que le style soit bien charger
        // mais pas sur que cela soit reelement util
        setTimeout(function(){
            app.toolbar.make_styleList(app.toolbar.styleList);
        }, 100);
    };

    // keydown CSS EDITOR
    this.cssEditor.onkeydown = function(e){
        // permet de gerer la touche tabulation
        app.editor._keyEVENT_tabulationFeatures(e,this);
    }

    // charge le contenu du style tag dans l'editeur css
    this.cssEditor.value = this.userStylesTag.textContent;







    // STYLE LIST
    this.styleList = document.getElementById("style_list");
    // drag processus
    this.styleList.ondragstart = function(e){
        e.dataTransfer.setData('text/plain',null);
        app.dragNdrop.fromStyleList = e.target;
    };
    // (drop se deroule dans DragAndDrop.js)
    this.styleList.ondragend = function(e){
        app.dragNdrop.fromStyleList = null;
    };
    // selectionne un style dans la liste
    this.styleList.onmouseup = function(e){
        if(e.target !== this)
            app.toolbar.toggle_stylelisteOption(e.target,e.shiftKey);
    };
    // charge le contenu du style tag dans la style list
    app.toolbar.make_styleList(app.toolbar.styleList);
    app.toolbar.resize_styleList();

};






app.toolbar.make_styleList = function(list){
    // attention les collection change de taille quand on supprime les element qu'elle contiennent
    var oldTab = [...list.childNodes];
    for(var i=0; i<oldTab.length; i++)
        list.removeChild(oldTab[i]);
    

    var sheets = document.styleSheets;
    var userStyles = undefined;
    for(var i=0; i<sheets.length; i++){
        if(sheets[i].title == "user")
            userStyles = sheets[i].cssRules;
    }

    for(var i=0; i<userStyles.length; i++){
        var newstyle = document.createElement("DIV");
        var name = userStyles[i].selectorText;
        newstyle.theapp = {
            value : name.split(".")[1],
            selected : false,
        };
        newstyle.classList = "stylelistOption";
        newstyle.textContent = name;
        newstyle.draggable = false;
        list.appendChild(newstyle);
    }

};

app.toolbar.toggle_stylelisteOption = function(option, multiple=false){
    if(!multiple){
        var list = app.toolbar.styleList;
        for(var i=0; i<list.children.length; i++)
            if(list.children[i] !== option){
                list.children[i].theapp.selected = false;
                list.children[i].style.backgroundColor = "";
                list.children[i].draggable = false;
            }
    }

    option.theapp.selected = !option.theapp.selected;
    if(option.theapp.selected){
        option.style.backgroundColor = "royalblue";
        option.draggable = true;
    }else{
        option.style.backgroundColor = "";
        option.draggable = false;
    }

};

app.toolbar.getSelected_styleList = function(){
    var selected = [];
    var list = app.toolbar.styleList;
    for(var i=0; i<list.children.length; i++)
        if(list.children[i].theapp.selected)
            selected[selected.length] = list.children[i];
    return selected;
};

app.toolbar.resize_styleList = function(){
    this.styleList.style.left = app.toolbar.cssEditor.offsetWidth;
};


app.toolbar.make_classListFromStyleList = function(){
    var selectedStyles = this.getSelected_styleList();
    var newClassList = "";
    for(var i=0; i<selectedStyles.length; i++){
        newClassList += selectedStyles[i].theapp.value+" ";
    }
    return newClassList;
};

app.toolbar.make_classListFromAllStyleList = function(){
    var newClassList = "";
    var list = app.toolbar.styleList;
    for(var i=0; i<list.children.length; i++)
        newClassList += list.children[i].theapp.value + " ";
    return newClassList;
};