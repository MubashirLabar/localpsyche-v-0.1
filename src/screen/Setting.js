import React,{useState, useEffect} from 'react'
import Header from "../components/Header"
import Footer from "./Footer"
import LevelInfo from '../components/LevelInfo'
import {Toast, LineLoader} from "../ui"
import {
    focus, 
    Dialog,  
    isValidEmail,
} from "../core"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"

function Setting() {

    const {user} = useSelector(state => state.userInfo);
    var token = localStorage.getItem("key");
    //console.log(user._id)

    const dispatch = useDispatch() 

    const EditProfile = () => {
        
        const generalReducers = useSelector(state => state);
        const {dialogID} =  generalReducers

        const [fullName, setFullName] = useState(null)
        const [email, setEmail] = useState(null)
        const [password, setPassword] = useState(null)
        const [confirmPass, setConfirmPass] = useState(null)
        const [pin, setPin] = useState(null) 
        const [confirmPin, setConfirmPin] = useState(null)

        useEffect(()=>{
            setFullName(user.user_name);
            setEmail(user.email);
            setPassword(user.password)
            setConfirmPass(user.password)
            setPin(user.pin)
            setConfirmPin(user.pin)
        },[])

        const _getUserInfo = async () => {
            try {
            const { data } = await axios({
                method: 'post', 
                url: `${global.baseurl}:8000/api/auth/user-profile`,
                data: {token: token},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization":  token
                }  
            });  
            if(data){
                dispatch({type: 'USER_INFO', payload: data})
            }
          } catch (error) {
            console.log(error)
          }
        }

        const _update = (e) => {
            console.log(user._id)
            if(fullName == '' || fullName == null){
                focus("._name");
                Toast.show({ html: "Enter your full name.", time: 5 });
            } else if (!isValidEmail(email)){
                focus("._email");
                Toast.show({ html: "Enter vaid email address.", time: 5 });
            } else if (email == ''){
                focus("._email");
                Toast.show({ html: "Enter your email address", time: 5 });
            } else if (password == ''){
                focus("._pass");
                Toast.show({ html: "Enter your password", time: 5 });
            } else if (confirmPass == ''){
                focus("._confirmPass");
                Toast.show({ html: "Enter your password", time: 5 });
            } else if (password != confirmPass){
                Toast.show({ html: "Password and Confirm Password not matching.", time: 5 });
            } else if (pin == ''){
                focus("._pin")
                Toast.show({ html: "Enter your 6 digit pin address.", time: 5 });
            } else if (confirmPin == ''){
                focus("._Confirmpin")
                Toast.show({ html: "Confirm Pin code feild is required.", time: 5 });
            } else if (pin != confirmPin){
                Toast.show({ html: "Pin code and Confirm Pin code not matching.", time: 5 });
            } else {
                window.__modals[dialogID].setLoading(true);
                axios.post(`${global.baseurl}:8000/api/profile/updateProfile/${user._id}`, {
                    user_name: fullName.toString(),
                    email: email.toString(), 
                    key: password.toString(),
                    pin: pin.toString()
                })       
                .then((response) =>{
                    console.log(response);
                    const {success, message} = response.data;
                    Toast.show({ html: "Your profile updated succesfully", type: success ? 'ok' : 'error', time: 5 });
                    _getUserInfo()
                    window.__modals[dialogID].setLoading(false);
                    window.__modals[dialogID].Hide()
                })
                .catch ((error) => { 
                    console.log(error.message)
                    window.__modals[dialogID].setLoading(false);
                    window.__modals[dialogID].Hide()
                    console.log(error);
                })
            }
        }

        return(
            <div className="edit-user-info flex flex-col">
                <div className='form'>
                    <div className="item flex aic">
                        <div className="lbl font s15 cfff">Full name:</div>
                        <input 
                            type="text"   
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input _name font s15 c000" 
                        />
                    </div> 
                    <div className="item flex aic">
                        <div className="lbl font s15 cfff">Login Email:</div>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input _email font s15 c000" 
                        />
                    </div>
                    <div className="item flex aic">
                        <div className="lbl font s15 cfff">Password:</div>
                        <input 
                            type="text" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input _pass font s15 c000" 
                        />
                    </div>
                    <div className="item flex aic">
                        <div className="lbl font s15 cfff">Confirm Password:</div>
                        <input 
                            type="text" 
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="input _confirmPass font s15 c000" 
                        />
                    </div>
                    <div className="item flex aic">
                        <div className="lbl font s15 cfff">PIN:</div>
                        <input 
                            type="text" 
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="input font s15 c000" 
                        />
                    </div>
                    <div className="item flex aic">
                    <div className="lbl font s15 cfff">Confirm PIN:</div>
                    <input 
                        type="text" 
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="input font s15 c000" 
                    />
                </div>
                    <div className="ftr flex aic">  
                        <button onClick={_update} className="button font s15 cfff anim">Update</button>
                    </div>
                </div>
            </div>
        )
    }

    /* Edit Order */
    const _editPersonalInfo = () => {   
        var ID = Dialog(   
            "Edit Personal Info",
            <EditProfile />,
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

    return (
        <React.Fragment>
            <Header/>
            <div className="setting-p">
                <div className="wrapper flex flex-col">
                    <div className="title flex aic">
                        <div className="font s38 black">Setting</div>
                    </div> 
 
                    {/* Personal Info */}
                    <div className="personal">
                        <div className="label font s22 cfff">Personal:</div>
                        <div className="item flex aic">
                            <div className="lbl font s15 cfff">Full name:</div>
                            <div className="flex flex-col">
                                <div className="txt font s14 cfff">Name should be the same as legal document</div>
                                <input 
                                    type="text" 
                                    readOnly
                                    value={user.user_name}
                                    className="input font s15 c000" 
                                />
                            </div>
                        </div>
                        <div className="item flex aic">
                            <div className="lbl font s15 cfff">Login email:</div>
                            <input 
                                type="email" 
                                readOnly
                                value={user.email}
                                className="input font s15 c000" 
                            />
                        </div>
                        <div className="item flex aic">
                            <div className="lbl font s15 cfff">Password:</div>
                            <input 
                                type="password" 
                                readOnly
                                value={user.password}
                                className="input font s15 c000" 
                            />
                        </div>
                        <div className="item flex aic">
                            <div className="lbl font s15 cfff">Confirm Password:</div>
                            <input 
                                type="password" 
                                readOnly
                                value={user.password}
                                className="input font s15 c000" 
                            />
                        </div>
                        <div className="item flex aic">
                            <div className="lbl font s15 cfff">PIN:</div>
                            <input 
                                type="password" 
                                readOnly
                                value={user.pin}
                                className="input font s15 c000" 
                            />
                        </div>
                        <div className="item flex aic">
                            <div className="lbl font s15 cfff">Confirm PIN:</div>
                            <input 
                                type="password" 
                                readOnly
                                value={user.pin}
                                className="input font s15 c000" 
                            />
                        </div>
                        <div className="ftr flex aic">  
                            <button onClick={_editPersonalInfo} className="button font s15 cfff anim">Edit</button>
                        </div>
                    </div>
 
                    {/* 2FA Info */}
                    <div className="fa-blk flex flex-col">
                        <div className="flex aic"> 
                            <div className="lit flex flex-col">
                                <div className="label font s22 cfff">2FA</div>
                                <div className="sub font s15 cfff">Download Google Authenticator and scan the QR code.</div>
                                <div className="backup font s22 cfff">Backup Code</div>
                                <div className="num font s18 cfff">985685 985685</div>
                                <div className="num font s18 cfff">985685 985685</div>
                                <div className="num font s18 cfff">985685 985685</div>
                                <div className="msg font s15 cfff">Don't lose the code, it will be required if you<br/> lose the phone or the App. In case of you lose authenticator,<br/> we may not be able to help you</div>
                                <div className="item flex aic"> 
                                    <div className="lbl font s16 cfff">Confirm:</div>
                                    <div className="flex flex-col aic">
                                        <div className="s13 font cfff">Add 6 digit code from the App.</div>
                                        <input type="number" defaultValue="731256" className="input font s22 c000" />
                                    </div> 
                                </div>
                            </div>
                            <div className="rit flex aic">
                                <img src="/images/qr.svg" className="qr" />
                            </div>
                        </div>
                        <div className="ftr flex aic">  
                            <button className="button font s15 cfff anim">Save</button>
                        </div>
                    </div>
                
                    {/* Level Info Block */}
                    <LevelInfo/>
                </div>  
            </div>
            <Footer/>
        </React.Fragment>
    );
} 

export default Setting;