import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSigner, useAccount } from "wagmi";
import Link from "next/link";
import { listRecordsWithFilter } from "../utils/polybase";
import { CollectionRecordResponse } from "@polybase/client/dist/types";
import { useContract } from 'wagmi';
import Abi from '../utils/Abi.json'

const Post = () => {
  const { data: signerData } = useSigner();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [tokens, setTokens] = useState<CollectionRecordResponse<any>[]>([]);
  const router = useRouter();
  const linkee = useContract({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    signerOrProvider: signerData,
  });
  async function checkDomainAvailable(id: string) {
    const response = await linkee?.isTokenMinted(parseInt(id));
    if (response) {
      alert("Domain has been already Minted");
    }
    else {
      await linkee?.mint(id);
    }
  }
  useEffect(() => {
    async function fetchdata() {
      const data = await listRecordsWithFilter(`${address}`);
      setTokens(data);
    }
    if (!address && !isConnecting && isDisconnected) {
      router.push('/');
    }
    else if (address && signerData) {
      fetchdata()
    }
  }, [address, signerData]);

  // rest of the component code
  return (

    <div className=" min-h-screen container mx-auto px-4 py-8 bg-gray-100">

      <div className="flex flex-wrap justify-center">
        {tokens ? tokens.map((item: any) => (

          <div className="w-full md:w-1/4 p-4" key={item.data.id}>
            <article className="rounded-xl border border-gray-700 bg-gray-800 p-4">
              <div className="flex items-center gap-4">
                <img
                  alt="Developer"
                  src={item.data.image}
                  className="h-16 w-16 rounded object-cover"
                />

                <div>
                  <h3 className="text-lg font-medium text-white">{item.data.name}</h3>

                  <div className="flow-root">

                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
              <li>  <button className="block h-full rounded-lg border border-gray-700 p-2 hover:border-pink-600" onClick={() => checkDomainAvailable(item.data.id)}>
                  <a
                    
                  >
                    <strong className="font-medium text-white">Mint</strong>

                  </a>
                </button>
                </li>
                <li><Link href={`/edit?link=${item.data.domainname}`}>
                  <a
                    className="block h-full rounded-lg border border-gray-700 p-2 hover:border-pink-600"
                  >
                    <strong className="font-medium text-white">Edit</strong>

                  </a>
                </Link>
                </li>
                
                <li><Link href={`/tree?link=${item.data.domainname}`}>
                  <a
                    className="block h-full rounded-lg border border-gray-700 p-2 hover:border-pink-600"
                  >
                    <strong className="font-medium text-white">View</strong>

                  </a>
                </Link>
                </li>
              </ul>
            </article>

          </div>
        )) : (<h1>No Domains Found <Link href={'/'}><a className="block h-full rounded-lg border border-gray-700 p-2 hover:border-pink-600">Mint Now</a></Link></h1>)}

      </div>
    </div>
  );
};

export default Post;
