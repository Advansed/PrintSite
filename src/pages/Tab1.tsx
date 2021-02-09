import React, { useEffect, useState } from 'react';
import { IonAlert, IonButton, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem
    , IonLabel, IonLoading, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { cameraOutline, closeCircleOutline, copyOutline, createOutline, documentOutline, imagesOutline, logoChrome, logoReddit, personAddOutline, resizeOutline } from 'ionicons/icons';
import { getData, Store } from './Store';
import { AddressSuggestions } from 'react-dadata';

import { Docs, MapAPI, Papers, Sizes, takePicture } from '../components/Functions'
import MaskedInput from '../mask/reactTextMask';
import 'react-dadata/dist/react-dadata.css';
import './Tab1.css';



const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";



const Tab1: React.FC = () => {
  const [marks,     setMarks]     = useState<any>([])
  const [docs,      setDocs]      = useState<any>([])
  const [franch,    setFranch]    = useState<any>()
  const [serv,      setServ]      = useState<any>();
  const [services,  setServices]  = useState<any>([])
  const [center,    setCenter]    = useState({lat: 62, lng: 129})
  const [alert,     setAlert]     = useState(false)
  const [modal,     setModal]     = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [name,      setName]      = useState("docs")

  async function load(){
    let res = Store.getState().services;
    let res2 = Store.getState().docs;
    if(franch !== undefined){
    let jarr:   any = []
    let dcs:    any = []
    let mrks:   any = []
    let ind = 0
    res.forEach((e)=>{
      if(e.franchaise === franch.id){
        e.label = labels[ind++ % labels.length]
        jarr = [...jarr, e];
        mrks = [...mrks, {name: e.name, label: e.label, coord:{lat: e.lat, lng: e.lng}}]
      }
    })
    setServices(jarr)
    setMarks(mrks)

    res2.forEach((e) => {
      console.log(e)
      console.log(jarr)
      if(jarr.findIndex(function(b) { 
        return b.id === e.service_id; 
      }) >= 0){
          e.label = labels[ind++ % labels.length]
          dcs = [...dcs, {name: e.Документ, label: e.label, coord:{lat: e.lat, lng: e.lng}}]  
       }
    })
    setDocs(dcs)
    console.log(dcs)
  } else {
    let mrks: any = []
    let dcs: any = []
    let ind = 0
    let jarr: any = [];
    res.forEach((e)=>{
      e.label = labels[ind++ % labels.length]
      jarr = [...jarr, e]
      mrks = [...mrks, {name: e.name, label: e.label, coord:{lat: e.lat, lng: e.lng}}]  
    })
    setServices(jarr)
    setMarks(mrks)
    ind = 0;
    res2.forEach((e) => {
      e.label = labels[ind++ % labels.length]
      dcs = [...dcs, {name: e.Документ, label: e.label, coord:{lat: e.lat, lng: e.lng}}]  
    })
    setDocs(dcs)
    console.log(dcs)
  }
  }  
  
  Store.subscribe({num: 1, type: "services", func: ()=>{
    load()
  }})
  Store.subscribe({num: 2, type: "coord", func: ()=>{
    setCenter(Store.getState().coord)
  }})

  useEffect(()=>{
    load()

    setCenter(Store.getState().coord)

  }, [franch])

  function Franch():JSX.Element {
    const [info, setInfo] = useState<any>([])

    Store.subscribe({num: 0, type: "franchaisers", func: ()=>{
      setInfo(Store.getState().franchaisers)
    }})

    useEffect(()=>{
      setInfo(Store.getState().franchaisers)
    },[])

    let elem = <></>    

    for(let i = 0; i < info.length;i++){
      elem = <>
        { elem }
        <IonItem 
          detail
          class = { 
            franch !== undefined 
              ? franch.id === info[i].id ? "item-1" : ""
              : ""
          }
          onClick={()=>{
          if(franch === undefined) {
            setFranch(info[i]) 
          }
          else 
          if(franch === info[i]) {
            setFranch(undefined)
          }
          else {
            setFranch(info[i])
          }

        }}>
          <IonGrid >
            <IonRow>
              <IonCol size="3"><IonIcon class="icon-1" icon={ logoReddit } /></IonCol>
              <IonCol size="9">
                <IonRow>
                  <IonCol>
                    <IonText class="font-14">
                      { info[i].fio }
                    </IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCardSubtitle>
                    { info[i].email }
                  </IonCardSubtitle>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </>
    }
    return elem;
  }

  function Services():JSX.Element {
    const [edit, setEdit] = useState(false);
    const [addr, setAddr] = useState(false)
    const [upd,  setUpd]  = useState(0)

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
        franch.image = imageUrl
        setFranch(franch);
        setUpd(upd + 1);
      };

      img.src = res;
    
    }

    async function getFoto1() {
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
        serv.image = imageUrl
        setServ(serv);
        setUpd(upd + 1);
      };

      img.src = res;
    
    }

    function updFranch(){
      setEdit(false) 
      if(franch.id === -1){
        let jarr = Store.getState().franchaisers
        jarr = [...jarr, franch]
        Store.dispatch({type: "franchaisers", franchaisers: jarr})
        franch.method = "franchaisers_s"
        getData("method", franch)
      } else {
        let jarr = Store.getState().franchaisers
        jarr = jarr.map((todo)=>{
          if(todo.id === franch.id){
            return franch
          }
          else
            return todo
        })
        Store.dispatch({type: "franchaisers", franchaisers: jarr})
        franch.method = "franchaisers_s"
        getData("method", franch)
      }
    }

    function updServ(){
      let jarr = Store.getState().services
      jarr = jarr.map((e)=>{
        if(e.id === serv.id) return serv
        else return e
      })
      Store.dispatch({ type: "services", services: jarr })
      serv.method = "services_s"
      getData("method", serv)
      setServ(undefined) 
      setUpd(upd + 1)
    }

    let elem = <></>
    if(franch !== undefined)
      elem = <>
        <div className={ edit ? "" : "hide" }>  
          <IonItem lines="none">
            <IonRow class="w-100">
              <IonCol>
                <IonButton expand="block"
                  onClick={()=>{ updFranch() }}
                ><IonIcon icon={ createOutline } slot="start"/><IonLabel>Save</IonLabel></IonButton>
              </IonCol>
              <IonCol></IonCol>
              <IonCol>
                <IonButton expand="block"
                  onClick={()=>{ setEdit(false) }}
                ><IonIcon icon={ closeCircleOutline } slot="start"/><IonLabel>Close</IonLabel></IonButton>
              </IonCol>
            </IonRow>
          </IonItem>
          <IonItem lines="none">
            <IonIcon class="icon-2" icon={ cameraOutline } slot="start" 
              onClick={()=>{
                getFoto()
              }}
            />
            <IonImg class="img-1" src={ franch.image }/>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Наименование</IonLabel>
            <IonInput value={ franch.fio }
              onIonChange={(e)=>{
                franch.fio = e.detail.value;
                setFranch(franch)
              }}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">элПочта</IonLabel>
            <IonInput value={ franch.email }
              onIonChange={(e)=>{
                franch.email = e.detail.value;
                setFranch(franch)
              }}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Телефон</IonLabel>
            <MaskedInput
              mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
              className="m-input"
              autoComplete="off"
              placeholder="+7 (914) 000-00-00"
              id='1'
              type='text'
              value = { franch?.phone }
              onChange={(e: any) => {
                  franch.phone = (e.target.value as string);
                  setServ(franch)
                }}
            />
          </IonItem>
          <IonRow>
            <IonCol></IonCol>
            <IonCol>
              <IonButton
                expand="block"
                onClick={ () => setAlert(true) }
              >
                Удалить
              </IonButton>
            </IonCol>
          </IonRow>
        </div>
        <div className={ edit ? "hide" : "" }>

          <IonItem onClick={()=>{
            setEdit(true)  
          }}>
            <IonGrid >
              <IonRow>
                <IonCol size="3"><IonIcon class="icon-1" icon={ logoReddit } /></IonCol>
                <IonCol size="9">
                  <IonRow>
                    <IonCol>
                      <IonText class="font-14">
                        { franch.fio }
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCardSubtitle>
                      { franch.email }
                    </IonCardSubtitle>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

        </div>
      </>    

    for(let i = 0; i < services.length;i++){
      elem = <>
        { elem }
        <div className={ serv !== undefined 
              ? serv.id === services[i].id ? "hide" : ""
              : "" 
        }>
          <IonItem onClick={()=>{
            let coord = { lat: services[i].lat, lng: services[i].lng }
            if(center.lat !== coord.lat || center.lng !== coord.lng) setCenter( coord )
            setServ(services[i])
          }}>
            <IonGrid >
              <IonRow>
                <IonCol size="3">
                  <IonRow>
                    <IonLabel><b>{ services[i].label }</b></IonLabel>
                  </IonRow>
                  <IonRow>
                    <IonIcon class="icon-1" icon={ logoChrome } />
                  </IonRow>
                </IonCol>
                <IonCol size="9">
                  <IonRow>
                    <IonCol>
                      <IonText class="font-14">
                        { services[i].name }
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCardSubtitle>
                      { services[i].address }
                    </IonCardSubtitle>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </div>
        <div className={ serv !== undefined 
              ? serv.id === services[i].id ? "" : "hide"
              : "hide" 
        }>
          <IonItem lines="none">
            <IonRow class="w-100">
              <IonCol>
                <IonButton expand="block"
                  onClick={()=> updServ() }
                ><IonIcon icon={ createOutline } slot="start"/><IonLabel>Save</IonLabel></IonButton>
              </IonCol>
              <IonCol></IonCol>
              <IonCol>
                <IonButton expand="block"
                  onClick={()=> setServ(undefined) }
                ><IonIcon icon={ closeCircleOutline } slot="start"/><IonLabel>Close</IonLabel></IonButton>
              </IonCol>
            </IonRow>
          </IonItem>
          <IonItem lines="none">
            <IonIcon class="icon-2" icon={ cameraOutline } slot="start" 
              onClick={()=> getFoto1()}
            />
            <IonImg class="img-1" src={ serv?.image }/>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Наименование</IonLabel>
            <IonInput value={ serv?.name }
              onIonChange={(e)=>{
                if(serv !== undefined) {
                  serv.name = e.detail.value
                  setServ(serv);
                }
              }}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">элПочта</IonLabel>
            <IonInput value={ serv?.email }
              onIonChange={(e)=>{
                if(serv !== undefined) {
                  serv.email = e.detail.value
                  setServ(serv) 
                } 
              }}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Телефон</IonLabel>
            <MaskedInput
              mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
              className="m-input"
              autoComplete="off"
              placeholder="+7 (914) 000-00-00"
              id = { (i + 1000).toString() }
              type='text'
              value = { serv?.phone }
              onChange={(e: any) => {
                  serv.phone = (e.target.value as string);
                  setServ(serv)
                }}
            />
          </IonItem>
          <div className = { addr ? "hide" : "" }>
            <IonItem 
              onClick={()=>{ setAddr(true) }}
            >
              <IonLabel position="stacked">Адрес</IonLabel>
              <IonText>{ serv?.address }</IonText>
            </IonItem>
          </div>
          <div className = { addr ? "" : "hide" }>
              <IonRow>
                  <IonItem lines="none">
                    <IonLabel position="stacked">Адрес</IonLabel>
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <AddressSuggestions 
                        token="23de02cd2b41dbb9951f8991a41b808f4398ec6e"
                      // filterLocations ={ dict }
                      hintText = "г. Якутск"
                      //defaultQuery = { serv?.address }
                      value = { serv?.address }
                      onChange={(e)=>{

                          if(e !== undefined && serv !== undefined){

                            serv.address =   e.value
                            serv.country =   e.data.country      === null ? ""    : e.data.country  
                            serv.region =    e.data.region       === null ? ""    : e.data.region_with_type as string
                            serv.state =     e.data.area         === null ? ""    : e.data.area_with_type as string
                            serv.city =      e.data.city         === null ? ""    : e.data.city_with_type as string
                            serv.locality =  e.data.settlement   === null ? ""    : e.data.settlement_with_type as string
                            serv.street =    e.data.street       === null ? ""    : e.data.street_with_type as string
                            serv.home =      e.data.house        === null ? ""    : e.data.house_type + " " + e.data.house
                            serv.flat =      e.data.flat         === null ? ""    : e.data.flat_type + " " + e.data.flat
                            serv.lat =       e.data.geo_lat      === null ? 0.00  : parseFloat(e.data.geo_lat)
                            serv.lng =       e.data.geo_lon      === null ? 0.00  : parseFloat(e.data.geo_lon)
                            
                            setServ(serv)
                            setAddr(false)

                          }
                      }}
                      />
                    </IonCol>  
                  </IonRow>
                  
                  <IonItem lines="none">
                  
                  </IonItem>
                  <IonItem lines="none">
                  
                  </IonItem>
                  <IonItem lines="none">
                    <IonButton
                      onClick={()=>{
                        setAddr(false)
                      }}
                    >
                      Отказ
                    </IonButton>
                  </IonItem>
              </IonRow>
            </div>
          <IonRow>
            <IonCol>
              <IonButton
                expand = "block"
                onClick={()=> setModal(true) }
              >
                Цены
              </IonButton>
            </IonCol>
            <IonCol>
            </IonCol>
          </IonRow>
            
        </div>
      </>
    }
    return elem;
  }

  function Prices(): JSX.Element {
    
    let jarr = Store.getState().prices;
    let prices: any = [] 

    jarr.forEach(e => {
      if( e.service === serv.id ) prices = [...prices, e]
    });


    let papers = Store.getState().papers;
    let sizes = Store.getState().sizes;

    function getValue(paper, size){
      let price = 0;
      prices.forEach(e => {
        if(e.service === serv.id && e.paper === paper && e.size === size){
          price = e.price
        }
      });

      return price
    }

    function Cols(Props):JSX.Element {
      let size = Props.size
      let elem = <>
      <IonCol class="p-col">{ size.name }</IonCol>
      </>
      for(let i = 0;i < papers.length;i++){
        //console.log(size.name + " - " + papers[i].name )
        elem = <>
          { elem }
          <IonCol class="p-col">
            <IonInput 
              placeholder= { papers[i].name }
              value = { getValue(papers[i].id, size.id) }
              onIonChange= {(e)=>{
                let price = parseFloat(e.detail.value as string)
                let ok = false
                let jarr = prices.map((e)=>{
                  if(e.paper === papers[i].id && e.size === size.id){
                    e.price = price
                    ok = true
                  }
                  return e
                });
                
                if(!ok) jarr = [...jarr, { service: serv.id, paper: papers[i].id, size: size.id, price: price }]

                prices = jarr;
              }}
            />
          </IonCol>
        </>
      }

      return elem
    }

    function Rows():JSX.Element {
      let elem = <></>

      for(let i = 0; i < sizes.length;i++){
        elem = <>
          { elem }
          <IonRow>
            <Cols size = { sizes[i] } />
          </IonRow>
        </> 
      }

      return elem
    }

    async function savePrices() {
      let param = {
        method: "prices_s",
        prices: prices,
      }
      setLoading(true)
      let res = await getData("method", param)
      Store.dispatch({type: "prices", prices: res[0]})
      setModal(false)
      setLoading(false)
    }
    let rows = <IonCol class="p-col"></IonCol>

    for(let i = 0;i < papers.length;i++){
      rows = <>
        { rows }
        <IonCol class="p-col">{ papers[i].name }</IonCol>
      </>
    }

    let elem = <>
      <IonGrid>
        <IonRow>
          { rows }
        </IonRow>
        <Rows />
        <IonRow>
          <IonCol></IonCol>
          <IonCol></IonCol>
          <IonCol>
            <IonButton
              expand = "block"
              onClick = {()=>{
                savePrices();

              }}
            >
              Сохранить
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      
    </>

    return elem;
  }

  function Right(): JSX.Element {
    let elem = <></>

    switch(name) {

      case "docs" :   elem  =  <Docs />;       break;
      case "papers":  elem  =  <Papers />;  break;
      case "sizes":   elem  =  <Sizes />;       break;

    }

    return elem;
  }

  return (
    <IonPage>
      <IonLoading isOpen={ loading }/>
      <IonHeader>
        <IonToolbar>
        <IonButton slot="start"
            onClick={()=>{
              setFranch({
                id:     -1,
                fio:    "++Новый++",
                phone:  "",
                email:  "",
                image:  "",
                role:   1,
              })
            }}
          >
            <IonIcon icon={ personAddOutline }></IonIcon>
          </IonButton>
          <IonButton slot="start"
            onClick={()=>{
               let serv = {
                  id:           -1,
                  name:         "++Новый++",
                  lat:          0,
                  lng:          0,
                  image:        "",
                  franchaise:   franch === undefined ? 0 : franch.id,
                  region:       "",
                  country:      "",
                  state:        "",
                  city:         "",
                  locality:     "",
                  street:       "",
                  home:         "",
                  flat:         "",
                  address:      "",
                  phone:        "",
                  email:        "",
               } 
               let jarr = [...services, serv]
               setServices( jarr )
               setServ( serv )
            }}
          >
            <IonIcon icon={ imagesOutline }></IonIcon>
          </IonButton>

          <IonButton slot="end"
            onClick={()=> setName("docs")}
          >
            <IonIcon icon={ documentOutline }></IonIcon>
          </IonButton>

          <IonButton slot="end"
            onClick={()=> setName("papers")}
          >
            <IonIcon icon={ copyOutline }></IonIcon>
          </IonButton>

          <IonButton slot="end"
            onClick={()=> setName("sizes")}
          >
            <IonIcon icon={ resizeOutline }></IonIcon>
          </IonButton>

          <IonTitle> Принт сервис </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="i-content">
          <div className = "left-1">
            <Franch />      
          </div>
          <div className = "left-1">
            <Services />      
          </div>
          <div id="map">
            <MapAPI
              center = { center }
              marks = { marks }
              docs = { docs }
            />
          </div>
          <div className = "right-1">
            <Right />  
          </div>
        </div>
      </IonContent>
      <IonAlert
          isOpen={ alert }
          onDidDismiss={() => setAlert(false)}
          cssClass='my-custom-class'
          header={'Удалить'}
          message={'Удалить этого франчайзера'}
          buttons={[
            {
              text: 'Отменить',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {

              }
            },
            {
              text: 'Удалить',
              handler: () => {
                let param = {
                  method: "franchaisers_d",
                  id: franch.id
                }
               
                getData("method", param)

                let fran = Store.getState().franchaisers;
                let jarr: any = []
                fran.forEach(e => {
                  if(e.id !== franch.id) jarr = [...jarr, e]
                });

                Store.dispatch({type: "franchaisers", franchaisers: jarr})
                
                setFranch(undefined)

              }
            }
          ]}
        />
      <IonModal isOpen={ modal } cssClass='my-custom-class'>
        <p>Прейскурант</p>
        <Prices />
        <IonButton onClick={() => setModal(false)}>Close Modal</IonButton>
      </IonModal>
    </IonPage>
  );
};

export default Tab1;
