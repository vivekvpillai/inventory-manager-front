import axios from 'axios';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [objects, setObjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [newitemName, setitemName] = useState('');
  const [newdepartment, setdepartment] = useState('');
  const [newquantity, setquantity] = useState('');

  const [search, setSearch] = useState('');

  let [showAdd, setshowAdd] = useState(false)
  const [edititemName, setEdititemName] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const [editQuantity, setEditQuantity] = useState()
  const [id, setId] = useState('')


  useEffect(() => {
    axios
      .get('https://vp-inventory-manager.herokuapp.com/objects').then((response)=>{
        console.log(response.data);
        setObjects(response.data)
      })
  }, [])



  const createobject = (event) => {
      event.preventDefault();
      axios.post(
          'https://vp-inventory-manager.herokuapp.com/objects',
          {
              itemName:newitemName,
              department:newdepartment,
              quantity:newquantity,
          }
      ).then(() => {
        axios
            .get('https://vp-inventory-manager.herokuapp.com/objects')
            .then((response)=> {
              setObjects(response.data)
            })
      })
  }

  const handleNewquantity = (event) => {
      setquantity(event.target.value)
  }

  const handleNewdepartment = (event) => {
      setdepartment(event.target.value)
  }

  const handleNewitemName = (event) => {
      setitemName(event.target.value)
  }

  const deleteObject = (event) => {
      axios.delete('https://vp-inventory-manager.herokuapp.com/objects/' + event.target.value).then(() =>{
        axios
          .get('https://vp-inventory-manager.herokuapp.com/objects')
          .then((response) => {
            setObjects(response.data)
        })
      })
  }

  const updateObject = (event) => {
      event.preventDefault();
      const id = event.target.getAttribute('id');
      axios.put(
          'https://vp-inventory-manager.herokuapp.com/objects/' + id,
          {
              itemName:newitemName,
              department:newdepartment,
              quantity:newquantity
          }
      ).then(()=>{
          axios
            .get('https://vp-inventory-manager.herokuapp.com/objects/')
            .then((response)=> {
              setObjects(response.data)
            })
      })
  }

  const updateButton = (objectData) => {
   setEdititemName(objectData.itemName)
   setEditDepartment(objectData.department)
   setEditQuantity(objectData.quantity)
   setId(objectData._id)
  }

  const revealAdd = () => {
    showAdd ? setshowAdd(false) : setshowAdd(true)
  }

  const handleSearch = (newSearch) => {
    setSearch(newSearch)
    // console.log(newSearch);
    if (search !== '') {
      let filteredData = objects.filter((item) => {
        return Object.values(item).join('').toLowerCase().includes(search.toLowerCase())
      })
      setFiltered(filteredData)
    } else {
      setFiltered(objects)
    }
  }


  return(
    <div>
    <div class="title">
          <h1 id="titlemain">Inventory Manager</h1>
          <p class="description">List your department's inventory!</p>
    </div>
        <div className="createDiv">
          <h2>List Inventory</h2>
          <button className="addBtn" onClick={revealAdd}>Add</button>
          {showAdd ?
            <form onSubmit={createobject}>
              <input onChange={handleNewitemName} type="text" placeholder="Item Name" /><br/>
              <input onChange={handleNewdepartment} type="text" placeholder="Department" /><br/>
              <input onChange={handleNewquantity} type="number" placeholder="Quantity" /><br/>
              <input type="submit" value="Create object" />
            </form>
                    :
             <></>
          }
        </div>


        <div className="search-container">
          <input id="search" type="text" placeholder="Search..." onChange={(e) => {handleSearch(e.target.value)}}/>
        </div>
        <div className="search-section">
          <ul>
              {
                  filtered
                  .sort(({ id: previousID }, { id: currentID }) => previousID - currentID)
                  .map(
                      (object, index) => {
                        console.log(object);
                        console.log(index)
                          return <li className="listmap" key={index}>

                              <div className="datadiv">
                                <div>Item Name: {object.itemName}</div> <div>Department: {object.department}</div> <div>Quantity: {object.quantity}</div>
                              </div>

                              <button className="deletebutton" value={object.id} onClick={deleteObject}>DELETE</button>
                              <form id={object.id} onSubmit={updateObject}>
                                  <input onChange={handleNewitemName} type="text" placeholder="itemName"/><br/>
                                  <input onChange={handleNewdepartment} type="text" placeholder="department"/><br/>
                                  <input onChange={handleNewquantity} type="number" placeholder="quantity" /><br/>
                                  <input type="submit"  value="Update object"/>
                              </form>
                          </li>
                      }
                  )
              }
          </ul>
        </div>





        <div className="objectsDiv">
        <h2>Inventory Log</h2>
        <ul>
            {
                objects
                .sort(({ id: previousID }, { id: currentID }) => previousID - currentID)
                .map(
                    (object, index) => {
                      console.log(object);
                      console.log(index)
                        return <li className="listmap" key={index}>

                        <div className="datadiv">
                              <div>Item Name: {object.itemName}</div> <div>Department: {object.department}</div> <div>Quantity: {object.quantity}</div>
                            </div>

                            <button className="deletebutton" value={object.id} onClick={deleteObject}>DELETE</button>

                            <form id={object.id} onSubmit={updateObject}>
                                <input onChange={handleNewitemName} type="text" placeholder="itemName"/><br/>
                                <input onChange={handleNewdepartment} type="text" placeholder="department"/><br/>
                                <input onChange={handleNewquantity} type="number" placeholder="quantity" /><br/>
                                <input type="submit"  value="Update object"/>
                            </form>
                        </li>
                    }
                )
            }
        </ul>
      </div>

    </div>
  )
}

export default App;
