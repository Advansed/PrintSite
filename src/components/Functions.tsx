import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { IonButton, IonCardSubtitle, IonCol, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonRow, IonText, IonTextarea } from '@ionic/react';
import { cameraOutline, closeCircleOutline, copyOutline, createOutline } from 'ionicons/icons';
import { getData, Store } from '../pages/Store';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

const { Camera }  = Plugins

defineCustomElements(window)

export async function    takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Photos
  });


  return "data:image/png;base64," + (image.base64String as string)

}

let d_width = window.innerWidth - 910;
let d_height = window.innerHeight - 150;


const containerStyle = {
    width:  d_width.toString() + 'px',
    height: d_height.toString() + 'px',
};
    
export function MapAPI(props):JSX.Element {

    let center = props.center
    let marks = props.marks
    let docs = props.docs
    let image1 = 'assets/icon/docum.png'
    let image2 = 'assets/icon/services.png'

    let item = <></>
    if(marks !== undefined){
        for(let i = 0;i < marks.length;i++){
            item = <>
                { item }
                <Marker
                    key       = { i.toString() }
                    position  = { marks[i].coord }
                    title     = { marks[i].name }
                    label     = { marks[i].label }
                    icon      = { image1 }
                />
            </>     
        }
    }

    if(docs !== undefined){
      for(let i = 0;i < docs.length;i++){
          item = <>
              { item }
              <Marker
                  key       = { i.toString() }
                  position  = { docs[i].coord }
                  title     = { docs[i].name }
                  label     = { docs[i].label }
                  icon      = { image2 }
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

export function Papers():JSX.Element {
  const [info,  setInfo]  = useState<any>([])
  const [paper, setPaper] = useState<any>()
  const [load,  setLoad]  = useState(false)
  const [upd,   setUpd]   = useState(0)

  
  async function getFoto() {
    let res = await takePicture()

    let img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let height = 150;
      let width = img.naturalWidth * 150 / img.naturalHeight
      canvas.height = 150;
      canvas.width = width;
      ctx?.drawImage(img, 0, 0, width, height);
      var imageUrl = canvas.toDataURL('image/png');
      paper.image = imageUrl
      setPaper(paper);
      setUpd(upd + 1);
    };

    img.src = res;
  
  }

  useEffect(()=>{
    setInfo( Store.getState().papers )
  },[])

  Store.subscribe({num: 3, type: "papers", func: ()=>{
    setInfo( Store.getState().papers )
  }})

  async function updPapers(){
    setLoad(true)
    paper.method = "papers_s"
    let res = await getData("method", paper)
    Store.dispatch({type: "papers", papers: res[0]})
    setPaper(undefined)
    setLoad(false)
}
  let elem = <></>;

  for(let i = 0;i < info.length; i++){
    elem = <>
      { elem }
      <div className = { 
          paper !== undefined 
            ? paper.id === info[i].id ? "" : "hide" 
            : "hide"
      }>
        <IonItem lines="none">
          <IonRow class="w-100">
            <IonCol>
              <IonButton expand="block"
                onClick={()=> updPapers() }
              ><IonIcon icon={ createOutline } slot="start"/><IonLabel>Save</IonLabel></IonButton>
            </IonCol>
            <IonCol></IonCol>
            <IonCol>
              <IonButton expand="block"
                onClick={()=> setPaper(undefined)}
              ><IonIcon icon={ closeCircleOutline } slot="start"/><IonLabel>Close</IonLabel></IonButton>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonItem lines="none">
          <IonIcon class="icon-2" icon={ cameraOutline } slot="start" 
            onClick={()=> getFoto() }
          />
          <IonImg class="img-1" src={ paper?.image }/>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> Наименование </IonLabel>
          <IonInput value={ paper?.name }
            onIonChange={(e)=>{
              if(paper !== undefined){
                paper.name = e.detail.value
                setPaper(paper)
              }
            }}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> Описание </IonLabel>
          <IonTextarea value={paper?.description }
            onIonChange={(e)=>{
              if(paper !== undefined) {
                paper.description = e.detail.value
                setPaper(paper)
              }
            }}
          ></IonTextarea>
        </IonItem>
        <IonButton
          expand="block"
          onClick={ () => { }}
        >
          Удалить
        </IonButton>
      </div>
      <div className = { 
        paper !== undefined 
          ? paper.id === info[i].id ? "hide" : "" 
          : ""
      }>
        <IonItem onClick={()=>{
            setPaper(info[i])  
          }}>
            <IonGrid >
              <IonRow>
                <IonCol size="3"><IonIcon class="icon-1" icon={ copyOutline } /></IonCol>
                <IonCol size="9">
                  <IonRow>
                    <IonCol>
                      <IonText class="font-14">
                        { info[i].name }
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCardSubtitle>
                      { info[i].descr }
                    </IonCardSubtitle>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
      </div>      
    </>

  }
  
  return <>
    <IonLoading isOpen={load} message="Подождите" />
    { elem }
  </>;
}

export function Sizes():JSX.Element {
  const [info,  setInfo]  = useState<any>([])
  const [size,  setSize] = useState<any>()
  const [load,  setLoad]  = useState(false)
  const [upd,   setUpd]   = useState(0)

  useEffect(()=>{
    setInfo( Store.getState().sizes )
  },[])

  Store.subscribe({num: 3, type: "sizes", func: ()=>{
    setInfo( Store.getState().sizes )
  }})

  async function updPapers(){
    setLoad(true)
    size.method = "sizes_s"
    let res = await getData("sizes", size)
    Store.dispatch({type: "sizes", sizes: res[0]})
    setSize(undefined)
    setLoad(false)
}
  let elem = <></>;

  for(let i = 0;i < info.length; i++){
    elem = <>
      { elem }
      <div className = { 
          size !== undefined 
            ? size.id === info[i].id ? "" : "hide" 
            : "hide"
      }>
        <IonItem lines="none">
          <IonRow class="w-100">
            <IonCol>
              <IonButton expand="block"
                onClick={()=> updPapers() }
              ><IonIcon icon={ createOutline } slot="start"/><IonLabel>Save</IonLabel></IonButton>
            </IonCol>
            <IonCol></IonCol>
            <IonCol>
              <IonButton expand="block"
                onClick={()=> setSize(undefined)}
              ><IonIcon icon={ closeCircleOutline } slot="start"/><IonLabel>Close</IonLabel></IonButton>
            </IonCol>
          </IonRow>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> Наименование </IonLabel>
          <IonInput value={ size?.name }
            onIonChange={(e)=>{
              if(size !== undefined){
                size.name = e.detail.value
                setSize(size)
              }
            }}
          ></IonInput>
        </IonItem>
        <IonButton
          expand="block"
          onClick={ () => { }}
        >
          Удалить
        </IonButton>
      </div>
      <div className = { 
        size !== undefined 
          ? size.id === info[i].id ? "hide" : "" 
          : ""
      }>
        <IonItem onClick={()=>{
            setSize(info[i])  
          }}>
            <IonGrid >
              <IonRow>
                <IonCol size="3"><IonIcon class="icon-1" icon={ copyOutline } /></IonCol>
                <IonCol size="9">
                  <IonRow>
                    <IonCol>
                      <IonText class="font-14">
                        { info[i].name }
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCardSubtitle>
                      { info[i].descr }
                    </IonCardSubtitle>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
      </div>      
    </>

  }
  
  return <>
    <IonLoading isOpen={load} message="Подождите" />
    { elem }
  </>;
}

export function Docs():JSX.Element {
  const [info, setInfo] = useState<any>([])

  Store.subscribe({num: 4, type: "docs", func: ()=>{
    setInfo( Store.getState().docs )
  }})

  useEffect(()=>{
    setInfo(Store.getState().docs)
  },[])

  Store.subscribe({num: 4, type: "docs", func: ()=>{
    setInfo(Store.getState().docs) 
  }})
  let elem = <></>

  for(let i = 0;i < info.length;i++){
    elem = <>
      { elem }
      <IonItem>
        <IonGrid class="w-100">
          <IonRow>
            <IonText class="font-14">{ info[i].Документ }</IonText>
          </IonRow>
          <IonRow>
            <IonCardSubtitle>{ info[i].address }</IonCardSubtitle>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  }

  return elem
}