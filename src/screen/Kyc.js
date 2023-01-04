import React,{useState, useEffect} from 'react'
import Header from "../components/Header"
import Footer from "./Footer"
import LevelInfo from '../components/LevelInfo'
import axios from "axios"
import countries from "../countries.json" 

function Kyc(props) {

    const [country, setCountry] = useState(null); 
    const [dropcurcountry,setdropcurcountry] = useState(null)
    const [dropCun, setDropCun] = useState(false);

    useEffect(()=>{
        _getLocation()
        document.documentElement.scrollTop = 0;
        document.body.addEventListener("click", ()=>{
            setDropCun(false);
        })  
    },[]);  

    const _getLocation = () => {
        axios.get("https://geolocation-db.com/json/f9902210-97f0-11eb-a459-b997d30983f1")
        .then((response) =>{
            //console.log(response)
            setCountry(response.data.country_name)
            setdropcurcountry(response.data.country_name)
        }) 
        .catch ((error) => { 
            console.log(error)
        })
    } 

    return (
        <React.Fragment>
            <Header/>
                <div className="kyc-p">
                    <div className="wrapper flex flex-col">
                        <div className="title flex aic">
                            <div className="font s38 black">KYC</div>
                        </div>
                        {/* Personal Info */}
                        <div className="personal">
                            <div className="label font s22 cfff">Personal:</div>
                            <div className="form flex aic">
                                <div className="lit flex flex-col">
                                    <div className="item flex aic">
                                        <div className="lbl font s15 cfff">Full name:</div>
                                        <div className="col flex flex-col">
                                            <div className="mg font s14 cfff">Name should be the same as legal document</div>
                                            <input type="text" className="input font s15 c000" />
                                        </div>
                                    </div>
                                    <div className="item flex aic">
                                        <div className="lbl font s15 cfff">Passport/ID number:</div>
                                        <input type="text" className="input font s15 c000" />
                                    </div>
                                    <div className="item flex aic">
                                        <div className="lbl font s15 cfff">Country:</div>
                                        <button className="item cleanbtn cstm-slt flex aic rel" onClick={(e)=>{
                                            e.stopPropagation();
                                            setDropCun(!dropCun);  
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
                                <div className="rit flex">
                                    <div className="block flex flex-col">
                                        <div className="item flex aic">
                                            <div className="lbl font s15 cfff">Trust:</div>
                                            <div className="font s15 cfff">80%</div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="lbl font s15 cfff">Sold:</div>
                                            <div className="font s15 cfff">25,00</div>
                                        </div>
                                        <div className="item flex aic">
                                            <div className="lbl font s15 cfff">KYC:</div>
                                            <div className="font s15 cfff">Not verified</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="identiy flex aic">
                                <div className="lit flex flex-col">
                                    <div className="msg font s15 cfff">Take a selfie with your document and the given number. Please follow the picture.</div>
                                    <div className="rules flex flex-col">
                                        <div className="pt font s15 cfff">No caps</div>
                                        <div className="pt font s15 cfff">No sunglasses</div>
                                        <div className="pt font s15 cfff">No eye glasses</div>
                                        <div className="pt font s15 cfff">No face accessories</div>
                                        <div className="pt font s15 cfff">The approval can take up to 48 hours.</div>
                                    </div>
                                    <div className="dis font s15 cfff">A selfie of you holding: the page of your Passport showing your personal details / Or your National ID with your face image and personal details + a handwritten note stating <br/>"Localpsyche 586JHG-1" and signature and the date.</div>
                                </div>
                                <div className="rit flex">
                                    <img src="/images/selfy-vector.svg" className="img"/>
                                </div> 
                            </div> 
                            <div className="uplod flex aic">
                                <div className="item flex flex-col aic">
                                    <div className="lbl font s15 cfff">Upload front side</div>
                                    <div className="pre flex     aic">
                                        <div className="font s13 cfff">Image preview</div>
                                    </div>
                                    <div className="button font s15 cfff anim">Upload</div>
                                </div>
                                <div className="item flex flex-col aic">
                                    <div className="lbl font s15 cfff">Upload front side</div>
                                    <div className="pre flex     aic">
                                        <div className="font s13 cfff">Image preview</div>
                                    </div>
                                    <div className="button font s15 cfff anim">Upload</div>
                                </div>
                                <div className="item flex flex-col aic">
                                    <div className="lbl font s15 cfff">Upload front side</div>
                                    <div className="pre flex     aic">
                                        <div className="font s13 cfff">Image preview</div>
                                    </div>
                                    <div className="button font s15 cfff anim">Upload</div>
                                </div>
                                <div className='action flex aic'>
                                    <button className="button font s15 cfff anim">Submit</button>
                                </div>
                            </div>
                            <div className="status flex flex-col">
                                <div className="lbl font s22 cfff">Status:</div>
                                <div className="txt font s15 cfff">Identiy has been submitted to verify</div>
                                <div className="txt font s15 cfff">Not verified</div>
                                <div className="txt font s15 cfff">Identiy verified</div>
                                <div className="txt font s15 cfff">Rejected</div>
                            </div>
                        </div>

                        {/* Level Info Block */}
                        <LevelInfo ftr={false}/>
                    </div> 
                </div>
            <Footer/>
        </React.Fragment> 
    );
}

export default Kyc;