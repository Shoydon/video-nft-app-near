import Nav from '@/components/Nav';
import { PinataSDK } from 'pinata-web3';
import { NearContext } from '@/wallets/near';
import { NftNearContract } from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect, useState } from 'react';
import Home from '@/components/Home';
import Explore from '@/components/Explore';
import Mint from '@/components/Mint';
const CONTRACT = NftNearContract;

const NEXT_PUBLIC_PINATA_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZjFmMWI2My1kNTI2LTQ1NWItODUxZS0zNTJlOWZkNzk0M2QiLCJlbWFpbCI6ImFtYW45Njkza3VtYXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIzOGNmMDJmMDVjNzU0NjJmZjg2Iiwic2NvcGVkS2V5U2VjcmV0IjoiODI5Mjc1MWIzMmNmMTMyMTM3MTFlYWQ4MTNkMDFmNzU3OTdmYTUyNmE3NTQyOWI3YzRlYmI0YzJmMzQ5YjQ5OCIsImV4cCI6MTc1ODI5NDMwMH0.HndNVb96EtparqALFQvk0Bm_GRXUCDOSrrcgBRMhIOM"

const pinata = new PinataSDK({
  pinataJwt: NEXT_PUBLIC_PINATA_KEY,
  pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});



export default function IndexPage() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [route, setRoute] = useState("home");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFetchNfts, setShouldFetchNfts] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [canPlay, setCanPlay] = useState(false);
  const [url, setUrl] = useState(null);

  const [currNft, setCurrNft] = useState(null);
  const [player, setPlayer] = useState(false);

  useEffect(() => {
    if (signedAccountId) {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }, [signedAccountId])


  useEffect(() => {
    async function getAllNFTs() {
      if (connected && signedAccountId) {
        try {
          setIsLoading(true);
          const count = await wallet.viewMethod({ contractId: CONTRACT, method: "get_total_count" });
          const nftData = [];

          for (let i = 0; i < count; i++) {
            const i_string = String(i);
            const tx = await wallet.viewMethod({ contractId: CONTRACT, method: "get_nft", args: { index: i_string } });
            const data = await pinata.gateways.get(`https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${tx.uri}`);
            const mergedNFTData = {
              ...(typeof tx === 'object' ? tx : {}),
              ...(typeof data.data === 'object' ? data.data : {}),
            };

            nftData.push(mergedNFTData);
          }
          // console.log('NFTs fetched:', nftData);
          setNfts(nftData);
          setShouldFetchNfts(false);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching NFTs:', error);
          toast.error("Error fetching NFTs", {
            position: "top-center"
          })
        }
      }
    }
    getAllNFTs();
  }, [shouldFetchNfts, connected, signedAccountId]);


  const onRouteChange = (route) => {
    setRoute(route);
  };

  const mintNFTs = async (uri, price) => {
    if (!signedAccountId) return;
    try {
      const depositAmount = price * 1e24;
      console.log(depositAmount);
      const tx = await wallet.callMethod({
        contractId: CONTRACT,
        method: 'mint',
        args: {
          uri,
          price: depositAmount.toString()
        },
      });
      toast.success("NFT minted successfully", {
        position: "top-center"
      });
      setShouldFetchNfts(true);
      onRouteChange("explore");
    } catch (e) {
      console.log(e)
      toast.error('Error minting NFT:', {
        position: "top-center"
      });
    }
  }

  const uploadToPinata = async (file, name, description, price) => {
    if (!file) {
      throw new Error("File is required");
    }

    try {
      toast.info("Uploading video to IPFS", {
        position: "top-center"
      })
      const uploadImage = await pinata.upload.file(file);
      const metadata = await pinata.upload.json({
        name: name,
        description: description,
        video: `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
        price: price
      });

      return metadata.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      toast.error("Minting NFT failed.", {
        position: "top-center"
      });
      throw new Error("Upload to Pinata failed.");
    }
  };

  const handlePay = async (item) => {
    if (!signedAccountId) return;
    // console.log(price);
    const id = item.id;
    const uri = item.uri;
    const price = item.price;
    
    try {
      const depositAmount = BigInt(price * 1000000000000000000000000);
      await wallet.callMethod({
        contractId: CONTRACT,
        method: 'watch',
        args: {
          index: id.toString()
        },
        deposit: depositAmount.toString()
      });

      toast.success("Please enjoy", {
        position: "top-center"
      });
      setCanPlay(true);
      setUrl(item.uri);
      setShouldFetchNfts(true);
      setPlayer(true)
      setCurrNft(item)
    } catch (e) {
      console.log(e)
      toast.error('Error playing NFT:', {
        position: "top-center"
      });
    }
  }

  return (
    <div className="App h-screen">
      <ToastContainer />
      <div className="gradient-bg-welcome h-screen w-screen">
        <Nav onRouteChange={onRouteChange} />
        {route === "home" ? (
          <Home onRouteChange={onRouteChange} />
        ) : route === "explore" ? (
          <Explore nfts={nfts} isConnected={connected} isLoading={isLoading} canPlay={canPlay} handlePay={handlePay} url={url} setCurrNft={setCurrNft} currNft={currNft} player={player} setPlayer={setPlayer}/>
        ) : route === "mint" ? (
          <Mint uploadToPinata={uploadToPinata} mintNFT={mintNFTs} />
        ) : (
          <>Cannot find page</>
        )
        }
      </div>
    </div>
  );
}
