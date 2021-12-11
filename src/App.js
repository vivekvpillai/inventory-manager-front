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

  let [showAdd, setshowAdd] = useState(false);
  let [totalQuantity, setTotalQuantity] = useState()
  const [edititemName, setEdititemName] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const [editQuantity, setEditQuantity] = useState()
  const [id, setId] = useState('')


  const totalQuantcalc = (values) => {
   let sum = 0
   // console.log('sum ' + sum)
   for (let i = 0; i < values.length; i++) {
     sum += values[i].quantity
     // console.log('test ' + values[i].calories)
     // console.log('hello')
   }
   // console.log('sum ' + sum)
    setTotalQuantity(sum)
  }

  const getUserListings = () => {
   const tempUserListings = []
   for (const listing of objects) {
     if (listing.includes(objects.id)) {
       tempUserListings.push(listing)
     }
   }
   console.log(tempUserListings)
   totalQuantcalc(tempUserListings)
  }

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


  const revealAdd = () => {
    showAdd ? setshowAdd(false) : setshowAdd(true)
  }

  const handleNewFilter = (event) => {
      setitemName(event.target.value)
  }


  const handleSearch = (newSearch) => {
    setSearch(newSearch)
    console.log(newSearch)
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
      <div className="title">
            <h1 id="titlemain">Inventory Manager</h1>
            <p className="description">List your department's inventory!</p>
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

          <div className="search-section">
              <div className = "Presearch">
                <h2>Inventory Log</h2>
                <h5 className="totalQuantity"> Total Quantity: {totalQuantity} </h5>
                <div className="search-container">
                  <input id="search" type="text" placeholder="Search..." onChange={(event) => {setSearch(event.target.value)}}/>
              </div>
            </div>
              <div className="ul">
                <ul>
                  <div className="topmargin">
                  </div>
                    {
                        objects
                        .filter((item)=> {
                          if (search == "") {
                            return item
                          } else if (Object.values(item).join('').toLowerCase().includes(search.toLowerCase())) {
                            return item
                          }
                        })
                        .map(
                            (object, index) => {
                              console.log(object);
                              console.log(index)
                                return <li className="listmap" key={index}>
                                  <div className="innerDiv">
                                    <div className="datadiv">
                                      <div>Item Name: {object.itemName}</div> <div>Department: {object.department}</div> <div>Quantity: {object.quantity}</div>
                                    </div>


                                    <form id={object.id} onSubmit={updateObject}>
                                        <input onChange={handleNewitemName} type="text" placeholder="Item Name"/><br/>
                                        <input onChange={handleNewdepartment} type="text"  placeholder="Department"/><br/>
                                        <input onChange={handleNewquantity} type="number"  placeholder="Quantity" /><br/>
                                        <input className="updateBtn" type="submit"  value="Update"/>
                                    </form>

                                    <button className="deletebutton" value={object.id} onClick={deleteObject}>Delete</button>
                                  </div>
                                </li>
                            }
                        )
                    }
                  <div className="botmargin">
                  </div>
                </ul>
            </div>
          </div>
    </div>
  )
}

export default App;
