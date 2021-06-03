import { Input } from '@material-ui/core'
import React, { Component } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'antd';
export default function () { 
    
    const auth= useAuth0();

    const handleSubmit =() => {
        
        auth.loginWithRedirect()
    }
    const getUsernameAndPassword = async() => {

    }
        return (
            <div style={{margin:'30px'}}>
                    {/* <h1>Login</h1> */}
                    {/* <Input type="text" onChange={(e)=>this.setState({email:e.target.value})} placeholder="username"/>
                    <Input type="password" onChange={(e)=>this.setState({password:e.target.value})} placeholder="password"/>
                     */}
                     <Button type="primary" onClick={()=>handleSubmit()}>Sign In</Button>
                    {/* <Button onClick={()=>auth.logout()}>Logout</Button> */}
            </div>
        )
    
}

