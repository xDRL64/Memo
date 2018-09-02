app.engineCSS = {
    sysprefix : "_ENGINE-",
    _editorRightclick : "editRclick",
    _blocComponent : "Bloc",
    _blocbodyComponent : "BlocBody",
    _bloctitleComponent : "BlocTitle",
    _root : "root",
    _htmlElement : "htmlElem",
    _dropdest : "dropdest",
    _selected : "selectedHtmlElem",
    _sysmenu : "menu",
    _menuoption : "option",
    _legalBR : "legalBR",
    _textEditing : "txtEditing",
    _userStyle : "usrStyle",
    _keepSelection : "keepSelect",

    memoprefix : "_MEMO-",
    _blocBorder : "blocBorder",
    _bloc : "bloc",
    _blocTitle : "blocTitle",
    _blocBody : "blocBody",



    built : {},
    builtSysClassList : []
    //build : undefined
};

// for editor working
app.engineCSS.sysAdd = function(builtVarName, rawEngineVar){
    var wholeCSS = this.sysprefix + rawEngineVar;
    this.built[builtVarName] = wholeCSS;
    this.builtSysClassList[this.builtSysClassList.length] = wholeCSS;
};

// for memo style
app.engineCSS.memoAdd = function(builtVarName, rawEngineVar){
    var wholeCSS = this.memoprefix + rawEngineVar;
    this.built[builtVarName] = wholeCSS;
};

app.engineCSS.build = function(){


    // build style names
    this.sysAdd("editRclick", this._editorRightclick);
    this.sysAdd("blocsys",    this._blocComponent);
    this.sysAdd("blocbody",   this._blocbodyComponent);
    this.sysAdd("bloctitle",  this._bloctitleComponent);
    this.sysAdd("root",       this._root);
    this.sysAdd("htmlElem",   this._htmlElement);
    this.sysAdd("dropdest",   this._dropdest);
    this.sysAdd("selected",   this._selected);
    this.sysAdd("menu",       this._sysmenu);
    this.sysAdd("option",     this._menuoption);
    this.sysAdd("BR",         this._legalBR);
    this.sysAdd("txtEdit",    this._textEditing);
    this.sysAdd("usrStyle",   this._userStyle);
    this.sysAdd("keepSelect", this._keepSelection);

    this.memoAdd("blocBorder", this._blocBorder);
    this.memoAdd("bloc",       this._bloc);
    this.memoAdd("blocTitle",  this._blocTitle);
    this.memoAdd("blocBody",   this._blocBody);



    this.editorSheetTxt = "";
    this.blocSheetTxt = "";

    // accede a editor styles
    var editorStyleTag = document.getElementById("styles_editor");
    var editorSheet = editorStyleTag.sheet;

    // make editor styles :

        // sys elem
        var css = "." + this.built.htmlElem + "{" +"\n"+
                    "padding: 30px;"              +"\n"+
                    "background-color: white;"    +"\n"+
                    "border-width: 1px;"          +"\n"+
                    "border-style: solid;"        +"\n"+
                    "border-color: black;"        +"\n"+
                    "box-sizing: border-box;"     +"\n"+
                  "}"                             +"\n\n";
        editorSheet.insertRule(css);
        this.editorSheetTxt += css;

        // text editing elem
        var css = "." + this.built.txtEdit + "{" +"\n"+
                    "white-space: pre;"          +"\n"+
                  "}"                            +"\n\n";
        editorSheet.insertRule(css);
        this.editorSheetTxt += css;


    editorSheet.disabled = false;






    // accede a sys styles
    var StyleTag = document.getElementById("styles_sys");
    var sysSheet = StyleTag.sheet;

    // make sys styles :

        // bloc border
        var css = "." + this.built.blocBorder + `{
            margin: 10px;
            padding: 1px;
            background-color: black;
        }\n\n`;
        sysSheet.insertRule(css);
        this.editorSheetTxt += css;
        this.blocSheetTxt += css;

        // bloc
        var css = "." + this.built.bloc + `{
            background: linear-gradient(black, black, grey, #C0C0C0, grey, white );
            padding: 10px;
        }\n\n`;
        sysSheet.insertRule(css);
        this.editorSheetTxt += css;
        this.blocSheetTxt += css;

        // bloc title
        var css = "." + this.built.blocTitle + `{
            padding: 10px;
            font-size: 40px;
            color: white;
        }\n\n`;
        sysSheet.insertRule(css);
        this.editorSheetTxt += css;
        this.blocSheetTxt += css;
        
        // bloc body
        var css = "." + this.built.blocBody + `{
            padding: 10px;
            background: linear-gradient(white, grey, #C0C0C0);
            height: auto;
            overflow: hidden;
        }\n\n`;
        sysSheet.insertRule(css);
        this.editorSheetTxt += css;
        this.blocSheetTxt += css;






        // menu
        var css = "." + this.built.menu + "{" +
                    "position: fixed;" +
                    "padding: 16px;" +
                    "background-color: cornflowerblue;" +
                    "box-sizing: border-box;" +
                    "-moz-user-select: none;" +
                  "}";
        sysSheet.insertRule(css);

        // option
        var css = "." + this.built.option + "{" +
                    "position: relative;" +
                    "display: block;" +
                    "background-color: darksalmon;" +
                    "cursor: pointer;" +
                    "white-space: nowrap;" +
                  "}";
        sysSheet.insertRule(css);

        // option : hover
        var css = "." + this.built.option + ":hover{" +
                    "background-color: red;" +
                  "}";
        sysSheet.insertRule(css);

    sysSheet.disabled = false;

};



