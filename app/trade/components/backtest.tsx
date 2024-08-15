'use client'

import React, { useState } from "react";
import style from '@/app/style/component/backtest.module.scss'

interface BB {
    sma: number;
    dev: number;
  }
  interface MACD {
    ema_s: number;
    emas_l: number;
    signal_mw: number;
  }
  interface RSI {
    periods: number;
    rsi_upper: number;
    rsi_lower: number;
  }
  interface RV {
    return_thresh_low: number;
    return_thresh_high: number;
    volume_thresh_low: number;
    volume_thresh_high: number;
  }
  interface SMA {
    sma_s: number;
    sma_m: number;
    sma_l: number;
  }
  interface SO {
    periods: number;
    d_mw: number;
  }

const Backtest : React.FC = () => {
    const [symbol, setSymbol] = useState('BTCUSDT')
    const [usdtAmount, setUsdtAmount] = useState(0);
    const [interval, setInterval] = useState('1m');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [strategy, setStrategy] = useState<string>('');
    const [strategyParams, setStrategyParams] = useState<any>({});

    const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStrategy = e.target.value;
        setStrategy(selectedStrategy);
        setStrategyParams({});
    }

    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStrategyParams({
            ...strategyParams,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
          symbol,
          usdtAmount,
          interval,
          startDate,
          endDate,
          strategy,
          strategyParams,
        };
        console.log('Form Data:', formData);
        // Process the form data (e.g., send to an API)
      };

    return (
        <div className={style['backtest-container']}>
            <h1 className={style['title']}>Backtest</h1>
            <form className={style['backtest-form']} onSubmit={handleSubmit}>
                <div className={style['backtest-form-input-container']}>
                    <label className={style['backtest-form-input-label']}>Symbol:</label>
                    <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                </div>
                <div className={style['backtest-form-input-container']}>
                    <label className={style['backtest-form-input-label']}>Quantity</label>
                    <input type="number" value={usdtAmount} onChange={(e) => setUsdtAmount(Number(e.target.value))} />
                </div>
                <div className={style['backtest-form-input-container']}>
                    <label className={style['backtest-form-input-label']}>Interval:</label>
                    <input type="text" value={interval} onChange={(e) => setInterval(e.target.value)} />
                </div>
                <div className={style['backtest-form-input-container']}>
                    <label className={style['backtest-form-input-label']}>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className={style['backtest-form-input-container']}>
                    <label className={style['backtest-form-input-label']}>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className={style['backtest-form-input-container']}>
                    <label>Strategy:</label>
                    <select value={strategy} onChange={handleStrategyChange}>
                    <option value="">Select Strategy</option>
                    <option value="BB">Bollinger Bands (BB)</option>
                    <option value="MACD">MACD</option>
                    <option value="RSI">RSI</option>
                    <option value="RV">Return and Volume (RV)</option>
                    <option value="SMA">Simple Moving Averages (SMA)</option>
                    <option value="SO">Stochastic Oscillator (SO)</option>
                    </select>
                </div>

                {strategy === 'BB' && (
                    <>
                    <div>
                        <label>SMA:</label>
                        <input type="number" name="sma" value={strategyParams.sma || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>Deviation:</label>
                        <input type="number" name="dev" value={strategyParams.dev || ''} onChange={handleParamChange} />
                    </div>
                    </>
                )}

                {strategy === 'MACD' && (
                    <>
                    <div>
                        <label>EMA Short:</label>
                        <input type="number" name="ema_s" value={strategyParams.ema_s || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>EMA Long:</label>
                        <input type="number" name="emas_l" value={strategyParams.emas_l || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>Signal MW:</label>
                        <input type="number" name="signal_mw" value={strategyParams.signal_mw || ''} onChange={handleParamChange} />
                    </div>
                    </>
                )}

                {strategy === 'RSI' && (
                    <>
                    <div>
                        <label>Periods:</label>
                        <input type="number" name="periods" value={strategyParams.periods || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>RSI Upper:</label>
                        <input type="number" name="rsi_upper" value={strategyParams.rsi_upper || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>RSI Lower:</label>
                        <input type="number" name="rsi_lower" value={strategyParams.rsi_lower || ''} onChange={handleParamChange} />
                    </div>
                    </>
                )}

                {strategy === 'RV' && (
                    <>
                    <div>
                        <label>Return Threshold Low:</label>
                        <input type="number" name="return_thresh_low" value={strategyParams.return_thresh_low || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>Return Threshold High:</label>
                        <input type="number" name="return_thresh_high" value={strategyParams.return_thresh_high || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>Volume Threshold Low:</label>
                        <input type="number" name="volume_thresh_low" value={strategyParams.volume_thresh_low || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>Volume Threshold High:</label>
                        <input type="number" name="volume_thresh_high" value={strategyParams.volume_thresh_high || ''} onChange={handleParamChange} />
                    </div>
                    </>
                )}

                {strategy === 'SMA' && (
                    <>
                    <div>
                        <label>SMA Short:</label>
                        <input type="number" name="sma_s" value={strategyParams.sma_s || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>SMA Medium:</label>
                        <input type="number" name="sma_m" value={strategyParams.sma_m || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>SMA Long:</label>
                        <input type="number" name="sma_l" value={strategyParams.sma_l || ''} onChange={handleParamChange} />
                    </div>
                    </>
                )}

                {strategy === 'SO' && (
                    <>
                    <div>
                        <label>Periods:</label>
                        <input type="number" name="periods" value={strategyParams.periods || ''} onChange={handleParamChange} />
                    </div>
                    <div>
                        <label>D Moving Window:</label>
                        <input type="number" name="d_mw" value={strategyParams.d_mw || ''} onChange={handleParamChange} />
                    </div>
                    </>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Backtest;