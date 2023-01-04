import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import {Toast, LineLoader} from "../ui";
import {
    focus,
    isValidEmail,
    keyupListener,
    keyCodes
} from "../core"
import {useDispatch} from 'react-redux'

 
function Signin(props) {

    const [check, setCheckbox] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if(localStorage.getItem('loginInfo'))
        {
            const logininfo = (localStorage.getItem('loginInfo'))
            setEmail(JSON.parse(logininfo).email)
            setPassword(JSON.parse(logininfo).password)
            setCheckbox(true)
        }
    },[])

    const _getUserInfo = async (token) => {
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
            setLoading(false)
        }
      } catch (error) {
        setLoading(false) 
        console.log(error)
      }
    }

    const _check = () => {
        if(localStorage.getItem('loginInfo'))
        {
            localStorage.removeItem('loginInfo')
            setCheckbox(false)
        }
        else if(check && !localStorage.getItem('loginInfo'))
        {
            setCheckbox(false)
        }
        else 
        { 
            setCheckbox(true)
        }
    } 

    const _login = () => {
        if(email == null){ 
            focus("._email");
            Toast.show({ html: "Please enter your email", time: 5 });
        } else if (!isValidEmail(email)){
            focus("._email"); 
            Toast.show({ html: "Please enter valid email", time: 5 }); 
        } else if (password == null){
            focus("._password");
            Toast.show({ html: "Please enter password email", time: 5 });
        } else {
            setLoading(true)  
            axios.post(
                `${global.baseurl}:8000/api/auth/sign-in`, {email: email, key: password})
                .then((response) =>{ 
                    //console.log(response) 
                    setLoading(false)
                    const {success, message, token} = response.data;
                    Toast.show({ html: "User Login Successfully", type: success ? "ok" : 'error', time: 5 }); 
                    if(success){
                        _getUserInfo(token)
                        localStorage.setItem("key", token);
                        dispatch({type: 'IS_USER', payload: true})
                        props.history.push("/")
                        if(check){localStorage.setItem('loginInfo', JSON.stringify({email, password}))}
                    }    
                })  
                .catch ((error) => {  
                    setLoading(false) 
                    console.log(error.response)  
                    const {success, message} = error.response.data;
                    Toast.show({ html: message, type: success ? "warn" : 'error', time: 6 });
                })
        } 
    } 
  
    return (
        <div className="sign-p login rel flex aic">
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
                </div> 
                <div className="form">
                    <div className="item rel">
                        <input 
                            type="text" 
                            placeholder="Email"
                            className="cleanbtn _email iput font s15 cfff anim"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyUp={(e)=>{keyupListener(e, keyCodes.ENTER, ()=>{_login()})}} 
                        /> 
                    </div>
                    <div className="item rel">
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="cleanbtn _password iput font s15 cfff anim"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyUp={(e)=>{keyupListener(e, keyCodes.ENTER, ()=>{_login()})}} 
                        /> 
                    </div>
                    <div className="item flex aic">
                        <div className="box flex aic">
                            <button 
                                className={`checkbox cleanbtn ${check === true ? "on icon-check" : ""}`} 
                                onClick = {()=>{_check()}}
                            />
                            <div className="lbl font s14 c333">Remember Me</div>
                        </div>
                        <Link to="/" className="lin font s14">Forgot Password or Email</Link>
                    </div>
                    <div className="ftr flex aic">
                        <button 
                            className="button font s15 cfff anim" 
                            onClick={()=>_login()}
                            onKeyUp={(e)=>{keyupListener(e, keyCodes.ENTER, ()=>{_login()})}} 
                        >Sign In</button>  
                    </div>
                    <div className='blk flex aic'>
                        <div className="lbl font s15 anim">Already have a account?&nbsp;<Link to="/register" className='cfff'>Signup</Link></div>
                    </div>
                    <div className="blk flex aic">
                        <div className="lbl font s15 anim">Or login with</div>
                        <a href="https://localpsyche.com:3000/auth/google" className="cleanbtn link flex aic"><img src="/images/google-logo.svg"  className="img"/></a>
                        {/*<button className="cleanbtn link flex aic"><img src="/images/apple-logo.svg"  className="img"/></button>*/}
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Signin;