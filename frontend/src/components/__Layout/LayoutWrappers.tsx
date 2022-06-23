import React, { PropsWithChildren } from 'react'
type LayoutProps = PropsWithChildren<{
  classes: string[]
}>

export const LayoutTwo = ({classes, children}: LayoutProps) => {
  return (
    <div className={classes[0]}>
      <div className={classes[1]}>
        {children}
      </div>
    </div>
  )
}

export const LayoutThree = ({classes, children}: LayoutProps) => {
  return (
    <div className={classes[0]}>
      <div className={classes[1]}>
        <div className={classes[2]}>
          {children}
        </div>
      </div>
    </div>
  )
}