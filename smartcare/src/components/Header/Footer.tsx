import LogoIcon from '../../assets/Logo.png'


export const Footer = () => {
  return (
    <div className='md:mx-10 '>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        {/**Left side */}
        <div>
            <img className='mb-2 w-40' src={LogoIcon}/>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>It is easily find doctors and schedule appointments based on availability. It streamlines the healthcare process by providing a simple, user-friendly platform for managing bookings efficiently.</p>
        </div>
         {/**Center */}
        <div>
            <p className='text-xl font-medium mb-5 mt-5'>Company</p>
            <ul className='flex flex-col gap-2 text-gray-600 cursor-pointer'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
         {/**Right side */}
        <div>
            <p className='text-xl font-medium mb-5 mt-5'>Get In Touch</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91-9876543210</li>
                <li>mk@gmail.com</li>
            </ul>
        </div>
    </div>
    {/**Copy right */}
    <div>
        <hr/>
        <p className='py-5 text-center text-sm'>copyright 2026@ Smartcare- All Right Reserved.</p>
    </div>
    </div>
  )
}
