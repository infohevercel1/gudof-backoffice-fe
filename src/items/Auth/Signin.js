import { Input } from '@material-ui/core'
import React, { Component } from 'react'

export class SignIn extends Component {
    state = {
        email : '',
        password:''
    }
    handleSubmit =() => {

    }
    getUsernameAndPassword = async() => {

    }
    render() {
        return (
            <div>
                    <h5>Login</h5>
                    <Input type="text" onChange={(e)=>this.setState({email:e.target.value})} placeholder="username"/>
                    <Input type="password" onChange={(e)=>this.setState({password:e.target.value})} placeholder="password"/>
                    <Button onClick={this.handleSubmit}>Submit</Button>
            </div>
        )
    }
}

export default SignIn
