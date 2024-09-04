'use client';

import { useEffect, useRef, useState } from "react";

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
    priceChange: number;
    priceChangePercent: number;
    lastPrice: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    quantity: number;
}

interface IWebsocketContext {
    klineData: IKlineData[];
    symbolData: ISymbolData | null;
    setSymbol: (symbol: string) => void;
}


const WS_URL = `wss://stream.binance.com:9443/ws`;
const MAX_RETRY_COUNT = 5;
const MIN_INTERVAL = 1000;
const MAX_JITTER = 200;

const NORMAL_CODE = 1000;
const ON_ERROR_CODE = 4000;

const useWebsocket = (onMessage: (event: MessageEvent) => void) => {
    const wsRef = useRef<WebSocket | null>(null);
    const retryCount = useRef<number>(0);
    const isMounted = useRef<boolean>(true);

    const [klineData, setKlineData] = useState<IKlineData[]>([]);
    const [symbolData, setSymbolData] = useState<ISymbolData | null>(null);

    useEffect(() => {
        retryCount.current = 0;
        isMounted.current = true;
    });

    const setupWebsocket = (wsInstance: WebSocket) => {
        wsInstance.onopen = () => {
            retryCount.current = 0;
        }

        wsInstance.onerror = (event) => {
            if (isMounted.current) {
                wsInstance.close(ON_ERROR_CODE);
            }
        }

        wsInstance.onclose = (event) => {
            if (isMounted.current) {
                // retry
                if (event.code !== NORMAL_CODE) {
                    if (event.code === ON_ERROR_CODE) {
                        let interval  = MIN_INTERVAL * Math.pow(2, retryCount.current);

                        const jitter = Math.floor(Math.random() * (MAX_JITTER * 2 + 1)) - MAX_JITTER;
                        interval += jitter;

                        if (retryCount.current < MAX_RETRY_COUNT) {
                            setTimeout(() => {
                            }, interval);
                        }
                    }
                }
            }
        }
    }
    
}

export default useWebsocket;