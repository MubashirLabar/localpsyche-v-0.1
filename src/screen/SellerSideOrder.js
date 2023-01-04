import React,{useState, useEffect} from 'react'
import Header from "../components/Header"
import {Link} from 'react-router-dom'
import Footer from "./Footer"
import axios from "axios"
import {Toast, LineLoader} from "../ui"
import {Dialog, focus, moment} from "../core";
import {useDispatch, useSelector} from "react-redux"
import Messenger from './Messenger'
import StarRating from '../components/StarRating'
import price from 'crypto-price'

function BuyerSideOrder({match}) {

    const [amt, setAmt] = useState(null)
    const [prc, setPrc] = useState('')
    const [exchangeMode, setExchangeMode] = useState('coin-to-price')
    const [loading, setLoading] = useState(true)
    const [orderDetails, setOrderDetails] = useState()
    const [status, setStatus] = useState(null)

    const [reviewNote, setReviewNote] = useState(null)
    const [submitReviewLoading, setSubmitReviewLoading] = useState(false)
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(false)
    const [showTradeComplete, setShowTradeComplete] = useState(false)

    var token = localStorage.getItem("key");

    const generalReducers = useSelector(state => state);
    const {userInfo, isUser, rateCommunication, rateTrust, rateSpeed} = generalReducers;
    const {user} = userInfo;
    const dispatch = useDispatch()
 
    useEffect(()=>{  
        _getBuyOrderDetails()
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
    
    const _getCoinToPrice = () => {
        if(orderDetails && amt){
            setPrc(amt * orderDetails.price); 
        }
    }
 
    const _getPriceToCoin = () => {
        if(orderDetails){
            setAmt((prc / orderDetails.price).toFixed(2))
        }
    }
 
    useEffect(()=>{
        if(orderDetails){
            orderDetails.status == 'complete' && setShowTradeComplete(true)
        }
       _getUserRating()
       _getStatus()
    },[orderDetails])
  
    const _getBuyOrderDetails = async () => {
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

    const _postSellOffer = () => {
        if(amt == '' || amt == null){
            focus("._amt");
            Toast.show({ html: "Coin required greater than zero."}, 5);
        } else if (prc == '' || prc == null){
            focus("._prc");
            Toast.show({ html: "Price required greater than zero."}, 5);
        } else { 
            setLoading(true)
            const {price, country, amount, _id} = orderDetails
            let _data = {
                price: price,
                country: country,
                currency: orderDetails.currency,
                amount: amount,  
                email: user.email,
                orderId: _id  
            }
            axios.post(`${global.baseurl}:3000/postSellOffer`, _data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                } 
            })
            .then((response) =>{
                //console.log(response)
                const {success, data} = response.data;
                Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                _getStatus()
                _getBuyOrderDetails()
                setLoading(false) 
            }) 
            .catch ((error) => { 
                console.log(error)
                setLoading(false)
                _getBuyOrderDetails()
            }) 
        }
    }
     
    const _paid = () => {
        Dialog( 
            "Confirmation",
            <div className="del-order flex flex-col">
                <div className="msg font s16 cfff">Are you sure want to pay for this trade?</div>
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
                    axios.post(`${global.baseurl}:3000/paidBuy`, {buyId: orderDetails._id}, {
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
                        _getBuyOrderDetails()
                    })
                    .catch ((error) => { 
                        console.log(error)
                        setLoading(false)
                        _getBuyOrderDetails()
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
                    axios.post(`${global.baseurl}:3000/cancelBuyTrade`, {buyId: orderDetails._id},{
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
                        _getBuyOrderDetails()
                    })
                    .catch ((error) => { 
                        console.log(error)
                        setLoading(false)
                        _getBuyOrderDetails()
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
                        status: 'buy',
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
                        _getBuyOrderDetails()
                    })
                    .catch ((error) => { 
                        console.log(error)
                        setLoading(false)
                        _getBuyOrderDetails()
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
                    axios.post(`${global.baseurl}:3000/releaseBuy`, {buyId: orderDetails._id}, {
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
                        _getBuyOrderDetails()
                    }) 
                    .catch ((error) => { 
                        console.log(error)
                        setLoading(false)
                        _getBuyOrderDetails()
                    }) 
                }
            } 
        )

    }

    /* Rating Order */
    const _review = () => {
        setSubmitReviewLoading(true)
        if(user.email == orderDetails.email){
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
                status : 'sell',
                notes: reviewNote
            }, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":  token
                }  
            })
            .then((response) =>{
                //console.log(response) 
                const {success, data} = response.data;
                Toast.show({ html: data,  type: success ? 'ok' : 'error',  time: 5 });
                setSubmitReviewLoading(false)
                _getBuyOrderDetails()
            }) 
            .catch ((error) => { 
                console.log(error)
                setSubmitReviewLoading(false)
                _getBuyOrderDetails()
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
            console.log(error);
            setReviewsLoading(false)
        } 
    }
    
    console.log(orderDetails)
    //console.log(status)
    //console.log(reviews)

    return (
        <React.Fragment>
            <Header/>
            <div className="order-p sell-sid">
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
                                    <div className="form flex">
                                        <div className="form-lef flex flex-col">
                                            <div className="item">
                                                <div className="lbl font s15 cfff">Coins</div>
                                                <input 
                                                    type="text" 
                                                    className="_amt input font s15 c000"
                                                    disabled={orderDetails.status == 'escrow' || orderDetails.status == 'paid' || orderDetails.status == 'complete'}
                                                    value={orderDetails.status == 'new' ? amt : orderDetails.escrowAmount}
                                                    onChange={(e) => 
                                                        {
                                                            setAmt(e.target.value.replace(/[^0-9\.]/g, ''))
                                                            setExchangeMode('coin-to-price')
                                                            _getCoinToPrice()
                                                        }}
                                                /> 
                                            </div>
                                            <div className="item">
                                                <div className="lbl font s15 cfff">Price</div>
                                                <div className="input flex aic">
                                                    <input 
                                                        type="text" 
                                                        className="amt _prc font s15 c000"
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
                                                <div className="lbl font s15 cfff">Buyer terms</div>
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
                                                        <React.Fragment>
                                                            <button 
                                                                disabled={(orderDetails.status != 'new') || (status == 'pending')} 
                                                                className={`button font s15 cfff anim ${((orderDetails.status != 'new') || (status == 'pending')) && 'disabled'}`} 
                                                                onClick={()=> _postSellOffer()}
                                                            >Sell</button>
                                                            {(status == 'pending' && orderDetails.status == 'new') && <div className="font s15 cfff">Please wait unit buyer have not accept your offer.</div>}
                                                        </React.Fragment>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <Link to='/register' className="button font s15 cfff anim">Sign up</Link>
                                                    <div className="font s15 cfff">Sign up first and continue the trade.</div>
                                                </>
                                            }
                                            <div className={`er font s15 cfff anim ${(amt < orderDetails.minAmount && amt > 0) ? 'show' : 'hide'}`}>{`The minimum coin you can sell from this ad is ${orderDetails.minAmount} ${orderDetails.currency}.`}</div>
                                            <div className={`er font s15 cfff anim ${(amt > orderDetails.maxAmount && amt > 0) ? 'show' : 'hide'}`}>{`The biggest coin you can sell from this ad is ${orderDetails.maxAmount} ${orderDetails.currency}.`}</div>
                                        </div>  
                                        <div className="rig flex flex-col"> 
                                            <div className="item textarea flex flex-col">
                                                <div className="lbl font s15 cfff">Message</div>
                                                <div className='msg-container'>
                                                    <Messenger room="buyToSell" orderDetails={orderDetails}/>
                                                </div> 
                                            </div>  
                                        </div>
                                    </div>
                                    <div className="form-lef">
                                        { isUser == true && orderDetails ? 
                                            <>
                                                {user.email == orderDetails.email && (orderDetails.status == 'escrow' || orderDetails.status == 'paid') &&
                                                    <React.Fragment>
                                                        {orderDetails.status == "escrow" && <div className="tt font s15 cfff">{`You have ${orderDetails.time_limit} mints to pay.`}</div>}
                                                        <button 
                                                            disabled={orderDetails.status != 'escrow'}
                                                            button className={`button pay font s15 cfff anim ${orderDetails.status != 'escrow' && 'disabled'}`}
                                                            onClick={() =>_paid()} 
                                                        >Paid</button>
                                                    </React.Fragment>
                                                }
                                                {orderDetails.status == 'paid' && user.email == orderDetails.email &&  <div className='font s15 cfff'>Just waiting for Sell to Release the Payment.</div>}
                                                {
                                                    (orderDetails.sellerId == user.email && orderDetails.status == 'paid') &&
                                                    <React.Fragment>
                                                        {orderDetails.status == 'paid' && <div className="msg font s15 cfff">The payment has been made.</div>}
                                                        <button  
                                                            disabled={orderDetails.status != 'paid'}
                                                            className={`button rels font s15 cfff anim ${orderDetails.status != 'paid' && 'disabled'}`}
                                                            onClick={() => _release()}
                                                        >Release</button>
                                                    </React.Fragment>
                                                }
                                                {  (orderDetails.status == 'escrow' || orderDetails.status == 'paid') &&
                                                    <div className="ftr flex aic">
                                                        <button 
                                                            disabled={orderDetails.status == 'paid'}
                                                            className={`button font s15 cfff anim ${orderDetails.status == 'paid' && 'disabled'}`} 
                                                            onClick={() => _cancelTrade()}
                                                        >Cancel trade</button>
                                                        <button  
                                                            disabled={orderDetails.status == 'complete'}
                                                            className={`button font s15 cfff anim ${orderDetails.status == 'complete' && 'disabled'}`}
                                                            onClick={_report}
                                                        >Report/Appeal</button>
                                                    </div>
                                                }
                                            </> 
                                            :
                                            <div className="null"></div>
                                        }
                                    </div>
                                </div>
                            </div>
        
                            {/* Trade Completed Block */}
                            {(user.email == orderDetails.email) && showTradeComplete &&
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