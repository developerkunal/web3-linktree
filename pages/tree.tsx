import { useRouter } from 'next/router'
import { useAccount, usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import Head from 'next/head';
import { checkAvailable, checkDomainOwner, fetchDomain } from '../utils/polybase';
import { CollectionRecordResponse } from '@polybase/client/dist/types';
function LinkCard({
  href,
  title,
  image,
}: {
  href?: string;
  title: string;
  image?: string;
}) {
  if (!href) {
    return null;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-1 w-full rounded-md hover:scale-105 transition-all bg-gray-100 mb-3 max-w-3xl"
    >
      <div className="flex text-center w-full">
        <div className="w-10 h-10">
          {image && (
            <Image
              className="rounded-sm"
              alt={title}
              src={image}
              width={40}
              height={40}
            />
          )}
        </div>
        <h2 className="flex justify-center items-center font-semibold w-full text-gray-700 -ml-10">
          {title.toUpperCase()}
        </h2>
      </div>
    </a>
  );
}
interface Link {
  href: string;
  title: string;
  image?: string;
}

const Post = () => {
  const router = useRouter()
  const { link } = router.query
  const { address, isDisconnected } = useAccount();
  const [editbutton, setEditbutton] = useState(false);
  const [domainowner, setDOmainowner] = useState(false);
  const [domaindata, setDomaindata] = useState<CollectionRecordResponse<any>[]>([]);


  const { config } = usePrepareSendTransaction({
    chainId: 8081,
    request: { to: address || '', value: BigNumber.from('5000000000000000000') },
  })
  const { isSuccess, sendTransaction } =
    useSendTransaction(config);
  if (isSuccess) {
    window.alert('Transaction Successfull')
  }
  useEffect(() => {
    async function checkdomain() {
      if (typeof link === "string") {
        const data = await checkDomainOwner(`${address}`, link);
        setDOmainowner(data);
      }
    }
    async function setData() {
      if (typeof link === "string") {
        const data = await fetchDomain(link);
        setDomaindata(data);
      }
    }
    async function checkAvailabilityAndRedirect() {
      if (typeof link === "string") {
        console.log(await checkAvailable(link));
        if (await checkAvailable(link)) {
          // Resource is available, do nothing
          return;
        } else {
          // Resource is not available, redirect to the homepage
          router.push('/');
        }
      }
    }

    checkdomain()
    setData()
    checkAvailabilityAndRedirect();

    if (address && link && domainowner && !isDisconnected) {
      setEditbutton(true);
    }

  }, [domainowner, isDisconnected, address, link]);

  if (typeof link === 'string') {

    checkAvailable(link).then((domainAvailable) => {
      if (!domainAvailable) {
        return;
      }
    });
  }
  type Links = {
    href?: string;
    title: string;
  };
  const links: Links[] = domaindata[0]?.data?.links ? Object.entries(domaindata[0].data.links).map(([title, href]) => ({
    href: href as string,
    title,
  })) : [];
  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <Head>
        <title>{link} LinkTree</title>
      </Head>
      <div className="flex items-center flex-col mx-auto w-full justify-center px-8">
        <br />

        <Image
          priority
          className="rounded"
          alt={Array.isArray(domaindata[0]?.data?.name) ? domaindata[0].data.name.join(' ') : domaindata[0]?.data?.name} src={domaindata[0]?.data?.image}
          width={96}
          height={96}
        />
        <h1 className="font-bold mt-4 mb-8 text-xl text-white">{link}</h1>
        {links.map((link, i) => (
          <LinkCard key={i} {...link} />
        ))}
        < Link
          href={`/showcase?link=${link}`}><button
            rel="noopener noreferrer"
            className="flex items-center p-1 w-full rounded-md hover:scale-105 transition-all bg-gray-100 mb-3 max-w-3xl"
          >
            <div className="flex text-center w-full">
              <div className="w-10 h-10">
              </div>
              <h2 className="flex justify-center items-center font-semibold w-full text-gray-700 -ml-10">
                NFT Showcase
              </h2>
            </div>
          </button>
        </Link>
        <button
          rel="noopener noreferrer"
          className={`flex items-center p-1 w-full rounded-md hover:scale-105 transition-all ${!sendTransaction ? 'bg-gray-500' : 'bg-gray-100'} mb-3 max-w-3xl`} onClick={() => sendTransaction?.()}
        >
          <div className="flex text-center w-full">
            <div className="w-10 h-10">
            </div>
            <h2 className="flex justify-center items-center font-semibold w-full text-gray-700 -ml-10">
              Donate Now - 5 SHM
            </h2>
          </div>
        </button>
        {editbutton && <Link
          href={`/edit?link=${link}`}><button
            rel="noopener noreferrer"
            className="flex items-center p-1 w-full rounded-md hover:scale-105 transition-all bg-gray-100 mb-3 max-w-3xl"
          >
            <div className="flex text-center w-full">
              <div className="w-10 h-10">
              </div>
              <h2 className="flex justify-center items-center font-semibold w-full text-gray-700 -ml-10">
                Edit Profile
              </h2>
            </div>
          </button>
        </Link>
        }
      </div>
    </div >

  );
}

export default Post