app.autosave.init = function(){

    sessionStorage.mainURL = document.URL;


    // stat = "ON" || "OFF"
    // win : utilisable depuis popoup (pour "OFF")
    this.routine = function(stat, win){
        if(stat == "ON"){
            this.routineRef = window.setInterval(function(){
                app.autosave.save();
            },1000*this.secfreq);
        }
        if(stat == "OFF"){
            var w = win? win : window;
            w.clearInterval(w.app.autosave.routineRef);
            w.app.autosave.routineRef = undefined;
        }
    }




    this.secfreq = 1;
    this.freqElem = document.getElementById("freq_save");
    this.freqElem.onchange = function(){
        if(this.valueAsNumber < 1
        || Number.isNaN(this.valueAsNumber)){
            app.autosave.secfreq = 1;
            this.value = 1;
        }
        else{
            app.autosave.secfreq = this.valueAsNumber;
        }
        // si autosave est acive
        // update la frequence de la routine autosave
        if(app.autosave.routineRef){
            app.autosave.routine("OFF");
            app.autosave.routine("ON");
        }
    }




    // recupere l'element de la case a cocher pour l'autosave
    this.inputElem = document.getElementById("autosave");

    // garanti l'autosave sur off quand l'editeur demarre
    this.inputElem.checked = false;

    // l'event de la case a cocher
    this.inputElem.onchange = function(e){
        // si l'autosave est active
        if(this.checked == true){
            // ouvre le popup de rappel que l'autosave est active 
            app.autosave.secwin = app.autosave.instanciate_popup("?popup=save");

            // lance une routine pour effectuer l'autosave a interval regulier
            app.autosave.routine("ON");

            // premiere autosave effectuée
            app.autosave.save();
            
            // destroy deleteButton si il existe
            app.autosave.remove_deleteButton();

        // si l'autosave est inactive
        }else{
            app.autosave.destroy(window);
        }
    }

    this.remove_deleteButton = function(){
        if(this.deleteButton){
            this.deleteButton.parentElement.removeChild(this.deleteButton);
            this.deleteButton = undefined;
        }
    };

    this.remove_loadButton = function(){
        if(this.loadButton){
            this.loadButton.parentElement.removeChild(this.loadButton);
            this.loadButton = undefined;
        }
    };

    // DELETE BUTTON
    this.deleteButton = document.getElementById("delete_autosave");
    this.deleteButton.onclick = function(){
        app.autosave.destroy(window);
        app.autosave.remove_loadButton();
        app.autosave.remove_deleteButton();
        app.autosave.inputElem.disabled = false;
    };

    // LOAD BUTTON
    // si une autosave existe deja
    // alors creer un bouton pour poposer de la loader
    if(localStorage.workarea !== undefined){
        // desactive l'input pour l'activation de l'autosave
        this.inputElem.disabled = true;
        // button load autosave
        this.loadButton = document.createElement("INPUT");
        this.loadButton.type = "button";
        this.loadButton.value = "Load AutoSave";
        this.loadButton.onclick = function(){

            // LOADING DATA
            app.workarea.innerHTML = localStorage.workarea;
            app.toolbar.cssEditor.value = localStorage.cssEditor;
            app.toolbar.prefCssEditor.value = localStorage.prefCssEditor;
            
            // ferme la textbar
            app.toolbar.buttons.exit.onclick();
            
            // annule les selections apres le loading data
            // (clean les selections autosavé) 
            app.selections.clean();

            // enable sheet
            // update style list
            app.toolbar.cssEditor.onblur();

            // enable sheet
            app.toolbar.prefCssEditor.onblur();

            app.autosave.remove_loadButton();
            app.autosave.inputElem.disabled = false;
        };
        this.inputElem.parentElement.insertBefore(this.loadButton,this.inputElem);
    }else{
        this.remove_deleteButton();
    }

};


app.autosave.cleanWorkareaClone = function(clone){
    var editElem = clone.getElementsByClassName(app.engineCSS.built.txtEdit)[0];
    if(editElem){
        editElem.contentEditable = false;
        editElem.classList.remove(app.engineCSS.built.txtEdit);
        editElem.draggable = true;
        var draggableParents = app.lib.getTab_allDraggableParent(editElem, clone, false);
        app.lib.setDraggable_tabElem(draggableParents,true);
    }

    var editBlocTitle = clone.querySelector(
        "."+app.engineCSS.built.bloctitle+'[contenteditable="true"]'
    );
    if(editBlocTitle){
        editBlocTitle.removeAttribute("contenteditable");
        var rootParent = app.bloc.find_root(editBlocTitle);
        rootParent.draggable = true;
    }
};




app.autosave.alert_max = false;
app.autosave.save = function(){
    var workareaClone = app.workarea.cloneNode(true);

    app.autosave.cleanWorkareaClone(workareaClone);

    try{
        localStorage.workarea = workareaClone.innerHTML;
        localStorage.cssEditor = app.toolbar.cssEditor.value;
        localStorage.prefCssEditor = app.toolbar.prefCssEditor.value;
        this.alert_max = false;
        this.showInPopup();
        console.log("Autosave Done !");
    }catch(err){
        if(this.alert_max == false){
            this.alert_max = true;
            alert("AutoSave : needs more free space !\n"+err.name+"\n"+err.message+"\n\n"+
                  "about:config\n"+"dom.storage.default_quota");
        }
    }
}



