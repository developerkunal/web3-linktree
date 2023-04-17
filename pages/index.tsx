import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import link from './link.svg'
import Image from 'next/image'
import Abi from '../utils/Abi.json'
import { useContract, useSigner, useAccount } from 'wagmi';
import Link from 'next/link';
import Popup from '../components/Popup'
import { checkAvailable, createNFT } from '../utils/polybase';
import { getUploadToken } from '../utils/spheron';

const Home: NextPage = () => {
  const [query, setQuery] = useState('');
  const [domainAvailable, setDomainAvailable] = useState(false);
  const { address, isDisconnected } = useAccount();
  const { data: signerData } = useSigner();
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false)
  const closePopup = () => setIsOpen(false)
  const [isLoading, setIsLoading] = useState(false);


  const linkee = useContract({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    signerOrProvider: signerData,
  });
  const isLink = (input: string) => {
    const pattern = /\.link$/;
    return pattern.test(input);
  };
  const checkDomainAvailability = async (name: string) => {
    if (isLink(name)) {
      const read = await checkAvailable(name.toLowerCase());
      setDomainAvailable(read);
      setError("");
    }
    else {
      setDomainAvailable(false);
      setError(`Domain does't end with .link`);
    }
  };

  const handleQueryChange = (event: { target: { value: any; }; }) => {

    checkDomainAvailability(event.target.value);
    setQuery(event.target.value);

  };
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      if (query && linkee && address) {
        if (isLink(query)) {
          setIsLoading(true);
          const imageurl = await getUploadToken(query);
          const data =await createNFT(query,'A Link domain. Use it to resolve your Linktree.',imageurl || '',`${address}`,query);
          await linkee?.mint(parseInt(data?.id));
          setIsLoading(false);
          setIsOpen(true);
        }
        else {
          setError(`Domain Doesn't have .Link extension to mint`);
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  };
  const upload = async () =>{
    await getUploadToken('kunal.link');
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>My Linktree</title>
      </Head>

      <div className="max-w-4xl mx-auto pt-12 pb-24 px-4 space-y-4">
        <h1 className="text-5xl text-center font-bold text-gray-800 mb-8 ">Welcome to Linkee</h1>
        <div className="flex justify-center items-center">
          <div className="w-1/2 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={link}
              alt=".Link Extension"
              width={500}
              height={500}
              layout="responsive"
              className="rounded-lg"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center justify-center mb-8 ">
          <input
            type="text"
            placeholder="Search for a domain name with .link extension"
            className="py-2 px-4 border border-gray-400 rounded-l-md w-80 focus:outline-none focus:ring focus:border-blue-300 "
            value={query}
            onChange={handleQueryChange}
            disabled={!linkee || isDisconnected}
          />
          {isLoading ? <button type="button" className={`${domainAvailable ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-r-md focus:outline-none focus:ring focus:border-blue-300`}
            disabled>
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </button> : <button
            type="submit"
            className={`${domainAvailable ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-r-md focus:outline-none focus:ring focus:border-blue-300`}
            disabled={domainAvailable}
          >
            Mint
          </button>}
          
        </form>
        <div className="flex justify-center items-center">

        <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300' disabled={!linkee || isDisconnected}>
         <Link href={isDisconnected ? '': '/mydomains'} >My Domains</Link></button>
         </div>
        {error != "" && <div role="alert">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            Error
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>{error}</p>
          </div>
        </div>}
        {domainAvailable === true && <div role="alert">
          <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
            Visit Domain
          </div>
          <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
            <p>You can visit domain here on <Link href={`/tree?link=${query.toLowerCase()}`}>{query.toLowerCase()}</Link></p>
          </div>
        </div>}
    
        <Popup isOpen={isOpen} domain={query} onClose={closePopup} />
        <p className="text-gray-600 text-lg mb-4">
          This is a Linkee website where you can find all my important links in one place. Just type a domain name with
          .link extension in the search box above and hit enter to find the corresponding link.
        </p>
      </div>
    </div>
  );
};

export default Home;
