app.builder.init = function(){
    // get HTML tag
    app.builder.built = document.children[0].cloneNode(true);
    app.builder.ref_HtmlTag = app.builder.built;
    // set button
    app.builder.button = document.getElementById("button_build");
    app.builder.button.onclick = function(){
        app.builder.resourceFormater(true,[app.builder.built], app.builder.call_exporter);
    };
};
//<div class="template_saveProject" template-saveproject=""></div>
//app.builder.built.getElementsByClassName("template_saveProject")[0];
app.builder.call_exporter = function(){
    // encode et insert le project nouvellement built
    // dans une div ayant la class 'template_saveProject',
    // sous l'attribut 'template-saveproject'
    var builtEncoded = encodeURIComponent(app.builder.built.outerHTML);
    var templateElem = document.createElement("DIV");
    templateElem.id = "template_saveProject";
    templateElem.setAttribute("template-saveproject", builtEncoded);
    app.builder.built.getElementsByTagName("BODY")[0].appendChild(templateElem);

    app.transfer.exporter(app.builder.built.outerHTML, "NewMemoProject.html");
};

// pas besoin d'initialiser app.builder pour utiliser
app.builder.resourceFormater = function(start=false, tab_rootElem, callback, params={}){
    
    if(start){
        this.rootCounter = 0;
        this.tab_root = tab_rootElem;
        this.callback = callback;
        this.params = params;
    
        this.tmp_iframe = document.createElement("IFRAME");
        document.body.appendChild(this.tmp_iframe);
    }

    var currentRoot = this.tab_root[this.rootCounter];
    var elemPack = this.get_resourceElems(currentRoot, ["LINK","SCRIPT"]);
    this.resourceFilter(elemPack);
    this.list_elem = this.packToList(elemPack);

    this.elemCounter = 0;

    this.tmp_iframe.onload = function(){
        var entry = app.builder.list_elem[ app.builder.elemCounter ];

        var content = "/* *** " + this.src + " *** */" + "\n\n" +
            this.contentDocument.documentElement.textContent;
        var dataURL = "data:" + entry.mime + ";charset=utf-8," + encodeURIComponent(content);
        entry.elem[entry.attr] = dataURL;

        app.builder.elemCounter++;
        if(app.builder.elemCounter == app.builder.list_elem.length){
            app.builder.rootCounter++;
            if(app.builder.rootCounter == app.builder.tab_root.length){
                document.body.removeChild(this);
                app.builder.tmp_iframe = undefined;
                if(app.builder.callback) app.builder.callback(app.builder.params);
            }else
                app.builder.resourceFormater()
        }else{
            this.src = app.builder.list_elem[app.builder.elemCounter].path;
        }

    };

    /*// version Asynchrone
    var _start_resourceFormater = function(onlyAvailablePath){
        var that = app.builder;
        that.list_elem = onlyAvailablePath;
        if(that.list_elem.length > 0)
            that.tmp_iframe.src = that.list_elem[that.elemCounter].path;
        else{
            document.body.removeChild(that.tmp_iframe);
            if(that.callback) that.callback(that.params);
        }
    }
    this.checkAvailablePath(this.list_elem, _start_resourceFormater);
    */

    // synchrone version
    if(this.list_elem.length > 0)
        this.tmp_iframe.src = this.list_elem[this.elemCounter].path;
    else{
        document.body.removeChild(this.tmp_iframe);
        if(this.callback) this.callback(this.params);
    }

};



app.builder.get_resourceElems = function(root, tagTab){
    var result = {};
    for(var i=0; i<tagTab.length; i++){
        tagTab[i] = tagTab[i].toUpperCase();
        result[tagTab[i]] = root.getElementsByTagName(tagTab[i]);
    }
    return result;
};


app.builder.resourceFilter = function(elemPack){
    var linkTab   = [];
    var scriptTab = [];

    for(var i=0; i<elemPack.LINK.length; i++)
        if(elemPack.LINK[i].getAttribute("rel") == "stylesheet")
            if(app.lib.isDataURL(elemPack.LINK[i].href) == false)
                if(app.lib.isFileAvailable(elemPack.LINK[i].href) == true)
                    linkTab[linkTab.length] = elemPack.LINK[i];
                else alert("LINK path inaccessible : "+elemPack.LINK[i].href);

    for(var i=0; i<elemPack.SCRIPT.length; i++)
        if(elemPack.SCRIPT[i].getAttribute("src") !== null)
            if(app.lib.isDataURL(elemPack.SCRIPT[i].src) == false)
                if(app.lib.isFileAvailable(elemPack.SCRIPT[i].src) == true)
                    scriptTab[scriptTab.length] = elemPack.SCRIPT[i];
                else alert("SCRIPT path inaccessible : "+elemPack.SCRIPT[i].src);
    
    elemPack.LINK   = linkTab;
    elemPack.SCRIPT = scriptTab;
};

// list : elem, path, pathAttr, mimeType, tag
app.builder.packToList = function(elemPack){
    var all = elemPack.LINK.concat( elemPack.SCRIPT );
    var list = [];
    for(var i=0; i<all.length; i++){
        var e = all[i];
        var t = e.tagName;
        list[i] = {
            elem : e, 
            path : e.tagName=="LINK"? e.href : e.tagName=="SCRIPT"? e.src : "",
            attr : e.tagName=="LINK"? "href" : e.tagName=="SCRIPT"? "src" : "",
            mime : e.tagName=="LINK"? "text/css" : e.tagName=="SCRIPT"? "text/javascript" : "",
            tag  : t
        };
    }
    return list;
};

/*// version Asynchrone
app.builder.checkAvailablePath = function(list, callback){
    if(list.length > 0){
        var o = new XMLHttpRequest();
        o.theapp = {
            count : 0,
            counter : list.length,
            list : list,
            callback : callback
        };

        o.onreadystatechange = function(){
            if (this.readyState == 4){

                var available = false;
                // si le fichier est accessible
                if( this.status == "200")
                    available = true;
                this.theapp.list[this.theapp.count].available = available;
    
                this.theapp.count++;
                // si il y a encore des elem a traiter
                if(this.theapp.count < this.theapp.counter){
                    // relance pour l'elem suivant
                    var o = new XMLHttpRequest();
                    o.theapp = this.theapp;
                    o.onreadystatechange = this.onreadystatechange;
                    try{o.open('GET', this.theapp.list[this.theapp.count].path, true);}catch{}
                    o.send(null);
                // si il n'y a plus d'elem a traiter
                }else{
                    var onlyAvailables = [];
                    // remove unavailable entries in list
                    for (var i=0; i<this.theapp.list.length; i++)
                        if(this.theapp.list[i].available)
                            onlyAvailables.push(this.theapp.list[i]);
                    // end quite
                    this.theapp.callback(onlyAvailables);
                }
            }
        };

        o.overrideMimeType("application/text");
        try{o.open('GET', list[0].path, true);}catch{}
        o.send(null);
    }
};
*/