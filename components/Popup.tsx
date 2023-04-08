import Link from "next/link"

type PopupProps = {
    isOpen: boolean,
    domain: string,
    onClose: () => void
}
const Popup = ({ isOpen, domain, onClose }: PopupProps) => {
    return (
        <>
            {isOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center">
                    <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
                        <div className="z-20 bg-white rounded-lg overflow-hidden shadow-md transform transition-all sm:max-w-lg sm:w-full">
                            <section className="rounded-3xl shadow-2xl">
                                <div className="p-8 text-center sm:p-12">
                                    <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                                        Your Domain Has been Minted
                                    </p>

                                    <h2 className="mt-6 text-3xl font-bold">
                                        Thanks for your purchase, we're getting it ready!
                                    </h2>

                                    <a className="mt-8 inline-block w-full rounded-full bg-pink-600 py-4 text-sm font-bold text-white shadow-xl"
                                        >
                                            <Link href={`/tree/${domain}`}>
                                        View Domain
                                        </Link>
                                    </a>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Popup
