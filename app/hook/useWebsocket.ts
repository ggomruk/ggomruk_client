'use client';

import { useEffect, useRef, useState } from "react"


const useWebsocket = (onMessage: (event: MessageEvent) => void) => {
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        if (isConnected) return;
        
        const websocktUrl = 'wss://stream.binance.com:9443/ws/btcusdt@kline_1m';
        const connection = new WebSocket(websocktUrl);

        connection.onopen = () => {
            console.log("Connected to websocket server");
            setIsConnected(true);
        }
        
        connection.onmessage = onMessage;

        connection.onclose = () => {
        console.log("websocket server connection closed");
            setIsConnected(false);
        }

        connection.onerror = (error) => {
            setIsConnected(false);
        }

        return () => {
            console.log('cleanup called')
            connection?.close();
            setIsConnected(false);
        }
    }, [onMessage]);

    return isConnected;
}

export default useWebsocket;