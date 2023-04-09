import { useRouter } from 'next/router'
import Abi from "../utils/Abi.json";
import { useContractRead, useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Button } from '@tremor/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const Post = () => {
  const router = useRouter()
  const { link } = router.query
  const { address, isDisconnected } = useAccount();
  const [twitterHandle, setTwitterHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [blogLink, setBlogLink] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [twitterHandle1, setTwitterHandle1] = useState('');
  const [youtubeHandle1, setYoutubeHandle1] = useState('');
  const [discordHandle1, setDiscordHandle1] = useState('');
  const [blogLink1, setBlogLink1] = useState('');
  const [portfolioLink1, setPortfolioLink1] = useState('');
  const [websiteLink1, setWebsiteLink1] = useState('');
  const socialplatform = ["twitter", "youtube", "discord", "blog", "portfolio", "website"];
  const [isWriting, setIsWriting] = useState(false);  
  const { data: domainowner } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    chainId: 80001,
    functionName: 'getDomainOwner',
    args: [link],
  })
  
  const { data: sociallinks } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    chainId: 80001,
    functionName: 'getSocialLinks',
    args: [link, socialplatform],
  })

  useEffect(() => {
    if (sociallinks && Array.isArray(sociallinks) && sociallinks.length === 6) {
      setTwitterHandle(sociallinks[0]?.substring(20));
      setYoutubeHandle(sociallinks[1]?.substring(20));
      setDiscordHandle(sociallinks[2]?.substring(19));
      setBlogLink(sociallinks[3]);
      setPortfolioLink(sociallinks[4]);
      setWebsiteLink(sociallinks[5]);
    }
    if (!address || !link || !domainowner || isDisconnected || address !== domainowner) {
      router.push('/');
    }
  }, [sociallinks]);
  const { config } = usePrepareContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_SMART_CONTRACT}`,
    abi: Abi,
    functionName: 'addSocialLinks',
    chainId: 80001,
    args: ([link, socialplatform, [twitterHandle1, youtubeHandle1, discordHandle1, blogLink1, portfolioLink1, websiteLink1]])
  })
  const { isSuccess, write } = useContractWrite({
    ...config
  })
  useEffect(() => {
    if (twitterHandle!=null && youtubeHandle!=null && discordHandle!=null && blogLink!=null && portfolioLink!=null && websiteLink!=null && isWriting) {
      write?.();
      setIsWriting(false);
    }
  }, [twitterHandle, youtubeHandle, discordHandle, blogLink, portfolioLink, websiteLink, isWriting]);

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // Here you can make a fetch request to submit the form data to the server
    const twitter = twitterHandle ? "https://twitter.com/" + twitterHandle : '';
    const youtube = youtubeHandle ? "https://youtube.com/" + youtubeHandle : '';
    const discord = discordHandle ? "https://discord.gg/" + discordHandle : '';
    const blog = blogLink ? blogLink.replace(/^(https?:\/\/)?/i, 'https://') : '';
    const portfolio = portfolioLink ? portfolioLink.replace(/^(https?:\/\/)?/i, 'https://') : '';
    const website = websiteLink ? websiteLink.replace(/^(https?:\/\/)?/i, 'https://') : '';

    setTwitterHandle1(twitter);
    setYoutubeHandle1(youtube);
    setDiscordHandle1(discord);
    setBlogLink1(blog);
    setPortfolioLink1(portfolio);
    setWebsiteLink1(website);
    setIsWriting(true);
    }
    if(isSuccess){
      router.reload();
    }
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Edit</title>
      </Head>
      <div className="flex items-center flex-col mx-auto w-full justify-center  px-8">

        <div className="flex justify-between container mx-auto">
          <div className="w-full">
            <div className="mt-4 px-4">
              <h1 className="text-3xl font-semibold py-7 px-5">Edit {link} Linktree</h1>
              <form className="mx-5 my-5" onSubmit={handleSubmit}>

                <div className="mt-5">
                  <label className="input-field inline-flex items-baseline border-2 border-black rounded  p-4">
                    <span className="flex-none text-dusty-blue-darker select-none leading-none">twitter.com/
                    </span>
                    <div className="flex-1 leading-none">
                      <input id="handle" type="text" className="w-full pl-1 bg-transparent focus:outline-none" name="handle" placeholder="username" value={twitterHandle}
                        onChange={(event) => setTwitterHandle(event.target.value)} />
                    </div>
                  </label>
                </div>
                <div className="mt-5">

                  <label className="input-field inline-flex items-baseline border-2 border-black rounded  p-4">

                    <span className="flex-none text-dusty-blue-darker select-none leading-none">youtube.com/
                    </span>

                    <div className="flex-1 leading-none">

                      <input id="handle" type="text" className="w-full pl-1 bg-transparent focus:outline-none" name="handle" placeholder="username" value={youtubeHandle} onChange={(event) => setYoutubeHandle(event.target.value)} />
                    </div>
                  </label>
                </div>
                <div className="mt-5">

                  <label className="input-field inline-flex items-baseline border-2 border-black rounded  p-4">

                    <span className="flex-none text-dusty-blue-darker select-none leading-none">discord.gg/
                    </span>

                    <div className="flex-1 leading-none">

                      <input id="handle" type="text" className="w-full pl-1 bg-transparent focus:outline-none" name="handle" placeholder="username" value={discordHandle} onChange={(event) => setDiscordHandle(event.target.value)} />
                    </div>
                  </label>
                </div>
                <label className="relative block p-2 border-2 mt-5 border-black rounded" htmlFor="name">
                  <span className="text-md font-semibold text-zinc-900" >
                    Blog link
                  </span>

                  <input className="w-full   p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none" id="name" type="text" placeholder="Enter Your Blog URL" value={blogLink} onChange={(event) => setBlogLink(event.target.value)} />
                </label>


                <label className="relative block p-3 border-2  mt-5 border-black rounded" htmlFor="name">
                  <span className="text-md font-semibold  text-zinc-900" >
                    Portfolio Link
                  </span>

                  <input className="w-full read-only:bg-zinc-800  p-0 text-sm bg-transparent text-gray-500 focus:outline-none" id="name" type="text" placeholder="Enter Portfolio Link" value={portfolioLink} onChange={(event) => setPortfolioLink(event.target.value)} />
                </label>

                <label className="relative block p-3 border-2 mt-5 border-black rounded" htmlFor="name">
                  <span className="text-md font-semibold  text-zinc-900" >
                    Website Link
                  </span>

                  <input className="w-full read-only:bg-zinc-800  p-0 text-sm bg-transparent text-gray-500 focus:outline-none" id="name" type="text" placeholder="Enter Your Website Link" value={websiteLink} onChange={(event) => setWebsiteLink(event.target.value)} />
                </label>

                <Button className="mt-5 border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black translate-y-2 border-l-4">
                  Submit
                </Button>
               
              </form>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Post