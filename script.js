

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
let objInfo = [];

///////Peticion API de la info que me interesa///////
async function fetchEvents() {
    try {     
      let response = await fetch( `https://app.ticketmaster.com/discovery/v2/events.json?&size=200&apikey=${apiKey}&geoPoint=${geoPoint}&radius=100&unit=km`);
      let data = await response.json();
      events = data._embedded.events;
      events.forEach(event => {
        let artistName = event._embedded.attractions[0].name;
        if (!objInfo.filter(item => item.name === artistName).length) {
          let eventObj = {
            name: artistName,
            dateTime: event.dates.start.localDate,
            price: event.priceRanges[0].min,
            venueName: event._embedded.venues[0].name,
            venueLocation: event._embedded.venues[0].location,
            venueAddress: event._embedded.venues[0].address.line1,
            tickets: event.url
          };
        objInfo.push(eventObj);
        }
      });
      console.log(objInfo);
    } catch (error) {
        console.log('Error:', error);
    }
}

function geolocateAndPrintMap() {
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

      
      fetchEvents(geoPoint)
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
geolocateAndPrintMap();

// function handleFilter() {
//   let fromDate = document.getElementById('date-from').value;
//   let toDate = document.getElementById('date-to').value;
//   if (fromDate && toDate) {
//     let filteredEvents = objInfo.filter(event => {
//       let eventDate = event.dateTime;
//       return eventDate >= fromDate && eventDate <= toDate;
//       ///borrar los marcadores y pop ups y que me vuelvan a aparecer en el mapa??
//       //problema de asincronia otra vez con el objInfo??
//     });
//   }
// }

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
  




///////GEOLOCALIZACION///////
// function getGeolocation(){
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(position => {
//       let latitude = position.coords.latitude;
//       let longitude = position.coords.longitude;
//       geoPoint = encodeGeoHash(latitude, longitude).slice(0, 9);
      
//       ///////MAPA///////
//       var map = L.map('map').setView([latitude, longitude], 13);
//       var Jawg_Matrix = L.tileLayer('https://{s}.tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
//       attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       minZoom: 0,
//       maxZoom: 22,
//       subdomains: 'abcd',
//       accessToken: 'bBSSN2ijAIV8SRhPOa1TiWG0tZVJDj5WP5gzhvq5fECKjQETnbRuUDsjTJmFwTt6'
//       }).addTo(map);
      
//       fetchEvents(geoPoint);
//       printMarkersPopUp(map);
//     }, error => {
//       console.log('Error obtaining geolocation:', error);
//       });
//     } else {
//       console.log('Geolocation is not supported by this browser.');
//   }
// }



// ///////MARCADORES Y POP UP///////
// function printMarkersPopUp(map) {
//     let markerAll = [];
//     let myLayer;

//     objInfo.forEach(event => {
//       let eventLatitude = event.venueLocation.latitude;
//       let eventLongitude = event.venueLocation.longitude;
//       console.log(eventLatitude);
//       console.log(eventLongitude);
//       let marker = L.marker([eventLatitude, eventLongitude]);

//       markerAll.push(marker);

//       const popupContent = `
//         <h3>${event.name}</h3>
//         <p>Date: ${event.dateTime}</p>
//         <p>Price Range: ${event.priceRanges}</p>
//         <p>Accessibility: ${event.accessibility}</p>
//         <p>Venue: ${event.venueName}</p>
//         <p>Postal Code: ${event.venuePostalCode}</p>
//         <p>Address: ${event.venueAddress}</p>`;

//       marker.bindPopup(popupContent);
//       // marker.addTo(map);
      
//     });
//     myLayer = L.layerGroup(markerAll).addTo(map);
// }

