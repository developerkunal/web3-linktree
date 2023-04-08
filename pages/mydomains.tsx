import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import link from "./link.svg";
import Image from "next/image";
import Abi from "../utils/Abi.json";
import { useContract, useContractRead, useSigner, useAccount } from "wagmi";
import Link from "next/link";
import axios from 'axios'
import { Head } from "next/document";

const Post = () => {
  const { data: signerData } = useSigner();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [token, setTokens] = useState();
  const router = useRouter();
  const { data: tokenIDs } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    chainId: 80001,
    functionName: 'getUserTokenIds',
    args: [address ? address : undefined,],
  })
  const linkee = useContract({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    signerOrProvider: signerData,
  });
  async function fetchTokenData() {
    if (!linkee || !tokenIDs) return; // Check if linkee or tokenIDs is null before calling functions on it

    async function getTokenURI(tokenId:number) {
      if (!linkee) return null; // Check if linkee is null before calling functions on it
      const tokenURI = await linkee?.tokenURI(tokenId);
      return tokenURI;
    }
    const tokenURIs = await Promise.all((tokenIDs as number[])?.map(getTokenURI));

    if (tokenURIs) {
      const tokenData = await Promise.all(
        tokenURIs?.map(async (uri: string) => {
          const { data } = await axios.get(uri);
          return data;
        })
      );
      const tokenMap = await tokenData?.reduce((acc, data, i) => {
        acc[tokenIDs[i]] = data;
        return acc;
      }, {});
      setTokens(tokenMap);
    }
  }
  useEffect(() => {

    if (!address && !isConnecting && isDisconnected) {
      router.push('/');
    }
    else if (address && signerData && tokenIDs) {
      fetchTokenData();
    }
  }, [address, signerData ,tokenIDs]);

  // rest of the component code
  return (
    <div className=" min-h-screen container mx-auto px-4 py-8 bg-gray-100">
      <div className="flex flex-wrap justify-center">
        {token ? Object.values(token).map((item:any) => (

          <div className="w-full md:w-1/4 p-4" key={item?.name}>
            <article className="rounded-xl border border-gray-700 bg-gray-800 p-4">
              <div className="flex items-center gap-4">
                <img
                  alt="Developer"
                  src={item?.image_url}
                  className="h-16 w-16 rounded object-cover"
                />

                <div>
                  <h3 className="text-lg font-medium text-white">{item?.name}</h3>

                  <div className="flow-root">

                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                <li><Link href={`/edit/${item?.name}`}>
                  <a
                    className="block h-full rounded-lg border border-gray-700 p-2 hover:border-pink-600"
                  >
                    <strong className="font-medium text-white">Edit</strong>

                  </a>
                </Link>
                </li>

                <li><Link href={`/tree/${item?.name}`}>
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
