// require('dotenv').config()
// console.log(process.env)
// let apiKey = 27001573dbbdf01ffd59704afe2affc0;

///////FIREBASE////////
// const firebaseConfig = {
//   apiKey: "AIzaSyCLWdcK1bWdhXNAc5kP4L35eOFBN0K5Jz0",
//   authDomain: "gigs-a0b56.firebaseapp.com",
//   projectId: "gigs-a0b56",
//   storageBucket: "gigs-a0b56.appspot.com",
//   messagingSenderId: "234793920048",
//   appId: "1:234793920048:web:7a539e64bcb5cad25eeff5"
// };
// const app = initializeApp(firebaseConfig);
// const db = firebase.firestore();


///////Peticion API de la info que me interesa///////
async function fetchEvents(artistName) {
    try {
      let response = await fetch( `https://rest.bandsintown.com/artists/${artistName}/events/?app_id=27001573dbbdf01ffd59704afe2affc0`);
      let data = await response.json();
      let events = data.map(event => ({
        lineup: event.lineup,
        datetime: event.datetime,
        venue: {
          location: event.venue.location,
          name: event.venue.name,
          latitude: event.venue.latitude,
          longitude: event.venue.longitude,
          street_address: event.venue.street_address,
          city: event.venue.city,
          country: event.venue.country
        },
        offers: event.offers.map(offer => ({
          status: offer.status,
          type: offer.type
        }))
      }));
      console.log(events)
      return events;
  
    } catch (error) {
      console.log('Error:', error);
    }
  }
fetchEvents('Metallica');