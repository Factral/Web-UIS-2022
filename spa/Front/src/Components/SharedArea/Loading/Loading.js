import React from 'react'
import Spinner from 'react-bootstrap/Spinner';
import './Loading.css'

const Loading = () => {
  return (
    <div className='Loading'>
        <Spinner className='Spinner' animation="grow" variant="info" size="sm" />
        <ul className="card-text ps-0 mb-0 placeholder-glow" >
          {[...Array(7).keys()].map((i)=> 
          <li key={i} className="my-1 py-4 ps-0 placeholder col-12 bg-secondary rounded-2"></li>)}
        </ul>
    </div>
  )
}

export default Loading;