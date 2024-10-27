import React from 'react';

function Cards({ item, player, handlePay }) {

  return (
    <div className='card-container'>
      <div className='card-div'>
        <div className='card-inner p-2'>
          <video
            className="card-img-top"
            alt="NFT"
            src={item.video}
            controls={false}
            autoPlay={false}
            style={{ height: "auto", width: "230px" }}
          >
          </video>
          <div className='card-content'>
            <h1 className='text-white text-3xl'><strong>{item.name}</strong></h1>
            <h4 className='text-white mx-2'>{item.description}</h4>
          </div>
          <div className='card-footer'>
            <h5 className='text-white'>Price: <span className='text-green-400'><strong>{item.price} </strong></span>NEAR</h5>
            {!player && <button type="button" className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 mt-4 mb-2" onClick={() => { handlePay(item) }}>Watch</button>}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Cards