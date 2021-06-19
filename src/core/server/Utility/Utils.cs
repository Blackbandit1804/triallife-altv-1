﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace triallife.Utility {
	public class Utils {

		public static T deepCLoneObject<T>(object data) {
			return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(data));
		}
	}
}
