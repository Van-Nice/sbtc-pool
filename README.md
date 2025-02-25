# sBTC Pool - Decentralized Bitcoin Pooling Solution

## Project Overview

sBTC Pool is a decentralized application that enables Bitcoin holders to collectively participate in the sBTC ecosystem through pooled contributions. This solution addresses the need for smaller Bitcoin holders to access DeFi opportunities while maintaining security and transparency.

## Core Features

### 1. Wallet Integration
- Secure wallet connection using TOML-based configuration
- Support for both Bitcoin and Stacks addresses
- Real-time balance tracking for BTC, STX, and sBTC
- QR code generation for easy deposits

### 2. Bridging Interface
- Seamless BTC to sBTC conversion
- Real-time transaction monitoring
- Progress tracking with confirmation counts
- Automatic balance updates post-bridging

### 3. Pool Management
- Transparent contribution tracking
- Individual share calculation
- Pool status monitoring
- Historical contribution viewing

## Technical Architecture

### Frontend Components
```typescript
// Key components structure
- app/
  ├── contribute/     # Contribution interface
  ├── profile/       # User profile management
  ├── contexts/      # Global state management
  ├── services/      # Core services
  └── utils/         # Utility functions
```

### Core Services

1. **Pool Service**
```typescript
interface PoolStatus {
  totalAmount: number;
  status: string;
  contributions: Array<{
    address: string;
    amount: number;
    timestamp: number;
  }>;
}
```

2. **Wallet Context**
```typescript
interface WalletInfo {
  btcAddress: string;
  stacksAddress: string;
  btcBalance: number;
  stxBalance: number;
  sBTCBalance: number;
}
```

3. **Bridge Integration**
```typescript
interface BridgingState {
  status: "idle" | "pending" | "confirming" | "completed" | "failed";
  txId?: string;
  confirmations?: number;
  error?: string;
}
```

## User Flow

1. **Wallet Connection**
   - Upload TOML configuration file
   - Automatic address derivation
   - Balance fetching
   - Connection status verification

2. **Contributing to Pool**
   - View current pool status
   - Enter contribution amount
   - Scan QR code or copy bridge address
   - Monitor transaction status
   - Receive confirmation

3. **Managing Position**
   - View contribution history
   - Track individual share
   - Monitor pool performance
   - Access transaction records

## Security Features

1. **Wallet Security**
   - Local key derivation
   - No private key storage
   - Secure configuration handling

2. **Transaction Safety**
   - Multi-step confirmation process
   - Real-time validation
   - Error handling and recovery
   - Transaction monitoring

3. **Data Protection**
   - Encrypted communication
   - Secure API endpoints
   - Rate limiting
   - Input validation

## Integration with sBTC

The project leverages sBTC's unique properties:

1. **Decentralized Security**
   - Utilizes sBTC's decentralized signer network
   - Maintains Bitcoin's security guarantees
   - No single point of failure

2. **Bitcoin Finality**
   - Direct Bitcoin blockchain integration
   - Real Bitcoin transactions
   - Verifiable on-chain state

3. **Yield Opportunities**
   - Access to Stacks DeFi ecosystem
   - Potential for yield generation
   - Participation in larger pools

## Development Setup

1. **Prerequisites**
   ```bash
   - Node.js 16+
   - Bitcoin Core (for local development)
   - Stacks API
   ```

2. **Environment Configuration**
   ```typescript
   // Network configurations
   const devnetNetwork = {
     version: "testnet",
     chainId: 2147483648,
     coreApiUrl: "http://localhost:3999"
   };
   ```

3. **Contract Integration**
   ```typescript
   const SBTC_CONTRACTS = {
     registry: {
       address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
       name: "sbtc-registry"
     }
   };
   ```

## Future Enhancements

1. **Enhanced Pool Features**
   - Automated yield strategies
   - Multiple pool types
   - Advanced analytics

2. **User Experience**
   - Mobile optimization
   - Simplified onboarding
   - Educational content

3. **Technical Improvements**
   - Additional wallet support
   - Enhanced error handling
   - Performance optimizations

## Contributing

The project welcomes contributions in the following areas:
- Feature enhancements
- Bug fixes
- Documentation improvements
- Testing improvements

## License

MIT
