// Programmatic download of the resume PDF from /public. Used by the
// taskbar's RESUME button and by the terminal's `resume` command.
export const downloadResume = () => {
    const link = document.createElement("a")
    link.href = "/Aiman_Naim_Resume.pdf"
    link.download = "Aiman_Naim_Resume.pdf"
    link.click()
}
