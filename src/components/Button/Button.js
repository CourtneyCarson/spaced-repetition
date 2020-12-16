import React from 'react'
import cx from 'classnames'
import './Button.css'

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button className={cx('Button', className)} ref={ref} {...props} />
  )
})

export default Button

// ref same role as value in normal html - 'reference' whatever button name is will be a reference
// 