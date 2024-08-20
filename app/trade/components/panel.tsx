import { useWebsocket } from "@/app/context/websocket.context";
import style from "@/app/style/component/panel.module.scss"
import { faArrowCircleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from 'react'

const Panel = () => {
  const { symbolData, setSymbol } = useWebsocket();
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && dropdownOpen) {
      setDropdownOpen(false);
    }
  }, [dropdownOpen])  

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      if (!event.target.closest(`.${style['panel']}`)) {
        setDropdownOpen(false);
      }
    }
  }, [])
  
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [dropdownOpen, handleKeyDown, handleOutsideClick]);

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  }
  return (
    <div className={style['panel']}>
      {/* <img className={style['symbol-logo']}/> */}
      <div className={`${style['symbol-container']} ${style['panel-item']}`}>
        <span className={style['symbol-name']}>{symbolData?.symbol.toUpperCase() ?? "BTCUSDT"}</span>
        <button className={style['symbol-button']} onClick={toggleDropDown}>
          <FontAwesomeIcon icon={faArrowCircleDown}></FontAwesomeIcon>
        </button>
        {
          dropdownOpen && (
            <div className={style['dropdown-menu']}>
              <div className={style['dropdown-input-container']}>
                <FontAwesomeIcon icon={faSearch} className={style['dropdown-input-icon']}/>
                <input type="text" className={style['dropdown-input']} />
              </div>
              <hr className={style['divider']}/>
              <div className={style['dropdown-item-container']}>
                <div className={style['dropdown-item']}onClick={() => setSymbol('BTCUSDT')}>BTCUSDT</div>
                <div className={style['dropdown-item']}onClick={() => setSymbol('ETHUSDT')}>ETHUSDT</div>
                <div className={style['dropdown-item']}onClick={() => setSymbol('ETHUSDT')}>SOLUSDT</div>
              </div>
            </div>
          )
        }
      </div>
      <span className={`${style['price']} ${style['panel-item']}`}>
        Market Price: {symbolData?.lastPrice ?? 'NA'}
      </span>
      <span className={`${style['change']} ${style['panel-item']}`}>
        Change: {symbolData?.priceChange ?? 'NA'}
      </span>
      <span className={`{$style['mark-price']} ${style['panel-item']}`}>
        High: {symbolData?.highPrice ?? 'NA'}
      </span>
      <span className={`${style['index-price']} ${style['panel-item']}`}>
        Low: {symbolData?.lowPrice ?? 'NA'}
      </span>
    </div>
  )
}

export default Panel;