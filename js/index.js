$(document).ready(function () {


    // AFFICHER LA DATE DU JOUR
    date = new Date()
    var dateJ1 = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        month: "long",
        day: "numeric"
    })
    $("#date").text(dateJ1);

    /************************* VILLE GEOLOCALISEE ********************************/

    // APPEL API GEO LOC
    function success(pos) {
        var crd = pos.coords;

        //APPEL DE L'API METEO SEMAINE GEOLOC
        $.getJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + crd.latitude + '&lon=' + crd.longitude + '&units=metric&lang=fr&appid=e7c7ab3d1ffa52efaf8bb27278322316', function (meteo) {
            console.log(meteo);

            // VAR Localisation 
            var town = (meteo.city.name);


            // VARIABLES POUR RECUPERER INFOS A AFFICHER 
            var celsius = (meteo.list[0].main.temp);
            var wind = (meteo.list[0].wind.speed);
            var weather = (meteo.list[0].weather[0].description);

            // AFFICHER LES INFOS
            $("#city").text(town);
            $("#weather").text(weather);
            $("#deg").text(" " + (Math.round(celsius * 2)) / 2 + " °C")
            $("#wind").text(" " + (Math.round(wind * 3.6)) + " Km/h")

            //CHANGER ICONE, BG, NOM METEO SELON LA METEO DU JOUR

            switch (weather) {

                case "ciel dégagé":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/soleil.png" alt="ciel dégagé">')
                    $("body").removeClass().addClass("sun");
                    break;

                case "partiellement nuageux":
                case "peu nuageux":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/un-peu-nuageux.png" alt="ciel partiellement nuageux">')
                    $("body").removeClass().addClass("peuNuage");
                    break;

                case "couvert":
                case "nuageux":
                case "brume sèche":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/nuageux.png" alt="ciel nuageux">')
                    $("body").removeClass().addClass("nuage");
                    break

                case "légère pluie":
                case "pluie modérée":
                case "forte pluie":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/petite-pluie.png" alt="pluie">')
                    $("body").removeClass().addClass("pluie");
                    break;

                case "orage et pluie fine":
                case "orage":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/orage.png" alt="orages">')
                    $("body").removeClass().addClass("orage");
                    break;


                case "légères chutes de neige":
                case "chutes de neige":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/neige.png" alt="neige">')
                    $("body").removeClass().addClass("neige");

                    break;
                default:
                    console.log("Météo indisponible actuellement")
            }
            if (celsius >= 35) {
                $("body").removeClass().addClass("canicule");
                $("#weather").removeClass().addClass("marginCanicule");
                $("#weather").html('<span class="chaud">Canicule</span><br><span class="pensez">Pensez à vous hydrater</span>');
            }



            // RECUPERER LES INFOS DES JOURS DE LA SEMAINES (par ligne tableau)
            var getDates = [8, 16, 24, 32, 39];
            getDates.forEach(function (value) {

                currentWeather = meteo.list[value]; //récupère les donnée de chaque jours
                var weather = (currentWeather.weather[0].description);
                var temp = (" " + (Math.round(currentWeather.main.temp)) + " °C");

                var dateWeek = new Date(currentWeather.dt_txt);
                var dateWeek = dateWeek.toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric"
                });

                var weatherWeek = "weatherW" + value; //crée une classe pour chaque jours


                // CREE LA LISTE AVEC INFOS DE LA SEMAINE

                $(".datesContent").append('<ul class="col-sm"><li>' + dateWeek + '</li><li class="' + weatherWeek + '">' + weather + '</li><li class="temp">' + temp + '</li></ul>');

                //CHANGER ICONE, BG, NOM METEO SELON LA METEO DE LA SEMAINE 
                switch (weather) {

                    case "ciel dégagé":
                        $("." + weatherWeek).html('<img src="img/icon/soleil.png" alt="ciel dégagé">');
                        break;

                    case "partiellement nuageux":
                    case "peu nuageux":
                        $("." + weatherWeek).html('<img src="img/icon/un-peu-nuageux.png" alt="ciel partiellement nuageux">')
                        break;

                    case "couvert":
                    case "nuageux":
                    case "brume sèche":
                        $("." + weatherWeek).html('<img src="img/icon/nuageux.png" alt="ciel nuageux">')
                        break

                    case "légère pluie":
                    case "pluie modérée":
                    case "forte pluie":
                        $("." + weatherWeek).html('<img src="img/icon/petite-pluie.png" alt="légère pluie">')
                        break;
                            
                    case "orage et pluie fine":
                    case "orage":
                        $("." + weatherWeek).html('<img src="img/icon/orage.png" alt="orages">')
                        break;


                    case "légères chutes de neige":
                    case "chutes de neige":
                        $("." + weatherWeek).html('<img src="img/icon/neige.png" alt="neige">')
                        break;

                    default:
                        console.log("Météo indisponible actuellement")
                };
            });
        });
    };

    function error(err) {
        console.warn(`ERREUR (${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });


    /************************* RECHERCHE DE VILLE ********************************/
    //REMPLACER LES DONNEES LORSQU'ON MODIFIE LA VILLE SAISIE
    $("form").on("change", "#search", function () {
        $(".datesContent").html('');
    });

    //RECUPERER LES DONNEES DE L'INPUT LORS DE LA VALIDATION
    $("form").on("submit", function (e) {
        e.preventDefault();
        var town = $("#search").val();
        $("#search").val('');

        //APPEL DE L'API METEO SEMAINE
        $.getJSON('https://api.openweathermap.org/data/2.5/forecast?q=' + town + '&units=metric&lang=fr&appid=e7c7ab3d1ffa52efaf8bb27278322316', function (meteo) {

            console.log(meteo);


            // VARIABLES POUR RECUPERER INFOS A AFFICHER 
            var celsius = (meteo.list[0].main.temp);
            var wind = (meteo.list[0].wind.speed);
            var weather = (meteo.list[0].weather[0].description);

            // AFFICHER LES INFOS
            $("#city").text(town);
            $("#weather").text(weather);
            $("#deg").text(" " + (Math.round(celsius * 2)) / 2 + " °C")
            $("#wind").text(" " + (Math.round(wind * 3.6)) + " Km/h")

            //CHANGER ICONE, BG, NOM METEO SELON LA METEO DU JOUR
            switch (weather) {

                case "ciel dégagé":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/soleil.png" alt="ciel dégagé">')
                    $("body").removeClass().addClass("sun");
                    break;

                case "partiellement nuageux":
                case "peu nuageux":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/un-peu-nuageux.png" alt="ciel partiellement nuageux">')
                    $("body").removeClass().addClass("peuNuage");
                    break;

                case "couvert":
                case "nuageux":
                case "brume sèche":
                $("#weather").text(weather);
                $("#icon").html('<img src="img/icon/nuageux.png" alt="ciel nuageux">')
                $("body").removeClass().addClass("nuage");
                    break

                case "légère pluie":
                case "pluie modérée":
                case "forte pluie":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/petite-pluie.png" alt="pluie">')
                    $("body").removeClass().addClass("pluie");
                    break;
                        
                case "orage et pluie fine":
                case "orage":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/orage.png" alt="orages">')
                    $("body").removeClass().addClass("orage");
                    break;


                case "légères chutes de neige":
                case "chutes de neige":
                    $("#weather").text(weather);
                    $("#icon").html('<img src="img/icon/neige.png" alt="neige">')
                    $("body").removeClass().addClass("neige");

                    break;
                default:
                    console.log("Météo indisponible actuellement")
            }
            if (celsius >= 35) {
                $("body").removeClass().addClass("canicule");
                $("#weather").removeClass().addClass("marginCanicule");
                $("#weather").html('<span class="chaud">Canicule</span><br><span class="pensez">Pensez à vous hydrater</span>');
            }


            // RECUPERER LES INFOS DES JOURS DE LA SEMAINES (par ligne tableau)
            var getDates = [8, 16, 24, 32, 39];
            getDates.forEach(function (value) {

                currentWeather = meteo.list[value]; //récupère les donnée de chaque jours
                var weather = (currentWeather.weather[0].description);
                var temp = (" " + (Math.round(currentWeather.main.temp)) + " °C");

                var dateWeek = new Date(currentWeather.dt_txt);
                var dateWeek = dateWeek.toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric"
                });

                var weatherWeek = "weatherW" + value; //crée une classe pour chaque jours


                // CREE LA LISTE AVEC INFOS DE LA SEMAINE

                $(".datesContent").append('<ul><li>' + dateWeek + '</li><li class="' + weatherWeek + '">' + weather + '</li><li class="temp">' + temp + '</li></ul>');

                //CHANGER ICONE, BG, NOM METEO SELON LA METEO DE LA SEMAINE 
                switch (weather) {

                    case "ciel dégagé":
                        $("." + weatherWeek).html('<img src="img/icon/soleil.png" alt="ciel dégagé">');
                        break;

                    case "partiellement nuageux":
                    case "peu nuageux":
                        $("." + weatherWeek).html('<img src="img/icon/un-peu-nuageux.png" alt="ciel partiellement nuageux">')
                        break;

                    case "couvert":
                    case "nuageux":
                    case "brume sèche":
                        $("." + weatherWeek).html('<img src="img/icon/nuageux.png" alt="ciel nuageux">')
                        break

                    case "légère pluie":
                    case "pluie modérée":
                    case "forte pluie":
                        $("." + weatherWeek).html('<img src="img/icon/petite-pluie.png" alt="légère pluie">')
                        break;
                            
                    case "orage et pluie fine":
                    case "orage":
                        $("." + weatherWeek).html('<img src="img/icon/orage.png" alt="orages">')
                        break;

                    case "légères chutes de neige":
                    case "chutes de neige":
                        $("." + weatherWeek).html('<img src="img/icon/neige.png" alt="neige">')
                        break;

                    default:
                        console.log("Météo indisponible actuellement")
                };

            });
        });
    });
});