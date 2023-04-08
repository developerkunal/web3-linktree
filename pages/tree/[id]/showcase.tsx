import { useRouter } from 'next/router'
import { useAccount, useContract, useContractRead, useSigner } from 'wagmi'
import Abi from "../../../utils/Abi.json";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import svg64 from 'svg64';
import Link from 'next/link';
import Head from 'next/head';
interface Props {
    nft: Nft;
}
interface Nft {
    contract_address: string;
    token_id: string;
    name: string;
    description: string;
    file_url: string;
    animation_url: string;
    cached_file_url: string;
    cached_animation_url: string;
    creator_address: string;
    metadata: {
        description: string;
        background_color: string;
        external_url: string;
        image: string;
        name: string;
        animation_url: string;
    };
    metadata_url: string;
    contract: {
        name: string;
        symbol: string;
        type: string;
        metadata: {
            description: string;
            thumbnail_url: string;
            cached_thumbnail_url: string;
            banner_url: string;
            cached_banner_url: string;
        };
    };
}
const NFTCard = ({ nft }: Props) => {
    return (
        <div className="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden ">
            <img className="h-56 lg:h-60 w-full object-cover" src={nft.cached_file_url} alt="" />
            <div className="p-3">
                <span className="text-sm text-primary">{nft.contract?.name}</span>
                <h3 className="font-semibold text-xl leading-6 text-gray-700 my-2">
                    {nft.name}
                </h3>
                <p className="paragraph-normal text-gray-600">
                    {nft.description}
                </p>
            </div>
        </div>
    );
};
const Post = () => {
    const router = useRouter()
    const { id } = router.query
    const PAGE_SIZE = 6;
    const socialplatform = ["twitter", "youtube", "discord", "blog", "portfolio", "website"];
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nfts, setNFTs] = useState([]);
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
    useEffect(() => {
        if (domainexists && domainowner) {
            const options = { method: 'GET', headers: { accept: 'application/json', Authorization: process.env.NEXT_PUBLIC_NFTPORT || '' } };
            fetch(`https://api.nftport.xyz/v0/accounts/${domainowner}?chain=polygon&page_size=50&include=metadata`, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    setTotalPages(Math.ceil(response.total / PAGE_SIZE));
                    setNFTs(response.nfts
                    )
                })
                .catch(err => console.error(err));
            setLoading(false);
        }
    }, [domainexists, domainowner]);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentPageData = nfts?.slice(startIndex, endIndex);
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };
    if (!domainexists) {
        return;
    }
    if (loading || !nfts) {
        return (
            <section className="bg-white dark:bg-gray-900">
                <div className="container px-6 py-10 mx-auto animate-pulse">
                    <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700"></h1>

                    <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                    <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 dark:bg-gray-700"></p>

                    <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>

                        <div className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>

                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Edit</title>
            </Head>
            <div className="flex items-center flex-col mx-auto w-full justify-center  px-8 bg-gray-100" >

                <section className=" bg-gray-100 p-8">
                    <h1 className="text-center font-bold text-2xl text-indigo-500">NFT SHOWCASE </h1>

                    <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">
                        {currentPageData && (currentPageData as Nft[]).map((nft: Nft) => (
                            <NFTCard key={nft.token_id} nft={nft} />
                        ))}
                       
                    </div>
                    <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            disabled={currentPage === 1}
                            onClick={handlePrevPage}
                        >
                            Previous
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={currentPage === totalPages}
                            onClick={handleNextPage}
                        >
                            Next
                        </button>
                </section>
            </div>
        </div>
    );
}

export default Post