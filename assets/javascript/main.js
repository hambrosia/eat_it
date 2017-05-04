$(function() {

  var apiKey = "f4VPTpLsaZrPFeiceZBql6nT75MMvUJFFFdtusfd";

  $("#search-button").on("click", function(){
    var search = $("#search-box").val();
    getFood(search);
  });

  $("#search-box").keypress(function(userText){
    if(userText.keyCode === 13){
      var search = $("#search-box").val();
      getFood(search);
    }
  });

  var searchURLmaker = function(query, number, apiKey){
    var URL = "https://api.nal.usda.gov/ndb/search/?format=json&q= " + query + "&sort=n&max=" + number +
    "&offset=0&api_key=" + apiKey;
    return URL;
  }

  var getFood = function(search){

    $.ajax({
      type        : 'GET',
      url         : searchURLmaker(search, "10", apiKey),
      dataType    : 'json',
      success     : function(searchData) {


        $("#results-panel").empty();

        var i=0;
        while(i < searchData.list.item.length){
          var NDBno = searchData.list.item[i].ndbno;
          getReport(NDBno);
          i++;
        }
      },
      error       : function() {
      }
    });
  }

  var reportURLmaker = function(NDBno, apiKey){
    var URL = " https://api.nal.usda.gov/ndb/reports/?ndbno="+ NDBno+"&type=b&format=json&api_key=" + apiKey;
    return URL;
  }

  var getReport = function(NDBno){

    //$("#results-panel").empty();

    $.ajax({
      type        : 'GET',
      url         : reportURLmaker(NDBno, apiKey),
      dataType    : 'json',
      success     : function(reportData) {

        console.log(reportData);
        //console.log(searchData);
        renderHTML(reportData);

      },
      error       : function() {

      }
    });
  }

  var renderHTML = function(reportData){

    //INITIAL TITLE OF FOOD CARD
    var $foodcard = $("<div class='foodcard col-md-12'></div>");
    $($foodcard).append("<h1>" + reportData.report.food.name + "</h1>");
    $($foodcard).append("<h2>" + "100g contains:</h2>");

    //LOOP THROUGH NUTRIENTS AND MAKE BARS
    for(i=0; i< reportData.report.food.nutrients.length; i++){

      // IF CALORIES MAKE A CALORIES BAR, MAX 2000
      if (reportData.report.food.nutrients[i].name === "Energy"){

        var cals = reportData.report.food.nutrients[i].value;

        if(cals >= 2000){
          cals = 2000;
        }
        var percent = (cals / 20);
        percent = Math.floor(percent);


        $($foodcard).append("<h3>" + cals + " calories or " + percent + "% of daily recommendation.</h3>");
        var $progress = $("<div class='progress'></div>");
        $($progress).append("<div class='progress-bar' role='progressbar' aria-valuenow='" + percent + "'aria-valuemin='0' aria-valuemax='100' style='width:"+ percent +"%''></div>");
        ($foodcard).append($progress);
      }

      //IF PROTEIN MAKE A PROTEIN BAR, MAX 112
      if (reportData.report.food.nutrients[i].name === "Protein"){

        var protein = reportData.report.food.nutrients[i].value;

        if(protein >= 112){
          protein = 112;
        }
        var percent = (protein / 112) *100;
        percent = Math.floor(percent);


        $($foodcard).append("<h3>" + protein + " grams of protein or " + percent + "% of daily recommendation.</h3>");
        var $progress = $("<div class='progress'></div>");
        $($progress).append("<div class='progress-bar' role='progressbar' aria-valuenow='" + percent + "'aria-valuemin='0' aria-valuemax='100' style='width:"+ percent +"%''></div>");
        ($foodcard).append($progress);
      }

      /* $($foodcard).append("<p>" + reportData.report.food.nutrients[i].name +": " + reportData.report.food.nutrients[i].value + reportData.report.food.nutrients[i].unit + "</p>"); */

    }
    $("#results-panel").append($foodcard);

  }


});
