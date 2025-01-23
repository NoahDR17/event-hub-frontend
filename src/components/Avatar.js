import React from 'react'
import styles from '../styles/Avatar.module.css'

const Avatar = ({ src, height = 45, text }) => {

    return (
        <span>
            <img
                className={styles.Avatar}
                src={src}
                height={height}
                width={height}
                alt='avatar'
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    console.log('Error occured')
                  }}
            />
            {text}
        </span>
    )
}

export default Avatar