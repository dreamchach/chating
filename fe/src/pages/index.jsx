import React, {useState} from 'react'
import {Link} from 'react-router-dom'

const Index = () => {
    const [nickname, setNickname] = useState('')
    const onchange = (event) => {
        event.preventDefault()
        setNickname(event.target.value)
    }

  return (
    <div className='rounded w-max min-w-fit mx-auto my-16 shadow-2xl'>
        <div className='flex justify-center items-center p-2'>
            <h2 className='font-bold text-2xl text-green-600'>Welcome 대나무숲</h2>
        </div>
        <div className='p-3'>
            <form className='flex gap-3 justify-center items-center'>
                <div>닉네임</div>
                <input className='border rounded p-3' type='text' value={nickname} onChange={onchange} required/>
            </form>
            
                <Link to={`/chat?username=${encodeURIComponent(nickname)}`}>
                    <div className='flex justify-center items-center bg-green-200 rounded p-3 mt-12 font-bold hover:bg-green-300 cursor-pointer'>
                        입장
                    </div>
                </Link> 
            
        </div>
    </div>
  )
}

export default Index