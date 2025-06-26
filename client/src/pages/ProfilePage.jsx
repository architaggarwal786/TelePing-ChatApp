import React, { useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [selectedImg, setSelectedImg] = useState(null);
    const navigate = useNavigate();
    const[name, setName] = useState("martin");
    const[bio, setBio] = useState("Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, cumque.");
    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/');
    }
    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
        <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-200 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
            <form  onSubmit={handleSubmit} className='flex flex-col flex-1 gap-5 p-10'>
                <h3 className='text-lg'>Profile Details </h3>
                <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                    <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png,.jpg,.jpeg' hidden />
                    <img src={selectedImg?URL.createObjectURL(selectedImg):assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
                    upload profile image
                </label>
         
          <input type="text" onChange={(e)=>setName(e.target.value)} value={name} required placeholder='Your Name' className='p-2 border border-gray-500 rounded-md focus:outline:none focud:ring-2 focus:ring-violet-500' name="" id="" />
           
           <textarea name="" id="" required placeholder='Write profile bio' className='p-2 border border-gray-200 rounded-md focus:outline:none focud:ring-2 focus:ring-violet-500' rows={4} onChange={(e)=>setBio(e.target.value)} value={bio}></textarea> 
           <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
           
           </form>
            <img src={assets.logo_icon} className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' alt="" />
        </div>
        </div>
    );
};

export default ProfilePage;