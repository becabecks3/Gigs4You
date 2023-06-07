

///////FIREBASE////////
// const firebaseConfig = {
//   apiKey: "AIzaSyCLWdcK1bWdhXNAc5kP4L35eOFBN0K5Jz0",
//   authDomain: "gigs-a0b56.firebaseapp.com",
//   projectId: "gigs-a0b56",
//   storageBucket: "gigs-a0b56.appspot.com",
//   messagingSenderId: "234793920048",
//   appId: "1:234793920048:web:7a539e64bcb5cad25eeff5"
// };


let apiKey = "3mcHQ8GGejobOG8uBb1HpEUCrwQ32w0a";
let events;
let geoPoint;

///////Peticion API de la info que me interesa///////
async function fetchEvents() {
    try {
      let response = await fetch( `https://app.ticketmaster.com/discovery/v2/events.json?&size=100&apikey=${apiKey}&geoPoint=${geoPoint}`);
      let data = await response.json();
      events = data._embedded.events;
      let objInfo = [];

      events.forEach(event => {
        let eventObj = {
          name: event.name,
          dateTime: event.dates.start.localDate,
          priceRanges: event.priceRanges,
          accessibility: event.accessibility,
          venueName: event._embedded.venues[0].name,
          venuePostalCode: event._embedded.venues[0].postalCode,
          venueLocation: event._embedded.venues[0].location,
          venueAddress: event._embedded.venues[0].address,
          images: event.images.map(image => image.url)
        };
        objInfo.push(eventObj);
      });
      console.log(objInfo);
    } catch (error) {
        console.log('Error:', error);
    }
}
// fetchEvents();

///////GEOLOCALIZACION///////
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    geoPoint = encodeGeoHash(latitude, longitude).slice(0, 9);
    console.log(geoPoint)
    fetchEvents(geoPoint);

    ///////MAPA///////
    var map = L.map('map').setView([latitude, longitude], 13);

    var Jawg_Matrix = L.tileLayer('https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: 'abcd',
    accessToken: 'bBSSN2ijAIV8SRhPOa1TiWG0tZVJDj5WP5gzhvq5fECKjQETnbRuUDsjTJmFwTt6'
    }).addTo(map);
    }, error => {
    console.log('Error obtaining geolocation:', error);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }


///////MARCADORES Y POP UP///////

async function printMarkersPopUp() {
  try {
    let response = await fetchEvents();
    let markerAll = [];
    let myLayer;

    response.forEach(event => {
      let eventLatitude = event.venueLocation.latitude;
      let eventLongitude = event.venueLocation.longitude;

      let marker = L.marker([eventLatitude, eventLongitude]);

      markerAll.push(marker);

      const popupContent = `
        <h3>${event.name}</h3>
        <p>Date: ${event.dateTime}</p>
        <p>Price Range: ${event.priceRanges}</p>
        <p>Accessibility: ${event.accessibility}</p>
        <p>Venue: ${event.venueName}</p>
        <p>Postal Code: ${event.venuePostalCode}</p>
        <p>Address: ${event.venueAddress}</p>`;

      marker.bindPopup(popupContent);

    });

    myLayer = L.layerGroup(markerAll).addTo(map);
  } catch (error) {
    console.log('Error:', error);
  }
}

printMarkersPopUp();








// function printMarker() {56
//   fetch('https://api.metro.net/LACMTA_Rail/vehicle_positions/all?geojson=false')
//   .then(res=>res.json())
//   .then(data=> {
//       // creo tanto el array de 'markers' como la 'layer group' fuera del bucle para 
//       let markerAll = [];
//       let myLayer;
//       data.forEach((element, i) => {
//           // declaro variables que usaré en los marcadores y pop ups
//           const latitude = element.position.latitude;
//           const longitude = element.position.longitude;
//           const id = element.vehicle.vehicle_id;
//           // declaro marcador
//           var marker = L.marker([latitude, longitude]);
//           // añado marcadores mediante array a la capa
//           markerAll.push(marker);
//           myLayer = L.layerGroup(markerAll).addTo(map2);
//           // añado popup al evento click
//           marker.addEventListener("click", function() {
//               var popup = L.popup()
//                   .setLatLng([latitude, longitude])
//                   .setContent(id)
//                   .openOn(map2);
//           });
//       });

///////SEARCH INPUT///////
// function toggleSearchInput() {
//   let searchInput = document.querySelector('.search-input input');
//   searchInput.classList.toggle('show-search-input');
// }
// let searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', toggleSearchInput);



