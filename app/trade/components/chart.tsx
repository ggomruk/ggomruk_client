'use client'

import { createChart, ColorType, LineStyle, CrosshairMode, IChartApi, ISeriesApi } from "lightweight-charts";
import React, { useCallback, useEffect, useRef } from "react";
import style from '@/app/style/component/chart.module.scss';
import useWebsocket from "@/app/hook/useWebsocket";

const Chart : React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement|null>(null); // used to store chart DOM element
    const chartRef = useRef<IChartApi|null>(null); // used to store chart instance
    const seriesRef = useRef<ISeriesApi<"Candlestick">|null>(null);

    const handleWebsocketMessage = useCallback((event: MessageEvent) => {
        const message = JSON.parse(event.data);
        const candleStick = message.k;
        const open = parseFloat(candleStick.o);
        const high = parseFloat(candleStick.h);
        const low = parseFloat(candleStick.l);
        const close = parseFloat(candleStick.c);
        const time = candleStick.T / 1000;
        
        seriesRef.current?.update({ open, high, low, close, time });
    }, []);

    // const handleWebsocketMessage = (event: MessageEvent) => {
    //     const message = JSON.parse(event.data);
    //     const candleStick = message.k;
    //     const open = parseFloat(candleStick.o);
    //     const high = parseFloat(candleStick.h);
    //     const low = parseFloat(candleStick.l);
    //     const close = parseFloat(candleStick.c);
    //     const time = candleStick.T / 1000;
        
    //     seriesRef.current?.update({ open, high, low, close, time });
    // }

    const isConnected = useWebsocket(handleWebsocketMessage);

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
            width: chartContainerRef.current?.clientWidth,
            height: chartContainerRef.current?.clientHeight
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

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                const width = chartContainerRef.current.clientWidth;
                chart.applyOptions({ width });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={style['chart-container']}>
            <div className={style.chart} ref={chartContainerRef}/>
        </div>
    );
};

export default Chart;