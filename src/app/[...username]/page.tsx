"use client";
import {
    useLogin,
    useLogout,
    usePrivy,
    useWallets,
} from "@privy-io/react-auth";
import Logo from "../components/Logo";
import DegenLogo from "../../../public/assets/DegenLogo.png";
import FarcasterLogo from "../../../public/assets/FarcasterLogo.png";
import CopyLogo from "../../../public/assets/CopyLogo.png";
import Button from "../components/Button";

const Profile = ({ params: { username } }) => {
    const { ready, authenticated, user, createWallet } = usePrivy();
    console.log(user?.farcaster);

    return (
        <div className="flex justify-center items-center pt-20 m-4">
            <div className="bg-[white]  min-h-[30rem] p-8 h-full w-full lg:h-2/3 lg:w-1/3 rounded-lg">
                <div className="flex-col">
                    <div className="flex gap-6">
                        <img
                            src={user?.farcaster?.pfp!}
                            alt="icon"
                            className="w-20 h-20 rounded-full"
                        />
                        <div className="flex-col" style={{ gap: '2rem' }}>
                            <div className="flex-col mb-4">
                                <div className="font-bold text-xl">
                                    {user?.farcaster?.displayName}
                                </div>
                                <div className="text-[#9259EF]">
                                    @{user?.farcaster?.username}
                                </div>
                            </div>
                            <div className="mb-4">
                                {user?.farcaster?.bio}
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex-col justify-center items-center">
                                    <div className="font-bold text-center">
                                        800
                                    </div>
                                    <div>
                                        Following
                                    </div>
                                </div>
                                <div className="flex-col">
                                    <div className="font-bold text-center">
                                        1000
                                    </div>
                                    <div>
                                        Followers
                                    </div>
                                </div>
                                <div className="">
                                    Pune, India
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-6">
                        <div>
                            Minimum Ask
                        </div>
                        <button className="text-[#009DF5]" >
                            Set Price
                        </button>
                    </div>
                    <div className="flex justify-between px-4 mb-4">
                        <div className="text-[#818898]">
                            0 DEGEN
                        </div>
                        <div className="flex items-center">
                            <Logo src={DegenLogo} height={25} width={25} />
                            <select id="degen-logo" className="" >
                                <option>Degen</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex mb-32">
                    <input className="w-full rounded-md p-2" style={{ border: '1px solid black' }} placeholder="Search Users" />
                </div>
                <div className="flex justify-between p-2 w-full">
                    <div >
                        <button className={`flex bg-[#6537B1] p-1.5 text-[white] justify-evenly items-center gap-2 rounded-md`}>
                            <Logo src={FarcasterLogo} height={20} width={20} />
                            <div className='font-medium md:text-sm lg:text-lg xl:text-sm'>
                                Share on Warpcast
                            </div>
                        </button>
                    </div>
                    <div >
                        <button className={`flex bg-[white] p-1.5 text-[#545454] justify-evenly items-center gap-2 rounded-md`}>
                            <div style={{border: '1px solid #545454'}} >
                                <Logo src={CopyLogo} height={20} width={20} />
                            </div>
                            <div className='font-medium md:text-sm lg:text-lg xl:text-sm'>
                                Copy Link
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;