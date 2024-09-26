import SideBarWrapper from '@/components/shared/sidebar/SideBarWrapper'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const layout = ({children}: Props) => {
  return (
    <SideBarWrapper>{children}</SideBarWrapper>
  )
}

export default layout