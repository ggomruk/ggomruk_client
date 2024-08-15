import { useGlobalState } from "@/app/context/global.context";
import style from "@/app/style/component/panel.module.scss"
import { faArrowCircleDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { drop } from "lodash";
import React from 'react'

const Panel = () => {
  const {symbol, setSymbol} = useGlobalState();
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  const getLogoUrl = async (symbol:string) => {

  }

  const handleSymbolChange = () => {
    console.log('change symbol')
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  }
  return (
    <div className={style['panel']}>
      {/* <img className={style['symbol-logo']}/> */}
      <div className={`${style['symbol-container']} ${style['panel-item']}`}>
        <span className={style['symbol-name']}>{symbol.toUpperCase()}</span>
        <button className={style['symbol-button']} onClick={toggleDropDown}>
          <FontAwesomeIcon icon={faArrowCircleDown}></FontAwesomeIcon>
        </button>
        {
          dropdownOpen && (
            <div className={style['dropdown-menu']}>
              <input type="text" className={style['dropdown-input']} onChange={handleSymbolChange}/>
              <div onClick={() => setSymbol('BTCUSDT')}>BTCUSDT</div>
              <div onClick={() => setSymbol('ETHUSDT')}>ETHUSDT</div>
              <div onClick={() => setSymbol('ETHUSDT')}>SOLUSDT</div>
            </div>
          )
        }
      </div>
      <span className={`${style['price']} ${style['panel-item']}`}>59,508.6</span>
      <span className={`${style['change']} ${style['panel-item']}`}>+0.19%</span>
      <span className={`{$style['mark-price']} ${style['panel-item']}`}>Mark price: 59,516.5</span>
      <span className={`${style['index-price']} ${style['panel-item']}`}>Index price: 59,553.6</span>
    </div>
  )
}

export default Panel;