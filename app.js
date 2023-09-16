// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},
    
    buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});
		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

	// add business markers
}
async function createMarkers(locations, map) {
    locations.forEach(location => {
        let position = [location.geocodes.main.latitude, location.geocodes.main.longitude]
        let marker = L.marker(position)
        marker.addTo(map).bindPopup(`${location.name} ${location.location.address}`).openPopup();
    }); 
}



// get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}
// get foursquare businesses
async function placeSearch(selection, coords) {
    try {
        const searchParams = new URLSearchParams({
          query: selection,
          ll: coords,
          open_now: 'true',
          sort: 'DISTANCE'
        });
        const results = await fetch(
          `https://api.foursquare.com/v3/places/search?${searchParams}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: 'fsq3VdkyX8R8j/VCAEqNrnYWw7YcdSyv9G8JWIbAlwleyp4=',
            }
          }
        );
        const data = await results.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

// window load
window.onload = async () => {
	const coords = await getCoords()
	console.log(coords)
	myMap.coordinates = coords
	myMap.buildMap()
}
// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	console.log(business)
})

