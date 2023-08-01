import {useState, useMemo} from 'react'

export default function useSorteo(participantes, premios) {
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

  return {ganador, sortear, anterior, siguiente, indicePremio}
}
