
//function LOG(display){console.log(display);}
var LOG = console.log;

/***********************************/
/*** *** *** ENGINE FILE *** *** ***/
/***********************************/

// declaration global
var app = {
    pageArgs : [],
    workarea : null,
    toolbar : {},
    engine : {},
    rightClick : {},
    selections : {},
    dragNdrop : {},
    menu : {},
    options : {},
    bloc : {},
    iframe : {},
    editor : {},
    lib : {},
    transfer : {},
    autosave : {},
    builder : {},
    engineCSS : {},
    coprocess : {}, 
    //eventlist : [],
    //init : {},
    debug : {}
};





// init un tableau des argument passé en GET method
(function(){
    // decoupe l'url au niveau du caractere '?'
    var r = document.URL.split("?")
    // si l'url a pu etre decoupée
    if(r[0] != document.URL){
        r = r[1];
        // creer un tableau avec les argument passé en GET method
        if(r.indexOf("&") != -1) r = r.split("&");
        else r = [r];
        app.pageArgs = r;
    }
})();








