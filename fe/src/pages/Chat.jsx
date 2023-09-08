import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

const Chat = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [nickname, setNickname] = useState('')
    const [inputValue, setInputValue] = useState('')
    const onchange = (event) => {
        setInputValue(event.target.value)
    }

    localStorage.setItem('nickname', decodeURIComponent(location.search.substring(10)))

    useEffect(() => {
        if(location.search.substring(10) === '') {
            navigate('/')
        }else {
            if(localStorage.getItem('nickname')) {
                setNickname(localStorage.getItem('nickname'))
            }else {
                localStorage.setItem('nickname', decodeURIComponent(location.search.substring(10)))
                setNickname(decodeURIComponent(location.search.substring(10)))
            }
        }
    }, [])
    
  return (
    <div className='flex mx-3 max-h-screen h-screen'>
        <div className='w-1/3 h-full flex items-center flex-col min-w-fit'>
            <div className='mt-3 font-bold border-4 rounded-2xl border-green-600 w-full flex justify-center p-5'>
                <span>내 닉네임 : </span>
                <span>{nickname}</span>
            </div>
            <div className='flex flex-col h-full w-full'>
                <div className='font-bold border-4 border-green-600 w-full rounded-2xl mt-3 flex justify-center p-3'>참가자</div>
                <div className='h-full bg-green-100 rounded-2xl flex p-3 flex-col items-center'>
                    참가자 이름들
                </div>
            </div>
        </div>
        <div className='w-2/3 h-full flex items-center flex-col'>
            <div className='mt-3 font-bold border-4 rounded-2xl border-green-600 w-full flex justify-cenrer p-5 ml-3'>
                <span>대화 상대 : </span> 
            </div>
            <div className='h-full border-4 rounded-2xl border-green-600 flex p-3 flex-col items-center w-full mt-3 ml-3'>
                대화 창
            </div>
            <div className='w-full ml-3'>
                <input className='p-4 border-4 border-green-600 rounded-2xl mt-3 w-4/5' type='text' value={inputValue} onChange={onchange}/>
                <button className='p-4 bg-green-600 rounded-2xl mt-3 w-1/6 ml-1 font-bold hover:bg-green-700 hover:text-white'>입력</button>
            </div>
        </div>

    </div>
  )
}

export default Chat