import Footer from "@/components/Footer.tsx";
import Header from "@/components/Header.tsx";

interface LayoutProps{
    children: React.ReactNode;
}

const Layout = ({children}:LayoutProps) => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header/>
                <div className="flex-1 pt-24 pb-16 overflow-y-auto overflow-x-hidden bg-background">
                    {children}
                </div>
                <Footer/>
            </div>
        </>
    )
}

export default Layout;