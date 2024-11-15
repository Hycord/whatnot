
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {


    return (
        <div className="w-full h-full flex items-center justify-center px-10">
            <span id="confetti" className="absolute -bottom-[5%] left-[50%]" />
            <span className="absolute -top-[75%] left-[50%]" id="hydras" />
            {children}</div>
    )

}