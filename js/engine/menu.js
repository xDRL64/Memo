/***********************************/
/*** *** *** ENGINE FILE *** *** ***/
/***********************************/
app.menu.init = function(){
    // pas de menu ouvert lors de l'initialisation
    this.current = null;
}



// ferme l'eventuels menu ouvert lors d'un click hors d'un menu
// workarea onclick delegate
app.editor.ACTION_clickOverMenu = function(that, e){
    if(e.button == 0)
        if(!e.target.classList.contains(app.engineCSS.built.option)
        && !e.target.classList.contains(app.engineCSS.built.menu))
            app.menu.check_current();
};



// verifie si un menu est deja ouvert
// et le ferme le menu si il est ouvert
app.menu.check_current = function(){
    var currentMenu = app.menu.current;
    if(currentMenu != null){
        currentMenu.parentNode.removeChild(currentMenu);
        app.menu.current = null;
    }
}



// créer un menu en fonction du paramètre
// paramètre : name (string) : le nom du menu (reference une liste d'option)
app.menu.instanciate = function(name, x, y, params){
    // ferme un precedent menu deja ouvert
    this.check_current();
    // créer le menu
    var menu = document.createElement("DIV");
    menu.classList.add(app.engineCSS.built.menu);
    // positionne le menu a dans la fenetre
    menu.style.left = x;
    menu.style.top = y;
    // créer les option et les insert dans le menu
    this[name].forEach(function(optionName){
        // créer une option
        var option = document.createElement("DIV");
        option.classList.add(app.engineCSS.built.option);
        // insert un label l'option
        option.innerText = optionName;
        // assign une action l'event click
        option.onclick = app.menu.options[optionName].srcCall;
        option.theapp = {};
        option.theapp.params = params;
        option.theapp.fparams = app.menu.options[optionName].fparams;
        // insert l'option au menu
        menu.appendChild(option);
    });
    // affiche l'element
    document.body.appendChild(menu);
    this.check_overflow(menu);

    // garde une trace du menu ouvert
    this.current = menu;
};




app.menu.check_overflow = function(menu){
    var x = parseInt(menu.style.left);
    var y = parseInt(menu.style.top);
    menu.style.left = "0px";
    menu.style.top = "0px";
    var styles = getComputedStyle(menu);
    var width = parseInt(styles.width);
    var height = parseInt(styles.height);
    var right = x+width;
    var bottom = y+height;
    //var WAborder = getComputedStyle(app.workarea).borderWidth;

    if(right > innerWidth)
        menu.style.left = ((x-(right - innerWidth))/*-WAborder-1*/)+"px";
    else
        menu.style.left = x+"px";

    if(bottom > innerHeight)
        menu.style.top = ((y-(bottom - innerHeight))/*-WAborder-1*/)+"px";
    else
        menu.style.top = y+"px";
};


