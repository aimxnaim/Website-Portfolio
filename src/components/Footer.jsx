
const Footer = () => {
    return (
        <footer className="border-t border-neutral-900 mt-7">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">An</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">About</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Experiences</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Education</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">Project</a>
                        </li>
                    </ul>
                </div>
                {/* <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" /> */}
                <span className="mt-6 mb-1 block text-sm text-gray-500 sm:text-center dark:text-gray-400">Built and designed by Aiman Naim</span>
                <span className="mb-5 block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024. All Rights Reserved.</span>
            </div>
        </footer>


    )
}

export default Footer