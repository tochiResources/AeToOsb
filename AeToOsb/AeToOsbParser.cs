using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace AeToOsbParser
{
    public partial class AeStoryboard
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("compID")]
        public int CompId { get; set; }

        [JsonProperty("startTime")]
        public int StartTime { get; set; }

        [JsonProperty("endTime")]
        public int EndTime { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("frameRate")]
        public float FrameRate { get; set; }

        [JsonProperty("frameDuration")]
        public float FrameDuration { get; set; }

        [JsonProperty("compBitmap")]
        public Bitmap CompBitmap { get; set; }

        [JsonProperty("layers")]
        public List<Layer> Layers { get; set; }
    }

    public partial class Bitmap
    {
        [JsonProperty("width")]
        public float Width { get; set; }

        [JsonProperty("height")]
        public float Height { get; set; }
    }

    public partial class Layer
    {
        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("hasParent")]
        public bool HasParent { get; set; }

        [JsonProperty("parentName")]
        public string ParentName { get; set; }

        [JsonProperty("parentID")]
        public int ParentID { get; set; }

        [JsonProperty("visible")]
        public bool Visible { get; set; }

        [JsonProperty("startTime")]
        public int StartTime { get; set; }

        [JsonProperty("endTime")]
        public int EndTime { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("layer")]
        public string LayerLayer { get; set; }

        [JsonProperty("additive")]
        public bool Additive { get; set; }

        [JsonProperty("transform")]
        public Transform Transform { get; set; }

        [JsonProperty("text", NullValueHandling = NullValueHandling.Ignore)]
        public Text Text { get; set; }

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string FileName { get; set; }

        [JsonProperty("layerName", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }
    }

    public partial class Text
    {
        [JsonProperty("text")]
        public string TextText { get; set; }

        [JsonProperty("fontName")]
        public string FontName { get; set; }

        [JsonProperty("fontFamily")]
        public string FontFamily { get; set; }

        [JsonProperty("fontSize")]
        public float FontSize { get; set; }

        [JsonProperty("fontStyle")]
        public string FontStyle { get; set; }

        [JsonProperty("lineHeight")]
        public double LineHeight { get; set; }

        [JsonProperty("lineSpacing")]
        public float LineSpacing { get; set; }

        [JsonProperty("lineSpacingOffset")]
        public List<LineSpacingOffset> LineSpacingOffset { get; set; }

        [JsonProperty("alignment")]
        public string Alignment { get; set; }

        [JsonProperty("hasColorFill")]
        public bool HasColorFill { get; set; }

        [JsonProperty("color")]
        public string Color { get; set; }

        [JsonProperty("hasStroke")]
        public bool HasStroke { get; set; }

        [JsonProperty("strokeColor")]
        public string StrokeColor { get; set; }

        [JsonProperty("strokeThickness")]
        public float StrokeThickness { get; set; }

        [JsonProperty("hasCharacters")]
        public bool HasCharacters { get; set; }

        [JsonProperty("characters")]
        public List<Characters> Characters { get; set; }
    }

    public partial class LineSpacingOffset
    {
        [JsonProperty("time")]
        public int Time { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }

    public partial class Characters
    {
        [JsonProperty("text")]
        public string TextText { get; set; }

        [JsonProperty("fontName")]
        public string FontName { get; set; }

        [JsonProperty("fontFamily")]
        public string FontFamily { get; set; }

        [JsonProperty("fontSize")]
        public float FontSize { get; set; }

        [JsonProperty("fontStyle")]
        public string FontStyle { get; set; }

        [JsonProperty("alignment")]
        public string Alignment { get; set; }

        [JsonProperty("hasColorFill")]
        public bool HasColorFill { get; set; }

        [JsonProperty("color")]
        public string Color { get; set; }

        [JsonProperty("hasStroke")]
        public bool HasStroke { get; set; }

        [JsonProperty("strokeColor")]
        public string StrokeColor { get; set; }

        [JsonProperty("strokeThickness")]
        public float StrokeThickness { get; set; }

        [JsonProperty("transform")]
        public Transform Transform { get; set; }
    }

    public partial class Transform
    {
        [JsonProperty("origin")]
        public string Origin { get; set; }

        [JsonProperty("threeD", NullValueHandling = NullValueHandling.Ignore)]
        public bool? ThreeD { get; set; }

        [JsonProperty("threeDPerChar", NullValueHandling = NullValueHandling.Ignore)]
        public bool? ThreeDPerChar { get; set; }

        [JsonProperty("layerBitmap", NullValueHandling = NullValueHandling.Ignore)]
        public Bitmap LayerBitmap { get; set; }

        [JsonProperty("fade", NullValueHandling = NullValueHandling.Ignore)]
        public List<Fade> Fade { get; set; }

        [JsonProperty("position", NullValueHandling = NullValueHandling.Ignore)]
        public Position Position { get; set; }

        [JsonProperty("scale", NullValueHandling = NullValueHandling.Ignore)]
        public Scale Scale { get; set; }

        [JsonProperty("rotation", NullValueHandling = NullValueHandling.Ignore)]
        public List<Rotation> Rotation { get; set; }

        [JsonProperty("isRotating", NullValueHandling = NullValueHandling.Ignore)]
        public bool IsRotating { get; set; }
    }

    public partial class Fade
    {
        [JsonProperty("time")]
        public int Time { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }

    public partial class Rotation
    {
        [JsonProperty("time")]
        public int Time { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }

    public partial class Scale
    {
        [JsonProperty("x")]
        public List<X> X { get; set; }

        [JsonProperty("y")]
        public List<Y> Y { get; set; }
    }

    public partial class Position
    {
        [JsonProperty("x")]
        public List<X> X { get; set; }

        [JsonProperty("y")]
        public List<Y> Y { get; set; }
    }

    public partial class X
    {
        [JsonProperty("time")]
        public int Time { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }

    public partial class Y
    {
        [JsonProperty("time")]
        public int Time { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }

    public partial class AeStoryboard
    {
        public static List<AeStoryboard> FromJson(string json) => JsonConvert.DeserializeObject<List<AeStoryboard>>(json, AeToOsbParser.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this List<AeStoryboard> self) => JsonConvert.SerializeObject(self, AeToOsbParser.Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}