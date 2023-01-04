import React,{useState, useEffect} from 'react';
import axios from "axios"
import countries from "../countries.json"
import {Toast} from "../ui"
import {
    focus,
    Dialog,
    keyupListener, 
    keyCodes,
} from "../core"
import {useSelector} from 'react-redux'

function EditOrder(props)  {

    const {data, _getSellOrder, _getBuyOrder, type, userEmail} = props

    console.log(data)

    const [dropCur, setDropCur] = useState(false)
    const [dropCun, setDropCun] = useState(false)
    const [dropTime, setDropTime] = useState(false)
 
    const _id = data._id
    const [price, setPrice] = useState(data.price)
    const [amount, setAmount] = useState(data.amount)
    const [minAmount, setMinAmount] = useState(data.minAmount)
    const [maxAmount, setMaxAmount] = useState(data.maxAmount)
    const [timeLimit, setTimeLimit] = useState(data.time_limit);
    const [country, setCountry] = useState(data.country)
    const [notes, setNotes] = useState(data.notes) 
    const [currency, setCurrency] = useState(data.currency)
    const [dropcurcountry,setdropcurcountry] = useState("Pakistan") 
    const [dropPayMethod, setDropPayMethod] = useState(false)
    const [paymentMethods, setPaymentMehthods] = useState(data.payment.split(","))
    const _paymentMethods = [
        {label: 'advcash'},
        {label: 'AirTM'},
        {label: 'CashU'},
        {label: 'Credit card'},
        {label: 'Easypaisa'},
        {label: 'International Wire (SWIFT)'},
        {label: 'Moneygram'},
        {label: 'Mukuru'},
        {label: 'National bank transfer'},
        {label: 'Neteller'},
        {label: 'OkPay'},
        {label: 'Other online payment'},
        {label: 'Payeer'},
        {label: 'Payoneer'},
        {label: 'Paypal'},
        {label: 'Paysend'},
        {label: 'Payza'},
        {label: 'Perfect Money'},
        {label: 'Revolut'},
        {label: 'RIA Money Trasfer'},
        {label: 'Transfer with specific bank'},
        {label: 'Transferwise'},
        {label: 'Uphold'},
        {label: 'WebMoney'},
        {label: 'WebChat'},
        {label: 'Worldremit'},
        {label: 'Western Union'},
        {label: 'Western Union'},
    ]

    const _timeLimits = [
        {limit: "30"},
        {limit: "60"},
        {limit: "90"},
        {limit: "120"},
        {limit: "150"},
        {limit: "180"},
    ]

    var token = localStorage.getItem("key");

    const generalReducers = useSelector(state => state);
    const {dialogID} =  generalReducers

    useEffect(()=>{
        document.body.addEventListener("click", ()=>{
            setDropCur(false);
            setDropCun(false);
            setDropTime(false)
        })  
    },[]); 
    

    /* Update Order */
    const _updateOrder = () => {
        const _data = {
            price: price,
            country: country, 
            currency: currency,
            amount: amount, 
            payment: paymentMethods.toString(),
            minAmount: minAmount,
            maxAmount: maxAmount,
            time_limit: timeLimit,
            notes: notes,
            email : userEmail,
            status : "new",
            id: _id
        }        
        if (price <= 0){ 
            focus("._price");
            Toast.show({ html: "The price required greater than zero", time: 5 });
        } 
         else if (amount <= 0){ 
            focus("._amount");
            Toast.show({ html: "The coin required greater than zero", time: 5 });
        } else if(minAmount <= 0){
            focus("._minLimit");
            Toast.show({ html: "Minimum limit required greater than zero", time: 5 });
        } else if(maxAmount <= 0){
            focus("._maxLimit");
            Toast.show({ html: "Maximum limit required greater than zero", time: 5 });
        } else if(notes == null){
            focus("._notes");
            Toast.show({ html: "Notes feild is required", time: 5 });
        } else {
            window.__modals[dialogID].setLoading(true);
            axios.post(
                type == 'sell' ?  `${global.baseurl}:3000/updateOrder` : `${global.baseurl}:3000/updateBuyOrder`, 
                _data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                }
            )   
            .then((response) => {   
                console.log(response);
                const {success, data} = response.data;
                Toast.show({ html: data, type: success ? 'ok' : 'error', time: 5 });
                type == 'sell' ? _getSellOrder() : _getBuyOrder();
                window.__modals[dialogID].setLoading(false);
                window.__modals[dialogID].Hide()
            })   
            .catch((error) =>  {  
                window.__modals[dialogID].setLoading(false);
                window.__modals[dialogID].Hide()
                console.log(error);
            });
        }
    }

    const PaymentMethods = ({data}) => {
        const [checkbox, setCheckbox] = useState(false)
        const pushel = (data) => {
            const res = paymentMethods.findIndex((el) => el === data)
            if(res === -1)
            {
                paymentMethods.push(data)
            }
            else
            {
                paymentMethods.splice(res,1)
            }
        } 
        return(
            <div className="cleanbtn item flex aic anim" onClick={(e)=>
                {
                    e.stopPropagation()
                    pushel(data)
                    console.log(pushel)
                    setCheckbox(!checkbox)
                }}
            > 
                <div className={`checkbox s14  ${paymentMethods.includes(data) && 'on icon-check'}`}/>       
                <div className="txt font s14 black wordwrap">{data}</div> 
            </div> 
        )
    }

    return (
        <div className="edit-order flex flex-col">
            <div className="form flex flex-col">
                <div className="blk flex aic">
                    <div className="item flex flex-col">
                        <div className="lbl font s14 cfff">Price</div>
                        <input 
                            type="number" 
                            className="input _price font s15 c000"
                            defaultValue={price}
                            onChange={e => setPrice(e.target.value.replace(/[^0-9\.]/g, ''))}
                        />
                    </div> 
                    <div className="item flex flex-col">
                        <div className="lbl font s14 cfff">Coin</div>
                        <input 
                            type="number" 
                            className="input _amount font s15 c000"
                            defaultValue={amount}
                            onChange={e => setAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                        />
                    </div>
                    
                    {/* Select Currency */}
                    <div className="item flex flex-col">
                        <div className="lbl font s15 cfff">Currency</div>
                        <button className="cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                            e.stopPropagation();
                            setDropCur(!dropCur);  
                            setDropCun(false); 
                            setDropTime(false)
                        }}> 
                            { 
                                countries.map((item, index) =>(
                                    dropcurcountry == item.country  && <div key={"con" + index} className="iput flex aic">
                                        <div className="txt font s15 black wordwrap">{item.currency_code}</div>
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
                                            <div className="txt font s15 black wordwrap">{item.currency_code}</div> 
                                        </button> 
                                    ))
                                }
                                </div> 
                            }
                        </button>
                    </div>          
                </div> 
                <div className="blk flex aic">
                    {/* Select Country */}
                    <div className="item flex flex-col">
                        <div className="lbl font s15 cfff">Country</div>
                        <button className="cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                            e.stopPropagation();
                            setDropCun(!dropCun);  
                            setDropCur(false); 
                            setDropTime(false)
                        }}>
                            { 
                                countries.map( (item, index)=>(
                                    country == item.country  && <div key={index} className="iput flex aic">
                                        <div className="txt font s15 black wordwrap">{item.country}</div>
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
                                            <div className="txt font s15 black wordwrap">{item.country}</div> 
                                        </button> 
                                    ))
                                }
                                </div> 
                            } 
                        </button>
                    </div>
                                                                            
                    {/* Payment Method */}
                    <div className="item flex flex-col">
                        <div className="lbl font s15 cfff">Payment Method</div>
                        <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                            e.stopPropagation()
                            setDropPayMethod(!dropPayMethod)
                            setDropCun(false) 
                            setDropCur(false)
                            setDropTime(false)
                        }}>
                            <img src="./images/arrow-down.svg" className="arrow abs"/>  
                            <div  className="iput flex aic">
                                <div className="txt font s15 black wordwrap">
                                    {
                                        paymentMethods.map(item => item)
                                    }
                                </div>        
                            </div>
                            {dropPayMethod && <div className="options flex flex-col abs">
                                {
                                    _paymentMethods.map(item=>(
                                        <PaymentMethods data={item.label}/>
                                    ))
                                }
                                </div> 
                            } 
                        </button>
                    </div>
                      
                </div> 
                <div className="blk flex aic">
                    <div className="item flex flex-col">
                        <div className="lbl font s14 cfff">Limit minimum</div>
                        <input 
                            type="number" 
                            className="_minLimit input font s15 c000"
                            defaultValue={minAmount}
                            onChange={e => setMinAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                        />
                    </div>
                    <div className="item flex flex-col">
                        <div className="lbl font s14 cfff">Limit maximum</div>
                        <input 
                            type="number" 
                            className="_maxLimit input font s15 c000"
                            defaultValue={maxAmount}
                            onChange={e => setMaxAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                        />
                    </div> 
                    {/* Select Time */}
                    <div className="item flex flex-col">
                        <div className="lbl font s15 cfff">Time Limit</div>
                        <button className="cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                            e.stopPropagation();
                            setDropTime(!dropTime);
                            setDropCun(false);  
                            setDropCur(false); 
                        }}>
                            { 
                                _timeLimits.map((item, index)=>(
                                    timeLimit == item.limit  && <div key={index} className="iput flex aic">
                                        <div className="txt font s15 black wordwrap">{`${item.limit} min`}</div>
                                        <img src="./images/arrow-down.svg" className="arrow"/>          
                                    </div>
                                ))
                            } 
                            {dropTime && <div className="options flex flex-col abs">
                                {
                                    _timeLimits.map(item=>(
                                        <button className="cleanbtn item flex aic anim" onClick={()=>{
                                            setDropTime(!dropTime);
                                            setTimeLimit(item.limit);
                                        }}>        
                                            <div className="txt font s15 black wordwrap">{`${item.limit} min`}</div> 
                                        </button> 
                                    ))
                                }
                                </div> 
                            }
                        </button>
                    </div>
                </div>
                <div className="item flex flex-col">
                    <div className="lbl font s14 cfff">Notes</div>
                    <textarea 
                        type="text" 
                        className="_notes input area font s15 c000"
                        defaultValue={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div> 
                <div className="ftr flex aic">
                    <button className="button font s15 cfff anim" onClick={()=> {_updateOrder()}}>Update</button>
                </div>
            </div> 
        </div>   
    )
}

export default EditOrder;