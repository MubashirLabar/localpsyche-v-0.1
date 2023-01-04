import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from "../components/Header"
import Footer from "./Footer"
import axios from "axios"
import countries from "../countries.json"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {Toast, LineLoader} from "../ui"
import {
    focus, 
    Dialog,  
    addCommas
} from "../core";
import {useDispatch, useSelector} from "react-redux"
import EditOrder from "./EditOrder"

function Profile() {

    const [tisments, SetTisments] = useState([
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
            trader: "Top trader",
            orders: "125",
            complete: "100%",
            trust: "4.9",
            payment: "1,800.25",
            covert_into: "PKR",
            convert_amt: "160.92",
            limit: {from: "50,000", to: "988,000"},
        },
    ])
    const [dropCur, setDropCur] = useState(false)
    const [dropCun, setDropCun] = useState(false)
    const [dropTime, setDropTime] = useState(false)
    const _timeLimits = [
        {limit: "30"},
        {limit: "60"},
        {limit: "90"},
        {limit: "120"},
        {limit: "150"},
        {limit: "180"},
    ] 
    const [price, setPrice] = useState(0)
    const [country, setCountry] = useState(null); 
    const [dropcurcountry,setdropcurcountry] = useState(null)
    const [currency, setCurrency] = useState(null); 
    const [amount, setAmount] = useState(0)
    const [minAmount, setMinAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(0)
    const [timeLimit, setTimeLimit] = useState(30);
    const [notes, setNotes] = useState(null) 
    const [sellAdvertisments, setSellAdvertisments] = useState([])
    const [loadSellAdt, setLoadSellAdt] = useState(false)
    const [isCopied, setIsCopied] = useState(false);
    const [dropPayMethod, setDropPayMethod] = useState(false)
    const [paymentMethods, setPaymentMehthods] = useState([])
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

    const [tradeMode, setTradeMode] = useState(null)
    const [error, setError] = useState(false)
    const [loadBuyAdt, setLoadBuyAdt] = useState(false)
    const [buyAdvertisments, setBuyAdvertisments] = useState([]);
    const [addLoading, setAddLoading] = useState(false)
    const [traderHistory, setTraderHistory] = useState()

    const [loadwallet, setLoadWallet] = useState(false)
    const [walletId, setWalletId] = useState(null)
    const [walletAmount, setWalletAmount] = useState(null)
    const [pin, setPin] = useState(null)
    const [txID, setTxID] = useState(null)
    const[dropTx, setDropTx] = useState(false)
    const [txAmount, setTxAmount] = useState('')
    const[secretKey, setSecretKey] = useState('')
    const [txCode, setTxCode] = useState('')
    const [transactionDetail, setTransactionDetail] = useState([])
    const [incommingKey, setIncommingKey] = useState('')

    const generalReducers = useSelector(state => state);
    const {userInfo} = generalReducers;
    const {user, walletInfo} = userInfo;
    const dispatch = useDispatch() 

    //console.log(user)
    var token = localStorage.getItem("key");
 
    useEffect(()=>{
        _getSellOrder()
        _getBuyOrder()
        _getLocation()
        _getTraderHistory()
        _getTxID()
    },[])
     
    useEffect(()=>{
        document.body.addEventListener("click", ()=>{
            setDropCur(false);
            setDropCun(false);
            setDropTime(false)
            setDropTx(false)
            setDropPayMethod(false)
        })  
    },[]); 

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
    };

    /* get Transition Info */
    const _getTxID = () => {
        setLoadWallet(true)
        axios.get(`${global.baseurl}:8000/api/transactions-receiver/${walletInfo.wallet_id}`)
        .then((response) =>{
            setTransactionDetail(response.data.message) 
            setLoadWallet(false)
        }) 
        .catch ((error) => {
            console.log(error)
            setLoadWallet(false)
        })
    }

    const _getLocation = () => {
        axios.get("https://geolocation-db.com/json/f9902210-97f0-11eb-a459-b997d30983f1")
        .then((response) =>{
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

    /* Get My Sell Adevertisments */
    const _getSellOrder = () => {
        setLoadSellAdt(true)
        axios.post(`${global.baseurl}:3000/myOrders`, {email: user.email},
        {headers: {
            "Content-Type": "application/json",
            "Authorization":  token
        }}
        )
        .then((response) =>{
            //console.log(response) 
            setLoadSellAdt(false)
            setSellAdvertisments(response.data.data);
        })
        .catch ((error) => { 
            setLoadSellAdt(false) 
            //console.log(error)
        })
    }

    /* Get My Buy Adevertisments */
    const _getBuyOrder = () => {
        setLoadBuyAdt(true)
        axios.post(`${global.baseurl}:3000/myBuyOrders`, {email: user.email},
        {headers: {
            "Content-Type": "application/json",
            "Authorization":  token
        }})
        .then((response) =>{
            //console.log(response) 
            setLoadBuyAdt(false)
            setBuyAdvertisments(response.data.data);
        })
        .catch ((error) => { 
            setLoadBuyAdt(false)  
            //console.log(error)
        })
    }
    
    /* Create Order */
    const _createOrder = () => {
        const _data = {
            price: price,
            country: country,
            amount: amount,
            currency : currency,
            payment: paymentMethods.toString(),
            minAmount: minAmount,
            maxAmount: maxAmount,
            time_limit: timeLimit,
            notes: notes,
            email : user.email,
            status : "new"
        }
        if(price <= 0){
            focus("._price");
            Toast.show({ html: "The price required greater than zero", time: 5 });
        }
         else if (amount <= 0){ 
            focus("._amount");
            Toast.show({ html: "The amount required greater than zero", time: 5 });
        } else if(currency == null){
            focus("._price");
            Toast.show({ html: "The currency feild is required", time: 5 });
        }
         else if(minAmount <= 0){
            focus("._minLimit");
            Toast.show({ html: "Minimum limit required greater than zero", time: 5 });
        } else if(maxAmount <= 0){
            focus("._maxLimit");
            Toast.show({ html: "Maximum limit required greater than zero", time: 5 });
        } else if(notes == null){
            focus("._notes");
            Toast.show({ html: "Notes feild is required", time: 5 });
        } else {
            setAddLoading(true)
            if(tradeMode == 'sell'){
                axios.post(`${global.baseurl}:3000/createOrder`, _data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                })
                .then((response) => {
                    //console.log(response)
                    const {success, data} = response.data;
                    Toast.show({ html: data, type: success ? 'ok' : 'error', time: 5 });
                    if(success){
                        setPrice(0)
                        setAmount(0)
                        setMinAmount(0)  
                        setMaxAmount(0)  
                        setNotes('') 
                    }
                    _getSellOrder();
                    setAddLoading(false)
                }) 
                .catch((error) =>  { 
                    console.log(error)
                    setAddLoading(false)
                });
            }
            else if(tradeMode ==  'buy'){
                axios.post(`${global.baseurl}:3000/createBuyOrder`, _data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                })
                .then((response) => {
                    console.log(response)
                    const {success, data} = response.data;
                    Toast.show({ html: data, type: success ? 'ok' : 'error', time: 5 });
                    if(success){
                        setPrice(0)
                        setAmount(0)
                        setMinAmount(0)  
                        setMaxAmount(0)  
                        setNotes('') 
                    }
                    _getBuyOrder()
                    setAddLoading(false)
                }) 
                .catch((error) =>  { 
                    console.log(error)
                    setAddLoading(false)
                });
            } else {
                setError(true)
                setAddLoading(false)
                Toast.show({ html: "What you want Sell or Buy?", time: 5 });
            }
        }
    }
  
    /* Edit Order */
    const _editOrder = (item, type) => {   
        var ID = Dialog(   
            "Edit Advertisment",
            <EditOrder 
                data={item} 
                _getSellOrder = {_getSellOrder} 
                _getBuyOrder = {_getBuyOrder} 
                type={type}
                userEmail={user.email}
            />,
            false,   
            {
                label: "Cancel", 
                onClose: ()=>{}
            },
            {
                label: "Ok", 
                onConfirm: ()=>{} 
            }, 
        )  
        dispatch({type: 'DIALOG_ID', payload: ID})
    } 
  
    /* Delete Order */
    const _deleteOrder = (item, type) => { 
       var ID = Dialog( 
            "Delete Advertisment",
            <div className="del-order flex flex-col">
                <div className="msg font s16 cfff">Are you sure want to delete this order?</div>
            </div>,
            true,  
            { 
                label: "Cancel", 
                onClose: ()=> {}
            }, 
            {
                label: "Delete", 
                onConfirm: ()=> {
                    axios.post(
                        type == 'sell' ? `${global.baseurl}:3000/deleteOrder` : `${global.baseurl}:3000/deleteBuyOrder`, 
                        {id: item._id, email: user.email},
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization":  token
                            } 
                        }
                    ) 
                    .then((response) =>{
                        console.log(response)
                        Toast.show({ html: response.data.data, type: "ok", time: 5 });
                        type == 'sell' ? _getSellOrder() : _getBuyOrder();
                        window.__modals[ID].setLoading(false);
                    })
                    .catch ((error) => { 
                        console.log(error.message) 
                        Toast.show({ html: error.message, time: 5 });
                        window.__modals[ID].setLoading(false);
                    })
                }
            } 
        )
    }

    /* Get Trader History */
    const _getTraderHistory = () => {
        setLoadWallet(true)
        axios.post(`${global.baseurl}:3000/userDetails`, {email: user.email},
        {headers: {
            "Content-Type": "application/json",
            "Authorization":  token
        }}
        )
        .then((response) =>{
            setTraderHistory(response.data)
            setLoadWallet(false)
        })
        .catch ((error) => {
            console.log(error)
            setLoadWallet(false)
        })
    }

    /* Advertisments */
    const Advertisments = ({title, data, type}) => {
        return(
        <div className="pblk-bl flex flex-col">
            <div className="hdr flex aic">
                <div className="tit font s22 cfff">{title}</div>
            </div>  
            <div className="table flex flex-col">
            {
                data.map( (item, index) => (
                    <div key={index} className="row flex">
                        <div className="item flex flex-col">
                            <div className="lbl font s15 cfff flex aic">
                                {traderHistory && <span>{traderHistory.userId}</span>}&nbsp;&nbsp;
                                <div className="online" />
                            </div>
                            {
                                type == 'sell' ? traderHistory &&
                                <div className="flex aic">
                                    <div className="font s12 cfff">{traderHistory.sellOrders}</div>&nbsp;&nbsp;
                                    <div className="font s12 cfff">{traderHistory.sellPercentage}</div>&nbsp;&nbsp;
                                    <div className="font s12 cfff">{traderHistory.trust}</div>
                                </div>
                                : 
                                traderHistory &&
                                <div className="flex aic">
                                    <div className="font s12 cfff">{traderHistory.buyOrders}</div>&nbsp;&nbsp;
                                    <div className="font s12 cfff">{traderHistory.buyPercentage}</div>&nbsp;&nbsp;
                                    <div className="font s12 cfff">{traderHistory.trust}</div>
                                </div>
                            }
                        </div> 
                        <div className="item flex flex-col">
                            <div className="lbl font s15 cfff">{item.notes}</div>
                        </div>
                        <div className="item flex flex-col">
                            <div className="lbl font s15 cfff">{item.price}</div>
                        </div>
                        <div className="item flex flex-col">
                            <div className="lbl font s15 cfff">{item.amount}<span className="s11">{item.covert_into}</span>
                            </div> 
                            <div className="txt font s13 b3 cfff">{`Limit: ${item.minAmount} to ${item.maxAmount}`}</div>
                        </div>
                        <div className="actions flex aic">
                            <button className="button font s15 cfff anim" onClick={() =>_editOrder(item, type)}>Edit</button>
                            <button className="button font s15 cfff anim" onClick={() =>_deleteOrder(item, type)}>Delete</button>
                            <Link to={`/orders/${item._id}?type=${type}`} className="button font s15 cfff anim">Orders</Link>
                        </div>
                    </div>
                ))
            }
            </div>
        </div> 
        )
    }

    /* Send transaction */
    const sendTransaction = (e) => {
        if(walletId == null){
            Toast.show({ html: "Wallet ID is required.", type: "ok", time: 5 });
            focus("._walletid")
        } else if(walletAmount == null){
            Toast.show({ html: "Please enter some Amount.", type: "ok", time: 5});
            focus("._walletAmount")
        } else if(pin == null){
            Toast.show({ html: "Please enter your 6-digit pin code.", type: "ok", time: 5});
            focus("._pin")
        } else {
            setLoadWallet(true)
            axios.post(
                `${global.baseurl}:8000/api/initilize-transaction`, 
                {
                    senderId: user._id, 
                    pin: pin,
                    sender_wallet_id: walletInfo.wallet_id,
                    receiver_wallet_id: walletId,
                    balance_to_transfer: walletAmount,
                    notes: 'Here is your money bro'
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":  token
                    } 
                }
            ) 
            .then((response) =>{
                Toast.show({ html: "Transaction done successfully", type: "ok", time: 5 });
                _secretKeyMsg(response.data.message.secret_key)
                setWalletId('')
                setWalletAmount('')
                setPin('')
                setLoadWallet(false)
            })
            .catch ((error) => { 
                console.log(error.message) 
                setLoadWallet(false)
                Toast.show({ html: error.message, time: 5 });
            })
        }
    } 

    const _secretKeyMsg = (secret_key) => {
        Dialog( 
            "Secret Code", 
            <div className="secret-key flex flex-col">
                <div className="code font s32 cfff">{secret_key}</div>
                <div className="msg font s16 cfff">Please share the above code with the receiver to accept the transaction.</div>
            </div>,
            true,  
            { 
                label: "Cancel", 
                onClose: ()=> {setSecretKey(secret_key)}
            }, 
            {
                label: "Ok",  
                onConfirm: ()=> {
                    <CopyToClipboard text={walletInfo.wallet_id}/>
                    setSecretKey(secret_key)
                } 
            } 
        )
    }

    //console.log(walletInfo.wallet_id, ",", user._id,"",txID)
    const _transactionsAction = () => {
        if(txID == null){
            Toast.show({ html: "Please first select your Transaction ID.", time: 5})
        }
        else if (txID == ''){
            Toast.show({ html: "Please enter your transaction code.", time: 5})
            focus("._txCode")
        }
        else if(txCode == incommingKey){
            setLoadWallet(true)
            axios.post(
                `${global.baseurl}:8000/api/transactions-action/${walletInfo.wallet_id}/${user._id}/${txID}/`, 
                {
                    pin: user.pin,
                    mode:"accept",
                    secret_key: incommingKey
                }
            ) 
            .then((response) =>{
                console.log(response.data)
                Toast.show({ html: "Transaction submited successfully", type: "ok", time: 5 });
                setTxID('')
                setTxAmount('')
                setTxCode('')
                _getTxID()
                setLoadWallet(false)
            })
            .catch ((error) => { 
                console.log(error.message) 
                Toast.show({ html: error.message, time: 5 });
                setLoadWallet(false)
            })
        } else {
            Toast.show({ html: "Please enter valid transaction code", type: "ok", time: 5 });
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
                    setCheckbox(!checkbox)
                }}
            > 
                <div className={`checkbox s14 ${checkbox && 'on icon-check'}`}/>       
                <div className="txt font s14 black wordwrap">{data}</div> 
            </div> 
        )
    }

    return (  
        <React.Fragment> 
            <Header/>
            <div className="profile-p"> 
                <div className="wrapper flex flex-col">
                    <div className="title flex aic">
                        <div className="font s32 black">Profile</div>
                    </div>
                    <div className="info-bl flex flex-col rel">
                        {loadwallet &&
                            <div className="loading cover abs fill flex aic">
                                <LineLoader />
                            </div>
                        } 
                        <div className="hdr flex aic">
                            <div className="lef flex aic">
                                <div className="flex flex-col">
                                    {user.email && <div className="lbl font s32 cfff wordwrap">{user.userID}</div>}
                                    <div className="num font s32 b3 cfff rel">
                                        {walletInfo.wallet_id && <span>{walletInfo.wallet_id}</span>}
                                        <CopyToClipboard text={walletInfo.wallet_id} onCopy={onCopyText}>
                                            <button className="cleanbtn copy font s15 cfff abs anim">click to copy</button>
                                        </CopyToClipboard>
                                        <div className={`copied font s14 cfff anim ${isCopied ? 'show' : 'hide'}`}>Copied!</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rig flex aic">
                                <div className="flex flex-col">
                                    <div className="lbl font s32 cfff">Balance</div>
                                    <div className="num font s32 b3 cfff rel">{addCommas(walletInfo.balance)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="content flex">
                            <div className="lef">
                                <div className="blk flex flex-col aic">
                                    <div className="tit font s20 b3 cfff">Send</div>
                                    <div className="form">
                                        <div className="item flex flex-col">
                                            <div className="lbl font s14 cfff">Wallet ID</div>
                                            <input 
                                                type="text" 
                                                className="_walletid input font s15 c000"
                                                value={walletId}
                                                onChange={e => setWalletId(e.target.value)}
                                            />
                                        </div> 
                                        <div className="dbl flex aic">
                                            <div className="item flex flex-col">
                                                <div className="lbl font s14 cfff">Amount</div>
                                                <input 
                                                    type="number" 
                                                    className="_walletAmount input font s15 c000"
                                                    value={walletAmount}
                                                    onChange={e => setWalletAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                                                />
                                            </div>
                                            <div className="item flex flex-col">
                                                <div className="lbl font s14 cfff">PIN</div>
                                                <input 
                                                    type="number" 
                                                    className="_pin input font s15 c000"
                                                    value={pin}
                                                    onChange={e => setPin(e.target.value.replace(/[^0-9\.]/g, ''))}
                                                />
                                            </div>
                                        </div> 
                                        <button onClick={sendTransaction} className="button font s15 cfff anim">Send</button>
                                        {secretKey ? walletInfo.wallet_id && <div className="msg font s15 b3 cfff">{`Please share the transaction approval code ${secretKey} with receiver`}</div> : <></>}
                                    </div>
                                </div>
                            </div>
                            <div className="rig flex">
                                <div className="blk flex flex-col aic">
                                    <div className="tit font s20 b3 cfff">Incomming Transactions</div>
                                    <div className="form">
                                        {/*<div className="label font s14 cfff">Incomming transaction:</div>*/}
                                        {/* Select TX ID */}
                                        <div className="item flex flex-col">
                                            <div className="lbl font s14 cfff">TX ID:</div>
                                            <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                                                e.stopPropagation();
                                                setDropTx(!dropTx);
                                                setDropCun(false);  
                                                setDropCur(false); 
                                                setDropTime(false)
                                            }}> 
                                                <img src="./images/arrow-down.svg" className="arrow abs"/>   
                                                { 
                                                    transactionDetail.map( (item, index) => (
                                                        txID == item.transaction_id && <div key={index} className="iput flex aic">
                                                            <div className="txt font s15 black wordwrap">{item.transaction_id}</div>       
                                                        </div>
                                                    ))
                                                } 
                                                {dropTx && <div className="options flex flex-col abs">
                                                    {
                                                        transactionDetail.map(item=>(
                                                            <button className="cleanbtn item flex aic anim" onClick={()=>{
                                                                setDropTx(false);
                                                                setTxID(item.transaction_id);
                                                                setIncommingKey(item.secret_key)
                                                                setTxAmount(item.balance_to_transfer)
                                                            }}>        
                                                                <div className="txt font s15 black wordwrap">{item.transaction_id}</div> 
                                                            </button> 
                                                        ))
                                                    }
                                                    </div> 
                                                } 
                                            </button>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="lbl font s14 cfff">Amount:</div>
                                            <input 
                                                type="number" 
                                                className="input font s15 c000"
                                                value={txAmount}
                                                readOnly
                                            />
                                        </div>
                                        <div className="item flex aic">
                                            <div className="lbl font s14 cfff">Transaction code:</div>
                                            <input 
                                                type="text"  
                                                className="_txCode input font s15 c000"
                                                value={txCode}
                                                onChange={e => setTxCode(e.target.value)}
                                            />
                                        </div> 
                                        <button onClick={_transactionsAction} className="button font s15 cfff anim">Submit</button>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>

                    {/* Add Advertisment Section */}
                    <div className="adt-bl flex flex-col rel">
                        {addLoading &&
                            <div className="loading cover abs fill flex aic">
                                <LineLoader />
                            </div>
                        } 
                        <div className="hdr flex aic">
                            <div className="label font s22 cfff">Advertisments:</div>
                            <div className='switchs flex aic'>
                                <label className={`item flex aic ${error && 'error'}`}>
                                    <button 
                                        onClick={() => {
                                            setTradeMode('sell')
                                            setError(false)
                                        }} 
                                        className={`cleanbtn circle rel anim  ${tradeMode == 'sell' && 'on'}`}/>
                                    <div className="lbl font s16 cfff anim">Sell</div>
                                </label>
                                <label className={`item flex aic ${error && 'error'}`}>
                                    <button 
                                        onClick={() => {
                                            setTradeMode('buy')
                                            setError(false)
                                        }} 
                                        className={`cleanbtn circle rel anim  ${tradeMode == 'buy' && 'on'}`}/>
                                    <div className="lbl font s16 cfff anim">Buy</div>
                                </label>
                            </div>
                        </div>
                        <div className="form flex">
                            <div className="lef flex flex-col">
                                <div className="blk flex aic">
                                    <div className="item flex flex-col">
                                        <div className="lbl font s14 cfff">Price per coin</div>
                                        <input 
                                            type="text" 
                                            className="input _price font s15 c000"
                                            value={price}
                                            onChange={e => setPrice(e.target.value.replace(/[^0-9\.]/g, ''))}
                                        />
                                    </div>
                                    <div className="item flex flex-col">
                                        <div className="lbl font s14 cfff">{`Total coins to ${tradeMode == 'buy' ? 'buy' : 'sell'}`}</div>
                                        <input 
                                            type="text" 
                                            className="input _amount font s15 c000"
                                            value={amount}
                                            onChange={e => setAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                                        />
                                    </div>
                                    {/* Select Currency */}
                                    <div className="item flex flex-col">
                                        <div className="lbl font s15 cfff">Currency</div>
                                        <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
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
                                        <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
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
                                        <div className="lbl font s14 cfff">Limit minimum Coins</div>
                                        <input 
                                            type="text" 
                                            className="_minLimit input font s15 c000"
                                            value={minAmount}
                                            onChange={e => setMinAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                                        />
                                    </div>
                                    <div className="item flex flex-col">
                                        <div className="lbl font s14 cfff">Limit maximum Coins</div>
                                        <input 
                                            type="text" 
                                            className="_maxLimit input font s15 c000"
                                            value={maxAmount}
                                            onChange={e => setMaxAmount(e.target.value.replace(/[^0-9\.]/g, ''))}
                                        />
                                    </div> 
                                    {/* Select Time */}
                                    <div className="item flex flex-col">
                                        <div className="lbl font s15 cfff">Time Limit</div>
                                        <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
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
                            </div>
                            <div className="rig flex flex-col">
                                <div className="item flex flex-col">
                                    <div className="lbl font s14 cfff">Notes</div>
                                    <textarea 
                                        type="text" 
                                        className="_notes input area font s15 c000"
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </div> 
                                <div className="ftr flex aic"> 
                                    <button onClick={_createOrder} className="button font s15 cfff anim">Publish</button>
                                </div>
                            </div> 
                        </div>
                    </div>

                    {/* Sell Advertisments */}
                    {
                        loadSellAdt == false  ? sellAdvertisments.length > 0 &&
                        <Advertisments title="Sell Advertisments:" data={sellAdvertisments} type='sell'/>
                        :
                        <div className="pblk-bl flex flex-col">
                            <div className="hdr flex aic">
                                <div className="tit font s22 cfff">Advertisments:</div>
                            </div> 
                            <div className="table flex flex-col">
                                <div className="row flex aic">
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                </div>
                                <div className="row flex aic">
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                </div>
                                <div className="row flex aic">
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                </div>
                            </div>
                        </div>    
                    }
                    {/* Buy Advertisments */}
                    {
                        loadBuyAdt == false  ? buyAdvertisments.length > 0 &&
                        <Advertisments title="Buy Advertisments:" data={buyAdvertisments} type='buy'/>
                        :
                        <div className="pblk-bl flex flex-col">
                            <div className="hdr flex aic">
                                <div className="tit font s22 cfff">Advertisments:</div>
                            </div> 
                            <div className="table flex flex-col">
                                <div className="row flex aic">
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                </div>
                                <div className="row flex aic">
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                </div>
                                <div className="row flex aic">
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                    <div className="item holder" />
                                </div>
                            </div>
                        </div>    
                    }
                </div>
            </div> 
            <Footer />
        </React.Fragment>
    ); 
}

export default Profile;