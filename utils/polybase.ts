import { polybase } from "../pages/_app";

export type Attribute = {
  id: string;
  trait_type: string;
  value: string;
};

export async function createNFT(
  name: string,
  description: string,
  image: string,
  address: string,
  domain: string
) {
  if (await checkAvailable(domain) == false) {
    const id = await totalCount();
    const { data } = await polybase
      .collection("Metadata")
      .create([id.toString(), id, name, description, image, address, domain]);

    return { id: data.tokenId };
  } // returns New NFT created ID.
}

export async function AddLinks(id: string, platform: string[], link: string[]) {
  const metadataReference = polybase.collection("Metadata").record(id);

  // Add the created Attribute to the Metadata record
  await metadataReference.call("setMultipleLinks", [platform, link]);
}
export async function RemoveLinks(id: string, platform: string[]) {
  const metadataReference = polybase.collection("Metadata").record(id);

  // Add the created Attribute to the Metadata record
  await metadataReference.call("removeMultipleLinks", [platform]);
}

export async function totalCount() {
  const metadataReference = polybase.collection("Metadata");

  const records = await metadataReference.get();
  const totalCount = records.data.length;
  return totalCount;
}

export async function listRecordsWithFilter(address: string) {
  const metadataReference = polybase.collection("Metadata");
  const records = await metadataReference.where("address", "==", address).get();
  return records.data;
}
export async function checkDomainOwner(address: string,domainname:string) {
  const metadataReference = polybase.collection("Metadata");
  const records = await metadataReference.where("domainname", "==", domainname).get();
  const hasMatchingAddress = records.data.some((item) => item.data.address === address);
  return hasMatchingAddress;
}
export async function checkAvailable(domainname: string) {
  const metadataReference = polybase.collection("Metadata");
  const records = await metadataReference
    .where("domainname", "==", domainname)
    .get();
  if (records.data.length > 0) {
    return true;
  } else {
    return false;
  }
}
export async function fetchDomain(domainname: string) {
  const metadataReference = polybase.collection("Metadata");
  const records = await metadataReference.where("domainname", "==", domainname).get();
  return records.data;
}