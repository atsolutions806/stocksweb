import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
const SearchBox = () => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      window.location=`/stocks/${keyword}`
    } else {
      window.location='/stocks'
    }
  }

  return (
    <Form onSubmit={submitHandler}className='form-inline' >
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search ...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
      <i className='fas fa-search'></i> 
      </Button>
    </Form>
  )
}

export default SearchBox
