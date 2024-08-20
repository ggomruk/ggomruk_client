'use client'

import { createChart, ColorType, LineStyle, CrosshairMode, IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";
import React, { useCallback, useEffect, useRef } from "react";
import style from '@/app/style/component/chart.module.scss';
import { useWebsocket } from "@/app/context/websocket.context";

interface ChartProps {
    width: number;
    height: number;
}

const Chart : React.FC<ChartProps> = ({width, height}) => {
    const { klineData } = useWebsocket();

    const chartContainerRef = useRef<HTMLDivElement|null>(null); // used to store chart DOM element
    const chartRef = useRef<IChartApi|null>(null); // used to store chart instance
    const seriesRef = useRef<ISeriesApi<"Candlestick">|null>(null);

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
    }, [])

    useEffect(() => {
        if (klineData.length > 0) {
            seriesRef.current?.update(klineData[klineData.length - 1] as CandlestickData);
        }
    }, [klineData]);

    return (
        // <div className={style['chart-container']}>
            <div className={style['chart']} ref={chartContainerRef}/>
        // </div>
    );
};

export default Chart;