

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
let objInfo = [];

///////Peticion API de la info que me interesa///////
async function fetchEvents() {
    try {     
      let response = await fetch( `https://app.ticketmaster.com/discovery/v2/events.json?&size=100&apikey=${apiKey}&geoPoint=${geoPoint}`);
      let data = await response.json();
      events = data._embedded.events;
      events.forEach(event => {
        let artistName = event._embedded.attractions[0].name;
        if (!objInfo.filter(item => item.name === artistName).length) {
          let eventObj = {
            name: artistName,
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
        }
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
    
    ///////MAPA///////
    var map = L.map('map').setView([latitude, longitude], 13);
  //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  // }).addTo(map);
    var Jawg_Matrix = L.tileLayer('https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: 'abcd',
    accessToken: 'bBSSN2ijAIV8SRhPOa1TiWG0tZVJDj5WP5gzhvq5fECKjQETnbRuUDsjTJmFwTt6'
    }).addTo(map);
    
    fetchEvents(geoPoint);
    printMarkersPopUp()
  }, error => {
    console.log('Error obtaining geolocation:', error);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
}


///////MARCADORES Y POP UP///////
function printMarkersPopUp() {
    // let markerAll = [];
    // let myLayer;

    objInfo.forEach(event => {
      let eventLatitude = event.venueLocation.latitude;
      let eventLongitude = event.venueLocation.longitude;
      console.log(eventLatitude);
      console.log(eventLongitude);
      let marker = L.marker([eventLatitude, eventLongitude]);

      // markerAll.push(marker);

      const popupContent = `
        <h3>${event.name}</h3>
        <p>Date: ${event.dateTime}</p>
        <p>Price Range: ${event.priceRanges}</p>
        <p>Accessibility: ${event.accessibility}</p>
        <p>Venue: ${event.venueName}</p>
        <p>Postal Code: ${event.venuePostalCode}</p>
        <p>Address: ${event.venueAddress}</p>`;

      marker.bindPopup(popupContent);
      marker.addTo(map);
      
    });
  //  L.layerGroup(markerAll).addTo(map);
}

function handleFilter() {
  let fromDate = document.getElementById('date-from').value;
  let toDate = document.getElementById('date-to').value;
  if (fromDate && toDate) {
    let filteredEvents = objInfo.filter(event => {
      let eventDate = event.dateTime;
      return eventDate >= fromDate && eventDate <= toDate;
      ///borrar los marcadores y pop ups y que me vuelvan a aparecer en el mapa??
      //problema de asincronia otra vez con el objInfo??
    });
  }
}

///////HIDE AND SHOW MAP///////
let selectButton = document.querySelector('.button-discover');
let selectTitle = document.querySelector('.title');
let selectSection = document.querySelector('.hide-container');
let selectBody= document.querySelector('body');

selectButton.addEventListener('click', function() {
  selectSection.style.display = 'block';   
  selectTitle.style.display = 'none';  
  selectBody.style.backgroundColor = '#000000';  
});
  





