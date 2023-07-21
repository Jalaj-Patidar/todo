    let list = [];
    let id=0;

    
    var inp = document.getElementById("inp");
    var todolist = document.getElementById("todolist");
    
    document.getElementById("btn").addEventListener("click",function(){
        if(inp.value === ''){
            alert('please write something');
        }else{
            list.push(inp.value);
            inp.value = "";
            showList();
        }

    })

    function showList(){
        todolist.innerHTML = "";
        list.forEach(function(n,i){
            todolist.innerHTML += "<li>"+n+"<a onClick='editItem("+i+")'>edit</a> "+
                "<a onClick='deleteItem("+i+")'>&times;</a></li>"
        })
    }

    function deleteItem(i){
        list.splice(i,1);
        showList();
    }

    function editItem(i){
        var newValue = prompt("please insert you new value");
        list.splice(i,1,newValue);
    }


    