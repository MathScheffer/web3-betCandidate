'use client'

import { doLogin } from '@/services/web3services'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const { push } = useRouter()

  const [message, setMessage] = useState()
  const btnLoginClick = () => {
    setMessage('Conectando...')
    doLogin()
      .then((ac) => push('/bet'))
      .catch((err) => {
        console.log(err)
        setMessage(err)
      })
  }
  return (
    <>
      <Head>
        <title>BetCandidate | Login</title>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container ">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-6">
            <img
              src="https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/9398/live/cc183b40-6f58-11ef-9274-898a88078355.png.webp"
              className="d-block mx-lg-auto img-fluid"
              width="700"
              height="500"
            />
          </div>
          <div className="col-6">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              BetCandidate
            </h1>
            <p className="lead">Apostas on-chain das eleições americanas</p>
            <p className="lead">Autentica-se</p>
            <div className="d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 "
                onClick={btnLoginClick}
              >
                <img src="./metamask.svg" width={64} className="me-3" />
                Conectar Metamask
              </button>
            </div>
            <p className="message">{message}</p>
          </div>
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
