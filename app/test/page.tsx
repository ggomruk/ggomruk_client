'use client'

import { FunctionComponent } from "react";
import { useWebsocket, WebsocketProvider } from "../context/websocket.context";


const TestComponent: FunctionComponent = () => {

    return (
        <WebsocketProvider>
            <div>
                <ButtonComponent />
            </div>
        </WebsocketProvider>
    );
}
export default TestComponent;

const ButtonComponent: FunctionComponent = () => {
    const {setSymbol} = useWebsocket();
    const changeSymbol = () => {
        setSymbol('ETHUSDT');
    }
    return (
        <>
            <button onClick={changeSymbol}>Change Symbol</button>
        </>
    )
}