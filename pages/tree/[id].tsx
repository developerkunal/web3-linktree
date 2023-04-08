import { useRouter } from 'next/router'
import { useAccount, useContract, useContractRead, useSigner } from 'wagmi'
import Abi from "../../utils/Abi.json";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import svg64 from 'svg64';
import Link from 'next/link';
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
          {title}
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
  const { id } = router.query
  const { data: signerData } = useSigner();
  const [sociallink, setSociallinks] = useState<string[]>([]);
  const { address, isConnecting, isDisconnected } = useAccount();
  const socialplatform = ["twitter", "youtube", "discord", "blog", "portfolio", "website"];
  const [editbutton, setEditbutton] = useState(false);
  const { data: domainowner } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    chainId: 80001,
    functionName: 'getDomainOwner',
    args: [id],
  })
  const { data: domainexists } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    chainId: 80001,
    functionName: 'domainExistsMap',
    args: [id],
  })
  const { data: sociallinks } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    chainId: 80001,
    functionName: 'getSocialLinks',
    args: [id, socialplatform],
  })
  useEffect(() => {
    if (sociallinks && Array.isArray(sociallinks) && sociallinks.length === 6) {
      setSociallinks(sociallinks);
    }
    if (address && id && domainowner && !isDisconnected && address === domainowner) {
      setEditbutton(true);
    }
  }, [sociallinks, domainowner, isDisconnected]);
  //console.log(sociallinks)

  const formattedLinks = Array.isArray(sociallinks) && sociallinks?.map((link, index) => {
    const title = socialplatform[index];
    return { title, href: link };
  });
  /* const data = {
    avatar:'https://linktree-nextjs.vercel.app/_next/image?url=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F1587647097670467584%2FadWRdqQ6_400x400.jpg&w=96&q=75',
    links:[href :sociallink,]
  } */
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720"><rect width="100%" height="100%"/><svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" version="1.2" viewBox="-200 -50 1000 1000"><path fill="#FFFFFF" d="M264.5 190.5c0-13.8 11.2-25 25-25H568c13.8 0 25 11.2 25 25v490c0 13.8-11.2 25-25 25H289.5c-13.8 0-25-11.2-25-25z"/><path fill="#FFFFFF" d="M265 624c0-13.8 11.2-25 25-25h543c13.8 0 25 11.2 25 25v56.5c0 13.8-11.2 25-25 25H290c-13.8 0-25-11.2-25-25z"/></svg><text x="30" y="670" style="font: 60px sans-serif;fill:#fff">${id}</text></svg>`;
  const image = svg64(svg);
  const data = {
    name: id,
    avatar: image,
    links: formattedLinks && formattedLinks,
  }
  if (!domainexists) {
    return;
  }
  return (
    <div className="flex items-center flex-col mx-auto w-full justify-center mt-16 px-8">
      <Image
        priority
        className="rounded"
        alt={Array.isArray(data.name) ? data.name.join(' ') : data.name} src={data.avatar}
        width={96}
        height={96}
      />
      <h1 className="font-bold mt-4 mb-8 text-xl text-white">{id}</h1>
      {data && Array.isArray(data.links) && data.links?.map((link, i) => (
        <LinkCard key={i} {...link} />
      ))}
      {editbutton && <Link
        href={`/edit/${id}`}><button
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
  );
}

export default Post