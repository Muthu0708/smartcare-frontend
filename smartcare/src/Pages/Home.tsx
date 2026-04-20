import { Banner } from "../components/Header/Banner"
import { Header } from "../components/Header/Header"
import { SpecialityMenu } from "../components/Header/SpecialityMenu"
import { TopDoctors } from "../components/Header/TopDoctors"


export const Home = () => {
  return (
    <div className="mt-5">
      <Header/>
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/> 
    </div>
  )
}
