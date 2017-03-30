this.onmessage = function(e) {
	console.log(e.data);
	var distance = haversine(e.data.lat1, e.data.lng1, e.data.lat2, e.data.lng2);
	this.postMessage({distance: distance});
};

function haversine(lat1, lng1, lat2, lng2) {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
	
	var R = 6371e3; // metres
	//console.log("R: " + R);
	var φ1 = lat1.toRad();
	//console.log("φ1: " + φ1);
	var φ2 = lat2.toRad();
	//console.log("φ2: " + φ2);
	var Δφ = (lat2-lat1).toRad();
	//console.log("Δφ: " + Δφ);
	var Δλ = (lng2-lng1).toRad();
	
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ/2) * Math.sin(Δλ/2);
	//console.log("a: " + a);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	//console.log("c: " + c);
	
	var d = R * c;
	d = (d/1000).toFixed(2) + "km";
	//console.log("d: " + d);
	return d;
}