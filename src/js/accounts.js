const ethers = require('ethers')

// how much to fund the faucet with each time
const FUND_FAUCET_AMOUNT = ethers.utils.parseEther('9999999')

// how much to fund each service with
const FUND_SERVICE_AMOUNT = ethers.utils.parseEther('9999999')

// how much for throwaway accounts
const FUND_THROWAWAY_AMOUNT = ethers.utils.parseEther('999')

// the names of the accounts in order
const accountNames = [
  'admin',
  'faucet',
  'solver',
  'mediator',
  'resource_provider',
  'job_creator',
]

const getAccount = (accountName) => {
  const privateKeyName = `PRIVATE_KEY_${accountName.toUpperCase()}`
  const privateKeyValue = process.env[privateKeyName]
  const addressName = `ADDRESS_${accountName.toUpperCase()}`
  const addressValue = process.env[addressName]
  if(!privateKeyValue) {
    console.error(`${privateKeyName} is not set in the env`)
    process.exit(1)
  }
  if(!addressValue) {
    console.error(`${addressName} is not set in the env`)
    process.exit(1)
  }
  return {
    address: addressValue,
    privateKey: privateKeyValue,
  }
}

const getWallet = (accountName) => {
  const account = getAccount(accountName)
  return new ethers.Wallet(account.privateKey)
}

const getAccounts = () => {
  const namedAccounts = {}
  const allAccounts = []

  accountNames.forEach(accountName => {
    const account = getAccount(accountName)
    namedAccounts[accountName] = account.address
    allAccounts.push(account.privateKey)
  })

  return {
    namedAccounts,
    allAccounts,
  }
}

module.exports = {
  FUND_FAUCET_AMOUNT,
  FUND_SERVICE_AMOUNT,
  FUND_THROWAWAY_AMOUNT,
  getAccount,
  getAccounts,
  getWallet,
}