import React, {useState, useEffect} from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
const { v4: uuid } = require('uuid');

const initialExpenses = localStorage.getItem("expenses") 
                ? JSON.parse(localStorage.getItem("expenses")) : [];

function App() {
  // ********** State Values ************
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState('');
  // single amount
  const [amount, setAmount] = useState('');
  // alert
  const [alert, setAlert] = useState({show: false})
  // edit
  const [edit, setEdit] = useState(false)

  // edit item
  const [id, setId] = useState(0);

  // ********** useEffect ************
  useEffect(() =>{
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // ************************ functionality ***********************
const handleCharge = e =>{
  setCharge(e.target.value)
}

const handleAmount = e =>{
  setAmount(e.target.value)
}

// handle alert
const handleAlert = ({type, text}) =>{
  setAlert({show:true, type, text});
  setTimeout(() =>{
    setAlert({show:false})
  }, 1000)
}


const handleSubmit = e =>{
  e.preventDefault();
  if(charge !== '' && amount>0){
    if(edit){
        let tepmExpenses = expenses.map(item => {
          return item.id === id ? {...item, charge, amount} : item
        })
      setExpenses(tepmExpenses);
      setEdit(false);
      handleAlert({type: 'success', text: "item edited."})
    }
    else{
      const singleExpense = {id: uuid(), charge, amount}
      setExpenses([...expenses,singleExpense]);
      handleAlert({type: 'success', text: "item added."})
    }

    setCharge('');
    setAmount('');
  }
  else{
    // handle alert called
    handleAlert({type: 'danger', text: "charge cannot be empty value and amount value has to be bigger than zero."})
  }
}

// clear all items
const clearItems = () =>{
  setExpenses([]);
  handleAlert({type: 'danger', text: "All Items Deleted"})
};

// handle Delete
const handleDelete = (id) => {
  let tepmExpenses = expenses.filter(item =>
    item.id !== id);
    setExpenses(tepmExpenses);
    handleAlert({type: 'danger', text: "Item Deleted."});
};

// handle Edit
const handleEdit = (id) => {
  let expense = expenses.find(item => item.id === id);
  let {charge, amount} = expense;
  setCharge(charge);
  setAmount(amount);
  setEdit(true);
  setId(id);
}; 

  return <>
  {alert.show && <Alert type={alert.type} text={alert.text} />}
    
    <h1>budget calculator</h1>
    <main className='App'>
      <ExpenseForm charge = {charge} 
                   amount = {amount} 
                   handleAmount={handleAmount}
                   handleCharge = {handleCharge}
                   handleSubmit = {handleSubmit}
                   edit = {edit}
      />

      <ExpenseList expenses = {expenses} handleDelete = {handleDelete}
                    handleEdit = {handleEdit} clearItems = {clearItems}/>
    </main>
    <h1>
      total spending : <span className = "total">
        ${expenses.reduce((acc, curr) =>{
          return (acc += parseInt(curr.amount));
        }, 0)}
      </span>
    </h1>
  </>
}

export default App;
