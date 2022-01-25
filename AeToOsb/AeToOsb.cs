using OpenTK;
using OpenTK.Graphics;
using StorybrewCommon.Mapset;
using StorybrewCommon.Scripting;
using StorybrewCommon.Storyboarding;
using StorybrewCommon.Storyboarding.Util;
using StorybrewCommon.Storyboarding.CommandValues;
using StorybrewCommon.Subtitles;
using StorybrewCommon.Util;
using AeStoryboardSettings;
using AeToOsbParser;
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace StorybrewScripts
{
    public class AeToOsb : StoryboardObjectGenerator
    {
        // [Configurable]
        // public string pathSettings = ".../AeToOsb/settings.json";

        [Configurable]
        public string sbFolderName = "sb";

        [Configurable]
        public Vector2 offsetEverything = new Vector2(-107, 0);

        [Configurable]
        public Vector2 offsetText = new Vector2(0, 0);

        [Configurable]
        public Vector2 offsetShape = new Vector2(0, 0);

        [Configurable]
        public double downScaleShift = 1;

        [Configurable]
        public bool showGrid = true;

        [Configurable]
        public float gridOpacity = 0.7f;

        [Configurable]
        public bool enableSamples = false;

        [Configurable]
        public int samplesVolume = 80;

        [Configurable]
        public string textOutputFolder = "sb/text";

        [Configurable]
        public bool enableGlow = false;

        [Configurable]
        public int glowRadius = 0;

        [Configurable]
        public Color4 glowColor = Color4.White;

        [Configurable]
        public int shadowThickness = 0;

        [Configurable]
        public Color4 shadowColor = Color4.Black;

        // general globals
        private AeToOsbSettings aeToOsbSettings;
        private string pathOutput;
        private int compStart;
        private int compEnd;
        private int compDuration;
        private double downScale;
        private float frameDuration;

        // sprite parameters
        private int spriteStart;
        private int spriteEnd;
        private int spriteDuration;
        private bool spriteAdditive;
        private Transform spriteTransform;

        // text related parameters
        private string fontName;
        private int fontScale;
        private float fontScaleShift;
        private FontStyle fontStyle;
        private CommandColor textColor;
        private int outlineThickness;
        private CommandColor outlineColor;
        private FontGenerator font;
        private FontTexture sentenceTexture;
        private FontTexture characterTexture;
        private int startTime;
        private int endTime;
        private OsbOrigin origin;
        private OsbOrigin characterAlignment;
        private string text;
        private FontTexture texture;
        private Vector2 currentPos;
        private int letterIndex;
        private Position parentPosition;

        // sprite parameters
        private OsbSprite sprite;
        private OsbSprite spriteStroke;
        private List<OsbSprite> spriteLibrary;
        private List<OsbSprite> seqLibrary;
        private List<OsbSprite> shapeLibrary;
        private List<OsbSprite> nullLibrary;
        private OsbSprite nullItem;
        private int spriteIndex;
        private string name;
        private string layerName;
        private string layerFileName;
        private bool autoGen;
        private bool hasParent;
        private string parentName;
        private string spriteType;
        private string spriteLayer;
        private string sequenceLoopType;
        private OsbLoopType spriteLoopType;
        private string sequenceFilePath;
        private string sequenceFileName;
        private string spriteFont;
        private string spriteFontFamily;
        private float spriteFontSize;
        private string spriteFontStyle;
        private string spriteText;
        private double spriteTextHeight;
        private float spriteTextSpacing;
        private List<LineSpacingOffset> spriteTextSpacingOffset;
        private string spriteTextOrigin;
        private bool spriteTextHasColor;
        private string spriteTextColor;
        private bool spriteTextHasOutlineColor;
        private string spriteTextOutlineColor;
        private float spriteTextOutlineThickness;
        private string characterFont;
        private string characterFontFamily;
        private float characterFontSize;
        private string characterFontStyle;
        private string characterText;
        private string characterTextOrigin;
        private bool characterTextHasColor;
        private string characterTextColor;
        private bool characterTextHasOutlineColor;
        private string characterTextOutlineColor;
        private float characterTextOutlineThickness;
        private bool hasCharacters;
        private double spriteTextMiddle;
        private List<Characters> characters;
        private int characterIndex;
        private Transform charaTransform;

        // shape parameters
        private string saveFullPath;
        private string saveFullPath2;
        private Shape shape;
        public List<VerticesPosition> verticesPosition;
        public List<InTangent> inTangent;
        public List<OutTangent> outTangent;
        public ShapeSize shapeSize;
        public float rectRoundness;
        public PosOffset posOffset;
        public string shapeType;
        public bool shapeClosed;
        public bool shapeHasStroke;
        public List<StrokeColor> shapeStrokeColor;
        public float strokeWidth;
        public string lineCap;
        public string lineJoin;
        public float lineMiterLimit;
        public bool hasDash;
        public float dashSpacing;
        public float dashOffset;
        public bool shapeHasFill;
        public string shapeFillComposite;
        public List<FillColor> shapeFillColor;
        public string strokePath;
        public string fillPath;
        public float shapePosOffsetX;
        public float shapePosOffsetY;

        // rectangle parameters
        // ellipse parameter

        public override void Generate()
        {
            var documentsFolder = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var pathSettings = documentsFolder + @"\AeToOsb\settings.json";
            
            aeToOsbSettings = AeToOsbSettings.FromJson(File.ReadAllText(pathSettings));
            pathOutput = aeToOsbSettings.OutputFolderPath + "\\AeToOsb.json";

            Log("///////////////////////////////////////" + "\r\n" + "\r\n" +
                "AeToOsb - Helpful information panel" + "\r\n" + "\r\n" +
                "///////////////////////////////////////" + "\r\n" + "\r\n" + "\r\n" +

                "--- Settings file path ---" + "\r\n" + pathSettings + "\r\n" + "\r\n" +
                "--- JSON file path ---" + "\r\n" + pathOutput + "\r\n" + "\r\n"
            );

            // the composition(s)
            Storyboard(true);

            // helper grid to estimate playfield position
            Grid(showGrid, gridOpacity);

            // update storybrew when AE composition(s) has been exported
            AddDependency(pathOutput);
            AddDependency(pathSettings);
            
            Log("--- Nulls ---" + "\r\n" + nullLibrary.Count + "\r\n" + "\r\n");

            Log("--- " + shapeLibrary.Count + " shapes were generated ---");
            for (var s = 0; s < shapeLibrary.Count; s++) {
                var n = s + 1;
                Log("- " + n +  ": " + shapeLibrary[s].TexturePath);
            }
            Log("\r\n" + "\r\n");

            Log("--- " + seqLibrary.Count + " sequences were generated ---");
            for (var s = 0; s < seqLibrary.Count; s++) {
                var n = s + 1;
                Log("- " + n +  ": " + seqLibrary[s].TexturePath);
            }
            Log("\r\n" + "\r\n");
            
            Log("--- " + spriteLibrary.Count + " sprites were generated ---"); 
            for (var s = 0; s < spriteLibrary.Count; s++) {
                var n = s + 1;
                Log("- " + n +  ": " + spriteLibrary[s].TexturePath);
            }
            Log("\r\n" + "\r\n");
        }

        public OsbSprite Storyboard(bool returnSprites)
        {
            seqLibrary = new List<OsbSprite>();
            nullLibrary = new List<OsbSprite>();
            shapeLibrary = new List<OsbSprite>();
            spriteLibrary = new List<OsbSprite>();
            var aeStoryboard = AeStoryboard.FromJson(File.ReadAllText(pathOutput));
            if (returnSprites == true)
            {
                foreach (var storyboard in aeStoryboard)
                {
                    // storyboard composition
                    var compName = storyboard.Name;
                    var compBitmap = storyboard.CompBitmap;
                    frameDuration = storyboard.FrameDuration;
                    downScale = AspectRatio(compBitmap.Width, compBitmap.Height) + (downScaleShift - 1);
                    compStart = storyboard.StartTime;
                    compEnd = storyboard.EndTime;
                    compDuration = storyboard.Duration;

                    // storyboard sprites (layers)
                    foreach (var compLayer in storyboard.Layers)
                    {
                        if (compLayer.Visible == true || compLayer.Type == "NullLayer")
                        {
                            // general commands/methods
                            spriteIndex = compLayer.Index;
                            name = compLayer.Name;

                            autoGen = compLayer.AutoGen;
                            hasParent = compLayer.HasParent;
                            if (hasParent)
                            {
                                parentName = compLayer.ParentName;
                            }

                            layerName = compLayer.Name;
                            layerFileName = compLayer.FileName;
                            spriteType = compLayer.Type;
                            spriteLayer = compLayer.LayerLayer;
                            sequenceLoopType = compLayer.LoopType;
                            sequenceFilePath = compLayer.Path;

                            spriteStart = compLayer.StartTime;
                            spriteEnd = compLayer.EndTime;
                            spriteDuration = compLayer.Duration;
                            spriteAdditive = compLayer.Additive;
                            spriteTransform = compLayer.Transform;

                            startTime = spriteStart;
                            endTime = spriteEnd;

                            // text parameters
                            var spriteTextProps = compLayer.Text;
                            if (spriteTextProps != null)
                            {
                                spriteFont = spriteTextProps.FontName;
                                spriteFontFamily = spriteTextProps.FontFamily;
                                spriteFontSize = spriteTextProps.FontSize * (float)downScale;
                                spriteFontStyle = spriteTextProps.FontStyle;

                                spriteText = spriteTextProps.TextText;
                                spriteTextHeight = spriteTextProps.LineHeight * downScale;
                                spriteTextSpacing = spriteTextProps.LineSpacing;
                                spriteTextSpacingOffset = spriteTextProps.LineSpacingOffset;
                                spriteTextOrigin = spriteTextProps.Alignment;
                                spriteTextHasColor = spriteTextProps.HasColorFill;
                                spriteTextColor = spriteTextProps.Color;
                                spriteTextHasOutlineColor = spriteTextProps.HasStroke;
                                spriteTextOutlineColor = spriteTextProps.StrokeColor;
                                spriteTextOutlineThickness = spriteTextProps.StrokeThickness;
                                hasCharacters = spriteTextProps.HasCharacters;
                                spriteTextMiddle = Math.Round((float)spriteText.Length / 2) - 1;
                                // Log("spriteTextMiddle: " + spriteTextMiddle);

                                // characters
                                if (hasCharacters)
                                {
                                    if (aeToOsbSettings.Options != null && aeToOsbSettings.Options.ExportTextPerLetter == true) {
                                        fontName = spriteFontFamily;
                                        fontScale = (int)(spriteFontSize * 1.5f);
                                        font = FontGenerator(textOutputFolder + "/" + compName + "/characters");
                                        fontScaleShift = 1f;
                                        
                                        characters = spriteTextProps.Characters;

                                        if (characters != null)
                                        {
                                            for (int character = 0; character < characters.Count; character++)
                                            {
                                                var chara = characters[character];
                                                
                                                characterIndex = character;
                                                charaTransform = characters[character].Transform;
                                                characterText = chara.TextText;
                                                characterFont = chara.FontName;
                                                characterFontFamily = chara.FontFamily;
                                                characterFontSize = chara.FontSize * (float)downScale;
                                                characterFontStyle = chara.FontStyle;

                                                characterText = chara.TextText;
                                                characterTextOrigin = chara.Alignment;
                                                characterTextHasColor = chara.HasColorFill;
                                                characterTextColor = chara.Color;
                                                characterTextHasOutlineColor = chara.HasStroke;
                                                characterTextOutlineColor = chara.StrokeColor;
                                                characterTextOutlineThickness = chara.StrokeThickness;
                                                text = characterText;

                                                if (string.Equals(chara.Alignment, "left", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.CentreLeft;
                                                else if (string.Equals(chara.Alignment, "center", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.Centre;
                                                else if (string.Equals(chara.Alignment, "right", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.CentreRight;
                                                else if (string.Equals(chara.Alignment, "full_justify_lastline_left", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.CentreLeft;
                                                else if (string.Equals(chara.Alignment, "full_justify_lastline_center", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.Centre;
                                                else if (string.Equals(chara.Alignment, "full_justify_lastline_right", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.CentreRight;
                                                else if (string.Equals(chara.Alignment, "full_justify_lastline_full", StringComparison.OrdinalIgnoreCase))
                                                    characterAlignment = OsbOrigin.Centre;

                                                if (spriteType == "Text" && hasCharacters == true && spriteType != "Audio")
                                                {
                                                    // texture generation
                                                    if (spriteFontStyle == "Regular")
                                                        fontStyle = FontStyle.Regular;
                                                    else if (spriteFontStyle == "Bold")
                                                        fontStyle = FontStyle.Bold;
                                                    else if (spriteFontStyle == "Italic")
                                                        fontStyle = FontStyle.Italic;
                                                    else if (spriteFontStyle == "Strikeout")
                                                        fontStyle = FontStyle.Strikeout;
                                                    else if (spriteFontStyle == "Underline")
                                                        fontStyle = FontStyle.Underline;
                                                    else fontStyle = FontStyle.Regular;

                                                    textColor = CommandColor.FromHtml(spriteTextColor);
                                                    // enableGlow = spriteTextHasGlow;
                                                    // glowRadius = spriteTextGlowRadius;
                                                    // glowColor = CommandColor.FromHtml(spriteTextGlowColor);

                                                    if (spriteTextHasOutlineColor)
                                                        outlineThickness = (int)spriteTextOutlineThickness;
                                                    if (!spriteTextHasOutlineColor)
                                                        outlineThickness = 0;

                                                    outlineColor = CommandColor.FromHtml(spriteTextOutlineColor);
                                                    // shadowThickness = spriteTextShadowThickness;
                                                    // shadowColor = CommandColor.FromHtml(spriteTextShadowColor);

                                                    characterTexture = font.GetTexture(text.ToString());

                                                    if (spriteTextSpacingOffset.Count != 0) {
                                                        List<int> letterSpacing = new List<int>();
                                                        int startKey = lineSpacingOffset()["startTime"]; letterSpacing.Add(startKey);
                                                        int startValue = lineSpacingOffset()["startValue"]; letterSpacing.Add(startValue);
                                                        int endKey = lineSpacingOffset()["endTime"]; letterSpacing.Add(endKey);
                                                        int endValue = lineSpacingOffset()["endValue"]; letterSpacing.Add(endValue);
                                                    }
                                                    texture = font.GetTexture(text);
                                                    if (!texture.IsEmpty)
                                                    {
                                                        sprite = new OsbSprite();
                                                        sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(texture.Path, origin);

                                                        // fade
                                                        fade(charaTransform.Fade, sprite, new OsbSprite());
                                                        // position x
                                                        moveX(charaTransform.Position, sprite, new OsbSprite());
                                                        // position y
                                                        moveY(charaTransform.Position, sprite, new OsbSprite());
                                                        // scale
                                                        scale(charaTransform.Scale, sprite, new OsbSprite());
                                                        // rotation
                                                        rotation(spriteTransform.Rotation, sprite, new OsbSprite());
                                                        // additive
                                                        if (spriteAdditive)
                                                        additive(sprite, spriteStart, spriteEnd);

                                                        // Log("Position: " + sprite.PositionAt(5320) + "   ||   lineSpacingOffset: " + letterSpacing[0] + ", " + letterSpacing[1] + ", " + letterSpacing[2] + ", " + letterSpacing[3]);
                                                        // letterSpacing.Clear();
                                                        if (spriteType != "NullLayer") spriteLibrary.Add(sprite);
                                                    }
                                                    letterIndex++;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // transform methods
                            var compLayerBitmap = spriteTransform.LayerBitmap;
                            if (string.Equals(spriteTransform.Origin, "TopLeft", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.TopLeft;
                            else if (string.Equals(spriteTransform.Origin, "TopCentre", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.TopCentre;
                            else if (string.Equals(spriteTransform.Origin, "TopRight", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.TopRight;
                            else if (string.Equals(spriteTransform.Origin, "CentreLeft", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.CentreLeft;
                            else if (string.Equals(spriteTransform.Origin, "Centre", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.Centre;
                            else if (string.Equals(spriteTransform.Origin, "CentreRight", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.CentreRight;
                            else if (string.Equals(spriteTransform.Origin, "BottomLeft", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.BottomLeft;
                            else if (string.Equals(spriteTransform.Origin, "BottomCentre", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.BottomCentre;
                            else if (string.Equals(spriteTransform.Origin, "BottomRight", StringComparison.OrdinalIgnoreCase))
                                origin = OsbOrigin.BottomRight;
                            else origin = OsbOrigin.Centre;

                            // sprite creation
                            // List<int> dummyList = new List<int>();
                            if (spriteType != "Text" && spriteType != "Audio")
                            {
                                // sprites
                                sprite = new OsbSprite();
                                spriteStroke = new OsbSprite();

                                if (spriteType == "Sequence") {
                                    if (string.Equals(sequenceLoopType, "LoopOnce", StringComparison.OrdinalIgnoreCase))
                                    spriteLoopType = OsbLoopType.LoopOnce;
                                    else if (string.Equals(sequenceLoopType, "LoopForever", StringComparison.OrdinalIgnoreCase))
                                    spriteLoopType = OsbLoopType.LoopForever;
                                    else spriteLoopType = OsbLoopType.LoopOnce;

                                    string sequencePath = "";
                                    int sequenceEntries = 0;
                                    string seqPath = "";
                                    if (autoGen) {
                                        var destinationPath = MapsetPath + "/" + sbFolderName + "/AeAnimations/" + layerName;
                                        sequencePath = aeToOsbSettings.ScriptslibraryFolderPath.Replace("scriptslibrary", "assetlibrary\\_AeToOsb\\AeAnimations\\" + layerName);
                                        sequenceEntries = Directory.GetFiles(sequencePath).Length;

                                        var sourceDir = new DirectoryInfo(sequencePath);
                                        var destinationDir = new DirectoryInfo(destinationPath);

                                        if (!destinationDir.Exists)
                                        Directory.CreateDirectory(destinationPath);

                                        foreach (var file in sourceDir.GetFiles())
                                        {
                                            if (file.Exists)
                                            {
                                                string filePath = Path.Combine(destinationPath, file.Name);

                                                if (!FileExists(filePath))
                                                file.CopyTo(filePath);
                                                else continue;
                                            }
                                            else continue;
                                        }
                                        
                                        var i = 0;
                                        foreach (var file in sourceDir.GetFiles())
                                        {
                                            var newFile = IncrementFileName(i, file.Name, destinationPath, layerFileName);
                                            var oldFileFullName = newFile.FullName.Replace(newFile.Name, file.Name);

                                            if (!newFile.Exists) {
                                                File.Move(oldFileFullName, newFile.FullName);
                                                
                                            }
                                            else if (File.Exists(oldFileFullName))
                                                File.Delete(oldFileFullName);
                                            else continue;
                                            ++i;
                                        }
                                        
                                        if (!sequenceFileName.Contains("(aeosb)"))
                                        {
                                            var seqUnderscore = sequenceFileName.LastIndexOf('_');
                                            var seqFrame = sequenceFileName.Substring(seqUnderscore);
                                            seqPath = sbFolderName + "/AeAnimations/" + layerName + "/" + sequenceFileName.Replace(seqFrame, "(aeosb)_.png");
                                        }
                                        else seqPath = sbFolderName + "/AeAnimations/" + layerName + "/" + sequenceFileName;
                                        Log("sequenceFileName: " + sequenceFileName);
                                    }
                                    else if (!autoGen) {
                                        var sbIndex = sequenceFilePath.IndexOf(sbFolderName);
                                        var sbLastIndex = sequenceFilePath.LastIndexOf('\\');
                                        var sequencePathRemove = sequenceFilePath.Substring(sbLastIndex);

                                        sequencePath = sequenceFilePath.Substring(sbIndex);
                                        sequencePath = MapsetPath + "/" + sequencePath.Replace(sequencePathRemove, "").Replace(@"\", "/");
                                        sequenceEntries = Directory.GetFiles(sequencePath).Length;

                                        seqPath = sequencePath.Substring(sequencePath.IndexOf(sbFolderName)) + "/" + layerFileName;
                                    }

                                    sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateAnimation(seqPath, sequenceEntries, frameDuration, spriteLoopType, origin);
                                }
                                else if (spriteType == "Shape") {
                                    shape = compLayer.Shape;

                                    shapeType = shape.Type;
                                    verticesPosition = shape.VerticesPosition;
                                    inTangent = shape.InTangent;
                                    outTangent = shape.OutTangent;
                                    shapeClosed = shape.Closed;
                                    shapeSize = shape.ShapeSize;
                                    rectRoundness = shape.RectRoundness;
                                    posOffset = shape.PosOffset;

                                    shapeHasStroke = false;
                                    shapeStrokeColor = shape.StrokeColor;
                                    if (shape.StrokeColor != null)
                                        shapeHasStroke = shape.HasStroke;

                                    strokeWidth = shape.StrokeWidth;
                                    lineCap = shape.LineCap;
                                    lineJoin = shape.LineJoin;
                                    lineMiterLimit = shape.LineMiterLimit;
                                    hasDash = shape.HasDash;
                                    dashSpacing = shape.DashSpacing;
                                    dashOffset = shape.DashOffset;

                                    shapeHasFill = false;
                                    if (shape.FillColor != null)
                                        shapeHasFill = shape.HasFill;
                                    
                                    shapeFillComposite = shape.FillComposite;
                                    shapeFillColor = shape.FillColor;

                                    if (shapeHasStroke && shapeHasFill)
                                    {
                                        GenerateShape(true, true);
                                        var strokeName = strokePath;
                                        
                                        if (!strokeName.Contains("(s)"))
                                        strokeName = strokeName.Replace(".png", "(s).png");

                                        if (shapeFillComposite == "Below")
                                        {
                                            if (shapeType != "Path")
                                            spriteStroke = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(strokeName, origin);
                                            sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(fillPath, origin);
                                        }
                                        else if (shapeFillComposite == "Above")
                                        {
                                            if (shapeType != "Path")
                                            spriteStroke = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(strokeName, origin);
                                            sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(fillPath, origin);
                                        }
                                        else
                                        {
                                            if (shapeType != "Path")
                                            spriteStroke = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(strokeName, origin);
                                            sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(fillPath, origin);
                                        }
                                    }
                                    else if (shapeHasStroke && !shapeHasFill)
                                    {
                                        GenerateShape(true, false);
                                        var strokeName = strokePath;

                                        if (!strokeName.Contains("(s)"))
                                        strokeName = strokeName.Replace(".png", "(s).png");

                                        if (shapeType != "Path")
                                        sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(strokeName, origin);
                                        else sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(fillPath, origin);
                                    }
                                    else if (!shapeHasStroke && shapeHasFill)
                                    {
                                        GenerateShape(false, true);
                                        sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(fillPath, origin);
                                    }
                                    else continue;

                                    if (shapeType == "Path")
                                    {
                                        string projectPath = ProjectPath;
                                        if (projectPath.Contains("/"))
                                            projectPath = projectPath.Replace("/", @"\");

                                        var strokeSpritePath = MapsetPath + "/" + sbFolderName + "/shapes/" + layerName + "(s).png";
                                        var strokeProjectPath = projectPath + @"\assetlibrary\_AeToOsb\shapes\" + layerName + "(s).png";
            
                                        if (strokeSpritePath.Contains("/"))
                                            strokeSpritePath = strokeSpritePath.Replace("/", @"\");
                                        
                                        if (strokeProjectPath.Contains("/"))
                                            strokeProjectPath = strokeProjectPath.Replace("/", @"\");

                                        if (File.Exists(strokeProjectPath))
                                            File.Delete(strokeProjectPath);
                                        if (File.Exists(strokeSpritePath))
                                            File.Delete(strokeSpritePath);
                                    }
                                }
                                else if (spriteType != "Sequence" && spriteType != "Shape")
                                sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(sbFolderName + "/" + layerFileName, origin);
                                
                                // fade
                                fade(spriteTransform.Fade, sprite, spriteStroke);
                                // position x
                                moveX(spriteTransform.Position, sprite, spriteStroke);
                                // position y
                                moveY(spriteTransform.Position, sprite, spriteStroke);
                                // scale
                                scale(spriteTransform.Scale, sprite, spriteStroke);
                                // rotation
                                rotation(spriteTransform.Rotation, sprite, spriteStroke);
                                // color shape
                                if (spriteType == "Shape")
                                {
                                    if (shapeHasStroke && !shapeHasFill)
                                        colorStroke(shapeStrokeColor, sprite);
                                    else if (shapeHasStroke)
                                        colorStroke(shapeStrokeColor, spriteStroke);

                                    if (shapeHasFill)
                                    {
                                        if (shapeType != "Path")
                                            colorFill(shapeFillColor, sprite);
                                    }
                                }
                                // additive
                                if (spriteAdditive)
                                additive(sprite, spriteStart, spriteEnd);

                                if (spriteType != "NullLayer" && spriteType != "Sequence" && spriteType != "Shape")
                                    spriteLibrary.Add(sprite);
                                if (spriteType == "NullLayer") nullLibrary.Add(sprite);
                                if (spriteType == "Sequence") seqLibrary.Add(sprite);
                                if (spriteType == "Shape") shapeLibrary.Add(sprite);
                            }
                            else if (spriteType == "Text" && spriteType != "Audio")
                            {
                                if (aeToOsbSettings.Options != null && aeToOsbSettings.Options.ExportTextPerLetter == false) {
                                    // texture generation
                                    fontName = spriteFontFamily;
                                    fontScale = (int)(spriteFontSize * 1.5f);
                                    fontScaleShift = 1f;

                                    if (spriteFontStyle == "Regular")
                                        fontStyle = FontStyle.Regular;
                                    else if (spriteFontStyle == "Bold")
                                        fontStyle = FontStyle.Bold;
                                    else if (spriteFontStyle == "Italic")
                                        fontStyle = FontStyle.Italic;
                                    else if (spriteFontStyle == "Strikeout")
                                        fontStyle = FontStyle.Strikeout;
                                    else if (spriteFontStyle == "Underline")
                                        fontStyle = FontStyle.Underline;
                                    else fontStyle = FontStyle.Regular;

                                    textColor = CommandColor.FromHtml(spriteTextColor);
                                    // enableGlow = spriteTextHasGlow;
                                    // glowRadius = spriteTextGlowRadius;
                                    // glowColor = CommandColor.FromHtml(spriteTextGlowColor);

                                    if (spriteTextHasOutlineColor)
                                        outlineThickness = (int)spriteTextOutlineThickness;
                                    if (!spriteTextHasOutlineColor)
                                        outlineThickness = 0;

                                    outlineColor = CommandColor.FromHtml(spriteTextOutlineColor);
                                    // shadowThickness = spriteTextShadowThickness;
                                    // shadowColor = CommandColor.FromHtml(spriteTextShadowColor);

                                    text = spriteText;
                                    font = FontGenerator(textOutputFolder + "/" + compName);

                                    sentenceTexture = font.GetTexture(text.ToString());

                                    texture = font.GetTexture(text);
                                    if (!texture.IsEmpty)
                                    {
                                        sprite = new OsbSprite();
                                        sprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(texture.Path, origin);

                                        // fade
                                        fade(spriteTransform.Fade, sprite, new OsbSprite());
                                        // position x
                                        moveX(spriteTransform.Position, sprite, new OsbSprite());
                                        // position y
                                        moveY(spriteTransform.Position, sprite, new OsbSprite());
                                        // scale
                                        scale(spriteTransform.Scale, sprite, new OsbSprite());
                                        // rotation
                                        rotation(spriteTransform.Rotation, sprite, new OsbSprite());
                                        // additive
                                        if (spriteAdditive)
                                        additive(sprite, spriteStart, spriteEnd);

                                        if (spriteType != "NullLayer") spriteLibrary.Add(sprite);
                                        
                                    }
                                }
                            }
                            else if (spriteType == "Audio")
                            {
                                if (enableSamples)
                                {
                                    var audioSprite = GetLayer(spriteType + ": " + spriteLayer + ": " + spriteIndex).CreateSample(layerFileName, (double)compLayer.StartTime, samplesVolume);
                                }
                            }
                        }
                    }
                }
                if (spriteType == "NullLayer") sprite = nullItem;
                AddDependency(MapsetPath + "/" + sprite.TexturePath);
            }
            else if (returnSprites == false) sprite = nullItem;

            return sprite;
        }

        public void additive(OsbSprite spriteAdd, int start, int end)
        {
            spriteAdd.Additive(start, end);
        }

        FontGenerator FontGenerator(string output)
        {
            var font = LoadFont(output, new FontDescription()
            {
                FontPath = fontName,
                FontSize = fontScale,
                Color = Color4.White,
                Padding = Vector2.Zero,
                FontStyle = fontStyle,
                TrimTransparency = true,
                EffectsOnly = false,
                Debug = false,
            },
            new FontGlow()
            {
                Radius = !enableGlow ? 0 : glowRadius,
                Color = glowColor,
            },
            new FontOutline()
            {
                Thickness = outlineThickness,
                Color = outlineColor,
            },
            new FontShadow()
            {
                Thickness = shadowThickness,
                Color = shadowColor,
            });

            return font;
        }

        public bool FileExists(string path)
        {
            // check if file or folder exists function
            // FileAttributes attributes = File.GetAttributes(path);

            if (File.Exists(path))
                return true;
            else
                return false;
        }

        public FileInfo IncrementFileName(int n, string sourceFileName, string path, string newName)
        {          
            // rename files
            path = path.Replace("/", "\\") + "\\" + sourceFileName;
            string dir = Path.GetDirectoryName(path);
            string fileName = Path.GetFileNameWithoutExtension(path);
            string fileExt = Path.GetExtension(path);
            string newFileName = newName.Replace("_.png", "");

            if (!File.Exists(path))
                return new FileInfo(path);

            path = Path.Combine(dir, fileName.Replace(fileName, newFileName + "(aeosb)_" + n + fileExt));
            sequenceFileName = newFileName + "(aeosb)_" + fileExt;
            
            return new FileInfo(path);
        }

        public double AspectRatio(float width, float height)
        {
            // Vector2 playfield = new Vector2(854.0f, 480.0f);

            // double compSize = height * width;
            // double playfieldSize = playfield.Y * playfield.X;
            // // double percentageDifference = (playfieldSize / compSize) * 100;
            // double percentageDifference = (playfield.X / width);
            // // Log(percentageDifference);

            // Vector2 playfieldSize = new Vector2(854.0f, 480.0f);
            // Vector2 compSize = new Vector2(width, height);

            // double percentageDifference = (compSize.Y / playfieldSize.Y) / 10;
            // Log(percentageDifference);

            return 0.445f;
        }

        public Dictionary<string, int> lineSpacingOffset()
        {
            Dictionary<string, int> letterSpacing = new Dictionary<string, int>();

            if (spriteTextSpacingOffset != null)
            {
                if (spriteTextSpacingOffset.Count > 1)
                {
                    var keys = spriteTextSpacingOffset;
                    for (int key1 = 0, key2 = 1; key1 <= keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            // Log("1value1: " + key1 + " | value2: " + key2);
                            letterSpacing.Add("startTime", keys[key1].Time);
                            letterSpacing.Add("startValue", (int)keys[key1].Value);
                            letterSpacing.Add("endTime", keys[key2].Time + (int)frameDuration);
                            letterSpacing.Add("endValue", (int)keys[key2].Value);

                            return letterSpacing;
                        }
                        else if (key2 > 1 && key2 + 1 <= keys.Count && keys.Count % 2 == 0)
                        {
                            // Log("2value1: " + key1 + " | value2: " + key2);
                            key1 = key1 + 1; key2 = key2 + 1;
                            letterSpacing.Add("startTime", keys[key1].Time + (int)frameDuration);
                            letterSpacing.Add("startValue", (int)keys[key1].Value);
                            letterSpacing.Add("endTime", keys[key2].Time + (int)frameDuration);
                            letterSpacing.Add("endValue", (int)keys[key2].Value);

                            return letterSpacing;
                        }
                        else {
                            if (key2 < keys.Count) {
                                // Log("1value1: " + key1 + " | value2: " + key2);
                                letterSpacing.Add("startTime", keys[key1].Time);
                                letterSpacing.Add("startValue", (int)keys[key1].Value);
                                letterSpacing.Add("endTime", keys[key2].Time + (int)frameDuration);
                                letterSpacing.Add("endValue", (int)keys[key2].Value);

                                return letterSpacing;
                            }
                            sprite.Fade(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                        }
                    }
                }
                else if (spriteTextSpacingOffset.Count <= 1)
                {
                    foreach (var keyframe in spriteTextSpacingOffset)
                    {
                        letterSpacing.Add("time", keyframe.Time);
                        letterSpacing.Add("value", (int)keyframe.Value);

                        return letterSpacing;
                    }
                }
            }
            return letterSpacing;
        }

        public void fade(List<Fade> transform, OsbSprite sprite, OsbSprite spriteStroke)
        {
            if (transform != null)
            {
                if (transform.Count > 1)
                {
                    var keys = transform;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            // Log("1value1: " + key1 + " | value2: " + key2);
                            sprite.Fade(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                spriteStroke.Fade(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            sprite.Fade(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                spriteStroke.Fade(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count)
                            {
                                sprite.Fade(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                                if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                    spriteStroke.Fade(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            }
                        }
                    }
                }
                else if (transform.Count <= 1)
                {
                    foreach (var keyframe in transform)
                    {
                        sprite.Fade(keyframe.Time, spriteEnd, keyframe.Value, keyframe.Value);
                        if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                spriteStroke.Fade(keyframe.Time, spriteEnd, keyframe.Value, keyframe.Value);
                    }
                }
            }
        }

        public void moveX(Position transform, OsbSprite sprite, OsbSprite spriteStroke)
        {
            if (transform != null)
            {
                float k1 = 0;
                float k2 = 0;
                float shapeOffsetX = 0;
                if (spriteType == "Shape")
                    shapeOffsetX = offsetShape.X;

                if (transform.X.Count > 1)
                {
                    var keys = transform.X;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            k1 = (float)keys[key1].Value;
                            k2 = (float)keys[key2].Value;

                            if (spriteType == "Shape")
                            {
                                k1 = k1 + shapePosOffsetX;
                                k2 = k2 + shapePosOffsetX;
                            }

                            if (spriteType == "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + offsetEverything.X + offsetText.X, (keys[key2].Value * downScale) + offsetEverything.X + offsetText.X);
                            if (spriteType != "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.X + shapeOffsetX, (k2 * downScale) + offsetEverything.X + shapeOffsetX);
                            
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveX(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.X + shapeOffsetX, (k2 * downScale) + offsetEverything.X + shapeOffsetX);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            k1 = (float)keys[key1].Value;
                            k2 = (float)keys[key2].Value;

                            if (spriteType == "Shape")
                            {
                                k1 = k1 + shapePosOffsetX;
                                k2 = k2 + shapePosOffsetX;
                            }

                            // key1 = key1 + 1; key2 = key2 + 1;
                            if (spriteType == "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + offsetEverything.X + offsetText.X, (keys[key2].Value * downScale) + offsetEverything.X + offsetText.X);
                            if (spriteType != "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.X + shapeOffsetX, (k2 * downScale) + offsetEverything.X + shapeOffsetX);
                            
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.X + shapeOffsetX, (k2 * downScale) + offsetEverything.X + shapeOffsetX);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count) {
                                k1 = (float)keys[key1].Value;
                                k2 = (float)keys[key2].Value;

                                if (spriteType == "Shape")
                                {
                                    k1 = k1 + shapePosOffsetX;
                                    k2 = k2 + shapePosOffsetX;
                                }

                                if (spriteType == "Text")
                                sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + offsetEverything.X + offsetText.X, (keys[key2].Value * downScale) + offsetEverything.X + offsetText.X);
                                if (spriteType != "Text")
                                sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.X + shapeOffsetX, (k2 * downScale) + offsetEverything.X + shapeOffsetX);
                                
                                if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                    if (spriteType != "Text")
                                        spriteStroke.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.X + shapeOffsetX, (k2 * downScale) + offsetEverything.X + shapeOffsetX);
                            }
                        }
                    }
                }
                else if (transform.X.Count <= 1)
                {
                    foreach (var keyframe in transform.X)
                    {
                        k1 = (float)keyframe.Value;

                        if (spriteType == "Shape")
                            k1 = k1 + shapePosOffsetX;

                        if (spriteType == "Text")
                        sprite.MoveX(keyframe.Time, (k1 * downScale) + offsetEverything.X + offsetText.X);
                        if (spriteType != "Text")
                        sprite.MoveX(keyframe.Time, (k1 * downScale) + offsetEverything.X + shapeOffsetX);
                        
                        if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveX(keyframe.Time, (k1 * downScale) + offsetEverything.X + shapeOffsetX);
                    }
                }
            }
        }

        public void moveY(Position transform, OsbSprite sprite, OsbSprite spriteStroke)
        {
            if (transform != null)
            {
                float k1 = 0;
                float k2 = 0;
                float shapeOffsetY = 0;
                if (spriteType == "Shape")
                    shapeOffsetY = offsetShape.Y;

                float letterHeightOffset = 0;

                if (aeToOsbSettings.Options != null && aeToOsbSettings.Options.ExportTextPerLetter == true && hasCharacters == true)
                letterHeightOffset = -30;
                
                if (transform.Y.Count > 1)
                {
                    var keys = transform.Y;

                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            k1 = (float)keys[key1].Value;
                            k2 = (float)keys[key2].Value;

                            if (spriteType == "Shape")
                            {
                                k1 = k1 + shapePosOffsetY;
                                k2 = k2 + shapePosOffsetY;
                            }

                            if (spriteType == "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset, (keys[key2].Value * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset);
                            if (spriteType != "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY, (k2 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                            
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveY(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY, (k2 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            k1 = (float)keys[key1].Value;
                            k2 = (float)keys[key2].Value;

                            if (spriteType == "Shape")
                            {
                                k1 = k1 + shapePosOffsetY;
                                k2 = k2 + shapePosOffsetY;
                            }
                            
                            // key1 = key1 + 1; key2 = key2 + 1;
                            if (spriteType == "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset, (keys[key2].Value * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset);
                            if (spriteType != "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY, (k2 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                            
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY, (k2 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count) {
                                k1 = (float)keys[key1].Value;
                                k2 = (float)keys[key2].Value;

                                if (spriteType == "Shape")
                                {
                                    k1 = k1 + shapePosOffsetY;
                                    k2 = k2 + shapePosOffsetY;
                                }
                                
                                if (spriteType == "Text")
                                sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset, (keys[key2].Value * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset);
                                if (spriteType != "Text")
                                sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY, (k2 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                                
                                if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY, (k2 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                            }
                        }
                    }
                }
                else if (transform.Y.Count <= 1)
                {
                    foreach (var keyframe in transform.Y)
                    {
                        k1 = (float)keyframe.Value;

                        if (spriteType == "Shape")
                            k1 = k1 + shapePosOffsetY;
                        
                        if (spriteType == "Text")
                        sprite.MoveY(keyframe.Time, (k1 * downScale) + offsetEverything.Y + offsetText.Y + letterHeightOffset);
                        if (spriteType != "Text")
                        sprite.MoveY(keyframe.Time, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                        
                        if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                if (spriteType != "Text")
                                    spriteStroke.MoveY(keyframe.Time, (k1 * downScale) + offsetEverything.Y + shapeOffsetY + shapeOffsetY);
                    }
                }
            }
        }

        public void scale(Scale transform, OsbSprite sprite, OsbSprite spriteStroke)
        {
            // scale
            if (transform != null)
            {
                float fillScaleShift = 0;
                if (shapeHasFill && spriteType == "Shape" && shapeType != "Path") fillScaleShift = 0.0001f;
                if (transform.X.Count > 1)
                {
                    var keysX = transform.X;
                    var keysY = transform.Y;
                    for (int key1 = 0, key2 = 1; key1 < keysX.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keysX.Count % 2 == 0)
                        {
                            // Log("1value1: " + key1 + " | value2: " + key2);
                            if (spriteType == "Text")
                                sprite.ScaleVec(OsbEasing.None, keysX[key1].Time, keysX[key2].Time + frameDuration,
                                    new Vector2((float)(keysX[key1].Value * downScale) * fontScaleShift, (float)(keysY[key1].Value * downScale) * fontScaleShift),
                                    new Vector2((float)(keysX[key2].Value * downScale) * fontScaleShift, (float)(keysY[key2].Value * downScale) * fontScaleShift));
                            if (spriteType != "Text")
                                sprite.ScaleVec(OsbEasing.None, keysX[key1].Time, keysX[key2].Time + frameDuration,
                                    new Vector2((float)(keysX[key1].Value * downScale) + fillScaleShift, (float)(keysY[key1].Value * downScale) + fillScaleShift),
                                    new Vector2((float)(keysX[key2].Value * downScale) + fillScaleShift, (float)(keysY[key2].Value * downScale) + fillScaleShift));
                                
                                if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                    if (spriteType != "Text")
                                        spriteStroke.ScaleVec(OsbEasing.None, keysX[key1].Time, keysX[key2].Time + frameDuration,
                                            new Vector2((float)(keysX[key1].Value * downScale), (float)(keysY[key1].Value * downScale)),
                                            new Vector2((float)(keysX[key2].Value * downScale), (float)(keysY[key2].Value * downScale)));

                            // if (sprite.TexturePath.Contains("bg.jpg")) {
                            //     Log("transform.X.Count: " + transform.X.Count);
                            //     Log("keysY[key1].Value: " + keysY[key1].Value);
                            //     Log("keysY[key2].Value: " + keysY[key2].Value);
                            // }
                        }
                        else if (key2 > 1 && key2 + 1 < keysX.Count && keysX.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            if (spriteType == "Text")
                                sprite.ScaleVec(OsbEasing.None, keysX[key1].Time, keysX[key2].Time + frameDuration,
                                    new Vector2((float)(keysX[key1].Value * downScale) * fontScaleShift, (float)(keysY[key1].Value * downScale) * fontScaleShift),
                                    new Vector2((float)(keysX[key2].Value * downScale) * fontScaleShift, (float)(keysY[key2].Value * downScale) * fontScaleShift));
                            if (spriteType != "Text")
                                sprite.ScaleVec(OsbEasing.None, keysX[key1].Time + frameDuration, keysX[key2].Time + frameDuration,
                                    new Vector2((float)(keysX[key1].Value * downScale) + fillScaleShift, (float)(keysY[key1].Value * downScale) + fillScaleShift),
                                    new Vector2((float)(keysX[key2].Value * downScale) + fillScaleShift, (float)(keysY[key2].Value * downScale) + fillScaleShift));
                                
                                if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                    if (spriteType != "Text")
                                        spriteStroke.ScaleVec(OsbEasing.None, keysX[key1].Time + frameDuration, keysX[key2].Time + frameDuration,
                                            new Vector2((float)(keysX[key1].Value * downScale), (float)(keysY[key1].Value * downScale)),
                                            new Vector2((float)(keysX[key2].Value * downScale), (float)(keysY[key2].Value * downScale)));
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keysX.Count) {
                                if (spriteType == "Text")
                                    sprite.ScaleVec(OsbEasing.None, keysX[key1].Time, keysX[key2].Time + frameDuration,
                                        new Vector2((float)(keysX[key1].Value * downScale) * fontScaleShift, (float)(keysY[key1].Value * downScale) * fontScaleShift),
                                        new Vector2((float)(keysX[key2].Value * downScale) * fontScaleShift, (float)(keysY[key2].Value * downScale) * fontScaleShift));
                                if (spriteType != "Text")
                                    sprite.ScaleVec(OsbEasing.None, keysX[key1].Time + frameDuration, keysX[key2].Time + frameDuration,
                                        new Vector2((float)(keysX[key1].Value * downScale) + fillScaleShift, (float)(keysY[key1].Value * downScale) + fillScaleShift),
                                        new Vector2((float)(keysX[key2].Value * downScale) + fillScaleShift, (float)(keysY[key2].Value * downScale) + fillScaleShift));

                                    if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                        if (spriteType != "Text")
                                            spriteStroke.ScaleVec(OsbEasing.None, keysX[key1].Time + frameDuration, keysX[key2].Time + frameDuration,
                                                new Vector2((float)(keysX[key1].Value * downScale), (float)(keysY[key1].Value * downScale)),
                                                new Vector2((float)(keysX[key2].Value * downScale), (float)(keysY[key2].Value * downScale)));
                            }
                        }
                    }
                }
                else if (transform.X.Count <= 1)
                {
                    var k = 0;
                    var t = transform.X;

                    List<double> scaleX = new List<double>();
                    List<double> scaleY = new List<double>();

                    foreach (var keyframe in transform.X)
                    {
                        if (spriteType == "Text")
                            scaleX.Add((keyframe.Value * downScale) * fontScaleShift);
                        if (spriteType != "Text")
                            scaleX.Add(keyframe.Value * downScale);
                    }

                    foreach (var keyframe in transform.Y)
                    {
                        if (spriteType == "Text")
                            scaleY.Add((keyframe.Value * downScale) * fontScaleShift);
                        if (spriteType != "Text")
                            scaleY.Add(keyframe.Value * downScale);
                    }

                    if (spriteType == "Text")
                        sprite.ScaleVec(t[k].Time, new Vector2((float)scaleX[k], (float)scaleY[k]));
                    if (spriteType != "Text")
                        sprite.ScaleVec(t[k].Time, new Vector2((float)scaleX[k] + fillScaleShift, (float)scaleY[k] + fillScaleShift));
                        
                        if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                            if (spriteType != "Text")
                                spriteStroke.ScaleVec(t[k].Time, new Vector2((float)scaleX[k], (float)scaleY[k]));
                            
                    scaleX.Clear();
                    scaleY.Clear();
                }
            }
        }

        public void rotation(List<AeToOsbParser.Rotation> transform, OsbSprite sprite, OsbSprite spriteStroke)
        {
            // var shiftRotation = 10;
            if (transform != null)
            {
                if (transform.Count > 1)
                {
                    var keys = transform;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            sprite.Rotate(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                spriteStroke.Rotate(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            sprite.Rotate(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                            if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                spriteStroke.Rotate(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count)
                            {
                                sprite.Rotate(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                                if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                    spriteStroke.Rotate(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                            }
                        }
                    }
                }
                else if (transform.Count <= 1)
                {
                    foreach (var keyframe in transform)
                    {
                        sprite.Rotate(keyframe.Time, MathHelper.DegreesToRadians(keyframe.Value));
                        if (shapeHasStroke && shapeHasFill && shapeType != "Path")
                                spriteStroke.Rotate(keyframe.Time, MathHelper.DegreesToRadians(keyframe.Value));
                    }
                }
            }
        }

        public void colorStroke(List<StrokeColor> color, OsbSprite sprite)
        {
            if (color != null)
            {
                if (color.Count > 1)
                {
                    var keys = color;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            // Log("1value1: " + key1 + " | value2: " + key2);
                            sprite.Color(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            sprite.Color(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count)
                            {
                                sprite.Color(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            }
                        }
                    }
                }
                else if (color.Count <= 1)
                {
                    foreach (var keyframe in color)
                    {
                        sprite.Color(keyframe.Time, spriteEnd, keyframe.Value, keyframe.Value);
                    }
                }
            }
        }

        public void colorFill(List<FillColor> color, OsbSprite sprite)
        {
            if (color != null)
            {
                if (color.Count > 1)
                {
                    var keys = color;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            // Log("1value1: " + key1 + " | value2: " + key2);
                            sprite.Color(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            sprite.Color(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count)
                            {
                                sprite.Color(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            }
                        }
                    }
                }
                else if (color.Count <= 1)
                {
                    foreach (var keyframe in color)
                    {
                        sprite.Color(keyframe.Time, spriteEnd, keyframe.Value, keyframe.Value);
                    }
                }
            }
        }

        // private Vector2 transform(Vector2 position)
        // {
        //     position = new Vector2(position.X, position.Y);
        //     return Vector2.Transform(position, Quaternion.FromEulerAngles((float)(Rotation / 180 * Math.PI), 0, 0)) + Offset;
        // }

        public void GenerateShape(bool generateStroke, bool generateFill)
        {
            // shapeType;
            // verticesPosition;
            // inTangent;
            // outTangent;
            // shapeClosed;
            // shapeSize;
            // rectRoundness;
            // posOffset;

            fillPath = "";
            strokePath = "";

            string projectPath = ProjectPath;
            if (projectPath.Contains("/"))
                projectPath = projectPath.Replace("/", @"\");

            saveFullPath = MapsetPath + "/" + sbFolderName + "/shapes/" + layerName + ".png";
            saveFullPath2 = MapsetPath + "/" + sbFolderName + "/shapes/" + layerName + "(s).png";
            var saveFolder = saveFullPath.Replace("/" + layerName + ".png", "");
            var spritePath = sbFolderName + "/shapes/" + layerName + ".png";
            var spritePath2 = sbFolderName + "/shapes/" + layerName + "(s).png";

            var bitmapFolderPath = projectPath + @"\assetlibrary\_AeToOsb\shapes";
            var bitmapPath = bitmapFolderPath + @"\" + layerName + ".png";
            var bitmapPath2 = bitmapFolderPath + @"\" + layerName + "(s).png";
            
            if (saveFullPath.Contains("/"))
                saveFullPath = saveFullPath.Replace("/", @"\");
            
            if (saveFullPath2.Contains("/"))
                saveFullPath2 = saveFullPath2.Replace("/", @"\");
            
            if (!Directory.Exists(bitmapFolderPath))
            Directory.CreateDirectory(bitmapFolderPath);
            
            if (!Directory.Exists(saveFolder))
            Directory.CreateDirectory(saveFolder);
            
            var verticesX = new List<float>();
            var verticesY = new List<float>();
            var tangentsInX = new List<float>();
            var tangentsInY = new List<float>();
            var tangentsOutX = new List<float>();
            var tangentsOutY = new List<float>();

            if (verticesPosition != null)
            {
                foreach(var pos in verticesPosition)
                {
                    verticesX.Add(pos.X);
                    verticesY.Add(pos.Y);
                }
            }

            if (inTangent != null)
            {
                foreach(var pos in inTangent)
                {
                    tangentsInX.Add(pos.X);
                    tangentsInY.Add(pos.Y);
                }
            }

            if (outTangent != null)
            {
                foreach(var pos in outTangent)
                {
                    tangentsOutX.Add(pos.X);
                    tangentsOutY.Add(pos.Y);
                }
            }

            // create empty bitmap
            float margin = 0;
            
            float width = 0;
            float height = 0;
            if (verticesPosition != null)
            {
                // get position
                Vector2 pos = new Vector2(0, 0);
                Position shapePos = spriteTransform.Position;

                // if (shapePos != null)
                //     pos = new Vector2((float)shapePos.X[0].Value, (float)shapePos.Y[0].Value);

                // calculate size
                margin = (strokeWidth * 1.5f) + 5;
                if (verticesPosition.Count == 2)
                    margin = strokeWidth;
                else if (!shapeClosed && verticesX.Count > 2)
                    margin = (strokeWidth * 1.15f);

                float widthMin = verticesX.Any() ? verticesX.Min(x => x) : 0;
                float widthMax = verticesX.Any() ? verticesX.Max(x => x) : 0;
                width = Math.Abs(widthMax - widthMin) + margin;
                if (verticesPosition.Count > 2 && !shapeClosed)
                {
                    var angle = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[0] - verticesY[1]), (verticesX[0] - verticesX[1])) - Math.PI / 2);
                    
                    if (Math.Abs(angle) < 120)
                        width = Math.Abs(widthMax - widthMin) + ((float)Math.Abs(angle) / 1.5f);
                    else width = Math.Abs(widthMax - widthMin) + ((float)Math.Abs(angle) / 2);
                }

                float heightMin = verticesY.Any() ? verticesY.Min(y => y) : 0;
                float heightMax = verticesY.Any() ? verticesY.Max(y => y) : 0;
                height = Math.Abs(heightMax - heightMin) + margin;
                if (verticesPosition.Count == 2)
                {
                    var angle = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[0] - verticesY[1]), (verticesX[0] - verticesX[1])) - Math.PI / 2);
                    
                    if (widthMin == widthMax)
                        height = Math.Abs(heightMax - heightMin);
                    else if (Math.Abs(angle) < 120)
                        height = Math.Abs(heightMax - heightMin) + ((float)Math.Abs(angle) / 1.5f);
                    else height = Math.Abs(heightMax - heightMin) + ((float)Math.Abs(angle) / 2);
                }
                else if (verticesPosition.Count > 2 && !shapeClosed)
                {
                    var angle = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[0] - verticesY[1]), (verticesX[0] - verticesX[1])) - Math.PI / 2);
                    
                    if (widthMin == widthMax)
                        height = Math.Abs(heightMax - heightMin);
                    else if (Math.Abs(angle) < 120)
                        height = Math.Abs(heightMax - heightMin) + ((float)Math.Abs(angle) / 1.5f);
                    else height = Math.Abs(heightMax - heightMin) + ((float)Math.Abs(angle) / 2);
                }

                // calculate position offset
                float shiftOffsetX = 5;
                float shiftOffsetY = 15;
                // disable possition offset...
                shiftOffsetX = 0;
                shiftOffsetY = 0;

                var leftDistanceX = Math.Abs(pos.X - (pos.X + widthMin));
                var rightDistanceX = Math.Abs((pos.X + widthMax) - pos.X);
                if (rightDistanceX > leftDistanceX)
                shapePosOffsetX = Math.Abs(rightDistanceX - leftDistanceX) + shiftOffsetX;
                else if (rightDistanceX < leftDistanceX)
                shapePosOffsetX = -Math.Abs(rightDistanceX - leftDistanceX) + shiftOffsetX;
                else if (rightDistanceX == leftDistanceX)
                shapePosOffsetX = shiftOffsetX;

                var topDistanceY = Math.Abs(pos.Y -  (pos.Y + heightMin));
                var bottomDistanceY = Math.Abs((pos.Y + heightMax) - pos.Y);
                if (bottomDistanceY > topDistanceY)
                shapePosOffsetY = -Math.Abs(bottomDistanceY - topDistanceY) + shiftOffsetY;
                else if (bottomDistanceY < topDistanceY)
                shapePosOffsetY = Math.Abs(bottomDistanceY - topDistanceY) + shiftOffsetY;
                else if (bottomDistanceY == topDistanceY)
                shapePosOffsetY = shiftOffsetY;
            }
            else
            {
                // calculate size
                margin = (strokeWidth) + 5;
                if (verticesX.Count == 2)
                    margin = strokeWidth;

                float offsetX = 0;
                float offsetY = 0.5f;

                width = shapeSize.X + margin + offsetX;
                height = shapeSize.Y + margin + offsetY;

                // Log("width: " + width);
                // Log("height: " + height);

                // position offset
                shapePosOffsetX = posOffset.X;
                shapePosOffsetY = posOffset.Y;
                // disable pos offset...
                shapePosOffsetX = 0;
                shapePosOffsetY = 0;
            }
            
            // Log("width: " + width + "  |  height: " + height);

            if (File.Exists(bitmapPath))
                File.Delete(bitmapPath);

            if (File.Exists(bitmapPath2))
                File.Delete(bitmapPath2);

            if (!File.Exists(bitmapPath))
                File.Copy(projectPath + @"\assetlibrary\_AeToOsb\b.png", bitmapPath);

            if (!File.Exists(bitmapPath2))
                File.Copy(projectPath + @"\assetlibrary\_AeToOsb\b.png", bitmapPath2);
            
            
            if (File.Exists(bitmapPath)) ResizeImage(bitmapPath, new Vector2(width, height));
                System.Drawing.Image bitmap = Image.FromFile(bitmapPath);
            
            if (File.Exists(bitmapPath2)) ResizeImage(bitmapPath2, new Vector2(width, height));
                System.Drawing.Image bitmap2 = Image.FromFile(bitmapPath2);

            Graphics graphics = Graphics.FromImage(bitmap);
            Graphics graphics2 = Graphics.FromImage(bitmap2);
            GraphicsPath path = new GraphicsPath();
            GraphicsPath path2 = new GraphicsPath();
            GraphicsPath path3 = new GraphicsPath();
            
            // draw path
            path.StartFigure();
            path2.StartFigure();
            path3.StartFigure();

            if (verticesPosition != null)
            {
                List<float> pointsX = new List<float>();
                List<float> pointsY = new List<float>();
                List<float> ctrlPointInX = new List<float>();
                List<float> ctrlPointInY = new List<float>();
                List<float> ctrlPointOutX = new List<float>();
                List<float> ctrlPointOutY = new List<float>();

                foreach(var point in verticesX)
                    pointsX.Add(point + (width / 2));
                foreach(var point in verticesY)
                    pointsY.Add(point + (height / 2));
                foreach(var tangent in tangentsInX)
                    ctrlPointInX.Add(tangent);
                foreach(var tangent in tangentsInY)
                    ctrlPointInY.Add(tangent);
                foreach(var tangent in tangentsOutX)
                    ctrlPointOutX.Add(tangent);
                foreach(var tangent in tangentsOutY)
                    ctrlPointOutY.Add(tangent);

                // List<PointF> points = new List<PointF>();

                for (int i = 0; i < pointsX.Count; i++)
                {
                    // Log("i: " + i + "  |  pointsX[i]: " + pointsX[i]);

                    List<float> ctrlPointsX = new List<float>();
                    List<float> ctrlPointsY = new List<float>();

                    if (ctrlPointInX[i] >= 0) {
                        ctrlPointsX.Add(ctrlPointInX[i]); // x
                        ctrlPointsX.Add(ctrlPointOutX[i]); // x
                    }
                    else
                    {
                        ctrlPointsX.Add(ctrlPointInX[i]); // x
                        ctrlPointsX.Add(ctrlPointOutX[i]); // x
                    }

                    if (ctrlPointInX[i] >= 0) {
                        ctrlPointsY.Add(ctrlPointInY[i]); // y
                        ctrlPointsY.Add(ctrlPointOutY[i]); // y
                    }
                    else
                    {
                        ctrlPointsY.Add(ctrlPointInY[i]); // y
                        ctrlPointsY.Add(ctrlPointOutY[i]); // y
                    }
                    int a = i;
                    int n = i;
                    if (i == 0) n = i + 1;
                    if (i > 0) a = i - 1;

                    float offsetX = -3;
                    float offsetY = -5;
                    if (verticesX.Count == 2)
                    {
                        offsetX = 0;
                        offsetY = 0;
                    }
                    if (verticesPosition.Count > 2 && !shapeClosed)
                    {
                        var angle = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[0] - verticesY[1]), (verticesX[0] - verticesX[1])) - Math.PI / 2);
                        var angle2 = MathHelper.RadiansToDegrees(Math.Atan2((verticesY[1] - verticesY[2]), (verticesX[1] - verticesX[2])) - Math.PI / 2);
                        var deltaA = Math.Abs(angle2 - angle);
                        
                        if (Math.Abs(angle) > 90)
                        {
                            offsetX = offsetX - (strokeWidth / 2) + 5;
                            offsetY = offsetY - (strokeWidth / 2) + 5;
                        }
                    }

                    PointF pointStart = new PointF(pointsX[a] + offsetX, pointsY[a] + offsetY);
                    PointF pointEnd = new PointF(pointsX[n] + offsetX, pointsY[n] + offsetY);
        
                    // PointF controlPointIn = new PointF(pointsX[a] + ctrlPointsX[0], pointsY[a] + ctrlPointsY[0]);
                    // PointF controlPointOut = new PointF(pointsX[n] + ctrlPointsX[1], pointsY[n] + ctrlPointsY[1]);

                    // path.AddBezier(pointStart, controlPointIn, controlPointOut, pointEnd);
                    
                    if (generateFill)
                        path.AddLine(pointStart, pointEnd);
                    if (generateStroke)
                        path3.AddLine(pointStart, pointEnd);

                    // PointF point = new PointF(pointsX[i], pointsY[i]);
                    // points.Add(point);
                }
            }
            else {
                float offset = -3f;
                float offset2 = -3f;
                float m = margin - 1.5f;
                float m2 = margin;

                float s1 = strokeWidth - (strokeWidth / 4);
                float s2 = 0;
                float s3 = strokeWidth / 2 - 2f;
                float s4 = strokeWidth / 2;
                if (shapeFillComposite == "Below")
                {
                    if (shapeHasStroke)
                    {
                        offset = 0;
                        m = (margin / 2) * 2 - 1.5f;
                        s2 = 0 - strokeWidth;
                        s4 = 0 + 1f;
                    }
                    
                    offset2 = 0;
                    m2 = (margin / 2) * 2 - 2;
                    s1 = strokeWidth / 2 + 1f;
                    s3 = 0;
                }

                if (shapeType == "Rectangle")
                {
                    // if (rectRoundness > 0)
                    // {
                    //     PointF rectPos = new PointF((float)Math.Floor(m) + offset, (float)Math.Floor(m) + offset);
                    //     SizeF rectSize = new SizeF(shapeSize.X, shapeSize.Y);

                    //     RoundedRect(path, rectPos, rectSize, rectRoundness);
                    // }
                    // else
                    // {
                    PointF rectPos = new PointF((float)Math.Floor(m) + offset - s4, (float)Math.Floor(m) + offset - s4);
                    PointF rectPos2 = new PointF((float)Math.Floor(m2) + offset2 - s1, (float)Math.Floor(m2) + offset2 - s1);
                    SizeF rectSize = new SizeF(shapeSize.X + s2, shapeSize.Y + s2);
                    SizeF rectSize2 = new SizeF(shapeSize.X + s3, shapeSize.Y + s3);
                    RectangleF rectangle = new RectangleF(rectPos, rectSize);
                    RectangleF rectangle2 = new RectangleF(rectPos2, rectSize2);
                    
                    if (generateFill)
                        path.AddRectangle(rectangle);
                    if (generateStroke)
                        path2.AddRectangle(rectangle2);
                    // }
                }
                if (shapeType == "Ellipse")
                {
                    PointF ellipsePos = new PointF((float)Math.Floor(m) + offset - s4, (float)Math.Floor(m) + offset - s4);
                    PointF ellipsePos2 = new PointF((float)Math.Floor(m2) + offset2 - s1, (float)Math.Floor(m2) + offset2 - s1);
                    SizeF ellipseSize = new SizeF(shapeSize.X + s2, shapeSize.Y + s2);
                    SizeF ellipseSize2 = new SizeF(shapeSize.X + s3, shapeSize.Y + s3);
                    RectangleF ellipse = new RectangleF(ellipsePos, ellipseSize);
                    RectangleF ellipse2 = new RectangleF(ellipsePos2, ellipseSize2);

                    if (generateFill)
                        path.AddEllipse(ellipse);
                    if (generateStroke)
                        path2.AddEllipse(ellipse2);
                }
            }

            if (shapeClosed)
            {
                path.CloseFigure();
                path2.CloseFigure();
                path3.CloseFigure();
            }

            // shapeHasStroke;
            // shapeStrokeColor;
            // strokeWidth;
            // lineCap;
            // lineJoin;
            // lineMiterLimit;
            // hasDash;
            // dashSpacing;
            // dashOffset;

            // shapeHasFill;
            // shapeFillComposite;
            // FillColor;

            // stroke color
            Pen stroke = new Pen(Brushes.White);

            if (shapeStrokeColor != null)
            {
                Color sColor = System.Drawing.ColorTranslator.FromHtml(shapeStrokeColor[0].Value);
                Brush sColorBrush = new SolidBrush(sColor);
                
                if (shapeType == "Path")
                stroke = new Pen(sColorBrush);
            }
            
            if (shapeType == "Path")
                stroke.Width = strokeWidth;
            else
            {
                if (shapeFillComposite == "Above")
                    stroke.Width = strokeWidth / 2;
                else stroke.Width = strokeWidth;
            }

            if (lineJoin == "Miter")
            {
                stroke.LineJoin = LineJoin.Miter;
                stroke.MiterLimit = lineMiterLimit;
            }
            if (lineJoin == "Round")
                stroke.LineJoin = LineJoin.Round;
            if (lineJoin == "Bevel")
                stroke.LineJoin = LineJoin.Bevel;
            else stroke.LineJoin = LineJoin.Miter;

            if (hasDash)
            {
                stroke.DashStyle = DashStyle.Dash;
                stroke.DashOffset = dashOffset;
            }
            
            // fill color
            Brush fillColor = Brushes.White;

            if (shapeFillColor != null)
            {
                Color fColor = System.Drawing.ColorTranslator.FromHtml(shapeFillColor[0].Value);
                SolidBrush fColorBrush = new SolidBrush(fColor);

                if (shapeType == "Path")
                fillColor = fColorBrush;
            }

            graphics.SmoothingMode = SmoothingMode.HighQuality;
            // graphics.FillPolygon(fillColor, points.ToArray());
            if (shapeFillComposite == "Above")
            {
                if (generateStroke)
                    graphics.DrawPath(stroke, path3);
                if (generateFill)
                    graphics.FillPath(fillColor, path);
            }
            else
            {
                if (generateFill)
                    graphics.FillPath(fillColor, path);
                if (generateStroke)
                    graphics.DrawPath(stroke, path3);
            }

            graphics2.SmoothingMode = SmoothingMode.AntiAlias;
            graphics2.DrawPath(stroke, path2);
            graphics.Dispose();
            graphics2.Dispose();
            
            bitmap.Save(saveFullPath);
            bitmap2.Save(saveFullPath2);
            bitmap.Dispose();
            bitmap2.Dispose();

            if (File.Exists(bitmapPath))
                File.Delete(bitmapPath);

            if (File.Exists(bitmapPath2))
                File.Delete(bitmapPath2);

            if (!File.Exists(bitmapPath))
                File.Copy(saveFullPath, bitmapPath);

            if (!File.Exists(bitmapPath2))
                File.Copy(saveFullPath2, bitmapPath2);

            fillPath = spritePath;
            strokePath = spritePath2;

            if (!generateFill)
            {
                if (File.Exists(bitmapPath))
                    File.Delete(bitmapPath);
                if (File.Exists(spritePath))
                    File.Delete(spritePath);
            }
            if (!generateStroke)
            {
                if (File.Exists(bitmapPath2))
                    File.Delete(bitmapPath2);
                if (File.Exists(spritePath2))
                    File.Delete(spritePath2);
            }
        }
        
        public static GraphicsPath RoundedRect(GraphicsPath path, PointF pos, SizeF size, float radius)
        {
            // float diameter = radius * 2;
            float diameter = size.Width / 2;
            RectangleF arc = new RectangleF(pos, size);
            
            var topRight = size.Width / 2;
            var bottomLeft = size.Height / 2;
            var bottomRight = size.Width / 2;

            // top left arc
            path.AddArc(arc, 180, 90);

            // top right arc
            arc.X = arc.X + topRight - diameter;
            path.AddArc(arc, 270, 90);

            // bottom right arc
            arc.Y = arc.Y + bottomLeft - diameter;
            path.AddArc(arc, 0, 90);

            // bottom left arc
            arc.X = arc.X; // + bottomRight;
            path.AddArc(arc, 90, 90);

            path.CloseFigure();
            return path;
        }

        public void ResizeImage(string fileName, Vector2 scale)
        {
            var fileName2 = fileName.Insert(fileName.LastIndexOf('.')," (r)");

            using (Image image = Image.FromFile(fileName))
            {
                new System.Drawing.Bitmap(image, (int)scale.X, (int)scale.Y).Save(fileName2);
            }

            if (File.Exists(fileName))
                File.Delete(fileName);
            
            if (!File.Exists(fileName) && File.Exists(fileName2))
                File.Copy(fileName2, fileName);

            if (File.Exists(fileName2))
                File.Delete(fileName2);
        }

        public int[] GenerateRgba(string hex)
        {
            Color color = ColorTranslator.FromHtml(hex);
            int r = Convert.ToInt16(color.R);
            int g = Convert.ToInt16(color.G);
            int b = Convert.ToInt16(color.B);
            int[] rgb = new int[] { r, g, b };
            return rgb;
        }

        public void Grid(bool showGrid, float gridOpacity)
        {
            if (showGrid)
            {
                var gridBitmap = GetProjectBitmap("assetlibrary\\_AeToOsb\\grid.png");
                var path = aeToOsbSettings.ScriptslibraryFolderPath.Replace("scriptslibrary", "assetlibrary\\_AeToOsb\\grid.png");
                var grid = GetLayer("GridOverlay").CreateSprite(path, origin);
                grid.Fade(compStart, compEnd, gridOpacity, gridOpacity);
                grid.Scale(compStart, 480.0f / gridBitmap.Height);
            }
        }
    }
}
