import mthtimage from "../../../public/images/mtht.webp";
export const mthtLogo = mthtimage;

export const LIVE_BASE_URL = process.env.NEXT_PUBLIC_LIVE_BASE_URL || ''
// export const APPOINTMENT_SERVICE_BASE_URL = 'http://3.138.173.111/appointment';

// when running on server change BASE_URL to server domain
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;
export const UPLOAD_PATH_URL = process.env.NEXT_PUBLIC_UPLOAD_PATH_URL;


export const WALLET_ADDRESS = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
export const ADMIN_WALLET_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS;
export const WALLET_SHARE_LINK = process.env.NEXT_PUBLIC_WALLET_SHARE_LINK;
export const SET_AMOUNT_LINK = process.env.NEXT_PUBLIC_SET_AMOUNT_LINK;

export const QR_CODE_URL = process.env.NEXT_PUBLIC_QR_CODE_URL;
export const RECAPTCHA_SITE_KEY: string = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export const NEXT_APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const BSC_SCAN_LINK = process.env.NEXT_PUBLIC_BSC_SCAN_LINK || "https://bscscan.com/token";

export const WALLET_ADDRESSES = {
  bnb:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_BNB_COMMON ||
    "0xDC318e1ae53DAA019E53815F7E6834a843a1BdBd",
  usdt:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_BNB_COMMON ||
    "0xDC318e1ae53DAA019E53815F7E6834a843a1BdBd",
  mtht:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_BNB_COMMON ||
    "0xDC318e1ae53DAA019E53815F7E6834a843a1BdBd",
  btmeta:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_BNB_COMMON ||
    "0xDC318e1ae53DAA019E53815F7E6834a843a1BdBd",

  btc:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_BTC ||
    "0xDC318e1ae53DAA019E53815F7E6834a843a1BdBd",
  eth:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_ETH ||
    "0x9514972acb299e68f47f8778311d80e6c1b20995",
  trx:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_TRX ||
    "TPZUMJ339epLGa2pHwMYcQjrT46f6tPJiS",
  ada:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_ADA ||
    "0x9514972acb299e68f47f8778311d80e6c1b20995",
  dai:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_DAI ||
    "0x9514972acb299e68f47f8778311d80e6c1b20995",
  pol:
    process.env.NEXT_PUBLIC_WALLET_ADDRESS_POL ||
    "0x9514972acb299e68f47f8778311d80e6c1b20995",
};

// -------------------- WALLET DISPLAY LIST --------------------
export const WALLET_OPTIONS = [
  {
    label: "BNB Wallet",
    key: "bnb",
    walletimg: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  {
    label: "USDT Wallet",
    key: "usdt",
    walletimg: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  { label: "MTHT Wallet", key: "mtht", walletimg: mthtLogo },
  {
    label: "BTMETA Wallet",
    key: "btmeta",
    walletimg: "/images/btcash.webp",
  },

  {
    label: "BTC Wallet",
    key: "btc",
    walletimg: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    label: "ETH Wallet",
    key: "eth",
    walletimg: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    label: "TRX Wallet",
    key: "trx",
    walletimg: "https://cryptologos.cc/logos/tron-trx-logo.png",
  },
  {
    label: "ADA Wallet",
    key: "ada",
    walletimg: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  },
  {
    label: "DAI Wallet",
    key: "dai",
    walletimg: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  },
  {
    label: "POL Wallet",
    key: "pol",
    walletimg: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  },
];


// -------------------- CONTRACT ADDRESS --------------------

export const USDT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS
export const BTCASH_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BTCASH_CONTRACT_ADDRESS
export const MTHT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MTHT_CONTRACT_ADDRESS
export const BNB_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BNB_CONTRACT_ADDRESS