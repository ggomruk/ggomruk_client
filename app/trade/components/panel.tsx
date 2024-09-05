import { useWebsocket } from "@/app/context/websocket.context";
import style from "@/app/style/component/panel.module.scss"
import { faArrowCircleDown, faCross, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef } from 'react'
import CRYPTO_SYMBOLS from "@/app/utils/crypto";
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const Panel = () => {
  const { symbolData, symbol, setSymbol } = useWebsocket();
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = React.useState<number>(0);
  const [searchContent, setSearchContent] = React.useState<string>('');
  const prevPriceRef = useRef<number>(0);

  useEffect(() => {
    if (symbolData?.lastPrice !== undefined) {
      setCurrentPrice(parseFloat((symbolData.lastPrice).toFixed(2)));
    }
  }, [symbolData?.lastPrice]);

  useEffect(() => {
    if (currentPrice !== prevPriceRef.current) {
      prevPriceRef.current = currentPrice;
    }
  }, [currentPrice]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setSearchContent(e.target.value);
  }

  const resetSearchContent = () => {
    setSearchContent('');
  }
  
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [dropdownOpen, handleKeyDown, handleOutsideClick]);

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  return (
    <div className={style['panel']}>
      <div className={`${style['panel-item']}}`}>
        <div className={style['symbol-container']}>

          <div className={style['symbol-icon-container']}>
            <Image src={`./${symbol.slice(0,-4).toLocaleLowerCase()}.svg`} width={20} height={20} alt='Symbol Icon' className={style['symbol-icon']}/>
          </div>

          <div className={style['symbol-name-container']}>
            <span className={style['symbol-name']}>{`${symbol.toUpperCase().slice(0, -4)}/${symbol.toUpperCase().slice(-4, symbol.length)}`}</span>
            <span className={style['symbol-description']}>{CRYPTO_SYMBOLS[symbol.slice(0,-4).toUpperCase() as keyof typeof CRYPTO_SYMBOLS] ?? "NA"}</span>
          </div>


          <button className={style['symbol-button']} onClick={toggleDropDown}>
            <FontAwesomeIcon icon={faArrowCircleDown}></FontAwesomeIcon>
          </button>
          {
            dropdownOpen && (
              <div className={style['dropdown-menu']}>
                <div className={style['dropdown-input-container']}>
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className={style['dropdown-input-icon-search']}/>
                  <input 
                    type="text"
                    placeholder="Search"
                    value={searchContent} 
                    onChange={handleInputChange} 
                    className={style['dropdown-input']} 
                  />
                  <FontAwesomeIcon 
                    icon={faXmark} 
                    className={style['dropdown-input-icon-reset']}
                    onClick={resetSearchContent} 
                  />
                </div>
                <hr className={style['divider']}/>
                <div className={style['dropdown-item-container']}>
                  {
                    Object.keys(CRYPTO_SYMBOLS).map((s, index) => {
                      return(
                        <div key={index} className={style['dropdown-item']} onClick={() => {
                            setSymbol(`${s}USDT`)
                            setDropdownOpen(false)
                          }}>
                          {`${s}USDT`}
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>

      {/* Current Price */}
      <div className={style['panel-item']}>
        <p className={style['panel-item-title']}>Mark Price</p>
        {
          symbolData !== null 
            ? <span className={currentPrice > prevPriceRef.current 
                ? style['price-rise'] 
                : currentPrice < prevPriceRef.current 
                  ? style['price-drop'] 
                  : style['price-stable']
              }>
                {currentPrice.toFixed(2)}
              </span>
            : <Skeleton width='90px' height="1.2rem" baseColor="rgb(241 237 237)"/> 
        }
      </div>

      {/* Market Change */}
      <div className={style['panel-item']}>
        <p className={style['panel-item-title']}>24h Change</p>
        {
          symbolData !== null 
            ? <span className={ symbolData?.priceChange > 0 
                ? style['price-rise']
                : symbolData?.priceChange < 0
                  ? style['price-drop']
                  : style['price=stable']
              }>
                {symbolData?.priceChange.toFixed(2) ?? 0 }
              </span>
            : <Skeleton width='90px' height="1.2rem" baseColor="rgb(241 237 237)"/> 
        }
      </div>

      {/* Market Change % */}
      <div className={style['panel-item']}>
        <p className={style['panel-item-title']}>24h Change (%)</p>
        {
          symbolData !== null 
            ? <span className={ symbolData?.priceChangePercent > 0 
                ? style['price-rise']
                : symbolData?.priceChangePercent < 0
                  ? style['price-drop']
                  : style['price=stable']
              }>
                {symbolData?.priceChangePercent.toFixed(2)}%
              </span>
            : <Skeleton width='90px' height="1.2rem" baseColor="rgb(241 237 237)"/> 
        }
      </div>

      {/* High */}
      <div className={style['panel-item']}>
        <p className={style['panel-item-title']}>24h High</p>
        {
          symbolData !== null 
            ? <span className={`${style['price-stable']}`}>{symbolData.highPrice.toFixed(2)}</span>
            : <Skeleton width='90px' height="1.2rem" baseColor="rgb(241 237 237)"/> 
        }
      </div>

      {/* Low */}
      <div className={style['panel-item']}>
        <p className={style['panel-item-title']}>24h Low</p>
        {
          symbolData !== null 
            ? <span className={`${style['price-stable']}`}>{symbolData.lowPrice.toFixed(2)}</span>
            : <Skeleton width='90px' height="1.2rem" baseColor="rgb(241 237 237)"/> 
        }
      </div>

      {/* Quantity */}
      <div className={style['panel-item']}>
        <p className={style['panel-item-title']}>24h Quantity</p>
        {
          symbolData !== null 
            ? <span className={`${style['price-stable']}`}>{symbolData.quantity.toFixed(2)}</span>
            : <Skeleton width='90px' height="1.2rem" baseColor="rgb(241 237 237)"/> 
        }
      </div>
    </div>
  )
}

export default Panel;