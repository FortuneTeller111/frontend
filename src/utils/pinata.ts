import { PinataSDK } from "pinata";
import { NextResponse } from "next/server";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

const getPinataImage = async () => {
  try {
    const { data, contentType } = await pinata.gateways.private.get(
      "bafybeid7njuhc7mry4visjqlgr32jupgj4i2uefwso5rhp3tdpaymaccui"
    );

    console.log("url", data);
    return NextResponse.json({ url: data }, { status: 200 }); // Returns the signed upload URL
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Error creating API Key:" },
      { status: 500 }
    );
  }
};

export { getPinataImage };
