'use client'

import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";

const Chart = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    useEffect(() => {

        const chartOptions = {
            layout: {
                background: { type: ColorType.Solid, color: 'white' },
                textColor: '#000',
            },
            width: chartContainerRef.current.clientWidth,
            height: 300
        }

        const chart = createChart(chartContainerRef.current, chartOptions);

        chartRef.current = chart;

        const newSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', 
            downColor: '#ef5350', 
            borderVisible: false, 
            wickUpColor: '#26a69a', 
            wickDownColor: '#ef5350' 
        });

        seriesRef.current = newSeries;

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const candleStick = message.k;
            const open = parseFloat(candleStick.o);
            const high = parseFloat(candleStick.h);
            const low = parseFloat(candleStick.l);
            const close = parseFloat(candleStick.c);
            const time = candleStick.T / 1000;

            seriesRef.current?.update({ open, high, low, close, time });
        };

        return () => {
            window.removeEventListener('resize', handleResize);
            ws.close();
        };
    }, []);

    return (
        <div ref={chartContainerRef} style={{ width: '100%', height: '300px', position: 'relative' }} />
    );
};

export default Chart;