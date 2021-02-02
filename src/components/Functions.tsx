import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

let d_width = window.innerWidth - 910;
let d_height = window.innerHeight - 150;


const containerStyle = {
    width:  d_width.toString() + 'px',
    height: d_height.toString() + 'px',
  };
    
export function MapAPI(props):JSX.Element {

    let center = props.center
    let marks = props.marks

    let item = <></>
    if(marks !== undefined){
        for(let i = 0;i < marks.length;i++){
            item = <>
                { item }
                <Marker
                    key = { i.toString() }
                    position = { marks[i].coord }
                    title = { marks[i].name }
                    label = { marks[i].label }
                />
            </>     
        }
    }

    return (
      <LoadScript
        googleMapsApiKey="AIzaSyB_p9u6xDi9Jc2ys-BC_u5zaE1J91G0a48"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={ 14 }
        >
         { item }
        </GoogleMap>
      </LoadScript>
    )
  }
  