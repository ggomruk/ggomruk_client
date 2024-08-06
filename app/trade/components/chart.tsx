'use client'

import { createChart, ColorType, LineStyle, CrosshairMode } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import style from '@/app/style/component/chart.module.scss';

const Chart = () => {
    const chartContainerRef = useRef(null); // used to store chart DOM element
    const chartRef = useRef(null); // used to store chart instance
    const seriesRef = useRef(null);
    const wsRef = useRef();
    const [wsConnected, setWsConnected] = useState(false)

    useEffect(() => {
        if (chartRef.current) return;
        const chartOptions = {
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 8,
                    color: '#C3BCDB44',
                    style: LineStyle.Solid,
                    labelBackgroundColor: '#9B7DFF',
                },
                horzLine: {
                    color: '#9B7DFF',
                    labelBackgroundColor: '#9B7DFF',
                },
            },
            layout: {
                background: { type: ColorType.Solid, color: '#222' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: '#444' },
                horzLines: { color: '#444' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight
        };

        // returns IChartAPI instance
        const chart = createChart(chartContainerRef.current, chartOptions);
        chart.timeScale().applyOptions({
            borderColor: '#71649C'
        });

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

        wsRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
        wsRef.current.onopen = () => {
            setWsConnected(true);
        }
        wsRef.current.onmessage = (event) => {
            console.log('event being triggered')
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
            if (wsConnected) {
                wsRef.current?.close();
            }
        };
    }, [wsConnected]);

    return (
        <div className={style['chart-container']}>
            <div className={style.chart} ref={chartContainerRef}/>
        </div>
    );
};

export default Chart;