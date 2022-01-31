import React from "react";
import './App.scss';
import desktopDark from "./images/bg-desktop-dark.jpg";
import desktopLight from "./images/bg-desktop-light.jpg";
import mobileDark from "./images/bg-mobile-dark.jpg";
import mobileLight from "./images/bg-mobile-light.jpg";

const darkBackground = () =>{
  return window.innerWidth>480? desktopDark : mobileDark
}
const lightBackground = ()=>{
  return window.innerWidth>480? desktopLight:mobileLight
}



const idUsed = [];
const randomNumber = () =>{
  let idNumber = Math.floor(Math.random()*100000000)
  idUsed.push(idNumber)
  if(idUsed.every(id => id!==idNumber)){
    return idNumber
  }
  else{
    return Math.floor(Math.random()*100000000)
  }
}

let dragSrc;
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      darkOrLight: false,
      addingList: "",
      tasks:[],
      compOrNot:[],
      display: "All",
      count:0
    }
    this.changeLight = this.changeLight.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
    this.clearList = this.clearList.bind(this);
    this.completedOrNot = this.completedOrNot.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.checkDisplay = this.checkDisplay.bind(this);

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }


  componentDidMount(){
    document.addEventListener("keydown", this.pressEnter)

    let taskList = document.querySelector(".todoDragArea");
    taskList.addEventListener("dragstart", this.handleDragStart)
    taskList.addEventListener("dragend", this.handleDragEnd)
    taskList.addEventListener("dragover" , this.handleDragOver)
    taskList.addEventListener("dragenter", this.handleDragEnter)
    taskList.addEventListener("dragleave", this.handleDragLeave)
    taskList.addEventListener("drop", this.handleDrop);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.pressEnter);
  }

  handleDragStart(e){
    e.target.style.opacity = 0.4;
    e.target.classList.remove("dragOver")
    dragSrc = e.target;
    e.dataTransfer.effectAllowed = "move";
  }
  handleDragEnd(e){
    e.target.style.opacity = 1;
    e.target.classList.remove("dragOver")
  }
  handleDragOver(e){
    if(e.preventDefault){
      e.preventDefault()
    }
    return false
  }
  handleDragEnter(e){
    e.target.classList.add("dragOver")
  }
  handleDragLeave(e){
    e.target.classList.remove("dragOver")
  }
  handleDrop(e){
    e.stopPropagation();
    if(dragSrc.getAttribute("check") !== e.target.getAttribute("check")){
      let orgId = dragSrc.getAttribute("check")
      let moveId = e.target.getAttribute("check")
      let orgIndex = this.state.tasks.map((org,i) => Object.keys(org).pop() === orgId? i : false).filter(index => index!==false).pop()
      let moveIndex = this.state.tasks.map((org,i) => Object.keys(org).pop() === moveId? i : false).filter(index => index!==false).pop()

      /* exchanging each tasks place to place version
      let listOfTasks = [...this.state.tasks]
      let placeholder = listOfTasks[orgIndex];
      listOfTasks[orgIndex] = listOfTasks[moveIndex] 
      listOfTasks[moveIndex] = placeholder;
      */

      //reordering version
      let movedTasks=[...this.state.tasks];
      let originalTask = movedTasks[orgIndex]
      movedTasks.splice(orgIndex,1)
      movedTasks.splice(moveIndex, 0,originalTask)
     
      this.setState({
        tasks: movedTasks
      })

      e.target.classList.remove("dragOver")
    }
    return false;
  }

  pressEnter(e){
    if(e.keyCode === 13){
      let task = this.state.addingList;
      let idNumber = randomNumber();
      if(this.state.count === 0){
        this.setState({
          compOrNot: [{[idNumber] : false}],
          tasks:[{[idNumber]:task}],
          addingList: "",
          count: this.state.count+1
        })
      }
      else{
        this.setState({
          compOrNot: [...this.state.compOrNot,{[idNumber] : false}],
          tasks:[...this.state.tasks, {[idNumber]:task}],
          addingList: "",
          count: this.state.count+1
        })
      }
    }
  }
  handleTyping(e){
    this.setState({
      addingList: e.target.value
    })
  }
  changeLight(){
    this.setState({
      darkOrLight: !this.state.darkOrLight
    });
  }
  checkDisplay(e){
    this.setState({
      display:e.target.innerText
    })
  }
  completedOrNot(e){
    let idNumber = e.target.getAttribute("check");
    let completed = e.target.getAttribute("comp");
    if(completed === "true"){
      this.setState({
        compOrNot: this.state.compOrNot.map(id => id.hasOwnProperty(idNumber)? {[idNumber] : true}: id)
      })
    }
    else{
      this.setState({
        compOrNot: this.state.compOrNot.map(id => id.hasOwnProperty(idNumber)? {[idNumber] : false}: id)
      })
    }
  }
  deleteTask(e){
    let deleted = e.target.getAttribute("check")
    this.setState({
      tasks: this.state.tasks.filter(task => !task.hasOwnProperty(deleted)),
      compOrNot: this.state.compOrNot.filter(id => !id.hasOwnProperty(deleted)),
      count: this.state.count-1
    })
  }
  clearList(){
    this.setState({
      addingList: "",
      tasks:[],
      compOrNot:[],
      count:0
    })
  }

  render(){
    let imgBg = this.state.darkOrLight? lightBackground(): darkBackground();
    let backgroundColor = this.state.darkOrLight? "lightBg" : "darkBg";
    let darkLightIcon = this.state.darkOrLight?"fas fa-moon" : "fas fa-sun";
    let inputBox = this.state.darkOrLight? "inputBoxLight": "inputBoxDark";
    let textBox = this.state.darkOrLight? "textBoxLight" : "textBoxDark";
    let todoBox = this.state.darkOrLight? "todoBoxLight" : "todoBoxDark";
    let signature = this.state.darkOrLight? "profileLinkLight": "profileLinkDark";
    let mobileThreeBtn = this.state.darkOrLight ? "mobileThreeBtnLight" : "mobileThreeBtnDark";

    let buttonLayouts = window.innerWidth>480? <div className={todoBox}><p>{this.state.count} Items Left</p><div className = "threeBtn"><p className="all" onClick = {this.checkDisplay}>All</p><p className="active" onClick = {this.checkDisplay}>Active</p><p className="completed" onClick = {this.checkDisplay}>Completed</p></div><p className = "clearBtn" onClick = {this.clearList}>Clear Completed</p></div> : <div className={todoBox}><p>{this.state.count} Items Left</p><p className = "clearBtn" onClick = {this.clearList}>Clear Completed</p></div>

    let mobileBtns = window.innerWidth>480? "": <div className = {mobileThreeBtn}><p className="mobileAll" onClick = {this.checkDisplay}>All</p><p className="mobileActive" onClick = {this.checkDisplay}>Active</p><p className="mobileCompleted" onClick = {this.checkDisplay}>Completed</p></div>;

    let completedTaskId = this.state.compOrNot.filter(id => Object.values(id).pop()).map(id => Object.keys(id).pop());
    let activeTaskId = this.state.compOrNot.filter(id => !Object.values(id).pop()).map(id => Object.keys(id).pop());

    let taskLists = this.state.tasks.map((task,i) => i ===0 ? { [Object.keys(task)]:<ToDoList key = {Object.keys(task)} compOrNot = {this.state.compOrNot.filter(id => id.hasOwnProperty(Object.keys(task))).pop()} idNumber = {Object.keys(task)} firstBox ="firstInput" darkOrLight = {this.state.darkOrLight} click = {this.completedOrNot} task = {Object.values(task)}  delete = {this.deleteTask}/>} : {[Object.keys(task)]: <ToDoList key = {Object.keys(task)} compOrNot = {this.state.compOrNot.filter(id => id.hasOwnProperty(Object.keys(task))).pop()} idNumber = {Object.keys(task)} firstBox ="none" darkOrLight = {this.state.darkOrLight} click = {this.completedOrNot} task = {Object.values(task)} delete = {this.deleteTask}/>});

    let fullList = taskLists.map(task => Object.values(task).pop());
    let activeTaskLists = taskLists.filter(task => activeTaskId.includes(Object.keys(task).pop())).map(task => Object.values(task).pop());
    let completedTaskLists = taskLists.filter(task => completedTaskId.includes(Object.keys(task).pop())).map(task => Object.values(task).pop());

    let tasksToDisplay = this.state.display ==="All"? fullList : this.state.display ==="Active"? activeTaskLists : completedTaskLists;
    return (
      <div className={backgroundColor}>
        <img className="bgImages"src= {imgBg} alt ="bgImg"/>
        <div className = "mainBody">
          <div className = "header">
              <h1 className = "title" >TODO</h1>
              <i id="bgIcon" className={darkLightIcon} onClick = {this.changeLight}></i>
          </div>
          <div id = "mainInputBox" className = {inputBox}>
            <i id = "circle" className="far fa-circle"></i>
            <input required className = {textBox} type = "text" onChange = {this.handleTyping} value={this.state.addingList} placeholder = "What to do! What to do"/>
          </div>
          <div className = "dragableArea">
            <div className = "todoListBox">
              <div className = "todoDragArea">
                {tasksToDisplay}
              </div>
            </div>
            {buttonLayouts}            
          </div>
          {mobileBtns}
          <div className = "sigBox">
              <p className = "information">Drop and drag to reorder list</p>
              <p className = "signature">created by <a href ="https://github.com/arthurlee945" target="_blank" className = {signature}>Arthur Lee</a></p>
          </div>
        </div>
      </div>
    );
  }
}


const ToDoList = (props) =>{
    let boxStyle = props.darkOrLight? "todoTextBoxLight": "todoTextBoxDark"
    let textStyle = props.darkOrLight? "textBoxLight":"textBoxDark"
    let complete = Object.values(props.compOrNot).pop();
    let taskStat = complete? "todoTextCompleted" :"todoTextActive";

    let compIcon = complete? <i className="fas fa-check-circle toDoCheck" draggable = "false"
    onClick = {props.click} check = {props.idNumber} comp ={`${!complete}`}></i> :<i className="far fa-circle toDoCircle" draggable = "false" onClick = {props.click} check = {props.idNumber} comp ={`${!complete}`}></i>

  return(
      <div id ={props.firstBox} className = {boxStyle} draggable = "true" check = {props.idNumber}>
          {compIcon}
          <p id={taskStat} draggable = "false" className = {textStyle} check = {props.idNumber}>{props.task}</p>
          <i id="delete" draggable = "false" className="fas fa-times" onClick={props.delete} check = {props.idNumber}></i>
      </div>
  )
}

export default App;


