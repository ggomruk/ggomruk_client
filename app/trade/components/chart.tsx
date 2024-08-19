'use client'

import { createChart, ColorType, LineStyle, CrosshairMode, IChartApi, ISeriesApi } from "lightweight-charts";
import React, { useCallback, useEffect, useRef } from "react";
import style from '@/app/style/component/chart.module.scss';
import useWebsocket from "@/app/hook/useWebsocket";

interface ChartProps {
    width: number;
    height: number;
}

const Chart : React.FC<ChartProps> = ({width, height}) => {
    const chartContainerRef = useRef<HTMLDivElement|null>(null); // used to store chart DOM element
    const chartRef = useRef<IChartApi|null>(null); // used to store chart instance
    const seriesRef = useRef<ISeriesApi<"Candlestick">|null>(null);

    // const handleWebsocketMessage = useCallback((event: MessageEvent) => {
    //     const message = JSON.parse(event.data);
    //     const candleStick = message.k;
    //     const open = parseFloat(candleStick.o);
    //     const high = parseFloat(candleStick.h);
    //     const low = parseFloat(candleStick.l);
    //     const close = parseFloat(candleStick.c);
    //     const time = candleStick.T / 1000;
        
    //     seriesRef.current?.update({ open, high, low, close, time });
    // }, []);

    // const isConnected = useWebsocket(handleWebsocketMessage);

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
        };

        // returns IChartAPI instance
        const chart = createChart(chartContainerRef.current!, chartOptions);
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
    }, []);
    
    // useEffect(() => {
    //     console.log('chart resize effect')
    //     // const handleResize = () => {
    //     //     console.log('resize Called')
    //     //     if (chartContainerRef.current && chartRef.current) {
    //     //         chartRef.current.resize(width, height);
    //     //     }
    //     // };
    //     // window.addEventListener('resize', handleResize);

    //     if (chartRef.current) {
    //         console.log(123)
    //         chartRef.current.resize(width, height);
    //     }
    
    //     // return () => {
    //     //     window.removeEventListener('resize', handleResize);
    //     // };
    // }, [width, height])

    return (
        // <div className={style['chart-container']}>
            <div className={style['chart']} ref={chartContainerRef}/>
        // </div>
    );
};

export default Chart;