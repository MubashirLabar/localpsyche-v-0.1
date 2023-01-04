import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios"
import Header from "../components/Header"
import Footer from "./Footer"
import countries from "../countries.json" 

function Sell() { 
 
    const [dropCur, setDropCur] = useState(false);
    const [dropCun, setDropCun] = useState(false);
    
    const [currency, setCurrency] = useState(null); 
    const [country, setCountry] = useState(''); 
    const [dropcurcountry,setdropcurcountry] = useState(null)
    const [amount, setAmount] = useState(null)
    const [allOrders, setAllOrders] = useState([])
    const [loading, setLoading] = useState(false);

    const [traders, SetTraders] = useState([
        {
            trader: "Top trader",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            payment: "1,800.25",
            covert_into: "PKR",
            convert_amt: "160.92",
            limit: {from: "50,000", to: "988,000"},
        },
        {
            trader: "X trader",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            payment: "250.25",
            covert_into: "PKR",
            convert_amt: "160.92",
            limit: {from: "50,000", to: "988,000"},
        },
        {
            trader: "Pak trader",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            payment: "1,800.25",
            covert_into: "PKR",
            convert_amt: "160.92",
            limit: {from: "50,000", to: "988,000"},
        },
    ])
 
    useEffect(()=>{
        _getAllOrder()
    },[country])
 
    useEffect(()=>{
        _getLocation()
        document.documentElement.scrollTop = 0;
        document.body.addEventListener("click", ()=>{
            setDropCur(false);
            setDropCun(false);
        })  
    },[]);    
  
    const _getAllOrder = () => {
        setLoading(true)
        axios.post(`${global.baseurl}:3000/allBuyOrders`, {country: country.toString()}) 
        .then((response) =>{
            //console.log(response)
            setLoading(false)
            setAllOrders(response.data.data);
        })
        .catch ((error) => {  
            setLoading(false) 
            console.log(error)
        })
    }

    const _getLocation = () => {
        axios.get("https://geolocation-db.com/json/f9902210-97f0-11eb-a459-b997d30983f1")
        .then((response) =>{
            //console.log(response)
            setCountry(response.data.country_name)
            setdropcurcountry(response.data.country_name)
            countries.map(item=>{
                if(response.data.country_name == item.country) 
                 {setCurrency(item.currency_code)}
            })
        }) 
        .catch ((error) => { 
            console.log(error)
        })
    } 

    return (
        <React.Fragment> 
            <Header/>
            <div className="buy-p">
                <div className="wrapper flex flex-col">
                    <div className="title font s42 black">With Psyche easy and rapid payments</div>
                    <div className="by-bl flex flex-col">
                        <div className="label font s40 b3 cfff">Sell Psyche</div>
                        <div className="form flex aic">
                            <div className="item flex flex-col">
                                <div className="lbl font s16 cfff">Coin</div>
                                <input 
                                    type="text" 
                                    className="input font s16 c000"
                                    onChange={(e)=>setAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                                />
                            </div>

                            {/* Select Currency */}
                            <div className="item flex flex-col">
                                <div className="lbl font s16 cfff">Currency</div>
                                <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                                    e.stopPropagation();
                                    setDropCur(!dropCur);  
                                    setDropCun(false); 
                                }}> 
                                    { 
                                        countries.map(item=>(
                                            dropcurcountry == item.country  && <div className="iput flex aic">
                                                <div className="txt font s16 black">{item.currency_code}</div>
                                                <img src="./images/arrow-down.svg" className="arrow"/>          
                                            </div>
                                        ))
                                    }  
                                    {dropCur && <div className="options flex flex-col abs">
                                        {
                                            countries.map(item=>(
                                                <button className="cleanbtn item flex aic anim" onClick={()=>{
                                                    setDropCur(!dropCur); 
                                                    setCurrency(item.currency_code);
                                                    setdropcurcountry(item.country)
                                                }}>        
                                                    <div className="txt font s16 black">{item.currency_code}</div> 
                                                </button> 
                                            ))
                                        }
                                        </div> 
                                    }
                                </button>
                            </div>
                        
                            {/* Select Country */}
                            <div className="item flex flex-col">
                                <div className="lbl font s16 cfff">Country</div>
                                <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                                    e.stopPropagation();
                                    setDropCun(!dropCun);  
                                    setDropCur(false); 
                                }}>
                                    { 
                                        countries.map(item=>(
                                            country == item.country  && <div className="iput flex aic">
                                                <div className="txt font s16 black wordwrap">{item.country}</div>
                                                <img src="./images/arrow-down.svg" className="arrow"/>          
                                            </div>
                                        ))
                                    } 
                                    {dropCun && <div className="options flex flex-col abs">
                                        {
                                            countries.map(item=>(
                                                <button className="cleanbtn item flex aic anim" onClick={()=>{
                                                    setDropCun(!dropCun);
                                                    setCountry(item.country);
                                                }}>        
                                                    <div className="txt font s16 black wordwrap">{item.country}</div> 
                                                </button> 
                                            ))
                                        }
                                        </div> 
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                                    
                    {/* Trader List Block */}
                    <div className="trds-bl flex flex-col">
                    <div className="table">
                        <div className="hdr flex aic">
                            <div className="col flex aic">
                                <div className="circle hid" />
                                <div className="font s16 cfff">Trader</div>
                            </div>
                            <div className="col flex aic"><div className="font s16 cfff">Payment</div></div>
                            <div className="col flex aic"><div className="font s16 cfff">Available</div></div>
                            <div className="col flex aic"><div className="font s16 cfff">Price</div></div>
                        </div>
                        {  
                            loading == false ? allOrders.length > 0 ?
                            allOrders.map( (item,index) => (  
                                <div key={index} className="row flex">
                                    <div className="col flex aic">
                                        <div className={`circle Top trader`} />
                                        <div className="flex flex-col">
                                            <div className="lbl font s15 cfff flex aic">
                                                <span>Top trader</span>&nbsp;&nbsp;
                                                <div className="online" />
                                            </div>
                                            <div className="flex aic">
                                                <div className="font s12 cfff">{`125 orders`}</div>&nbsp;&nbsp;
                                                <div className="font s12 cfff">{`100%`}</div>&nbsp;&nbsp;
                                                <div className="font s12 cfff">{`4.9 Trust`}</div>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className="col flex flex-col">
                                        <div className="lbl font s15 cfff">{item.payment}</div>
                                    </div>
                                    <div className="col flex flex-col">
                                        <div className="lbl font s15 cfff">{item.amount}</div>
                                    </div>
                                    <div className="col flex flex-col">
                                        <div className="lbl font s15 cfff">{item.price}&nbsp;<span className="s11">{item.currency}</span>
                                        </div> 
                                        <div className="txt font s13 b3 cfff">{`Limit: ${item.minAmount} to ${item.maxAmount}`}</div>
                                    </div>
                                    <div className="actions flex aic">
                                        <Link to={`/seller-order/${item._id}`} className="button font s15 cfff anim">Sell</Link>
                                    </div>
                                </div>
                            ))
                            :
                            <div className="empty-sec flex flex-col aic">
                                <div className="font s16 cfff">Opps! Result not Found.</div>
                            </div>
                            :
                            <React.Fragment>
                                <div className="row flex">
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                </div> 
                                <div className="row flex">
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                </div>
                                <div className="row flex">
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                    <div className="col holder" />
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </div>
                </div>  
            </div>
            <Footer/>
        </React.Fragment>
    );
}

export default Sell; 