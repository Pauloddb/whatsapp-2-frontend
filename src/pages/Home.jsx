import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const usernameRef = useRef()
    const navigate = useNavigate()

    return (
        <section className='w-screen h-screen flex justify-center items-center'>
            <div className='flex justify-center items-center w-md h-xl/2 gap-4 bg-gray-700 p-8 rounded-full'>
                <input placeholder='Username' type="text" ref={usernameRef} className='text-xl rounded-full bg-gray-600 px-4 py-3 outline-none' />
                <button className='text-xl h-14 w-18 bg-blue-600 hover:opacity-80 rounded-full' onClick={() => navigate(`/chat/${usernameRef.current.value}`)}>Entrar</button>
            </div>
        </section>
    )
}