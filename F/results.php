<?php
	$myArray = $_REQUEST['data'];
	$weight = -1;
	$place = "";
	$error = "";
	$lat = 0;
	$lng = 0;
	$locations = array();
	$duplicate = array();
	$image = array();
	$choiceXML = simplexml_load_file("dataChoicesAndLocations.xml");
	$somewhere = str_replace(str_split('\\/:*?"<>| \(\)'), '_',$myArray[0]);
	$for = str_replace(str_split('\\/:*?"<>| \(\)'), '_',$myArray[1]);
	$experience = str_replace(str_split('\\/:*?"<>| \(\)'), '_',$myArray[2]);
	$with = str_replace(str_split('\\/:*?"<>| \(\)'), '_',$myArray[3]);
	$i = 0;
	foreach($choiceXML->location as $choice){
		$locations[$i][] = $choice->name;
		$locations[$i][] = $choice->$somewhere + $choice->$for + $choice->$experience + $choice->$with;
		$i++;
	}
	
	foreach($locations as $nominee){
		if($nominee[1] > $weight){
			$place = $nominee[0];
			$weight = $nominee[1];			
		}
	}

	if($weight == 0){
		$error .= "...value for this combination was 0: ".$somewhere." ".$for." ".$experience." ".$with;
	}	
	foreach($locations as $nominee){
		if($nominee[1] == $weight){
			$duplicate[] = $nominee[0];			
		}
	}
	if(!empty($duplicates)){
		$error .= "...multiple options for this combination: ".$somewhere." ".$for." ".$experience." ".$with;
		foreach($duplicates as $duplicate){
			$error .= "...".$duplicate;
		}
	}
	
	$locationXML = simplexml_load_file("dataLocations.xml");
	foreach($locationXML->location as $location){
		if(strval($location->name) == $place){
			$lat = floatval($location->max_lat);
			$lng = floatval($location->max_long);
			if(!empty($location->affiliate_url)){
				$affiliate = $location->affiliate_url;
			}else{
				$affiliate = "nowhere";
			}
			$learnMore = $location->wikipedia_url;
			if($location->image != ""){
				$image[] = array(
						   "photo_url"=>$location->image,
						   "owner_name"=>"fill_in_the_trip",
						   );
			}
			break;
		}
	}

	if(empty($image)){
		require('Panoramio.php');
		$panoramioClass = new panoramioAPI();
		$panoramioClass->setRequiredLocation($lat, $lng);
		$localImages = $panoramioClass->getPanoramioImages();

		if (!empty($localImages)) {
			$image = $localImages;
		} else {
			$error .= "...no response from panoramio";
		}
	}
	
	if($error==""){ $error = "no errors"; }
	
	$line = date('m-d-Y H:i:s').", $_SERVER[REMOTE_ADDR]".", ".$somewhere.", ".$for.", ".$experience.", ".$with.", ".strval($place).", ".strval($error);
	file_put_contents('visitors.log',$line.PHP_EOL,FILE_APPEND);
	
	echo json_encode(array(
					"name"=>strval($place),
					"image"=>$image,
					"learn"=>strval($learnMore),
					"hotel"=>strval($affiliate)
					));
?>