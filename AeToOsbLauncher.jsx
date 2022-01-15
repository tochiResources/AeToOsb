{
    $.evalFile('' + (File($.fileName).path) + '/AeToOsb/AeToOsb.jsx');

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
            // var mainScriptPath = $.fileName.slice(0, -19) + "AeToOsb.jsx";
            // var stringDiskLetter = mainScriptPath.slice(1, 2).toUpperCase();
            // var mainScriptFullPath = stringDiskLetter + ":" + "/" + mainScriptPath.slice(3, mainScriptPath.length);
            // var file = File(mainScriptFullPath.replace("%20", " "));
            // alert(file.fsName);

            if (launchButton.enabled == true) {
                // file.execute();
                // launchButton.enabled = false;
                // Launcher.update();

                // var scriptFilePath = $.fileName.replace("AeToOsbLauncher", "AeToOsb\\AeToOsb");
                // var scriptFile = new File(scriptFilePath);
                // alert(scriptFile.fsName);
                // app.executeCommand(8000);
                launchScript();
            }
        }

        return Launcher;
    }());
}
// AeToOsb(this);