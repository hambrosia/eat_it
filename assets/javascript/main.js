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
      url         : searchURLmaker(search, 25, apiKey),
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
  $("#results-panel").append("<p>" + "<b>" + reportData.report.food.name + "</b>" + "</p>");
  for(i=0; i< reportData.report.food.nutrients.length; i++){
    $("#results-panel").append("<p>" + reportData.report.food.nutrients[i].name +": " + reportData.report.food.nutrients[i].value + reportData.report.food.nutrients[i].unit + "</p>");

  }

}

//getReport("45167404");


});