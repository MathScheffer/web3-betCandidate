'use client'

import { claimPrize, getDispute, placeBet } from '@/services/web3services'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Web3 from 'web3'

export default function Bet() {
  const [message, setMessage] = useState()
  //"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg"
  const [dispute, setDispute] = useState({
    candidate1: 'Loading...',
    candidate2: 'Loading...',
    image1:
      'https://therightpathok.org/wp-content/uploads/2019/05/male-silhouette-copy.jpg',
    image2:
      'https://therightpathok.org/wp-content/uploads/2019/05/male-silhouette-copy.jpg',
    total1: 0,
    total2: 0,
    winner: 0,
  })
  const { push } = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('wallet')) push('/')

    getDispute()
      .then((dispute) => {
        setDispute(dispute)
        setMessage('')
      })
      .catch((err) => {
        setMessage(err.message)

        console.log(err.message)
      })
  }, [])

  function processBet(candidate) {
    setMessage('COnfigurando, aguarde..')
    const amount = prompt('Qtd em POL para apostar: ', '1')

    placeBet(candidate, amount)
      .then(() => {
        alert('sua aposta pode demorar um pouco para aparecer no sistema.')
        setMessage('')
      })
      .catch((err) => {
        setMessage(err.message)

        console.log(err.message)
      })
  }

  function claimClick() {
    claimPrize(candidate, amount)
      .then(() => {
        alert('O prêmio pode demorar um pouco para aparecer no sistema.')
        setMessage('')
      })
      .catch((err) => {
        setMessage(err.message)

        console.log(err.message)
      })
  }
  return (
    <>
      <Head>
        <title>BetCandidate | Bet</title>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container ">
        <div className="row align-items-center">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
            BetCandidate
          </h1>
          <p className="lead">Apostas on-chain das eleições americanas</p>
          {dispute.winner == 0 ? (
            <p className="lead">
              Você tem até o dia da eleição para fazer sua aposta.
            </p>
          ) : (
            <p className="lead">
              Disputa encerrada: Veja o vencedor e solicite seu premio.
            </p>
          )}
        </div>
        <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
          <div className="col"></div>
          {dispute.winner == 0 ||
            (dispute.winner == 1 && (
              <div className="col">
                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                  {dispute.candidate1}
                </h3>
                <img
                  src={dispute.image1}
                  className="d-block mx-auto img-fluid rounded"
                  width={250}
                />
                {dispute.winner == 1 ? (
                  <button
                    onClick={() => claimClick()}
                    className="btn btn-primary p-3 my-2 d-block mx-auto"
                    style={{ width: 250 }}
                  >
                    pegar meu prêmio
                  </button>
                ) : (
                  <button
                    onClick={() => processBet(1)}
                    className="btn btn-primary p-3 my-2 d-block mx-auto"
                    style={{ width: 250 }}
                  >
                    Apostar neste candidato
                  </button>
                )}

                <span
                  className="badge text-bg-secondary d-block mx-auto"
                  style={{ width: 250 }}
                >
                  Total: {Web3.utils.fromWei(dispute.total1, 'ether')}
                </span>
              </div>
            ))}

          <div className="col">
            <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
              {dispute.candidate2}
            </h3>
            <img
              src={dispute.image2}
              className="d-block mx-auto img-fluid rounded"
              width={250}
            />
            {dispute.winner == 2 ? (
              <button
                onClick={() => claimClick()}
                className="btn btn-primary p-3 my-2 d-block mx-auto"
                style={{ width: 250 }}
              >
                Pegar meu prêmio
              </button>
            ) : (
              <button
                onClick={() => processBet(2)}
                className="btn btn-primary p-3 my-2 d-block mx-auto"
                style={{ width: 250 }}
              >
                Apostar neste candidato
              </button>
            )}

            <span
              className="badge text-bg-secondary d-block mx-auto"
              style={{ width: 250 }}
            >
              Total: {Web3.utils.fromWei(dispute.total2, 'ether')}
            </span>
          </div>
        </div>
        <div className="row row-align-items-center">
          <p className="message">{message}</p>
        </div>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3  my-4 border-top">
          <p className="col-4 mb-0 text-body-secondary">
            &copy; 2024 BetCandidate
          </p>
          <ul className="nav col-4 justify-content-end">
            <li className="nav-item">
              <a href="/" className="nav-link px-2 text-body-secondary">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link px-2 text-body-secondary">
                Sobre
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  )
}
