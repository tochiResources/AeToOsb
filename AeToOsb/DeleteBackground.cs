using OpenTK;
using OpenTK.Graphics;
using StorybrewCommon.Mapset;
using StorybrewCommon.Scripting;
using StorybrewCommon.Storyboarding;
using StorybrewCommon.Storyboarding.Util;
using StorybrewCommon.Subtitles;
using StorybrewCommon.Util;
using System;
using System.Collections.Generic;
using System.Linq;

namespace StorybrewScripts
{
    public class DeleteBackground : StoryboardObjectGenerator
    {
        public override void Generate()
        {
            var BgPath = Beatmap.BackgroundPath;
		    var Sprite = GetLayer("MainBackground").CreateSprite(BgPath);

            Sprite.Fade(0, 0);
        }
    }
}
