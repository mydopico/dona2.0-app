


    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
        center: walk.geometry.coordinates, // starting position [lng, lat]
        zoom: 13 // starting zoom
    });

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a default Marker and add it to the map.

const marker1 = new mapboxgl.Marker()
  .setLngLat(walk.geometry.coordinates)
  .setPopup(
	new mapboxgl.Popup({offset: 25})
	 .setHTML(		 
		  `<h4>${walk.title}</h4><p>${walk.location}</p>`
	 )
  )
  .addTo(map)

// Create a default Marker, colored black
const marker2 = new mapboxgl.Marker({ color: 'black'})
.setLngLat(walk.geometryEnd.coordinates)
.setPopup(
	new mapboxgl.Popup({offset: 25})
	 .setHTML(		 
		  `<h4>${walk.title}</h4><p>${walk.end}</p>`
	 )
  )
.addTo(map);
