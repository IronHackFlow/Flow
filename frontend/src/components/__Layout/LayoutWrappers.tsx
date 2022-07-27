import React, { ReactNode } from 'react'
type LayoutProps = {
  classes: string[]
  children?: JSX.Element | JSX.Element[]
}

export const LayoutTwo = ({ classes, children }: LayoutProps) => {
  return (
    <div className={classes[0]}>
      <div className={classes[1]}>{children}</div>
    </div>
  )
}

export const LayoutThree = ({ classes, children }: LayoutProps) => {
  return (
    <div className={classes[0]}>
      <div className={classes[1]}>
        <div className={classes[2]}>{children}</div>
      </div>
    </div>
  )
}
