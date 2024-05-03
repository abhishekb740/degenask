"use client";
import {
    useLogin,
    useLogout,
    usePrivy,
    useWallets,
} from "@privy-io/react-auth";

const Profile = ({ params: { username } }) => {
    const { ready, authenticated, user, createWallet } = usePrivy();
    console.log(user?.farcaster);

    return (
        <div className="flex justify-center items-center pt-24 m-4">
            <div className="bg-[white]  min-h-[30rem] p-8 h-full w-full sm:h-2/3 sm:w-1/3">
                <div className="flex-col">
                    <div className="flex gap-6">
                        <img
                            src={user?.farcaster?.pfp!}
                            alt="icon"
                            className="w-20 h-20 rounded-full"
                        />
                        <div className="flex-col gap-8">
                            <div className="flex-col">
                                <div className="font-bold">
                                    {user?.farcaster?.displayName}
                                </div>
                                <div className="text-[#9259EF]">
                                    @{user?.farcaster?.username}
                                </div>
                            </div>
                            <div>
                                {user?.farcaster?.bio}
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex-col">
                                    <div className="font-bold">
                                        800
                                    </div>
                                    <div>
                                        Following
                                    </div>
                                </div>
                                <div className="flex-col">
                                    <div  className="font-bold">
                                        1000
                                    </div>
                                    <div>
                                        Followers
                                    </div>
                                </div>
                                <div>
                                    Pune, India
                                </div>

                            </div>

                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Profile;