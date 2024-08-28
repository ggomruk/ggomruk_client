import Navigation from "./components/nav";

export default function TradeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navigation />
            {children}
        </>
    )

}