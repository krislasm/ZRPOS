sap.ui.define([], function() {
	"use strict";

	return {

		formatTransDate: function(d) {
			if(d)
			{
			var y = d.substr(0,4);
			var m = d.substr(4,2);
			var day = d.substr(6,2);
			return day + "." + m + "." + + y;
			}
			else
			{
				return "";
			}
		}
	/*	formatInfo: function(o,c){
			var info = "";
			if(o !== "")
			{
				info = "Opening Balance: " + o +"IDR"; 
			}
			if(c !== "")
			{
				info = info + "and Closing Balance: " + c + "IDR";
			}
			return info;
		}*/
	};

});