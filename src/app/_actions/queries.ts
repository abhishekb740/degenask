"use server";

export const getUserData = async (username: string) => {
  const query = `query MyQuery {
        Socials(
        input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${username}"}}, blockchain: ethereum}
        ) {
        Social {
            profileBio
            profileDisplayName
            profileImage
            followingCount
            followerCount
        }
        }
    }`;

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = (await response.json()) as {
    data: {
      Socials: {
        Social: [
          {
            profileBio: string;
            profileDisplayName: string;
            profileImage: string;
            followingCount: number;
            followerCount: number;
          },
        ];
      };
    };
  };

  return data;
};
