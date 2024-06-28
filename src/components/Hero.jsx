import { HERO_CONTENT } from '../constants/index'
import profilePic from '../assets/kevinRushProfile.png'

const Hero = () => {
    return (
        <div className="border-b border-neutral-900 pb-4 lg:mb-35">
            <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-2/3">
                    <div className="flex flex-col items-center lg:items-start lg:pl-6">
                        <h1 className="pb-8 text-6xl font-thin tracking-tight lg:mt-16 lg:text-7xl">Aiman Naim</h1>
                        <span className="bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent lg:text-5xl">Full Stack Developer</span>
                        <p className='my-2 max-w-2xl p-6 md:pl-0 md:text-center font-light tracking-tighter lg:text-left'>
                            {HERO_CONTENT}
                        </p>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 lg:p-6 flex justify-center lg:justify-between">
                    <img className=" w-80 h-80 object-cover lg:w-96 lg:h-96" src={profilePic} alt="Aiman Naim" />
                </div>
            </div>
        </div>
    )
}

export default Hero
