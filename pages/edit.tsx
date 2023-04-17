import { useRouter } from 'next/router'
import { useAccount } from "wagmi";
import { Button } from '@tremor/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AddLinks, checkDomainOwner, fetchDomain } from '../utils/polybase';
import { CollectionRecordResponse } from '@polybase/client/dist/types';

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
  const socialplatform = ["twitter", "youtube", "discord", "blog", "portfolio", "website"];
  const [domainowner, setDOmainowner] = useState(false);
  const [domaindata, setDomaindata] = useState<CollectionRecordResponse<any>[]>([]);

  const socialLinks = domaindata[0]?.data?.links; // assuming `data` is the array you receive with the API response

  useEffect(() => {
    if (socialLinks) {
      setTwitterHandle(socialLinks["twitter"]?.substring(20));
      setYoutubeHandle(socialLinks["youtube"]?.substring(20));
      setDiscordHandle(socialLinks["discord"]?.substring(19));
      setBlogLink(socialLinks["blog"]);
      setPortfolioLink(socialLinks["portfolio"]);
      setWebsiteLink(socialLinks["website"]);
    }
  }, [socialLinks]);

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
    async function checkAndRedirect() {
      if (typeof link === "string") {
        const isConnected = !isDisconnected;
        const domainowner = await checkDomainOwner(`${address}`, link);
        const shouldRedirect = !address || !link || !domainowner || !isConnected;
        if (shouldRedirect) {
          await router.push('/');
        }
      }
    }
    if (address && link) {
      checkdomain()
      setData()
    }
    checkAndRedirect()
  }, [domainowner, isDisconnected, address, link]);

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // Here you can make a fetch request to submit the form data to the server
    const twitter = twitterHandle ? "https://twitter.com/" + twitterHandle : '';
    const youtube = youtubeHandle ? "https://youtube.com/" + youtubeHandle : '';
    const discord = discordHandle ? "https://discord.gg/" + discordHandle : '';
    const blog = blogLink ? blogLink.replace(/^(https?:\/\/)?/i, 'https://') : '';
    const portfolio = portfolioLink ? portfolioLink.replace(/^(https?:\/\/)?/i, 'https://') : '';
    const website = websiteLink ? websiteLink.replace(/^(https?:\/\/)?/i, 'https://') : '';
    const id = domaindata[0]?.data?.id;
    if (id) {
      const response = await AddLinks(id, socialplatform, [twitter, youtube, discord, blog, portfolio, website]);
      console.log(response);
    }
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

function setDomaindata(data: import("@polybase/client").CollectionRecordResponse<any>[]) {
  throw new Error('Function not implemented.');
}
function setEditbutton(arg0: boolean) {
  throw new Error('Function not implemented.');
}

