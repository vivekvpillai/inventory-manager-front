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
  let [totalQuantity, setTotalQuantity] = useState(0)
  let [totalSum, setTotalSum] = useState(0)
  const [edititemName, setEdititemName] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const [editQuantity, setEditQuantity] = useState()
  const [id, setId] = useState('')


  const totalQuantcalc = (values) => {
   // console.log('sum ' + sum)
   setTotalQuantity(totalQuantity = 0)
   setTotalSum(totalSum = 0)
   console.log(totalQuantity + 'before')
   for (let i = 0; i < objects.length; i++) {
     console.log(objects)
     console.log(objects.length)
     console.log(objects[i])
     console.log('hello')
    setTotalQuantity(totalQuantity += objects[i].quantity)
    setTotalSum(totalSum = totalQuantity)
    console.log(totalQuantity)
     // console.log('hello')
   }

  }


  useEffect(() => {
    axios
      .get('https://vp-inventory-manager.herokuapp.com/objects').then((response)=>{
        setObjects(response.data);
        setTotalQuantity(totalQuantity = 0)
        for (let i = 0; i < response.data.length; i++) {
          // console.log(response.data.length)
          // console.log(response.data[i])
          // console.log('hello')
         setTotalQuantity(totalQuantity += response.data[i].quantity)
         // console.log(totalQuantity)
        }
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
      totalQuantcalc()
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
      totalQuantcalc()
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
      totalQuantcalc()
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
          <div className="createContainer">
            <div className="createDiv">
              <h2 className="toptitles">List Inventory</h2>
              <button className="addBtn" onClick={revealAdd}>Add</button>
              {showAdd ?
                <form onSubmit={createobject}>
                  <input onChange={handleNewitemName} type="text" placeholder="Item Name" /><br/>
                  <input onChange={handleNewdepartment} type="text" placeholder="Department" /><br/>
                  <input onChange={handleNewquantity} type="number" placeholder="Quantity" /><br/>
                  <input type="submit" className="createBtn" value="Create" onClick={totalQuantcalc}/>
                </form>

                        :
                 <></>
              }
            </div>
          </div>

          <div className="search-section">
              <div className = "Presearch">
                <h2 className="toptitles">Inventory Log</h2>
                {/* <h5 className="totalQuantity"> Total Quantity: {totalQuantity} </h5> */}

                  <div className="samples"> <h4 className="totalQuantity">Items</h4>&nbsp;|&nbsp;
                  {objects.map(
                      (object) => {
                    return <div>
                              <p>{object.itemName} |&nbsp;</p>
                            </div>} )}
                  </div>
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

                                return <li className="listmap" key={index}>
                                  <div className="innerDiv">
                                    <div className="datadiv">
                                      <div className="itemName"><h2>{object.itemName}</h2></div> <div><p className="dept">{object.department}</p></div> <div><p className="qty">Quantity: {object.quantity}</p></div>
                                    </div>
                                    <div class="updateanddelete">
                                      <div className="updateform">
                                        <form id={object.id} onSubmit={updateObject}>
                                            <input class="updateInputs" onChange={handleNewitemName} type="text" placeholder="Item Name"/><br/>
                                            <input class="updateInputs" onChange={handleNewdepartment} type="text"  placeholder="Department"/><br/>
                                            <input class="updateInputs" onChange={handleNewquantity} type="number"  placeholder="Quantity" /><br/>
                                            <input className="updateBtn" type="submit" value="Update" onClick={totalQuantcalc}/>
                                        </form>
                                      </div>
                                      <div className="deleteform">
                                        <button className="deletebutton" value={object.id} onClick={deleteObject}>Delete</button>
                                      </div>
                                    </div>
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
