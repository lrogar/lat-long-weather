var latitude;
var longitude;

function downloadWeather() {
    
    $('#weather').show();
    
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&units=metric&APPID=3a346b7db2caeda8d482f9d443913824', function (data) {
        
        //console.log(data);
        
        var currTemp = data.main.temp + '°C';
        var lowTemp = data.main.temp_min + '°C';
        var highTemp = data.main.temp_max + '°C';
        var outlook = data.weather[0].description;
        var windDirection = data.wind.deg + '°';
        var windSpeed = data.wind.speed + 'm/s';
        var pressure = data.main.pressure + 'mB';
        var humidity = data.main.humidity + '%';
        $('#weather').append('<h4>Temperature</h4>')
                    .append('Current: ' + currTemp + '<br>')
                    .append('Low: ' + lowTemp + '<br>')
                    .append('High: ' + highTemp)
                    .append('<h4>Outlook</h4>')
                    .append(outlook)
                    .append('<h4>Wind</h4>')
                    .append('Direction: ' + windDirection + '<br> ')
                    .append('Speed: ' + windSpeed)
                    .append('<h4>Pressure</h4>')
                    .append(pressure)
                    .append('<h4>Humidity</h4>')
                    .append(humidity);
    });
}

function downloadForecast() {
        
    $.ajax({
        type: 'GET',
        dataType: 'xml',
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?cnt=10&mode=xml&lat='+latitude+'&lon='+longitude+'&units=metric&APPID=3a346b7db2caeda8d482f9d443913824',
        success: function(xml) {
            
                //create new table tag
                var table = $('<table class="table">');
                
                var thead = $('<thead>');
                table.append(thead);
                
                var headerRow = $('<tr>');
                thead.append(headerRow);
                
                var dateHeader = $('<th>').text('Date');
                var symbolHeader = $('<th>').text('Symbol');
                var highHeader = $('<th>').text('High');
                var lowHeader = $('<th>').text('Low');
                var windHeader = $('<th>').text('Wind');
                var cloudsHeader = $('<th>').text('Clouds');

                headerRow.append(dateHeader)
                        .append(symbolHeader)
                        .append(highHeader)
                        .append(lowHeader)
                        .append(windHeader)
                        .append(cloudsHeader);
                
                var tbody = $('<tbody>');
                table.append(tbody);
            
            $(xml).find('time').each(function() {
                
                var date = $(this).attr('day');
                var symbol = $(this).find('symbol').attr('number');
                var high = $(this).find('temperature').attr('max');
                var low = $(this).find('temperature').attr('min');
                var wind = $(this).find('windSpeed').attr('name');
                var clouds = $(this).find('clouds').attr('value');
                
                if (wind === '')
                    wind = 'N/A'
                         
                //console.log('day: ' + date + ', symbol: ' + symbol)
                
                //create new row
                var tr = $('<tr>');
                tbody.append(tr);
                
                //set text to the data extracted
                var dateTd = $('<td>').text(date);
                var symbolTd = $('<td>').html('<img src="images/'+symbol+'.png"/>');
                var hightTd = $('<td>').text(high + '°C');
                var lowTd = $('<td>').text(low + '°C');
                var windTd = $('<td>').text(wind);
                var cloudsTd = $('<td>').text(clouds);
                
                tr.append(dateTd)
                    .append(symbolTd)
                    .append(hightTd)
                    .append(lowTd)
                    .append(windTd)
                    .append(cloudsTd);
            });
            
            //add table to the page
            $('#forecast').append('<h3>Forecast:</h3>')
                        .append(table);
        }
    });
}

function showMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
        zoom: 8
    });
}

$(document).ready(function() {
    
    $('#weather').hide();
    
    $('#goButton').click(function () {
                
        $('#error').text('');
        $('#forecast').html('');
        $('#weather').html('');
        
        latitude = $('#lat').val();
        longitude = $("#lon").val();
        
        if ($.isNumeric(latitude) && $.isNumeric(longitude)) {            
            downloadWeather();
            downloadForecast();
            showMap();
        } else {
            $('#error').text('Please enter a valid number.');
        }
    });
});