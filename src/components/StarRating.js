import React,{useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'

const StarRating = ({state}) => {

    const [rating, setRating] = useState(null)
    const [hover, setHover] = useState(null)

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch({type: state, payload: hover})
    },[hover])

    return(
        <div className='star-rating flex'>
            {
                [...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return(
                        <label className="str">
                            <input  
                                type="radio"
                                name="rating"
                                className="radio"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                            />
                            <button 
                                className={`cleanbtn ico icon-star1 anim ${ratingValue <= (hover || rating) ? "fl" : ''}`} 
                                onMouseEnter={() => setHover(ratingValue)}
                                oncMouseLeave={() => setHover(null)}
                            />
                        </label>
                    )
                })
            }
        </div>
    )
}

export default StarRating