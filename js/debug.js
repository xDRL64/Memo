function SP(e){e.stopPropagation();}

app.debug.init = function(){
    
    // log l'event lors du click sur le document
    /*
    document.onclick = function(e){
        console.log(e);
    }*/
}

app.debug.testmenu = function (){
    alert(this.theapp.params)
}


app.debug.consolelog_activeElement = function(){
    //console.log("appDebug :", document.activeElement)
    app.workarea.focus();
    requestAnimationFrame(app.debug.consolelog_activeElement);
};


document.onpaste = function(e){
    
};

document.oncopy = function(e){
    LOG("copy", e)
};


app.eventlist = [
    "onload",
    "onclick",
    "oncontextmenu"
];