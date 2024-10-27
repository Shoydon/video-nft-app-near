import React, { useState } from 'react'
import PlayerCard from './PlayerCard'
import Cards from './Cards'

export default function Explore({ nfts, isConnected, isLoading, canPlay, handlePay, url, currNft, setCurrNft, player, setPlayer }) {

    return (
        <div>
            {!nfts && (
                <h2 className='text-white font-bold pt-24 text-2xl text-center'>Loading...</h2>
            )}
            {nfts && (
                <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16 '>
                    {player && (
                        // <div className='flex flex-wrap gradient-bg-welcome   gap-10 justify-center pt-24 pb-5 px-16'>

                        // </div>
                        <div style={{
                            width: '650px',
                            height: 'auto',
                            // backgroundColor: "#ddd",
                            margin: '0 auto',
                            display: 'block',
                            // justifyContent:'center'
                        }}>
                            {/* <PlayerCard item={currNft} player={player}/> */}
                            <div className='audio-outer'>
                                <div className='audio-inner'>
                                    <PlayerCard item={currNft} player={player} setPlayer={setPlayer} setCurrNft={setCurrNft} currNft={currNft} />
                                </div>
                            </div>
                        </div>
                    )}
                    {nfts.length > 0 ? (
                        nfts.map((item, idx) => (
                            <Cards key={idx} item={item} owner={item.owner} setNftitem={setCurrNft} index={idx} player={player} setPlayer={setPlayer} handlePay={handlePay} />
                        ))
                    ) : (
                        <main style={{ padding: "1rem 0" }}>
                            <h2 className='text-white'>No listed assets</h2>
                        </main>
                    )}
                    {/* {!error &&
                        (nftData.length > 0 ?
                            : (
                            ))} */}
                </div>
            )}
        </div>
    )
}
