import { Link } from 'react-router-dom'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { ApartmentsGrid } from './components/Apartments'
import { ArrowRight, Bot, Calendar, MessageCircle, Search, Send, X } from 'lucide-react'

interface ChatMessage {
  from: string
  text: string
}

export const LandingPage = () => {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: 'bot',
      text: '¡Hola! Soy tu asistente virtual. ¿Estás buscando un apartamento para alquilar o tienes alguna duda?',
    },
  ])

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setMessages((m) => [
      ...m,
      { from: 'user', text: chatMsg },
      {
        from: 'bot',
        text: 'Entendido. Tenemos apartamentos disponibles en Bogotá, Medellín y Cali desde $1.2M/mes. ¿Cuántas habitaciones necesitas?',
      },
    ])
    setChatMsg('')
  }

  return (
    <div className='min-h-screen bg-background'>
      <section className='relative bg-[#000000] text-white h-screen px-6 overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://wallpapers.com/images/hd/sunset-with-palm-tree-silhouette-ona9bfv5lepgjwse.jpg'
            alt='Atardecer playa en Margarita'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='absolute inset-0 bg-gradient-to-b from-[#000000]/60 to-[#000000]/80' />
        <div className='relative h-full flex flex-col items-center justify-center text-center max-w-7xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-extrabold mb-5 leading-none tracking-tight'>
            Tu lugar vacacional
            <br />
            <span>sin complicaciones.</span>
          </h1>

          <p className='text-white/60 text-lg mb-12 max-w-xl mx-auto leading-relaxed'>
            Encuentra, reserva y gestiona tu apartamento en minutos. Transparencia total, sin
            intermediarios.
          </p>
          <div className='flex flex-col md:flex-row gap-2'>
            <div className='flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-muted min-w-[130px]'>
              <Calendar size={15} className='text-muted-foreground shrink-0' />
              <span className='text-sm text-muted-foreground'>Fecha entrada</span>
            </div>
            <div className='flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-muted min-w-[130px]'>
              <Calendar size={15} className='text-muted-foreground shrink-0' />
              <span className='text-sm text-muted-foreground'>Fecha salida</span>
            </div>
            <Button color='primary'>
              <Search size={15} /> Buscar
            </Button>
          </div>
        </div>
      </section>

      <section className='max-w-6xl mx-auto px-6 py-16'>
        <div className='flex items-end justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold'>Destacados esta semana</h2>
            <p className='text-muted-foreground text-sm mt-1'>Los más buscados en la plataforma</p>
          </div>
          <Link
            to={'/apartments'}
            className='text-sm flex items-center gap-1 font-medium hover:underline transition-all'
            style={{ color: '#2B4FFF' }}
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <ApartmentsGrid />
      </section>

      <div className='fixed bottom-6 right-6 z-50 max-w-2xs'>
        {chatOpen && (
          <div className='rounded-3xl max-w-2xl dark:bg-black/10 bg-white overflow-hidden'>
            <div className='bg-white flex items-center justify-between px-4 py-3 border-b border-border'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-lg flex items-center justify-center'>
                  <Bot size={14} className='text-black' />
                </div>
                <div>
                  <div className='text-xs font-semibold text-black'>Asistente Marvig</div>
                  <div className='flex items-center gap-1 text-black/50 text-[10px]'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-400 inline-block' />
                    En línea
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className='text-black/50 hover:text-black'>
                <X size={15} />
              </button>
            </div>
            <div className='h-52 overflow-y-auto p-3 space-y-2'>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${m.from === 'user' ? 'bg-foreground text-white rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className='px-3 pt-2 pb-1 flex flex-wrap gap-1.5'>
              {['Ver apartamentos', 'Reservar ahora', 'Consultar precios'].map((q) => (
                <button
                  key={q}
                  onClick={() =>
                    setMessages((m) => [
                      ...m,
                      { from: 'user', text: q },
                      {
                        from: 'bot',
                        text: 'Claro, cuéntame tu preferencia de ciudad y presupuesto para ayudarte mejor.',
                      },
                    ])
                  }
                  className='text-[11px] border border-border rounded-full px-2.5 py-1 hover:bg-muted transition bg-card'
                >
                  {q}
                </button>
              ))}
            </div>
            <div className='px-3 pb-3 pt-2 flex gap-2'>
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                className='flex-1 text-xs border border-border rounded-xl px-3 py-2 bg-muted/40 outline-none'
                placeholder='Escribe un mensaje...'
              />
              <button onClick={sendMsg} className='text-white rounded-xl p-2.5 bg-black'>
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen((o) => !o)}
            className='w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-105 active:scale-95'
          >
            <MessageCircle size={22} />
          </button>
        )}
      </div>
    </div>
  )
}
