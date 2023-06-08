
let apiKey = "3mcHQ8GGejobOG8uBb1HpEUCrwQ32w0a";
let events;
let geoPoint;
let objInfo = [];


///////Peticion API de la info que me interesa///////
async function fetchEvents(distance) {
  try {
    let response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?&size=100&apikey=${apiKey}&geoPoint=${geoPoint}`);
    let data = await response.json();
    events = data._embedded.events;
    objInfo = events
                    .filter(event => event.distance <= distance) 
                    .map(event => {
                      return {
                        name: event._embedded.attractions[0].name,
                        dateTime: event.dates.start.localDate,
                        // price: event.priceRanges,
                        venueName: event._embedded.venues[0].name,
                        venueLocation: event._embedded.venues[0].location,
                        venueAddress: event._embedded.venues[0].address.line1,
                        tickets: event.url,
                        distance: event.distance,
                      };
                    });

    console.log(objInfo);
  } catch (error) {
    console.log('Error:', error);
  }
}

document.getElementById('filter-button').addEventListener('click', function() {
  let distance = parseInt(document.getElementById('distance').value);
  fetchEvents(distance);
})

function geolocateAndPrintMap(distance) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      geoPoint = encodeGeoHash(latitude, longitude).slice(0, 9);

      var map = L.map('map').setView([latitude, longitude], 13);
      var Jawg_Matrix = L.tileLayer('https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: 'bBSSN2ijAIV8SRhPOa1TiWG0tZVJDj5WP5gzhvq5fECKjQETnbRuUDsjTJmFwTt6'
      }).addTo(map);

      
      fetchEvents(distance)
                          .then(() => {
                            let markerAll = [];
                            let myLayer;
                           
                            objInfo.forEach(event => {
                              let eventLatitude = event.venueLocation.latitude;
                              let eventLongitude = event.venueLocation.longitude;
                              let marker = L.marker([eventLatitude, eventLongitude], {
                                icon: L.icon({
                                  iconUrl: './assets/pin.png',
                                  iconSize: [45, 50], 
                                  iconAnchor: [12, 41], 
                                  popupAnchor: [1, -34] 
                                })
                              });

                              markerAll.push(marker);

                              const popupContent = `
                                <section>
                                <h3>${event.name}</h3>
                                <p>Date: ${event.dateTime}</p>
                                <p>Venue: ${event.venueName}</p>
                                <p>Address: ${event.venueAddress}</p>
                                <p>Prices From: ${event.price}€</p>
                                <a "href="${event.tickets}">Buy Tickets</a>
                                </section>`;

                                var customOptions =
                                {
                                'maxWidth': '400',
                                'width': '200',
                                'className' : 'popupCustom'
                                }
                              marker.bindPopup(popupContent, customOptions);
                            });
                            myLayer = L.layerGroup(markerAll).addTo(map);
                            })
                            .catch(error => {
                              console.log('Error fetching events:', error);
                            });
  }, error => {
    console.log('Error obtaining geolocation:', error);
  });
} else {
  console.log('Geolocation is not supported by this browser.');
}
}
geolocateAndPrintMap(100);


///////HIDE AND SHOW MAP///////
let selectButton = document.querySelector('.button-discover');
let selectTitle = document.querySelector('.title');
let selectSection = document.querySelector('.hide-container');

selectButton.addEventListener('click', function() {
  selectSection.style.display = 'block';   
  selectTitle.style.display = 'none';   
});
  

