import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { sepolia, polygonAmoy } from "wagmi/chains";
import {
  injected,
  walletConnect,
  coinbaseWallet,
} from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const config = createConfig({
  chains: [sepolia, polygonAmoy],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({
      projectId,
      metadata: {
        name: "Fortuner",
        description: "Your App Description",
        url: "https://yourapp.com",
        icons: ["https://yourapp.com/icon.png"],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
});
