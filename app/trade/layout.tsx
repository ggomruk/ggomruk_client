import style from '../style/layout/tradeLayout.module.scss'
import Backtest from './components/backtest'
import Chart from './components/chart'
import Signal from './components/signal'

export default function TradeLayout({children}: {children: React.ReactNode}) {
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
            {children}
        </div>

    )

}