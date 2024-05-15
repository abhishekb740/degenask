/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import Layout from "../layout";

const Headshot = dynamic(() => import("@/components/shared/headsot"), {
  loading: () => null,
});

export default function SetupProfile() {
  const router = useRouter();
  //   const [searchQuery, setSearchQuery] = useState<string>("");
  //   const feed = useAtomValue(feedAtom);
  //   const setFeed = useSetAtom(feedAtom);
  //   const profileData = useAtomValue(userAtom);
  //   const setUser = useSetAtom(userAtom);
  //   const headshotData = useAtomValue(headshotAtom);
  //   const setHeadshot = useSetAtom(headshotAtom);
  //   const questionsData = useAtomValue(questionsAtom);
  //   const setQuestions = useSetAtom(questionsAtom);
  //   const { username, address, price, count } = profile;
  const { user: fcUser } = usePrivy();

  if (!fcUser?.farcaster?.username) {
    router.push("/");
  }

  //   init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);
  //   const query = `query MyQuery {
  //     Socials(
  //       input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${username}"}}, blockchain: ethereum}
  //     ) {
  //       Social {
  //         profileBio
  //         profileDisplayName
  //         profileImage
  //         followerCount
  //       }
  //     }
  //   }`;

  //   const { data, loading } = useQuery(query);

  //   useEffect(() => {
  //     if (data) {
  //       setHeadshot({
  //         username,
  //         name: data.Socials.Social[0].profileDisplayName,
  //         bio: data.Socials.Social[0].profileBio,
  //         followers: data.Socials.Social[0].followerCount,
  //         image: data.Socials.Social[0].profileImage,
  //         count,
  //       });
  //     }
  //   }, [data, loading, username, count]);

  //   useEffect(() => {
  //     if (address === null || price === null) {
  //       if (username === fcUser?.farcaster?.username) {
  //         setFeed("setup");
  //       }
  //     } else {
  //       setFeed("feed");
  //     }
  //   }, [address, price]);

  //   useEffect(() => {
  //     setUser({ user: profile });
  //     setQuestions(questions);
  //   }, [profile, questions]);

  return (
    <Layout>
      <div className="relative bg-white p-4 md:p-8 w-full sm:w-2/3 lg:w-2/4 font-primary rounded-3xl shadow-xl"></div>
    </Layout>
  );
}
