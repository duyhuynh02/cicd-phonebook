import { useState, useEffect } from 'react'
import noteService from './services/notes'
import Notification from './services/notification'
import './index.css'

const Filter = ( {pattern, filter }) => {
  return (
    <div>
      filter shown with 
      <input value={pattern} onChange={filter}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name: <input value={props.newName} onChange={props.handleNewName}/>
      </div>
      <div>
        number: <input value={props.newPhoneNumber} onChange={props.handleNewPhoneNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
  </form>
  )
}

const Persons = ( {pattern, persons, handleFilteredName, handlePersonDelete} ) => {
  return (
    <div> 
      {pattern === '' 
      ? persons.map((person, index) => (
        <div key={index}>
          {person.name} {person.number} <button onClick={() => handlePersonDelete(person, person.id)}>delete</button>
        </div>
      ))
        : <div>{handleFilteredName(pattern, persons, handlePersonDelete)}</div>
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('dd-dd-dddd')
  const [pattern, setNewPattern] = useState('')
  const [errorMessage, setErrorMessage] = useState('lets test it first')

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.log('Error making GET request: ', error)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault() 
    const newObj = {name: newName, number: newPhoneNumber}
    if (persons.find( (obj) => JSON.stringify(obj.name) === JSON.stringify(newObj.name))) {
      let oldPersonList = persons.filter(person => JSON.stringify(person.name) === JSON.stringify(newObj.name))
      handleUpdateExistedName(newObj, oldPersonList[0].id) 
    } 
    else {
      noteService
        .create(newObj)
        //This one 
        setErrorMessage(`The new name ${newObj.name} just added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      setPersons([...persons, newObj])
    }
    setNewName('')
    setNewPhoneNumber('')
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewPhoneNumber = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  const handleNewPattern = (event) => {
    setNewPattern(event.target.value)
  }

  const handleFilteredName = (pattern, listOfObjects, handlePersonDelete) => {
    pattern = pattern.toUpperCase()
    const filteredPersonList = listOfObjects.filter(obj => obj.name.toUpperCase().includes(pattern))
    return filteredPersonList.map((person, index) => <div key={index}> 
                                                  {person.name} {person.number}  
                                      <button onClick={() => handlePersonDelete(person, person.id)}>delete</button>   
                                                      </div>)
  }

  const handlePersonDelete = (person, id) => {
    // console.log(`Check if it works here ` + id)
    if (window.confirm(`Delete this person: ${person.name}?`)) {
      noteService
      .remove(id)
      .then(() => {
        //if the deletion is successul, update the state of array persons
        const updatedPersons = persons.filter(person => person.id !== id)
        setPersons(updatedPersons)
        setErrorMessage(`The person ${person.name} just removed`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  )
  }
}

  const handleUpdateExistedName = (newObject, id) => {
    /*Not sure this is correct, because it's not automatically render after I update on the same name 
    but anyway, will comeback in case I think of something, because the below version is not needed when 
    we just click F5 and it will show the diff page.*/
    if (window.confirm(`${newObject.name} is already added to phonebook, replace the old number with the new one?`)) {
      noteService
        .update(newObject, id)
        .then(response => {
          const newPersonArr = persons.map(person => {
            if (person.id === response.id) {
              return response
            }
            return person
        })
        setPersons(newPersonArr)
        }) 
        .catch(error => {
          console.log('Error making PUT request: ', error)
        })
        setErrorMessage(`The new phone of ${newObject.name} just added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
  }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Filter pattern={pattern} filter={handleNewPattern}/>
      <h3>add a new</h3>
      <PersonForm newName={newName} newPhoneNumber={newPhoneNumber} addName={addName}
                      handleNewName={handleNewName} handleNewPhoneNumber={handleNewPhoneNumber} /> 
      <h3>Numbers</h3>
      <Persons pattern={pattern} persons={persons} 
          handleFilteredName={handleFilteredName} handlePersonDelete={handlePersonDelete}/>
    </div>

  )
}


export default App

