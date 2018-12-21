/**
 * Created by musia on 20/06/2017.
 */

$(document).ready(function(){
    var count = true;
    $("#changepass").click(function(){
        if (count === true){
            $("changepass").show();
            count=false;
        }
        else{
            $("changepass").hide();
            count=true;
        }

    });
});

var loadFile = function(event,output) {
    var output = document.getElementById(output);
    output.src = URL.createObjectURL(event.target.files[0]);
};

var loadFiles = function(event) {
    var output1 = document.getElementById('output1');
    output1.src = URL.createObjectURL(event.target.files[0]);
    var output2 = document.getElementById('output2');
    output2.src = URL.createObjectURL(event.target.files[1]);
    var output3 = document.getElementById('output3');
    output3.src = URL.createObjectURL(event.target.files[2]);
};

function add_fields() {
    document.getElementById("myTable").insertRow(-1).innerHTML = '<tr><td><div class="form-group"><input type="text" class="form-control"  id="size" name="size"></div></td><td>       <div class="form-group"> <input type="text" class="form-control"  id="qty" name="qty"></div></td></tr>';
}