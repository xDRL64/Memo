app.transfer.init = function(){

};

app.transfer.checkAllType = function(itemTab, prefix, typeStrTab){
    var allow = true;
    for ( i = 0; i < itemTab.length; i++) {
        var checkItem = false;
        for ( ii = 0; ii < typeStrTab.length; ii++)
            if(itemTab[i].type == (prefix+typeStrTab[ii]) ){
                checkItem = true; break;
            }
        
        if(checkItem == false) return false;
    }
    return true;
};



app.transfer.get_iframeSize = function(fileTab, callback){

    app.transfer.iframeSizes = [];
    var tmp_iframe = document.createElement("IFRAME");

    tmp_iframe.theapp = {
        counter : 0,
        fileTotal : fileTab.length,
        fileTab : fileTab,
        onend : callback,
    };

    tmp_iframe.onloadend = function(){
        LOG("onend");
    };

    tmp_iframe.onload = function(){
        var App = this.theapp;

        var styles_showAll = "white-space: nowrap; overflow: hidden; width: -moz-fit-content;"
        this.contentDocument.documentElement.style = styles_showAll;
        this.contentDocument.body.style = styles_showAll;

        var styles = getComputedStyle(this.contentDocument.documentElement);
        // retarde la suite a cause de getComputedStyle qui met du temps a s'executer
            var that = this;
            setTimeout(function(){
                app.transfer.iframeSizes[App.counter] = {
                    w : styles.width,
                    h : styles.height
                };
                App.counter++;
                if(App.counter == App.fileTotal){
                    that.parentElement.removeChild(that);
                    App.onend();
                }else
                    that.src = App.fileTab[App.counter].name;
            },50);

    };
    document.body.appendChild(tmp_iframe);
    tmp_iframe.src = fileTab[0].name;

};




app.transfer.load_file = function(fileTab, fReaderMethod, callback){
    var reader = new FileReader();

    reader.theapp = {
        counter : 0,
        fileTotal : fileTab.length,
        fileTab : fileTab,
        method : fReaderMethod,
        onend : callback,
        result : [],
    };



    reader.onload = function(){
        var App = this.theapp;
        App.result[App.counter] = this.result;
        App.counter++;
        if(App.counter == App.fileTotal){
            App.onend(App.result);
        }else
            this[App.method](App.fileTab[App.counter]);
    };
    reader[fReaderMethod](fileTab[0]);

};

// ajoute la taille en parametre pour addFromBase()
app.transfer.docsToDataURL = function(args){
    var list_docs = args.docs;
    

    var script = document.createElement("SCRIPT");
    script.textContent = "document.ondragover = function(e){e.preventDefault();};" +
                         "document.ondrop     = function(e){e.preventDefault();};";

    var dataURLs = [];
    var originalDataURLs = [];
    for(var i=0; i<list_docs.length; i++){
        // original data url
        var htmlTagStr = list_docs[i].documentElement.outerHTML;
        var data = "data:text/html;charset=utf-8," + encodeURIComponent(htmlTagStr);
        originalDataURLs[i] = data;
        // original data url
        list_docs[i].body.appendChild( script.cloneNode(true) );
        htmlTagStr = list_docs[i].documentElement.outerHTML;
        data = "data:text/html;charset=utf-8," + encodeURIComponent(htmlTagStr);
        dataURLs[i] = data;
    }
    app.dragNdrop.addFromBase(dataURLs, originalDataURLs, app.transfer.iframeSizes);
    //app.dragNdrop.addFromBase(dataURLs, originalDataURLs);

};



app.transfer.exporter = function(strContent,fileName){
    var content = [strContent];
    var file = new File(content, fileName, {type: 'plain/text'});
    var url = URL.createObjectURL(file);
    window.open(url);
};



