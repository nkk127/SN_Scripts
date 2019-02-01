(function runTransformScript(source, map, log, target /*undefined onStart*/ ) {
	//determine if location is already available
	var city = source.u_l.toString().trim();
	var street = source.u_streetaddress.toString().trim();
	var postalCode = source.u_postalcode.toString().trim();
	var state = source.u_st.toString().trim();
	var loc = new GlideRecord('cmn_location');
	var name = '';
	loc.addQuery('city',city);
	loc.addQuery('state',state);
	loc.addQuery('street',street);
	loc.addQuery('zip',postalCode);
	loc.query();
	if(loc.next()){
		target.location = loc.getUniqueValue();
	}
	//create a location record and assign to the user
	else {
		var create_loc = new GlideRecord('cmn_location');
		var loc_sysid = '';
		create_loc.initialize();
		create_loc.city = city;
		create_loc.state = state;
		create_loc.zip = postalCode;
		create_loc.street = street;
		
		/*if(city && street)
		name = street + ' - ' + city;
		else if(city && !street)
			name = city;
		else if (!city && street)
			name = street;
		else if (!city && !street)
			name = state;*/
		var locName = '';
		
		var locParts = [];
		locParts.push(street);
		locParts.push(city);
		locParts.push(state);
		
		for (var i = 0; i< locParts.length; i++) {
			var locPart = locParts[i].toString();
			if (!gs.nil(locPart)) {
				if (locName == '') {
					locName += locPart;
				} else {
					locName += ' - ' + locPart;
				}
			}
		}
		
		create_loc.name = locName ;
		loc_sysid = create_loc.insert();
		target.location = loc_sysid;
	}
	
})(source, map, log, target);
