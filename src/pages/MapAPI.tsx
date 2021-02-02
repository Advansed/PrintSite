import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 62.030322,
  lng: 129.714982
};

function MyComponent():JSX.Element {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyB_p9u6xDi9Jc2ys-BC_u5zaE1J91G0a48"
    >
      <GoogleMap
        mapContainerStyle={ containerStyle }
        center={ center }
        zoom={10}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

export default MyComponent