// instancie un popup d'autosave
app.autosave.instanciate_popup = function(afertURL){

    // creer et ouvre le popup
    // set name + size
    var newWindow = window.open(
        document.URL+afertURL,
        "newWindow", "width=256,height=256");

    // chargement du popup
    newWindow.onload = function(){
        // met le background en vert claire.
        // (cette couleur signal au user que le popup
        // est parfaitement lié a l'editeur en cours d'execution)
        this.document.body.style.backgroundColor = "lightgreen";
        // lors de app.autosave.save() dans app.autosave.inputElem.onchange
        // showInPopup() ne pourra pas afficher le display 'autosave done!'
        // alors on l'affiche une fois que le popup est load
        this.opener.app.autosave.showInPopup();
    };

    // si close popup
    // deconnect la ref secwin dans main window
    newWindow.onbeforeunload = function(){
        this.opener.app.autosave.secwin = null;
    };

    // si close ou refresh main window
    // deconnect la ref opener dans le popup
    window.onbeforeunload = function(){
        if(app.autosave.secwin){
            app.autosave.secwin.opener = null;
            app.autosave.secwin.name = "";
            app.autosave.secwin.document.body.style.backgroundColor = "red";
        }
    };

    return newWindow;
};




app.autosave.destroy = function(win){
    // si memo n'a pas encore ete fermé ou refresh
    if(win){
        // reset le flag pour alerter que max size de autosave est atteint
        win.app.autosave.alert_max = false;
        // rester check box autosave
        if(win.app.autosave.inputElem){
            win.app.autosave.inputElem.checked = false;
        }
        // ferme le popup de rappel que l'autosave est active 
        if(win.app.autosave.secwin){
            win.app.autosave.secwin.close();
            win.app.autosave.secwin = null;
        }
        // arrete la routine pour effectuer l'autosave a interval regulier
        if(win.app.autosave.routineRef){
            win.app.autosave.routine("OFF", win);
        }
        // supprime l'autosave effectuée
        win.localStorage.removeItem("workarea");
        win.localStorage.removeItem("cssEditor");
        win.localStorage.removeItem("prefCssEditor");
        
    // si memo a été fermé ou refresh
    }else if(confirm("forgot destroy before closing.\nDestroy autosave ?")){
            localStorage.removeItem("workarea");
            localStorage.removeItem("cssEditor");
            localStorage.removeItem("prefCssEditor");
            close();
    }
};





app.autosave.showInPopup = function(){
    if(this.secwin){
        // remove older display
        var old = this.secwin.document.getElementsByClassName("autosaveDone")[0];
        if(old) old.parentElement.removeChild(old);
        // create new display
        var display = document.createElement("DIV");
        display.classList.add("autosaveDone");
        display.onanimationend = this.callSrc_popupDisplayAutosavedone;
        display.style.animation = "anim "+app.autosave.secfreq+"s linear"
        var dObj = new Date(Date(Date.now));
        var time = ""+ dObj.getHours() +":"+ dObj.getMinutes() +":"+ dObj.getSeconds();
        display.textContent = ""+time+"\nAutoSave Done !";
        this.secwin.document.body.appendChild(display);
    }
};

app.autosave.callSrc_popupDisplayAutosavedone = function(){
    this.parentElement.removeChild(this);
};

// !!! ne pas changer l'ordre des declaration !!!
// this.secwin.document.styleSheets[0].cssRules[1].style.animationDuration = this.secfreq+"s";
// in : app.autosave.routine
app.autosave.css_display = ""+
    "@keyframes anim{"+
        "50%  {bottom:0px; opacity:1;}"+
        "100% {bottom:0px; opacity:0;}"+
    "}\n"+
    ".autosaveDone{"+
        "position : fixed;"+
        "height : 64px;"+
        "bottom : -64px;"+
        "line-height: 2;"+
        "vertical-align : middle;"+
        "white-space : pre;"+
        "width : 128px;"+
        "background-color : rgb(252, 244, 183);"+
    "}";





// html du popup de fermeture de l'editeur memo
// pour detruir l'autosave si l'autosave est active
app.autosave.tag_popupDeleteButton = ""+
    "<input type='button' value='Destroy AutoSave' style='padding:10px;'>";

app.autosave.callSrc_popupDeleteButton = function(){
    app.autosave.destroy(opener);
};





// verifie si la page doit etre un popup
// si oui, creer le contenu du popup et return true
// si non, retourne false
app.autosave.checkNinit_popup = function(){
    for(var i=0; i<app.pageArgs.length; i++){
        if(app.pageArgs[i] == "popup=save"){
            var doc = document.getElementsByTagName("HTML")[0];
            doc.innerHTML = "<head>"+
                                "<style>"+
                                    // !!! doit etre 1er !!!
                                    app.autosave.css_display+
                                "</style>"+
                            "</head>"+
                            "<body>"+
                                app.autosave.tag_popupDeleteButton +
                                "<br><br>" + sessionStorage.mainURL+
                            "</body>";
            var btn = document.getElementsByTagName("INPUT")[0];
            btn.onclick = app.autosave.callSrc_popupDeleteButton;
            return true;
        }
    }
    return false;
}