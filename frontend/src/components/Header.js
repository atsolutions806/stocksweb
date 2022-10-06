import React,{useEffect} from 'react'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'
import logoutHandler from './logout'
import axios from 'axios'

const Header = ({history}) => {
let authToken=localStorage.getItem("authToken")
let role=localStorage.getItem("role")
let username=localStorage.getItem("username")





  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>StocksApp</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
           
         {authToken && <SearchBox  />} 

            <Nav className='ml-auto'>
              
              {authToken ? (
                <NavDropdown title={username} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/stocks'>
                    <NavDropdown.Item>Stocks</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/alerts'>
                    <NavDropdown.Item>Alerts</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/portfolio'>
                    <NavDropdown.Item>Portfolio</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>)
               :  <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>

              }
               {!authToken && 
                  <LinkContainer to='/register'>
                  <Nav.Link>
                    <i className='fas fa-user-plus'></i> Sign Up
                  </Nav.Link>
                </LinkContainer>
                }

              {authToken && role==='admin' && 
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/dashboard'>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  
                </NavDropdown>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
