import React from 'react';
import {Link} from 'react-router-dom'

function LevelInfo(props) {

    
    return ( 
        <div className='level-info flex flex-col'>
            <div className="label font s22 cfff">Level</div>
            <div className="sub font s15 cfff">You are on level 1</div>
            <div className='items'> 
                <div className="item font s15 cfff"><span className="b7 lbl">Level 1:</span>Monthly limit 2,00 UDS1.No KYC required</div>
                <div className="item font s15 cfff"><span className="b7 lbl">Level 2:</span>Monthly limit 5,000 USD1.2,000 USD1 sold/purchased, identity verified, 70% dynamic trust.</div>
                <div className="item font s15 cfff"><span className="b7 lbl">Level 3:</span>Monthly limit 10,000 USD1.5,000 USD1 sold/purchased, identity verified, 80% dynamic trust.</div>
                <div className="item font s15 cfff"><span className="b7 lbl">Level 4:</span>Monthly limit 25,000 UDS1.<br/>10,000 USD1 sold/purchased, identity verified, address verified, 85% dynamic trust.</div>   
                <div className="item font s15 cfff"><span className="b7 lbl">Level 5:</span>Monthly limit 2000,000 UDS1.<br/>25,000 USD1 sold/purchased, all 4 level, 90% dynamic trust.</div>   
            </div>
            {props.ftr != false && <div className="ftr flex aic">  
                <Link to="/kyc" className="button font s15 cfff anim">Verify KYC</Link>
            </div>}
        </div> 
    );  
}

export default LevelInfo;