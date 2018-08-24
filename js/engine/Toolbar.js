app.toolbar.init = function(){


    // STYLE TAG
        // sys style
        this.editorStylesTag = document.getElementById("styles_editor");
        this.editorStylesTag.sheet.disabled = false;
        // user styles
        this.userStylesTag = document.getElementById("styles_user");
        this.userStylesTag.sheet.disabled = false;
        // pref styles
        this.prefStylesTag = document.getElementById("styles_pref");
        this.prefStylesTag.sheet.disabled = false;



    // TOOLBAR
    this.elem = document.getElementById("toolbar");





    // TEXTBAR
    this.init_textbar();


    // STYLEBAR
    this.init_stylebar();



    // LINK INPUT
    this.linkInput = document.getElementById("input_link");



    // INPUT DISABLE EDIT STYLE
    this.hideSysStyles = document.getElementById("hideSysStyles");
    this.hideSysStyles.onchange = function(){
        
        app.toolbar.editorStylesTag.sheet.disabled = this.checked;
        app.toolbar.prefStylesTag.sheet.disabled = this.checked;
        
    };

    // PREF CSS EDITOR
    this.prefCssEditor = document.getElementById("prefCss_editor");
    // resize PREF CSS EDITOR
    // update toolbar (height)
    this.prefCssEditor.onmousemove = function(){
        app.toolbar.check_height();
    };
    // blur PREF CSS EDITOR
    // recharge les feuilles de style
    this.prefCssEditor.onblur = function(){
        // remake styles (internal webbrowser process)
        app.toolbar.prefStylesTag = app.lib.remake_styleTag(app.toolbar.prefStylesTag, this.value);
    };
    // keydown PREF CSS EDITOR
    this.prefCssEditor.onkeydown = function(e){
        // permet de gerer la touche tabulation
        app.editor._keyEVENT_tabulationFeatures(e,this);
    }
    // charge le contenu du style tag dans l'editeur pref css
    this.prefCssEditor.value = this.prefStylesTag.textContent;






};










app.toolbar.check_height = function(flag_callbackList=true){
    var styles = getComputedStyle(this.elem);
    this.height = parseInt(styles.height);

    if(flag_callbackList == true){
        app.editor.resize_scrollview();
    }
};









app.editor._keyEVENT_tabulationFeatures = function(e,that){
    // si la touche est tabulation
    if(e.code == "Tab"){
        // annule default action pour ne pas perdre le focus
        e.preventDefault()
        // si il n'y a pas de selection
        if(that.selectionStart == that.selectionEnd){
            var tmpPos = that.selectionStart;
            var part_A = that.value.slice(0,that.selectionStart);
            var part_B = that.value.slice(that.selectionStart);
            that.value = part_A+"\t"+part_B;
            that.selectionStart = that.selectionEnd = tmpPos+1;
        }
    }
};




app.toolbar.init_prefStyleTag_with_CSSstr = function(CSSstr){
    var prefStyleTag = document.getElementById("styles_pref");
    prefStyleTag.textContent = CSSstr;
};