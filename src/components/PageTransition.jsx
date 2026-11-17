import React from 'react'
import { motion as Motion, useReducedMotion } from 'framer-motion'

function PageTransition({children}) {
  const reduceMotion = useReducedMotion()

  return (
    <Motion.div
        initial={{opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20}} // start
        animate={{opacity:1 , y: 0}}
        exit={{opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -20}}
        transition={{duration: reduceMotion ? 0 : 0.3}}
    >
        {children}
    </Motion.div>
  )
}

export default PageTransition
