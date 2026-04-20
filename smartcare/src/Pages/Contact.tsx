import { assets } from "../assets/assets"


export const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>CONTACT <span className="text-gray-700 font-semibold">US</span></p>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm ">
        <img className="w-full md:max-w-[360px]"  src={assets.contact_image}/>
        <div  className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 items-start">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p>54709 Willms Station <br/>Suite 350, Washington, USA </p>
          <p>Tel: (415) 555‑0132<br/>Email: mk@gmail.com</p>
          <b className="text-lg">Careers at SmartCare</b>
          <p>Learn more about our teams and job openings.</p>
          <button className=" px-8 py-4 border border-black text-sm hover:bg-black hover:text-white ">Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}
