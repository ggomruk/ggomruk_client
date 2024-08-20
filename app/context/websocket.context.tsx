'use client';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"

interface IKlineData {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
}

interface ISymbolData {
    eventTime: number;
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    lastPrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
}

interface IWebsocketProviderProps {
    children: ReactNode;
}

interface IWebsocketContext {
    klineData: IKlineData[];
    symbolData: ISymbolData | null;
    setSymbol: (symbol: string) => void;
}

const WebSocketContext = createContext<IWebsocketContext|undefined>(undefined);

export const WeboscketProvider = ({children}: IWebsocketProviderProps) => {
    const [klineData, setKlineData] = useState<IKlineData[]>([]);
    const [symbolData, setSymbolData] = useState<ISymbolData | null>(null);
    const [symbol, setSymbol] = useState<string>('BTCUSDT');

    const connectWebsocket = useCallback((url: string, onMessage: (event: MessageEvent) => void) => {

        const ws = new WebSocket(url);
        ws.onopen = () => {
            console.log("Connected to " + url);
        }

        ws.onmessage = onMessage;

        ws.onerror = (error) => {
            console.log("Error: " + error);
        }

        ws.onclose = (event) => {
            console.log("Connection closed : ", event.reason);
            setTimeout(() => connectWebsocket(url, onMessage), 10000);
        }

        return ws;

    }, [])

    useEffect(() => {
        const klineUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`;
        const symbolUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
        
        const klineWs = connectWebsocket(klineUrl, (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            let candleStick = data.k;
            let d = {
                open: parseFloat(candleStick.o),
                high: parseFloat(candleStick.h),
                low: parseFloat(candleStick.l),
                close: parseFloat(candleStick.c),
                time: candleStick.T / 1000
            }
            setKlineData((prevData) => {
                const newData = [...prevData, d];
                return newData.length > 100 ? newData.slice(newData.length - 100) : newData;
            });
        });
        const symbolWs = connectWebsocket(symbolUrl, (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            setSymbolData({
                eventTime: data.E,
                symbol: data.s,
                priceChange: data.p,
                priceChangePercent: data.P,
                lastPrice: data.c,
                openPrice: data.o,
                highPrice: data.h,
                lowPrice: data.l,
            });
        });

        return () => {
            klineWs.close();
            symbolWs.close();
        }
    }, [symbol, connectWebsocket]);

    return (
        <WebSocketContext.Provider value={{klineData, symbolData, setSymbol}}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebsocket = () : IWebsocketContext=> {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebsocket must be used within a WebSocketProvider');
    }
    return context;
}