import React,{useEffect} from 'react';
import Lottie from 'react-lottie';
import * as pageNotFound from "../lottie/pageNotFound.json"
  
function Privacy(props) { 
    useEffect(()=>{
        document.documentElement.scrollTop = 0;
    },[]);

    const _pageNotFound_ = {
        loop: true,
        autoplay: true, 
        animationData: pageNotFound.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
     
    return ( 
        <div className="page-not-found flex flex-col aic">
            <div className="vector"><Lottie options={_pageNotFound_} width={500}/></div>  
        </div>   
    );
}

export default Privacy;