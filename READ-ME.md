# Upgradable Smart Contracts with Exploit Detection and Prevention

## Description

This project demonstrates the implementation of upgradable smart contracts with a known vulnerability, along with a suite of microservices for exploit detection, workflow management, front-running attacks, email notifications, and report storage. The system includes two upgradable contracts, with one containing a vulnerability, and five microservices to manage various aspects of contract interaction and security.

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

- `upgradable-contracts/`: Contains the Solidity smart contracts and Hardhat configuration
- `microservices/`: Contains the five microservices for various functionalities

## Upgradable Contracts

The project includes two upgradable smart contracts:

1. `MyVulnerableContractV1`: Initial version with a known vulnerability
2. `MyVulnerableContractV2`: Upgraded version with the vulnerability fixed

## Microservices

1. **Exploit Detection Service**: Monitors the blockchain for potential exploit attempts
2. **Workflow Service**: Manages the overall process flow
3. **Notification Service**: Sends email notifications using Mailgun
4. **Front-running Service**: Attempts to front-run suspicious transactions
5. **Reporting Service**: Stores and manages detailed reports in MongoDB

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

To deploy the initial vulnerable contract:

```bash
cd upgradable-contracts
npx hardhat run scripts/deploy_v1.js --network sepolia
```

To upgrade the contract:

```bash
npx hardhat run scripts/upgrade_to_v2.js --network sepolia
```
#### Running Microservices

For each microservice:

```bash
cd microservices/<service-name>
yarn start:dev
```

#### Testing

To run tests for the smart contracts:

```bash
cd upgradable-contracts
npx hardhat test
```

#### Deployment

1. Deploy the smart contracts to Sepolia testnet using the provided scripts.
2. Update the .env files in each microservice with the deployed contract address.
3. Start each microservice using yarn start:dev.

### Contributing

Contributions are welcome. Please fork the repository and create a pull request with your changes.

### License

MIT License




