'use client'

import Link from 'next/link'
import React, { useCallback } from 'react'
import styles from '../../style/component/tradeNavbar.module.scss'

interface ListItem {
  title: string;
  subItems: {
    title: string;
    link: string;
  }[];
}

const listItems = [
  {
    title: 'Backtest Result',
    subItems: [
      {
        title: 'Download CSV',
        link: '/trade/backtest-result'
      }
    ]
  },
  {
    title: 'Signal Result',
    subItems: [
      {
        title: 'Signal History',
        link: '/trade/signal-history'
      }
    ]
  }
]

const Navigation = () => {
  const [hovered, setHovered] = React.useState<boolean[]>(new Array(listItems.length).fill(false));

  const handleMouseEnter = (index: number) => {
    setHovered(prev => {
      const newHovered = [...prev];
      newHovered[index] = true;
      return newHovered;
    });
  };

  const handleMouseLeave = (index: number) => {
    setHovered(prev => {
      const newHovered = [...prev];
      newHovered[index] = false;
      return newHovered;
    });
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        Logo
      </Link>

      <ul className={styles.navLinks}>
        {
          listItems.map((item, index) => {
            return (
              <div key={index} className={styles.navContainer} >
                <li onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>
                  <span>{item.title}</span>

                  <ul className={`${styles['dropdown']} ${hovered[index] ? styles.show : ''}`}>
                    {
                      item.subItems.map((subItem, subIndex) => {
                        return (
                          <li key={subIndex}>
                            <Link href={subItem.link}>{subItem.title}</Link>
                          </li>
                        )
                      })
                    }
                  </ul>
                  
                </li>
              </div>
            )
          })
        }
      </ul>
    </nav>
  )
}

export default Navigation