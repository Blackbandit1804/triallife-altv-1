using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Helper {
	public class Design {
		public int sex { get; set; }
		public int faceFather { get; set; }
		public int faceMother { get; set; }
		public int skinFather { get; set; }
		public int skinMother { get; set; }
		public double faceMix { get; set; }
		public double skinMix { get; set; }
		public List<int> structure { get; set; }
		public int hair { get; set; }
		public int hairColor1 { get; set; }
		public int hairColor2 { get; set; }
		public Dictionary<string, string> hairOverlay { get; set; } = new Dictionary<string, string>() { { "overlay", "" }, { "collection", "" } };
		public int facialHair { get; set; }
		public int facialHairColor1 { get; set; }
		public double facialHairOpacity { get; set; }
		public int eyebrows { get; set; }
		public double eyebrowsOpacity { get; set; }
		public int eyebrowsColor1 { get; set; }
		public int eyes { get; set; }
		public List<DesignInfo> opacityOverlays { get; set; }
		public List<ColorInfo> colorOverlays { get; set; }
}

	public class DesignInfo {
		public int id { get; set; }
		public int value { get; set; }
		public double opacity { get; set; }
		public string collection { get; set; }
		public string overlay { get; set; }
	}

	public class ColorInfo {
		public int id { get; set; }
		public int value { get; set; }
		public int color1 { get; set; }
		public int color2 { get; set; }
		public double opacity { get; set; }

	}
}
