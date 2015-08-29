/*api usage : http://api.openweathermap.org/data/2.5/weather?q=mumbai,ind&APPID=a0ce14bfbab578625f9e7c2e37cc43f1 */
/*for icon : http://openweathermap.org/img/w/10d.png*/
count = 0;
var color = 0;
function display(json,c){
	console.log(json);
	json = json ;
	if($('#'+c).length)
	{
		console.log($('#'+c).length);
		var template = $('#'+c).html();
		template = template.replace('{{city}}',c);
		template = template.replace("{{place}}",json['name']);
		template = template.replace("{{date}}",'date');
		template = template.replace("{{status}}",json['weather'][0]['description']);
		var icon = "http://openweathermap.org/img/w/"+json['weather'][0]['icon']+".png";
		template = template.replace("{{icon}}",icon);
		template = template.replace("{{tem}}",'temprature');
		template = template.replace("{{prec}}",'preciption');
		template = template.replace("{{hum}}",'humidity');
		
		template = template.replace("{{wind}}",count);
		$('#'+c).html(template);
		count += 1;

	}
	else{


		var template = $("#template").html();
		template = template.replace('{{city}}',c);
		template = template.replace("{{place}}",json['name']);
		var date = new Date(json['dt']);
		template = template.replace("{{date}}",date.toLocaleTimeString()) ;
		template = template.replace("{{status}}",json['weather'][0]['description']);
		var icon = "http://openweathermap.org/img/w/"+json['weather'][0]['icon']+".png";
		template = template.replace("{{icon}}",icon);
		template = template.replace("{{image}}",json['weather'][0]['icon']+".jpeg")
		var temp = (json['main']['temp']-273.15).toFixed(2);
		template = template.replace("{{tem}}",temp+" ");
		template = template.replace("{{pre}}",json['main']['pressure']+" hpa");
		template = template.replace("{{hum}}",json['main']['humidity']+" %");
		template = template.replace("{{wind}}",json['wind']['speed']+" m/s");
		template = template.replace("{{lat}}",json['coord']['lat']);
		template = template.replace("{{lng}}",json['coord']['lon']);
		var container = $(".container").html();
		$(".container").html(container+template);
		
	}
	


}
var lat,lon;
function getLatLon(city)
{
	
	$.ajax({
  url: "http://maps.googleapis.com/maps/api/geocode/json?address="+city+"&sensor=false",async : false,
  type: "GET",
  success: function(res){
  	console.log(res);
     lat = res.results[0]['geometry']['location']['lat'];
     lon = res.results[0]['geometry']['location']['lng'];
  }
});
	
}
function getWeather(c)
{
	getLatLon(c);
	console.log("lat,lon"+lat,lon);
	$.ajax({url : "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=a0ce14bfbab578625f9e7c2e37cc43f1",async : true, success: function(response){
		display(response,c);
		$('#'+c).scrollTop(0);
		//clearInterval(timer);
	} });
}
var cities = [];
var city_count;
function showWeather()
{
	if(localStorage.getItem("city_count"))
	{
		city_count = localStorage.getItem("city_count");
	}
	else
	{
		city_count = 0;
	}
	if(city_count)
	{
		
		for(var i = 0 ; i <= city_count ; i++)
		{
			if(localStorage.getItem("city"+i))
			{
				cities[i] = localStorage.getItem("city"+i);
			console.log(cities);

			}
			
		}
	}
	console.log("loading...");
	console.log(cities);

		for(var c in cities)
		{
			console.log("city======"+cities[c]);
			getWeather(cities[c]);
		}
	

}
function addCity(event)
{
	
	if(event.type == 'click')
	{
		var new_city = $('#newcity').val();
		if(new_city && new_city in cities)
			{
				alert("city already added");
				 $('#newcity').val("");
				return;
			}
			else if(new_city)
			{
				localStorage.setItem("city"+cities.length,new_city);
				localStorage.setItem("city_count",city_count+1);
				$('#newcity').val("");
				console.log("city added");
				showWeather();
				return;
			}
			alert('enter city name');

	}
	else
	{
		if(event.keyCode == 13)
		{
			var new_city = event.target.value;
			if(new_city && new_city in cities)
			{
				alert("city already added");
				$('#newcity').val("");
				return;
			}
			else if(new_city)
			{
				localStorage.setItem("city"+cities.length,new_city);
				localStorage.setItem("city_count",city_count+1);
				$('#newcity').val("");
				console.log("city added");
				showWeather();
				return;
			}
			alert('enter city name');

		}

	}	
		
}

$(document).ready(function(){
	//localStorage.clear();
	$('#newcity').on('keyup',function(event){
		addCity(event);	
	});
	$('#addcity_btn').on('click',function(event){
		addCity(event);
	});
	
	$('footer').on('hover',function(){
		$('.msg').show();
	});
	console.log("body background");
	var bac = "url(bac"+Math.floor((Math.random() * 3) + 1)+".jpg)";
	console.log(bac);		

	$('body').css('background-image',bac);
	showWeather();
		
	//timer = setInterval(showWeather,1000);
});

function drag(event)
	{
		event.dataTransfer.setData("text",event.target.id);
		console.log("dragging");
	}
function drop(event) {
	console.log("droping");
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
    for(var i=0;i<city_count;i++)
    {
    	var city = localStorage.getItem('city'+i);
    	
    	if(city == data){
    		delete window.localStorage['city'+i];
    		localStorage.setItem("city_count",city_count-1);
    	}
    }
    
    
    
	console.log("dropped");
}
function allowDrop(event) {
    event.preventDefault();
}
	

