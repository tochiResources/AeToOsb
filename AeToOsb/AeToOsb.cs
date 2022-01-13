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
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace StorybrewScripts
{
    public class AeToOsb : StoryboardObjectGenerator
    {
        [Configurable]
        public string pathSettings = ".../AeToOsb/settings.json";

        [Configurable]
        public Vector2 downScaleOffset = new Vector2(-107, 0);

        [Configurable]
        public Vector2 offsetText = new Vector2(0, 0);

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
        private List<OsbSprite> spriteLibrary;
        private List<OsbSprite> nullLibrary;
        private OsbSprite nullItem;
        private int spriteIndex;
        private string name;
        private string layerFileName;
        private int id;
        private bool hasParent;
        private string parentName;
        private int parentId;
        private string spriteType;
        private string spriteLayer;
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

        public override void Generate()
        {
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

            Log("--- Nulls ---" + "\r\n" + nullLibrary.Count + "\r\n" + "\r\n" +
                "--- " + spriteLibrary.Count + " sprites were generated ---");
            for (var s = 0; s < spriteLibrary.Count; s++) {
                var n = s + 1;
                Log("- " + n +  ": " + spriteLibrary[s].TexturePath);
            }
        }

        public OsbSprite Storyboard(bool returnSprites)
        {
            nullLibrary = new List<OsbSprite>();
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

                            id = compLayer.Id;
                            hasParent = compLayer.HasParent;
                            if (hasParent)
                            {
                                parentName = compLayer.ParentName;
                                parentId = compLayer.ParentID;
                            }

                            layerFileName = compLayer.FileName;
                            spriteType = compLayer.Type;
                            spriteLayer = compLayer.LayerLayer;

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
                                        font = FontGenerator(textOutputFolder + "/characters");
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
                                                        sprite = GetLayer(name + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(texture.Path, origin);

                                                        // fade
                                                        fade(charaTransform.Fade, sprite);
                                                        // position x
                                                        moveX(charaTransform.Position, sprite);
                                                        // position y
                                                        moveY(charaTransform.Position, sprite);
                                                        // scale
                                                        scale(charaTransform.Scale, sprite);
                                                        // rotation
                                                        rotation(spriteTransform.Rotation, sprite);
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
                                sprite = GetLayer(name + ": " + spriteLayer + ": " + spriteIndex).CreateSprite("sb/" + layerFileName, origin);
                                
                                // fade
                                fade(spriteTransform.Fade, sprite);
                                // position x
                                moveX(spriteTransform.Position, sprite);
                                // position y
                                moveY(spriteTransform.Position, sprite);
                                // scale
                                scale(spriteTransform.Scale, sprite);
                                // rotation
                                rotation(spriteTransform.Rotation, sprite);
                                // additive
                                if (spriteAdditive)
                                additive(sprite, spriteStart, spriteEnd);

                                if (spriteType != "NullLayer") spriteLibrary.Add(sprite);
                                if (spriteType == "NullLayer") nullLibrary.Add(sprite);
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
                                    font = FontGenerator(textOutputFolder);

                                    sentenceTexture = font.GetTexture(text.ToString());

                                    texture = font.GetTexture(text);
                                    if (!texture.IsEmpty)
                                    {
                                        sprite = new OsbSprite();
                                        sprite = GetLayer(name + ": " + spriteLayer + ": " + spriteIndex).CreateSprite(texture.Path, origin);

                                        // fade
                                        fade(spriteTransform.Fade, sprite);
                                        // position x
                                        moveX(spriteTransform.Position, sprite);
                                        // position y
                                        moveY(spriteTransform.Position, sprite);
                                        // scale
                                        scale(spriteTransform.Scale, sprite);
                                        // rotation
                                        rotation(spriteTransform.Rotation, sprite);
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
                                    var audioSprite = GetLayer(name + ": " + spriteLayer + ": " + spriteIndex).CreateSample(layerFileName, (double)compLayer.StartTime, samplesVolume);
                                }
                            }
                        }
                    }
                }
                if (spriteType == "NullLayer") sprite = nullItem;
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

        public void fade(List<Fade> transform, OsbSprite sprite)
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
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            sprite.Fade(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count)
                            sprite.Fade(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value, keys[key2].Value);
                        }
                    }
                }
                else if (transform.Count <= 1)
                {
                    foreach (var keyframe in transform)
                    {
                        sprite.Fade(keyframe.Time, keyframe.Value);
                    }
                }
            }
        }

        public void moveX(Position transform, OsbSprite sprite)
        {
            if (transform != null)
            {
                if (transform.X.Count > 1)
                {
                    var keys = transform.X;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            if (spriteType == "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.X + offsetText.X, (keys[key2].Value * downScale) + downScaleOffset.X + offsetText.X);
                            if (spriteType != "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.X, (keys[key2].Value * downScale) + downScaleOffset.X);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            // key1 = key1 + 1; key2 = key2 + 1;
                            if (spriteType == "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.X + offsetText.X, (keys[key2].Value * downScale) + downScaleOffset.X + offsetText.X);
                            if (spriteType != "Text")
                            sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.X, (keys[key2].Value * downScale) + downScaleOffset.X);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count) {
                                if (spriteType == "Text")
                                sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.X + offsetText.X, (keys[key2].Value * downScale) + downScaleOffset.X + offsetText.X);
                                if (spriteType != "Text")
                                sprite.MoveX(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.X, (keys[key2].Value * downScale) + downScaleOffset.X);
                            }
                        }
                    }
                }
                else if (transform.X.Count <= 1)
                {
                    foreach (var keyframe in transform.X)
                    {
                        if (spriteType == "Text")
                        sprite.MoveX(keyframe.Time, (keyframe.Value * downScale) + downScaleOffset.X + offsetText.X);
                        if (spriteType != "Text")
                        sprite.MoveX(keyframe.Time, (keyframe.Value * downScale) + downScaleOffset.X);
                    }
                }
            }
        }

        public void moveY(Position transform, OsbSprite sprite)
        {
            if (transform != null)
            {
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
                            if (spriteType == "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset, (keys[key2].Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset);
                            if (spriteType != "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.Y, (keys[key2].Value * downScale) + downScaleOffset.Y);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            // key1 = key1 + 1; key2 = key2 + 1;
                            if (spriteType == "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset, (keys[key2].Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset);
                            if (spriteType != "Text")
                            sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.Y, (keys[key2].Value * downScale) + downScaleOffset.Y);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count) {
                                if (spriteType == "Text")
                                sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset, (keys[key2].Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset);
                                if (spriteType != "Text")
                                sprite.MoveY(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) + downScaleOffset.Y, (keys[key2].Value * downScale) + downScaleOffset.Y);
                            }
                        }
                    }
                }
                else if (transform.Y.Count <= 1)
                {
                    foreach (var keyframe in transform.Y)
                    {
                        if (spriteType == "Text")
                        sprite.MoveY(keyframe.Time, (keyframe.Value * downScale) + downScaleOffset.Y + offsetText.Y + letterHeightOffset);
                        if (spriteType != "Text")
                        sprite.MoveY(keyframe.Time, (keyframe.Value * downScale) + downScaleOffset.Y);
                    }
                }
            }
        }

        public void scale(Scale transform, OsbSprite sprite)
        {
            // scale
            if (transform != null)
            {
                if (transform.X.Count > 1)
                {
                    var keys = transform.X;
                    for (int key1 = 0, key2 = 1; key1 < keys.Count; key1++, key2++)
                    {
                        if (key1 == 0 && key1 < key2 && keys.Count % 2 == 0)
                        {
                            // Log("1value1: " + key1 + " | value2: " + key2);
                            if (spriteType == "Text")
                                sprite.Scale(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) * fontScaleShift, (keys[key2].Value * downScale) * fontScaleShift);
                            if (spriteType != "Text")
                                sprite.Scale(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, keys[key1].Value * downScale, keys[key2].Value * downScale);
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            if (spriteType == "Text")
                                sprite.Scale(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) * fontScaleShift, (keys[key2].Value * downScale) * fontScaleShift);
                            if (spriteType != "Text")
                                sprite.Scale(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value * downScale, keys[key2].Value * downScale);
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count) {
                                if (spriteType == "Text")
                                    sprite.Scale(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, (keys[key1].Value * downScale) * fontScaleShift, (keys[key2].Value * downScale) * fontScaleShift);
                                if (spriteType != "Text")
                                    sprite.Scale(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, keys[key1].Value * downScale, keys[key2].Value * downScale);
                            }
                        }
                    }
                }
                else if (transform.X.Count <= 1)
                {
                    foreach (var keyframe in transform.X)
                    {
                        if (spriteType == "Text")
                            sprite.Scale(keyframe.Time, (keyframe.Value * downScale) * fontScaleShift);
                        if (spriteType != "Text")
                            sprite.Scale(keyframe.Time, keyframe.Value * downScale);
                    }
                }
            }
        }

        public void rotation(List<AeToOsbParser.Rotation> transform, OsbSprite sprite)
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
                        }
                        else if (key2 > 1 && key2 + 1 < keys.Count && keys.Count % 2 == 0)
                        {
                            key1 = key1 + 1; key2 = key2 + 1;
                            sprite.Rotate(OsbEasing.None, keys[key1].Time + frameDuration, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                            // Log("2value1: " + key1 + " | value2: " + key2);
                        }
                        else {
                            if (key2 < keys.Count)
                            sprite.Rotate(OsbEasing.None, keys[key1].Time, keys[key2].Time + frameDuration, MathHelper.DegreesToRadians(keys[key1].Value), MathHelper.DegreesToRadians(keys[key2].Value));
                        }
                    }
                }
                else if (transform.Count <= 1)
                {
                    foreach (var keyframe in transform)
                    {
                        sprite.Rotate(keyframe.Time, MathHelper.DegreesToRadians(keyframe.Value));
                    }
                }
            }
        }

        // private Vector2 transform(Vector2 position)
        // {
        //     position = new Vector2(position.X, position.Y);
        //     return Vector2.Transform(position, Quaternion.FromEulerAngles((float)(Rotation / 180 * Math.PI), 0, 0)) + Offset;
        // }

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
