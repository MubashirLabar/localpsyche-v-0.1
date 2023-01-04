import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from "../components/Header"
import Footer from "./Footer"
import axios from "axios"
import {Toast, LineLoader} from "../ui"
import {Dialog, focus, formatTime, moment} from "../core";
import {useDispatch, useSelector} from "react-redux"
import Messenger from './Messenger'
import StarRating from '../components/StarRating'
import price from 'crypto-price'

const  BuyerSideOrder = ({match, history}) => {
  
    const [amt, setAmt] = useState(null)
    const [prc, setPrc] = useState('')
    const [exchangeMode, setExchangeMode] = useState('coin-to-price')
    const [orderDetails, setOrderDetails] = useState()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [reviewNote, setReviewNote] = useState(null)
    const [submitReviewLoading, setSubmitReviewLoading] = useState(false)
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [showTradeComplete, setShowTradeComplete] = useState(false)

    const generalReducers = useSelector(state => state);
    const {userInfo, buyStatus, isUser, rateCommunication, rateTrust, rateSpeed} = generalReducers;
    const {user} = userInfo;

    const dispatch = useDispatch() 

    var token = localStorage.getItem("key");

    useEffect(()=>{ 
        _getOrderDetails()
    },[]) 


    useEffect(()=>{
        if(exchangeMode == 'price-to-coin'){
            if(prc != '' || prc != null){
                setAmt('')
                _getPriceToCoin()
            }
            if(prc == '' || prc == null){setAmt(0)}
        } 
        else {
            if(amt != '' || amt != null){
                setPrc('')
                _getCoinToPrice()
            }
            if(amt == '' || amt == null){setPrc('')}
        }
    },[exchangeMode == 'price-to-coin' ? prc : amt])

    useEffect(()=>{
        if(orderDetails){orderDetails.status == 'complete' && setShowTradeComplete(true)}
       _getUserRating()
       if(isUser){
        _getStatus()
       }
    },[orderDetails]) 

    //console.log(user) 
    //console.log(orderDetails) 

    const _getCoinToPrice = () => {
        if(orderDetails){
            setPrc(amt * orderDetails.price.toFixed(2));
        } 
    }
 
    const _getPriceToCoin = () => {
        if(orderDetails){
            setAmt((prc / orderDetails.price).toFixed(2))
        }
    }

    const _getOrderDetails = async () => {
        setLoading(true)
        try {
            const { data } = await axios({
                method: 'post', 
                url: `${global.baseurl}:3000/orderDetails`,
                data: {sellId: match.params.id},
            }); 
            //console.log(data)
            if(data.success){
                setOrderDetails(data.data)
                dispatch({type: 'BUY_ORDER', payload: data.data.status})
                setLoading(false) 
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
  
    const _getStatus = async () => {
        try {
            const { data } = await axios({
                method: 'post', 
                url: `${global.baseurl}:3000/orderStatus`,
                data: {status: 'sell', sellId: match.params.id, email: user.email},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                } 
            }); 
            //console.log(data)
            if(data.success){
                setStatus(data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const _buy = () => {
        const {country, _id} = orderDetails
        if(amt == '' || amt == null){
            focus("._amt");
            Toast.show({ html: "Coin required greater than zero."}, 5);
        } else if (prc == '' || prc == null){
            focus("._prc");
            Toast.show({ html: "Price required greater than zero."}, 5);
        } else { 
            setLoading(true)
            let _data = {
                price: prc,
                country: country,
                currency: orderDetails.currency,
                amount: amt, 
                email: user.email,
                orderId: _id 
            }
            axios.post(`${global.baseurl}:3000/postOffer`, _data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                }  
            })
            .then((response) =>{
                //console.log(response) 
                const {success, data} = response.data;
                Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                setLoading(false)
                _getOrderDetails()
                _getStatus()
            })
            .catch ((error) => { 
                console.log(error)
                setLoading(false)
                _getOrderDetails()
                _getStatus()
            }) 
        }
    }

    const _paid = () => {
        Dialog( 
            "Confirmation",
            <div className="del-order flex flex-col">
                <div className="msg font s16 cfff">Have you already paid?</div>
            </div>,
            true,  
            { 
                label: "Cancel", 
                onClose: ()=> {}
            }, 
            {
                label: "Confirm", 
                onConfirm: ()=> {
                    setLoading(true)
                    axios.post(`${global.baseurl}:3000/paid`, {sellId: orderDetails._id}, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":  token
                        } 
                    })
                    .then((response) =>{
                        //console.log(response)
                        const {success, data} = response.data;
                        Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                        _getOrderDetails()
                        setLoading(false)
                    })
                    .catch ((error) => { 
                        console.log(error)
                        _getOrderDetails()
                        setLoading(false)
                    }) 
                }
            } 
        )
    } 
 
    const _release = () => {
        Dialog( 
            "Confirmation",
            <div className="del-order flex flex-col">
                <div className="msg font s16 cfff">Are you sure, you want to release?</div>
            </div>,
            true,  
            { 
                label: "Cancel", 
                onClose: ()=> {}
            }, 
            {
                label: "Confirm", 
                onConfirm: ()=> {
                    setLoading(true)
                    axios.post(`${global.baseurl}:3000/release`, {sellId: orderDetails._id}, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":  token
                        }  
                    })
                    .then((response) =>{
                        //console.log(response) 
                        const {success, data} = response.data;
                        Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                        _getOrderDetails()
                        setLoading(false)
                    }) 
                    .catch ((error) => { 
                        console.log(error)
                        _getOrderDetails()
                        setLoading(false)
                    }) 
                }
            } 
        )
    }

    const _cancelTrade = () => {
        Dialog( 
            "Confirmation",
            <div className="del-order flex flex-col">
                <div className="msg font s16 cfff">Are you sure want to cancel this trade?</div>
            </div>,
            true,  
            { 
                label: "Cancel", 
                onClose: ()=> {}
            }, 
            {
                label: "Confirm", 
                onConfirm: ()=> {
                    setLoading(true)
                    axios.post(`${global.baseurl}:3000/cancelTrade`, {sellId: orderDetails._id}, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":  token
                        } 
                    })
                    .then((response) =>{
                        console.log(response) 
                        const {success, data} = response.data;
                        Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                        setLoading(false)
                        _getOrderDetails()
                    })
                    .catch ((error) => { 
                        console.log(error)
                        setLoading(false)
                        _getOrderDetails()
                    }) 
                }
            } 
        )
    }

    const _report = () => {
        Dialog( 
            "Report",
            <div className="del-order flex flex-col">
                <div className="msg font s16 cfff">Are you sure want to report the trade?</div>
            </div>,
            true,  
            { 
                label: "Cancel", 
                onClose: ()=> {}
            }, 
            {
                label: "Confirm", 
                onConfirm: ()=> {
                    setLoading(true)
                    axios.post(`${global.baseurl}:3000/report`, {
                        id: orderDetails._id,
                        status: 'sell',
                        email: user.email
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":  token
                        } 
                    })
                    .then((response) =>{
                       console.log(response) 
                        const {success, data} = response.data;
                        Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                        setLoading(false)
                        _getOrderDetails()
                    })
                    .catch ((error) => { 
                        console.log(error)
                        setLoading(false)
                        _getOrderDetails()
                    }) 
                }
            } 
        )
    }
    
    /* Rating Order */
    const _review = () => {
        setSubmitReviewLoading(true)
        if(user.email == orderDetails.buyerId){
            axios.post(`${global.baseurl}:3000/review`, 
            {
                communication : rateCommunication,
                trust : rateTrust, 
                speed : rateSpeed,   
                amount: orderDetails.amount,
                currency: orderDetails.currency,
                reviewer : user.email,
                userId : orderDetails.user_name,
                orderId : orderDetails._id,
                status : 'buy', 
                notes: reviewNote
            }, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                }  
            })
            .then((response) =>{
                console.log(response) 
                const {success, data} = response.data;
                Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                _getUserRating()
                setShowTradeComplete(false)
                setSubmitReviewLoading(false)
            }) 
            .catch ((error) => { 
                console.log(error)
                _getUserRating()
                setSubmitReviewLoading(false)
            }) 
        } 
    }  

    /* Get user Rating/Reviews */
    const _getUserRating = async () => {
        setReviewsLoading(true)
        try {
            const { data } = await axios({
                method: 'post', 
                url: `${global.baseurl}:3000/userRating`,
                data: {email: orderDetails.email},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                }  
            });
            if(data.success){
                //console.log(data)
                setReviews(data.data)
                setReviewsLoading(false)
            }
        } catch (error) {
            //console.log(error);
            setReviewsLoading(false)
        } 
    }

    return ( 
        <React.Fragment> 
            <Header/>
            <div className="order-p">
                <div className="wrapper flex flex-col">
                    <div className="title flex aic"> <div className="font s32 black">Order: 250</div></div>
                    {loading == false ? orderDetails && 
                        <React.Fragment>
                        <div className="section rel">
                            <div className="hdr flex aic">
                                <div className="lef flex flex-col">
                                    <div className="lbl font s32 cfff">Buyer</div>
                                    <div className="nam font s32 cfff">William</div>
                                    <div className="flex aic">
                                        <div className="font s12 cfff">{`125 orders`}</div>&nbsp;&nbsp;
                                        <div className="font s12 cfff">{`100%`}</div>&nbsp;&nbsp;
                                        <div className="font s12 cfff">{`4.9 Trust`}</div>
                                    </div>
                                </div>
                                <div className="rig flex flex-col">
                                    <div className="lbl font s32 cfff">Seller</div>
                                    <div className="nam font s32 cfff">X trader</div>
                                    <div className="flex aic">
                                        <div className="font s12 cfff">{`125 orders`}</div>&nbsp;&nbsp;
                                        <div className="font s12 cfff">{`100%`}</div>&nbsp;&nbsp;
                                        <div className="font s12 cfff">{`4.9 Trust`}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="content flex flex-col">
                                {/* Buy Form */}
                                <div className="form flex">
                                    <div className="form-lef flex flex-col">
                                        <div className="item">
                                            <div className="lbl font s15 cfff">Coin</div>
                                            <input 
                                                type="text" 
                                                className="input _amt font s15 c000"
                                                disabled={orderDetails.status == 'escrow' || orderDetails.status == 'paid' || orderDetails.status == 'complete'}
                                                value={orderDetails.status == 'new' ? amt : orderDetails.escrowAmount}
                                                onChange={(e) =>{
                                                    setAmt(e.target.value.replace(/[^0-9\.]/g, ''))
                                                    setExchangeMode('coin-to-price')
                                                    _getCoinToPrice()
                                                }} 
                                            />
                                        </div>
                                        <div className="item">
                                            <div className="lbl font s15 cfff">Price</div>
                                            <div className="input _prc flex aic">
                                                <input 
                                                    type="text" 
                                                    className="amt font s15 c000"
                                                    disabled={orderDetails.status == 'escrow' || orderDetails.status == 'paid' || orderDetails.status == 'complete'}
                                                    value={orderDetails.status == 'new' ? prc : orderDetails.price}
                                                    onChange={(e) => {
                                                        setPrc(e.target.value.replace(/[^0-9\.]/g, ''))
                                                        setExchangeMode('price-to-coin')
                                                        _getPriceToCoin()
                                                    }}
                                                />
                                                <div className="unit font s15 c000">{orderDetails.currency}</div>
                                            </div>
                                        </div> 
                                        <div className="item textarea">
                                            <div className="lbl font s15 cfff">Seller's terms</div>
                                            <textarea 
                                                type="text"  
                                                className="input area font s15 c000"
                                                readOnly
                                                value={orderDetails.notes}
                                            />
                                        </div>
                                        {
                                            isUser && orderDetails ?
                                            <>
                                                {
                                                    (orderDetails.status == 'new' || user.email != orderDetails.email) &&
                                                    <button 
                                                        disabled={orderDetails.status == "escrow" || orderDetails.status == 'paid' || orderDetails.status == 'complete' || status == 'pending'} 
                                                        className={`button font s15 cfff anim ${(orderDetails.status == "escrow") || (orderDetails.status == 'paid') || (orderDetails.status == 'complete') || (status == 'pending') ? 'disabled' : ''}`} 
                                                        onClick={() => {_buy()}}
                                                    >Buy</button>
                                                }
                                                {(status == 'pending' && orderDetails.status == 'new') && <div className="font s15 cfff">Please wait unit seller have not accept your offer.</div>}
                                            </>
                                            :
                                            <>
                                                <Link to='/register' className="button font s15 cfff anim">Sign up</Link>
                                                <div className="font s15 cfff">Sign up first and continue the trade.</div>
                                            </>
                                        }
                                        <div className={`er font s15 cfff anim ${(amt < orderDetails.minAmount && amt > 0) ? 'show' : 'hide'}`}>{`The minimum coin you can buy from this ad is ${orderDetails.minAmount} ${orderDetails.currency}.`}</div>
                                        <div className={`er font s15 cfff anim ${(amt > orderDetails.maxAmount && amt > 0) ? 'show' : 'hide'}`}>{`The biggest coin you can buy from this ad is ${orderDetails.maxAmount} ${orderDetails.currency}.`}</div>
                                    </div>  
                                    <div className="rig flex flex-col">
                                        <div className="item textarea flex flex-col">
                                            <div className="lbl font s15 cfff">Message</div>
                                            <div className='msg-container'>
                                                <Messenger room="sellToBuy" orderDetails={orderDetails}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    isUser == true && orderDetails ?
                                    <>
                                        {user.email == orderDetails.buyerId && (orderDetails.status == 'escrow' || orderDetails.status == 'paid') &&
                                            <div className="terms"> 
                                                {orderDetails.status == "escrow" && <div className="msg font s15 cfff">{`You hav ${orderDetails.time_limit} min to pay ${orderDetails.amount} coin to the seller's given  account details.`}<br/>Press paid once you have transferred the payment to the seller given account.</div>}  
                                                <button  
                                                    disabled={(orderDetails.status == "paid") || (orderDetails.status == "complete")} 
                                                    className={`button font s15 cfff anim ${(orderDetails.status == 'paid') || (orderDetails.status == 'complete') ? 'disabled' : ''}`}
                                                    onClick={()=>{_paid()}}
                                                >Paid </button> 
                                                {user.email == orderDetails.buyerId && orderDetails.status == 'paid' && <div className="msg font s15 cfff">Payment has been send successfully. Please waiting for seller response to release coins.</div>}
                                            </div> 
                                        }
                                        {(user.email == orderDetails.email && orderDetails.status != 'new') && 
                                            <div className="terms">  
                                                {orderDetails.status == "paid" && <div className="msg font s15 cfff">The payment has been made.</div>}
                                                {orderDetails.status == "escrow" && <div className="msg font s15 cfff">The buyer has not paid at yet.</div>}
                                                <button 
                                                    disabled={orderDetails.status != "paid" || orderDetails.status == 'complete'} 
                                                    className={`button font s15 cfff anim ${(orderDetails.status != "paid" || orderDetails.status == 'complete') ? 'disabled' : ''}`} 
                                                    onClick={()=>{_release()}}
                                                >Release</button>
                                                {user.email == orderDetails.email && orderDetails.status == 'complete' && <div className="msg font s15 cfff">Trade has been completed successfully.</div>}
                                            </div> 
                                        }
                                        {(orderDetails.status == 'escrow' || orderDetails.status == 'paid' || orderDetails.complete) && (orderDetails.email == user.email || orderDetails.buyerId) &&

                                            <div className="ftr flex aic">
                                                <button 
                                                    disabled={(orderDetails.status != "escrow" || orderDetails.status == 'complete')}
                                                    className={`button font s15 cfff anim ${(orderDetails.status != "escrow" || orderDetails.status == 'complete')&& 'disabled'}`} 
                                                    onClick={() =>{_cancelTrade()}}
                                                >Cancel trade</button>
                                                <button 
                                                    disabled={(orderDetails.status == "new" || orderDetails.status == 'complete')}
                                                    className={`button font s15 cfff anim ${(orderDetails.status == "new" || orderDetails.status == 'complete') && 'disabled'}`}
                                                    onClick={() =>{_report()}}
                                                >Report/Appeal</button>
                                            </div>
                                        }
                                    </>
                                    :
                                    <div className="null"></div>
                                }
                            </div>                         
                        </div>
                        {isUser &&
                            (user.email == orderDetails.buyerId) && showTradeComplete &&
                            <div className="trd-cplt flex flex-col rel">
                                {submitReviewLoading &&
                                    <div className="loading cover abs fill flex aic">
                                        <LineLoader />
                                    </div>
                                }
                                <div className="hdr flex aic">
                                    <div className="tit font s24 cfff">Trade completed</div>
                                </div>
                                <div className="content">
                                    <div className="tit font s15 cfff">Provide your feedback.</div>
                                    <div className="flex">
                                        <div className="lef flex flex-col">
                                        <div className="item flex aic">
                                            <div className="lbl font s15 cfff">Communiation</div>
                                            <div className="strs"><StarRating state='RATE_COM'/></div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="lbl font s15 cfff">Trust</div>
                                            <div className="strs"><StarRating state='RATE_TRUST' /></div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="lbl font s15 cfff">Speed</div>
                                            <div className="strs"><StarRating state='RATE_SPEED'/></div>
                                        </div>
                                    </div>
                                        <div className="rig flex flex-col">
                                            <textarea type="text" className="input area font s15 c000" onChange={(e) => setReviewNote(e.target.value)}/>
                                            <button className="button font s15 cfff anim" onClick={_review}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }                    
                        {/* Reviews Block */}
                        <div className="reviews-bl flex flex-col">
                            <div className="hdr flex aic">
                                <div className="tit font s24 cfff">Reviews</div>
                            </div>
                            <div className="content">
                                {reviews.length > 0 ?
                                    reviews.map( (item,index) => {
                                        var date = new Date(item.time);
                                        var stamp = moment(date);
                                        return(
                                            <div className="blk flex aic">
                                                <div className="item flex aic">
                                                    <div className="font s14 cfff">{item.reviewer}</div>
                                                </div>
                                                <div className="item flex aic">
                                                    <div className="font s14 cfff">{item.amount}&nbsp;{item.currency}</div>
                                                </div>
                                                <div className="item flex aic">
                                                    <div className="font s14 cfff">{stamp}</div>
                                                </div>
                                                <div className="item flex aic">
                                                    <div className="font s15 cfff">{((item.communication + item.trust + item.speed) / 3).toFixed(1)}</div>
                                                </div>
                                                <div className="item flex aic">
                                                    <div className="font s15 cfff">{item.notes}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className='empty-sec font s15 cfff flex aic'>Reviews Section is empty</div>
                                }
                            </div>
                        </div>
                        </React.Fragment>
                        :
                        <div className="loading cover abs fill flex aic">
                            <LineLoader />
                        </div>
                    }
                </div> 
            </div>
            <Footer/>
        </React.Fragment>
    );
}

export default BuyerSideOrder;