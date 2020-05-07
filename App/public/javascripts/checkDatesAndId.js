function check(event) {
    // Get Values
    var startDate  = document.getElementById('startdate').value;
    var endDate  = document.getElementById('enddate').value;
    var month  = document.getElementById('month').value;
    var id = document.getElementById('id').value;

    // Simple Check
    if(id.length === 0) {
        alert("Id missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
    if((startDate.length === 0 || endDate.length === 0) && month.length === 0) {
        alert("Date/Month missing");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
