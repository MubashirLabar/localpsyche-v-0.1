import React,{useState,useEffect} from 'react'
import Header from "../components/Header"
import Footer from "./Footer"
import axios from "axios"
import {Toast} from "../ui"
import {useDispatch, useSelector} from "react-redux"

function OrderList(props) {

    const {match} = props;
    const type = props.location.search ? props.location.search.split('=')[1] : null

    const [orderDetails, setOrderDetails] = useState([])
    const [loading, setLoading] = useState(false)
    const [offers, setOffers] = useState([]) 
    const _orderList = [
        {
            name: "William",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            coins: "50.00",
            amount: "8000",
            unit: "PKR"
        },
        {
            name: "Carlos",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            coins: "150.00",
            amount: "150000",
            unit: "USD"
        },
        {
            name: "Nawaz",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            coins: "150.00",
            amount: "9000",
            unit: "PKR"
        },
        {
            name: "Asad",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            coins: "150.00",
            amount: "1000",
            unit: "USD"
        },

    ]
    const _reviews = [
        {
            buyer: "Buyer xyz",
            amount: "250 USD1",
            stamp: "31 jan 2021 18:35",
            trust: "4.5",
            cmt: "Good trade, seller is friendly"
        },
        {
            buyer: "Buyer xyz",
            amount: "500 USD1",
            stamp: "25 Feb 2021 09:35",
            trust: "3.7",
            cmt: "Fast and good"
        },
        {
            buyer: "Buyer xyz",
            amount: "150 USD1",
            stamp: "05 Feb 2021 14:35",
            trust: "5.0",
            cmt: "Good trade, seller is friendly"
        },
        
    ]  
  
    const generalReducers = useSelector(state => state);
    const {userInfo} = generalReducers;
    const {user} = userInfo; 
    var token = localStorage.getItem("key");

    useEffect(()=>{
        document.documentElement.scrollTop = 0;
        _getOrderDetails()
        _getOffers()
    },[]) 

    const _getOffers = async () => {
        setLoading(true)
        if(type == 'sell'){
            try {
                const { data } = await axios({
                    method: 'post', 
                    url: `${global.baseurl}:3000/getOffers`,
                    data: {sellId: props.match.params.id},
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                }); 
                //console.log(data)
                if(data.success){
                    setOffers(data.data)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        else if(type == 'buy'){
            try {
                const { data } = await axios({
                    method: 'post', 
                    url: `${global.baseurl}:3000/getBuyOffers`,
                    data: {buyId: props.match.params.id},
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                }); 
                //console.log(data)
                if(data.success){
                    setOffers(data.data)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        else {
            setLoading(false)
        }
    }

    const _getOrderDetails = async () => {
        if(type == 'sell'){
            try {
                const { data } = await axios({
                    method: 'post', 
                    url: `${global.baseurl}:3000/orderDetails`,
                    data: {sellId: match.params.id},
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                }); 
                //console.log(data) 
                if(data){
                    setOrderDetails(data.data)
                }
            } catch (error) {
                console.log(error)
            }
        } 
        else if (type == 'buy'){
            try {
                const { data } = await axios({
                    method: 'post', 
                    url: `${global.baseurl}:3000/buyOrderDetails`,
                    data: {buyId: match.params.id},
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                }); 
                //console.log(data) 
                if(data){
                    setOrderDetails(data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            setLoading(false)
        }

        /*axios.post("http://18.217.183.8:3000/orderDetails", {sellId: match.params.id}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization":  token
            } 
        })
        .then((response) =>{
            //console.log(response)
            setOrderDetails(response.data.data)
        })
        .catch ((error) => { 
            console.log(error)
        }) */
    }
 
    const _acceptOrder = (item) => {
        if(type == 'sell'){
            axios.post(`${global.baseurl}:3000/acceptOrder`, {sellId: props.match.params.id, buyId: item._id}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                } 
            })
            .then((response) => {
                //console.log(response) 
                const {success, data} = response.data;
                Toast.show({ html: data, type: success ? 'ok' : 'error', time: 5 });
                if(success){props.history.push(`/buyer-order/${props.match.params.id}`)}
            })  
            .catch((error) =>  {   
                console.log(error);
            });
        }  
        else if(type == 'buy'){ 
            props.history.push(`/seller-order/${props.match.params.id}`)
            axios.post(`${global.baseurl}:3000/acceptBuyOrder`, {sellId: item._id, buyId: item.orderId}, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                } 
            }
            )
            .then((response) => {
                console.log(response) 
                const {success, data} = response.data;
                Toast.show({ html: data, type: success ? 'ok' : 'error', time: 5 });
                if(success){props.history.push(`/seller-order/${props.match.params.id}`)}
            })  
            .catch((error) =>  {    
                console.log(error);
            }); 
        } 
        else {<></>}

    }

    //console.log(orderDetails)
    //console.log(offers) 

    return ( 
        <React.Fragment>
            <Header/>
            <div className="orderlist-p">
                <div className="wrapper flex flex-col">
                    <div className="title flex aic">
                        <div className="font s32 black">New orders list</div>
                    </div>
                    {/* Order List Block */}
                    <div className="block flex flex-col">
                        <div className="content">
                            {loading == false ? offers && offers.length > 0 ?
                                offers.map( (item,index) => ( 
                                    <div className="blk flex aic">
                                        <div className="item flex flex-col">
                                            <div className="nam font s28 cfff wordwrap">{item.email}</div>
                                            <div className="flex aic">
                                                <div className="font s12 cfff">{`125 orders`}</div>&nbsp;&nbsp;
                                                <div className="font s12 cfff">{`100%`}</div>&nbsp;&nbsp;
                                                <div className="font s12 cfff">{`4.9 Trust`}</div>
                                            </div>
                                        </div> 
                                        <div className="item">
                                            <div className="lbl font s14 cfff">Coin</div>
                                            <input 
                                                type="number" 
                                                className="iput font s15 b3 c000" 
                                                readOnly
                                                value={item.amount}
                                            />
                                        </div>
                                        <div className="item">
                                            <div className="lbl font s14 cfff">Price</div>
                                            <div className="iput flex aic">
                                                <input 
                                                    type="number" 
                                                    className="amt font s15 b3 c000" 
                                                    readOnly
                                                    value={item.price}
                                                />
                                                <div className="unit font s15 b3 c000">{item.currency}</div> 
                                            </div>
                                        </div>
                                        {
                                            ((orderDetails.buyerId == item.email || orderDetails.email == user.email) && (orderDetails.status == 'escrow' || orderDetails.status == 'paid')) ?
                                            <div className="item">
                                                <div className="lbl font s15 cfff"></div>
                                                <button 
                                                    className="button font cfff s15 anim" 
                                                    onClick={()=> {
                                                        type == 'sell' ? 
                                                            props.history.push(`/buyer-order/${props.match.params.id}`) 
                                                        : 
                                                            props.history.push(`/seller-order/${props.match.params.id}`)
                                                    }}>View Order</button>
                                            </div>
                                            :
                                            <div className="item">
                                                <div className="lbl font s15 cfff"></div>
                                                <button 
                                                    className={`button font cfff s15 anim ${(orderDetails.status =='escrow' || orderDetails.status == 'paid') && 'disabled' }`} 
                                                    onClick={()=> {_acceptOrder(item)}}
                                                    disabled={orderDetails.status =='escrow' || orderDetails.status == 'paid'}
                                                >Accept</button>
                                            </div>
                                        }
                                    </div>
                                ))
                                :
                                <div className="empty-sec flex flex-col aic">
                                    <div className="msg font s16 cfff">Opps! Your have not received any order yet.</div>
                                </div>
                                :
                                <React.Fragment>
                                    <div className="blk flex aic">
                                        <div className="item holder" />
                                        <div className="item holder" />
                                        <div className="item holder" />
                                        <div className="item holder" />
                                    </div>
                                    <div className="blk flex aic">
                                        <div className="item holder" />
                                        <div className="item holder" />
                                        <div className="item holder" />
                                        <div className="item holder" />
                                    </div>
                                    <div className="blk flex aic">
                                        <div className="item holder" />
                                        <div className="item holder" />
                                        <div className="item holder" />
                                        <div className="item holder" />
                                    </div>
                                </React.Fragment>

                            }
                        </div>
                        {/*<div className="ftr flex aic">
                            <button className="button font s15 cfff anim">Cancel trade</button>
                        </div>*/}
                    </div> 
                
                    {/* Review section */}
                    <div className="reviews-bl flex flex-col">
                        <div className="hdr flex aic">
                            <div className="tit font s24 cfff">Your Review</div>
                        </div>
                        <div className="content">
                            {
                                _reviews.map( (item,index) => (
                                    <div className="blk flex aic">
                                        <div className="item flex aic">
                                            <div className="font s14 cfff">{item.buyer}</div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="font s14 cfff">{item.amount}</div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="font s14 cfff">{item.stamp}</div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="font s15 cfff">{item.trust}</div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="font s15 cfff">{item.cmt}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </React.Fragment>
    );
}

export default OrderList;