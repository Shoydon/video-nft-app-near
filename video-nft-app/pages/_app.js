import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { Wallet, NearContext } from '@/wallets/near';
import { NetworkId } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';


const wallet = new Wallet({ networkId: NetworkId });


export default function App({ Component, pageProps }) {

  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
       <div className="App min-vh-100">
        <div className="gradient-bg-welcome h-100">
          <Component {...pageProps} />
        </div>
      </div>
    </NearContext.Provider>
  );
}
