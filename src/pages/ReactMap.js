import React from 'react'
import {
      Map, InfoWindow, Marker, GoogleApiWrapper
} from 'google-maps-react';
import { Store } from './Store';
 
const first = {
    lat: 62.030322,
    lng: 129.714982
}

const second = {
    lat: 62.040122,
    lng: 129.734482
}

function MMMap(props){
  const center  = props.center;
  const marks   = props.marks;

  let google = props.google;

    let elem = document.getElementById("map");
    elem = elem.children[0]
    console.log(google)
  //  const map = new google.maps.Map( elem, {
  //    zoom: 14,
  //  });

   for(let i = 0; i < marks.length;i++){
      console.log(marks[i])
     new google.maps.Marker({
       position: marks[i].coord,
       google,
       title: marks[i].name,
     });
   }

   let item = <>
    <Map 
        initialCenter   = { center }
        google          = { props.google }
        onClick         = { props.onMapClicked }
    > 
        
        <InfoWindow
            key       = { '0' }
            marker    = { props.activeMarker }
            visible   = { props.showingInfoWindow }
        >
            <div>
                <h1>  { props.selectedPlace.name } </h1>
            </div>
        </InfoWindow>

     </Map>
  </>

  return item;
}

export class MapContainer extends React.Component {

    constructor(props){
      super(props)
      console.log(props)
    }

    state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      
    };
      
    calculateAndDisplayRoute(map) {
        console.log(map.DirectionsService())
        let Serv = new map.DirectionsService()
        let Rend = new map.DirectionsRenderer()
        Serv.route(
          {
            origin: {
              query: "chicago, il",
            },
            destination: {
              query: "joplin, mo",
            },
            travelMode: "DRIVING" //google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK") {
                Rend.setDirections(response);
            } else {
              window.alert("Directions request failed due to " + status);
            }
          }
        );
    }  

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        })

    };
   
    onMapClicked = (mapProps, map, clickEvent) => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        })
      } else {
        console.log(clickEvent.latLng.lat())
        console.log(clickEvent.latLng.lng())
    }
    };
   
    render() {
      return (
        <MMMap  
          center                = { this.props.center }
          marks                 = { this.props.marks }
          google                = { this.props.google }
          onMapClicked          = { this.onMapClicked }
          onMarkerClick         = { this.onMarkerClick }
          activeMarker          = { this.state.activeMarker }
          showingInfoWindow     = { this.state.showingInfoWindow }
          selectedPlace         = { this.state.selectedPlace }
        />
      )
    }
  }

export default GoogleApiWrapper({
  apiKey: ("AIzaSyB_p9u6xDi9Jc2ys-BC_u5zaE1J91G0a48")
})(MapContainer)