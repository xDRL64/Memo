// verifi le navigateur internet du user
(function(){ if(navigator.vendor != ""){
    var slot = document.createElement("DIV");
    slot.innerHTML = 
    // div principal
    // prend toute la taille de window
    '<div style="' + 'position:fixed; z-index:2000;' + 'left:0px; right:0px; top:0px; bottom:0px;'+ '">' +
        // permet de center en x,y
        // prend toute la taille de window
        '<div style="' + 'display:table; ' + 'height:100%; width:100%;' + 'table-layout:fixed;'+ '">' +
                // tab cell
                '<div style="' +
                    'display:table-cell; background-color:rgba(0,0,0,0.8);' +
                    'color:red; font-size:64px; word-wrap:break-word;' +
                    'vertical-align:middle; text-align:center; white-space:pre-wrap;' +
                    'user-select:none; -ms-user-select:none; -webkit-user-select:none;' +
                '">' +
                    // message
                    'You n\'utilisez pas Firefox.\nMemo ne va pas fonctionner /!\\' +
                '</div>' +
        '</div>' +
    '</div>' ;
    document.body.appendChild(slot);
}})();





// initialisation de l'app
app.engine.init = function(){
    
    // build les class du systeme
    app.engineCSS.build();
    
    // get et init workarea
    app.workarea = document.getElementById("workarea");
    // class pour le click droite de l'editeur
    app.workarea.classList.add(app.engineCSS.built.editRclick);

    app.scrollview = document.getElementById("scrollview");

    // init le systeme de menu
    app.menu.init();
    
    // init toolbar
    app.toolbar.init();
    
    // init selections
    app.selections.init();

    // init transfer
    app.transfer.init();

    // init events
    app.rightClick.init();
    app.dragNdrop.init();
    
    // init autosave manager
    app.autosave.init();

    app.coprocess.init();

};





// SI FIREFOX !!!
if(navigator.vendor == ""){
    // si un des argument en GET method est 'popup=empty'
    // alors on n'execute pas les script et on vide le documment
    // puis ecrit le nouveau contenu du documment
    app.autosave.emptypopup = app.autosave.checkNinit_popup();


    // deroulement normale
    // ne s'execute pas dans un popup
    if(!app.autosave.emptypopup){

      
        // DEV MODE (BUILT MODE)
        // permet de tester les fonctionnalité principal sans devoir compiler
        if(document.childNodes[0].textContent != "SOURCECODE"){
            app.engine.init();
            app.editor.init_saveProjectButton();
            app.editor.init_exportWebPageButton();
        // RELEASE MODE
        // permet de compiler la source de cette version
        }else{
            // inject csstext dans style tag (pref)
            app.engineCSS.build();
            app.toolbar.init_prefStyleTag_with_CSSstr(app.engineCSS.editorSheetTxt);

            app.builder.init();
        }


    }
}


    


