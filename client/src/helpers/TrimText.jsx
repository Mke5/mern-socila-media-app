import React from 'react'

const TrimText = ({item, maxlength}) => {
  return (
    <>
        {item.length > maxlength ? item?.substring(0, maxlength) + '...' : item}
    </>
  )
}

export default TrimText