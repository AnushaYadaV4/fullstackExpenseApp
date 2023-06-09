
import React from 'react';
import { Fragment, useRef,useState,useEffect } from 'react';
import axios from 'axios';
import UserExpenses from './UserExpenses';
import { expenseAction } from '../store/expense-reducer';
import { useDispatch,useSelector } from 'react-redux';

const ExpensesForm = () => {
    const[expenses,setExpenses]=useState([]);
    const [isEditId, setIsEditId] = useState(null);
    const dispatch = useDispatch();
    const expenseArr = useSelector((state) => state.expense.expenses);





    const enteredAmountRef = useRef();
    const enteredDesRef = useRef();
    const enteredCatRef = useRef();

    useEffect(()=>{
        axios.get('http://localhost:2000/getExpenses').then(arr=>setExpenses(arr.data))

    },[])
    console.log(expenses);

    const editButtonHandler = (data) => {
        console.log("DATA",data)
        dispatch(expenseAction.edditingExpense(data.id));
        enteredAmountRef.current.value = data.amount;
        enteredDesRef.current.value = data.description;
        enteredCatRef.current.value = data.category;
        setIsEditId(data.id);
      };

    

   

    const deleteHandler=(id)=>{
        axios.delete(`http://localhost:2000/deleteExpenses/${id}`).then(arr=>setExpenses(arr.data))
    }
    

    const addExpenseHandler = (event) => {
    event.preventDefault();
    const enteredDes = enteredDesRef.current.value;

    const enteredAmount = enteredAmountRef.current.value;
    const enteredCat = enteredCatRef.current.value;

    const expenseObj = {
      amount: enteredAmount,
      description: enteredDes,
      category: enteredCat,
    };

    if (
      enteredAmount.trim().length === 0 ||
      enteredDes.trim().length === 0 ||
      enteredCat.trim().length === 0
    ) {
      alert("Fill all inputs before submit");
    } else {
      if (isEditId === null) {
        console.log("post");
        const resData = (res) => {
          const expenseObjWithId = { ...expenseObj, Id: res.data.name };
          dispatch(expenseAction.addingNewExpense(expenseObjWithId));
        };

         axios.post('http://localhost:2000/addExpenses',expenseObj).then(arr => setExpenses(arr.data));

        /*sendRequest(
          {
            request: "post",
            url: `https://expense-tracker-app-30997-default-rtdb.firebaseio.com/${userMail}.json`,
            body: expenseObj,
            header: { "Content-Type": "application/json " },
          },
          resData
        );*/

      } else {
        const resEditData = (data) => {
          console.log(data, "put data");
          dispatch(expenseAction.addingNewExpense(data.data));
          setIsEditId(null);
        };

         axios.post(`http://localhost:2000/editExpenses/${isEditId}`,expenseObj).then(arr => setExpenses(arr.data));
        

        /*sendRequest(
          {
            request: "put",
            url: `https://expense-tracker-app-30997-default-rtdb.firebaseio.com/${userMail}/${isEditId}.json`,
            body: expenseObj,
            header: { "Content-Type": "application/json " },
          },
          resEditData
        );*/

      }
    }

    enteredAmountRef.current.value = "";
    enteredDesRef.current.value = "";
    enteredCatRef.current.value = "";
  };


    return (
        <Fragment>
            <div>
            <form>
                <h1>Expenses Form</h1>
                <label htmlFor="money">Amount</label>
                <input ref={enteredAmountRef} type="number" id="money"></input>

                <label htmlFor="expenses">Category</label>
                <select ref={enteredCatRef} id="category">
                    <option value="grocery">Grocery</option>
                    <option value="fuel">Fuel</option>
                    <option value="medicine">Medicine</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegitables">Vegitables</option>
                </select>
                <label htmlFor="description">Description</label>
                <input ref={enteredDesRef} type="text" id="description"></input>
                <button onClick={addExpenseHandler}>Submit</button>
            </form>


            </div>

            <section>
                <h1>Your Expenses</h1>
                {expenses.length>0 && expenses.map((obj)=>{
                    return(<UserExpenses
                    key={Math.random()}
                    items={obj}
                    deleteButtonClicked={deleteHandler}
                    editButtonClicked={editButtonHandler}
                    
                    />)
                })}
                
            </section>
            
        </Fragment>
    )
}

export default ExpensesForm;