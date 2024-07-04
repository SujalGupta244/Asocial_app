import { getCurrentUser } from '@/lib/appwrite/api'
import { IContextType, IUser } from '@/types'
import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

export const INITILA_USESR = {
    id:'',
    name:'',
    username:'',
    email:'',
    imageUrl:'',
    bio:''
}

const INITILA_STATE = {
    user: INITILA_USESR,
    isLoading: false,
    isAuthenticated: false,
    setUser : () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITILA_STATE)


const AuthProvider = ({children}:{children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser>(INITILA_USESR)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    const navigate = useNavigate();

    const checkAuthUser = async() =>{
        try {
            const currentAccount = await getCurrentUser();

            if(currentAccount){
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                })

                setIsAuthenticated(true)
                return true;
            }

            return false;
        } catch (error) {
            console.log(error)
            return false;
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('cookieFallback') === '[]' ||
        localStorage.getItem('cookieFallback') === null
        ){
            navigate('/sign-in')
        }

        checkAuthUser()
    },[])

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export const useUserContext = () => useContext(AuthContext)

export default AuthProvider