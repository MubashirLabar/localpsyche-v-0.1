import React,{useState} from 'react'
import {Link} from 'react-router-dom'

function Footer() {

    const secondRow = [
        {label: 'Sell Psyche', slug: '/sell'},
        {label: 'Buy Psyche', slug: '/'}, 
        {label: 'Blog', slug: '/'},
    ]
    
    const thirdRow = [
        {label: 'Risk in crypto', slug: '/'},
        {label: 'Terms and Conditions', slug: '/terms-conditions'},
        {label: 'Data/Privacy Policy', slug: '/privacy-policy'},
    ]
     
    return (
        <div className="footer-p">
            <div className="wrapper flex">
                <div className="col flex flex-col">
                    <Link to="/"><img src="/images/logo.svg" className="logo" /></Link>
                    <div className="lin font s15 cfff anim">cs@localpsyhe.com</div>
                    <div className="lin s13 font cfff anim">&copy; 2019 &#124; All Rights Reserved.</div>
                </div>
                <div className="col flex flex-col">
                    {
                        secondRow.map(item => (
                            <Link to={item.slug}  className="lin s14 font cfff anim">{item.label}</Link>
                        ))
                    }
                </div>
                <div className="col flex flex-col">
                    {
                        thirdRow.map(item => (
                            <Link to={item.slug} className="lin s14 font cfff anim">{item.label}</Link>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Footer;