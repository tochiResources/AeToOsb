using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace AeStoryboardSettings
{
    public partial class AeToOsbSettings
    {
        [JsonProperty("scriptslibraryFolderPath")]
        public string ScriptslibraryFolderPath { get; set; }

        [JsonProperty("outputFolderPath")]
        public string OutputFolderPath { get; set; }

        [JsonProperty("options")]
        public Options Options { get; set; }

        [JsonProperty("settingsJsonFile")]
        public string SettingsJsonFile { get; set; }

        [JsonProperty("scriptFileFolderPath")]
        public string ScriptFileFolderPath { get; set; }

        [JsonProperty("exportedComps")]
        public object ExportedComps { get; set; }

        [JsonProperty("exportedCompsID")]
        public object ExportedCompsId { get; set; }
    }

    public partial class Options
    {
        [JsonProperty("exportJsonOnly")]
        public bool ExportJsonOnly { get; set; }

        [JsonProperty("exportTextPerLetter")]
        public bool ExportTextPerLetter { get; set; }

        [JsonProperty("allProjectSourceFiles")]
        public bool AllProjectSourceFiles { get; set; }

        [JsonProperty("textLayers")]
        public bool TextLayers { get; set; }

        [JsonProperty("imageLayers")]
        public bool ImageLayers { get; set; }

        [JsonProperty("ThreeDLayers")]
        public bool ThreeDLayers { get; set; }

        [JsonProperty("unsupportedLayers")]
        public bool UnsupportedLayers { get; set; }

        [JsonProperty("OpenOutputFolderBeforeRendering")]
        public bool OpenOutputFolderBeforeRendering { get; set; }
    }

    public partial class AeToOsbSettings
    {
        public static AeToOsbSettings FromJson(string json) => JsonConvert.DeserializeObject<AeToOsbSettings>(json, AeStoryboardSettings.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this AeToOsbSettings self) => JsonConvert.SerializeObject(self, AeStoryboardSettings.Converter.Settings);
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
