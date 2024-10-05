import Web3 from 'web3'
import ABI from './ABI.json'
const CONTRACT_ADDRESS = '0xbcc472a16be381327f3387f7ed48b622522d5863'

export async function doLogin() {
  //Metamask injeta um objeto no navegador chamado ethereum
  if (!window.ethereum) throw new Error('Metamask não está instalada!')

  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.requestAccounts()

  //se o usua´rio não autorizou
  if (!accounts || !accounts.length) throw new Error('Usuário não autorizou')
  localStorage.setItem('wallet', accounts[0])
}

function getCotract() {
  if (!window.ethereum) throw new Error('Metamask não está instalada!')
  const from = window.localStorage.getItem('wallet')
  const web3 = new Web3(window.ethereum)

  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from })
}

export async function getDispute() {
  const contract = getCotract()
  return contract.methods.dispute().call()
}

export async function placeBet(candidate, amount) {
  const contract = getCotract()
  return contract.methods.bet().send({
    value: Web3.utils.toWei(amount, 'ether'),
  })
}

export async function finish(winner) {
  const contract = getCotract()
  return contract.methods.finish(winner).send()
}

export async function claimPrize() {
  const contract = getCotract()
  return contract.methods.claim().send()
}
