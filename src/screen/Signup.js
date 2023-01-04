import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios"
import {Toast, LineLoader } from "../ui";
import {
    focus,
    isValidEmail,
    keyupListener,
    keyCodes
} from "../core";

function Signup(props) {

    const [userId, setUserId] = useState(null)
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [code, setCode] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPass, setConfirmPass] = useState(null)
    const [pin, setPin] = useState(null)
    const [confirmPin, setConfirmPin] = useState(null)
    const [loading, setLoading] = useState(false)

    /* Send Code */
    const _sendCode = () => {
        if(email == null){
            focus("._email");
            Toast.show({ html: "Please enter your email.", time: 5 });
        } 
        else if (!isValidEmail(email)){
            focus("._email"); 
            Toast.show({ html: "Please enter valid email.", time: 5 }); 
        } 
        else {
            axios.post(`${global.baseurl}:8000/api/auth/signup`, {email: email})
            .then((response) =>{
                console.log(response)
                Toast.show({ html: response.data.message, type: "ok", time: 5 }); 
            })  
            .catch((error) => { 
                Toast.show({ html: error.response.data.message, time: 5 });  
            })
        }
    }
 
    /* Register User */
    const _register = () => {
        if(userId == null){
            Toast.show({ html: "Enter user id is required   "})
        }
         else if(username == null){
            focus("._username")
            Toast.show({ html: "Please enter your full name", time: 5});
        }
         else if(email == null){
            focus("._email");
            Toast.show({ html: "Please enter your email.", time: 5 });
        } else if (!isValidEmail(email)){
            focus("._email"); 
            Toast.show({ html: "Please enter valid email.", time: 5 }); 
        } else if (code == null){ 
            focus("._code");  
            Toast.show({ html: "Please enter you confirmation code.", time: 5 }); 
        } else if (password == null){
            focus("._password");
            Toast.show({ html: "Please enter password.", time: 5 });
        } else if (confirmPass == null){
            focus("._confirmPass");
            Toast.show({ html: "Please enter confim password.", time: 5 });
        } else if (password !== confirmPass){
            Toast.show({ html: "Password and Confirm password not matching.", time: 5 });
        } else if (pin == null){
            Toast.show({ html: "Please enter your PIN code.", time: 5 });
        }  else if (confirmPin == null){
            Toast.show({ html: "Please enter confim PIN code.", time: 5 });
        }  else if (pin !== confirmPin){
            Toast.show({ html: "PIN and confirm PIN code not matching.", time: 5 });
        } else { 
            setLoading(true)
            axios.post( 
            `${global.baseurl}:8000/api/auth/confirm-email`, 
            {   
                username: username,
                userID: userId,
                email: email, 
                email_confirm_code: 
                code, key: password,  
                pin: pin
            })
            .then((response) =>{
                setLoading(false)
                console.log(response)
                Toast.show({ html: response.data.message, type: "ok", time: 5 }); 
                props.history.push("/login")
            }) 
            .catch ((error) => {  
                setLoading(false)
                console.log(error.response)  
                Toast.show({ html: error.response.data.message, time: 6 });
            })
        }
    } 
 
    return (
        <div className="sign-p rel flex aic">
            <img src="/images/right-btm.svg" className="rig-btm fixed" />
            <img src="/images/circle.svg" className="circle fixed abc" />
            <img src="/images/left-btm.svg" className="lef-btm fixed" />
            <div className="block flex flex-col rel">
                {loading && 
                    <div className="loading cover abs fill flex aic">
                        <LineLoader />
                    </div>
                }
                <div className="hdr flex aic">
                    <div className="lef flex aic">
                        <img src="/images/logo.svg" className="logo" />
                    </div>
                    <Link to="/login" className="lin font s15 cfff anim">Login</Link>
                </div>
                <div className="form">
                    <div className="item rel">
                        <input 
                            type="text" 
                            placeholder="Email"
                            className="cleanbtn _email iput font s15 cfff anim"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        /> 
                        <button className="btn font s14 cfff anim" onClick={()=> _sendCode()}>Send code</button>
                    </div>
                    <div className="item rel">
                        <input  
                            type="text" 
                            placeholder="User ID"
                            className="cleanbtn _username iput font s15 cfff anim"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                        />
                    </div>
                    <div className="item rel">
                        <input  
                            type="text" 
                            placeholder="Full name (visible to everyone)"
                            className="cleanbtn _username iput font s15 cfff anim"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="item rel">
                        <input  
                            type="text" 
                            placeholder="Code"
                            className="cleanbtn _code iput font s15 cfff anim"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                        />
                    </div>
                    
                    <div className="item rel">
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="cleanbtn _password iput font s15 cfff anim"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="item rel">
                        <input 
                            type="password" 
                            placeholder="Confim Password"
                            className="cleanbtn _confirmPass iput font s15 cfff anim"
                            value={confirmPass}
                            onChange={e => setConfirmPass(e.target.value)}
                        />
                    </div>
                    
                    <div className="item rel">
                        <input 
                            type="password" 
                            placeholder="PIN"
                            className="cleanbtn _pin iput font s15 cfff anim"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                        />
                    </div>
                    <div className="item rel">
                        <input 
                            type="password" 
                            placeholder="Confirm PIN"
                            className="cleanbtn _confirmPin iput font s15 cfff anim"
                            value={confirmPin}
                            onChange={e => setConfirmPin(e.target.value)}
                        />
                    </div>
                    
                    <div className="ftr flex aic">
                        <button className="button font s15 cfff anim" onClick={_register}>Register</button>
                    </div>
                </div> 
            </div>
        </div> 
    );
}

export default Signup;