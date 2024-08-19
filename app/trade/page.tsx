'use client';

import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Panel from './components/panel'
import Backtest from './components/backtest'
import Chart from './components/chart'
import Signal from './components/signal'
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import _ from 'lodash';
import style from '@/app/style/page/trade.module.scss'
import useWebsocket from '../hook/useWebsocket';
import { WeboscketProvider } from '../context/websocket.context';

export interface IMarketData {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
}


const DropDrag: FunctionComponent = () => {
    const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), []);

    const [layouts, setLayouts] = useState<{[id: string]: any[]}>({
        lg: [
          { i: 'panel', x: 0, y: 0, w: 4, h: 0.5, isDraggable: false, isResizable: false, static: true},
          { i: 'chart', x: 1, y: 0, w: 4, h: 3, isDraggable: false, isResizable: true }, // start from (0,0), span 2 columns, 2 rows
          { i: 'backtest', x:0, y: 2, w: 2, h: 2 }, // start from (2,0), span 1 column, 1 row
          { i: 'signal', x: 2, y: 2, w: 2, h: 2 }, // start from (2,1), span 1 column, 1 row
        ],
        md: [
          { i: 'chart', x: 0, y: 0, w: 5, h: 2 },
          { i: 'backtest', x: 5, y: 0, w: 3, h: 2 },
          { i: 'signal', x: 8, y: 0, w: 2, h: 2 },
        ],
        sm: [
          { i: 'chart', x: 0, y: 0, w: 4, h: 2 },
          { i: 'backtest', x: 0, y: 2, w: 2, h: 2 },
          { i: 'signal', x: 2, y: 2, w: 2, h: 2 },
        ],
      });
    const [currentBreakPoint, setCurrentBreakPoint] = useState<string>('lg');
    const [compactType, setCompactType] = useState<string|null>();
    const [chartDimension, setChartDimension] = useState<{width: number, height: number}>({width: 0, height: 0});
    const [toolbox, setToolbox] = useState<{[index:string]: any[]}>({
        lg: []
    })

    const onResize = (layout: any, oldItem: any, newItem: any, placeholder: any) => {
        if (newItem.i == 'chart') {
            const gridItemElement = document.querySelector(`.react-grid-item[data-grid-id="${newItem.i}"]`) as HTMLElement;

            if (gridItemElement) {
                // Calculate the new width and height based on the grid item's current size
                const newWidth = gridItemElement.offsetWidth;
                const newHeight = gridItemElement.offsetHeight;

                // Update the chart dimensions
                setChartDimension({ width: newWidth, height: newHeight });
            }
        }
    }

    const onBreakpointChange = (breakpoint: any) => {
        setCurrentBreakPoint(breakpoint);
        setToolbox({
            ...toolbox,
            [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakPoint] || []
        })
    }

    const onLayoutChange = (layout: any, layouts: any) => {
        setLayouts({...layouts});
    }

    const generateDOM = () => {
        const currentLayout = layouts[currentBreakPoint] || [];
        return _.map(currentLayout, ((item: any) => {
            return (
                <div key={item.i} className={style['grid-item']}>
                    {item.i === 'panel'
                        ? <Panel key='panel' toolbox={toolbox} setToolbox={setToolbox} />
                        : item.i === 'chart'
                            ? <Chart key='chart' width={chartDimension.width} height={chartDimension.height} /> 
                            : item.i === 'backtest' 
                                ? <Backtest key="backtest" /> 
                                : <Signal key="signal" />
                    }
                </div>
            )
        }))
    }

    return (
        <WeboscketProvider>
            <ResponsiveReactGridLayout 
            useCSSTransforms={false}
            className='layout' 
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}
            cols={{ lg: 4, md: 2, sm: 1}}
            rowHeight={window.innerHeight / 8}
            preventCollision={true} // prevents items from colliding with each other (items dont move around)
            compactType={null}
            containerPadding={[30, 30]}
            draggableHandle='.drag-handle'
            onResize={onResize}
            autoSize={true}
            isBounded={true}
            >
                {generateDOM()}
            </ResponsiveReactGridLayout>
        </WeboscketProvider>
    )
}

export default DropDrag;
