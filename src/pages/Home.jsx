import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const usernameRef = useRef()
    const navigate = useNavigate()

    return (
        <section className='w-screen h-screen flex justify-center items-center'>
            <div className='flex justify-center items-center w-xs h-xl/2 gap-4 bg-gray-700 p-8 rounded-full'>
                <input placeholder='Username' type="text" ref={usernameRef} className='rounded-full bg-gray-600 p-2' />
                <button onClick={() => navigate(`/chat/${usernameRef.current.value}`)}>Enter Chat</button>
            </div>
        </section>
    )
}