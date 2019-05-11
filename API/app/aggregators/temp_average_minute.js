exports.average_on_minute = function (temperatures) {
    // variable declarations
    var newTemps = [];
    var compareDate;
    var tempExists = false;
    var compareToDate;

    // loops through the list of incoming temperatures, combines averages on minute-basis for each date
    for (i = 0; i < temperatures.length; i++) { 
        tempExists = false;
        compareDate = new Date(temperatures[i].time);
        for (y = 0; y < newTemps.length; y++) {
            compareToDate = new Date(newTemps[y].time);
            // checks time differences down to minutes 
            if ((compareDate.getFullYear() == compareToDate.getFullYear()) && 
            (compareDate.getMonth() == compareToDate.getMonth()) && 
            (compareDate.getDate() == compareToDate.getDate()) && 
            (compareDate.getHours() == compareToDate.getHours()) && 
            (compareDate.getMinutes() == compareToDate.getMinutes())) {
                // basic average of the new temperatures
                newTemps[y].temp = ((newTemps[y].temp + temperatures[i].temp)/2);
                tempExists = true;
                // breaks loop
                break;
            }
        } 
        // if the temperature was not found, add it to the list
        if (!tempExists) newTemps.push(temperatures[i]);
    }
    // returns new list of temperatures
    return newTemps;
};