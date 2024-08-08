'use client';

import React, { useRef, useState } from 'react'
import style from '../style/layout/tradeLayout.module.scss'
import Backtest from './components/backtest'
import Chart from './components/chart'
import Signal from './components/signal'

export interface IMarketData {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
}

export default function Trade() {
    return (
        <div className={style['container']}>
            <div className={style['pane1']}>
                <Chart />
            </div>
            <div className={style['pane2']}>
                <Backtest />
            </div>
            <div className={style['pane3']}>
                <Signal />
            </div>
        </div>
    );
};
