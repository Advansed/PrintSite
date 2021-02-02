import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Marker } from 'react-google-maps';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 62.030322,
  lng: 129.714982
};

function MyComponent(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyB_p9u6xDi9Jc2ys-BC_u5zaE1J91G0a48"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
    console.log("map")
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={ containerStyle }
        center={ {lat: 162.030322, lng: 189.714982} }
        zoom={ 14 }
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <Marker
          onLoad={onLoad}
          position={ {lat: 62.030322, lng: 129.714982} }
        />
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)