import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const serverUrl = import.meta.env.VITE_SERVER_URL

    const usernameRef = useRef()
    const passwordRef = useRef()

    const navigate = useNavigate()

    const usernameRegex = /^[a-zA-Z]{4,19}$/
    const passwordRegex = /^\w{6,20}$/


    const handleEnter = async () => {
        if (!usernameRegex.test(usernameRef.current.value) ||
            !passwordRegex.test(passwordRef.current.value)) {
            alert('Usuário ou senha inválidos!')
            return
        }

        if (passwordRef.current.value === usernameRef.current.value){
            alert('A senha não pode ser igual ao usuário!')
            return
        }
        
        const response = await fetch(`${serverUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: usernameRef.current.value, password: passwordRef.current.value })
        })

        const data = await response.json()

        if (data.status === false){
            alert(data.message)
            navigate('/')
            return
        }


        localStorage.setItem('username', usernameRef.current.value)
        localStorage.setItem('password', passwordRef.current.value)
        
        navigate('/chat')
    }

    

    return (
        <section className='w-screen h-screen flex justify-center items-center bg-gradient'>
            <div className='shadow-lg shadow-gray-400/50 flex flex-col items-center gap-4 w-[500px] h-[400px] p-4 bg-gray-900 border border-white rounded-4xl'>
                <h1 className='text-5xl mt-3 mb-5'>Entrar</h1>

                <input ref={usernameRef} className='text-xl w-4/5 h-14 px-4 outline-none border border-white rounded-full' type="text" placeholder='Usuário' />
                <input ref={passwordRef} className='text-xl w-4/5 h-14 px-4 outline-none border border-white rounded-full' type="password" placeholder='Senha' />

                <button className='relative top-11 text-2xl shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 rounded-full w-4/5 h-14 bg-blue-600 hover:opacity-80 hover:scale-102 transition-all duration-300' onClick={handleEnter}>Entrar</button>
            </div>
        </section>
    )
}