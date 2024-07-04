const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
        const {latitude,longitude} = position.coords
        socket.emit("send-location",{latitude,longitude})
    },
    (error) => {
        console.log(error);
    },
    {
        enableHighAccuracy:true, //By this we can get precise location from the user
        timeout:5000, //For every 5 seconds new location will be updated
        maximumAge:0, // There will no data stored in caching
    }
)
}

const map = L.map("map").setView([0,0],17) //This is used to load the skeleton of the map 
//We have set the co-ordinates as 0,0 and view level as 10

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap" 
}).addTo(map)

const markers = {}

socket.on("receive-location",(locationInfo) => {
    const {id,latitude,longitude} = locationInfo
    map.setView([latitude,longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on("user-disconnected",(id) => {
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})