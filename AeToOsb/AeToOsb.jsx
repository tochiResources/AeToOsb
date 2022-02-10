{
    function launchScript() {
        $.evalFile('~/Documents/AeToOsb/array.generics.js');
        $.evalFile('~/Documents/AeToOsb/splitter.aeosb');
        $.evalFile('~/Documents/AeToOsb/easings.jsx');
        $.evalFile('~/Documents/AeToOsb/json2.js');

        var AeToOsb = (function (thisObj) {
            function scriptFileName() {
                var scriptFileFullPath = File($.fileName);
                var scriptFileName = scriptFileFullPath.name;
                return scriptFileName;
            }

            function scriptFileFolderPath() {
                var scriptFileFP = File($.fileName);
                var scriptFileFolderPath = Folder.decode(scriptFileFP.fsName.replace(scriptFileName(), ""));
                return scriptFileFolderPath;
            }

            // var settingsJsonFile = File(scriptFileFolderPath() + "\\" + "settings.json");
            var settingsJsonFile = File('~/Documents/AeToOsb/settings.json');

            var scriptSettings = { // the default settings
                scriptslibraryFolderPath: "",
                outputFolderPath: "",
                options: {
                    exportJsonOnly: false,
                    exportTextPerLetter: false,
                    openOutputFolderBeforeRendering: true,
                    shapeLayers: true,
                    textLayers: true,
                    imageLayers: true,
                    threeDLayers: false,
                    unsupportedLayers: false
                },
                keyframeHelper: {
                    interval: "200",
                    xPosition: true,
                    yPosition: true,
                    scale: false,
                    rotation: false,
                    opacity: false
                },
                settingsJsonFile: File.decode(settingsJsonFile.fsName),
                scriptFileFolderPath: scriptFileFolderPath(),
                exportedComps: null,
                exportedCompNames: null
            };

            // AETOOSB
            // =============
            var AeToOsb = (thisObj instanceof Panel) ? thisObj : new Window("palette", 'AeToOsb', undefined, { resizeable: true });
            if (!(thisObj instanceof Panel)) AeToOsb.text = "After Effects to Storyboard";
            AeToOsb.preferredSize.width = 200;
            AeToOsb.preferredSize.height = 100;
            AeToOsb.orientation = "column";
            AeToOsb.alignChildren = ["center", "top"];
            AeToOsb.spacing = 10;
            AeToOsb.margins = 16;


            var logo_imgString = (File($.fileName).path) + "/bitmap/l.png";
            var logo = AeToOsb.add("image", undefined, File(logo_imgString));

            // TABBEDPANEL
            // ===========
            var tabbedpanel = AeToOsb.add("tabbedpanel", undefined, undefined, { name: "tabbedpanel" });
            tabbedpanel.alignChildren = "fill";
            tabbedpanel.preferredSize.width = 295.969;
            tabbedpanel.margins = 0;
            tabbedpanel.alignment = ["center", "top"];

            // ATSSTATUS
            // =========
            var atsStatus = tabbedpanel.add("tab", undefined, undefined, { name: "atsStatus" });
            atsStatus.text = "Status";
            atsStatus.orientation = "column";
            atsStatus.alignChildren = ["center", "top"];
            atsStatus.spacing = 10;
            atsStatus.margins = 10;

            // TABBEDPANEL
            // ===========
            tabbedpanel.selection = atsStatus;

            // ATSSTATUSGROUP
            // ==========
            var atsStatusGroup = atsStatus.add("group", undefined, { name: "atsStatusGroup" });
            atsStatusGroup.preferredSize.width = 230;
            atsStatusGroup.minimumSize.width = 230;
            atsStatusGroup.orientation = "column";
            atsStatusGroup.alignChildren = ["center", "center"];
            atsStatusGroup.spacing = 9;
            atsStatusGroup.margins = 0;
            atsStatusGroup.alignment = ["center", "top"];

            var atsStatusMessage1 = atsStatusGroup.add("statictext", undefined, undefined, { name: "atsStatusMessage1", multiline: true });
            atsStatusMessage1.text = "[Render and import - Status]";
            atsStatusMessage1.preferredSize.width = 230;
            atsStatusMessage1.minimumSize.width = 230;
            atsStatusMessage1.preferredSize.height = 20;
            atsStatusMessage1.minimumSize.height = 20;

            var atsStatusMessage2 = atsStatusGroup.add("statictext", undefined, undefined, { name: "atsStatusMessage2", multiline: true });
            atsStatusMessage2.text = "No action has been taken.";
            atsStatusMessage2.preferredSize.width = 230;
            atsStatusMessage2.minimumSize.width = 230;
            atsStatusMessage2.preferredSize.height = 20;
            atsStatusMessage2.minimumSize.height = 20;
            // scriptSettings = readSettings(); scriptSettings.atsStatusStatus = atsStatusMessage2;
            // writeSettings(scriptSettings);

            // ATSSTATUSBUTTONGROUP
            // ================
            var atsStatusButtonGroup = atsStatusGroup.add("group", undefined, { name: "atsStatusButtonGroup" });
            atsStatusButtonGroup.orientation = "row";
            atsStatusButtonGroup.alignChildren = ["center", "center"];
            atsStatusButtonGroup.spacing = 10;
            atsStatusButtonGroup.margins = 0;
            atsStatusButtonGroup.alignment = ["center", "center"];

            var yesButton = atsStatusButtonGroup.add("button", undefined, undefined, { name: "yesButton" });
            yesButton.preferredSize.width = 60;
            yesButton.minimumSize.width = 60;
            yesButton.text = "Yes";
            yesButton.alignment = ["center", "center"];
            yesButton.enabled = false;

            var noButton = atsStatusButtonGroup.add("button", undefined, undefined, { name: "noButton" });
            noButton.preferredSize.width = 60;
            noButton.minimumSize.width = 60;
            noButton.text = "No";
            noButton.alignment = ["center", "center"];
            noButton.enabled = false;

            // SETTINGS
            // ========
            var settings = tabbedpanel.add("tab", undefined, undefined, { name: "settings" });
            settings.text = "Settings";
            settings.orientation = "column";
            settings.alignChildren = ["center", "top"];
            settings.spacing = 10;
            settings.margins = 10;

            // GROUP1
            // ======
            var group1 = settings.add("group", undefined, { name: "group1" });
            group1.orientation = "row";
            group1.alignChildren = ["center", "center"];
            group1.spacing = 10;
            group1.margins = 0;
            group1.alignment = ["center", "top"];

            var checkbox1 = group1.add("checkbox", undefined, undefined, { name: "checkbox1" });
            checkbox1.helpTip = "Check this if you don't want to generate a .cs effect used to parse the .json file.";

            var checkbox2 = group1.add("checkbox", undefined, undefined, { name: "checkbox2" });
            checkbox2.helpTip = "If unchecked, it will decrease the export time and all text layers will be exported as a single sprite instead of splitting each character into their own sprites (ignored for text layers with only one character).";

            // SETTINGS
            // ========
            var checkbox8 = settings.add("checkbox", undefined, undefined, { name: "checkbox8" });
            checkbox8.helpTip = "Automatically open the rendered items(s) output folder before rendering (useful to see the render progress while After Effects is crashing).";
            checkbox8.alignment = ["center", "top"];

            // CONTENTS
            // ======
            var contents = settings.add("panel", undefined, undefined, { name: "contents" });
            contents.text = "Export contents";
            contents.orientation = "column";
            contents.alignChildren = ["center", "top"];
            contents.alignment = ["center", "top"];

            // CONTENTS_GROUP
            // ==============
            var contents_group = contents.add("group", undefined, { name: "contents_group" });
            contents_group.orientation = "column";
            contents_group.alignChildren = ["left", "top"];
            contents_group.spacing = 10;
            contents_group.margins = 0;
            contents_group.alignment = ["center", "top"];

            var checkbox3 = contents_group.add("checkbox", undefined, undefined, { name: "checkbox3" });
            var checkbox4 = contents_group.add("checkbox", undefined, undefined, { name: "checkbox4" });
            var checkbox5 = contents_group.add("checkbox", undefined, undefined, { name: "checkbox5" });
            var checkbox6 = contents_group.add("checkbox", undefined, undefined, { name: "checkbox6" });
            var checkbox7 = contents_group.add("checkbox", undefined, undefined, { name: "checkbox7" });

            // SETTINGS
            // ========
            var divider1 = settings.add("panel", undefined, undefined, { name: "divider1" });
            divider1.alignment = "fill";

            // GROUP2
            // ======
            var group2 = settings.add("group", undefined, { name: "group2" });
            group2.orientation = "row";
            group2.alignChildren = ["center", "center"];
            group2.spacing = 10;
            group2.margins = 0;

            var scriptslibrary_button = group2.add("button", undefined, undefined, { name: "scriptslibrary_button" });
            scriptslibrary_button.helpTip = "Change your scriptslibrary path.";
            scriptslibrary_button.alignment = ["center", "center"];

            var statictext1 = group2.add('edittext {properties: {name: "statictext1", scrollable: true}}');
            // var statictext1 = group2.add("statictext", undefined, undefined, { name: "statictext1", scrolling: true });
            statictext1.preferredSize.width = 117;

            // GROUP3
            // ======
            var group3 = settings.add("group", undefined, { name: "group3" });
            group3.orientation = "row";
            group3.alignChildren = ["center", "center"];
            group3.spacing = 10;
            group3.margins = 0;

            var outputpath_button = group3.add("button", undefined, undefined, { name: "outputpath_button" });
            outputpath_button.helpTip = "Choose a desired destination for the .json.";
            outputpath_button.text = "Output path";
            outputpath_button.alignment = ["center", "center"];

            var statictext2 = group3.add('edittext {properties: {name: "statictext2", scrollable: true}}');
            // var statictext2 = group3.add("statictext", undefined, undefined, { name: "statictext2", scrolling: true });
            statictext2.preferredSize.width = 162;

            // UTILITIES
            // =========
            var utilities = tabbedpanel.add("tab", undefined, undefined, { name: "utilities" });
            utilities.text = "Utilities";
            utilities.orientation = "row";
            utilities.alignChildren = ["center", "top"];
            utilities.spacing = 10;
            utilities.margins = 10;

            // TABBEDPANEL
            // ===========
            tabbedpanel.selection = utilities;

            // UTILITYTABS
            // ===========
            var utilityTabs = utilities.add("tabbedpanel", undefined, undefined, {name: "utilityTabs"}); 
            utilityTabs.alignChildren = "fill"; 
            utilityTabs.preferredSize.width = 290.031; 
            utilityTabs.alignChildren = ["center", "center"];
            utilityTabs.margins = 0;

            // UTILGENERAL
            // ===========
            var utilGeneral = utilityTabs.add("tab", undefined, undefined, {name: "utilGeneral"}); 
            utilGeneral.text = "General"; 
            utilGeneral.orientation = "column"; 
            utilGeneral.alignChildren = ["center","top"]; 
            utilGeneral.spacing = 10; 
            utilGeneral.margins = 10;

            // UTILLAYERGROUP
            // ==============
            var utilLayerGroup = utilGeneral.add("panel", undefined, undefined, {name: "utilLayerGroup"}); 
            utilLayerGroup.text = "Layer Group"; 
            utilLayerGroup.orientation = "column"; 
            utilLayerGroup.alignChildren = ["center","top"]; 
            utilLayerGroup.spacing = 10; 
            utilLayerGroup.margins = 10; 

            // UTILLAYERGROUPINFO
            // ==================
            var utilLayerGroupInfo = utilLayerGroup.add("group", undefined, {name: "utilLayerGroupInfo"}); 
            utilLayerGroupInfo.orientation = "row"; 
            utilLayerGroupInfo.alignChildren = ["center","center"]; 
            utilLayerGroupInfo.spacing = 10; 
            utilLayerGroupInfo.margins = 0; 

            var utilLayerGroupName = utilLayerGroupInfo.add("statictext", undefined, undefined, {name: "utilLayerGroupName"}); 
            utilLayerGroupName.text = "Group name"; 

            var utilLayerGroupNameInput = utilLayerGroupInfo.add('edittext {properties: {name: "utilLayerGroupNameInput"}}'); 
            utilLayerGroupNameInput.preferredSize.width = 83; 
            utilLayerGroupNameInput.alignment = ["center","center"]; 

            var utilLayerGroupApplyButton = utilLayerGroupInfo.add("button", undefined, undefined, {name: "utilLayerGroupApplyButton"}); 
            utilLayerGroupApplyButton.text = "Apply"; 

            // UTILLAYERORIGINS
            // ================
            var utilLayerOrigins = utilGeneral.add("panel", undefined, undefined, {name: "utilLayerOrigins"}); 
            utilLayerOrigins.text = "Origins"; 
            utilLayerOrigins.orientation = "column"; 
            utilLayerOrigins.alignChildren = ["center","top"]; 
            utilLayerOrigins.spacing = 10; 
            utilLayerOrigins.margins = 10; 

            // UTILLAYERORIGINTOP
            // ==================
            var utilLayerOriginTop = utilLayerOrigins.add("group", undefined, {name: "utilLayerOriginTop"}); 
            utilLayerOriginTop.orientation = "row"; 
            utilLayerOriginTop.alignChildren = ["center","center"]; 
            utilLayerOriginTop.spacing = 10; 
            utilLayerOriginTop.margins = 0; 
            utilLayerOriginTop.alignment = ["center","top"]; 

            var utilLayerOriginTopLeft = utilLayerOriginTop.add("button", undefined, undefined, {name: "utilLayerOriginTopLeft"}); 
            utilLayerOriginTopLeft.text = "T-Left"; 

            var utilLayerOriginTopCentre = utilLayerOriginTop.add("button", undefined, undefined, {name: "utilLayerOriginTopCentre"}); 
            utilLayerOriginTopCentre.text = "T-Centre"; 

            var utilLayerOriginTopRight = utilLayerOriginTop.add("button", undefined, undefined, {name: "utilLayerOriginTopRight"}); 
            utilLayerOriginTopRight.text = "T-Right"; 

            // UTILLAYERORIGINCENTER
            // =====================
            var utilLayerOriginCenter = utilLayerOrigins.add("group", undefined, {name: "utilLayerOriginCenter"}); 
            utilLayerOriginCenter.orientation = "row"; 
            utilLayerOriginCenter.alignChildren = ["center","center"]; 
            utilLayerOriginCenter.spacing = 10; 
            utilLayerOriginCenter.margins = 0; 
            utilLayerOriginCenter.alignment = ["center","top"]; 

            var utilLayerOriginCentreLeft = utilLayerOriginCenter.add("button", undefined, undefined, {name: "utilLayerOriginCentreLeft"}); 
            utilLayerOriginCentreLeft.text = "C-Left"; 

            var utilLayerOriginCentre = utilLayerOriginCenter.add("button", undefined, undefined, {name: "utilLayerOriginCentre"}); 
            utilLayerOriginCentre.text = "Centre"; 

            var utilLayerOriginCentreRight = utilLayerOriginCenter.add("button", undefined, undefined, {name: "utilLayerOriginCentreRight"}); 
            utilLayerOriginCentreRight.text = "C-Right"; 

            // UTILLAYERORIGINBOTTOM
            // =====================
            var utilLayerOriginBottom = utilLayerOrigins.add("group", undefined, {name: "utilLayerOriginBottom"}); 
            utilLayerOriginBottom.orientation = "row"; 
            utilLayerOriginBottom.alignChildren = ["center","center"]; 
            utilLayerOriginBottom.spacing = 10; 
            utilLayerOriginBottom.margins = 0; 
            utilLayerOriginBottom.alignment = ["center","top"]; 

            var utilLayerOriginBottomLeft = utilLayerOriginBottom.add("button", undefined, undefined, {name: "utilLayerOriginBottomLeft"}); 
            utilLayerOriginBottomLeft.text = "B-Left"; 

            var utilLayerOriginBottomCentre = utilLayerOriginBottom.add("button", undefined, undefined, {name: "utilLayerOriginBottomCentre"}); 
            utilLayerOriginBottomCentre.text = "B-Centre"; 

            var utilLayerOriginBottomRight = utilLayerOriginBottom.add("button", undefined, undefined, {name: "utilLayerOriginBottomRight"}); 
            utilLayerOriginBottomRight.text = "B-Right"; 

            // UTILLAYERLAYERING
            // =================
            var utilLayerLayering = utilGeneral.add("panel", undefined, undefined, {name: "utilLayerLayering"}); 
            utilLayerLayering.text = "Layering"; 
            utilLayerLayering.orientation = "column"; 
            utilLayerLayering.alignChildren = ["center","top"]; 
            utilLayerLayering.spacing = 10; 
            utilLayerLayering.margins = 10; 

            // UTILLAYERLAYERINGGROUP1
            // =======================
            var utilLayerLayeringGroup1 = utilLayerLayering.add("group", undefined, {name: "utilLayerLayeringGroup1"}); 
            utilLayerLayeringGroup1.orientation = "row"; 
            utilLayerLayeringGroup1.alignChildren = ["center","center"]; 
            utilLayerLayeringGroup1.spacing = 10; 
            utilLayerLayeringGroup1.margins = 0; 
            utilLayerLayeringGroup1.alignment = ["center","top"]; 

            var utilLayerLayeringDefault = utilLayerLayeringGroup1.add("statictext", undefined, undefined, {name: "utilLayerLayeringDefault"}); 
            utilLayerLayeringDefault.text = "Choose layer type"; 

            var utilLayerLayeringDefaultTypes_array = ["Background","Foreground","Overlay","-","Fail","Pass"]; 
            var utilLayerLayeringDefaultTypes = utilLayerLayeringGroup1.add("dropdownlist", undefined, undefined, {name: "utilLayerLayeringDefaultTypes", items: utilLayerLayeringDefaultTypes_array}); 
            utilLayerLayeringDefaultTypes.selection = 0; 

            // UTILLAYERLAYERING
            // =================
            var utilLayerLayeringApplyButton = utilLayerLayering.add("button", undefined, undefined, {name: "utilLayerLayeringApplyButton"}); 
            utilLayerLayeringApplyButton.text = "Apply"; 

            // UTILTEXTHELPER
            // ==============
            var utilTextAndKeyframeHelper = utilityTabs.add("tab", undefined, undefined, {name: "utilTextAndKeyframeHelper"}); 
            utilTextAndKeyframeHelper.text = "Text & Keyframe"; 
            utilTextAndKeyframeHelper.orientation = "column"; 
            utilTextAndKeyframeHelper.alignChildren = ["center","top"]; 
            utilTextAndKeyframeHelper.spacing = 10; 
            utilTextAndKeyframeHelper.margins = 10;

            // UTILTEXT
            // ========
            var utilText = utilTextAndKeyframeHelper.add("panel", undefined, undefined, { name: "utilText" });
            utilText.text = "Text Helper";
            utilText.orientation = "column";
            utilText.alignChildren = ["center", "top"];
            utilText.spacing = 10;
            utilText.margins = 10;

            var utilTextTitle = utilText.add("statictext", undefined, undefined, { name: "utilTextTitle" });
            utilTextTitle.text = "Explode selected text layer(s) into";
            utilTextTitle.alignment = ["center", "top"];

            // UTILTEXTGROUP
            // =============
            var utilTextGroup = utilText.add("group", undefined, { name: "utilTextGroup" });
            utilTextGroup.orientation = "row";
            utilTextGroup.alignChildren = ["center", "center"];
            utilTextGroup.spacing = 10;
            utilTextGroup.margins = 0;
            utilTextGroup.alignment = ["center", "top"];

            var utilTextLetterButton = utilTextGroup.add("button", undefined, undefined, { name: "utilTextLetterButton" });
            utilTextLetterButton.text = "Letters";
            utilTextLetterButton.preferredSize.width = 73;

            var utilTextWordButton = utilTextGroup.add("button", undefined, undefined, { name: "utilTextWordButton" });
            utilTextWordButton.text = "Words";
            utilTextWordButton.preferredSize.width = 73;

            var utilTextLineButton = utilTextGroup.add("button", undefined, undefined, { name: "utilTextLineButton" });
            utilTextLineButton.text = "Lines";
            utilTextLineButton.preferredSize.width = 73;

            // UTILKEYFRAME
            // ============
            var utilKeyframe = utilTextAndKeyframeHelper.add("panel", undefined, undefined, { name: "utilKeyframe" });
            utilKeyframe.text = "Keyframe Helper";
            utilKeyframe.orientation = "column";
            utilKeyframe.alignChildren = ["center", "top"];
            utilKeyframe.spacing = 10;
            utilKeyframe.margins = 10;

            // UTILKEYFRAMEGROUP
            // =================
            var utilKeyframeGroup = utilKeyframe.add("group", undefined, { name: "utilKeyframeGroup" });
            utilKeyframeGroup.orientation = "row";
            utilKeyframeGroup.alignChildren = ["center", "center"];
            utilKeyframeGroup.spacing = 10;
            utilKeyframeGroup.margins = 0;
            utilKeyframeGroup.alignment = ["center", "top"];

            var utilKeyframeTitle = utilKeyframeGroup.add("statictext", undefined, undefined, { name: "utilKeyframeTitle" });
            utilKeyframeTitle.helpTip = "Generate x amount of keyframes within a certain internval.";
            utilKeyframeTitle.text = "Generate keyframes every";
            utilKeyframeTitle.alignment = ["center", "center"];

            var utilKeyframeIntervalInput = utilKeyframeGroup.add('edittext {justify: "center", properties: {name: "utilKeyframeIntervalInput"}}');
            utilKeyframeIntervalInput.text = "500";
            utilKeyframeIntervalInput.preferredSize.width = 55;
            utilKeyframeIntervalInput.alignment = ["center", "center"];

            var utilKeyframeMs = utilKeyframeGroup.add("statictext", undefined, undefined, { name: "utilKeyframeMs" });
            utilKeyframeMs.text = "ms";

            // UTILKEYFRAMEGROUP1
            // ==================
            var utilKeyframeGroup1 = utilKeyframe.add("group", undefined, { name: "utilKeyframeGroup1" });
            utilKeyframeGroup1.orientation = "row";
            utilKeyframeGroup1.alignChildren = ["center", "center"];
            utilKeyframeGroup1.spacing = 10;
            utilKeyframeGroup1.margins = 0;
            utilKeyframeGroup1.alignment = ["center", "top"];

            var utilKeyframeCheckbox1 = utilKeyframeGroup1.add("checkbox", undefined, undefined, { name: "utilKeyframeCheckbox1" });
            utilKeyframeCheckbox1.text = "X Position";
            utilKeyframeCheckbox1.value = true;
            utilKeyframeCheckbox1.alignment = ["center", "center"];

            var utilKeyframeCheckbox2 = utilKeyframeGroup1.add("checkbox", undefined, undefined, { name: "utilKeyframeCheckbox2" });
            utilKeyframeCheckbox2.text = "Y Position";
            utilKeyframeCheckbox2.value = true;
            utilKeyframeCheckbox2.alignment = ["center", "center"];

            var utilKeyframeCheckbox3 = utilKeyframeGroup1.add("checkbox", undefined, undefined, { name: "utilKeyframeCheckbox3" });
            utilKeyframeCheckbox3.text = "Scale";
            utilKeyframeCheckbox3.value = true;
            utilKeyframeCheckbox3.alignment = ["center", "center"];

            // UTILKEYFRAMEGROUP2
            // ==================
            var utilKeyframeGroup2 = utilKeyframe.add("group", undefined, { name: "utilKeyframeGroup2" });
            utilKeyframeGroup2.orientation = "row";
            utilKeyframeGroup2.alignChildren = ["center", "center"];
            utilKeyframeGroup2.spacing = 10;
            utilKeyframeGroup2.margins = 0;
            utilKeyframeGroup2.alignment = ["center", "top"];

            var utilKeyframeCheckbox4 = utilKeyframeGroup2.add("checkbox", undefined, undefined, { name: "utilKeyframeCheckbox4" });
            utilKeyframeCheckbox4.text = "Rotation";
            utilKeyframeCheckbox4.value = true;
            utilKeyframeCheckbox4.alignment = ["center", "center"];

            var utilKeyframeCheckbox5 = utilKeyframeGroup2.add("checkbox", undefined, undefined, { name: "utilKeyframeCheckbox5" });
            utilKeyframeCheckbox5.text = "Opacity";
            utilKeyframeCheckbox5.value = true;
            utilKeyframeCheckbox5.alignment = ["center", "center"];

            var utilKeyframeGenerateButton = utilKeyframeGroup2.add("button", undefined, undefined, { name: "utilKeyframeGenerateButton" });
            utilKeyframeGenerateButton.text = "Generate";
            utilKeyframeGenerateButton.alignment = ["center", "center"];

            // UTILKEYFRAME
            // ============
            var utilKeyframeCheckbox6 = utilKeyframe.add("checkbox", undefined, undefined, { name: "utilKeyframeCheckbox6" });
            utilKeyframeCheckbox6.helpTip = "Optimize keyframes based on the motion of the position and angle. ONLY FOR POSITIONS";
            utilKeyframeCheckbox6.text = "Optimize keyframes based on motion";
            utilKeyframeCheckbox6.value = true;
            utilKeyframeCheckbox6.alignment = ["center", "center"];

            // UTILLOOPHELPER
            // ==============
            var utilLoopHelper = utilityTabs.add("tab", undefined, undefined, {name: "utilLoopHelper"}); 
            utilLoopHelper.text = "Loop"; 
            utilLoopHelper.orientation = "column"; 
            utilLoopHelper.alignChildren = ["center","top"]; 
            utilLoopHelper.spacing = 10; 
            utilLoopHelper.margins = 10; 

            // UTILITYTABS
            // ===========
            utilityTabs.selection = utilGeneral; 

            // UTILLOOPINFO
            // ============
            var utilLoopInfo = utilLoopHelper.add("group", undefined, {name: "utilLoopInfo"}); 
            utilLoopInfo.orientation = "row"; 
            utilLoopInfo.alignChildren = ["center","center"]; 
            utilLoopInfo.spacing = 10; 
            utilLoopInfo.margins = 0; 

            var utilLoopStart = utilLoopInfo.add("statictext", undefined, undefined, {name: "utilLoopStart"}); 
            utilLoopStart.text = "Start frame"; 

            var utilLoopStartInput = utilLoopInfo.add('edittext {properties: {name: "utilLoopStartInput"}}'); 
            utilLoopStartInput.preferredSize.width = 70; 
            utilLoopStartInput.alignment = ["center","center"]; 

            // UTILLOOPINFO1
            // =============
            var utilLoopInfo1 = utilLoopHelper.add("group", undefined, {name: "utilLoopInfo1"}); 
            utilLoopInfo1.orientation = "row"; 
            utilLoopInfo1.alignChildren = ["center","center"]; 
            utilLoopInfo1.spacing = 10; 
            utilLoopInfo1.margins = 0; 

            var utilLoopEnd = utilLoopInfo1.add("statictext", undefined, undefined, {name: "utilLoopEnd"}); 
            utilLoopEnd.text = "End frame"; 

            var utilLoopEndInput = utilLoopInfo1.add('edittext {properties: {name: "utilLoopEndInput"}}'); 
            utilLoopEndInput.preferredSize.width = 70; 
            utilLoopEndInput.alignment = ["center","center"]; 

            // UTILLOOPTYPEINFO
            // ================
            var utilLoopTypeInfo = utilLoopHelper.add("group", undefined, {name: "utilLoopTypeInfo"}); 
            utilLoopTypeInfo.orientation = "row"; 
            utilLoopTypeInfo.alignChildren = ["center","center"]; 
            utilLoopTypeInfo.spacing = 10; 
            utilLoopTypeInfo.margins = 0; 

            var utilLoopType = utilLoopTypeInfo.add("statictext", undefined, undefined, {name: "utilLoopType"}); 
            utilLoopType.text = "Loop type"; 

            var utilLoopTypes_array = ["LoopForever","LoopOnce"]; 
            var utilLoopTypes = utilLoopTypeInfo.add("dropdownlist", undefined, undefined, {name: "utilLoopTypes", items: utilLoopTypes_array}); 
            utilLoopTypes.selection = 0; 

            var utilLoopLayerIsSequence = utilLoopHelper.add("checkbox", undefined, undefined, { name: "utilLoopLayerIsSequence" });
            utilLoopLayerIsSequence.text = "Layer(s) is a sequence";
            utilLoopLayerIsSequence.helpTip = "Is the layer a Sequence? If checked, the marker will only include the Loop type";
            utilLoopLayerIsSequence.value = false;
            utilLoopLayerIsSequence.alignment = ["center", "top"];

            // UTILLOOPBUTTONS
            // ===============
            var utilLoopButtons = utilLoopHelper.add("group", undefined, {name: "utilLoopButtons"}); 
            utilLoopButtons.orientation = "row"; 
            utilLoopButtons.alignChildren = ["center","center"]; 
            utilLoopButtons.spacing = 10; 
            utilLoopButtons.margins = 0; 
            utilLoopButtons.alignment = ["center","top"]; 

            var utilLoopEnd = utilLoopButtons.add("statictext", undefined, undefined, {name: "utilLoopEnd"}); 
            utilLoopEnd.text = "Set"; 

            var utilLoopFrameButtonStart = utilLoopButtons.add("button", undefined, undefined, {name: "utilLoopFrameButtonStart"}); 
            utilLoopFrameButtonStart.text = "Start"; 

            var utilLoopFrameButtonEnd = utilLoopButtons.add("button", undefined, undefined, {name: "utilLoopFrameButtonEnd"}); 
            utilLoopFrameButtonEnd.text = "End";

            var utilLoopEnd = utilLoopButtons.add("statictext", undefined, undefined, {name: "utilLoopEnd"}); 
            utilLoopEnd.text = "frame"; 

            // UTILLOOPAPPLYBUTTON
            // ===============
            var utilLoopApplyButton = utilLoopHelper.add("button", undefined, undefined, {name: "utilLoopApplyButton"}); 
            utilLoopApplyButton.text = "Apply";

            // HOME
            // ====
            var home = tabbedpanel.add("tab", undefined, undefined, { name: "home" });
            home.text = "Home";
            home.orientation = "column";
            home.alignChildren = ["center", "top"];
            home.spacing = 10;
            home.margins = 10;

            // TABBEDPANEL
            // ===========
            tabbedpanel.selection = home;

            // PANEL1
            // ======
            var panel1 = home.add("panel", undefined, undefined, { name: "panel1" });
            panel1.text = "For unsupported layers";
            panel1.preferredSize.width = 280;
            panel1.orientation = "column";
            panel1.alignChildren = ["center", "top"];
            panel1.spacing = 10;
            panel1.margins = 10;
            panel1.alignment = ["center", "top"];

            var statictext3 = panel1.add("statictext", undefined, undefined, { name: "statictext3" });
            statictext3.text = "Render as PNG frames";

            var renderGroup = panel1.add("group", undefined, { name: "renderGroup" });
            renderGroup.orientation = "row";
            renderGroup.alignChildren = ["center", "top"];
            renderGroup.alignment = ["center", "top"];

            var renderAndImport_button = renderGroup.add("button", undefined, undefined, { name: "renderAndImport_button" });
            renderAndImport_button.helpTip = "Render all compositions that has unsupported layers for storyboards like solids, shapes, adjustment layers etc. before exporting the main compositions.";
            renderAndImport_button.text = "Render and import";

            // EXPORT_SECTION
            // ==============
            var export_section = home.add("group", undefined, { name: "export_section" });
            export_section.orientation = "column";
            export_section.alignChildren = ["center", "center"];
            export_section.spacing = 10;
            export_section.margins = 0;
            export_section.alignment = ["center", "top"];

            var export_button_imgString = (File($.fileName).path) + "/bitmap/e.png";
            var export_button = export_section.add("iconbutton", undefined, export_button_imgString, { name: "export_button", style: "toolbutton" });
            export_button.text = "Export compositions";
            export_button.alignment = ["center", "center"];

            var renderAndImport_iconbutton_imgString = (File($.fileName).path) + "/bitmap/f.png";
            var renderAndImport_iconbutton = export_section.add("iconbutton", undefined, renderAndImport_iconbutton_imgString, { name: "renderAndImport_iconbutton", style: "toolbutton" });
            renderAndImport_iconbutton.text = "Open file location";
            renderAndImport_iconbutton.alignment = ["center", "center"];

            // HOME
            // ====
            var divider2 = home.add("panel", undefined, undefined, { name: "divider2" });
            divider2.alignment = "fill";

            // GROUP4
            // ======
            var group4 = home.add("group", undefined, { name: "group4" });
            group4.orientation = "row";
            group4.alignChildren = ["center", "top"];
            group4.spacing = 10;
            group4.margins = 19;
            group4.alignment = ["center", "top"];

            var github_imgString = (File($.fileName).path) + "/bitmap/g.png"
            var github = group4.add("iconbutton", undefined, File.decode(github_imgString), { name: "github" });
            github.helpTip = "storybrew wiki";

            var discord_imgString = (File($.fileName).path) + "/bitmap/d.png"
            var discord1 = group4.add("iconbutton", undefined, File.decode(discord_imgString), { name: "discord1" });
            discord1.helpTip = "osu! storyboarder banquet";

            var discord2 = group4.add("iconbutton", undefined, File.decode(discord_imgString), { name: "discord2" });
            discord2.helpTip = "pochiii (pono and tochi's sb discord server)";

            var website_imgString = (File($.fileName).path) + "/bitmap/w.png"
            var website = group4.add("iconbutton", undefined, File.decode(website_imgString), { name: "website" });
            website.helpTip = "pochiii.com - storyboard resources website";

            // HOME
            // ====
            var button3 = home.add("button", undefined, undefined, { name: "button3" });
            button3.text = "Documentation";
            button3.alignment = ["center", "top"];

            var parentsInComp = false;
            // var currentLayerStep = 0;

            // FUNCTIONS ////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////
            function importSettings() {
                scriptSettings = readSettings();
                if (!settingsJsonFile.exists) {

                    settingsJsonFile.open('w');
                    statictext1.text = scriptSettings.scriptslibraryFolderPath;
                    statictext2.text = scriptSettings.outputFolderPath;
                    scriptslibrary_button.text = "Scriptslibrary folder";
                    checkbox1.text = "Export .json only";
                    checkbox1.value = scriptSettings.options.exportJsonOnly;
                    checkbox2.text = "Export text per letter";
                    checkbox2.value = scriptSettings.options.exportTextPerLetter;
                    checkbox8.text = "Open output folder before rendering";
                    checkbox8.value = scriptSettings.options.openOutputFolderBeforeRendering;
                    checkbox3.text = "Shape layers";
                    checkbox3.value = scriptSettings.options.shapeLayers;
                    checkbox4.text = "Text layers";
                    checkbox4.value = scriptSettings.options.textLayers;
                    checkbox5.text = "Image layers";
                    checkbox5.value = scriptSettings.options.imageLayers;
                    checkbox6.text = "3D layers";
                    checkbox6.value = scriptSettings.options.threeDLayers;
                    checkbox7.text = "Unsupported layers";
                    checkbox7.value = scriptSettings.options.unsupportedLayers;

                    utilKeyframeIntervalInput.text = scriptSettings.keyframeHelper.interval;
                    utilKeyframeCheckbox1.text = "X Position";
                    utilKeyframeCheckbox1.value = scriptSettings.keyframeHelper.xPosition;
                    utilKeyframeCheckbox2.text = "Y Position";
                    utilKeyframeCheckbox2.value = scriptSettings.keyframeHelper.yPosition;
                    utilKeyframeCheckbox3.text = "Scale";
                    utilKeyframeCheckbox3.value = scriptSettings.keyframeHelper.scale;
                    utilKeyframeCheckbox4.text = "Rotation";
                    utilKeyframeCheckbox4.value = scriptSettings.keyframeHelper.rotation;
                    utilKeyframeCheckbox5.text = "Opacity";
                    utilKeyframeCheckbox5.value = scriptSettings.keyframeHelper.opacity;
                    utilKeyframeCheckbox6.text = "Optimize keyframes based on motion";
                    utilKeyframeCheckbox6.value = scriptSettings.keyframeHelper.optimizeKeyframesBasedOnMotion;

                    settingsJsonFile.write(JSON.stringify(scriptSettings, null, '    '));
                    settingsJsonFile.close();

                    // return scriptSettings;
                }

                if (settingsJsonFile.exists) {
                    scriptSettings = readSettings();
                    var currentSettings = scriptSettings;

                    statictext1.text = currentSettings.scriptslibraryFolderPath;
                    statictext2.text = currentSettings.outputFolderPath;
                    scriptslibrary_button.text = "Scriptslibrary folder";
                    checkbox1.text = "Export .json only";
                    checkbox1.value = currentSettings.options.exportJsonOnly;
                    checkbox1.enabled = false;
                    checkbox2.text = "Export text per letter";
                    checkbox2.value = currentSettings.options.exportTextPerLetter;
                    checkbox2.enabled = true;
                    checkbox8.text = "Open output folder before rendering";
                    checkbox8.value = scriptSettings.options.openOutputFolderBeforeRendering;
                    checkbox8.enabled = true;
                    checkbox3.text = "Shape layers";
                    checkbox3.value = currentSettings.options.shapeLayers;
                    checkbox3.enabled = false;
                    checkbox4.text = "Text layers";
                    checkbox4.value = currentSettings.options.textLayers;
                    checkbox4.enabled = false;
                    checkbox5.text = "Image layers";
                    checkbox5.value = currentSettings.options.imageLayers;
                    checkbox5.enabled = false;
                    checkbox6.text = "3D layers";
                    checkbox6.value = currentSettings.options.threeDLayers;
                    checkbox6.enabled = false;
                    checkbox7.text = "Unsupported layers";
                    checkbox7.value = currentSettings.options.unsupportedLayers;
                    checkbox7.enabled = false;

                    utilKeyframeIntervalInput.text = scriptSettings.keyframeHelper.interval;
                    utilKeyframeCheckbox1.text = "X Position";
                    utilKeyframeCheckbox1.value = scriptSettings.keyframeHelper.xPosition;
                    utilKeyframeCheckbox1.enabled = true;
                    utilKeyframeCheckbox2.text = "Y Position";
                    utilKeyframeCheckbox2.value = scriptSettings.keyframeHelper.yPosition;
                    utilKeyframeCheckbox2.enabled = true;
                    utilKeyframeCheckbox3.text = "Scale";
                    utilKeyframeCheckbox3.value = scriptSettings.keyframeHelper.scale;
                    utilKeyframeCheckbox3.enabled = true;
                    utilKeyframeCheckbox4.text = "Rotation";
                    utilKeyframeCheckbox4.value = scriptSettings.keyframeHelper.rotation;
                    utilKeyframeCheckbox4.enabled = true;
                    utilKeyframeCheckbox5.text = "Opacity";
                    utilKeyframeCheckbox5.value = scriptSettings.keyframeHelper.opacity;
                    utilKeyframeCheckbox5.enabled = true;
                    utilKeyframeCheckbox6.text = "Optimize keyframes based on motion";
                    utilKeyframeCheckbox6.value = scriptSettings.keyframeHelper.optimizeKeyframesBasedOnMotion;
                    utilKeyframeCheckbox6.enabled = true;

                    // return currentSettings;
                }
            }
            importSettings();

            if (readSettings().settingsJsonFile == "") {
                scriptSettings = readSettings();
                scriptSettings.settingsJsonFile = File.decode(settingsJsonFile.fsName);
                writeSettings(scriptSettings);
            }
            if (readSettings().scriptFileFolderPath == "") {
                scriptSettings = readSettings();
                scriptSettings.scriptFileFolderPath = scriptFileFolderPath();
                writeSettings(scriptSettings);
            }

            scriptslibrary_button.onClick = function () {
                var scriptslibraryFolder = selectFolder("Please find and select the scriptslibrary folder.");

                if (checkbox1.value !== true) {
                    if (scriptslibraryFolder == null) {
                        alert("AeToOsb WARNING: Please find and select the scriptslibrary folder." + "\r\n" + "This is relevant when the option 'Export .json only' is unchecked.");
                    }
                }

                // add changes to settings.json ////////////////
                ////////////////////////////////////////////////
                var selectedPath = scriptslibraryFolder.fsName;
                statictext1.text = selectedPath;
                if (scriptslibraryFolder !== null) {
                    updateSettings('scriptslibraryFolderPath', selectedPath);
                }
                else {
                    updateSettings('scriptslibraryFolderPath', "");
                }
            }

            statictext1.onChanging = function () { // scriptslibrary path text
                // add changes to settings.json ////////////////
                ////////////////////////////////////////////////
                var writtenText = this.text;
                statictext1.text = writtenText;
                updateSettings('scriptslibraryFolderPath', writtenText);
            }

            outputpath_button.onClick = function () {
                var outputFolder = selectFolder("Please select a location for the .json file.");

                // add changes to settings.json ////////////////
                ////////////////////////////////////////////////
                var selectedPath = outputFolder.fsName;
                statictext2.text = selectedPath;

                if (outputFolder !== null) {
                    updateSettings('outputFolderPath', selectedPath);
                }
                else {
                    updateSettings('outputFolderPath', "");
                }
            }

            statictext2.onChanging = function () { // scriptslibrary path text
                // add changes to settings.json ////////////////
                ////////////////////////////////////////////////
                var writtenText = this.text;
                statictext2.text = writtenText;
                updateSettings('outputFolderPath', writtenText);
            }

            checkbox1.onClick = function () {
                function checkBox(value) {
                    if (statictext1.text == "<-- Please find this fo..") {
                        statictext1.text = "";
                    }
                    updateSettings('exportJsonOnly', value);
                }
                if (statictext1.text == "") {
                    if (checkbox1.value == false) {
                        statictext1.text = "<-- Please find this fo..";
                        statictext1.helpTip = "Please find the scriptslibrary folder." + "\r\n" + "This is necessary when 'Export .json only' is unchecked.";
                    }
                }
                checkbox1.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox2.onClick = function () {
                function checkBox(value) {
                    updateSettings('exportTextPerLetter', value);
                }
                checkbox2.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox3.onClick = function () {
                function checkBox(value) {
                    updateSettings('shapeLayers', value);
                }
                checkbox3.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox4.onClick = function () {
                function checkBox(value) {
                    updateSettings('textLayers', value);
                }
                checkbox4.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox5.onClick = function () {
                function checkBox(value) {
                    updateSettings('imageLayers', value);
                }
                checkbox5.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox6.onClick = function () {
                function checkBox(value) {
                    updateSettings('threeDLayers', value);
                }
                checkbox6.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox7.onClick = function () {
                function checkBox(value) {
                    updateSettings('unsupportedLayers', value);
                }
                checkbox7.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            checkbox8.onClick = function () {
                function checkBox(value) {
                    updateSettings('openOutputFolderBeforeRendering', value);
                }
                checkbox8.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            button3.onClick = function () {
                if (osCheck() == "PC") {
                    var urlLaunchCode = "Start";
                    system.callSystem("cmd.exe /c " + urlLaunchCode + " " + "https://github.com/T0chi/AeToOsb/wiki");
                }
                if (osCheck() == "MAC") {
                    var urlLaunchCode = "Open";
                    system.callSystem(urlLaunchCode + " " + "https://github.com/T0chi/AeToOsb/wiki");

                }
            }

            github.onClick = function () {
                if (osCheck() == "PC") {
                    var urlLaunchCode = "Start";
                    system.callSystem("cmd.exe /c " + urlLaunchCode + " " + "https://github.com/Damnae/storybrew/wiki/Sprite-Methods");
                }
                if (osCheck() == "MAC") {
                    var urlLaunchCode = "Open";
                    system.callSystem(urlLaunchCode + " " + "https://github.com/Damnae/storybrew/wiki/Sprite-Methods");

                }
            }

            discord1.onClick = function () {
                if (osCheck() == "PC") {
                    var urlLaunchCode = "Start";
                    system.callSystem("cmd.exe /c " + urlLaunchCode + " " + "https://discord.gg/nSXEgKndqb");
                }
                if (osCheck() == "MAC") {
                    var urlLaunchCode = "Open";
                    system.callSystem(urlLaunchCode + " " + "https://discord.gg/nSXEgKndqb");

                }
            }

            discord2.onClick = function () {
                if (osCheck() == "PC") {
                    var urlLaunchCode = "Start";
                    system.callSystem("cmd.exe /c " + urlLaunchCode + " " + "https://discord.gg/QZjD3yb");
                }
                if (osCheck() == "MAC") {
                    var urlLaunchCode = "Open";
                    system.callSystem(urlLaunchCode + " " + "https://discord.gg/QZjD3yb");

                }
            }

            website.onClick = function () {
                if (osCheck() == "PC") {
                    var urlLaunchCode = "Start";
                    system.callSystem("cmd.exe /c " + urlLaunchCode + " " + "https://pochiii.com/");
                }
                if (osCheck() == "MAC") {
                    var urlLaunchCode = "Open";
                    system.callSystem(urlLaunchCode + " " + "https://pochiii.com/");

                }
            }

            function osCheck() {
                var op = $.os;
                var match = op.indexOf("Windows");
                if (match != (-1)) {
                    var userOS = "PC";
                } else {
                    var userOS = "MAC";
                }
                return userOS;
            }

            function selectFolder(message) {
                var selectedFolder = Folder.selectDialog(message);
                return selectedFolder;
            }

            // function saveFile(message) {
            //     var savedFile = File.saveDialog(message);
            //     return savedFile;
            // }

            // selectFile = function (message, filetypes, multiselect) {

            //     if ($.os.search(/windows/i) != -1) {
            //         var selectedFile = File.openDialog(message, filetypes, multiselect);
            //         //// filetype input example for windows //////
            //         // '*.nef;*.cr2;*.crw;*.dcs;*.raf;*.arw;*.orf;*.dng;*.psd;*.tif;*.tiff;*.jpg;*.jpe;*.jpeg;*.png;*.bmp'
            //     }
            //     else {
            //         var selectedFile = File.openDialog(message, fileTypesMac(), multiselect);
            //     }

            //     //// filetype input example for mac //////
            //     function fileTypesMac() {
            //         if (filetypes !== undefined) {
            //             filetypes.replace("*.", ""); filetypes.replace(";", "|");
            //         }

            //         var ftString = '/\.(' + filetypes + ')$/i';
            //         if (selectedFile.name.match(ftString) || selectedFile.constructor.name == "Folder") {
            //             return true;
            //         }

            //         return selectedFile;
            //     }
            // }

            function updateSettings(optionName, optionValue) {
                if (settingsJsonFile.exists) {
                    var data = readSettings();
                    if (optionName == 'scriptslibraryFolderPath') {
                        data.scriptslibraryFolderPath = optionValue;
                        if (data.outputFolderPath == "") {
                            function deletePathFragment() { // compatible will any OS
                                if (optionValue.indexOf('\\scriptslibrary') !== -1) {
                                    var pathFragment = "\\scriptslibrary";
                                    return pathFragment;
                                }
                                if (optionValue.indexOf('\scriptslibrary') !== -1) {
                                    var pathFragment = "\scriptslibrary";
                                    return pathFragment;
                                }
                                if (optionValue.indexOf('//scriptslibrary') !== -1) {
                                    var pathFragment = "//scriptslibrary";
                                    return pathFragment;
                                }
                                if (optionValue.indexOf('/scriptslibrary') !== -1) {
                                    var pathFragment = "/scriptslibrary";
                                    return pathFragment;
                                }
                            }
                            var sbProjectFolder = optionValue.replace(deletePathFragment(), "");
                            statictext2.text = sbProjectFolder;
                            data.outputFolderPath = sbProjectFolder;
                        }
                    }
                    if (optionName == 'outputFolderPath') {
                        data.outputFolderPath = optionValue;
                    }
                    if (optionName == 'exportJsonOnly') {
                        data.options.exportJsonOnly = optionValue;
                    }
                    if (optionName == 'exportTextPerLetter') {
                        data.options.exportTextPerLetter = optionValue;
                    }
                    if (optionName == 'openOutputFolderBeforeRendering') {
                        data.options.openOutputFolderBeforeRendering = optionValue;
                    }
                    if (optionName == 'shapeLayers') {
                        data.options.shapeLayers = optionValue;
                    }
                    if (optionName == 'textLayers') {
                        data.options.textLayers = optionValue;
                    }
                    if (optionName == 'imageLayers') {
                        data.options.imageLayers = optionValue;
                    }
                    if (optionName == 'threeDLayers') {
                        data.options.threeDLayers = optionValue;
                    }
                    if (optionName == 'unsupportedLayers') {
                        data.options.unsupportedLayers = optionValue;
                    }
                    if (optionName == 'interval') {
                        data.keyframeHelper.interval = optionValue;
                    }
                    if (optionName == 'xPosition') {
                        data.keyframeHelper.xPosition = optionValue;
                    }
                    if (optionName == 'yPosition') {
                        data.keyframeHelper.yPosition = optionValue;
                    }
                    if (optionName == 'scale') {
                        data.keyframeHelper.scale = optionValue;
                    }
                    if (optionName == 'rotation') {
                        data.keyframeHelper.rotation = optionValue;
                    }
                    if (optionName == 'opacity') {
                        data.keyframeHelper.opacity = optionValue;
                    }
                    if (optionName == 'optimizeKeyframesBasedOnMotion') {
                        data.keyframeHelper.optimizeKeyframesBasedOnMotion = optionValue;
                    }
                    var newData = {
                        scriptslibraryFolderPath: Folder.decode(data.scriptslibraryFolderPath),
                        outputFolderPath: data.outputFolderPath,
                        options: {
                            exportJsonOnly: data.options.exportJsonOnly,
                            exportTextPerLetter: data.options.exportTextPerLetter,
                            openOutputFolderBeforeRendering: data.options.openOutputFolderBeforeRendering,
                            shapeLayers: data.options.shapeLayers,
                            textLayers: data.options.textLayers,
                            imageLayers: data.options.imageLayers,
                            threeDLayers: data.options.threeDLayers,
                            unsupportedLayers: data.options.unsupportedLayers
                        },
                        keyframeHelper: {
                            interval: data.keyframeHelper.interval,
                            xPosition: data.keyframeHelper.xPosition,
                            yPosition: data.keyframeHelper.yPosition,
                            scale: data.keyframeHelper.scale,
                            rotation: data.keyframeHelper.rotation,
                            opacity: data.keyframeHelper.opacity,
                            optimizeKeyframesBasedOnMotion: data.keyframeHelper.optimizeKeyframesBasedOnMotion
                        },
                        settingsJsonFile: File.decode(settingsJsonFile.fsName),
                        scriptFileFolderPath: scriptFileFolderPath(),
                        exportedComps: data.exportedComps,
                        exportedCompNames: data.exportedCompNames
                    };
                    return writeSettings(newData);
                }
                if (!settingsJsonFile.exists) {
                    alert("AeToOsb error: 'settings.json' not found.");
                }
            }

            function readSettings() {
                settingsJsonFile.open('r');
                var data = settingsJsonFile.read();
                settingsJsonFile.close();
                data = JSON.parse(data);

                return data;
            }

            function writeSettings(data) {
                settingsJsonFile.open('w');
                settingsJsonFile.write(JSON.stringify(data, null, '    '));
                settingsJsonFile.close();
            }

            var outputJsonFile = File(Folder.decode(readSettings().outputFolderPath) + "\\AeToOsb.json");

            function readOutput() {
                outputJsonFile.open('r');
                var data = outputJsonFile.read();
                outputJsonFile.close();
                data = JSON.parse(data);

                return data;
            }

            function writeOutput(data) {
                scriptSettings = readSettings();
                var file = outputJsonFile;
                file.open("w")
                file.write(JSON.stringify(data, null, '    '));
                file.close();

                var decodedName = "";
                var decodedName2 = "";
                var scriptslibraryFolderFileObj;
                var docuPath = '~/Documents/AeToOsb';
                var _AeToOsbFolderFileObj = new Folder(scriptSettings.scriptslibraryFolderPath.slice(0, -15) + "\\assetlibrary\\_AeToOsb");
                var gridImage = new File(docuPath + "/bitmap/grid.png");
                var bImage = new File(docuPath + "/bitmap/b.png");
                var pImage = new File(docuPath + "/bitmap/p.png");
                var NewtonsoftFile = new File(docuPath + "/Newtonsoft.Json.dll");
                var AeToOsbFile = new File(docuPath + "/AeToOsb.cs");
                var AeToOsbParserFile = new File(docuPath + "/AeToOsbParser.cs");
                var AeToOsbSettingsFile = new File(docuPath + "/AeToOsbSettings.cs");
                // var DeleteBackgroundFile = new File(docuPath + "/DeleteBackground.cs");
                // alert(scriptslibraryFolderFileObj.fsName);

                decodedName2 = File.decode(_AeToOsbFolderFileObj.fsName);
                if (!_AeToOsbFolderFileObj.exists)
                    createNewFolder(decodedName2);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath.slice(0, -15) + "\\assetlibrary\\_AeToOsb\\grid.png");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    gridImage.copy(decodedName);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath.slice(0, -15) + "\\assetlibrary\\_AeToOsb\\b.png");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    bImage.copy(decodedName);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath.slice(0, -15) + "\\assetlibrary\\_AeToOsb\\p.png");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    pImage.copy(decodedName);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath + "\\Newtonsoft.Json.dll");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    NewtonsoftFile.copy(decodedName);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath.slice(0, -15) + "\\AeToOsb.cs");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    AeToOsbFile.copy(decodedName);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath + "\\AeToOsbParser.cs");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    AeToOsbParserFile.copy(decodedName);

                scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath + "\\AeToOsbSettings.cs");
                decodedName = File.decode(scriptslibraryFolderFileObj.fsName);
                if (!File(decodedName).exists)
                    AeToOsbSettingsFile.copy(decodedName);

                // scriptslibraryFolderFileObj = new File(scriptSettings.scriptslibraryFolderPath.slice(0, -15) + "\\DeleteBackground.cs");
                // decodedName = File.decode(scriptslibraryFolderFileObj.fsName.replaceAll);
                // if (!File(decodedName).exists)
                //     DeleteBackgroundFile.copy(decodedName);
            }

            function exportedJsonName() {
                var exportedJsonName = "AeToOsb";
                return exportedJsonName;
            }

            function getLayerType(layerItem) {
                if (layerItem.source instanceof CompItem)
                    return layerItem.containingComp.id + ".Composition"; // Unsupported in storybrew & .osb
                if (layerItem instanceof ShapeLayer)
                    return layerItem.containingComp.id + ".Shape"; // Unsupported in storybrew & .osb
                if (layerItem instanceof TextLayer)
                    return layerItem.containingComp.id + ".Text";
                if (layerItem.nullLayer)
                    return layerItem.containingComp.id + ".NullLayer";
                if (layerItem.adjustmentLayer)
                    return layerItem.containingComp.id + ".Adjustment"; // Unsupported in storybrew & .osb
                if (layerItem instanceof CameraLayer)
                    return layerItem.containingComp.id + ".Camera";
                if (layerItem instanceof LightLayer)
                    return layerItem.containingComp.id + ".Light"; // Unsupported in storybrew & .osb
                if (layerItem.source.mainSource instanceof SolidSource)
                    return layerItem.containingComp.id + ".Solid"; // Unsupported in storybrew & .osb
                if (layerItem.source instanceof PlaceholderSource)
                    return layerItem.containingComp.id + ".Placeholder"; // Unsupported in storybrew & .osb

                var fileItem = layerItem.source.mainSource.file;
                // var layerFileName = fileName(fileItem);
                var layerFileExt = fileExt(fileItem);
                function fileName(file) {
                    return file.name.replace(/.[^.]+$/, '');
                }
                function fileExt(file) {
                    return file.name.replace(/^.*\./, '');
                }

                if (layerItem.source instanceof (FootageItem || FootageSource) && layerItem.hasVideo) {
                    if (layerItem.source.mainSource.isStill && !layerItem.hasAudio)
                        if (layerFileExt.match(new RegExp("(bmp|bw|cin|cr2|crw|dcr|dng|dib|dpx|eps|erf|exr|hdr|icb|iff|jpe|jpeg|jpg|mos|mrw|nef|orf|pbm|pef|pct|pcx|pdf|pic|pict|png|ps|pxr|raf|raw|rgb|rgbe|rla|rle|rpf|sgi|srf|tdi|tga|tif|tiff|vda|vst|x3f|xyze)", "i")))
                            return layerItem.containingComp.id + ".Image";
                    if (!layerItem.source.mainSource.isStill && layerItem.hasAudio)
                        if (layerFileExt.match(new RegExp("(crm|mfx|mov|3gpp|3gp|3g2|amc|flv|f4v|m2ts|mpg|mpe|mpa|mpv|mod|mp2|m2v|m2a|m2t|mp4|m4v|omf|avi|wmv|wma)", "i")))
                            return layerItem.containingComp.id + ".Video"; // Unsupported in storybrew & .osb
                }
                if (layerItem.source.mainSource instanceof FileSource) {
                    if (layerFileExt.match(new RegExp("(gif|jpg|png|psd|tif|tiff)", "i")))
                        return layerItem.containingComp.id + ".Sequence";
                    if (layerFileExt.match(new RegExp("(obj|stl|fbx|collada|3ds|iges|step|vrml|x3d|c4d)", "i")))
                        return layerItem.containingComp.id + ".3D"; // Unsupported in storybrew & .osb
                    if (layerFileExt.match(new RegExp("(mp3|wav|ogg|aif|aiff|aac|m4a)", "i")))
                        return layerItem.containingComp.id + ".Audio";
                    if (layerFileExt.match(new RegExp("(ai|svg)", "i")))
                        return layerItem.containingComp.id + ".Vector"; // Unsupported in storybrew & .osb
                    if (layerFileExt.match(new RegExp("(jsx)", "i")))
                        return layerItem.containingComp.id + ".Script"; // Unsupported in storybrew & .osb
                    if (layerFileExt.match(new RegExp("(json)", "i")))
                        return layerItem.containingComp.id + ".JSON"; // Unsupported in storybrew & .osb
                    if (layerFileExt.match(new RegExp("(mgjson)", "i")))
                        return layerItem.containingComp.id + ".mgJSON"; // Unsupported in storybrew & .osb
                    if (layerFileExt.match(new RegExp("(csv)", "i")))
                        return layerItem.containingComp.id + ".CSV"; // Unsupported in storybrew & .osb
                    if (layerFileExt.match(new RegExp("(tsv|txt)", "i")))
                        return layerItem.containingComp.id + ".TXT"; // Unsupported in storybrew & .osb
                }
            }

            // function compsWithEffects() {
            //     scriptSettings = readSettings();
            //     var comps = [];
            //     for (var I = 1; I <= app.project.numItems; I++) {
            //         if (app.project.item(I) instanceof CompItem) {
            //             for (var l = 1; l <= app.project.item(I).numLayers; l++) {
            //                 if (app.project.item(I).layer(l).Effects.numProperties >= 1) {

            //                     alert("AeToOsb WARNING: The layer '" + app.project.item(I).layer(l).name + "' has effects applied, they will be ignored on export. Please run 'Render and import' to include them on export.");

            //                     comps.push(app.project.item(I));
            //                 }
            //                 if (app.project.item(I).layer(l).Effects.numProperties < 1) {
            //                     alert("no comps with effects");
            //                 }
            //             }
            //         }
            //     }
            //     return removeDuplicates(comps);
            // }

            function getUnsupportedLayers() {
                scriptSettings = readSettings();

                // alert("compsWithEffects().length: " + compsWithEffects().length);

                if (scriptSettings.scriptslibraryFolderPath !== "") {
                    var comps = [];
                    var comps2 = [];
                    // var compIDs = [];
                    var compNames = [];
                    var compUnsupportedIDs = [];
                    var compUnsupportedComps = [];
                    var compUnsupportedNames = [];

                    var apsID = [];
                    var apsName = [];
                    var aps = app.project.selection;
                    for (var I = 0; I <= aps.length; I++) {
                        if (aps[I] instanceof CompItem) {
                            apsID.push(aps[I].id);
                            apsName.push(aps[I].name);
                        }
                    }

                    if (aps.length >= 1) {
                        scriptSettings.exportedComps = apsName;
                        scriptSettings.exportedCompNames = apsID;
                        writeSettings(scriptSettings);
                    }
                    else if (aps.length === 0) {
                        scriptSettings.exportedComps = null;
                        scriptSettings.exportedCompNames = null;
                        writeSettings(scriptSettings);
                        scriptSettings = readSettings();
                    }

                    if (scriptSettings.exportedCompNames === null) {
                        for (var I = 1; I <= app.project.numItems; I++) {
                            var itemsAll = app.project.item(I);
                            if (itemsAll instanceof CompItem) {
                                compNames.push(itemsAll.name);
                                // compIDs.push(itemsAll.id);
                            }
                        }
                    }
                    else if (scriptSettings.exportedCompNames !== null) {
                        // compIDs = scriptSettings.exportedCompNames;
                        compNames = scriptSettings.exportedCompNames;
                        for (var I = 1; I <= app.project.numItems; I++) {
                            for (var c = 0; c <= compNames.length; c++)
                                if (app.project.item(I).name == compNames[c])
                                    comps.push(app.project.item(I));
                        }
                    }

                    if (scriptSettings.exportedComps !== null) {
                        var ec = scriptSettings.exportedComps;
                        for (var I = 0; I <= ec.length; I++)
                            comps2.push(ec[I]);
                    }

                    if (scriptSettings.exportedComps === null)
                        for (var I = 1; I <= app.project.numItems; I++) {
                            for (var c = 0; c <= compNames.length; c++) {
                                for (var l = 1; l <= app.project.item(I).numLayers; l++) {
                                    if ((compNames[c] == app.project.item(I).name)) {

                                        var itemName;
                                        if (app.project.item(I).name.indexOf("((old))") >= 0) {
                                            itemName = app.project.item(I).name;
                                        }
                                        // alert(itemName);

                                        if (itemName === undefined) {
                                            if (app.project.item(I).layer(l).enabled) {
                                                if (layerTypeSplit(getLayerType(app.project.item(I).layer(l))).match(/^(Composition|Adjustment|Light|Placeholder|Video|3D|Vector|Script|JSON|mgJSON|CSV|TXT)$/)) {
                                                    compUnsupportedIDs.push(getLayerType(app.project.item(I).layer(l)).substr(0, getLayerType(app.project.item(I).layer(l)).indexOf('.')));
                                                    compUnsupportedComps.push(app.project.item(I));
                                                    compUnsupportedNames.push(app.project.item(I).name);
                                                    // alert(app.project.item(I).layer(l).name);
                                                }
                                            }
                                        }
                                        else if (app.project.item(I).name !== itemName && app.project.item(I).name !== itemName.slice(0, -8)) {
                                            if (app.project.item(I).layer(l).enabled) {
                                                if (layerTypeSplit(getLayerType(app.project.item(I).layer(l))).match(/^(Composition|Adjustment|Light|Placeholder|Video|3D|Vector|Script|JSON|mgJSON|CSV|TXT)$/)) {
                                                    compUnsupportedIDs.push(getLayerType(app.project.item(I).layer(l)).substr(0, getLayerType(app.project.item(I).layer(l)).indexOf('.')));
                                                    compUnsupportedComps.push(app.project.item(I));
                                                    compUnsupportedNames.push(app.project.item(I).name);
                                                    // alert(app.project.item(I).layer(l).name);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    // removeDuplicates(compUnsupportedIDs)
                    // alert(removeDuplicates(compUnsupportedIDs).length);

                    if (scriptSettings.exportedCompNames === null)
                        var message = "Found unsupported layers in " + removeDuplicates(compUnsupportedIDs).length + " compositions.";
                    if (scriptSettings.exportedCompNames !== null)
                        var message = "Found unsupported layers in " + removeDuplicates(compNames).length + " compositions.";
                    atsStatusMessage1.text = message;
                    atsStatusMessage2.text = "Do you want to proceed?";

                    yesButton.onClick = function () {
                        if (scriptSettings.exportedCompNames === null)
                            renderAndImportComp(removeDuplicates(compUnsupportedNames), removeDuplicates(compUnsupportedComps), removeDuplicates(compUnsupportedIDs));
                        if (scriptSettings.exportedCompNames !== null)
                            renderAndImportComp(removeDuplicates(comps2), removeDuplicates(comps), removeDuplicates(compNames));
                        yesButton.enabled = false;
                        noButton.text = "Cancel";
                        AeToOsb.update();
                    }
                }

                if (scriptSettings.scriptslibraryFolderPath == "") {
                    alert("AeToOsb error: Please find and select the scriptslibrary folder before exporting unsupported layers as GIF frames.");
                }
            }

            renderAndImport_button.onClick = function () {

                if (File(app.project.file.fsName).exists == false)
                    alert("AeToOsb WARNING: Please save your project before performing this action. This is necessary so a backup can be made before this action.");
                if (File(app.project.file.fsName).exists !== false) {
                    tabbedpanel.selection = atsStatus;
                    backupProject();
                    getUnsupportedLayers();
                    yesButton.text = "Yes";
                    noButton.text = "Cancel";
                    yesButton.enabled = true;
                    noButton.enabled = true;
                    AeToOsb.update();
                }
            }

            function createNewFolder(path) {
                var nF = new Folder(path);
                if (!nF.exists)
                    nF.create();
            }

            // function importFiles(folder, fileType, importType, isSequence, forceABC) {
            //     var importOptions = new ImportOptions();
            //     var type;
            //     if (importType === 'comp cropped layers')
            //     type = ImportAsType.COMP_CROPPED_LAYERS;
            //     if (importType === 'footage')
            //     type = ImportAsType.FOOTAGE;
            //     if (importType === 'comp')
            //     type = ImportAsType.COMP;
            //     if (importType === 'project')
            //     type = ImportAsType.PROJECT;

            //     var file = folder.getFiles('*.' + fileType);
            //     importOptions.file = File(file[0]);
            //     alert(file.name);

            //     if (importOptions.canImportAs(type))
            //     importOptions.importAs = type;
            //     if (importOptions.canImportAs(type) == false)
            //     alert("AeToOsb error: Cannot import file(s) as " + type.toString() + ".");

            //     if (isSequence === false)
            //     importOptions.sequence = false;
            //     if (isSequence === !false)
            //     importOptions.sequence = true;

            //     if (forceABC === false)
            //     importOptions.forceAlphabetical = false;
            //     if (forceABC === !false)
            //     importOptions.forceAlphabetical = true;

            //     var result = app.project.importFile(importOptions);
            //     return result;
            // }

            function importFiles(path, hasFullPath, fileType, importType, isSequence, forceABC) {
                var importOptions = new ImportOptions();
                var type;
                if (importType === 'comp cropped layers')
                    type = ImportAsType.COMP_CROPPED_LAYERS;
                if (importType === 'footage')
                    type = ImportAsType.FOOTAGE;
                if (importType === 'comp')
                    type = ImportAsType.COMP;
                if (importType === 'project')
                    type = ImportAsType.PROJECT;

                if (!hasFullPath) {
                    var getFiles = path.getFiles(fileType);
                    importOptions.file = File(getFiles[0]);
                }
                if (hasFullPath)
                    importOptions.file = File(path);

                if (importOptions.canImportAs(type))
                    importOptions.importAs = type;
                importOptions.sequence = isSequence;
                importOptions.forceAlphabetical = forceABC;

                var result = app.project.importFile(importOptions);
                return result;
            }

            function getFolderByName(name) {
                var i, folderItem;
                for (i = 1; i <= app.project.numItems; i++) {
                    folderItem = app.project.item(i);
                    // if (folderItem.typeName === ("Folder"||"Ordner"||"Carpeta"||"Dossier"||"Cartella"||"Pasta") && folderItem.name === name)
                    if (folderItem.typeName.match(/^(Folder|Ordner|Carpeta|Dossier|Cartella|Pasta)$/) && folderItem.name === name)
                        return folderItem;
                }
                return null;
            }

            // function getCompsByNameID(name, id) {
            //     for (var i = 1; i <= app.project.numItems; i++) {
            //         var comp = app.project.item(i);
            //         var compID = app.project.item(i).id;
            //         var compName = app.project.item(i).name;
            //         if (compName === name || (compName + " ((old))") === name && comp instanceof CompItem) {
            //             if (compID === id && comp instanceof CompItem) {
            //                 // alert("comp.id: " + comp.id);
            //                 // alert("compName: " + compName);
            //                 // alert("compID: " + compID);
            //                 alert(comp.name);
            //                 return comp;
            //             }
            //         }
            //         else if ((compName == name || compName == name + " ((old))") && comp.id !== id) {
            //             alert("AeToOsb error: Could not match Composition ID for " + name + ". Are you sure it's unique (no duplicates)?");
            //             return undefined;
            //         }
            //     }
            // }

            // function getFootageByName(name, id) {
            //     var i, footageItem;
            //     for (i = 1; i <= app.project.numItems; i++) {
            //         footageItem = app.project.item(i);

            //         if (id !== null) {
            //             if ((footageItem.name == name || footageItem.name == name + " ((old))") && footageItem.id == id) {
            //                 // if (footageItem.typeName === ("Footage"||"Material de archivo"||"Métrage"||"Metraggio"||"Gravação") && footageItem.name === name)
            //                 if (footageItem.typeName.match(/^(Footage|Material de archivo|Métrage|Metraggio|Gravação)$/) && footageItem.name === name)
            //                     return footageItem;
            //             }
            //         }

            //         if ((footageItem.name == name || footageItem.name == name + " ((old))") && footageItem.id !== id)
            //             alert("AeToOsb error: Could not match Footage ID for " + name + ". Are you sure it's unique (no duplicates)?");
            //     }
            //     return null;
            // }

            function OutputModuleNameInRQitem(omName) {	// output modules are present
                // check if output modules are present
                var outputModule;
                var hasOutputModule;

                for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
                    if (app.project.renderQueue.item(i).outputModule(1).name == omName) {
                        var omRenderOutputFile = app.project.renderQueue.item(i).outputModule(1).file;
                        var omRenderOutputFileName = omRenderOutputFile.fsName.substr(omRenderOutputFile.fsName.length - 26, omRenderOutputFile.fsName.length).slice(0, -12);
                        if (omRenderOutputFileName === omName)
                            outputModule = true;
                        if (omRenderOutputFileName !== omName)
                            outputModule = false;
                    }
                }

                if (outputModule)
                    hasOutputModule = true;
                if (!outputModule)
                    hasOutputModule = false;

                return (hasOutputModule)
            }

            function arrayIncludes(array, value) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == value) return true;
                }
                return false;
            }

            function renderAndImportComp(compName, selectedComp, itemID) {
                atsStatusMessage1.text = "[Render and import - Status]";
                // alert("1"); ///////////////////////////////////// debug
                scriptSettings = readSettings();
                // var selectedComp = [];
                // var compName = [];
                var unsupportedCompsLength = itemID.length;
                // if (itemID[itemID.length] == undefined) unsupportedCompsLength = itemID.length - 1;

                // // alert("2 - compName: " + compName[I]); ///////////////////////////////////// debug
                atsStatusMessage2.text = "Composition name: " + compName[I] + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings(); scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                AeToOsb.update();

                var itemPath = [];
                var data = scriptSettings;
                var outputPath = data.scriptslibraryFolderPath.slice(0, -15);

                for (var I = 0; I <= unsupportedCompsLength; I++) {
                    itemPath.push("\\assetlibrary\\_AeToOsb\\AeAnimations" + "\\" + compName[I]);
                    // alert("3 - itemPath: " + itemPath[I] + "\r\n" + "current length: " + unsupportedCompsLength); ///////////////////////////////////// debug
                }

                for (var I = 0; I <= unsupportedCompsLength; I++) {
                    atsStatusMessage2.text = "Checking if " + compName[I] + "'s output folder exists..." + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                    AeToOsb.update();

                    if (Folder(outputPath + "\\assetlibrary\\_AeToOsb\\AeAnimations").exists !== true) {
                        atsStatusMessage2.text = "Cannot find " + compName[I] + "'s folder" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                        AeToOsb.update();


                        createNewFolder(outputPath + "\\assetlibrary\\_AeToOsb\\AeAnimations");
                        // alert(outputPath + "\\assetlibrary\\_AeToOsb\\AeAnimations");
                        if (Folder(outputPath + itemPath[I]).exists !== true) {
                            createNewFolder(outputPath + itemPath[I]);
                        }
                        atsStatusMessage2.text = "Created " + compName[I] + "'s output folder" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                        AeToOsb.update();
                    }
                    if (Folder(outputPath + "\\assetlibrary\\_AeToOsb\\AeAnimations").exists === true)
                        atsStatusMessage2.text = "Found " + compName[I] + "'s output folder!" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                    AeToOsb.update();
                }

                // alert("4 - apply Output Modules"); ///////////////////////////////////// debug
                atsStatusMessage2.text = "Applying Output Modules for all comps" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                AeToOsb.update();

                var resultsFolder = [];
                var alreadyRendered = [];
                var omRenderOutputFileName;
                var UCL = unsupportedCompsLength - 1;
                for (var I = 0; I <= UCL; I++) {
                    if (I == 0) {
                        atsStatusMessage2.text = "Checking if 'ATS GIF frames' template exists" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                        AeToOsb.update();

                        var ATSGIFframes;
                        var tempItem = app.project.renderQueue.items.add(selectedComp[I]);
                        var omTemplates = tempItem.outputModules[1].templates;
                        var f = Folder(outputPath + itemPath[I] + "\\ATS GIF frames");
                        var currentCompResolution = selectedComp[I].resolutionFactor;

                        if (!arrayIncludes(omTemplates, 'ATS GIF frames')) {
                            tempItem.remove();
                            atsStatusMessage2.text = "'ATS GIF frames' template doesn't exist" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                            AeToOsb.update();
                            // alert("ATS GIF frames template does not exist");

                            // alert(scriptSettings.scriptFileFolderPath);

                            var ATSGIFframesProjectFilePath = new File("~/Documents/AeToOsb/ATS GIF frames.aep")
                            ATSGIFframes = importFiles(ATSGIFframesProjectFilePath, true, '*.aep', 'footage', false, false)
                            if (ATSGIFframesProjectFilePath.exists == true) {
                                atsStatusMessage2.text = "Importing 'ATS GIF frames'" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                AeToOsb.update();

                                ATSGIFframes.parentFolder = getFolderByName("_AeAnimations");

                                for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
                                    omRenderOutputFile = app.project.renderQueue.item(i).outputModule(1).file;
                                    var omRenderOutputFileName = omRenderOutputFile.fsName.substr(omRenderOutputFile.fsName.length - 26, omRenderOutputFile.fsName.length).slice(0, -12);
                                    if (omRenderOutputFileName === "ATS GIF frames") {
                                        if (OutputModuleNameInRQitem("ATS GIF frames") === true) {
                                            atsStatusMessage2.text = omRenderOutputFileName + " have been imported" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                            AeToOsb.update();

                                            if (app.project.renderQueue.item(i).outputModule(i).name === "ATS GIF frames") {
                                                app.project.renderQueue.item(i).outputModules[1].saveAsTemplate("ATS GIF frames");
                                                // app.project.renderQueue.item(i).outputModule(i).remove();
                                                app.project.renderQueue.item(i).remove();
                                                ATSGIFframes.remove();
                                                if (f.exists === true)
                                                    f.remove();
                                            }
                                        }
                                        // if (OutputModuleNameInRQitem("ATS GIF frames") === false)
                                        //     alert(omRenderOutputFileName + " | false");
                                    }
                                }
                            }
                            else if (ATSGIFframesProjectFilePath.exists == false) {
                                atsStatusMessage2.text = "Error: '" + omRenderOutputFileName + ".aep' does not exist" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                AeToOsb.update();
                                alert(skjfhaskjf);
                            }
                        }
                        else if (arrayIncludes(omTemplates, 'ATS GIF frames')) {
                            if (f.exists === true)
                                f.remove();
                            tempItem.remove();
                            // alert("ATS GIF frames template already exists");
                            atsStatusMessage2.text = "'ATS GIF frames' already exists" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                            AeToOsb.update();
                        }
                    }

                    if (atsStatusMessage2.text !== "Error: '" + omRenderOutputFileName + ".aep' does not exist" + "...") {
                        var item = app.project.renderQueue.items.add(selectedComp[I]);
                        var outputModuleItem = item.outputModule(1);
                        outputModuleItem.applyTemplate("ATS GIF frames");
                        atsStatusMessage2.text = "Applied 'ATS GIF frames' for " + compName[I] + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                        AeToOsb.update();

                        // var fileName = File.decode(outputModuleItem.file.name);

                        var newOutputSettings = {
                            "Output File Info":
                            {
                                "Base Path": outputPath,
                                "Subfolder Path": "assetlibrary/_AeToOsb/AeAnimations/" + compName[I] + "/",
                                "File Name": compName[I] + "_[#####]"
                            }
                        };
                        outputModuleItem.setSettings(newOutputSettings);

                        // if (I === UCL)
                        // alert("5 - Output Modules applied"); ///////////////////////////////////// debug
                        atsStatusMessage2.text = "All Output Modules has been applied!" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                        AeToOsb.update();

                        resultsFolder.push(Folder(outputPath + itemPath[I]));
                        var arFilePath = File.decode(outputPath + itemPath[I] + "\\" + compName[I] + "_00001.png");
                        alreadyRendered.push(File(arFilePath));

                        // if (I === unsupportedCompsLength)
                        // alert("6"); ///////////////////////////////////// debug

                        if (I === UCL) {
                            atsStatusMessage2.text = "All compositions has been added to Render Queue!" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                            AeToOsb.update();
                        }

                        // alert("7 - all compositions has been added to Render Queue"); ///////////////////////////////////// debug
                        atsStatusMessage2.text = "Checking if compositions has previously been rendered" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                        AeToOsb.update();


                        function afterRender() {
                            if (alreadyRendered[I].exists === true) {
                                atsStatusMessage2.text = compName[I] + " was previously rendered"; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                AeToOsb.update();

                                // alert("alreadyRendered[I].exists: true" + "\r\n" + "\r\n" + alreadyRendered[I].fsName);
                                var getFiles = resultsFolder[I].getFiles('*.png');
                                for (var i = 0; i < getFiles.length; i++) {
                                    // alreadyRendered[I] = File(outputPath + itemPath[I] + "\\" + compName[I] + getFiles[i].name);
                                    var files = new File(getFiles[i]);
                                    files.remove();
                                    atsStatusMessage2.text = "Deleting " + compName[I] + "'s previously rendered files" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    AeToOsb.update();

                                    // alert(getFiles[i].name + " has been removed.");
                                }

                                scriptSettings = readSettings();
                                if (scriptSettings.options.openOutputFolderBeforeRendering === true)
                                    if (Folder(outputPath + itemPath[I]).exists === true)
                                        openFileLocation(outputPath + itemPath[I]);
                                if (Folder(outputPath + itemPath[I]).exists === false)
                                    alert("AeToOsb WARNING: cannot open output for " + compName[I] + " because it the folder hasn't been created yet. If this warning keeps recurring, then please turn off the option 'Open output folder before rendering' in Settings.");

                                if (I === UCL) {
                                    atsStatusMessage2.text = "Rendering" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    yesButton.enabled = false;
                                    noButton.enabled = false;
                                    AeToOsb.update();

                                    currentCompResolution = [4, 4];
                                    app.project.renderQueue.render(); // render comps
                                    currentCompResolution = selectedComp[I].resolutionFactor;
                                    app.beginUndoGroup('Render and import');
                                    return true;
                                }
                            }
                            else if (alreadyRendered[I].exists !== true) {
                                // alert("false");
                                atsStatusMessage2.text = compName[I] + " has not been rendered before" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                AeToOsb.update();

                                // alert("alreadyRendered[I].exists: false" + "\r\n" + "\r\n" + alreadyRendered[I].fsName);
                                // alert("files are nonexistent");

                                scriptSettings = readSettings();
                                if (scriptSettings.options.openOutputFolderBeforeRendering === true)
                                    if (Folder(outputPath + itemPath[I]).exists === true)
                                        openFileLocation(outputPath + itemPath[I]);
                                if (Folder(outputPath + itemPath[I]).exists === false)
                                    alert("AeToOsb WARNING: cannot open output for " + compName[I] + " because it the folder hasn't been created yet. If this warning keeps recurring, then please turn off the option 'Open output folder before rendering' in Settings.");

                                if (I === UCL) {
                                    atsStatusMessage2.text = "Rendering" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    yesButton.enabled = false;
                                    noButton.enabled = false;

                                    AeToOsb.update();

                                    currentCompResolution = [4, 4];
                                    app.project.renderQueue.render(); // render comps
                                    currentCompResolution = selectedComp[I].resolutionFactor;
                                    app.beginUndoGroup('Render and import');
                                    return true;
                                }
                            }
                        }

                        if (afterRender()) {
                            // AeToOsbUI();
                            // alert("8 - after rendering"); ///////////////////////////////////// debug
                            var ListOfAllCompNames = ["...", "..."];
                            ListOfAllCompNames.push(compName[I]);
                            function statusChanged() {
                                var statusHasChanged = "Done";
                                return statusHasChanged;
                            }

                            // change results status
                            for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
                                if (app.project.renderQueue.item(i).name === compName[I])
                                    app.project.renderQueue.item(i).onStatusChanged = statusChanged();
                                // if (app.project.renderQueue.item(i).onStatusChanged === "Done")
                            }

                            // atsStatusMessage2.text = ListOfAllCompNames + " has been rendered!"; + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                            // noButton.enabled = true;
                            // AeToOsb.update();

                            // import results
                            atsStatusMessage2.text = "Starting the import procedure" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                            AeToOsb.update();

                            // var oldCompName = [];
                            // var oldCompID = [];
                            // var oldComp = [];
                            for (var x = 0; x <= UCL; x++) {
                                // oldCompName.push(compName[x] + " ((old))");
                                // oldCompID.push(itemID[x]);
                                // var comp = getCompsByNameID(compName[x], itemID[x]);

                                var layerIndex = [];
                                var comp = selectedComp[x];

                                for (var i = 1; i <= selectedComp[x].numLayers; i++)
                                    layerIndex.push(selectedComp[x].layer(i).index);

                                // alert(comp.name);
                                // alert("9 - oldCompName: " + oldCompName[x] + " | " + "newCompName: " + comp.name); ///////////////////////////////////// debug
                                // alert(comp.name); ///////////////////////////////////// debug

                                atsStatusMessage2.text = "Checking if '_Animations' folder exists" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                AeToOsb.update();

                                if (getFolderByName("_AeAnimations") !== null) {
                                    atsStatusMessage2.text = "Found the '_Animations' folder" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    AeToOsb.update();

                                    var result = importFiles(resultsFolder[x], false, '*.png', 'footage', true, true);

                                    result.parentFolder = getFolderByName("_AeAnimations");
                                    result.mainSource.conformFrameRate = comp.frameRate;
                                    atsStatusMessage2.text = "Imported " + comp.name + "'s rendered files" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    AeToOsb.update();

                                    comp.layers.precompose(layerIndex, selectedComp[x].name + " ((old))", true);
                                    comp.layers.add(result);

                                    result.mainSource.comment = "autoGen.AeToOsb.sequence";
                                    // alert("added");

                                    // alert("getFolderByName(_AeAnimations) !== null");
                                }
                                else if (getFolderByName("_AeAnimations") == null) {
                                    atsStatusMessage2.text = "Cannot find the '_Animations' folder" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    AeToOsb.update();

                                    var newFolder = app.project.items.addFolder("_AeAnimations");
                                    atsStatusMessage2.text = "Created a new folder '_Animations' folder" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    AeToOsb.update();

                                    var result = importFiles(resultsFolder[x], false, '*.png', 'footage', true, true);

                                    result.parentFolder = newFolder;
                                    result.mainSource.conformFrameRate = comp.frameRate;
                                    atsStatusMessage2.text = "Imported " + comp.name + "'s rendered files" + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                    AeToOsb.update();

                                    comp.layers.precompose(layerIndex, selectedComp[x].name + " ((old))", true);
                                    comp.layers.add(result);

                                    result.mainSource.comment = "autoGen.AeToOsb.sequence";

                                    // alert("getFolderByName(_AeAnimations) == null");
                                }
                                // alert("10"); ///////////////////////////////////// debug

                                // for (var i = 1; i <= app.project.numItems; i++) {
                                //     if (app.project.item(i).name == oldCompName[x])
                                //     oldComp.push(getCompsByNameID(oldCompName[x], app.project.item(i).id));
                                // }

                                // for (var i = 0; i <= oldComp.length; i++)
                                // oldComp[i].parentFolder = getFolderByName("_AeAnimations");
                                // alert("working");

                                for (var i = 1; i <= comp.numLayers; i++) {
                                    if (comp.layer(i).name == comp.name + " ((old))")
                                        comp.layer(i).enabled = false;
                                    // alert(comp.layer(i).name);
                                }

                                for (var i = 1; i <= app.project.numItems; i++) {
                                    var folder;
                                    if (app.project.item(i).name == "_AeAnimations")
                                        folder = app.project.item(i);
                                    if (app.project.item(i).name == comp.name + " ((old))")
                                        app.project.item(i).parentFolder = folder;
                                    // alert(comp.layer(i).name);
                                }

                                // atsStatusMessage2.text = "Removing compositions from Render Queue"; + "..."; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                // AeToOsb.update();

                                for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
                                    if (app.project.renderQueue.item(i).name === compName[x])
                                        app.project.renderQueue.item(i).remove();
                                    if (app.project.renderQueue.item(i).name === compName[x] + " ((old))")
                                        app.project.renderQueue.item(i).remove();
                                }

                                comp.openInViewer();

                                // alert("success!"); ///////////////////////////////////// debug
                                atsStatusMessage2.text = "Success!"; scriptSettings = readSettings(); scriptSettings.renderAndImportCompStatus = atsStatusMessage2.text; writeSettings(scriptSettings); scriptSettings = readSettings();
                                AeToOsb.update();

                                $.sleep(500);

                                noButton.onClick = function () {
                                    tabbedpanel.selection = home;
                                    AeToOsb.update();
                                }

                                tabbedpanel.selection = home;
                                yesButton.text = "Yes";
                                noButton.text = "No";
                                yesButton.enabled = false;
                                noButton.enabled = false;
                                AeToOsb.update();
                                app.endUndoGroup();

                                scriptSettings = readSettings();
                                delete scriptSettings.renderAndImportCompStatus;
                                writeSettings(scriptSettings);
                            }
                        }
                    }
                }
            }

            noButton.onClick = function () {
                tabbedpanel.selection = home;
                AeToOsb.update();
            }

            export_button.onClick = function () {
                var apsID = [];
                var apsName = [];
                var aps = app.project.selection;
                for (var I = 0; I <= aps.length; I++) {
                    if (aps[I] instanceof CompItem) {
                        apsID.push(aps[I].id);
                        apsName.push(aps[I].name);
                    }
                }

                scriptSettings = readSettings();
                if (scriptSettings.outputFolderPath == "") {
                    alert("AeToOsb error: Please specify an output directory before exporting selected compositions.");
                    alert(ksdjfkdsf);
                }
                scriptSettings.exportedComps = apsName;
                scriptSettings.exportedCompNames = apsID;
                writeSettings(scriptSettings);

                var layerDATA;
                var markerStatement = []
                /////////////////////////////////////////
                ///////// SELECTED COMPS DIALOG /////////
                /////////////////////////////////////////
                selectedCompsDialog = new Window("palette");
                selectedCompsDialog.text = "Selected Compositions";
                selectedCompsDialog.preferredSize.width = 200;
                selectedCompsDialog.preferredSize.height = 100;
                selectedCompsDialog.orientation = "column";
                selectedCompsDialog.alignChildren = ["center", "top"];
                selectedCompsDialog.spacing = 10;
                selectedCompsDialog.margins = 14;

                var dialogTitle = selectedCompsDialog.add("statictext", undefined, undefined, { name: "dialogTitle" });
                dialogTitle.text = "You have selected these comps:";
                dialogTitle.justify = "center";

                var selectedComps = [];
                var selectedCompsID = [];
                var compSelectionNames = [];
                var selectedCompList_array = ["comp1", "comp2"];
                if (checkUnsupportedLayers()) {
                    alert("AeToOsb error: Found unsupported layers in the selected comp(s). Please perform 'Render and import' or remove the unsupported layers.");
                    dialogTitle.text = "Selected comp(s) are unsupported.";
                    selectedCompList_array = ["Please reselect."];
                }
                else if (!checkUnsupportedLayers()) {
                    dialogTitle.text = "You have selected these comps:";
                    for (var I = 1; I <= app.project.numItems; I++) {
                        if (app.project.item(I).selected) {
                            if (app.project.item(I) instanceof CompItem)
                                selectedComps[selectedComps.length] = app.project.item(I);
                            if (!(app.project.item(I) instanceof CompItem))
                                selectedCompList_array = ["Please select a composition."];
                        }
                    }
                    for (var I = 0; I < selectedComps.length; I++)
                        compSelectionNames.push(selectedComps[I].name);
                    for (var I = 0; I < selectedComps.length; I++)
                        selectedCompsID.push(selectedComps[I].id);
                }

                var compItems = []; COMPS();
                function COMPS() {
                    // alert(checkUnsupportedLayers());
                    if (!checkUnsupportedLayers()) {
                        var expLayerCount = 0;
                        var expLayerCountTotal = 1;
                        var expCompCount = 0;
                        var expCompCountTotal = selectedComps.length;
                        var expLayerSteps = 0;
                        var expCompSteps = 0;
                        var expProgressMax = 100;

                        // EXPORTPROGRESS
                        // ==============
                        var exportProgress = new Window("palette"); 
                        exportProgress.text = "Exporting..."; 
                        exportProgress.preferredSize.width = 320; 
                        exportProgress.orientation = "column"; 
                        exportProgress.alignChildren = ["center","top"]; 
                        exportProgress.spacing = 10; 
                        exportProgress.margins = 16; 

                        // EXPLAYERPANEL
                        // =============
                        var expLayerPanel = exportProgress.add("panel", undefined, undefined, {name: "expLayerPanel"}); 
                        expLayerPanel.text = "Layer (1/1)"; 
                        expLayerPanel.preferredSize.width = 325; 
                        expLayerPanel.orientation = "column"; 
                        expLayerPanel.alignChildren = ["left","top"]; 
                        expLayerPanel.spacing = 10; 
                        expLayerPanel.margins = 10; 

                        // EXPLAYERGROUP
                        // =============
                        var expLayerGroup = expLayerPanel.add("group", undefined, {name: "expLayerGroup"}); 
                        expLayerGroup.preferredSize.width = 304; 
                        expLayerGroup.orientation = "row"; 
                        expLayerGroup.alignChildren = ["left","center"]; 
                        expLayerGroup.spacing = 10; 
                        expLayerGroup.margins = 0; 
                        expLayerGroup.alignment = ["center","top"]; 

                        // EXPLAYER
                        // ========
                        var expLayer = expLayerGroup.add("panel", undefined, undefined, {name: "expLayer"}); 
                        expLayer.text = "(layer name)"; 
                        expLayer.preferredSize.width = 270; 
                        expLayer.orientation = "column"; 
                        expLayer.alignChildren = ["left","top"]; 
                        expLayer.spacing = 10; 
                        expLayer.margins = 10; 
                        expLayer.alignment = ["left","center"]; 

                        var expLayerStatus = expLayer.add("statictext", undefined, undefined, {name: "expLayerStatus"}); 
                        expLayerStatus.text = "Status...";
                        expLayerStatus.preferredSize.width = 280;  
                        expLayerStatus.alignment = ["center","top"]; 

                        var expLayerProgress = expLayer.add("progressbar", undefined, undefined, {name: "expLayerProgress"}); 
                        expLayerProgress.maxvalue = 100; 
                        expLayerProgress.value = 0; 
                        expLayerProgress.preferredSize.width = 280; 
                        expLayerProgress.preferredSize.height = 8; 
                        expLayerProgress.alignment = ["center","top"]; 

                        // EXPCOMPPANEL
                        // ============
                        var expCompPanel = exportProgress.add("panel", undefined, undefined, {name: "expCompPanel"}); 
                        expCompPanel.text = "Composition (1/1)"; 
                        expCompPanel.preferredSize.width = 325; 
                        expCompPanel.orientation = "column"; 
                        expCompPanel.alignChildren = ["left","top"]; 
                        expCompPanel.spacing = 10; 
                        expCompPanel.margins = 10; 

                        // EXPCOMPGROUP
                        // ============
                        var expCompGroup = expCompPanel.add("group", undefined, {name: "expCompGroup"}); 
                        expCompGroup.preferredSize.width = 304; 
                        expCompGroup.orientation = "row"; 
                        expCompGroup.alignChildren = ["left","center"]; 
                        expCompGroup.spacing = 10; 
                        expCompGroup.margins = 0; 
                        expCompGroup.alignment = ["center","top"]; 

                        // EXPCOMP
                        // =======
                        var expComp = expCompGroup.add("panel", undefined, undefined, {name: "expComp"}); 
                        expComp.text = "(comp name)"; 
                        expComp.preferredSize.width = 270; 
                        expComp.orientation = "column"; 
                        expComp.alignChildren = ["left","top"]; 
                        expComp.spacing = 10; 
                        expComp.margins = 10; 
                        expComp.alignment = ["left","center"]; 

                        var expCompProgress = expComp.add("progressbar", undefined, undefined, {name: "expCompProgress"}); 
                        expCompProgress.maxvalue = 100; 
                        expCompProgress.value = 0; 
                        expCompProgress.preferredSize.width = 280; 
                        expCompProgress.preferredSize.height = 8; 
                        expCompProgress.alignment = ["center","top"];

                        function updateLayerSteps(step, layerName, statusText) {
                            expLayerSteps = expProgressMax * (step / 10);
                            expLayerProgress.value = expLayerSteps;
                            expLayerStatus.text = statusText;
                            updateCompSteps();
                            updateLayerProgress(layerName);
                            exportProgress.update();
                        }
                        function updateLayerProgress(layerName) {
                            expLayerPanel.text = "Layer (" + expLayerCount + "/" + expLayerCountTotal + ")";
                            expLayer.text = layerName;
                            exportProgress.update();
                        }
                        function updateCompSteps() {
                            expCompSteps = round(expProgressMax * (expLayerCount / expLayerCountTotal), 0);
                            expCompProgress.value = expCompSteps;
                            exportProgress.update();
                        }
                        function updateCompProgress(compName) {
                            expCompPanel.text = "Composition (" + expCompCount + "/" + expCompCountTotal + ")";
                            expComp.text = compName;
                            exportProgress.update();
                        }

                        var aLayerHasParent = false;
                        for (var I = 0; I < selectedComps.length; I++) {
                            for (var la = 1; la < selectedComps[I].numLayers; la++) {
                                if (selectedComps[I].layer(la).parent != null)
                                aLayerHasParent = true;
                            }
                        }

                        scriptSettings = readSettings();
                        if (aLayerHasParent || scriptSettings.exportTextPerLetter == true)
                            if (exportProgress instanceof Window) exportProgress.show();

                        for (var I = 0; I < selectedComps.length; I++) {
                            expCompCount++;
                            updateCompProgress(selectedComps[I].name);

                            var firstTextLayerIndex = [];
                            var currentComp = selectedComps[I];
                            var currentCompTime = currentComp.time;
                            var currentCompResolution = currentComp.resolutionFactor;
                            var layerHasParent = false;

                            var composition = ({
                                type: "composition",
                                name: currentComp.name,
                                compID: currentComp.id,
                                startTime: round(milliseconds(currentComp.workAreaStart + currentComp.displayStartTime), 0),
                                endTime: round(milliseconds((currentComp.workAreaStart + currentComp.displayStartTime) + currentComp.workAreaDuration), 0),
                                duration: round(milliseconds(currentComp.workAreaDuration), 0),
                                frameRate: currentComp.frameRate,
                                frameDuration: milliseconds(currentComp.frameDuration),
                                compBitmap: {
                                    width: currentComp.width,
                                    height: currentComp.height
                                },
                                layers: []
                            });
                            for (var la = 1; la <= currentComp.numLayers; la++) {
                                expLayerCount++;
                                expLayerCountTotal = currentComp.numLayers;
                                updateLayerSteps(0, currentComp.layer(la).name, "Exporting " + currentComp.layer(la).name + "...");

                                var layer = {};
                                var parentLayerData;
                                var dimensionAlreadySeparated = true;
                                var parentDimensionAlreadySeparated = true;
                                var currentCompLayer = selectedComps[I].layer(la);
                                var type = getLayerType(currentCompLayer).substr(0, getLayerType(currentCompLayer).indexOf('.'));
                                var layerType = getLayerType(currentCompLayer).replace(type + ".", "");
                                if (layerType == "Text") {
                                    firstTextLayerIndex.push(currentCompLayer.index);
                                }
                                // alert("currentCompLayer.name: " + currentCompLayer.name);

                                layer.index = currentCompLayer.index;
                                layer.index = currentCompLayer.index;
                                if (layerType == "Sequence") layer.autoGen = false;
                                if (layerType !== "Text" && layerType !== "Shape" && layerType !== "NullLayer" && layerType !== "Composition" && layerType !== "Solid")
                                    layer.name = currentCompLayer.source.mainSource.file.name;

                                layer.layerName = currentCompLayer.name;
                                if (layerType == "Sequence" && currentCompLayer.name.indexOf('{') == -1) {
                                    layer.layerName = currentCompLayer.name;

                                    if (currentCompLayer.source.mainSource.comment == "autoGen.AeToOsb.sequence") {
                                        layer.name = currentCompLayer.name + "_.png";
                                        layer.layerName = currentCompLayer.name;
                                        layer.autoGen = true;
                                    }
                                    else if (currentCompLayer.source.mainSource.comment !== "autoGen.AeToOsb.sequence")
                                        layer.path = currentCompLayer.source.mainSource.file.fsName;
                                }
                                else if (currentCompLayer.name.indexOf('{') !== -1) {
                                    var nn = currentCompLayer.name;
                                    var ext = nn.slice(nn.indexOf('.'), nn.length);
                                    var nn2 = nn.slice(0, nn.indexOf('{')) + ext;
                                    layer.name = nn2;
                                    layer.layerName = currentCompLayer.name;

                                    if (currentCompLayer.source.mainSource.comment == "autoGen.AeToOsb.sequence") {
                                        layer.name = currentCompLayer.name + "_.png";
                                        layer.layerName = currentCompLayer.name;
                                        layer.autoGen = true;
                                    }
                                    else if (currentCompLayer.source.mainSource.comment !== "autoGen.AeToOsb.sequence")
                                        layer.path = currentCompLayer.source.mainSource.file.fsName;
                                }
                                // layer.id = currentCompLayer.id;
                                if (layerType == "Image")
                                    layer.path = currentCompLayer.source.mainSource.file.fsName;

                                if (currentCompLayer.enabled === true || layerType === "NullLayer") {
                                    updateLayerSteps(1, currentComp.layer(la).name, "Layer is enabled...");
                                    app.beginUndoGroup("Export Layer Data: " + currentCompLayer.name);
                                    var wasSelected = false;

                                    if (currentCompLayer.parent !== null) {
                                        layer.hasParent = true; layerHasParent = true;
                                        layer.parentName = currentCompLayer.parent.name;
                                        parentsInComp = true;
                                        // layer.parentID = currentCompLayer.parent.id;

                                        for (var j = 1; j <= currentComp.numLayers; j++) {
                                            if (currentComp.layer(j).name == currentCompLayer.parent.name)
                                                parentLayerData = currentComp.layer(j);
                                        }
                                        // alert("parent ID: " + parentLayerData.id + " | name: " + parentLayerData.name);
                                    }
                                    else if (currentCompLayer.parent == null) {
                                        layer.hasParent = false;
                                    }
                                    layer.visible = currentCompLayer.enabled;
                                    layer.startTime = round(milliseconds(layerStart(selectedComps[I], currentCompLayer.inPoint) + currentComp.displayStartTime), 0);
                                    layer.endTime = round(layer.startTime + layerDuration(), 0);
                                    layer.duration = round(layerDuration(), 0);
                                    layer.type = layerType;
                                    layer.layer = null;
                                    updateLayerSteps(2, currentComp.layer(la).name, "Exporting timings...");
                                
                                    if (layerType == "Sequence")
                                        layer.loopType = null;
                                    if (layerType !== "Audio")
                                        layer.additive = false;

                                    if (currentCompLayer.blendingMode === 5212) {
                                        layer.additive = false;
                                    }
                                    else if (currentCompLayer.blendingMode !== 5212) {
                                        layer.additive = true;
                                    }

                                    layer.transform = {};
                                    layer.transform.origin = null;
                                    
                                    if (layerType !== "Audio") {
                                        updateLayerSteps(2, currentComp.layer(la).name, "Exporting transform data...");
                                        layer.transform.threeD = currentCompLayer.threeDLayer;
                                        if (layerType == "Text")
                                            layer.transform.threeDPerChar = currentCompLayer.threeDPerChar;
                                        layer.transform.layerBitmap = {};
                                        layer.transform.layerBitmap.width = currentCompLayer.width;
                                        layer.transform.layerBitmap.height = currentCompLayer.height;

                                        // fade
                                        updateLayerSteps(3, currentComp.layer(la).name, "Exporting opacity keyframes...");
                                        layer.transform.fade = [];
                                        if (currentCompLayer.opacity.numKeys !== 0) {
                                            // layer.transform.fade.keyframed = true;
                                            for (var k = 1; k <= currentCompLayer.opacity.numKeys; k++) {
                                                var keyframe = {};
                                                keyframe.time = milliseconds(currentCompLayer.opacity.keyTime(k) + currentComp.displayStartTime);
                                                keyframe.value = currentCompLayer.opacity.keyValue(k) / 100;
                                                keyframe.easing = easingType(currentCompLayer.opacity, k);
                                                layer.transform.fade.push(keyframe);
                                            }
                                        }
                                        else if (currentCompLayer.opacity.numKeys === 0) {
                                            // layer.transform.fade.keyframed = false;
                                            var keyframe = {};
                                            keyframe.time = layer.startTime + currentComp.displayStartTime;
                                            keyframe.value = currentCompLayer.opacity.value / 100;
                                            keyframe.easing = "None";
                                            layer.transform.fade.push(keyframe);
                                        }
                                        
                                        layer.layerGroup = "";
                                        layer.loopGroup = "";
                                        for (var m = 1; m <= currentCompLayer.marker.numKeys; m++) {
                                            var marker = currentCompLayer.marker.keyValue(m).comment;
                                            if (marker.match(new RegExp("(TopLeft|TopCentre|TopRight|CentreLeft|Centre|CentreRight|BottomLeft|BottomCentre|BottomRight|TL|TC|TR|CL|C|CR|BL|BC|BR)", "i")) && !marker.match(new RegExp("(;)", "i"))) {
                                                layer.transform.origin = marker;
                                            }
                                            else {
                                                layer.transform.origin = "Centre";
                                            }
                                            if (marker.match(new RegExp("(Background|Fail|Pass|Foreground|Overlay|Sound|BG|F|P|FG|O|S)", "i")) && !marker.match(new RegExp("(;)", "i"))) {
                                                layer.layer = marker;
                                            }
                                            if (layerType == "Sequence") {
                                                if (marker.match(new RegExp("(LoopOnce|LoopForever|LO|LF|1|0)", "i"))) {
                                                    layer.loopType = marker;
                                                }
                                            }
                                            else if (layerType != "Sequence") {
                                                if (marker.includes('group;') || marker.includes('Group;') || marker.includes('g;') || marker.includes('G;'))
                                                    layer.layerGroup = marker;
                                                if (marker.includes('loop;') || marker.includes('Loop;') || marker.includes('L;') || marker.includes('l;'))
                                                    layer.loopGroup = marker;
                                            }
                                            // if (layer.layer == null || layer.transform.origin == null) {
                                            //     alert("AeToOsb WARNING: Remember to add a marker on the layer '" + currentCompLayer.name + "' with a comment that represents the OsbOrigin and/or OsbLayer.");
                                            // }
                                        }
                                    }
                                    if (layerType == "Audio") {
                                        updateLayerSteps(5, currentComp.layer(la).name, "Exporting Audio layer data...");
                                        layer.transform.origin = "centre";
                                        layer.layer = "sound";
                                    }
                                    markerStatement = [layer.transform.origin, layer.layer, layer.loopType, layerType];
                                    layerDATA = currentCompLayer;

                                    if (layerType !== "Audio") {
                                        if (!currentCompLayer.property("Transform").property("Position").dimensionsSeparated) {
                                            dimensionAlreadySeparated = false;
                                            currentCompLayer.property("Transform").property("Position").dimensionsSeparated = true;
                                        }
                                        if (layerHasParent == true) {
                                            if (!parentLayerData.property("Transform").property("Position").dimensionsSeparated) {
                                                parentDimensionAlreadySeparated = false;
                                                parentLayerData.property("Transform").property("Position").dimensionsSeparated = true;
                                            }
                                        }
                                    }

                                    if (layerType == "Solid") {
                                        layer.solid = {};
                                        layer.solid.bitmap = {};
                                        layer.solid.color = rgbColor(currentCompLayer.source.mainSource.color);
                                        layer.solid.bitmap.width = currentCompLayer.source.width;
                                        layer.solid.bitmap.height = currentCompLayer.source.height;
                                    }

                                    if (layerType == "Shape") {
                                        updateLayerSteps(4, currentComp.layer(la).name, "Exporting Shape data...");
                                        layer.shape = {};
                                        // var deselectAll = app.findMenuCommandId("Deselect All");
                                        // var convertToBezier = app.findMenuCommandId("Convert To Bezier Path");
                                        if (currentCompLayer("Contents").numProperties !== 0) {
                                            var shapePropName = currentCompLayer("Contents")(1)("Contents")(1).name;
                                            // alert("layer: " + currentCompLayer.name);
                                            // alert(shapePropName);

                                            if (shapePropName.length < 7) {
                                                layer.shape.type = "Path";
                                                if (currentCompLayer("Contents")(1)("Contents")(1)("Path").value.vertices.length > 1) {
                                                    getPathData();
                                                }
                                                else if ((currentCompLayer("Contents")(1)("Contents")(1)("Path").value.vertices.length < 2)) {
                                                    alert("AeToOsb error: The ShapeLayer '" + currentCompLayer.name + "' will be ignored because it only has 1 vertex (point).");
                                                    continue;
                                                }
                                            }
                                            else if (shapePropName.length == 16) {
                                                layer.shape.type = "Rectangle";
                                                layer.shape.closed = true;
                                                layer.shape.shapeSize = {};
                                                layer.shape.shapeSize.x = round(currentCompLayer("Contents")(1)("Contents")(1)("Size").value[0], 2);
                                                layer.shape.shapeSize.y = round(currentCompLayer("Contents")(1)("Contents")(1)("Size").value[1], 2);
                                                layer.shape.rectRoundness = currentCompLayer("Contents")(1)("Contents")(1)("Roundness").value;
                                                layer.shape.posOffset = {};
                                                layer.shape.posOffset.x = round(currentCompLayer("Contents")(1)("Transform")("Position").value[0], 2);
                                                layer.shape.posOffset.y = round(currentCompLayer("Contents")(1)("Transform")("Position").value[1], 2);
                                            }
                                            else if (shapePropName.length == 14) {
                                                layer.shape.type = "Ellipse";
                                                layer.shape.closed = true;
                                                layer.shape.shapeSize = {};
                                                layer.shape.shapeSize.x = round(currentCompLayer("Contents")(1)("Contents")(1)("Size").value[0], 2);
                                                layer.shape.shapeSize.y = round(currentCompLayer("Contents")(1)("Contents")(1)("Size").value[1], 2);
                                                layer.shape.posOffset = {};
                                                layer.shape.posOffset.x = round(currentCompLayer("Contents")(1)("Transform")("Position").value[0], 2);
                                                layer.shape.posOffset.y = round(currentCompLayer("Contents")(1)("Transform")("Position").value[1], 2);
                                            }
                                            else {
                                                alert("AeToOsb error: The ShapeLayer: '" + currentCompLayer.name + "' is not supported. Only Rectangles, Ellipses and Shapes created with the Pen Tool are supported." +
                                                    "\r\n" + "\r\n" + "This layer will be ignored.");
                                                continue;

                                                // layer.shape.type = "Other";
                                                // if (currentCompLayer("Contents")(1)("Contents")(1)("Path") == null) {
                                                //     app.executeCommand(deselectAll); // deselect all layers
                                                //     currentCompLayer.selected = true;
                                                //     currentCompLayer("Contents")(1)("Contents")(1).selected = true;
                                                //     app.executeCommand(convertToBezier); // convert to bezier path
                                                //     getPathData();
                                                //     app.executeCommand(deselectAll); // deselect all layers
                                                // }
                                                // else if (currentCompLayer("Contents")(1)("Contents")(1)("Path") !== null) {
                                                //     getPathData();
                                                // }
                                            }

                                            function getPathData() {
                                                // pathData[pathValueVertices, inTangents, outTangents]
                                                var pathData = getShapeData(currentCompLayer);
                                                var path = currentCompLayer("Contents")(1)("Contents")(1)("Path").value;

                                                layer.shape.verticesPosition = [];
                                                layer.shape.inTangent = [];
                                                layer.shape.outTangent = [];

                                                var pathValueVertices = pathData[0];
                                                var inTangents = pathData[1];
                                                var outTangents = pathData[2];

                                                for (var v = 0; v < pathValueVertices.length; v++) {
                                                    var values = {};
                                                    values.x = round(pathValueVertices[v][0], 2);
                                                    values.y = round(pathValueVertices[v][1], 2);

                                                    layer.shape.verticesPosition.push(values);
                                                }
                                                for (var it = 0; it < inTangents.length; it++) {
                                                    var values = {};
                                                    values.x = round(inTangents[it][0], 2);
                                                    values.y = round(inTangents[it][1], 2);

                                                    layer.shape.inTangent.push(values);
                                                }
                                                for (var ot = 0; ot < inTangents.length; ot++) {
                                                    var values = {};
                                                    values.x = round(outTangents[ot][0], 2);
                                                    values.y = round(outTangents[ot][1], 2);
                                                    layer.shape.outTangent.push(values);
                                                }
                                                layer.shape.closed = path.closed;
                                            }

                                            layer.shape.hasStroke = currentCompLayer("Contents")(1)("Contents")(2).enabled;
                                            // stroke color
                                            layer.shape.strokeColor = [];
                                            var strokeColorProp = currentCompLayer("Contents")(1)("Contents")(2)("Color");
                                            if (strokeColorProp.numKeys !== 0) {
                                                // layer.shape.strokeColor.keyframed = true;
                                                for (var k = 1; k <= strokeColorProp.numKeys; k++) {
                                                    var keyframe = {};
                                                    keyframe.time = milliseconds(strokeColorProp.keyTime(k) + currentComp.displayStartTime);
                                                    keyframe.value = rgbColor(strokeColorProp.keyValue(k));
                                                    keyframe.easing = easingType(strokeColorProp, k);
                                                    layer.shape.strokeColor.push(keyframe);
                                                }
                                            }
                                            else if (strokeColorProp.numKeys === 0) {
                                                // layer.shape.strokeColor.keyframed = false;
                                                var keyframe = {};
                                                keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                keyframe.value = rgbColor(strokeColorProp.value);
                                                keyframe.easing = "None";
                                                layer.shape.strokeColor.push(keyframe);
                                            }

                                            if (layer.shape.hasStroke)
                                                layer.shape.strokeWidth = currentCompLayer("Contents")(1)("Contents")(2)("Stroke Width").value;
                                            if (!layer.shape.hasStroke) layer.shape.strokeWidth = 0;

                                            var shapeFillComposite = currentCompLayer("Contents")(1)("Contents")(2)("Line Cap").value;
                                            if (shapeFillComposite == 1) layer.shape.lineCap = "Butt";
                                            if (shapeFillComposite == 2) layer.shape.lineCap = "Round";
                                            if (shapeFillComposite == 3) layer.shape.lineCap = "Projecting";

                                            var shapeFillComposite = currentCompLayer("Contents")(1)("Contents")(2)("Line Join").value;
                                            if (shapeFillComposite == 1) layer.shape.lineJoin = "Miter";
                                            if (shapeFillComposite == 2) layer.shape.lineJoin = "Round";
                                            if (shapeFillComposite == 3) layer.shape.lineJoin = "Bevel";

                                            layer.shape.lineMiterLimit = currentCompLayer("Contents")(1)("Contents")(2)("Miter Limit").value;

                                            var strokeHashDash = false; if (currentCompLayer("Contents")(1)("Contents")(2)("Dashes").canSetExpression) strokeHashDash = true;
                                            layer.shape.hasDash = strokeHashDash;

                                            if (currentCompLayer("Contents")(1)("Contents")(2)("Dashes")("Dash").canSetExpression)
                                                layer.shape.dashSpacing = currentCompLayer("Contents")(1)("Contents")(2)("Dashes")("Dash").value;
                                            if (currentCompLayer("Contents")(1)("Contents")(2)("Dashes")("Offset").canSetExpression)
                                                layer.shape.dashOffset = currentCompLayer("Contents")(1)("Contents")(2)("Dashes")("Offset").value;

                                            layer.shape.hasFill = currentCompLayer("Contents")(1)("Contents")(3).enabled;
                                            var shapeFillComposite = currentCompLayer("Contents")(1)("Contents")(3)("Composite").value;
                                            if (shapeFillComposite == 1) layer.shape.fillComposite = "Below";
                                            if (shapeFillComposite == 2) layer.shape.fillComposite = "Above";

                                            // fill color
                                            layer.shape.fillColor = [];
                                            var fillColorProp = currentCompLayer("Contents")(1)("Contents")(3)("Color");
                                            if (fillColorProp.numKeys !== 0) {
                                                // layer.shape.fillColor.keyframed = true;
                                                for (var k = 1; k <= fillColorProp.numKeys; k++) {
                                                    var keyframe = {};
                                                    keyframe.time = milliseconds(fillColorProp.keyTime(k) + currentComp.displayStartTime);
                                                    keyframe.value = rgbColor(fillColorProp.keyValue(k));
                                                    keyframe.easing = easingType(fillColorProp, k);
                                                    layer.shape.fillColor.push(keyframe);
                                                }
                                            }
                                            else if (fillColorProp.numKeys === 0) {
                                                // layer.shape.fillColor.keyframed = false;
                                                var keyframe = {};
                                                keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                keyframe.value = rgbColor(fillColorProp.value);
                                                keyframe.easing = "None";
                                                layer.shape.fillColor.push(keyframe);
                                            }
                                        }
                                        else if (currentCompLayer("Contents").numProperties == 0) {
                                            alert("AeToOsb error: The ShapeLayer '" + currentCompLayer.name + "' doesn't have any Contents." + "\r\n" + "\r\n" +
                                                "Please check if the layer's property 'Content' can be expanded, if not then this layer will be ignored.");
                                            continue;
                                        }
                                    }

                                    function getShapeData(shapeLayer) {
                                        var pathData = [];
                                        var shapeLayerProperty = shapeLayer("Contents")(1)("Contents")(1)("Path");

                                        // From https://terriblejunkshow.com/tutorial/getpathui
                                        // mPnl.mPathProp = shapeLayerProperty;

                                        var pathValue = shapeLayerProperty.value;
                                        var pathValueVertices = pathValue.vertices;
                                        var inTangents = pathValue.inTangents;
                                        var outTangents = pathValue.outTangents;

                                        // get the center position (viewer coordinates)
                                        var pathX = [];
                                        var pathY = [];

                                        for (var i = 0; i < pathValueVertices.length; i++) {
                                            var CurrentPathValueVertex = pathValueVertices[i];
                                            pathX.push(CurrentPathValueVertex[0]);
                                            pathY.push(CurrentPathValueVertex[1]);
                                        }
                                        pathX.sort(function (a, b) { return a - b; });
                                        pathY.sort(function (a, b) { return a - b; });

                                        var pathMinX = pathX[0];
                                        var pathMaxX = pathX[pathX.length - 1];
                                        var pathMinY = pathY[0];
                                        var pathMaxY = pathY[pathY.length - 1];
                                        var pathCenter = [(pathMaxX + pathMinX) / 2, (pathMaxY + pathMinY) / 2];

                                        // set the coordinates with the center position as the origin [0,0]
                                        for (var i = 0; i < pathValueVertices.length; i++) {
                                            pathValueVertices[i] = pathValueVertices[i] - pathCenter;
                                        }
                                        // save path data
                                        pathData.push(pathValueVertices);
                                        pathData.push(inTangents);
                                        pathData.push(outTangents);

                                        // pathData: [pathValueVertices, inTangents, outTangents]
                                        return pathData;
                                    }
                                    
                                    if (layerType !== "Audio") {
                                        updateLayerSteps(5, currentComp.layer(la).name, "Exporting extra transform data...");
                                        layer.transform.position = {};
                                        layer.transform.scale = {};
                                        layer.transform.isRotating = false;
                                        layer.transform.rotation = [];
                                        // layer.transform.rotation = {
                                        //     x: [],
                                        //     y: [],
                                        //     orientation: {}
                                        // };
                                        // layer.transform.rotation.orientation = {};
    
                                        var holdKeyInfoPosX = [];
                                        var holdKeyInfoPosY = [];
                                        var holdKeyInfoScale = [];
                                        var holdKeyInfoRotation = [];
                                        var propPosX = currentCompLayer.property("Transform").property("X Position");
                                        var propPosY = currentCompLayer.property("Transform").property("Y Position");
                                        var propScale = currentCompLayer.scale;
                                        var propRotation = currentCompLayer.rotation;
    
                                        if (currentCompLayer.threeDLayer) {
                                            alert("AeToOsb error: 3D layers are not supported (yet?). Layer with 3D enabled: " + layer.name);
                                            // // position x
                                            // if (propPosX.numKeys !== 0) {
                                            //     // layer.transform.position.xKeyframed = true;
                                            //     layer.transform.position.x = [];
                                            //     for (var k = 1; k <= propPosX.numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(propPosX.keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = propPosX.keyValue(k);
                                            // keyframe.easing = easingType(propPosX, k);
                                            //         layer.transform.position.x.push(keyframe);
                                            //     }
                                            // }
                                            // else if (propPosX.numKeys === 0) {
                                            //     // layer.transform.position.xKeyframed = false;
                                            //     layer.transform.position.x = currentCompLayer.position.value[0];
                                            // }
                                            // // position y
                                            // if (propPosY.numKeys !== 0) {
                                            //     // layer.transform.position.yKeyframed = true;
                                            //     layer.transform.position.y = [];
                                            //     for (var k = 1; k <= propPosY.numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(propPosY.keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = propPosY.keyValue(k);
                                            // keyframe.easing = easingType(propPosY, k);
                                            //         layer.transform.position.y.push(keyframe);
                                            //     }
                                            // }
                                            // else if (propPosY.numKeys === 0) {
                                            //     // layer.transform.position.yKeyframed = false;
                                            //     layer.transform.position.y = currentCompLayer.position.value[1];
                                            // }
                                            // // position z
                                            // if (currentCompLayer.property("Transform").property("Z Position").numKeys !== 0) {
                                            //     // layer.transform.position.zKeyframed = true;
                                            //     layer.transform.position.z = [];
                                            //     for (var k = 1; k <= currentCompLayer.property("Transform").property("Z Position").numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(currentCompLayer.property("Transform").property("Z Position").keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = currentCompLayer.property("Transform").property("Z Position").keyValue(k);
                                            // keyframe.easing = easingType(currentCompLayer.property("Transform").property("Z Position"), k);
                                            //         layer.transform.position.z.push(keyframe);
                                            //     }
                                            // }
                                            // else if (currentCompLayer.property("Transform").property("Z Position").numKeys === 0) {
                                            //     // layer.transform.position.zKeyframed = false;
                                            //     layer.transform.position.z = currentCompLayer.position.value[2];
                                            // }
    
                                            // // scale x,y,z
                                            // if (propScale.numKeys !== 0) {
                                            //     // layer.transform.scale.keyframed = true;
                                            //     layer.transform.scale.keyframes = [];
                                            //     for (var k = 1; k <= propScale.numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(propScale.keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = propScale.keyValue(k) / 100;
                                            // keyframe.easing = easingType(propScale, k);
                                            //         layer.transform.scale.keyframes.push(keyframe);
                                            //     }
                                            // }
                                            // else if (propScale.numKeys === 0) {
                                            //     // layer.transform.scale.keyframed = false;
                                            //     layer.transform.scale.x = propScale.value[0] / 100;
                                            //     layer.transform.scale.y = propScale.value[1] / 100;
                                            //     layer.transform.scale.z = propScale.value[2] / 100;
                                            // }
    
                                            // // rotation x
                                            // if (currentCompLayer.property("Transform").property("X Rotation").numKeys !== 0) {
                                            //     // layer.transform.rotation.xKeyframed = true;
                                            //     layer.transform.rotation.x = [];
                                            //     for (var k = 1; k <= currentCompLayer.property("Transform").property("X Rotation").numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(currentCompLayer.property("Transform").property("X Rotation").keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = currentCompLayer.property("Transform").property("X Rotation").keyValue(k);
                                            // keyframe.easing = easingType(currentCompLayer.property("Transform").property("X Rotation"), k);
                                            //         layer.transform.rotation.x.push(keyframe);
                                            //     }
                                            // }
                                            // else if (currentCompLayer.property("Transform").property("X Rotation").numKeys === 0) {
                                            //     // layer.transform.rotation.xKeyframed = false;
                                            //     layer.transform.rotation.x = currentCompLayer.xRotation.value;
                                            // }
                                            // // rotation y
                                            // if (currentCompLayer.property("Transform").property("Y Rotation").numKeys !== 0) {
                                            //     // layer.transform.rotation.yKeyframed = true;
                                            //     layer.transform.rotation.y = [];
                                            //     for (var k = 1; k <= currentCompLayer.property("Transform").property("Y Rotation").numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(currentCompLayer.property("Transform").property("Y Rotation").keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = currentCompLayer.property("Transform").property("Y Rotation").keyValue(k);
                                            // keyframe.easing = easingType(currentCompLayer.property("Transform").property("Y Rotation"), k);
                                            //         layer.transform.rotation.y.push(keyframe);
                                            //     }
                                            // }
                                            // else if (currentCompLayer.property("Transform").property("Y Rotation").numKeys === 0) {
                                            //     // layer.transform.rotation.yKeyframed = false;
                                            //     layer.transform.rotation.y = currentCompLayer.yRotation.value;
                                            // }
                                            // // rotation z
                                            // if (currentCompLayer.property("Transform").property("Z Rotation").numKeys !== 0) {
                                            //     // layer.transform.rotation.zKeyframed = true;
                                            //     layer.transform.rotation.z = [];
                                            //     for (var k = 1; k <= currentCompLayer.property("Transform").property("Z Rotation").numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(currentCompLayer.property("Transform").property("Z Rotation").keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = currentCompLayer.property("Transform").property("Z Rotation").keyValue(k);
                                            // keyframe.easing = easingType(currentCompLayer.property("Transform").property("Z Rotation"), k);
                                            //         layer.transform.rotation.z.push(keyframe);
                                            //     }
                                            // }
                                            // else if (currentCompLayer.property("Transform").property("Z Rotation").numKeys === 0) {
                                            //     // layer.transform.rotation.zKeyframed = false;
                                            //     layer.transform.rotation.z = currentCompLayer.zRotation.value;
                                            // }
    
                                            // // orientation x,y,z
                                            // layer.transform.rotation.orientation.x = [];
                                            // layer.transform.rotation.orientation.y = [];
                                            // layer.transform.rotation.orientation.z = [];
                                            // if (currentCompLayer.orientation.numKeys !== 0) {
                                            //     // layer.transform.rotation.orientation.keyframed = true;
                                            //     for (var k = 1; k <= currentCompLayer.orientation.numKeys; k++) {
                                            //         var keyframe = {};
                                            //         keyframe.time = milliseconds(currentCompLayer.orientation.keyTime(k) + currentComp.displayStartTime);
                                            //         keyframe.value = currentCompLayer.orientation.keyValue(k);
                                            // keyframe.easing = easingType(currentCompLayer.orientation, k);
                                            //         layer.transform.rotation.orientation.push(keyframe);
                                            //     }
                                            // }
                                            // else if (currentCompLayer.orientation.numKeys === 0) {
                                            //     // layer.transform.rotation.orientation.keyframed = false;
                                            //     // var keyframeX = {};
                                            //     // var keyframeY = {};
                                            //     // var keyframeZ = {};
    
                                            //     // keyframeX.time = layer.startTime + currentComp.displayStartTime;
                                            //     // keyframeX.value = currentCompLayer.orientation.value[0];
                                            // keyframeX.easing = "None";
    
                                            //     // keyframeY.time = layer.startTime + currentComp.displayStartTime;
                                            //     // keyframeY.value = currentCompLayer.orientation.value[1];
                                            // keyframeY.easing = "None";
    
                                            //     // keyframeZ.time = layer.startTime + currentComp.displayStartTime;
                                            //     // keyframeZ.value = currentCompLayer.orientation.value[2];
                                            // keyframeZ.easing = "None";
    
                                            //     // // layer.transform.rotation.orientation.x = currentCompLayer.orientation.value[0];
                                            //     // // layer.transform.rotation.orientation.y = currentCompLayer.orientation.value[1];
                                            //     // // layer.transform.rotation.orientation.z = currentCompLayer.orientation.value[2];
    
                                            //     // layer.transform.rotation.orientation.x.push(keyframeX);
                                            //     // layer.transform.rotation.orientation.y.push(keyframeY);
                                            //     // layer.transform.rotation.orientation.z.push(keyframeZ);
                                            // }
                                            app.endUndoGroup();
                                        }
                                        else if (!currentCompLayer.threeDLayer) {
                                            var newLayer = currentCompLayer;
    
                                            for (var k = 1; k <= propPosX.numKeys; k++) {
                                                var prop = propPosX;
                                                var holdK = checkHoldKeyframe(prop, k);
                                                if (holdK != false) {
                                                    var holdKTime = prop.keyTime(holdK);
                                                    var holdKValue = prop.keyValue(holdK);
                                                    holdKeyInfoPosX.push(holdK, holdKTime, holdKValue);
                                                }
                                            }
                                            for (var k = 1; k <= propPosY.numKeys; k++) {
                                                var prop = propPosY;
                                                var holdK = checkHoldKeyframe(prop, k);
                                                if (holdK != false) {
                                                    var holdKTime = prop.keyTime(holdK);
                                                    var holdKValue = prop.keyValue(holdK);
                                                    holdKeyInfoPosY.push(holdK, holdKTime, holdKValue);
                                                }
                                            }
                                            for (var k = 1; k <= propScale.numKeys; k++) {
                                                var prop = propScale;
                                                var holdK = checkHoldKeyframe(prop, k);
                                                if (holdK != false) {
                                                    var holdKTime = prop.keyTime(holdK);
                                                    var holdKValue = prop.keyValue(holdK);
                                                    holdKeyInfoScale.push(holdK, holdKTime, holdKValue);
                                                }
                                            }
                                            for (var k = 1; k <= propRotation.numKeys; k++) {
                                                var prop = propRotation;
                                                var holdK = checkHoldKeyframe(prop, k);
                                                if (holdK != false) {
                                                    var holdKTime = prop.keyTime(holdK);
                                                    var holdKValue = prop.keyValue(holdK);
                                                    holdKeyInfoRotation.push(holdK, holdKTime, holdKValue);
                                                }
                                            }
    
                                            // position x
                                            updateLayerSteps(6, currentComp.layer(la).name, "Exporting position x keyframes...");
                                            layer.transform.position.x = [];
                                            if (propPosX.numKeys !== 0) {
                                                if (layerHasParent == true) {
                                                    if (parentLayerData.property("Transform").property("X Position").numKeys !== 0) {
                                                        currentCompResolution = [4, 4];
                                                        newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                        updateLayerSteps(6.35, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                        var newLayerPosXAfter = newLayer.property("Transform").property("X Position");
    
                                                        for (var k = 1; k <= newLayerPosXAfter.numKeys; k++) {
                                                            // alert(newLayerPosXAfter.keyValue(k));
                                                            var keyframe = {};
                                                            keyframe.time = milliseconds(newLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                            keyframe.value = round(newLayerPosXAfter.keyValue(k), 2);
                                                            keyframe.easing = easingType(newLayerPosXAfter, k);
                                                            // alert("child ID: " + layer.id + " | name: " + layer.name);
                                                            layer.transform.position.x.push(keyframe);
                                                            // alert("hmm");
                                                        }
                                                    }
                                                    else {
                                                        newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                        updateLayerSteps(6.35, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                        var newLayerPosXAfter = newLayer.property("Transform").property("X Position");
                                                        var keyframe = {};
    
                                                        keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                        keyframe.value = round(newLayerPosXAfter.valueAtTime(layer.startTime), 2);
                                                        layer.transform.position.x.push(keyframe);
                                                    }
                                                }
                                                else {
                                                    // layer.transform.position.xKeyframed = true;
                                                    for (var k = 1; k <= propPosX.numKeys; k++) {
                                                        var keyframe = {};
                                                        keyframe.time = milliseconds(propPosX.keyTime(k) + currentComp.displayStartTime);
                                                        keyframe.value = round(propPosX.keyValue(k), 2);
                                                        keyframe.easing = easingType(propPosX, k);
                                                        layer.transform.position.x.push(keyframe);
                                                    }
                                                }
                                            }
                                            else if (propPosX.numKeys === 0) {
                                                if (layerHasParent == true) {
                                                    if (parentLayerData.property("Transform").property("X Position").numKeys !== 0) {
                                                        currentCompResolution = [4, 4];
                                                        updateLayerSteps(6.35, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                        newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                        var newLayerPosXAfter = newLayer.property("Transform").property("X Position");
    
                                                        for (var k = 1; k <= newLayerPosXAfter.numKeys; k++) {
                                                            var keyframe = {};
                                                            keyframe.time = milliseconds(newLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                            keyframe.value = round(newLayerPosXAfter.keyValue(k), 2);
                                                            keyframe.easing = easingType(newLayerPosXAfter, k);
                                                            layer.transform.position.x.push(keyframe);
                                                        }
                                                    }
                                                    else {
                                                        currentCompResolution = [4, 4];
                                                        updateLayerSteps(6.35, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                        newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                        var newLayerPosXAfter = newLayer.property("Transform").property("X Position");
    
                                                        for (var k = 1; k <= newLayerPosXAfter.numKeys; k++) {
                                                            var keyframe = {};
                                                            keyframe.time = milliseconds(newLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                            keyframe.value = round(newLayerPosXAfter.keyValue(k), 2);
                                                            keyframe.easing = easingType(newLayerPosXAfter, k);
                                                            layer.transform.position.x.push(keyframe);
                                                        }
                                                    }
                                                }
                                                else {
                                                    // layer.transform.position.xKeyframed = false;
                                                    var keyframe = {};
    
                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                    keyframe.value = round(currentCompLayer.position.value[0], 2);
                                                    keyframe.easing = "None";
                                                    layer.transform.position.x.push(keyframe);
                                                }
                                            }
    
                                            // position y
                                            updateLayerSteps(6.8, currentComp.layer(la).name, "Exporting position y keyframes...");
                                            layer.transform.position.y = [];
                                            if (propPosY.numKeys !== 0) {
                                                if (layerHasParent == true) {
                                                    if (parentLayerData.property("Transform").property("Y Position").numKeys !== 0) {
                                                        if (parentLayerData.property("Transform").property("X Position").numKeys !== 0) {
                                                            var newLayerPosYAfter = newLayer.property("Transform").property("Y Position");
    
                                                            for (var k = 1; k <= newLayerPosYAfter.numKeys; k++) {
                                                                var keyframe = {};
                                                                keyframe.time = milliseconds(newLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                keyframe.value = round(newLayerPosYAfter.keyValue(k), 2);
                                                                keyframe.easing = easingType(newLayerPosYAfter, k);
                                                                layer.transform.position.y.push(keyframe);
                                                            }
                                                        }
                                                        else {
                                                            currentCompResolution = [4, 4];
                                                            newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                            var newLayerPosYAfter = newLayer.property("Transform").property("Y Position");
    
                                                            for (var k = 1; k <= newLayerPosYAfter.numKeys; k++) {
                                                                var keyframe = {};
                                                                keyframe.time = milliseconds(newLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                keyframe.value = round(newLayerPosYAfter.keyValue(k), 2);
                                                                keyframe.easing = easingType(newLayerPosYAfter, k);
                                                                layer.transform.position.y.push(keyframe);
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (currentCompLayer.property("Transform").property("Y Position").numKeys !== 0) {
                                                            var newLayerPosYAfter = currentCompLayer.property("Transform").property("Y Position");
    
                                                            for (var k = 1; k <= newLayerPosYAfter.numKeys; k++) {
                                                                var keyframe = {};
                                                                keyframe.time = milliseconds(newLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                keyframe.value = round(newLayerPosYAfter.keyValue(k), 2);
                                                                keyframe.easing = easingType(newLayerPosYAfter, k);
                                                                layer.transform.position.y.push(keyframe);
                                                            }
                                                        }
                                                        else {
                                                            currentCompResolution = [4, 4];
                                                            newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                            var newLayerPosYAfter = newLayer.property("Transform").property("Y Position");
    
                                                            for (var k = 1; k <= newLayerPosYAfter.numKeys; k++) {
                                                                var keyframe = {};
                                                                keyframe.time = milliseconds(newLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                keyframe.value = round(newLayerPosYAfter.keyValue(k), 2);
                                                                keyframe.easing = easingType(newLayerPosYAfter, k);
                                                                layer.transform.position.y.push(keyframe);
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    // layer.transform.position.y.yKeyframed = true;
                                                    for (var k = 1; k <= propPosY.numKeys; k++) {
                                                        var keyframe = {};
                                                        keyframe.time = milliseconds(propPosY.keyTime(k) + currentComp.displayStartTime);
                                                        keyframe.value = round(propPosY.keyValue(k), 2);
                                                        keyframe.easing = easingType(propPosY, k);
                                                        layer.transform.position.y.push(keyframe);
                                                    }
                                                }
                                            }
                                            else if (propPosY.numKeys === 0) {
                                                if (layerHasParent == true) {
                                                    if (parentLayerData.property("Transform").property("Y Position").numKeys === 0) {
                                                        if (parentLayerData.property("Transform").property("X Position").numKeys === 0) {
                                                            var newLayerPosYAfter = newLayer.property("Transform").property("Y Position");
    
                                                            for (var k = 1; k <= newLayerPosYAfter.numKeys; k++) {
                                                                var keyframe = {};
                                                                keyframe.time = milliseconds(newLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                keyframe.value = round(newLayerPosYAfter.keyValue(k), 2);
                                                                keyframe.easing = easingType(newLayerPosYAfter, k);
                                                                layer.transform.position.y.push(keyframe);
                                                            }
                                                        }
                                                        else {
                                                            currentCompResolution = [4, 4];
                                                            newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                            var newLayerPosYAfter = newLayer.property("Transform").property("Y Position");
    
                                                            for (var k = 1; k <= newLayerPosYAfter.numKeys; k++) {
                                                                var keyframe = {};
                                                                keyframe.time = milliseconds(newLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                keyframe.value = round(newLayerPosYAfter.keyValue(k), 2);
                                                                keyframe.easing = easingType(newLayerPosYAfter, k);
                                                                layer.transform.position.y.push(keyframe);
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        newLayer = getChildPosition(currentCompLayer, parentLayerData, layer.transform.isRotating, layerHasParent);
                                                        var newLayerPosYAfter = newLayer.property("Transform").property("Y Position");
                                                        var keyframe = {};
    
                                                        keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                        keyframe.value = round(newLayerPosYAfter.valueAtTime(layer.startTime), 2);
                                                        keyframe.easing = "None";
                                                        layer.transform.position.y.push(keyframe);
                                                    }
                                                }
                                                else {
                                                    // layer.transform.position.yKeyframed = false;
                                                    var keyframe = {};
    
                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                    keyframe.value = round(currentCompLayer.position.value[1], 2);
                                                    keyframe.easing = "None";
                                                    layer.transform.position.y.push(keyframe);
                                                }
                                            }
    
                                            // scale x,y
                                            updateLayerSteps(7, currentComp.layer(la).name, "Exporting scale keyframes...");
                                            layer.transform.scale.x = [];
                                            layer.transform.scale.y = [];
                                            if (propScale.numKeys !== 0) {
                                                // layer.transform.scale.keyframed = true;
                                                for (var k = 1; k <= propScale.numKeys; k++) {
                                                    var keyframeX = {};
                                                    var keyframeY = {};
    
                                                    var scaleTime = milliseconds(propScale.keyTime(k) + currentComp.displayStartTime);
                                                    var scaleValues = propScale.keyValue(k) / 100;
    
                                                    keyframeX.time = scaleTime;
                                                    keyframeX.value = round(scaleValues[0], 2);
                                                    keyframeX.easing = easingType(propScale, k);
                                                    layer.transform.scale.x.push(keyframeX);
    
                                                    keyframeY.time = scaleTime;
                                                    keyframeY.value = round(scaleValues[1], 2);
                                                    keyframeY.easing = easingType(propScale, k);
                                                    layer.transform.scale.y.push(keyframeY);
                                                }
                                            }
                                            else if (propScale.numKeys === 0) {
                                                // layer.transform.scale.keyframed = false;
                                                var keyframeX = {};
                                                var keyframeY = {};
    
                                                keyframeX.time = layer.startTime + currentComp.displayStartTime;
                                                keyframeX.value = round(propScale.value[0] / 100, 2);
                                                keyframeX.easing = "None";
                                                layer.transform.scale.x.push(keyframeX);
    
                                                keyframeY.time = layer.startTime + currentComp.displayStartTime;
                                                keyframeY.value = round(propScale.value[1] / 100, 2);
                                                keyframeY.easing = "None";
                                                layer.transform.scale.y.push(keyframeY);
                                            }
    
                                            // rotation degrees
                                            updateLayerSteps(7.5, currentComp.layer(la).name, "Exporting rotation keyframes...");
                                            if (propRotation.numKeys !== 0) {
                                                // layer.transform.rotation.keyframed = true;
                                                // layer.transform.rotation.keyframes = [];
                                                for (var k = 1; k <= propRotation.numKeys; k++) {
                                                    layer.transform.isRotating = true;
                                                    var keyframe = {};
                                                    keyframe.time = milliseconds(propRotation.keyTime(k) + currentComp.displayStartTime);
                                                    keyframe.value = propRotation.keyValue(k);
                                                    keyframe.easing = easingType(propRotation, k);
                                                    layer.transform.rotation.push(keyframe);
                                                }
                                                for (var k = 1; k <= propRotation.numKeys; k++) {
                                                    if (propRotation.keyValue(k) !== 0) { layer.transform.isRotating = true; break; }
                                                    else { continue; }
                                                }
                                            }
                                            else if (propRotation.numKeys === 0) {
                                                layer.transform.isRotating = false;
                                                // layer.transform.rotation.keyframed = false;
                                                var keyframe = {};
                                                keyframe.time = layer.startTime + currentComp.displayStartTime + currentComp.displayStartTime;
                                                keyframe.value = propRotation.value;
                                                keyframe.easing = "None";
                                                layer.transform.rotation.push(keyframe);
    
                                                if (propRotation.value !== 0) layer.transform.isRotating = true;
                                            }
                                            app.endUndoGroup();
    
                                            if (layerType == "Text") {
                                                updateLayerSteps(8, currentComp.layer(la).name, "Exporting Text data...");
                                                app.beginUndoGroup("Export Text Layers in: " + currentComp.name);
                                                // alert("currentCompLayer.index: " + currentCompLayer.index);
                                                // alert("firstTextLayerIndex[0]: " + firstTextLayerIndex[0]);
                                                if (currentCompLayer.index >= firstTextLayerIndex[0]) {
                                                    if (currentCompLayer.effect.property("autoGen.AeToOsb.textLayer") == null) {
                                                        var sourceText = currentCompLayer.text.sourceText.value;
                                                        // alert(sourceText.numText);
                                                        layer.text = {};
                                                        layer.text.text = sourceText.text;
                                                        layer.text.fontName = sourceText.font;
                                                        layer.text.fontFamily = sourceText.fontFamily;
                                                        layer.text.fontSize = sourceText.fontSize;
                                                        layer.text.fontStyle = sourceText.fontStyle;
                                                        layer.text.lineHeight = round(sourceText.leading, 2);
                                                        layer.text.lineSpacing = round(sourceText.tracking, 2);
                                                        layer.text.lineSpacingOffset = [];
    
                                                        var lineSpacingOffsetKeyframed = [];
                                                        var lineSpacingOffsetProp = [];
                                                        if (layerType !== "Audio") {
                                                            if (!currentCompLayer.threeDLayer) {
                                                                // lineSpacingOffset
                                                                var animators = currentCompLayer.property("ADBE Text Properties").property("ADBE Text Animators");
                                                                if (animators.numProperties >= 1) {
                                                                    for (var a = 1; a < animators.numProperties; a++) {
                                                                        for (var prop = 1; prop <= animators(a)("Properties").numProperties; prop++) {
                                                                            if (animators(a)("Properties")(prop).name === "Tracking Amount") {
                                                                                var animator = animators(a)("Properties").property("Tracking Amount");
                                                                                if (animator.numKeys !== 0) {
                                                                                    lineSpacingOffsetProp.push(animator);
                                                                                    lineSpacingOffsetKeyframed.push(true);
                                                                                    // layer.text.lineSpacingOffset.keyframed = true;
                                                                                    // layer.text.lineSpacingOffset.keyframes = [];
                                                                                    for (var k = 1; k <= animator.numKeys; k++) {
                                                                                        var keyframe = {};
                                                                                        keyframe.time = milliseconds(animator.keyTime(k) + currentComp.displayStartTime);
                                                                                        keyframe.value = round(animator.keyValue(k));
                                                                                        keyframe.easing = easingType(animator, k);
                                                                                        layer.text.lineSpacingOffset.push(keyframe);
                                                                                    }
                                                                                }
                                                                                else if (animator.numKeys === 0) {
                                                                                    lineSpacingOffsetProp.push(animator);
                                                                                    lineSpacingOffsetKeyframed.push(false);
                                                                                    // layer.text.lineSpacingOffset.keyframed = false;
                                                                                    var keyframe = {};
                                                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                                    keyframe.value = round(animator.value, 2);
                                                                                    keyframe.easing = "None";
                                                                                    layer.text.lineSpacingOffset.push(keyframe);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                else if (animators.numProperties === 0) {
                                                                    layer.text.lineSpacingOffset.push({
                                                                        time: layer.startTime,
                                                                        value: 0,
                                                                        easing: "None"
                                                                    });
                                                                }
                                                            }
                                                        }
                                                        layer.text.alignment = sourceText.justification;
                                                        if (layer.text.alignment == 7415)
                                                            layer.text.alignment = "center";
                                                        if (layer.text.alignment == 7413)
                                                            layer.text.alignment = "left";
                                                        if (layer.text.alignment == 7414)
                                                            layer.text.alignment = "right";
                                                        if (layer.text.alignment == 7418)
                                                            layer.text.alignment = "full_justify_lastline_center";
                                                        if (layer.text.alignment == 7419)
                                                            layer.text.alignment = "full_justify_lastline_full";
                                                        if (layer.text.alignment == 7416)
                                                            layer.text.alignment = "full_justify_lastline_left";
                                                        if (layer.text.alignment == 7417)
                                                            layer.text.alignment = "full_justify_lastline_right";
                                                        if (layer.text.alignment == 7412)
                                                            layer.text.alignment = "multiple_justifications";
    
                                                        layer.text.hasColorFill = sourceText.applyFill;
                                                        if (layer.text.hasColorFill !== true) {
                                                            layer.text.color = "#ffffff";
                                                        }
                                                        if (layer.text.hasColorFill == true)
                                                            layer.text.color = rgbColor(sourceText.fillColor);
    
                                                        layer.text.hasStroke = sourceText.applyStroke;
                                                        if (layer.text.hasStroke !== true) {
                                                            layer.text.strokeColor = "#ffffff";
                                                            layer.text.strokeThickness = 0;
                                                        }
                                                        if (layer.text.hasStroke == true) {
                                                            layer.text.color = rgbColor(sourceText.strokeColor);
                                                            layer.text.strokeThickness = sourceText.strokeWidth;
                                                        }
    
                                                        if (sourceText.text.length > 1)
                                                            layer.text.hasCharacters = true;
                                                        else if (sourceText.text.length <= 1)
                                                            layer.text.hasCharacters = false;
    
                                                        if (layer.text.hasCharacters == true) {
                                                            scriptSettings = readSettings();
    
                                                            app.endUndoGroup();
    
                                                            // characters
                                                            if (scriptSettings.options.exportTextPerLetter == true) {
                                                                parentsInComp = true;
                                                                updateLayerSteps(8.2, currentComp.layer(la).name, "Exporting Text character data...");
                                                                layer.text.characters = [];
                                                                var explodedText;
                                                                var explodedTextLayer;
                                                                var explodedTextMiddle = Math.round(sourceText.text.length / 2) - 1;
                                                                // selectedCompsDialog.onDeactivate = function () {}
    
                                                                currentComp.openInViewer();
                                                                previouslySelected();
                                                                currentComp.time = 0;
                                                                splitText(currentCompLayer, "characters");
                                                                app.beginUndoGroup("Separate Text (Explode): " + currentCompLayer.name);
    
                                                                for (var txtL = 1; txtL <= selectedComps[I].numLayers; txtL++) {
                                                                    if (txtL > 1 && selectedComps[I].numLayers > 1 && currentCompLayer.name != selectedComps[I].layer(txtL - 1).name) {
                                                                        getTextData();
                                                                        break;
                                                                    }
                                                                    else if (txtL == 1 && selectedComps[I].numLayers > 1 && currentCompLayer.name != selectedComps[I].layer(txtL + 1).name) {
                                                                        getTextData();
                                                                        break;
                                                                    }
                                                                    else if (txtL == 1 && selectedComps[I].numLayers == 1 && currentCompLayer.name != selectedComps[I].layer(txtL).name) {
                                                                        getTextData();
                                                                        break;
                                                                    }
                                                                    else {
                                                                        continue;
                                                                    }
                                                                }
                                                                app.endUndoGroup();
    
                                                                function getTextData() {
                                                                    for (var letter = 0; letter < sourceText.text.length; letter++) {
                                                                        explodedText = currentComp.layer(sourceText.text[letter].toString());
    
                                                                        // explodedText.anchorPoint.expression = 'thisComp.layer(' + currentCompLayer.index + ').transform.anchorPoint';
                                                                        // explodedText.transform("X Position").expression = 'thisLayer.transform("X Position") + thisComp.layer(' + currentCompLayer.index + ').transform.anchorPoint[0]';
                                                                        // explodedText.transform("Y Position").expression = 'thisLayer.transform("Y Position") + thisComp.layer(' + currentCompLayer.index + ').transform.anchorPoint[1]';
                                                                        explodedText.effect.addProperty("Dropdown Menu Control").name = "autoGen.AeToOsb.textLayer";
    
                                                                        // var posX = explodedText.effect.addProperty("Slider Control");
                                                                        // posX.name = "posX"; posX.slider.expression = 'thisLayer.transform("X Position")'
                                                                        // var posY = explodedText.effect.addProperty("Slider Control");
                                                                        // posY.name = "posY"; posY.slider.expression = 'thisLayer.transform("Y Position")'
    
                                                                        explodedTextLayer = explodedText;
                                                                        explodedText = explodedText.text.sourceText.value;
                                                                        // var posBefore = explodedTextLayer.value;
    
                                                                        var et = {
                                                                            text: explodedText.text,
                                                                            fontName: explodedText.font,
                                                                            fontFamily: explodedText.fontFamily,
                                                                            fontSize: explodedText.fontSize,
                                                                            fontStyle: explodedText.fontStyle
                                                                        };
    
                                                                        et.alignment = sourceText.justification;
                                                                        if (et.alignment == 7415)
                                                                            et.alignment = "center";
                                                                        if (et.alignment == 7413)
                                                                            et.alignment = "left";
                                                                        if (et.alignment == 7414)
                                                                            et.alignment = "right";
                                                                        if (et.alignment == 7418)
                                                                            et.alignment = "full_justify_lastline_center";
                                                                        if (et.alignment == 7419)
                                                                            et.alignment = "full_justify_lastline_full";
                                                                        if (et.alignment == 7416)
                                                                            et.alignment = "full_justify_lastline_left";
                                                                        if (et.alignment == 7417)
                                                                            et.alignment = "full_justify_lastline_right";
                                                                        if (et.alignment == 7412)
                                                                            et.alignment = "multiple_justifications";
    
                                                                        et.hasColorFill = explodedText.applyFill;
                                                                        if (et.hasColorFill !== true) {
                                                                            et.color = "#ffffff";
                                                                        }
                                                                        if (et.hasColorFill == true)
                                                                            et.color = rgbColor(explodedText.fillColor);
    
                                                                        et.hasStroke = explodedText.applyStroke;
                                                                        if (et.hasStroke !== true) {
                                                                            et.strokeColor = "#ffffff";
                                                                            et.strokeThickness = 0;
                                                                        }
                                                                        if (et.hasStroke == true) {
                                                                            et.color = rgbColor(explodedText.strokeColor);
                                                                            et.strokeThickness = explodedText.strokeWidth;
                                                                        }
    
                                                                        et.transform = {};
                                                                        et.transform.origin = layer.transform.origin;
                                                                        et.transform.threeD = explodedTextLayer.threeDLayer;
    
                                                                        et.transform.threeDPerChar = explodedTextLayer.threeDPerChar;
                                                                        et.transform.layerBitmap = {};
                                                                        et.transform.layerBitmap.width = explodedTextLayer.width;
                                                                        et.transform.layerBitmap.height = explodedTextLayer.height;
    
                                                                        // fade
                                                                        updateLayerSteps(8.3, currentComp.layer(la).name, "Exporting character opacity keyframes...");
                                                                        et.transform.fade = [];
                                                                        if (explodedTextLayer.opacity.numKeys !== 0) {
                                                                            // et.transform.fade.keyframed = true;
                                                                            for (var k = 1; k <= explodedTextLayer.opacity.numKeys; k++) {
                                                                                var keyframe = {};
                                                                                keyframe.time = milliseconds(explodedTextLayer.opacity.keyTime(k) + currentComp.displayStartTime);
                                                                                keyframe.value = explodedTextLayer.opacity.keyValue(k) / 100;
                                                                                keyframe.easing = easingType(explodedTextLayer.opacity, k);
                                                                                et.transform.fade.push(keyframe);
                                                                            }
                                                                        }
                                                                        else if (explodedTextLayer.opacity.numKeys === 0) {
                                                                            // et.transform.fade.keyframed = false;
                                                                            var keyframe = {};
                                                                            keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                            keyframe.value = explodedTextLayer.opacity.value / 100;
                                                                            keyframe.easing = "None";
                                                                            et.transform.fade.push(keyframe);
                                                                        }
    
                                                                        et.transform.position = {};
                                                                        et.transform.scale = {};
                                                                        et.transform.rotation = [];
    
                                                                        // alert("explodedTextLayer: " + explodedTextLayer.name);
                                                                        if (!explodedTextLayer.threeDLayer) {
                                                                            var explodedTextLayerNew = explodedTextLayer;
                                                                            // var currentCompDuration = layerEnd(currentComp, currentCompLayer.outPoint) - layerStart(currentComp, currentCompLayer.inPoint);
                                                                            var explodedTextLayerPosX = explodedTextLayer.property("Transform").property("X Position");
                                                                            // var currentCompLayerStart = layerStart(currentComp, currentCompLayer.inPoint);
                                                                            // var currentCompLayerEnd = layerEnd(currentComp, currentCompLayer.outPoint);
    
                                                                            // position x
                                                                            updateLayerSteps(8.4, currentComp.layer(la).name, "Exporting character position x keyframes...");
                                                                            et.transform.position.x = [];
                                                                            if (propPosX.numKeys !== 0) {
                                                                                if (lineSpacingOffsetKeyframed[0] == false) {
                                                                                    currentCompResolution = [4, 4];
                                                                                    updateLayerSteps(8.5, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                                                    explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                        var keyframe = {};
                                                                                        keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                        keyframe.easing = easingType(explodedTextLayerPosXAfter, k);
                                                                                        et.transform.position.x.push(keyframe);
                                                                                    }
                                                                                }
                                                                                else if (lineSpacingOffsetKeyframed[0] == true) {
                                                                                    currentCompResolution = [4, 4];
                                                                                    updateLayerSteps(8.5, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                                                    explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                        var keyframe = {};
                                                                                        keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                        keyframe.easing = easingType(explodedTextLayerPosXAfter, k);
                                                                                        et.transform.position.x.push(keyframe);
                                                                                    }
    
                                                                                    // // not finished...
    
                                                                                    // var lineSpacingKeyTimeBefore = [];
                                                                                    // var lineSpacingKeyValueBefore = [];
                                                                                    // currentCompResolution = [4, 4];
                                                                                    // explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    // var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    // for (var k = 1; k <= lineSpacingOffsetProp[0].numKeys; k++) {
                                                                                    //     lineSpacingKeyTimeBefore.push(lineSpacingOffsetProp[0].keyTime(k));
                                                                                    //     lineSpacingKeyValueBefore.push(lineSpacingOffsetProp[0].keyValue(k));
                                                                                    // }
    
                                                                                    // for (var k = 1; k <= lineSpacingOffsetProp[0].numKeys; k++)
                                                                                    //     explodedTextLayerPosXAfter.addKey(lineSpacingOffsetProp[0].keyTime(k));
                                                                                    // for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++)
                                                                                    //     lineSpacingOffsetProp[0].addKey(explodedTextLayerPosXAfter.keyTime(k));
    
                                                                                    // for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                    //     var posKeyframeX = explodedTextLayerPosXAfter.keyValue(k);
    
                                                                                    //     var keyframe = {};
    
                                                                                    //     var spaceIncrease;
                                                                                    //     var spaceDecrease;
                                                                                    //     var spacingAtTime;
                                                                                    //     if (layer.text.lineSpacingOffset[0].value > layer.text.lineSpacingOffset[1].value) {
                                                                                    //         spaceIncrease = false;
                                                                                    //         spaceDecrease = true;
                                                                                    //         spacingAtTime = (lineSpacingOffsetProp[0].keyValue(1) * 0.6) - lineSpacingOffsetProp[0].keyValue(k);
                                                                                    //     }
                                                                                    //     else if (layer.text.lineSpacingOffset[0].value < layer.text.lineSpacingOffset[1].value) {
                                                                                    //         spaceIncrease = true;
                                                                                    //         spaceDecrease = false;
                                                                                    //         spacingAtTime = lineSpacingOffsetProp[0].keyValue(lineSpacingOffsetProp[0].numKeys * 0.7);
                                                                                    //     }
    
                                                                                    //     keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                    //     keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
    
                                                                                    //     // increased spacing
                                                                                    //     if (letter > explodedTextMiddle && spaceIncrease == true) { // if it's to the right from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + (spacingAtTime * 2));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter < explodedTextMiddle && spaceIncrease == true) { // if it's to the left from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - (spacingAtTime * 2));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                    //         if (et.alignment == "right" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
                                                                                    //         if (et.alignment == "left" || et.alignment == "full_justify_lastline_left")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     } // decreased spacing
                                                                                    //     else if (letter > explodedTextMiddle && spaceDecrease == true) { // if it's to the right from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - (spacingAtTime * 3));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter < explodedTextMiddle && spaceDecrease == true) {  // if it's to the left from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + (spacingAtTime * 2));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                    //         if (et.alignment == "right" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
                                                                                    //         if (et.alignment == "left" || et.alignment == "full_justify_lastline_left")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else {
                                                                                    //         continue;
                                                                                    //     }
                                                                                    // }
                                                                                    // // remove added lineSpacing keys
                                                                                    // for (var k = 1; k <= (lineSpacingOffsetProp[0].numKeys * 4); k++) {
                                                                                    //     if (k > 1 && k < lineSpacingOffsetProp[0].numKeys)
                                                                                    //     lineSpacingOffsetProp[0].removeKey(2);
                                                                                    //     else continue;
                                                                                    // }
                                                                                }
                                                                                else {
                                                                                    currentCompResolution = [4, 4];
                                                                                    updateLayerSteps(8.5, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                                                    explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                        var keyframe = {};
                                                                                        keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                        keyframe.easing = easingType(explodedTextLayerPosXAfter, k);
                                                                                        et.transform.position.x.push(keyframe);
                                                                                    }
                                                                                }
                                                                            }
                                                                            else if (propPosX.numKeys === 0) {
                                                                                if (lineSpacingOffsetKeyframed[0] == false) {
                                                                                    var keyframe = {};
    
                                                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                                    keyframe.value = round(explodedTextLayerPosX.valueAtTime(layer.startTime, false), 2);
                                                                                    keyframe.easing = "None";
                                                                                    et.transform.position.x.push(keyframe);
                                                                                }
                                                                                else if (lineSpacingOffsetKeyframed[0] == true) {
                                                                                    var keyframe = {};
    
                                                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                                    keyframe.value = round(explodedTextLayerPosX.valueAtTime(layer.startTime, false), 2);
                                                                                    keyframe.easing = "None";
                                                                                    et.transform.position.x.push(keyframe);
    
                                                                                    // // not finished...
    
                                                                                    // var lineSpacingKeyTimeBefore = [];
                                                                                    // var lineSpacingKeyValueBefore = [];
                                                                                    // currentCompResolution = [4, 4];
                                                                                    // explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    // var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    // for (var k = 1; k <= lineSpacingOffsetProp[0].numKeys; k++) {
                                                                                    //     lineSpacingKeyTimeBefore.push(lineSpacingOffsetProp[0].keyTime(k));
                                                                                    //     lineSpacingKeyValueBefore.push(lineSpacingOffsetProp[0].keyValue(k));
                                                                                    // }
    
                                                                                    // for (var k = 1; k <= lineSpacingOffsetProp[0].numKeys; k++)
                                                                                    //     explodedTextLayerPosXAfter.addKey(lineSpacingOffsetProp[0].keyTime(k));
                                                                                    // for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++)
                                                                                    //     lineSpacingOffsetProp[0].addKey(explodedTextLayerPosXAfter.keyTime(k));
    
                                                                                    // for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                    //     var posKeyframeX = explodedTextLayerPosXAfter.keyValue(k);
    
                                                                                    //     var keyframe = {};
    
                                                                                    //     var spaceIncrease;
                                                                                    //     var spaceDecrease;
                                                                                    //     var spacingAtTime;
                                                                                    //     if (layer.text.lineSpacingOffset[0].value > layer.text.lineSpacingOffset[1].value) {
                                                                                    //         spaceIncrease = false;
                                                                                    //         spaceDecrease = true;
                                                                                    //         spacingAtTime = (lineSpacingOffsetProp[0].keyValue(1) * 0.6) - lineSpacingOffsetProp[0].keyValue(k);
                                                                                    //     }
                                                                                    //     else if (layer.text.lineSpacingOffset[0].value < layer.text.lineSpacingOffset[1].value) {
                                                                                    //         spaceIncrease = true;
                                                                                    //         spaceDecrease = false;
                                                                                    //         spacingAtTime = lineSpacingOffsetProp[0].keyValue(lineSpacingOffsetProp[0].numKeys * 0.7);
                                                                                    //     }
    
                                                                                    //     keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                    //     keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
    
                                                                                    //     // increased spacing
                                                                                    //     if (letter > explodedTextMiddle && spaceIncrease == true) { // if it's to the right from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + (spacingAtTime * 2));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter < explodedTextMiddle && spaceIncrease == true) { // if it's to the left from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - (spacingAtTime * 2));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                    //         if (et.alignment == "right" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
                                                                                    //         if (et.alignment == "left" || et.alignment == "full_justify_lastline_left")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX);
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     } // decreased spacing
                                                                                    //     else if (letter > explodedTextMiddle && spaceDecrease == true) { // if it's to the right from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - (spacingAtTime * 3));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
                                                                                    //         // alert("not P letter 1");
                                                                                    //         // alert(explodedTextLayerPosXAfter.keyValue(k));
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter < explodedTextMiddle && spaceDecrease == true) {  // if it's to the left from centre
                                                                                    //         if (et.alignment == "left" || et.alignment == "right" || et.alignment == "full_justify_lastline_left" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + (spacingAtTime * 2));
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
                                                                                    //         // alert("P letter");
                                                                                    //         // alert(explodedTextLayerPosXAfter.keyValue(k));
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                    //         if (et.alignment == "right" || et.alignment == "full_justify_lastline_right")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX + spacingAtTime);
                                                                                    //         if (et.alignment == "left" || et.alignment == "full_justify_lastline_left")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX - spacingAtTime);
                                                                                    //         if (et.alignment == "center" || et.alignment == "full_justify_lastline_center" || et.alignment == "full_justify_lastline_full")
                                                                                    //             explodedTextLayerPosXAfter.setValueAtKey(k, posKeyframeX);
                                                                                    //         // alert("not P letter 2");
                                                                                    //         // alert(explodedTextLayerPosXAfter.keyValue(k));
    
                                                                                    //         keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                    //         if (round(explodedTextLayerPosXAfter.keyValue(2)) != round(explodedTextLayerPosXAfter.keyValue(1))) et.transform.position.x.push(keyframe);
                                                                                    //         continue;
                                                                                    //     }
                                                                                    //     else {
                                                                                    //         continue;
                                                                                    //     }
                                                                                    // }
                                                                                    // // remove added lineSpacing keys
                                                                                    // for (var k = 1; k <= (lineSpacingOffsetProp[0].numKeys * 4); k++) {
                                                                                    //     if (k > 1 && k < lineSpacingOffsetProp[0].numKeys)
                                                                                    //     lineSpacingOffsetProp[0].removeKey(2);
                                                                                    //     else continue;
                                                                                    // }
                                                                                }
                                                                                else if (lineSpacingOffsetKeyframed.length == 0 && layer.transform.isRotating == false) {
                                                                                    var keyframe = {};
                                                                                    explodedTextLayer.parent = null;
                                                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                                    keyframe.value = round(explodedTextLayerPosX.valueAtTime(layer.startTime, false), 2);
                                                                                    keyframe.easing = "None";
                                                                                    et.transform.position.x.push(keyframe);
                                                                                }
                                                                                else if (lineSpacingOffsetKeyframed.length == 0 && layer.transform.isRotating == true) {
                                                                                    currentCompResolution = [4, 4];
                                                                                    updateLayerSteps(8.5, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                                                    explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                        var keyframe = {};
                                                                                        keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                        keyframe.easing = easingType(explodedTextLayerPosXAfter, k);
                                                                                        et.transform.position.x.push(keyframe);
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    currentCompResolution = [4, 4];
                                                                                    updateLayerSteps(8.5, currentComp.layer(la).name, "Baking parented keyframes into child layer...");
                                                                                    explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                    var explodedTextLayerPosXAfter = explodedTextLayerNew.property("Transform").property("X Position");
    
                                                                                    for (var k = 1; k <= explodedTextLayerPosXAfter.numKeys; k++) {
                                                                                        var keyframe = {};
                                                                                        keyframe.time = milliseconds(explodedTextLayerPosXAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        keyframe.value = round(explodedTextLayerPosXAfter.keyValue(k), 2);
                                                                                        keyframe.easing = easingType(explodedTextLayerPosXAfter, k);
                                                                                        et.transform.position.x.push(keyframe);
                                                                                    }
                                                                                }
                                                                            }
    
                                                                            // position y
                                                                            updateLayerSteps(8.6, currentComp.layer(la).name, "Exporting character position y keyframes...");
                                                                            et.transform.position.y = [];
                                                                            if (propPosY.numKeys !== 0) {
                                                                                if (propPosX.numKeys === 0) {
                                                                                    if (lineSpacingOffsetKeyframed[0] == false) {
                                                                                        currentCompResolution = [4, 4];
                                                                                        explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                    else if (lineSpacingOffsetKeyframed[0] == true) {
                                                                                        currentCompResolution = [4, 4];
                                                                                        explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
    
                                                                                        // // not finished...
    
                                                                                        // currentCompResolution = [4, 4];
                                                                                        // explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                        // var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        // for (var k = 1; k <= lineSpacingOffsetProp[0].numKeys; k++)
                                                                                        //     explodedTextLayerPosYAfter.addKey(lineSpacingOffsetProp[0].keyTime(k));
                                                                                        // for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++)
                                                                                        //     lineSpacingOffsetProp[0].addKey(explodedTextLayerPosYAfter.keyTime(k));
    
                                                                                        // for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                        //     var posKeyframeY = explodedTextLayerPosYAfter.keyValue(k);
    
                                                                                        //     var keyframe = {};
    
                                                                                        //     var spaceIncrease;
                                                                                        //     var spaceDecrease;
                                                                                        //     var spacingAtTime = 0;
                                                                                        //     if (layer.text.lineSpacingOffset[0].value > layer.text.lineSpacingOffset[1].value) {
                                                                                        //         spaceIncrease = false;
                                                                                        //         spaceDecrease = true;
                                                                                        //         // spacingAtTime = (lineSpacingOffsetProp[0].keyValue(1) * 0.6);
                                                                                        //     }
                                                                                        //     else if (layer.text.lineSpacingOffset[0].value < layer.text.lineSpacingOffset[1].value) {
                                                                                        //         spaceIncrease = true;
                                                                                        //         spaceDecrease = false;
                                                                                        //         // spacingAtTime = lineSpacingOffsetProp[0].keyValue(lineSpacingOffsetProp[0].numKeys) * 0.7;
                                                                                        //     }
    
                                                                                        //     // alert("spacingAtTime: " + spacingAtTime);
                                                                                        //     keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        //     keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
    
                                                                                        //     // increased spacing
                                                                                        //     if (letter > explodedTextMiddle && spaceIncrease == true) { // if it's to the right from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY + spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter < explodedTextMiddle && spaceIncrease == true) { // if it's to the left from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY - spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     } // decreased spacing
                                                                                        //     else if (letter > explodedTextMiddle && spaceDecrease == true) { // if it's to the right from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY - spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter < explodedTextMiddle && spaceDecrease == true) {  // if it's to the left from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY + spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else {
                                                                                        //         continue;
                                                                                        //     }
                                                                                        // }
                                                                                    }
                                                                                    else if (lineSpacingOffsetKeyframed.length == 0) {
                                                                                        currentCompResolution = [4, 4];
                                                                                        explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        currentCompResolution = [4, 4];
                                                                                        explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    if (lineSpacingOffsetKeyframed[0] == false) {
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            // alert("y time: " + explodedTextLayerPosYAfter.keyTime(k));
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                    else if (lineSpacingOffsetKeyframed[0] == true) {
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            // alert("y time: " + explodedTextLayerPosYAfter.keyTime(k));
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
    
                                                                                        // // not finished...
    
                                                                                        // var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        // for (var k = 1; k <= lineSpacingOffsetProp[0].numKeys; k++)
                                                                                        //     explodedTextLayerPosYAfter.addKey(lineSpacingOffsetProp[0].keyTime(k));
                                                                                        // for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++)
                                                                                        //     lineSpacingOffsetProp[0].addKey(explodedTextLayerPosYAfter.keyTime(k));
    
                                                                                        // for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                        //     var posKeyframeY = explodedTextLayerPosYAfter.keyValue(k);
    
                                                                                        //     var keyframe = {};
    
                                                                                        //     var spaceIncrease;
                                                                                        //     var spaceDecrease;
                                                                                        //     var spacingAtTime;
                                                                                        //     if (layer.text.lineSpacingOffset[0].value > layer.text.lineSpacingOffset[1].value) {
                                                                                        //         spaceIncrease = false;
                                                                                        //         spaceDecrease = true;
                                                                                        //         spacingAtTime = (lineSpacingOffsetProp[0].keyValue(1) * 0.09);
                                                                                        //     }
                                                                                        //     else if (layer.text.lineSpacingOffset[0].value < layer.text.lineSpacingOffset[1].value) {
                                                                                        //         spaceIncrease = true;
                                                                                        //         spaceDecrease = false;
                                                                                        //         spacingAtTime = lineSpacingOffsetProp[0].keyValue(lineSpacingOffsetProp[0].numKeys) * 0.09;
                                                                                        //     }
    
                                                                                        //     // alert("spacingAtTime: " + spacingAtTime);
                                                                                        //     keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                        //     keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
    
                                                                                        //     // increased spacing
                                                                                        //     if (letter > explodedTextMiddle && spaceIncrease == true) { // if it's to the right from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY + spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter < explodedTextMiddle && spaceIncrease == true) { // if it's to the left from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY - spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     } // decreased spacing
                                                                                        //     else if (letter > explodedTextMiddle && spaceDecrease == true) { // if it's to the right from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY - spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter < explodedTextMiddle && spaceDecrease == true) {  // if it's to the left from centre
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY + spacingAtTime);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else if (letter == explodedTextMiddle && spaceDecrease == true) { // if it's in the middle
                                                                                        //         explodedTextLayerPosYAfter.setValueAtKey(k, posKeyframeY);
    
                                                                                        //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                        //         if (round(explodedTextLayerPosYAfter.keyValue(2)) != round(explodedTextLayerPosYAfter.keyValue(1))) et.transform.position.y.push(keyframe);
                                                                                        //         continue;
                                                                                        //     }
                                                                                        //     else {
                                                                                        //         continue;
                                                                                        //     }
                                                                                        // }
                                                                                    }
                                                                                    else if (lineSpacingOffsetKeyframed.length == 0) {
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            // alert("y time: " + explodedTextLayerPosYAfter.keyTime(k));
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            // alert("y time: " + explodedTextLayerPosYAfter.keyTime(k));
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            else if (propPosY.numKeys === 0) {
                                                                                if (layer.transform.isRotating == true) {
                                                                                    if (propPosX.numKeys === 0) {
                                                                                        if (lineSpacingOffsetKeyframed[0] == false) {
                                                                                            var explodedTextLayerPosY = explodedTextLayer.property("Transform").property("Y Position");
    
                                                                                            for (var k = 1; k <= explodedTextLayerPosY.numKeys; k++) {
                                                                                                var keyframe = {};
                                                                                                // alert("y time: " + explodedTextLayerPosY.keyTime(k));
                                                                                                keyframe.time = milliseconds(explodedTextLayerPosY.keyTime(k) + currentComp.displayStartTime);
                                                                                                keyframe.value = round(explodedTextLayerPosY.keyValue(k), 2);
                                                                                                keyframe.easing = easingType(explodedTextLayerPosY, k);
                                                                                                et.transform.position.y.push(keyframe);
                                                                                            }
                                                                                        }
                                                                                        else if (lineSpacingOffsetKeyframed[0] == true) {
                                                                                            var explodedTextLayerPosY = explodedTextLayer.property("Transform").property("Y Position");
    
                                                                                            for (var k = 1; k <= explodedTextLayerPosY.numKeys; k++) {
                                                                                                var keyframe = {};
                                                                                                // alert("y time: " + explodedTextLayerPosY.keyTime(k));
                                                                                                keyframe.time = milliseconds(explodedTextLayerPosY.keyTime(k) + currentComp.displayStartTime);
                                                                                                keyframe.value = round(explodedTextLayerPosY.keyValue(k), 2);
                                                                                                keyframe.easing = easingType(explodedTextLayerPosY, k);
                                                                                                et.transform.position.y.push(keyframe);
                                                                                            }
    
                                                                                            // // not finished...
    
                                                                                            // currentCompResolution = [4, 4];
                                                                                            // explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                            // var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                            // var offset1 = 1.0;
                                                                                            // var offset2 = 1.0;
                                                                                            // for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            //     var keyframe = {};
                                                                                            //     keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
    
                                                                                            //     var spaceIncrease;
                                                                                            //     var spaceDecrease;
                                                                                            //     var spacingAtTime;
                                                                                            //     if (layer.text.lineSpacingOffset[0].value > layer.text.lineSpacingOffset[1].value) {
                                                                                            //         spaceIncrease = false;
                                                                                            //         spaceDecrease = true;
                                                                                            //     }
                                                                                            //     else if (layer.text.lineSpacingOffset[0].value < layer.text.lineSpacingOffset[1].value) {
                                                                                            //         spaceIncrease = true;
                                                                                            //         spaceDecrease = false;
                                                                                            //     }
    
                                                                                            //     if (k > explodedTextLayerPosYAfter.numKeys - (explodedTextLayerPosYAfter.numKeys / 2)) {
                                                                                            //         offset1 += 3;
                                                                                            //         offset2 +- 3;
                                                                                            //         // increasing
                                                                                            //         if (letter < explodedTextMiddle && spaceIncrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k) + offset2, 2);
                                                                                            //         if (letter > explodedTextMiddle && spaceIncrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k) * 1.04 + offset1, 2);
                                                                                            //         if (letter == explodedTextMiddle && spaceIncrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            //         // decreasing
                                                                                            //         if (letter < explodedTextMiddle && spaceDecrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k) + offset1, 2);
                                                                                            //         if (letter > explodedTextMiddle && spaceDecrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k) * 0.96 + offset2, 2);
                                                                                            //         if (letter == explodedTextMiddle && spaceDecrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            //     }
                                                                                            //     else {
                                                                                            //         // increasing
                                                                                            //         if (letter > explodedTextMiddle && spaceIncrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k) * 1.04, 2);
                                                                                            //         // decreasing
                                                                                            //         else if (letter > explodedTextMiddle && spaceDecrease == true)
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k) * 0.96, 2);
                                                                                            //         else
                                                                                            //         keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                            //     }
    
                                                                                            // keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            //     et.transform.position.y.push(keyframe);
                                                                                            // }
                                                                                        }
                                                                                        else if (lineSpacingOffsetKeyframed.length == 0) {
                                                                                            currentCompResolution = [4, 4];
                                                                                            explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                            var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                            for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                                var keyframe = {};
                                                                                                keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                                keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                                keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                                et.transform.position.y.push(keyframe);
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            currentCompResolution = [4, 4];
                                                                                            explodedTextLayerNew = getChildPosition(explodedTextLayer, currentCompLayer, layer.transform.isRotating, layerHasParent);
                                                                                            var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                            for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                                var keyframe = {};
                                                                                                keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                                keyframe.value = round(explodedTextLayerPosYAfter.keyValue(k), 2);
                                                                                                keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                                et.transform.position.y.push(keyframe);
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        var explodedTextLayerPosYAfter = explodedTextLayerNew.property("Transform").property("Y Position");
    
                                                                                        for (var k = 1; k <= explodedTextLayerPosYAfter.numKeys; k++) {
                                                                                            var keyframe = {};
                                                                                            explodedTextLayer.parent = null;
                                                                                            keyframe.time = milliseconds(explodedTextLayerPosYAfter.keyTime(k) + currentComp.displayStartTime);
                                                                                            keyframe.value = round(explodedTextLayerPosYAfter.valueAtTime(explodedTextLayerPosYAfter.setValueAtKey(k), false), 2);
                                                                                            keyframe.easing = easingType(explodedTextLayerPosYAfter, k);
                                                                                            et.transform.position.y.push(keyframe);
                                                                                        }
                                                                                    }
                                                                                }
                                                                                else if (layer.transform.isRotating == false) {
                                                                                    var keyframe = {};
                                                                                    explodedTextLayer.parent = null;
                                                                                    keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                                    keyframe.value = round(explodedTextLayer.transform("Y Position").valueAtTime(layer.startTime, false), 2);
                                                                                    keyframe.easing = "None";
                                                                                    et.transform.position.y.push(keyframe);
                                                                                }
                                                                            }
    
                                                                            // scale x,y
                                                                            updateLayerSteps(8.8, currentComp.layer(la).name, "Exporting character scale keyframes...");
                                                                            et.transform.scale.x = [];
                                                                            et.transform.scale.y = [];
                                                                            if (explodedTextLayer.scale.numKeys !== 0) {
                                                                                // et.transform.scale.keyframed = true;
                                                                                for (var k = 1; k <= explodedTextLayer.scale.numKeys; k++) {
                                                                                    var keyframeX = {};
                                                                                    var keyframeY = {};
    
                                                                                    var scaleTime = milliseconds(explodedTextLayer.scale.keyTime(k) + currentComp.displayStartTime);
                                                                                    var scaleValues = explodedTextLayer.scale.keyValue(k) / 100;
    
                                                                                    keyframeX.time = scaleTime;
                                                                                    keyframeX.value = round(scaleValues[0], 2);
                                                                                    keyframeX.easing = easingType(explodedTextLayer.scale, k);
                                                                                    et.transform.scale.x.push(keyframeX);
    
                                                                                    keyframeY.time = scaleTime;
                                                                                    keyframeY.value = round(scaleValues[1], 2);
                                                                                    keyframeY.easing = easingType(explodedTextLayer.scale, k);
                                                                                    et.transform.scale.y.push(keyframeY);
                                                                                }
                                                                            }
                                                                            else if (explodedTextLayer.scale.numKeys === 0) {
                                                                                // et.transform.scale.keyframed = false;
                                                                                var keyframeX = {};
                                                                                var keyframeY = {};
    
                                                                                keyframeX.time = layer.startTime + currentComp.displayStartTime;
                                                                                keyframeX.value = round(explodedTextLayer.scale.value[0] / 100, 2);
                                                                                keyframeX.easing = "None";
                                                                                et.transform.scale.x.push(keyframeX);
    
                                                                                keyframeY.time = layer.startTime + currentComp.displayStartTime;
                                                                                keyframeY.value = round(explodedTextLayer.scale.value[1] / 100, 2);
                                                                                keyframeY.easing = "None";
                                                                                et.transform.scale.y.push(keyframeY);
                                                                            }
    
                                                                            // rotation degrees
                                                                            updateLayerSteps(8.9, currentComp.layer(la).name, "Exporting character rotation keyframes...");
                                                                            if (explodedTextLayer.rotation.numKeys !== 0) {
                                                                                for (var k = 1; k <= explodedTextLayer.rotation.numKeys; k++) {
                                                                                    var keyframe = {};
                                                                                    keyframe.time = milliseconds(explodedTextLayer.rotation.keyTime(k) + currentComp.displayStartTime);
                                                                                    keyframe.value = explodedTextLayer.rotation.keyValue(k);
                                                                                    keyframe.easing = easingType(explodedTextLayer.rotation, k);
                                                                                    et.transform.rotation.push(keyframe);
                                                                                }
                                                                            }
                                                                            else if (explodedTextLayer.rotation.numKeys === 0) {
                                                                                var keyframe = {};
                                                                                keyframe.time = layer.startTime + currentComp.displayStartTime;
                                                                                keyframe.value = explodedTextLayer.rotation.value;
                                                                                keyframe.easing = "None";
                                                                                et.transform.rotation.push(keyframe);
                                                                            }
                                                                        }
                                                                        layer.text.characters.push(et);
                                                                        // if (letter == 2) alert(asdfsafas);
                                                                        explodedTextLayer.remove();
                                                                        if (letter == sourceText.text.length)
                                                                            alert("AeToOsb alert: Composition data has been created.");
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        updateLayerSteps(9, currentComp.layer(la).name, "Cleaning up keyframes...");
                                        app.beginUndoGroup("Export Cleanup: " + currentCompLayer.name);
                                        if (holdKeyInfoPosX.length != 0)
                                            prop.removeKey(holdKeyInfoPosX[0]);
                                        if (holdKeyInfoPosY.length != 0)
                                            prop.removeKey(holdKeyInfoPosY[0]);
                                        if (holdKeyInfoScale.length != 0)
                                            prop.removeKey(holdKeyInfoScale[0]);
                                        if (holdKeyInfoRotation.length != 0)
                                            prop.removeKey(holdKeyInfoRotation[0]);
    
                                        if (wasSelected == false)
                                            currentCompLayer.selected = false;
                                        currentComp.time = currentCompTime;
                                        currentCompResolution = currentComp.resolutionFactor;
                                        app.endUndoGroup();
                                    }
                                }
                                else if (currentCompLayer.enabled !== true && layerType !== "NullLayer") {
                                    updateLayerSteps(9, currentComp.layer(la).name, "Layer is not enabled...");
                                    layer.visible = currentCompLayer.enabled;
                                }
                                updateLayerSteps(9.5, currentComp.layer(la).name, "Preparing to push layer data...");
                                function previouslySelected() {
                                    if (currentCompLayer.selected == false) {
                                        currentCompLayer.selected = true;
                                        wasSelected = false;

                                    }
                                    else if (currentCompLayer.selected == true) {
                                        currentCompLayer.selected = false;
                                        currentCompLayer.selected = true;
                                        wasSelected = true;
                                    }
                                }
                                
                                composition.layers.push(layer);
                                updateLayerSteps(10, currentComp.layer(la).name, "Layer data has been pushed!");

                                if (dimensionAlreadySeparated == false)
                                    currentCompLayer.property("Transform").property("Position").dimensionsSeparated = false;
                                if (parentDimensionAlreadySeparated == false)
                                    parentLayerData.property("Transform").property("Position").dimensionsSeparated = false;

                                function layerDuration() {
                                    var duration = milliseconds(layerEnd(selectedComps[I], currentCompLayer.outPoint)) - milliseconds(layerStart(selectedComps[I], currentCompLayer.inPoint));
                                    return duration;
                                }
                            }

                            compItems.push(composition)
                            // alert("currentCompLayer.parent: " + currentCompLayer.parent);
                        }
                        scriptSettings = readSettings();
                        if (aLayerHasParent || scriptSettings.exportTextPerLetter == true)
                            if (exportProgress instanceof Window) exportProgress.close();
                            else exportProgress.close();
                    }
                }

                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                }


                function rgbColor(color) {
                    var r, g, b;
                    var strokeColorFill = [];

                    r = 255 * color[0];
                    g = 255 * color[1];
                    b = 255 * color[2];
                    if (r == Infinity) r = 0; if (g == Infinity) g = 0; if (b == Infinity) b = 0;

                    strokeColorFill.push(round(r, 1));
                    strokeColorFill.push(round(g, 1));
                    strokeColorFill.push(round(b, 1));

                    return rgbToHex(strokeColorFill[0], strokeColorFill[1], strokeColorFill[2]);
                }

                // function containsObject(obj, list) {
                //     var x;
                //     for (x in list) {
                //         if (list.hasOwnProperty(x) && list[x] === obj) {
                //             return true;
                //         }
                //     }
                //     return false;
                // }

                if (!checkUnsupportedLayers()) selectedCompList_array = compSelectionNames;
                if (selectedCompList_array == "")
                    selectedCompList_array = ["Please select a composition."];

                var selectedCompList = selectedCompsDialog.add("listbox", undefined, undefined, { name: "selectedCompList", items: selectedCompList_array, multiselect: true });
                selectedCompList.enabled = true;
                selectedCompList.preferredSize.width = 195;
                selectedCompList.alignment = ["center", "top"];

                // BUTTONGROUP
                // ===========
                var buttonGroup = selectedCompsDialog.add("group", undefined, { name: "buttonGroup" });
                buttonGroup.orientation = "row";
                buttonGroup.alignChildren = ["center", "center"];
                buttonGroup.spacing = 10;
                buttonGroup.margins = 0;
                buttonGroup.alignment = ["center", "top"];

                var confirmSelection = buttonGroup.add("button", undefined, undefined, { name: "confirmSelection" });
                confirmSelection.helpTip = "Start exporting these comps.";
                confirmSelection.text = "Export";

                var cancelSelection = buttonGroup.add("button", undefined, undefined, { name: "cancelSelection" });
                cancelSelection.helpTip = "Cancel operation.";
                cancelSelection.text = "Cancel";

                if (selectedCompList_array[0] == "Please select a composition.") {
                    alert("AeToOsb error: Please select at least one composition.");
                    scriptSettings = readSettings();
                    scriptSettings.exportedComps = null;
                    scriptSettings.exportedCompNames = null;
                    writeSettings(scriptSettings);
                }

                if (selectedCompList_array[0] !== "Please select a composition.") {
                    scriptSettings = readSettings();
                    scriptSettings.exportedComps = compSelectionNames;
                    scriptSettings.exportedCompNames = selectedCompsID;
                    writeSettings(scriptSettings);
                    if (parentsInComp) alert("AeToOsb alert: Your composition(s) are ready to be parsed.");

                    confirmSelection.onClick = function () {
                        if (selectedCompList_array[0] === "Please reselect.") {
                            alert("AeToOsb error: Cannot export selected compositions.");
                        }
                        else if (selectedCompList_array[0] !== "Please reselect.") {
                            scriptSettings = readSettings();

                            /////////////////////////////////////////
                            ////////////// CREATE JSON //////////////
                            /////////////////////////////////////////

                            if (!checkUnsupportedLayers()) {
                                markerWarning(markerStatement, layerDATA);

                                backupProject();
                                writeOutput(compItems);
                                delete scriptSettings.progressBarValue;
                                delete scriptSettings.progressBarStatus;
                                writeSettings(scriptSettings);
                                if (selectedCompsDialog instanceof Window) selectedCompsDialog.close();
                                alert("Exported .json to: " + "\r\n" + "\r\n" + scriptSettings.outputFolderPath + "\\AeToOsb.json");
                            }
                            if (checkUnsupportedLayers()) {
                                alert("AeToOsb error: Found unsupported layers in the selected comp(s). Please perform 'Render and import' or remove the unsupported layers.");
                            }
                        }
                    }

                    cancelSelection.onClick = function () {
                        if (selectedCompsDialog instanceof Window) selectedCompsDialog.close();
                        // selectedCompsDialog.close();
                    }
                }

                /////////////////////////////////////////
                ////////////// CHECK COMPS //////////////
                /////////////////////////////////////////

                function checkUnsupportedLayers() {
                    var compNames = [];
                    if (scriptSettings.exportedCompNames !== null) {
                        compNames = scriptSettings.exportedCompNames;

                        // alert(compNames.length);
                        for (var I = 1; I <= app.project.numItems; I++) {
                            for (var c = 0; c <= compNames.length; c++) {
                                for (var l = 1; l <= app.project.item(I).numLayers; l++) {
                                    if ((compNames[c] == app.project.item(I).name)) {
                                        var visibility = app.project.item(I).layer(l).enabled;
                                        var layerType = layerTypeSplit(getLayerType(app.project.item(I).layer(l)));

                                        if (layerType.match(/^(Composition|Adjustment|Light|Placeholder|Video|3D|Vector|Script|JSON|mgJSON|CSV|TXT)$/)) {
                                            if (visibility == true) {
                                                return true;
                                            }
                                            else if (visibility == false) {
                                                return false;
                                            }
                                        }
                                        else if (layerType.match(/^(Image|Text|Audio|Null|Solid|Camera|Sequence|Shape)$/)) {
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (selectedCompList_array[0] !== "Please select a composition.") {
                    if (selectedCompsDialog instanceof Window) selectedCompsDialog.show();
                    // selectedCompsDialog.show();
                }
            }

            function round(value, precision) {
                var multiplier = Math.pow(10, precision || 0);
                return Math.round(value * multiplier) / multiplier;
            }

            function milliseconds(num) {
                return round(num * 1000, 0);
            }

            function layerStart(Comp, layerStartTime) {
                var start = Comp.workAreaStart;
                if (layerStartTime < start)
                    return start;
                else if (layerStartTime >= start)
                    return layerStartTime;

            }
            function layerEnd(Comp, layerEndTime) {
                var end = Comp.workAreaStart + Comp.workAreaDuration;
                if (layerEndTime <= end)
                    return layerEndTime;
                else if (layerEndTime > end)
                    return end;
            }

            utilTextLetterButton.onClick = function () {
                textSplitting("characters");
            }
            utilTextWordButton.onClick = function () {
                textSplitting("words");
            }
            utilTextLineButton.onClick = function () {
                textSplitting("lines");
            }

            function keyframeSmoother(keyTimesBefore, frameRate, prop) {
                if (prop.numKeys > 1) {
                    var threshold = 2;
                    alert(frameRate);
                    frameRate = frameRate / 60;
                    alert(frameRate);

                    for (var k = 1; k <= prop.numKeys; k++) {
                        var nextKey = k;
                        var prevKey = k;
                        var keyValue = 0;
                        var keyValueNext = 0;
                        var keyValuePrev = 0;
                        // var keyTime = prop.keyTime(k);
                        if (k > 1 && k < prop.numKeys) {
                            if (prop.name == "Scale") {
                                threshold = threshold / 10;
                                try {
                                    nextKey = k + 1;
                                    prevKey = k - 1;
                                    keyValue = prop.keyValue(k)[0];
                                    keyValueY = prop.keyValue(k)[1];
                                    keyValueNext = prop.keyValue(nextKey)[0];
                                    keyValuePrev = prop.keyValue(prevKey)[0];
                                    var keyValueNextY = prop.keyValue(nextKey)[1];
                                    var keyValuePrevY = prop.keyValue(prevKey)[1];
                                    var vX = Math.abs(keyValue - keyValueNext);
                                    var vY = Math.abs(keyValueY - keyValueNextY);
                                    var vX2 = Math.abs(keyValue - keyValuePrev);
                                    var vY2 = Math.abs(keyValueY - keyValuePrevY);

                                    if (vX <= threshold && vY <= threshold) {
                                        if (vX2 <= threshold && vY2 <= threshold && k > 2)
                                            prop.removeKey(k);
                                        if (k < prop.numKeys - 1)
                                            prop.removeKey(nextKey);
                                        if (vX <= (threshold * 2) && vY <= (threshold * 2)) {
                                            for (var k2 = 1; k2 <= prop.numKeys; k2++) {
                                                var nextKey2 = k2 + 1;

                                                for (var kPrev = 1; kPrev <= keyTimesBefore.length; kPrev++) {
                                                    var deltaTime = Math.abs((prop.keyTime(k2) + frameRate) - (prop.keyTime(k2) - frameRate));
                                                    var deltaTime2 = Math.abs((prop.keyTime(nextKey2) + frameRate) - (prop.keyTime(nextKey2) - frameRate));
                                                    var deltaTime3 = Math.abs(keyTimesBefore[kPrev] + frameRate - keyTimesBefore[kPrev] - frameRate);

                                                    if (deltaTime != deltaTime3)
                                                        prop.removeKey(k2);
                                                    if (deltaTime2 != deltaTime3)
                                                        prop.removeKey(nextKey2);

                                                    if (deltaTime != deltaTime3)
                                                        prop.removeKey(k2);
                                                    if (deltaTime2 != deltaTime3)
                                                        prop.removeKey(nextKey2);
                                                }

                                                if (vX2 <= (threshold * 3) && vY2 <= (threshold * 3)) {
                                                    for (var k3 = 1; k3 <= prop.numKeys; k3++) {
                                                        var nextKey3 = k3 + 1;

                                                        for (var kPrev = 1; kPrev <= keyTimesBefore.length; kPrev++) {
                                                            var deltaTime = Math.abs((prop.keyTime(k3) + frameRate) - (prop.keyTime(k3) - frameRate));
                                                            var deltaTime2 = Math.abs((prop.keyTime(nextKey3) + frameRate) - (prop.keyTime(nextKey3) - frameRate));
                                                            var deltaTime3 = Math.abs(keyTimesBefore[kPrev] + frameRate - keyTimesBefore[kPrev] - frameRate);

                                                            if (deltaTime != deltaTime3)
                                                                prop.removeKey(k3);
                                                            if (deltaTime2 != deltaTime3)
                                                                prop.removeKey(nextKey3);

                                                            if (deltaTime != deltaTime3)
                                                                prop.removeKey(k3);
                                                            if (deltaTime2 != deltaTime3)
                                                                prop.removeKey(nextKey3);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else continue;
                                }
                                catch (e) {
                                    continue;
                                }
                            }
                        }
                    }
                    // var angle = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[0] - verticesY[1]), (verticesX[0] - verticesX[1])) - Math.PI / 2);
                    // var angle2 = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[1] - verticesY[2]), (verticesX[1] - verticesX[2])) - Math.PI / 2);
                    // var deltaA = Math.Abs(angle2 - angle);
                }
                else alert("Cannot remove unnecessary keyframes for the property " + prop.name + " because it doesn't have more than 1 keyframe.");
            }

            function removeUnnecessaryKeys(pos) {
                // only for position x & y combined
                var threshold = 5;
                for (var p = 0; p < pos.length; p++) {
                    for (var k = 1; k <= pos[p].numKeys; k++) {
                        var prevKey = k;
                        var nextKey = 0;

                        if (k > 1 && k < pos[p].numKeys - 1)
                            nextKey = k;
                        else if (k < pos[p].numKeys - 1)
                            nextKey = k + 1;


                        if (k < pos[p].numKeys - 1) {

                            var x1 = pos[0];
                            var y1 = pos[1];
                            var x2 = pos[0];
                            var y2 = pos[1];

                            convertToLinear(prevKey, nextKey);
                            var x1Index = x1.addKey(x1.keyTime(prevKey));
                            var y1Index = y1.addKey(y1.keyTime(prevKey));
                            var x2Index = x2.addKey(x2.keyTime(nextKey));
                            var y2Index = y2.addKey(y2.keyTime(nextKey));
                            convertToLinear(prevKey, nextKey);

                            var valueX = pos[p].keyValue(x1Index);
                            var valueY = pos[p].keyValue(y1Index);
                            var valueNextX = pos[p].keyValue(x2Index);
                            var valueNextY = pos[p].keyValue(y2Index);

                            var angle = Math.atan2((valueY - valueNextY), (valueX - valueNextX)) - Math.PI / 2;
                            if (angle < 0) angle = angle + (Math.abs(angle) * 2);

                            if (k > 1 && k < pos[p].numKeys - 1 && angle < threshold) {

                                pos[p].removeKey(nextKey);
                                pos[p].removeKey(prevKey);
                            }
                            else if (k > 1 && k < pos[p].numKeys - 1 && angle >= threshold) {
                                continue;
                            }
                        }
                    }
                }
                function convertToLinear(k1, k2) {
                    pos[0].setInterpolationTypeAtKey(k1, KeyframeInterpolationType.LINEAR);
                    pos[0].setInterpolationTypeAtKey(k2, KeyframeInterpolationType.LINEAR);
                    pos[1].setInterpolationTypeAtKey(k1, KeyframeInterpolationType.LINEAR);
                    pos[1].setInterpolationTypeAtKey(k2, KeyframeInterpolationType.LINEAR);
                }
            }

            utilKeyframeGenerateButton.onClick = function () {
                scriptSettings = readSettings();

                if (app.project.activeItem instanceof CompItem) {
                    var props = [];
                    for (var l = 1; l <= app.project.activeItem.numLayers; l++) {
                        var layer = app.project.activeItem.layer(l);
                        var frameRate = layer.containingComp.frameRate;
                        var deselectAll = app.findMenuCommandId("Deselect All");
                        var convertToKeyframes = app.findMenuCommandId("Convert Expression to Keyframes");

                        var p = layer.property("Transform").property("Position");
                        var x = layer.property("Transform").property("X Position");
                        var y = layer.property("Transform").property("Y Position");
                        var s = layer.property("Transform").property("Scale");
                        var r = layer.property("Transform").property("Rotation");
                        var o = layer.property("Transform").property("Opacity");

                        if (app.project.activeItem.selectedLayers < 1 && l == 1) {
                            alert("AeToOsb error: Please select one or more layers to generate the desired keyframes for the selected properties.");
                        }
                        else {
                            if (l == 1) app.beginUndoGroup("Keyframe Helper - Generate Keyframes");

                            var alreadySeparated = false;
                            var interval = Math.floor(scriptSettings.keyframeHelper.interval) / 1000;

                            if (interval > layerEnd(app.project.activeItem, layer.outPoint) && l == 1) {
                                alert("AeToOsb error: " + scriptSettings.keyframeHelper.interval + " ms exceeds the composition duration, please reduce the number so it's under " + (app.project.activeItem.duration * 1000) + ".");
                            }
                            else if (interval <= layerEnd(app.project.activeItem, layer.outPoint)) {
                                if (layer.selected == true) {
                                    for (var t = layerStart(app.project.activeItem, layer.inPoint); t <= layerEnd(app.project.activeItem, layer.outPoint); t += interval) {
                                        if (scriptSettings.keyframeHelper.xPosition == true) {
                                            if (p.dimensionsSeparated == true) alreadySeparated = true;
                                            if (alreadySeparated != true) p.dimensionsSeparated == true;
                                            x.addKey(t);

                                            if (t == layerStart(app.project.activeItem, layer.inPoint))
                                                props.push(x);
                                        }
                                        if (scriptSettings.keyframeHelper.yPosition == true) {
                                            if (p.dimensionsSeparated == true) alreadySeparated = true;
                                            if (alreadySeparated != true) p.dimensionsSeparated == true;
                                            y.addKey(t);

                                            if (t == layerStart(app.project.activeItem, layer.inPoint))
                                                props.push(y);
                                        }
                                        if (scriptSettings.keyframeHelper.scale == true) {
                                            if (s.dimensionsSeparated == true) alreadySeparated = true;
                                            if (alreadySeparated != true) s.dimensionsSeparated == true;
                                            s.addKey(t);
                                        }
                                        if (scriptSettings.keyframeHelper.rotation == true) {
                                            if (r.dimensionsSeparated == true) alreadySeparated = true;
                                            if (alreadySeparated != true) r.dimensionsSeparated == true;
                                            r.addKey(t);
                                        }
                                        if (scriptSettings.keyframeHelper.opacity == true) {
                                            if (o.dimensionsSeparated == true) alreadySeparated = true;
                                            if (alreadySeparated != true) o.dimensionsSeparated == true;
                                            o.addKey(t);
                                        }
                                    }
                                    // if (scriptSettings.keyframeHelper.scale == true) {
                                    //     if (s.dimensionsSeparated == true) alreadySeparated = true;
                                    //     if (alreadySeparated != true) s.dimensionsSeparated == true;
                                    //     if (s.canSetExpression == true) {
                                    //         var keyTimesBefore = [];
                                    //         for (var key = 1; key <= s.numKeys; key++)
                                    //             keyTimesBefore.push(s.keyTime(key));

                                    //         if (s.expression == '')
                                    //             s.expression = 'transform.scale';
                                    //         app.executeCommand(deselectAll);
                                    //         s.selected = true;
                                    //         app.executeCommand(convertToKeyframes);
                                    //         keyframeSmoother(keyTimesBefore, frameRate, s);
                                    //     }
                                    //     else alert("AeToOsb error: Cannot set expression for the property: " + s.name + ".");
                                    // }
                                }
                            }
                            if (l == app.project.activeItem.numLayers) app.endUndoGroup();
                        }
                    }
                    if (scriptSettings.keyframeHelper.optimizeKeyframesBasedOnMotion == true) {
                        if (props.length == 2) {
                            app.beginUndoGroup("Remove Unnecessary Keyframes");
                            removeUnnecessaryKeys(props);
                            app.endUndoGroup();
                        }
                    }
                }
            }
            
            // global utilities variables
            var utilLayerGroupNameInputText = "";
            var utilLayerLayeringDefaultTypesSelection = 0;
            var currentLoopStartTime = 0;
            var currentLoopEndTime = 0;
            var utilLoopStartInputText = "";
            var utilLoopEndInputText = "";
            var utilLoopTypesSelection = 0;
            var utilLoopLayerIsSequenceValue = false;
            var utilLoopStartInputTextValue = 0;
            var utilLoopEndInputTextValue = 0;

            utilLayerGroupNameInput.onChanging = function () {
                utilLayerGroupNameInputText = this.text;
                utilLayerGroupNameInput.text = utilLayerGroupNameInputText;
            }

            utilLayerGroupApplyButton.onClick = function () {
                app.beginUndoGroup("Layer Group Helper");
                if (utilLayerGroupNameInputText !== "") {
                    var currentLayer;
                    var currentComp = app.project.activeItem;
                    var markerText = new MarkerValue("g; " + utilLayerGroupNameInputText);
                    
                    if (currentComp instanceof CompItem) {
                        var currentTime = currentComp.time;
                        if (currentComp.selectedLayers != 0) {
                            var markerExists = false;
                            for (var l = 0; l < currentComp.selectedLayers.length; l++) {
                                currentLayer = currentComp.selectedLayers[l];
                                currentLayer.marker.setValueAtTime(currentTime, markerText);
                            }
                        }
                        else alert("AeToOsb WARNING: Please select at least one layer.");
                    }
                    else alert("AeToOsb WARNING: Please highlight a composition panel.");
                }
                else if (utilLayerGroupNameInputText == "") {
                    var currentLayer;
                    var markerExists = false;
                    var currentComp = app.project.activeItem;

                    if (currentComp instanceof CompItem) {
                        var currentTime = currentComp.time;
                        if (currentComp.selectedLayers != 0) {
                            for (var l = 0; l < currentComp.selectedLayers.length; l++) {
                                currentLayer = currentComp.selectedLayers[l];
                                // check if marker already exists
                                if (currentLayer.marker.numKeys != 0) {
                                    for (var m = 1; m <= currentLayer.marker.numKeys; m++) {
                                        if (currentLayer.marker.keyValue(m).comment.includes('g;')) {
                                            markerExists = true;
                                            currentLayer.marker.removeKey(m);
                                            break;
                                        }
                                    }
                                }
                            }
                            if (markerExists)
                                alert("AeToOsb WARNING: Layer Group marker(s) already exists and has now been deleted.");
                            else if (!markerExists)
                                alert("AeToOsb WARNING: Please type in a group name before applying.");
                        }
                        else alert("AeToOsb WARNING: Please select at least one layer.");
                    }
                    else alert("AeToOsb WARNING: Please highlight a composition panel.");
                }
                app.endUndoGroup();
            }

            function originsHelper(origin) {
                var currentLayer;
                var currentComp = app.project.activeItem;
                var markerText = new MarkerValue(origin);
                
                if (currentComp instanceof CompItem) {
                    var currentTime = currentComp.time;
                    if (currentComp.selectedLayers != 0) {
                        var markerExists = false;
                        for (var l = 0; l < currentComp.selectedLayers.length; l++) {
                            currentLayer = currentComp.selectedLayers[l];

                            // check if marker already exists
                            if (currentLayer.marker.numKeys != 0) {
                                for (var m = 1; m <= currentLayer.marker.numKeys; m++) {
                                    if (currentLayer.marker.keyValue(m).comment == origin) {
                                        markerExists = true;
                                        currentLayer.marker.removeKey(m);
                                        break;
                                    }
                                }
                            }
                            if (!markerExists)
                            currentLayer.marker.setValueAtTime(currentTime, markerText);
                        }
                        if (markerExists)
                            alert("AeToOsb WARNING: Origin marker(s) already exists and has now been deleted.");
                    }
                    else alert("AeToOsb WARNING: Please select at least one layer.");
                }
                else alert("AeToOsb WARNING: Please highlight a composition panel.");
            }

            utilLayerOriginTopLeft.onClick = function () {
                app.beginUndoGroup("Origins Helper: TopLeft");
                originsHelper("tl");
                app.endUndoGroup();
            }

            utilLayerOriginTopCentre.onClick = function () {
                app.beginUndoGroup("Origins Helper: TopCentre");
                originsHelper("tc");
                app.endUndoGroup();
            }

            utilLayerOriginTopRight.onClick = function () {
                app.beginUndoGroup("Origins Helper: TopRight");
                originsHelper("tr");
                app.endUndoGroup();
            }

            utilLayerOriginCentreLeft.onClick = function () {
                app.beginUndoGroup("Origins Helper: CentreLeft");
                originsHelper("cl");
                app.endUndoGroup();
            }

            utilLayerOriginCentre.onClick = function () {
                app.beginUndoGroup("Origins Helper: Centre");
                originsHelper("c");
                app.endUndoGroup();
            }

            utilLayerOriginCentreRight.onClick = function () {
                app.beginUndoGroup("Origins Helper: CentreRight");
                originsHelper("cr");
                app.endUndoGroup();
            }

            utilLayerOriginBottomLeft.onClick = function () {
                app.beginUndoGroup("Origins Helper: BottomLeft");
                originsHelper("bl");
                app.endUndoGroup();
            }

            utilLayerOriginBottomCentre.onClick = function () {
                app.beginUndoGroup("Origins Helper: BottomCentre");
                originsHelper("bc");
                app.endUndoGroup();
            }

            utilLayerOriginBottomRight.onClick = function () {
                app.beginUndoGroup("Origins Helper: BottomRight");
                originsHelper("br");
                app.endUndoGroup();
            }
            
            utilLayerLayeringDefaultTypes.onChange = function () {
                utilLayerLayeringDefaultTypesSelection = this.selection.index;
            }

            utilLayerLayeringApplyButton.onClick = function () {
                app.beginUndoGroup("Layering Helper");
                var markerText;
                var currentLayer;
                var currentComp = app.project.activeItem;

                if (utilLayerLayeringDefaultTypesSelection == 0)
                    markerText = new MarkerValue("bg");
                else if (utilLayerLayeringDefaultTypesSelection == 1)
                    markerText = new MarkerValue("fg");
                else if (utilLayerLayeringDefaultTypesSelection == 2)
                    markerText = new MarkerValue("o");
                else if (utilLayerLayeringDefaultTypesSelection == 4)
                    markerText = new MarkerValue("f");
                else if (utilLayerLayeringDefaultTypesSelection == 5)
                    markerText = new MarkerValue("p");
                
                if (currentComp instanceof CompItem) {
                    var currentTime = currentComp.time;
                    if (currentComp.selectedLayers != 0) {
                        var markerExists = false;
                        for (var l = 0; l < currentComp.selectedLayers.length; l++) {
                            currentLayer = currentComp.selectedLayers[l];

                            // check if marker already exists
                            if (currentLayer.marker.numKeys != 0) {
                                for (var m = 1; m <= currentLayer.marker.numKeys; m++) {
                                    if (currentLayer.marker.keyValue(m).comment == markerText.comment) {
                                        markerExists = true;
                                        currentLayer.marker.removeKey(m);
                                        break;
                                    }
                                }
                            }
                            if (!markerExists)
                            currentLayer.marker.setValueAtTime(currentTime, markerText);
                        }
                        if (markerExists)
                            alert("AeToOsb WARNING: Layering marker(s) already exists and has now been deleted.");
                    }
                    else alert("AeToOsb WARNING: Please select at least one layer.");
                }
                else alert("AeToOsb WARNING: Please highlight a composition panel.");
                app.endUndoGroup();
            }

            utilLoopStartInput.onChanging = function () {
                utilLoopStartInputText = this.text;
                utilLoopStartInput.text = utilLoopStartInputText;
            }

            utilLoopEndInput.onChanging = function () {
                utilLoopEndInputText = this.text;
                utilLoopEndInput.text = utilLoopEndInputText;
            }
            
            utilLoopTypes.onChange = function () {
                utilLoopTypesSelection = this.selection.index;
            }

            utilLoopLayerIsSequence.onClick = function () {
                function checkBox(value) {
                    utilLoopLayerIsSequenceValue = value;
                }
                utilLoopLayerIsSequence.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }
            
            utilLoopFrameButtonStart.onClick = function () {
                var currentFrame = 0;
                var currentComp = app.project.activeItem;
                var currentTime = currentComp.time;
                if (currentComp instanceof CompItem) {
                    // currentTime = round(milliseconds(currentComp.time), 0);
                    var currentTime = currentComp.time;
                    currentFrame = Math.ceil(currentTime * currentComp.frameRate);
                    currentLoopStartTime = Math.ceil(milliseconds(currentTime));
                    
                    utilLoopStartInputTextValue = currentFrame;
                    utilLoopStartInputText = currentFrame.toString();
                    utilLoopStartInput.text = currentFrame.toString();

                    if (utilLoopEndInputTextValue != 0 && utilLoopStartInputTextValue >= utilLoopEndInputTextValue) {
                        alert("AeToOsb WARNING: Start frame cannot be equal to, or greater than the End frame value.");
                        utilLoopStartInputText = "";
                        utilLoopStartInput.text = "";
                    }
                }
                else alert("AeToOsb WARNING: Please highlight a composition panel.");
            }
            
            utilLoopFrameButtonEnd.onClick = function () {
                var currentFrame = 0;
                var currentComp = app.project.activeItem;
                var currentTime = currentComp.time;
                if (currentComp instanceof CompItem) {
                    // currentTime = round(milliseconds(currentComp.time), 0);
                    var currentTime = currentComp.time;
                    currentFrame = Math.ceil(currentTime * currentComp.frameRate);
                    currentLoopEndTime = Math.ceil(milliseconds(currentTime));
                
                    utilLoopEndInputTextValue = currentFrame;
                    utilLoopEndInputText = currentFrame.toString();
                    utilLoopEndInput.text = currentFrame.toString();

                    if (utilLoopStartInputTextValue != 0 && utilLoopEndInputTextValue <= utilLoopStartInputTextValue) {
                        alert("AeToOsb WARNING: End frame cannot be equal to, or a less than the Start frame value.");
                        utilLoopEndInputText = "";
                        utilLoopEndInput.text = "";
                    }
                }
                else alert("AeToOsb WARNING: Please highlight a composition panel.");
            }

            utilLoopApplyButton.onClick = function () {
                app.beginUndoGroup("Loop Helper");
                var markerText;
                var currentLayer;
                var currentComp = app.project.activeItem;
                
                if (utilLoopTypesSelection == 0)
                    markerText = new MarkerValue("l;0;" + currentLoopStartTime.toString() + ";" + currentLoopEndTime.toString());
                else if (utilLoopTypesSelection == 1)
                    markerText = new MarkerValue("l;1;" + currentLoopStartTime.toString() + ";" + currentLoopEndTime.toString());

                if ((currentLoopStartTime.toString() == "0" && currentLoopEndTime.toString() == "0") || utilLoopLayerIsSequenceValue) {
                    if (utilLoopTypesSelection == 0)
                        markerText = new MarkerValue("lf");
                    else if (utilLoopTypesSelection == 1)
                        markerText = new MarkerValue("lo");
                }
                
                if (currentComp instanceof CompItem) {
                    var currentTime = currentComp.time;
                    if (currentComp.selectedLayers != 0) {
                        var markerExists = false;
                        for (var l = 0; l < currentComp.selectedLayers.length; l++) {
                            currentLayer = currentComp.selectedLayers[l];

                            // check if marker already exists
                            if (currentLayer.marker.numKeys != 0) {
                                for (var m = 1; m <= currentLayer.marker.numKeys; m++) {
                                    if (currentLayer.marker.keyValue(m).comment == "lf" || currentLayer.marker.keyValue(m).comment == "lo" || currentLayer.marker.keyValue(m).comment.includes('l;')) {
                                        markerExists = true;
                                        currentLayer.marker.removeKey(m);
                                        break;
                                    }
                                }
                            }
                            if (!markerExists)
                            currentLayer.marker.setValueAtTime(currentTime, markerText);
                        }
                        if (markerExists)
                            alert("AeToOsb WARNING: Loop marker(s) already exists and has now been deleted.");
                    }
                    else alert("AeToOsb WARNING: Please select at least one layer.");
                }
                else alert("AeToOsb WARNING: Please highlight a composition panel.");
                app.endUndoGroup();
            }

            utilKeyframeIntervalInput.onChanging = function () {
                var writtenText = this.text;
                utilKeyframeIntervalInput.text = writtenText;
                updateSettings('interval', writtenText);
            }

            utilKeyframeCheckbox1.onClick = function () {
                function checkBox(value) {
                    updateSettings('xPosition', value);
                }
                utilKeyframeCheckbox1.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            utilKeyframeCheckbox2.onClick = function () {
                function checkBox(value) {
                    updateSettings('yPosition', value);
                }
                utilKeyframeCheckbox2.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            utilKeyframeCheckbox3.onClick = function () {
                function checkBox(value) {
                    updateSettings('scale', value);
                }
                utilKeyframeCheckbox3.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            utilKeyframeCheckbox4.onClick = function () {
                function checkBox(value) {
                    updateSettings('rotation', value);
                }
                utilKeyframeCheckbox4.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            utilKeyframeCheckbox5.onClick = function () {
                function checkBox(value) {
                    updateSettings('opacity', value);
                }
                utilKeyframeCheckbox5.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            utilKeyframeCheckbox6.onClick = function () {
                function checkBox(value) {
                    updateSettings('optimizeKeyframesBasedOnMotion', value);
                }
                utilKeyframeCheckbox6.value == false
                    ? checkBox(false)
                    : checkBox(true);
            }

            function textSplitting(splitType) {
                var textLayer;
                var activeComp = app.project.activeItem;
                var textLayerFunc = findTextLayer();
                if (textLayerFunc instanceof TextLayer && textLayer.length == 1) {
                    textLayerFunc;
                }
                else if (!(textLayerFunc instanceof TextLayer) && textLayer.length == 1) {
                    alert("AeToOsb error: Only TextLayers are supported. Make sure the selected layer is a TextLayer.");
                }
                else {
                    textLayerFunc;
                }

                function findTextLayer() {
                    if (activeComp instanceof CompItem) {
                        textLayer = activeComp.selectedLayers;
                        if (textLayer.length < 1) {
                            return alert("AeToOsb error: Please select a TextLayer.");
                        }
                        else if (textLayer.length > 1) {
                            return alert("AeToOsb error: You can only split one TextLayer at a time.");
                        }
                        else {
                            for (var i = 0; textLayer.length; i++) {
                                if (textLayer.length == 1) {
                                    if (textLayer[i] instanceof TextLayer) {
                                        splitText(textLayer[i], splitType);
                                        return textLayer[i];
                                    }
                                    else if (!(textLayer[i] instanceof TextLayer)) {
                                        return textLayer[i];
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function markerWarning(statement, layer) {
                if (layer.enabled == true) {
                    if (statement[3] !== "Audio") {
                        if (statement[0] === null || statement[1] === null) {
                            if (statement[0] === null) {
                                // alert("AeToOsb error: The layer '" + layer.name + "' doesn't have any marker with an OsbOrigin value." + "\r\n" + "\r\n" + "Layer '" + layer.name + "' in composition '" + layer.containingComp.name + "'" + "\r\n" + "\r\n" + "To fix this; please add a marker on the layer. The comment should be one of the following origins:" + "\r\n" + "\r\n" + "TopLeft, TopCentre, TopRight, CentreLeft, Centre, CentreRight, BottomLeft, BottomCentre, BottomRight" + "\r\n" + "\r\n" + "Abbreviations:" + "\r\n" + "TL, TC, TR, CL, C, CR, BL, BC, BR");
                            }
                            if (statement[1] === null) {
                                alert("AeToOsb error: The layer '" + layer.name + "' doesn't have any marker with an OsbLayer value." + "\r\n" + "\r\n" + "Layer '" + layer.name + "' in composition '" + layer.containingComp.name + "'" + "\r\n" + "\r\n" + "To fix this; please add a marker on the layer. The comment should be one of the following layers:" + "\r\n" + "\r\n" + "Background, Fail, Pass, Foreground, Overlay, Sound" + "\r\n" + "\r\n" + "Abbreviations:" + "\r\n" + "BG, F, P, FG, O, S");
                            }
                            if (statement[3] == "Sequence") {
                                if (statement[2] === null) {
                                    alert("AeToOsb error: The layer '" + layer.name + "' doesn't have any marker with an OsbLoopType value." + "\r\n" + "\r\n" + "Layer '" + layer.name + "' in composition '" + layer.containingComp.name + "'" + "\r\n" + "\r\n" + "To fix this; please add a marker on the layer. The comment should be one of the following layers:" + "\r\n" + "\r\n" + "LoopOnce, LoopForever" + "\r\n" + "\r\n" + "Abbreviations:" + "\r\n" + "LO, LF, 1, 0");
                                }
                            }
                            alert(ujkdsfs);
                        }
                    }
                }
            }

            renderAndImport_iconbutton.onClick = function () {
                scriptSettings = readSettings();
                var jsonLocation = scriptSettings.outputFolderPath;

                if (jsonLocation !== "") {
                    openFileLocation(jsonLocation);
                }
                if (jsonLocation == "") {
                    alert("AeToOsb error: Output path is empty.");
                }
            }

            openFileLocation = function (fp) {
                system.callSystem("explorer " + fp);
            }

            function removeDuplicates(arr) {
                return arr.filter(function (item, index) {
                    return arr.indexOf(item) === index;
                });
            }

            function getChildPosition(layer, parentLayer, isRotating, hasParent) {
                scriptSettings = readSettings();
                var oldLayer = layer.duplicate();
                layer.parent = null;

                var parentLayerPropX; parentLayerPropX = parentLayer.property("Transform").property("X Position");
                var parentLayerPropY; parentLayerPropY = parentLayer.property("Transform").property("Y Position");

                if (hasParent == false) {
                    if (parentLayerPropX.numKeys != 0 || parentLayerPropY.numKeys != 0) {
                        // var parentLayerKeyTimesX = [];
                        // var parentLayerKeyTimesY = [];
                        // var parentLayerKeyValuesX = [];
                        // var parentLayerKeyValuesY = [];

                        // // parentLayer key times
                        // for (var k = 1; k <= parentLayerPropX.numKeys; k++)
                        //     parentLayerKeyTimesX.push(parentLayerPropX.keyTime(k));
                        // for (var k = 1; k <= parentLayerPropY.numKeys; k++)
                        //     parentLayerKeyTimesY.push(parentLayerPropY.keyTime(k));

                        // // parentLayer key values
                        // for (var k = 1; k <= parentLayerPropX.numKeys; k++)
                        //     parentLayerKeyValuesX.push(parentLayerPropX.keyValue(k));
                        // for (var k = 1; k <= parentLayerPropY.numKeys; k++)
                        //     parentLayerKeyValuesY.push(parentLayerPropY.keyValue(k));

                        layer.property("Transform").property("Position").dimensionsSeparated = false;
                        parentLayer.property("Transform").property("Position").dimensionsSeparated = false;

                        var parentLayerProp = parentLayer.property("Transform").property("Position");
                        var layerProp = layer.property("Transform").property("Position");

                        var positionValues = [];
                        var keyframeTimes = [];

                        for (var i = 1; i <= parentLayerProp.numKeys; i++) {
                            var prevTime = parentLayer.containingComp.time;

                            if (parentLayerProp.keyTime(i) <= start) {
                                oldLayer.containingComp.time = start;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(start, false);
                                keyframeTimes[keyframeTimes.length] = start;

                                tempLayer.remove();
                                parentLayer.containingComp.time = prevTime;
                            }
                            else if (parentLayerProp.keyTime(i) >= end) {
                                oldLayer.containingComp.time = end;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(end, false);
                                keyframeTimes[keyframeTimes.length] = end;

                                tempLayer.remove();
                                parentLayer.containingComp.time = prevTime;
                            }
                            else {
                                if (layerProp.numKeys != 0) {
                                    for (var j = 1; j <= layerProp.numKeys; j++) {
                                        oldLayer.containingComp.time = layerProp.keyTime(j);

                                        var tempLayer = oldLayer.duplicate();
                                        tempLayer.parent = null;

                                        positionValues[positionValues.length] = tempLayer.position.valueAtTime(j, false);
                                        keyframeTimes[keyframeTimes.length] = parentLayerProp.keyTime(i);

                                        tempLayer.remove();
                                        layerProp.containingComp.time = prevTime;
                                    }
                                }
                                else {
                                    parentLayer.containingComp.time = parentLayerProp.keyTime(i);

                                    var tempLayer = oldLayer.duplicate();
                                    tempLayer.parent = null;

                                    positionValues[positionValues.length] = tempLayer.position.valueAtTime(i, false);
                                    keyframeTimes[keyframeTimes.length] = parentLayerProp.keyTime(i);

                                    tempLayer.remove();
                                    parentLayer.containingComp.time = prevTime;
                                }
                            }
                        }

                        while (layer.position.numKeys > 0) layer.position.removeKey(layer.position.numKeys);
                        layer.position.setValuesAtTimes(keyframeTimes, positionValues);
                        layer.position.expressionEnabled = false;
                        removeDuplicateKeyframes(layer.property("Transform").property("Position"));

                        getChildRotation(layer, parentLayer, oldLayer, true);
                        getChildScale(layer, parentLayer, oldLayer, true);
                        oldLayer.remove();

                        layer.property("Transform").property("Position").dimensionsSeparated = true;
                        parentLayer.property("Transform").property("Position").dimensionsSeparated = true;

                        // // remove all parentLayer keys X
                        // var parentLayerPropAfterX = parentLayer.property("Transform").property("X Position");
                        // var parentLayerPropAfterY = parentLayer.property("Transform").property("Y Position");
                        // for (var k = 1; k <= (parentLayerPropAfterX.numKeys * 4); k++)
                        //     parentLayerPropAfterX.removeKey(1);
                        // for (var k = 1; k <= (parentLayerPropAfterY.numKeys * 4); k++)
                        //     parentLayerPropAfterY.removeKey(1);

                        // // create and apply parentLayer key times & values X
                        // for (var k = 0; k < parentLayerKeyTimesX.length; k++) {
                        //     var key = k + 1;
                        //     parentLayerPropAfterX.addKey(parentLayerKeyTimesX[k]);
                        //     parentLayerPropAfterX.setValueAtKey(key, parentLayerKeyValuesX[k]);
                        // }

                        // // create and apply parentLayer key times & values Y
                        // for (var k = 0; k < parentLayerKeyTimesY.length; k++) {
                        //     var key = k + 1;
                        //     parentLayerPropAfterY.addKey(parentLayerKeyTimesY[k]);
                        //     parentLayerPropAfterY.setValueAtKey(key, parentLayerKeyValuesY[k]);
                        // }
                        return layer;
                    }
                    else if ((parentLayerPropX.numKeys == 0 || parentLayerPropY.numKeys == 0) && isRotating == true) {
                        layer.property("Transform").property("Position").dimensionsSeparated = false;
                        var layerProp = layer.property("Transform").property("Position");

                        var positionValues = [];
                        var keyframeTimes = [];

                        var start = layerStart(layer.containingComp, layer.inPoint);
                        var end = layerEnd(layer.containingComp, layer.outPoint);

                        for (var i = 1; i <= layerProp.numKeys; i++) {
                            var prevTime = layer.containingComp.time;

                            if (layerProp.keyTime(i) <= start) {
                                oldLayer.containingComp.time = start;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(start, false);
                                keyframeTimes[keyframeTimes.length] = start;

                                tempLayer.remove();
                                layer.containingComp.time = prevTime;
                            }
                            else if (layerProp.keyTime(i) >= end) {
                                oldLayer.containingComp.time = end;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(end, false);
                                keyframeTimes[keyframeTimes.length] = end;

                                tempLayer.remove();
                                layer.containingComp.time = prevTime;
                            }
                            else {
                                if (layerProp.numKeys != 0) {
                                    for (var j = 1; j <= layerProp.numKeys; j++) {
                                        oldLayer.containingComp.time = layerProp.keyTime(j);

                                        var tempLayer = oldLayer.duplicate();
                                        tempLayer.parent = null;

                                        positionValues[positionValues.length] = tempLayer.position.valueAtTime(j, false);
                                        keyframeTimes[keyframeTimes.length] = layerProp.keyTime(i);

                                        tempLayer.remove();
                                        layerProp.containingComp.time = prevTime;
                                    }
                                }
                                else {
                                    layer.containingComp.time = layerProp.keyTime(i);

                                    var tempLayer = oldLayer.duplicate();
                                    tempLayer.parent = null;

                                    positionValues[positionValues.length] = tempLayer.position.valueAtTime(i, false);
                                    keyframeTimes[keyframeTimes.length] = layerProp.keyTime(i);

                                    tempLayer.remove();
                                    layer.containingComp.time = prevTime;
                                }
                            }
                        }

                        while (layer.position.numKeys > 0)
                            layer.position.removeKey(layer.position.numKeys);

                        layer.position.setValuesAtTimes(keyframeTimes, positionValues);
                        layer.position.expressionEnabled = false;
                        removeDuplicateKeyframes(layer.property("Transform").property("Position"));

                        getChildRotation(layer, parentLayer, oldLayer);
                        getChildScale(layer, parentLayer, oldLayer);
                        oldLayer.remove();

                        layer.property("Transform").property("Position").dimensionsSeparated = true;
                        return layer;
                    }
                    else if ((parentLayerPropX.numKeys == 0 || parentLayerPropY.numKeys == 0) && isRotating == false) {
                        layer.property("Transform").property("Position").dimensionsSeparated = true;

                        getChildRotation(layer, parentLayer, oldLayer);
                        getChildScale(layer, parentLayer, oldLayer);
                        oldLayer.remove();
                        return layer;
                    }
                }
                else if (hasParent == true) {
                    if (parentLayerPropX.numKeys != 0 || parentLayerPropY.numKeys != 0) {
                        // alert("oof");
                        var parentLayerKeyTimesX = [];
                        var parentLayerKeyTimesY = [];
                        var parentLayerKeyValuesX = [];
                        var parentLayerKeyValuesY = [];

                        // parentLayer key times
                        for (var k = 1; k <= parentLayerPropX.numKeys; k++)
                            parentLayerKeyTimesX.push(parentLayerPropX.keyTime(k));
                        for (var k = 1; k <= parentLayerPropY.numKeys; k++)
                            parentLayerKeyTimesY.push(parentLayerPropY.keyTime(k));

                        // parentLayer key values
                        for (var k = 1; k <= parentLayerPropX.numKeys; k++)
                            parentLayerKeyValuesX.push(parentLayerPropX.keyValue(k));
                        for (var k = 1; k <= parentLayerPropY.numKeys; k++)
                            parentLayerKeyValuesY.push(parentLayerPropY.keyValue(k));

                        layer.property("Transform").property("Position").dimensionsSeparated = false;
                        parentLayer.property("Transform").property("Position").dimensionsSeparated = false;

                        var parentLayerProp = parentLayer.property("Transform").property("Position");
                        var layerProp = layer.property("Transform").property("Position");

                        var positionValues = [];
                        var keyframeTimes = [];

                        var start = layerStart(layer.containingComp, layer.inPoint);
                        var end = layerEnd(layer.containingComp, layer.outPoint);

                        for (var i = 1; i <= parentLayerProp.numKeys; i++) {
                            var prevTime = parentLayer.containingComp.time;

                            if (parentLayerProp.keyTime(i) <= start) {
                                oldLayer.containingComp.time = start;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(start, false);
                                keyframeTimes[keyframeTimes.length] = start;

                                tempLayer.remove();
                                parentLayer.containingComp.time = prevTime;
                            }
                            else if (parentLayerProp.keyTime(i) >= end) {
                                oldLayer.containingComp.time = end;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(end, false);
                                keyframeTimes[keyframeTimes.length] = end;

                                tempLayer.remove();
                                parentLayer.containingComp.time = prevTime;
                            }
                            else {
                                if (layerProp.numKeys != 0) {
                                    for (var j = 1; j <= layerProp.numKeys; j++) {
                                        oldLayer.containingComp.time = layerProp.keyTime(j);

                                        var tempLayer = oldLayer.duplicate();
                                        tempLayer.parent = null;

                                        positionValues[positionValues.length] = tempLayer.position.valueAtTime(j, false);
                                        keyframeTimes[keyframeTimes.length] = parentLayerProp.keyTime(i);

                                        tempLayer.remove();
                                        layerProp.containingComp.time = prevTime;
                                    }
                                }
                                else {
                                    parentLayer.containingComp.time = parentLayerProp.keyTime(i);

                                    var tempLayer = oldLayer.duplicate();
                                    tempLayer.parent = null;

                                    positionValues[positionValues.length] = tempLayer.position.valueAtTime(i, false);
                                    keyframeTimes[keyframeTimes.length] = parentLayerProp.keyTime(i);

                                    tempLayer.remove();
                                    parentLayer.containingComp.time = prevTime;
                                }
                            }
                        }

                        while (layer.position.numKeys > 0) layer.position.removeKey(layer.position.numKeys);
                        layer.position.setValuesAtTimes(keyframeTimes, positionValues);
                        layer.position.expressionEnabled = false;
                        removeDuplicateKeyframes(layer.property("Transform").property("Position"));

                        getChildRotation(layer, parentLayer, oldLayer);
                        getChildScale(layer, parentLayer, oldLayer);
                        oldLayer.remove();

                        layer.property("Transform").property("Position").dimensionsSeparated = true;
                        parentLayer.property("Transform").property("Position").dimensionsSeparated = true;
                        return layer;
                    }
                    else if ((parentLayerPropX.numKeys == 0 || parentLayerPropY.numKeys == 0) && isRotating == true) {
                        layer.property("Transform").property("Position").dimensionsSeparated = false;
                        var layerProp = layer.property("Transform").property("Position");

                        var positionValues = [];
                        var keyframeTimes = [];

                        var start = layerStart(layer.containingComp, layer.inPoint);
                        var end = layerEnd(layer.containingComp, layer.outPoint);

                        for (var i = 1; i <= layerProp.numKeys; i++) {
                            var prevTime = layer.containingComp.time;

                            if (layerProp.keyTime(i) <= start) {
                                oldLayer.containingComp.time = start;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(start, false);
                                keyframeTimes[keyframeTimes.length] = start;

                                tempLayer.remove();
                                layer.containingComp.time = prevTime;
                            }
                            else if (layerProp.keyTime(i) >= end) {
                                oldLayer.containingComp.time = end;

                                var tempLayer = oldLayer.duplicate();
                                tempLayer.parent = null;

                                positionValues[positionValues.length] = tempLayer.position.valueAtTime(end, false);
                                keyframeTimes[keyframeTimes.length] = end;

                                tempLayer.remove();
                                layer.containingComp.time = prevTime;
                            }
                            else {
                                if (layerProp.numKeys != 0) {
                                    for (var j = 1; j <= layerProp.numKeys; j++) {
                                        oldLayer.containingComp.time = layerProp.keyTime(j);

                                        var tempLayer = oldLayer.duplicate();
                                        tempLayer.parent = null;

                                        positionValues[positionValues.length] = tempLayer.position.valueAtTime(j, false);
                                        keyframeTimes[keyframeTimes.length] = layerProp.keyTime(i);

                                        tempLayer.remove();
                                        layerProp.containingComp.time = prevTime;
                                    }
                                }
                                else {
                                    layer.containingComp.time = layerProp.keyTime(i);

                                    var tempLayer = oldLayer.duplicate();
                                    tempLayer.parent = null;

                                    positionValues[positionValues.length] = tempLayer.position.valueAtTime(i, false);
                                    keyframeTimes[keyframeTimes.length] = layerProp.keyTime(i);

                                    tempLayer.remove();
                                    layer.containingComp.time = prevTime;
                                }
                            }
                        }

                        while (layer.position.numKeys > 0) layer.position.removeKey(layer.position.numKeys);
                        layer.position.setValuesAtTimes(keyframeTimes, positionValues);
                        layer.position.expressionEnabled = false;
                        removeDuplicateKeyframes(layer.property("Transform").property("Position"));

                        getChildRotation(layer, parentLayer, oldLayer);
                        getChildScale(layer, parentLayer, oldLayer);
                        oldLayer.remove();

                        layer.property("Transform").property("Position").dimensionsSeparated = true;
                        return layer;
                    }
                    else if ((parentLayerPropX.numKeys == 0 || parentLayerPropY.numKeys == 0) && isRotating == false) {
                        layer.property("Transform").property("Position").dimensionsSeparated = false;

                        var posValueArray = [];
                        var keyframeTimes = [];

                        var timeStep = scriptSettings.keyframeHelper.interval / 1000;
                        var start = layerStart(layer.containingComp, layer.inPoint);
                        var end = layerEnd(layer.containingComp, layer.outPoint);
                        var duration = end - start;
                        timeStep = (timeStep / duration) * duration;
                        var prevTime = layer.containingComp.time;

                        for (var i = start; i <= end; i = i + timeStep) {
                            if (i >= end) i = end - (layer.containingComp.frameRate / 1000);
                            if (Math.abs(i - end) < timeStep * 2.9) i = end - (layer.containingComp.frameRate / 1000);

                            oldLayer.containingComp.time = i;
                            var tempLayer = oldLayer.duplicate();
                            tempLayer.parent = null;

                            posValueArray[posValueArray.length] = tempLayer.position.valueAtTime(i, false);
                            keyframeTimes[keyframeTimes.length] = i;

                            tempLayer.remove();
                            layer.containingComp.time = prevTime;
                        }

                        while (layer.position.numKeys > 0) layer.position.removeKey(layer.position.numKeys);
                        layer.position.setValuesAtTimes(keyframeTimes, posValueArray);
                        removeDuplicateKeyframes(layer.property("Transform").property("Position"));
                        setParentEasing(layer.property("Transform").property("Position"), parentLayer.property("Transform").property("Position"));
                        layer.position.expressionEnabled = false;

                        getChildRotation(layer, parentLayer, oldLayer);
                        getChildScale(layer, parentLayer, oldLayer);
                        oldLayer.remove();

                        layer.property("Transform").property("Position").dimensionsSeparated = true;
                        return layer;
                    }
                }
                return layer;
            }

            function getChildRotation(layer, parentLayer, oldLayer) {
                scriptSettings = readSettings();

                var rotationValueArray = [];
                var keyframeTimes = [];

                var timeStep = scriptSettings.keyframeHelper.interval / 1000;
                var start = layerStart(layer.containingComp, layer.inPoint);
                var end = layerEnd(layer.containingComp, layer.outPoint);
                var duration = end - start;
                timeStep = (timeStep / duration) * duration;
                var prevTime = layer.containingComp.time;

                for (var i = start; i <= end; i = i + timeStep) {
                    if (i > end) i = end - (layer.containingComp.frameRate / 1000);
                    if (Math.abs(i - end) < timeStep * 2.9) i = end - (layer.containingComp.frameRate / 1000);

                    oldLayer.containingComp.time = i;
                    var tempLayer = oldLayer.duplicate();
                    tempLayer.parent = null;

                    rotationValueArray[rotationValueArray.length] = tempLayer.rotation.valueAtTime(i, false);
                    keyframeTimes[keyframeTimes.length] = i;

                    tempLayer.remove();
                    layer.containingComp.time = prevTime;
                }

                while (layer.rotation.numKeys > 0) layer.rotation.removeKey(layer.rotation.numKeys);
                layer.rotation.setValuesAtTimes(keyframeTimes, rotationValueArray);
                removeDuplicateKeyframes(layer.property("Transform").property("Rotation"));
                setParentEasing(layer.property("Transform").property("Rotation"), parentLayer.property("Transform").property("Rotation"));
                layer.rotation.expressionEnabled = false;
            }

            function getChildScale(layer, parentLayer, oldLayer) {
                scriptSettings = readSettings();

                var scaleValueArray = [];
                var keyframeTimes = [];

                var timeStep = scriptSettings.keyframeHelper.interval / 1000;
                var start = layerStart(layer.containingComp, layer.inPoint);
                var end = layerEnd(layer.containingComp, layer.outPoint);
                var duration = end - start;
                timeStep = (timeStep / duration) * duration;
                var prevTime = layer.containingComp.time;

                for (var i = start; i <= end; i = i + timeStep) {
                    if (i > end) i = end - (layer.containingComp.frameRate / 1000);
                    if (Math.abs(i - end) < timeStep * 2.9) i = end - (layer.containingComp.frameRate / 1000);
                    
                    oldLayer.containingComp.time = i;
                    var tempLayer = oldLayer.duplicate();
                    tempLayer.parent = null;

                    scaleValueArray[scaleValueArray.length] = tempLayer.scale.valueAtTime(i, false);
                    keyframeTimes[keyframeTimes.length] = i;

                    tempLayer.remove();
                    layer.containingComp.time = prevTime;
                }

                while (layer.scale.numKeys > 0) layer.scale.removeKey(layer.scale.numKeys);
                layer.scale.setValuesAtTimes(keyframeTimes, scaleValueArray);
                removeDuplicateKeyframes(layer.property("Transform").property("Scale"));
                setParentEasing(layer.property("Transform").property("Scale"), parentLayer.property("Transform").property("Scale"));
                layer.scale.expressionEnabled = false;
            }

            function setParentEasing(prop, parentProp) {
                if ((parentProp.keyInInterpolationType(1) == 6613 || parentProp.keyOutInterpolationType(1) == 6613) &&
                    parentProp.keyInInterpolationType(parentProp.numKeys) == 6613 || parentProp.keyOutInterpolationType(parentProp.numKeys) == 6613) {
                    try {
                        prop.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
                        prop.setInterpolationTypeAtKey(prop.numKeys, KeyframeInterpolationType.LINEAR);
                        
                        // if (prop.numKeys > 2) {
                        //     if (prop.propertyValueType == 6414 || prop.propertyValueType == 6416 || prop.propertyValueType == 6417) {
                        //         for (var e = 0; e < prop.keyInTemporalEase(1).length; e++) {
                        //             prop.keyInTemporalEase(3)[e].influence = 0;
                        //             prop.keyOutTemporalEase(3)[e].influence = 0;
                        //             prop.keyInTemporalEase(prop.numKeys - 2)[e].influence = 0;
                        //             prop.keyOutTemporalEase(prop.numKeys - 2)[e].influence = 0;
                                    
                        //             prop.keyInTemporalEase(2)[e].influence = 20;
                        //             prop.keyOutTemporalEase(2)[e].influence = 20;
                        //             prop.keyInTemporalEase(prop.numKeys - 1)[e].influence = 20;
                        //             prop.keyOutTemporalEase(prop.numKeys - 1)[e].influence = 20;
                        //             alert("yes");
                        //         }
                        //     }
                        // }
                    }
                    catch (e) {}
                }
            }

            function removeDuplicateKeyframes(prop) {
                applyResults();
                applyResults();
                applyResults();
                applyResults();
                applyResults();
                applyResults();

                extraCheck();
                extraCheck();
                extraCheck();
                extraCheck();
                extraCheck();
                extraCheck();
                
                function applyResults() {
                    if (prop.name != "Scale") {
                        if (prop.numKeys > 2) {
                            for (var i = 1; i < prop.numKeys; i++) {
                                try {
                                    if (prop.keyValue(i) == prop.keyValue(i + 1)) {
                                        try {
                                            if (prop.keyValue(i + 1) !== prop.keyValue(i + 2))
                                            continue;
                                            else prop.removeKey(i + 1);
                                        }
                                        catch (e) {
                                            prop.removeKey(i + 1);
                                        }
                                    }
                                    else continue;
                                }
                                catch (a) { continue; }
                            }
                        }
                    }
                    else if (prop.name == "Scale") {
                        if (prop.numKeys > 2) {
                            for (var i = 1; i < prop.numKeys; i++) {
                                try {
                                    if (prop.keyValue(i)[0] == prop.keyValue(i + 1)[0]) {
                                        try {
                                            if (prop.keyValue(i + 1)[0] !== prop.keyValue(i + 2)[0])
                                            continue;
                                            else prop.removeKey(i + 1);
                                        }
                                        catch (e) {
                                            prop.removeKey(i + 1);
                                        }
                                    }
                                    else continue;
                                }
                                catch (a) { continue; }
                            }
                        }
                    }
                }
                function extraCheck() {
                    var delta1;
                    var delta2;
                    var threshold = 3;

                    if (prop.name != "Scale") {
                        if (prop.numKeys > 2) {
                            for (var i = 1; i < prop.numKeys; i++) {
                                try {
                                    delta1 = Math.abs(prop.keyValue(i) - prop.keyValue(i + 1));
                                    if (delta1 < threshold) {
                                        try {
                                            delta2 = Math.abs(prop.keyValue(i + 1) - prop.keyValue(i + 2));
                                            if (delta2 >= threshold)
                                            continue;
                                            else prop.removeKey(i + 1);
                                        }
                                        catch (e) {
                                            prop.removeKey(i + 1);
                                        }
                                    }
                                    else continue;
                                }
                                catch (a) { continue; }
                            }
                        }
                    }
                    else if (prop.name == "Scale") {
                        if (prop.numKeys > 2) {
                            for (var i = 1; i < prop.numKeys; i++) {
                                try {
                                    delta1 = Math.abs(prop.keyValue(i)[0] - prop.keyValue(i + 1)[0]);
                                    if (delta1 < threshold) {
                                        try {
                                            delta2 = Math.abs(prop.keyValue(i + 1)[0] - prop.keyValue(i + 2)[0]);
                                            if (delta2 >= threshold)
                                            continue;
                                            else prop.removeKey(i + 1);
                                        }
                                        catch (e) {
                                            prop.removeKey(i + 1);
                                        }
                                    }
                                    else continue;
                                }
                                catch (a) { continue; }
                            }
                        }
                    }
                }
            }

            function layerTypeSplit(str) {
                return str.split('.')[1];
            }

            function backupProject() {
                scriptSettings = readSettings();

                if (File(app.project.file.fsName).exists == false) {
                    alert("AeToOsb WARNING: Backup cannot be made." + "\r\n" + "Please save your project before performing this action.");
                }
                if (File(app.project.file.fsName).exists !== false) {
                    var backupPath = scriptSettings.outputFolderPath + "\\" + app.project.file.name.replace("%20", " ");
                    var backupProject = new File(backupPath.slice(0, -4) + ".aep_bckp");
                    var projectFile = File(backupPath);

                    if (backupProject.exists !== true) {
                        projectFile.copy(backupPath.slice(0, -4) + ".aep_bckp");
                    }
                    if (backupProject.exists == true) {
                        backupProject.remove(backupPath.slice(0, -4) + ".aep_bckp");
                        projectFile.copy(backupPath.slice(0, -4) + ".aep_bckp");
                    }
                }
            }

            AeToOsb.onShow = function () {
                scriptSettings = readSettings();
                scriptSettings.exportedComps = null;
                scriptSettings.exportedCompNames = null;
                writeSettings(scriptSettings);
            }

            AeToOsb.onClose = function () {
                scriptSettings = readSettings();
                scriptSettings.exportedComps = null;
                scriptSettings.exportedCompNames = null;
                writeSettings(scriptSettings);
            }

            AeToOsb.layout.layout(true);
            AeToOsb.layout.resize();
            AeToOsb.onResizing = AeToOsb.onResize = function () { this.layout.resize(); }

            // ITEM REFERENCE LIST ( Info: http://jongware.mit.edu/Sui/index_1.html ) 
            AeToOsb.items = {
                AeToOsb: AeToOsb, // dialog
                logo: AeToOsb.findElement("logo"), // image
                tabbedpanel: AeToOsb.findElement("tabbedpanel"), // tabbedpanel
                settings: AeToOsb.findElement("settings"), // tab
                // contents: AeToOsb.findElement("contents"), // statictext
                contents_group: AeToOsb.findElement("contents_group"), // group
                scriptslibrary_button: AeToOsb.findElement("scriptslibrary_button"), // button
                outputpath_button: AeToOsb.findElement("outputpath_button"), // button
                home: AeToOsb.findElement("home"), // tab
                export_section: AeToOsb.findElement("export_section"), // group
                export_button: AeToOsb.findElement("export_button"), // iconbutton
                github: AeToOsb.findElement("github"), // iconbutton
                discord1: AeToOsb.findElement("discord1"), // iconbutton
                discord2: AeToOsb.findElement("discord2"), // iconbutton
                website: AeToOsb.findElement("website"), // iconbutton
                atsStatus: AeToOsb.findElement("atsStatus"), // tab
                atsStatusGroup: AeToOsb.findElement("atsStatusGroup"), // group
                utilities: AeToOsb.findElement("utilities"), // tab
                utilityTabs: AeToOsb.findElement("utilityTabs"), // group
                utilGeneral: AeToOsb.findElement("utilGeneral"), // tab
                utilLayerGroup: AeToOsb.findElement("utilLayerGroup"), // panel
                utilLayerGroupInfo: AeToOsb.findElement("utilLayerGroupInfo"), // group
                utilLayerGroupName: AeToOsb.findElement("utilLayerGroupName"), // statictext
                utilLayerGroupNameInput: AeToOsb.findElement("utilLayerGroupNameInput"), // edittext
                utilLayerGroupApplyButton: AeToOsb.findElement("utilLayerGroupApplyButton"), // button
                utilLayerOrigins: AeToOsb.findElement("utilLayerOrigins"), // panel
                utilLayerOriginTop: AeToOsb.findElement("utilLayerOriginTop"), // group
                utilLayerOriginTopLeft: AeToOsb.findElement("utilLayerOriginTopLeft"), // button
                utilLayerOriginTopCentre: AeToOsb.findElement("utilLayerOriginTopCentre"), // button
                utilLayerOriginTopRight: AeToOsb.findElement("utilLayerOriginTopRight"), // button
                utilLayerOriginCenter: AeToOsb.findElement("utilLayerOriginCenter"), // group
                utilLayerOriginCentreLeft: AeToOsb.findElement("utilLayerOriginCentreLeft"), // button
                utilLayerOriginCentre: AeToOsb.findElement("utilLayerOriginCentre"), // button
                utilLayerOriginCentreRight: AeToOsb.findElement("utilLayerOriginCentreRight"), // button
                utilLayerOriginBottom: AeToOsb.findElement("utilLayerOriginBottom"), // group
                utilLayerOriginBottomLeft: AeToOsb.findElement("utilLayerOriginBottomLeft"), // button
                utilLayerOriginBottomCentre: AeToOsb.findElement("utilLayerOriginBottomCentre"), // button
                utilLayerOriginBottomRight: AeToOsb.findElement("utilLayerOriginBottomRight"), // button
                utilLayerLayering: AeToOsb.findElement("utilLayerLayering"), // panel
                utilLayerLayeringGroup1: AeToOsb.findElement("utilLayerLayeringGroup1"), // group
                utilLayerLayeringDefault: AeToOsb.findElement("utilLayerLayeringDefault"), // statictext
                utilLayerLayeringDefaultTypes: AeToOsb.findElement("utilLayerLayeringDefaultTypes"), // dropdownlist
                utilLayerLayeringApplyButton: AeToOsb.findElement("utilLayerLayeringApplyButton"), // button
                utilTextAndKeyframeHelper: AeToOsb.findElement("utilTextAndKeyframeHelper"), // tab
                utilText: AeToOsb.findElement("utilText"), // panel
                utilTextTitle: AeToOsb.findElement("utilTextTitle"), // statictext
                utilTextGroup: AeToOsb.findElement("utilTextGroup"), // group
                utilTextLetterButton: AeToOsb.findElement("utilTextLetterButton"), // button
                utilTextWordButton: AeToOsb.findElement("utilTextWordButton"), // button
                utilTextLineButton: AeToOsb.findElement("utilTextLineButton"), // button
                utilKeyframe: AeToOsb.findElement("utilKeyframe"), // panel
                utilKeyframeGroup: AeToOsb.findElement("utilKeyframeGroup"), // group
                utilKeyframeTitle: AeToOsb.findElement("utilKeyframeTitle"), // statictext
                utilKeyframeIntervalInput: AeToOsb.findElement("utilKeyframeIntervalInput"), // edittext
                utilKeyframeMs: AeToOsb.findElement("utilKeyframeMs"), // statictext
                utilKeyframeGroup1: AeToOsb.findElement("utilKeyframeGroup1"), // group
                utilKeyframeCheckbox1: AeToOsb.findElement("utilKeyframeCheckbox1"), // checkbox
                utilKeyframeCheckbox2: AeToOsb.findElement("utilKeyframeCheckbox2"), // checkbox
                utilKeyframeCheckbox3: AeToOsb.findElement("utilKeyframeCheckbox3"), // checkbox
                utilKeyframeGroup2: AeToOsb.findElement("utilKeyframeGroup2"), // group
                utilKeyframeCheckbox4: AeToOsb.findElement("utilKeyframeCheckbox4"), // checkbox
                utilKeyframeCheckbox5: AeToOsb.findElement("utilKeyframeCheckbox5"), // checkbox
                utilKeyframeGenerateButton: AeToOsb.findElement("utilKeyframeGenerateButton"), // button
                utilKeyframeCheckbox6: AeToOsb.findElement("utilKeyframeCheckbox6"), // checkbox
                utilLoopHelper: AeToOsb.findElement("utilLoopHelper"), // tab
                utilLoopInfo: AeToOsb.findElement("utilLoopInfo"), // group
                utilLoopStart: AeToOsb.findElement("utilLoopStart"), // statictext
                utilLoopStartInput: AeToOsb.findElement("utilLoopStartInput"), // edittext
                utilLoopInfo1: AeToOsb.findElement("utilLoopInfo1"), // group
                utilLoopEnd: AeToOsb.findElement("utilLoopEnd"), // statictext
                utilLoopEndInput: AeToOsb.findElement("utilLoopEndInput"), // edittext
                utilLoopTypeInfo: AeToOsb.findElement("utilLoopTypeInfo"), // group
                utilLoopType: AeToOsb.findElement("utilLoopType"), // statictext
                utilLoopTypes: AeToOsb.findElement("utilLoopTypes"), // dropdownlist
                utilLoopButtons: AeToOsb.findElement("utilLoopButtons"), // group
                utilLoopFrameButton: AeToOsb.findElement("utilLoopFrameButton"), // button
                utilLoopApplyButton: AeToOsb.findElement("utilLoopApplyButton") // button

            };
            if (AeToOsb instanceof Window) AeToOsb.show();

            AeToOsb.itemsArray = [AeToOsb, logo, tabbedpanel, settings, contents_group, scriptslibrary_button, outputpath_button, home, export_section, export_button, github, discord1, discord2, website, atsStatus, atsStatusGroup, utilities, , utilGeneral, utilLayerGroup, utilLayerGroupInfo, utilLayerGroupName, utilLayerGroupNameInput, utilLayerGroupApplyButton, utilLayerOrigins, utilLayerOriginTop, utilLayerOriginTopLeft, utilLayerOriginTopCentre, utilLayerOriginTopRight, utilLayerOriginCenter, utilLayerOriginCentreLeft, utilLayerOriginCentre, utilLayerOriginCentreRight, utilLayerOriginBottom, utilLayerOriginBottomLeft, utilLayerOriginBottomCentre, utilLayerOriginBottomRight, utilLayerLayering, utilLayerLayeringGroup1, utilLayerLayeringDefault, utilLayerLayeringDefaultTypes, utilLayerLayeringApplyButton, utilTextAndKeyframeHelper, utilText, utilTextTitle, utilTextGroup, utilTextLetterButton, utilTextWordButton, utilTextLineButton, utilKeyframe, utilKeyframeGroup, utilKeyframeTitle, utilKeyframeIntervalInput, utilKeyframeMs, utilKeyframeGroup1, utilKeyframeCheckbox1, utilKeyframeCheckbox2, utilKeyframeCheckbox3, utilKeyframeGroup2, utilKeyframeCheckbox4, utilKeyframeCheckbox5, utilKeyframeGenerateButton, utilKeyframeCheckbox6, utilLoopHelper, utilLoopInfo, utilLoopStart, utilLoopStartInput, utilLoopInfo1, utilLoopEnd, utilLoopEndInput, utilLoopTypeInfo, utilLoopType, utilLoopTypes, utilLoopButtons, utilLoopFrameButton, utilLoopApplyButton];
            return AeToOsb;
        }());
    }
}
// AeToOsb(this);
