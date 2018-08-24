/***********************************/
/*** *** *** ENGINE FILE *** *** ***/
/***********************************/


app.rightClick.init = function(){
    // init right click event
    app.workarea.oncontextmenu = function(e){
        
        app.rightClick.free = true;

        if(e.target.classList.contains(app.engineCSS.built.editRclick)){
            
            // manage on workarea
            if(app.rightClick.free) app.rightClick.workareaAction(e);
            
            // manage on bloc
            if(app.rightClick.free) app.rightClick.blocAction(e);

            // manage on element
            if(app.rightClick.free) app.rightClick.elementAction(e);
            
        }
    }
}

app.rightClick.workareaAction = function(e){
    if(e.target === app.workarea){
        e.preventDefault();
        e.stopPropagation();
    
        // build les parametre du menu
        var params = {
            target : app.workarea
        };
    
        // créer un menu avec une liste d'option
        app.menu.instanciate("onworkarea", e.clientX,e.clientY, params);
        app.rightClick.free = false;
    }
};


app.rightClick.elementAction = function(e){

    var mode = app.editor.runningMode;

    // si right click sur un syselem
    var targetStyle;
    if(e.target.classList.contains(app.engineCSS.built.htmlElem)
    && e.target === e.explicitOriginalTarget)
        targetStyle = "syselem";
    // ou si right click sur une descence d'un syselem
    if(e.target.classList.contains(app.engineCSS.built.usrStyle)){
        var nearestSyselemParent = app.lib.find_nearestParentSysElement(e.target, app.workarea);
        targetStyle = "userstyle";
    }
    
    if(!e.altKey){
        e.preventDefault();
        e.stopPropagation();

        // si txt edit mode desactivé
        if(mode == "NONE"
        // ou si txt edit mode activé
        // mais que right click n'est pas sur du text
        // et que right click n'est pas sur l'element edité
        || mode == "HTMLTEXT"
        && targetStyle == "syselem"
        && e.target !== app.editor.editingElem){

            // build les parametre du menu
            var params = {
                target : nearestSyselemParent? nearestSyselemParent : e.target
            };
            // créer un menu avec une liste d'option
            app.menu.instanciate("onelement", e.clientX,e.clientY, params);
            app.rightClick.free = false;
        }
        
        // si right click sur du user text style
        if(targetStyle == "userstyle"
        // ou si right click sur text node
        || e.explicitOriginalTarget.nodeType == 3)
            // si l'edit text mode est actif
            if(mode == "HTMLTEXT"){
                // build les parametre du menu
                var params = {
                    target : e.target,
                    txtNode : e.explicitOriginalTarget
                };
                // créer un menu avec une liste d'option
                app.menu.instanciate("ontext", e.clientX,e.clientY, params);
                app.rightClick.free = false;
            }
            
    }
    
    
};

app.rightClick.blocAction = function(e){
    // n'affiche pas le menu si un bloc title est en train d'etre edité
    if(app.editor.editingBlocTitle == true){
        app.rightClick.free = false;
        return;
    }

    // get engine css
    var engineCSS = app.engineCSS.built;
    // verifie que c'est bien un bloc ou un bloc component
    if(e.target.classList.contains(app.engineCSS.built.blocsys)){
        // find root of bloc
        var blocRoot = app.bloc.find_root(e.target);
        
        if(blocRoot.classList.contains(engineCSS.root)){
            e.stopPropagation();
            e.preventDefault();

            // build les parametre du menu
            var params = {
                blocTarget : blocRoot,
                titleTarget : blocRoot.getElementsByClassName(engineCSS.bloctitle)[0],
                target : blocRoot.getElementsByClassName(engineCSS.blocbody)[0],
            };

            // créer un menu avec une liste d'option
            app.menu.instanciate("onbloc", e.clientX,e.clientY, params);
            app.rightClick.free = false;
        }
    }
    
};