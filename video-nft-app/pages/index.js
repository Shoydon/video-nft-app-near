import Link from 'next/link';
import { ToastContainer} from 'react-toastify';

export default function Home() {
  return (
    <div className="App h-screen">
      <ToastContainer />
      <div className="gradient-bg-welcome h-screen w-screen">
        <Nav account={account} />
        <h1>Welcome to the Home Page</h1>
      </div>
    </div>
  );
}
