import React from 'react'
import './App.css'
import MessageBox from "./components/MessageBox"
import { useState } from 'react'


const App = () => {
  const [input, setinput] = useState("")
  const [output, setoutput] = useState("")
  const [Submitted, setSubmitted] = useState("")
  const SendResponse = async () => {

    if (input.trim() === '')
      return

    else {

      try {
        const response = await fetch("http://127.0.0.1:5000/analyze-the-symptons", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: input })
        })
        const data = await response.json()
        setSubmitted(input)
        setoutput(data.response)
        setinput("")

        console.log(data.response)
      } catch (error) {
        console.log(error)

      }
    }

  }


  return (
    <div className='Message-container'>
      <MessageBox input={Submitted} output={output} />
      <div className="input-container">
        <div className="input-field">
          <input type="text" name="name" id="value" placeholder='Enter Your Symptons' value={input} onChange={(e) => (setinput(e.target.value))} />
        </div>
        <div className="button-field">
          <button className="send" onClick={SendResponse}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
