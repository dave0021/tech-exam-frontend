import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css';

function App() {
  const [id, setId] = useState()

  const [members, setMembers] = useState()

  const [mode, setMode] = useState()

  const [firstname, setFirstname] = useState()

  const [middlename, setMiddlename] = useState()

  const [lastname, setLastname] = useState()

  const [age, setAge] = useState()

  const [gender, setGender] = useState()

  const [email, setEmail] = useState()

  const [contact, setContact] = useState()

  useEffect(() => {
    fetchMembers()

    console.log(members)
  }, [])

  const fetchMembers = () => {
    axios.get('http://localhost:5000/api/family/fetch')
    .then(({data}) => {
      setMembers(data.D)
    })
    .catch((err) => {
      alert(err)
    })
  }

  const clearFields = () => {
    setId('')
    setFirstname('')
    setMiddlename('')
    setLastname('')
    setAge('')
    setGender('')
    setEmail('')
    setContact('')
  }

  const openModal = (mode, data = {}) => {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
      keyboard: false
    })

    setMode(mode)

    if (mode == 'Update') {
      setId(data.id)
      setFirstname(data.first_name)
      setMiddlename(data.middle_name)
      setLastname(data.last_name)
      setAge(data.age)
      setGender(data.gender)
      setEmail(data.email)
      setContact(data.contact_number)
    }

    myModal.show()
  }

  const submitForm = (e) => {
    e.preventDefault()

    var params = {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      age: age,
      gender: gender,
      email: email,
      contact_number: contact
    }

    if (mode == 'Update') {
      params['id'] = id
    }

    axios.post(`http://localhost:5000/api/family/${mode == 'Add' ? 'add' : 'update'}`, params)
      .then(({data}) => {
        if (data.S) {
          alert(data.M)
          clearFields()

          setTimeout(() => {
            fetchMembers()
          }, 1000);
        } else {
          alert('API ERROR')
        }
      })
      .catch((err) => {
        alert(err)
      })
  }

  const deleteData = (id) => {
    var params = {
      id: id
    }

    axios.post('http://localhost:5000/api/family/delete', params)
      .then(({data}) => {
        if (data.S) {
          alert(data.M)
        } else {
          alert('API ERROR')
        }
      })
      .catch((err) => {
        alert(err)
      })

    fetchMembers()
  }

  return (
    <div className="App">
      <div className='mb-5' align="center">
        <div className='mb-5'>
          <h3>
            Family Members
          </h3>
        </div>

        <div align="right">
          <button className='btn btn-success' onClick={() => openModal('Add')}>
            Add Members
          </button>
        </div>

        <div className="modal fade" id="myModal" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <form onSubmit={submitForm}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="myModalLabel">{mode} Family Members</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div className="modal-body">
                  <div className='row g-3'>
                    <div className='col-xl-4'>
                      <input id="firstname" className='form-control' placeholder='First Name' required onChange={(e) => setFirstname(e.target.value)} value={firstname || ''}/>
                    </div>

                    <div className='col-xl-4'>
                      <input id="middlename" className='form-control' placeholder='Middle Name' required onChange={(e) => setMiddlename(e.target.value)} value={middlename || ''}/>
                    </div>

                    <div className='col-xl-4'>
                      <input id="lastname" className='form-control' placeholder='Last Name' required onChange={(e) => setLastname(e.target.value)} value={lastname || ''}/>
                    </div>

                    <div className='col-xl-4'>
                      <input id="age" className='form-control' placeholder='Age' required pattern='^[0-9]*$' onChange={(e) => setAge(e.target.value)} value={age || ''}/>
                    </div>

                    <div className='col-xl-4'>
                      <input id="gender" className='form-control' placeholder='Gender' required onChange={(e) => setGender(e.target.value)} value={gender || ''}/>
                    </div>

                    <div className='col-xl-4'>
                      <input type="email" id="email" className='form-control' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} value={email || ''}/>
                    </div>

                    <div className='col-xl-4'>
                      <input id="contact" className='form-control' placeholder='Contact' required pattern='^[0-9]*$' onChange={(e) => setContact(e.target.value)} value={contact || ''}/>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">{mode}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <td>First Name</td>
              <td>Middle Name</td>
              <td>Last Name</td>
              <td>Age</td>
              <td>Gender</td>
              <td>Email</td>
              <td>Contact</td>
              <td>Action</td>
            </tr>
          </thead>

          <tbody>
            {members && members.map((data, i) => 
              <tr key={i.id}>
                <td>
                  {data.first_name}
                </td>

                <td>
                  {data.middle_name}
                </td>

                <td>
                  {data.last_name}
                </td>

                <td>
                  {data.age}
                </td>

                <td>
                  {data.gender}
                </td>

                <td>
                  {data.email}
                </td>

                <td>
                  {data.contact_number}
                </td>

                <td>
                  <button className='btn btn-info me-3' onClick={() => openModal('Update', data)}>
                    Edit
                  </button>

                  <button className='btn btn-danger' onClick={() => deleteData(data.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
