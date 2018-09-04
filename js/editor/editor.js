// *** options des menu possible ***
app.menu.options = {};


/*
// option pour créer un nouveau titre
app.menu.options["New Titre"] = {
    srcCall : app.options.add_title,
    params : "New Titre"
};
*/

// option pour créer un nouveau bloc
app.menu.options["New Bloc"] = {
    srcCall : app.options.add_bloc,
};

// option pour cloner un bloc
app.menu.options["Set Title Bloc"] = {
    srcCall : app.options.set_titleBloc,
};

// option pour cloner un bloc
app.menu.options["Clone Bloc"] = {
    srcCall : app.options.clone_bloc,
};

// option pour supprimer un bloc
app.menu.options["Delete Bloc"] = {
    srcCall : app.options.remove_bloc,
};


// option pour creer un new element
app.menu.options["Create New Element"] = {
    srcCall : app.options.new_element,
};

// option pour cloner element
app.menu.options["Clone Element"] = {
    srcCall : app.options.clone_element,
};

// option pour effacer le contenu texte d'un element
app.menu.options["Clear Text Content"] = {
    srcCall : app.options.clear_text,
};

// option pour creer le contenu texte d'un element
app.menu.options["Add Text Content"] = {
    srcCall : app.options.add_text,
};

// option pour creer le contenu texte d'un element
app.menu.options["Show Styles Applied"] = {
    srcCall : app.options.show_elemStyles,
};

// option pour creer le contenu texte d'un element
app.menu.options["Remove Unused Styles"] = {
    srcCall : app.options.remove_unusedStyles,
};

// option pour creer le contenu texte d'un element
app.menu.options["Clone Parent"] = {
    srcCall : app.options.clone_parent,
};

// option pour creer le contenu texte d'un element
app.menu.options["Select Parent"] = {
    srcCall : app.options.select_parent,
};

// option pour supprimer les elements selectionnés
app.menu.options["Delete Selected Elements"] = {
    srcCall : app.options.remove_elements,
};

// option pour supprimer les elements selectionnés
app.menu.options["Copy Selected Elements"] = {
    srcCall : app.options.copy_elements,
};

// option pour supprimer les elements selectionnés
app.menu.options["Past Selected Elements"] = {
    srcCall : app.options.past_elements,
};

// option pour ouvrir le menu d'attribut modifiable
app.menu.options["Define Attribute"] = {
    srcCall : app.options.define_attribute,
};

// option pour copier le code html de l'element ou du bloc
app.menu.options["Copy Source Code"] = {
    srcCall : app.options.copy_code,
};

// option pour utiliser le textContent d'un element en tant que outerHTML
app.menu.options["Text To OuterHTML (/!\\Expert)"] = {
    srcCall : app.options.convert_textContentToOuterHTML,
};

// ...
app.menu.options["Transform Div Into Iframe"] = {
    srcCall : app.options.transform_divIntoIframe,
};
// ...
app.menu.options["Transform Iframe Into Div"] = {
    srcCall : app.options.transform_iframeIntoDiv,
};

// ...
app.menu.options["Text To InnerHTML Of Workarea"] = {
    srcCall : app.options.assign_textContentToWorkareaInnerHTML,
};


// option pour copier le texte + le style
app.menu.options["Copy Text"] = {
    srcCall : app.options.copy_text,
};

// option pour coller le texte + le style
app.menu.options["Past Text"] = {
    srcCall : app.options.past_text,
};

// option pour copier le style css du texte
app.menu.options["Copy Style"] = {
    srcCall : app.options.copy_style,
};

// option pour coller le style css du texte
app.menu.options["Past Style"] = {
    srcCall : app.options.past_style,
};



// option pour definir l'attribut src
app.menu.options["src"] = {
    srcCall : app.options.define_srcAtrrib,
};

// option pour definir l'attribut href
app.menu.options["href"] = {
    srcCall : app.options.define_hrefAtrrib,
};




// option pour ...
app.menu.options["Consider Text Content As BODY Content"] = {
    srcCall : app.options.divToIframeAsBody,
};

// option pour ...
app.menu.options["Consider Text Content As HTML Content"] = {
    srcCall : app.options.divToIframeAsHtml,
};



// options pour creer des element
app.menu.options["PRE"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "PRE",
    }
};
app.menu.options["SPAN"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "SPAN",
    }
};
app.menu.options["A"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "A",
    }
};
app.menu.options["IMG"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "IMG",
    }
};
app.menu.options["IFRAME"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "IFRAME",
    }
};
app.menu.options["DIV"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "DIV",
    }
};
app.menu.options["TABLE"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "TABLE",
    }
};
app.menu.options["TR"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "TR",
    }
};
app.menu.options["TD"] = {
    srcCall : app.options.add_element,
    // function params
    fparams : {
        tag : "TD",
    }
};

// *** liste des options par menu ***

// liste option pour le menu workarea
app.menu.onworkarea = [ "New Bloc",
                        "Create New Element",
                        "Past Selected Elements",
                        "Copy Source Code",
                      ];

app.menu.onbloc     = [ "Clone Bloc",
                        "Set Title Bloc",
                        "Create New Element",
                        "Delete Bloc",
                        "Past Selected Elements",
                        "Copy Source Code",
                      ];

app.menu.onelement  = [ "Clone Element",
                        "Create New Element",
                        "Clear Text Content",
                        "Add Text Content",
                        "Show Styles Applied",
                        "Remove Unused Styles",
                        "Clone Parent",
                        "Select Parent",
                        "Delete Selected Elements",
                        "Copy Selected Elements",
                        "Past Selected Elements",
                        "Define Attribute",
                        "Copy Source Code",
                        "Text To OuterHTML (/!\\Expert)",
                        "Transform Div Into Iframe",
                        "Transform Iframe Into Div",
                        "Text To InnerHTML Of Workarea",
                      ];
                      
app.menu.ontext     = [ "Copy Text",
                        "Past Text",
                        "Copy Style",
                        "Past Style",
                      ];

app.menu.newelem    = [ "PRE",
                        "SPAN",
                        "A",
                        "IMG",
                        "IFRAME",
                        "DIV",
                        "TABLE",
                        "TR",
                        "TD"
                      ];

app.menu.defattrib    = [ "src",
                          "href",
                        ];

app.menu.divtoiframe  = [ "Consider Text Content As BODY Content",
                          "Consider Text Content As HTML Content",
                        ];




// type d'image permis pour le drag and drop
app.dragNdrop.imgType = ["png","jpg","jpeg","gif","bmp"];

app.dragNdrop.webType = ["html"];










