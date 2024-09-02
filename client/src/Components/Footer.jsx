import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <footer className='bg-dark bg-gradient py-3 text-center' style={{
        color: 'GrayText'
      }}>
        <h6>&#169; 2024 StockSync. <span>All Rights Reserved</span></h6>

        <Link to='/test' className='link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover'>Test my application</Link>
      </footer>
    </>
  )
}

export default Footer