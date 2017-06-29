$(document).ready(function(){
  $(".dropdown-button").dropdown();

})

var baseURL =  "https://developers.zomato.com/api/v2.1/"
var locationURL = "https://developers.zomato.com/api/v2.1/locations?query="
var detailsURL = "https://developers.zomato.com/api/v2.1/location_details?entity_id="
var ratingsURL = "https://developers.zomato.com/api/v2.1/restaurant?res_id="

const loading = document.querySelector('.loading')

var settings = {
  "url": "https://developers.zomato.com/api/v2.1/categories",
  "method": "GET",
  "headers": {
    "accept": "application/json",
    "user-key": "ded3b6a46f8822f9c0f7fb1260cbdc07",
  }
}

$(".location-button").click(function(event) {
  event.preventDefault();
  displayLoading();

  $('input:text').click(function(){
        $(this).val('');
  });
  var locationType = $("#location-type").val();
  var locationRequest = {
    "url": locationURL + locationType,
    "method": "GET",
    "headers": {
      "accept": "application/json",
      "user-key": "ded3b6a46f8822f9c0f7fb1260cbdc07",
    }
  };

  function displayLoading() {
    loading.classList.remove('image-hide')
  }

  function hideLoading() {
    loading.classList.add('image-hide')
  }

  $.ajax(locationRequest).then(function (data1) {
    hideLoading();
    var entityId = data1.location_suggestions[0].entity_id;
    var entityType = data1.location_suggestions[0].entity_type;
    var detailsRequest = {
      "url": detailsURL + entityId + "&entity_type=" + entityType,
      "method": "GET",
      "headers": {
        "accept": "application/json",
        "user-key": "ded3b6a46f8822f9c0f7fb1260cbdc07",
      }
    };

    $.ajax(detailsRequest).then(function (data2){
      var restaurants = data2.best_rated_restaurant;
      $('.row').empty();
      for (var i = 0; i < restaurants.length; i++) {
        let title = restaurants[i].restaurant.name;
        let image = restaurants[i].restaurant.featured_image;
        let food = restaurants[i].restaurant.cuisines;
        let address = restaurants[i].restaurant.location.address;
        let offers = restaurants[i].restaurant.user_rating.aggregate_rating;
        let word = restaurants[i].restaurant.user_rating.rating_text;
        let link = restaurants[i].restaurant.menu_url;

        appendCard(title, image, food, address, offers, word, link)
      }
    })
  })
});

function appendCard(title, image, food, address, offers, word, link) {
  if (!image) {
    image = 'http://www.topmenu.com/img/placeholder_en_514x514.png?1450896735';
  }

  var card = `<div class="col s12 m6 l4">
      <div class="card" id="card1">
      <div class="card-image waves-effect waves-block waves-light">
      <img class="activator responsive-img" src="${image}"></div>
      <div class="card-content">
      <span class="card-title">${title}</span>
      <p>Cuisines: ${food}</p>
      <p>Address: ${address}</p>
      <p>Rating: ${offers}</p>
      <p>Review: ${word}</p>
      <p><a href="${link}">More information</a></p>
      </div>
      </div>`

    $('.row').append($(card))
}
