// Network configurations
export const devnetNetwork = {
  version: "testnet",
  chainId: 2147483648,
  coreApiUrl: "http://localhost:3999",
  bnsLookupUrl: "http://localhost:3999",
  broadcastEndpoint: "/v2/transactions",
  transferFeeEstimateEndpoint: "/v2/fees/transfer",
  accountEndpoint: "/v2/accounts",
  contractAbiEndpoint: "/v2/contracts/interface",
  readOnlyFunctionCallEndpoint: "/v2/contracts/call-read",
  isMainnet: () => false,
};

// Contract configurations
export const SBTC_CONTRACTS = {
  registry: {
    address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    name: "sbtc-registry",
  },
  token: {
    address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    name: "sbtc-token",
  },
  bridge: {
    address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    name: "sbtc-bridge",
  },
} as const;

export interface ContractFunction {
  name: string;
  access: string;
  args: Array<{ name: string; type: string }>;
  outputs: { type: string };
}

export interface ContractInterface {
  functions: ContractFunction[];
  variables: Array<{ name: string; type: string }>;
  maps: Array<{ name: string; key: string; value: string }>;
}

export interface SbtcContracts {
  registry: {
    address: string;
    name: string;
  };
  // Add other contract definitions as needed
}

export const verifyContractDeployment = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `/api/stx/v2/contracts/interface/${SBTC_CONTRACTS.registry.address}.${SBTC_CONTRACTS.registry.name}`
    );

    if (!response.ok) {
      console.error("Contract not deployed or not accessible");
      return false;
    }

    const contractInfo = (await response.json()) as ContractInterface;
    const hasBridgeFunction = contractInfo.functions.some(
      (f) => f.name === "get-bitcoin-wallet"
    );

    if (!hasBridgeFunction) {
      console.error("Contract missing required function");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying contract deployment:", error);
    return false;
  }
};

export const getBridgeAddress = async () => {
  try {
    const response = await fetch("/api/stx/v2/contracts/call-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: SBTC_CONTRACTS.registry.address,
        arguments: [],
        contract_address: SBTC_CONTRACTS.registry.address,
        contract_name: SBTC_CONTRACTS.registry.name,
        function_name: "get-bitcoin-wallet",
        network: "testnet",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bridge contract call failed:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Bridge response data:", data);

    if (data && data.result && data.result.value) {
      return data.result.value;
    }

    throw new Error("No bridge address returned or incorrect type");
  } catch (error) {
    console.error("Error fetching bridge address:", error);
    throw error;
  }
};

export const debugContractCall = async () => {
  try {
    const contractInfoResponse = await fetch(
      `/api/stx/v2/contracts/interface/${SBTC_CONTRACTS.registry.address}.${SBTC_CONTRACTS.registry.name}`
    );

    if (!contractInfoResponse.ok) {
      console.error("Contract not found or not accessible");
      return;
    }

    const contractInfo = await contractInfoResponse.json();
    console.log("Contract interface:", contractInfo);

    const response = await getBridgeAddress();
    console.log("Bridge address retrieved:", response);
  } catch (error) {
    console.error("Debug contract call failed:", error);
  }
};
