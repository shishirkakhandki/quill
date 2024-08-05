# Upgradable Smart Contracts with Exploit Detection and Prevention

## Description

This project demonstrates the implementation of upgradable smart contracts with a known vulnerability, along with a suite of microservices for exploit detection & front-running attacks, workflow management, email notifications, and report storage. The system includes one upgradable contracts (facets) with Diamond Proxy Pattern and four microservices to manage various aspects of contract interaction and security.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Upgradable Contracts](#upgradable-contracts)
4. [Microservices](#microservices)
5. [Setup and Installation](#setup-and-installation)
6. [Usage](#usage)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- Yarn package manager
- Redis
- MongoDB
- Mailgun account (for email notifications)
- Ethereum wallet with Sepolia testnet ETH

## Project Structure

The project is divided into two main directories:

- `upgradable-contracts/`: Contains Diamond Proxy contracts and Hardhat configuration
- `microservices/`: Contains the four microservices for various functionalities

## Upgradable Contracts

The project includes a set of upgradable smart contracts using the Diamond Proxy Pattern (refer: `https://github.com/mudgen/diamond-2-hardhat`):

### upgradable-contracts/

1. `DepositFacet.sol`: Facet for deposit functionality
2. `WithdrawFacet.sol`: Facet for withdraw functionality
3. `PauseFacet.sol`: Facet for pause functionality
4. `WithdrawFacetV2.sol`: Upgraded version of the Withdraw Facet

The scripts provided for deploying and upgrading contracts are:

1. `deploy.js`: Script to deploy the initial Diamond Proxy contract with facets
2. `upgradeWithdrawFacet.js`: Script to upgrade the Withdraw Facet

## Microservices

1. **Exploit Detection Service and Front-running Service**: Monitors the blockchain for potential exploits and attempts to front-run suspicious transactions
2. **Workflow Service**: Manages the overall process flow
3. **Notification Service**: Sends email notifications using Mailgun
4. **Reporting Service**: Stores and manages detailed reports in MongoDB

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/shishirkakhandki/quill.git
cd quill
```

### Upgradable Contracts Setup

```bash
cd upgradable-contracts
cp .env.example .env
# Edit .env with your configuration
yarn install
```

### Microservices Setup

For each microservice in the microservices/ directory:

```bash
cd microservices/<service-name>
cp .env.example .env
# Edit .env with your configuration
yarn install
```

### Usage

#### Deploying Contracts

To deploy the initial Diamond Proxy contract with facets:

```bash
cd upgradable-contracts
npx hardhat run scripts/deploy.js --network sepolia
```

To upgrade the Withdraw Facet and verify the upgrade:

```bash
npx hardhat run scripts/upgradeWithdrawFacet.js --network sepolia
```

#### Running Microservices

For each microservice:

```bash
cd microservices/<service-name>
yarn start:dev
```

#### Deployment

1. Deploy the smart contracts to Sepolia testnet using the provided scripts.
2. Update the .env files in each microservice with the deployed contract address.
3. Start each microservice using `yarn start:dev`

### Contributing

Contributions are welcome. Please fork the repository and create a pull request with your changes.

### License

MIT License





