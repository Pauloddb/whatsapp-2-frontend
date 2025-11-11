import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const serverUrl = import.meta.env.VITE_SERVER_URL

    const usernameRef = useRef()
    const passwordRef = useRef()

    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const usernameRegex = new RegExp(import.meta.env.VITE_USERNAME_REGEX)
    const passwordRegex = new RegExp(import.meta.env.VITE_PASSWORD_REGEX)


    const handleEnter = async () => {
        if (!usernameRegex.test(usernameRef.current.value) ||
            !passwordRegex.test(passwordRef.current.value)) {
            alert('Usuário ou senha inválidos!')
            return
        }

        if (passwordRef.current.value === usernameRef.current.value) {
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

        if (data.status === false) {
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

                <div className='w-4/5 h-14 border border-white rounded-full flex'>
                    <input ref={passwordRef} className='text-xl w-7/8 h-full px-4 outline-none rounded-l-full' type={showPassword ? 'text' : 'password'} placeholder='Senha' />

                    <button onClick={() => setShowPassword(prev => !prev)} className='rounded-r-full w-1/8 flex justify-center items-center'>
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </button>
                </div>

                <button className='relative top-11 text-2xl shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 rounded-full w-4/5 h-14 bg-blue-600 hover:opacity-80 hover:scale-102 transition-all duration-300' onClick={handleEnter}>Entrar</button>
            </div>
        </section>
    )
}