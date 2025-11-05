import { io } from 'socket.io-client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

const socket = io('http://localhost:3000')


export default function Chat() {
    const { username } = useParams()

    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])

    const inputMsgRef = useRef()

    useEffect(() => {
        socket.emit('getMessages', (response) => {
            setChat(response)
        })

        const messageHandler = (data) => {
            setChat((prev) => [...prev, data])
        }

        socket.on('message', messageHandler)

        return () => socket.off('message', messageHandler)
    }, [])





    const sendMessage = () => {
        if (message.trim() === '') return

        socket.emit('message', {
            author: username,
            message: message,
            date: `${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`
        })

        inputMsgRef.current.value = ''
        setMessage('')
    }



    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && message.trim() !== '') {
            sendMessage()
        }
    }


    return (
        <section className='bg-black w-screen h-screen'>
            <header className='p-4 bg-gray-700 mb-2.5 fixed top-0 w-full h-1/10 flex items-center'>
                <h1 className='text-2xl'>Conta: {username}</h1>
            </header>


            <div className='relative w-full top-1/10 overflow-y-scroll scrollbar-chat h-8/10'>
                <ul className='flex flex-col gap-4 p-4'>
                    {chat.map((data, index) => (
                        <li key={index} className={`flex flex-col ${data.author === username ? 'items-end' : 'items-start'}`}>
                            <p className='opacity-80 text-xs'>{data.author === username ? 'Você' : data.author}</p>
                            <div className={` flex flex-col max-w-[350px] min-w-[150px] min-h-6 p-3 ${data.author === username ? 'bg-green-800' : 'bg-gray-200 text-black'} rounded-xl`}>
                                <p className='wrap-break-word'>{data.message}</p>
                                <div className='flex justify-end items-end w-full'>
                                    <p className='opacity-70 text-xs'>{data.date}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


            <div className='fixed top-9/10 left-1/40 right-1/40 rounded-full w-19/20 h-1/12 bg-gray-800'>
                <div className='relative w-full h-full flex justify-center items-center'>
                    <input ref={inputMsgRef} placeholder='Digite sua mensagem...' type="text" onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)} className='outline-none w-19/20 h-full absolute left-0 px-4' />

                    <button onClick={sendMessage} className={` bg-blue-600 ${message.trim() === '' ? 'opacity-50' : ''} w-10 h-10 rounded-full absolute right-2 flex justify-center items-center`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}