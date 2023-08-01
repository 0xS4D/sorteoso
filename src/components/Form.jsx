import {useState, useMemo} from 'react'
import Huella from '../assets/huella'
import {premios} from '../db/premios'
import {participantes} from '../db/participantes'

export default function Form() {
  const [indicePremio, setIndicePremio] = useState(0)
  const [ganador, setGanador] = useState(null)
  const [historico, setHistorico] = useState([])
  const [listaParticipantes, setListaParticipantes] = useState(participantes)

  const totalTickets = useMemo(() => listaParticipantes.reduce((total, p) => total + p.qty, 0), [listaParticipantes])

  function sortear() {
    const sorteo = Math.floor(Math.random() * totalTickets) + 1
    let acumulador = 0

    for (let i = 0; i < listaParticipantes.length; i++) {
      acumulador += listaParticipantes[i].qty
      if (sorteo <= acumulador) {
        const ganadorActualizado = listaParticipantes[i]
        setGanador(ganadorActualizado)
        setHistorico((prevHistorico) => {
          if (prevHistorico[indicePremio]) {
            const ganadorAnterior = prevHistorico[indicePremio].ganador
            setListaParticipantes((prevParticipantes) => {
              return prevParticipantes.map((participante) => {
                if (participante.id === ganadorAnterior.id) {
                  return {...participante, qty: participante.qty + 1}
                }
                return participante
              })
            })
          }
          const newHistorico = [...prevHistorico]
          newHistorico[indicePremio] = {ganador: ganadorActualizado, premio: premios[indicePremio]}
          return newHistorico
        })
        setListaParticipantes((prevParticipantes) => {
          return prevParticipantes.map((participante) => {
            if (participante.id === ganadorActualizado.id) {
              return {...participante, qty: participante.qty - 1}
            }
            return participante
          })
        })
        break
      }
    }
  }

  function anterior() {
    if (indicePremio > 0) {
      setIndicePremio(indicePremio - 1)
      if (historico[indicePremio - 1]) {
        setGanador(historico[indicePremio - 1].ganador)
      } else {
        setGanador(null)
      }
    }
  }

  function siguiente() {
    if (indicePremio < premios.length - 1) {
      setIndicePremio(indicePremio + 1)
      if (historico[indicePremio + 1]) {
        setGanador(historico[indicePremio + 1].ganador)
      } else {
        setGanador(null)
      }
    }
  }

  return (
    <>
      <div className='relative bg-[#ffffff11] backdrop-blur-md border-[5px] border-orange-500 w-full sm:h-auto sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-3xl px-5 flex flex-col items-center justify-between'>
        <div className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white font-bold p-1 rounded-bl-lg'>
          #{premios[indicePremio].id}
        </div>
        <div className='flex flex-col items-center h-full space-y-2 pt-2'>
          <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl text-white'>Ganador: </h1>
          <p className='font-semibold text-3xl sm:text-4xl md:text-5xl text-orange-300 text-center'>{ganador ? ganador.participante : 'N/A'}</p>
          <h2 className='font-semibold text-2xl sm:text-3xl md:text-4xl text-white'>Premio:</h2>
          <p className='font-medium text-2xl pb-2 sm:text-3xl md:text-4xl text-orange-300 text-center'>{premios[indicePremio].premio}</p>
          <div className='flex flex-col items-end justify-around w-full'>
            <p className='font-medium text-sm sm:text-base md:text-lg text-white'>Gracias a:</p>
            <p className='font-medium text-sm sm:text-base md:text-lg mb-5 text-white'>{premios[indicePremio].auth}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end w-64 pt-3'>
        <button
          className='bg-[#0000008c] backdrop-blur-md border-orange-500 border-2 text-white font-bold w-full flex justify-center items-center h-10 rounded-2xl cursor-pointer hover:bg-orange-500 mb-5'
          onClick={sortear}
        >
          <Huella className='w-7 m-2' color='#fff' /> ¡Sortear!
          <Huella className='w-7 m-2' color='#fff' />
        </button>
        <div className='flex w-full justify-between'>
          <button
            className='bg-[#0000008c] backdrop-blur-md border-orange-500 border-2 text-white font-bold w-44 flex justify-center items-center h-8 rounded-2xl cursor-pointer mr-2'
            onClick={anterior}
          >
            Atrás
          </button>
          <button
            className='bg-[#0000008c] backdrop-blur-md border-orange-500 border-2 text-white font-bold w-44 flex justify-center items-center h-8 rounded-2xl cursor-pointer ml-2'
            onClick={siguiente}
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  )
}
