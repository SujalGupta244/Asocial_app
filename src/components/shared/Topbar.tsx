import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queryAndMutation'
import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {


    const {mutate: signOut, isSuccess} = useSignOutAccount() 

    const {user} = useUserContext()
 
    const navigate = useNavigate();

    useEffect(()=>{
        if(isSuccess){
            navigate('/sign-in')
        }
    },[isSuccess])

  return (
    <section className='topbar'>
        <div className="flex-between py-4 px-5">
            <Link to="/"  className='flex gap-3 items-center'>
                <img src="/assets/images/logo_1_removebg.png" title='Asocial' alt="logo" width={130} height={325} />
            </Link>
            <div className="flex gap-4">
                <Button variant="ghost" className='shad-button_ghost' title='Log Out' onClick={() => signOut()}>
                    <img src="/assets/icons/logout.svg" alt="logout" />
                </Button>
                <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                    <img src={user.imageUrl || '/assets/images/profile-provider.svg'} alt="profile" className='h-8 w-8 rounded-full' />
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Topbar