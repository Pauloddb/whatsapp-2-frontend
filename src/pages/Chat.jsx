import { useEffect, useState, useRef, useCallback } from 'react'
import MessageOptionsPopup from '../components/MessageOptionsPopup'
import socket from '../socket'

const serverUrl = import.meta.env.VITE_SERVER_URL


export default function Chat() {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [message, setMessage] = useState('')
    const [chat, setChat] = useState([])
    const [onlineUsers, setOnlineUsers] = useState(0)
    const [messageOptionsPopup, setMessageOptionsPopup] = useState({
        isVisible: false,
        messageId: null,
        position: { x: 0, y: 0 }
    })

    const inputMsgRef = useRef(null)
    const messagesContainerRef = useRef(null)




    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [])






    const fetchMessages = () => {
        fetch(`${serverUrl}/getMessages`)
            .then(res => res.json())
            .then(data => setChat(data.messages))
            .catch(err => console.error('Erro:', err))
    }


    



    useEffect(() => {
        setIsLoading(true)

        const intervalId = setInterval(() => {
            const storageUsername = localStorage.getItem('username')
            const storagePassword = localStorage.getItem('password')

            if (storageUsername && storagePassword) {
                clearInterval(intervalId)

                setUsername(storageUsername)
                setPassword(storagePassword)

                setIsLoading(false)
            }
        }, 500)

        return () => clearInterval(intervalId)
    }, [])


    


    useEffect(() => {
        if (!username || !password || isLoading) return

        fetchMessages()

        socket.connect()

        const messageHandler = (data) => {
            setChat((prev) => [...prev, data])
        }

        const updateOnlineUsersHandler = (data) => {
            setOnlineUsers(data)
        }

        const deleteMessageHandler = (id) => {
            setChat((prev) => prev.filter(msg => msg.id !== id))
        }

        socket.on('message', messageHandler)
        socket.on('updateOnlineUsers', updateOnlineUsersHandler)
        socket.on('deleteMessage', deleteMessageHandler)

        return () => {
            socket.off('message', messageHandler)
            socket.off('updateOnlineUsers', updateOnlineUsersHandler)
            socket.off('deleteMessage', deleteMessageHandler)

            socket.disconnect()
        }
    }, [username, password, isLoading])


    useEffect(() => {
        scrollToBottom()
    }, [chat, scrollToBottom])




    const sendMessage = () => {
        if (message.trim() === '') return

        socket.emit('message', {
            id: Date.now(),
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




    const handleMessageOptions = (e, messageId) => {
        e.preventDefault()

        setMessageOptionsPopup({
            isVisible: true,
            messageId: messageId,
            position: { x: e.clientX, y: e.clientY }
        })
    }


    const handleMessageOptionsClose = useCallback(() => {
        setMessageOptionsPopup({
            isVisible: false,
            messageId: null,
            position: { x: 0, y: 0 }
        })
    }, [])


    const handleDeleteMessage = useCallback((messageId) => {
        socket.emit('deleteMessage', messageId)
        handleMessageOptionsClose()
    }, [handleMessageOptionsClose])




    if (isLoading) {
        return (
            <div className='w-screen h-screen flex flex-col justify-center items-center bg-gray-900 text-white'>
                <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
                <p className='mt-4 text-xl font-medium'>Carregando...</p>
            </div>
        )
    }


    return (
        <section className='bg-gradient w-screen h-screen' onClick={handleMessageOptionsClose}>
            <header className='z-20 shadow-lg shadow-gray-700/70 p-4 bg-gray-700 mb-2.5 fixed top-0 w-full h-1/10 flex items-center justify-between'>
                <h1 className='text-2xl'>Conta: {username}</h1>
                <h2 className='text-xl'>Online: {onlineUsers}</h2>
            </header>



            <div ref={messagesContainerRef} className='relative w-full top-1/10 overflow-y-scroll scrollbar-chat h-8/10'>
                <ul className='flex flex-col gap-4 p-4'>
                    <MessageOptionsPopup
                        isVisible={messageOptionsPopup.isVisible}
                        messageId={messageOptionsPopup.messageId}
                        position={messageOptionsPopup.position}
                        onDelete={handleDeleteMessage} />

                    {chat.map((data) => (
                        <li key={data.id} className={`flex flex-col ${data.author === username ? 'items-end' : 'items-start'}`}>
                            <p className='opacity-80 text-xs'>{data.author === username ? 'Você' : data.author}</p>
                            <div onClick={handleMessageOptionsClose} onContextMenu={(e) => { if (data.author === username) handleMessageOptions(e, data.id) }} className={` flex flex-col max-w-[350px] min-w-[150px] min-h-6 p-3 ${data.author === username ? 'bg-green-800' : 'bg-gray-200 text-black'} rounded-xl`}>
                                <p className='wrap-break-word'>{data.message}</p>
                                <div className='flex justify-end items-end w-full'>
                                    <p className='opacity-70 text-xs'>{data.date}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>



            <div className='fixed top-9/10 left-1/40 right-1/40 hover:scale-101 transition-all duration-300 shadow-lg shadow-gray-300/20 hover:shadow-gray-300/30 rounded-full w-19/20 h-1/12 bg-gray-800'>
                <div className='relative border border-gray-400 rounded-full w-full h-full flex justify-center items-center'>
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