app.editor.init_saveProjectButton = function(){
    app.editor.saveProjectButton = document.getElementById("button_build");
    app.editor.saveProjectButton.id = "saveProject";
    app.editor.saveProjectButton.value = "Save Project";
    app.editor.saveProjectButton.onclick = function(){
        var willSave = true;
        if(app.editor.runningMode != "NONE"){
            willSave = false;
            alert("impossible de sauver. un element est en train d'être edité");
        }
        if(app.editor.editingBlocTitle == true){
            willSave = false;
            alert("impossible de sauver. un titre de bloc est en train d'être edité");
        }
        if(app.selections.all.length > 0){
            willSave = false;
            alert("impossible de sauver. un ou plusieurs elements sont selectionnés");
        }
        // ne peut pas sauvegarder si un syselem est en train d'etre edité
        if(willSave == true){
            // prepare nom de fichier a sauver
            var filenames = document.URL.split('/');
            var filename = filenames[filenames.length-1];
            // recupere le projet original
            var templateElem = document.getElementById("template_saveProject");
            var encodedOriginalProject = templateElem.getAttribute("template-saveproject");
            var originalBuiltProject = decodeURIComponent(encodedOriginalProject);
            var DP = new DOMParser();
            var DOC_projectToSave = DP.parseFromString(originalBuiltProject, "text/html");
            // conserve la taille de cssEditor
            var newCssEditor = DOC_projectToSave.getElementById("css_editor");
            newCssEditor.outerHTML = app.toolbar.cssEditor.outerHTML;
            // insert les user style dans le projet original
            DOC_projectToSave.getElementById("styles_user").textContent = app.toolbar.userStylesTag.textContent;

            // insert les syspref style dans le projet original
            DOC_projectToSave.getElementById("styles_pref").textContent = app.toolbar.prefStylesTag.textContent;

            // insert workarea dans le projet original
            DOC_projectToSave.getElementById("workarea").innerHTML = app.workarea.innerHTML;
            // insert le project original encodé
            var newTemplateElem = templateElem.cloneNode(true);
            DOC_projectToSave.body.appendChild(newTemplateElem);
            // exporte le projet
            app.transfer.exporter(DOC_projectToSave.documentElement.outerHTML, filename);
        }
    };
};



app.editor.init_exportWebPageButton = function(){
    app.editor.exportWebPageButton = document.getElementById("button_exportWebPage");
    app.editor.exportWebPageButton.onclick = function(){
        // clone workarea
        var out = app.workarea.cloneNode(true);
        // clean le clone de workarea
        var _E = app.engineCSS.builtSysClassList;
        for(var i=0; i<_E.length; i++){
            var allOfThisType = [...out.getElementsByClassName(_E[i])];
            for(var ii=0; ii<allOfThisType.length; ii++){
                allOfThisType[ii].classList.remove(_E[i]);
                allOfThisType[ii].style.backgroundColor = "";
                allOfThisType[ii].removeAttribute("draggable");
                allOfThisType[ii].removeAttribute("contenteditable");
                allOfThisType[ii].removeAttribute("_engine-selectedhtmlelem_index");
            }
        }

        // remet la source original (càd sans les prevent default de dragover et drop event) pour les iframes
        app.editor.resetOriginalIframeSrc(out);

        // creer la page web
        var userStyle = app.toolbar.userStylesTag.textContent;
        var memoStyle = app.engineCSS.blocSheetTxt;
        var metaCharsetUTF8 = '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">';
        var htmlTxt = "<html><head>"+metaCharsetUTF8+"<style>"+memoStyle+userStyle+"</style></head><body>"+out.innerHTML+"</body></html>";
        app.transfer.exporter(htmlTxt,"testpage.html")
    };
};


app.editor.resetOriginalIframeSrc = function(mainElem){
    var iframes = mainElem.getElementsByTagName("IFRAME");
    for(var i=0; i<iframes.length; i++){
        if(iframes[i].hasAttribute("originaldataurl")){
            var originaldataurl = iframes[i].getAttribute("originaldataurl");
            iframes[i].setAttribute("src", originaldataurl);
            iframes[i].removeAttribute("originaldataurl");
        }
    }
};