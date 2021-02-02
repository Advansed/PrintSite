import { combineReducers  } from 'redux'
import { Reducer } from 'react';
import { Geolocation } from '@capacitor/core';
import axios from 'axios'

export var datas = {
    service: {
        id: 0,
        name: "",
        image: "",
        franchaise: "",    
        state: "",
        city:   "",
        locality: "",
        street: "",
        home: "",
        office: "",
    },

}

var reducers: Array<Reducer<any, any>>;reducers = []

export const i_state = {

    auth:           false,
    login:          {
        phone:      "",
        fio:        "",
        email:      "",
        pass:       "",
    },
    coord:          {lat: 62, lng: 129},
    franchaisers:   [],
    services:       [],
    papers:         [],
    sizes:          [],
    prices:         [],
}

export async function   getData(method : string, params){

    let res = await axios.post(
            URL + method, params,
            {
                auth: {
                    username: unescape(encodeURIComponent("МФО_Админ")),
                    password: unescape(encodeURIComponent("1234"))
                },
            }
        ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}

export async function   getData1(method : string, params){

    let res = await axios.get(
            URL + method,
            {
                auth: {
                    username: unescape(encodeURIComponent("МФО_Админ")),
                    password: unescape(encodeURIComponent("1234"))
                }, params
            }
        ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}

for(const [key, value] of Object.entries(i_state)){
    reducers.push(
        function (state = i_state[key], action) {
            switch(action.type){
                case key: {
                    if(typeof(value) === "object"){
                        if(Array.isArray(value)) {
                            return action[key]
                        } else {
                            let data: object; data = {};
                            for(const key1 of Object.keys(value)){ 
                                data[key1] = action[key1] === undefined ? state[key1] : action[key1]
                            }   
                            return data
                        }

                    } else return action[key]
                }
                default: return state;
            }       
        }

    )
}

const           rootReducer = combineReducers({

    auth:           reducers[0],
    login:          reducers[1],
    coord:          reducers[2],
    franchaisers:   reducers[3],
    services:       reducers[4],
    papers:         reducers[5],
    sizes:          reducers[6],
    prices:         reducers[7],

})

interface t_list {
    num: number, type: string, func: Function,
}

function        create_Store(reducer, initialState) {
    var currentReducer = reducer;
    var currentState = initialState;
    var listeners: Array<t_list>; listeners = []
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listeners.forEach((elem)=>{
                if(elem.type === action.type){
                    elem.func();
                }
            })
            return action;
        },
        subscribe(listen: t_list) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === listen.num; 
            });
            if(ind >= 0){
                listeners[ind] = listen;
            }else{
                listeners = [...listeners, listen]
            }
 
        }
    };
}

async function  getLocation() {
    try {
        const posit = await Geolocation.getCurrentPosition();
        let param = {
            type: "coord",
            lat: posit.coords.latitude, 
            lng: posit.coords.longitude
        }
        Store.dispatch(param);

    } catch (e) {
        console.log("error getLocation")
       // setLoading(false);
    }
}

export async function  exec(){

    getLocation()

    /////////////////////////franchaisers////////////////////////////////////////////////////
    let res = await getData("method", { method: "franchaisers"} )
    Store.dispatch( {type: "franchaisers", franchaisers: res[0]} )

    res = await getData("method", { method: "services"} )
    Store.dispatch( {type: "services", services: res[0]} )

    res = await getData("method", { method: "papers"})
    Store.dispatch( {type: "papers", papers: res[0]})
    
    res = await getData("method", { method: "sizes"})
    Store.dispatch( {type: "sizes", sizes: res[0]})

    res = await getData("method", { method: "prices"})
    Store.dispatch( {type: "prices", prices: res[0]})

}

export const Store = create_Store(rootReducer, i_state)
export const URL = "http://89.208.211.109:3000/"

export async function getDatas(){
}

exec();

export const franchaisers = [
      {id: 0, phone:"", fio: "Без франшизы", email: "mail@poka.net", image: ""}
     ,{id: 1, phone:"+79142227300", fio: "Николай", email: "atlasov.n.r@gmail.com", image: ""}
     ,{id: 2, phone:"+79142299692", fio: "Алена", email: "ellena.pro@yandex.ru", image: ""}
     ,{id: 3, phone:"+79245684144", fio: "Петров", email: "petrov@mail.ru", image: ""}
]

export const services = [
     {id: 1, name: "Принт-Сервис №3", address: "Якутск, Пояркова 8, д. 54", image: "", franchaise: 0}
    ,{id: 2, name: "Принт-Сервис №1", address: "Якутск, Лермонтова 23, д. 3", image: "", franchaise: 1}
    ,{id: 3, name: "Принт-Сервис №4", address: "Якутск, Горького 100", image: "", franchaise: 1}
    ,{id: 4, name: "Принт-Сервис №2", address: "Якутск, Ленина 45, д. 67", image: "", franchaise: 2}
]