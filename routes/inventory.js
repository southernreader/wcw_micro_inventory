
module.exports = function(app) {

	app.get('/inventory/:facility_id/:item_id/:facility_type/:filter/:filter_value', function(req, res, next) {
		var inventory = app.get('inventory');
		var facility_id = req.params.facility_id;
		var item_id = req.params.item_id;
		var item_status = req.params.item_status;
		var facility_type = req.params.facility_type;
		var filter = req.params.filter;
		var filter_value = req.params.filter_value;

		var condition = {};
		var fields = {};
		condition.where ={};  
		//console.log("facility_id ",facility_id, "item_id ",item_id, "item_status ",item_status, "facility_type ",facility_type);
		if (facility_id != "undefined" && facility_id != "null") condition.where.Facility_Name = {$eq: facility_id};
		if (item_id !="undefined" && item_id != "null")	condition.where.Item_ID = {$eq: item_id};
		//if (item_status !=null)	condition.where.Facility_Type = {$eq: facility_type};
		//if (facility_type !="WHST")	condition.where.Facility_Type = {$eq: facility_type};
		if (filter != "undefined" && filter != "null") condition.where.$or = [{'Distro_Number': filter_value},{'PO_Number': filter_value},{'ASN_Number': filter_value}];

		fields = 
					{'_id':0,'Facility_Name':1, 'Item_ID':1,'Item_Description':1,
					'Location_ID':1, 'Hot_Inventory':1,
					'Distro_Number':1,'PO_Number':1,'ASN_Number':1, 
					'Status.Status':1,'Status.Qty':1};

				inventory.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var faclty =[]; 
						var itms = [];
						var tempresult = JSON.parse(JSON.stringify(result)); //console.log("result "+JSON.stringify(tempresult));
						var finaltempresult = [];
						for (f in tempresult) {faclty.push(tempresult[f].instance.Facility_Name); itms.push(tempresult[f].instance.Item_ID)}
						condition.where = {}; condition.where = {"Warehouse_ID":{$in:faclty}};
						app.get('warehouse').find(condition,{'_id':0,'Warehouse_ID':1,'Warehouse_Type':1},null,function(err,rslt){
							var temprslt = JSON.parse(JSON.stringify(rslt)); //console.log(JSON.stringify(temprslt));
							for(z in temprslt){
								for (y in tempresult){
									console.log(tempresult[y].instance.Facility_Name," ",temprslt[z].instance.Warehouse_ID," ",
										temprslt[z].instance.Warehouse_Type," ",facility_type);
									if(	tempresult[y].instance.Facility_Name == temprslt[z].instance.Warehouse_ID){
										if(temprslt[z].instance.Warehouse_Type == facility_type){
											tempresult[y].instance.Facility_Type = temprslt[z].instance.Warehouse_Type;
											finaltempresult.push(tempresult[y]);
										}else if(facility_type == "WHST"){
											tempresult[y].instance.Facility_Type = temprslt[z].instance.Warehouse_Type;
											finaltempresult = tempresult;
										}
									}
								}
							}
							res.send(finaltempresult);							
						});
					}
				});
	});		
	app.get('/inventory/:facility_id/:item_id/:item_status', function(req, res, next) {
		var inventory = app.get('inventory');
		var facility_id = req.params.facility_id;
		var item_id = req.params.item_id;
		var item_status = req.params.item_status;
		var condition = {};
		var fields = {};
		condition.where ={
				"Facility_Name" : {$eq: facility_id},
				"Item_ID" : {$eq: item_id},
				"Status.Status" : {$eq: item_status},
				"Status.Qty" : {$gt: 0}
			};  
		fields ={
				'_id':0,'Facility_Name':1, 'Item_ID':1,'Item_Description':1,
				'Location_ID':1, 'Hot_Inventory':1,
				'Distro_Number':1,'PO_Nbr':1,'ASN_Nbr':1, 
				'Status.Status':1,'Status.Qty':1
			};

			inventory.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(results);								
						}
					});
	});	

}