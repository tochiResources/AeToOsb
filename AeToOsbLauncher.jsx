{
    $.evalFile('~/Documents/AeToOsb/AeToOsb.jsx');

    var Launcher = (function (thisObj) {

        // LAUNCHER
        // ========
        var Launcher = (thisObj instanceof Panel) ? thisObj : new Window("palette", 'AeToOsb', undefined, { resizeable: true });
        if (!(thisObj instanceof Panel))
        Launcher.text = "AeToOsb"; 
        Launcher.orientation = "column"; 
        Launcher.alignChildren = ["center","center"]; 
        Launcher.spacing = 10; 
        Launcher.margins = 16; 

        // PANELINTERFACE
        // ==============
        var panelInterface = Launcher.add("group", undefined, {name: "panelInterface"}); 
        panelInterface.orientation = "column"; 
        panelInterface.alignChildren = ["left","center"]; 
        panelInterface.spacing = 10; 
        panelInterface.margins = 0; 

        var statictext1 = panelInterface.add("statictext", undefined, undefined, {name: "statictext1"}); 
        statictext1.text = "After Effects To Storyboard"; 

        var launchButton = panelInterface.add("button", undefined, undefined, {name: "launchButton"}); 
        launchButton.text = "Launch"; 
        launchButton.alignment = ["center","center"]; 

        Launcher.show();
        launchButton.onClick = function () {

            if (launchButton.enabled == true) {
                launchScript();
            }
        }

        return Launcher;
    }());
}