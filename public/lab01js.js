window.addEventListener('load', async () =>
{
  if('serviceWorker' in navigator)
  {
    try 
    {
      //register a service worker
      const reg = await navigator.serviceWorker.register('sw.js');
      console.log("SW success", reg);
    } 
    catch (error) 
    {
      
    }
}
});

const userDiv = document.querySelector("#user");
const userMenu = document.querySelector(".user-menu");

const notiDiv = document.querySelector("#notbuttn");
const notiMenu = document.querySelector(".notification");
const addMenu = document.querySelector(".modal");

const form = document.querySelector("#modal form");

var a = 0;
var studentsCount = 0;

userDiv.addEventListener("click", () => {
  userMenu.classList.toggle("hidden");
  notiMenu.classList.add("hidden");
});
notiDiv.addEventListener("click", () => {
  notiMenu.classList.toggle("hidden");
  userMenu.classList.add("hidden");

  notbuttn.classList.add("yellow-bg");
  setTimeout(() => {
    notbuttn.classList.remove("yellow-bg");
  }, 250);
});
document.addEventListener("click", (event) => {
  const isClickInside = userDiv.contains(event.target);
  const isClickInside2 = notiDiv.contains(event.target);
  if (!isClickInside && !isClickInside2) {
    userMenu.classList.add("hidden");
    notiMenu.classList.add("hidden");
  }
  
});
async function Addbuttn(){
  a = 0;
  document.getElementById("textHelper1").innerHTML = "Add New Record";
  addMenu.classList.toggle("hidden");
  
};
function AddToTable(){
    const group = form.querySelector("#group").value;
    const name = form.querySelector("#name").value;
    const gender = form.querySelector("#gender").value;
    const birthday = form.querySelector("#birthday").value;
    const status = form.querySelector("#status").value;
    const table = document.querySelector("#table1 tbody");
    let  newRow = null;
    let cell1 = null;
    let cell2 = null;
    let cell3 = null;
    let cell4 = null;
    let cell5 = null;
    let cell6 = null;
    let cell7 = null;
    if(a == 0){
      studentsCount++;
      newRow = table.insertRow();
      cell1 = newRow.insertCell(0);
      cell2 = newRow.insertCell(1);
      cell3 = newRow.insertCell(2);
      cell4 = newRow.insertCell(3);
      cell5 = newRow.insertCell(4);
      cell6 = newRow.insertCell(5);
      cell7 = newRow.insertCell(6);
    }
    else{
      let modifyBtn = document.querySelector("#Editbtn");
      newRow = modifyBtn.parentElement.parentElement;
      for (let i = 0; i < 7; i++) {
        newRow.deleteCell(0);
      }
      cell1 = newRow.insertCell(0);
      cell2 = newRow.insertCell(1);
      cell3 = newRow.insertCell(2);
      cell4 = newRow.insertCell(3);
      cell5 = newRow.insertCell(4);
      cell6 = newRow.insertCell(5);
      cell7 = newRow.insertCell(6);
    }

    
    cell1.innerHTML = '<input type="checkbox">';
    cell2.innerHTML = group;
    cell3.innerHTML = name;
    cell4.innerHTML = gender;
    cell5.innerHTML = birthday;
    cell6.innerHTML = status;
    cell7.innerHTML = '<button onclick="Delete(this)">Delete</button><button id = "Editbtn" onclick="Edit(this)">Edit</button>';
    

    newRow.classList.add('row-style');
    cell1.classList.add('cell-style');
    cell2.classList.add('cell-style');
    cell3.classList.add('cell-style');
    cell4.classList.add('cell-style');
    cell5.classList.add('cell-style');
    cell6.classList.add('cell-style');
    cell7.classList.add('cell-style');

    cell1.style.width = "5%";
    cell2.style.width = "10%";
    cell3.style.width = "10%";
    cell4.style.width = "15%";
    cell5.style.width = "20%";
    cell6.style.width = "15%";
    
    addMenu.classList = ("hidden");
}
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const group = form.querySelector("#group").value;
    const name = form.querySelector("#name").value;
    const gender = form.querySelector("#gender").value;
    const birthday = form.querySelector("#birthday").value;
    const status = form.querySelector("#status").value;
    var st = new Student(studentsCount , group , name , gender , birthday , status);

    sendData(JSON.stringify(st));
    
  });

async function Delete(row) {
  row.parentElement.parentElement.remove();
  }
async function Edit(row) {
  a = 1;
  addMenu.classList.toggle("hidden");
  document.getElementById("textHelper1").innerHTML = "Edit Record";
  
}
async function Close(){
  addMenu.classList = ("hidden");
}

function sendData(data) {
  document.getElementById('group').style.backgroundColor = 'white';
  document.getElementById('name').style.backgroundColor = 'white';
  document.getElementById('gender').style.backgroundColor = 'white';
  document.getElementById('birthday').style.backgroundColor = 'white';
  document.getElementById('status').style.backgroundColor = 'white';
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "server.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.parse(this.responseText);
      if (response.success) {
        alert("Congratulations");
        AddToTable();
      } else {
        for (const field in response.errors) {
          alert(response.errors[field]);  
          
        }
        if(response.errors['name'] == 'Invalid name'){
          document.getElementById('name').style.backgroundColor = 'pink';
        }
        if(response.errors['group'] == 'Invalid group'){
          document.getElementById('group').style.backgroundColor = 'pink';
        }
        if(response.errors['gender'] == 'Invalid gender'){
          document.getElementById('gender').style.backgroundColor = 'pink';
        }
        if(response.errors['birthday'] == 'Invalid birth date'){
          document.getElementById('birthday').style.backgroundColor = 'pink';
        }   
      }
    }
  };
  
  xhr.send(data);
};
class Student {
  constructor(id, group , name , gender , birthday , status) {
    this.id = id;
    this.group = group;
    this.name = name;
    this.gender = gender;
    this.birthday = birthday;
    this.status = status;
  }
}