import axios from "axios";
import { useCallback, useState } from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router";
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'

import Image from "next/image";
import Logo from "../public/images/vetrin.webp"
import Input from "@/components/Input";

const Auth = () => {
    const router = useRouter();
    
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    }, [])

    const login = useCallback(async () => {
        try {
            await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/'
            });

            router.push('/');
        } catch(error) {
            console.log(error);
        }
    }, [email, password, router])

    const register = useCallback(async() => {
        try {
            await axios.post('/api/registrar', {
                email,
                name,
                password
            });

            login();
        } catch (error) {
            console.log(error)
        }
    }, [email, name, password, login])
    
    return (
        <div className="relative h-full w-full bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <Image
                        src={Logo}
                        alt="Vetrin Logo"
                        className="h-12 w-auto m-auto"
                    />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 max-w-md rounded-2xl w-full border border-neutral-800">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Entrar' : 'Nova conta'}
                        </h2>
                        <div className="flex flex-col gap-4">
                        <div className="h-1 bg-gradient-to-r from-neutral-900 to-yellow-300"></div>
                            {
                                variant === 'register' && (
                                    <Input id="name" label="Nome" type="email" value={name} onChange={(event: any) => setName(event.target.value)}/>
                                )
                            }
                            <Input id="email" label="Email" type="email" value={email} onChange={(event: any) => setEmail(event.target.value)}/>
                            <Input id="password" label="Senha" type="password" value={password} onChange={(event: any) => setPassword(event.target.value)}/>
                        </div>
                        <button onClick={variant === 'login' ? login : register} className="bg-yellow-300 py-3 text-neutral-900 font-bold rounded-md w-full mt-10 hover:bg-amber-300">
                            {variant === 'login' ? 'Acessar conta' : 'Cadastrar agora'}
                        </button>
                        <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                            <div onClick={() => signIn('google')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                <FcGoogle size={30}/>
                            </div>
                            <div onClick={() => signIn('github', { callbackUrl: '/'})} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                <BsGithub size={30}/>
                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12 text-sm">
                            {variant === 'login' ? 'Primeira vez acessando a Vetrin?' : 'Já possui cadastro na Vetrin?'}
                            <span className="text-white ml-1 hover:underline cursor-pointer" onClick={toggleVariant}>
                                {variant === 'login' ? 'Criar uma conta' : "Acessar conta"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;