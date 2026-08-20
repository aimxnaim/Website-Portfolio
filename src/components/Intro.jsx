import { ABOUT_TEXT } from "../constants"

const Intro = () => (
    <section className="max-w-[1120px] mx-auto px-6 pt-[60px] pb-10">
        <div className="text-center max-w-[700px] mx-auto">
            <p className="font-sans text-base text-term-muted">{ABOUT_TEXT}</p>
        </div>
    </section>
)

export default Intro
