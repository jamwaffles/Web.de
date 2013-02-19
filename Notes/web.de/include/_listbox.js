// Description:	This file contains all the functions neccessary to interact with a listbox (known as a combo box in
//		Visual Basic).
// Author	Dave Henderson (dhenderson@cliquesoft.org)
// Created:	07/25/04 by Dave Henderson (dhenderson@cliquesoft.org)
// Updated:	12/17/09 by Dave Henderson (dhenderson@cliquesoft.org)


function ListSort(objListBox,intSensitive) {				// sorts listbox in order (alphabatizes)
// Sorts the entries in a passed ListBox
// objListBox	the actual listbox object
// intSensitive	whether or not the list is to be sorted case sensitive (1) or case insensitive (0)
  var i,sArray = new Array();

  for (i=0; i<objListBox.options.length; i++) { 			// this for loop copies all the names from the listbox to the array
    sArray[i] = new Array(2);
    sArray[i][0] = objListBox.options[i].text;
    sArray[i][1] = objListBox.options[i].value;
  }
  if (intSensitive) {							// if you want a case sensitive sort, then...
    sArray.sort();							// use the built-in sort function
    for (i=1; i<sArray.length; i++) {					// write the sorted values to the listbox
      objListBox.options[i].text = sArray[i][0];
      objListBox.options[i].value = sArray[i][1];
    }
  } else {								// otherwise we want to sort case INsensitive, so lets use a custom method to do so
    var j=0,k,tArray = new Array();
    for (i=0; i<sArray.length; i++) {					// cycles once through the initially created array
	for (j=0; j<tArray.length; j++) {				// for each pass of that array, go entirely through the temp array that stores the indices in alphabetical order to rearrange if necessary
	  if (sArray[i][0].toLowerCase() < sArray[tArray[j]][0].toLowerCase()){			// if the cycled "parent" array value is less than any other in the temp array, then...
		tArray.length++;
		for (k=(tArray.length-1); k>=j; k--) {tArray[k] = tArray[k-1];}			// move all the indices from our current point in the array to the right 1 spot to let the last line of the "for" loop write the missing value in the correct spot
		break;
	   }
	}
	tArray[j] = i;							// set the current index of the temp array to the current value of the "parent" array
    }
    for (i=0; i<tArray.length; i++) {					// write the sorted values to the listbox
	objListBox.options[i].text = sArray[tArray[i]][0];
	objListBox.options[i].value = sArray[tArray[i]][1];
    }
  }
}


function selListbox(strListbox,strValue) {
// find the specified value in a listbox
   for (i=0; i<document.getElementById(strListbox).options.length; i++) {
	if (document.getElementById(strListbox).options[i].value == strValue) {
	   document.getElementById(strListbox).selectedIndex = i;
	   return 1;
	}
   }
   return 0;
}


function Add2List(strListBox,strOptVal,strOptTxt,intNoDoubles,intSortList,intSensitive) {
// This function adds the passed text to a ListBox object.  If any text boxes are appended to the arguments of a function
// call, there contents will be cleared.
// strListBox	The name of the listbox object you want to add the entry to.
// strOptVal	This will give a "index" value to the entry being added.  A '-1' will autoincrement.  This can also be a string.
// strOptTxt	The text of the entry you want displayed in the listbox.
// intNoDoubles	Prevents the addition of duplicate entries (a value of 1 will prevent).
// intSortList	Allows the listbox to resort its entries in alphabetical order (a value of 1 will sort).
// intSensitive	whether or not the list is to be sorted case sensitive (1) or case insensitive (0)
// object list	The values of the textboxes or listboxes appended to the end of the parameters list will have their value
//		changed (to the next value - i+1) after the entry has be updated/saved.  See the examples below to get an
//		idea of appended parameters:
//			Add2List('listbox name','value','text',1,1,1,'greeting','')					this will reset the username textbox to blank
//			Add2List('listbox name','value','text',1,1,1,'greeting','Hello')				this will reset the username textbox to 'Hello'
   var newEntry = new Option();
   var objListBox = document.getElementById(strListBox);
   var i;

   if (intNoDoubles == 1) {						// code block used to prevent the addition of duplicate "records"
	for (i=0; i<objListBox.options.length; i++)
	   { if (objListBox.options[i].text == strOptTxt) { alert('You already have the entry "' + objListBox.options[i].text + '" added to the list.'); return 0; } }
   }

   if (strOptTxt != "") {						// IF strOptTxt contains an actual value, then...
	if (strOptVal == -1)						// IF the user wants an autoincrement, then..
	   { newEntry.value = objListBox.options.length; }		// add the next highest number
	else								// ELSE IF the user specified a value...
	   { newEntry.value = strOptVal; }				// assign it to the entry
	newEntry.text  = strOptTxt;					// this is the listbox entry's display text
	objListBox[objListBox.options.length] = newEntry;
	if (intSortList == 1) { ListSort(objListBox,intSensitive); }	// sorts list after user adds a new entry (if specified)
	for (i=6; i<arguments.length; i=i+2) {				// resets the form objects to the values specified after the mandatory parameters to this function
	   if (document.getElementById(arguments[i]).type == "text") {
		document.getElementById(arguments[i]).value = arguments[i+1];
	   } else if (document.getElementById(arguments[i]).type == "select" || document.getElementById(arguments[i]).type == "select-one" || document.getElementById(arguments[i]).type == "select-multiple") {
		if (arguments[i+1] == -1) { document.getElementById(arguments[i]).selectedIndex = -1; continue; }	// if the user wants the combobox to not have any selections, then do so
		for (j=0; j<document.getElementById(arguments[i]).options.length; j++)					// otherwise, choose the selection desired
		   { if (document.getElementById(arguments[i]).options[j].value == arguments[i+1]) { document.getElementById(arguments[i]).selectedIndex = j; break; } }
	   }
	}
	return 1;							// returns true if all works
   }
   return 0;								// returns fail if not
}


function ListReplace(strListBox,strOptVal,strOptTxt,strCheckAgainst,strEntry2Replace,intSortList,intSensitive,intPrompt) {
// This function replaces the entry thats matched the information passed into the function.  If any textboxes or listboxes
// are appended to the arguments of this function call, there contents will be cleared or set to default values.
// strListBox	The name of the listbox object you want to add the entry to.
// strOptVal	This gives the entry a value.  If it is left blank, the prior value will remain.
// strOptTxt	The text you want to replace the original entry in the listbox with.
// strCheckAgainst   This is option identifies which listbox value you wish to check against.  Valid values: "text", "value".
// strEntry2Replace  This is the VALUE of the entry you wish to replace with the other passed parameters.
// intSortList	Allows the listbox to resort its entries in alphabetical order (a value of 1 will sort).
// intSensitive	whether or not the list is to be sorted case sensitive (1) or case insensitive (0)
// intPrompt	This allows an overwrite prompt to appear for user confirmation before actually processing.
// object list	The values of the textboxes or listboxes appended to the end of the parameters list will have their value
//		changed (to the next value - i+1) after the entry has be updated/saved.  See the examples below to get an
//		idea of appended parameters:
//			ListReplace('listbox name','new value','new text','text','old text',1,1,1,'greeting','')	this will reset the username textbox to blank
//			ListReplace('listbox name','new value','new text','text','old text',1,1,1,'greeting','Hello')	this will reset the username textbox to 'Hello'
   var i, found = false, newEntry = new Option();
   var objListBox = document.getElementById(strListBox);

    if (intPrompt == 1) {
	if (objListBox.options.selectedIndex == -1) { alert('You must select an entry from the listbox before you\ncan save any changes.'); return 0; }
	if (window.confirm('Are you sure you want to overwrite?') == false) { return 0; }
    }
    for (i=0; i<objListBox.options.length; i++) {
	if (strCheckAgainst == "value" && objListBox.options[i].value == strEntry2Replace) { found = true; }		// we have found the listbox entry to replace!
	else if (strCheckAgainst == "text" && objListBox.options[i].text == strEntry2Replace) { found = true; }		// we have found the listbox entry to replace!
	if (found == true) {
	   objListBox.options[i].text = strOptTxt;
	   if (strOptVal != '') { objListBox.options[i].value = strOptVal; }
	   if (intSortList == 1) { ListSort(objListBox,intSensitive); }	// sorts list after user adds a new entry (if specified)
	   for (i=8; i<arguments.length; i=i+2) {			// resets the form objects to the values specified after the mandatory parameters to this function
		if (document.getElementById(arguments[i]).type == "text") {
		   document.getElementById(arguments[i]).value = arguments[i+1];
		} else if (document.getElementById(arguments[i]).type == "select" || document.getElementById(arguments[i]).type == "select-one" || document.getElementById(arguments[i]).type == "select-multiple") {
		   if (arguments[i+1] == -1) { document.getElementById(arguments[i]).selectedIndex = -1; continue; }	// if the user wants the combobox to not have any selections, then do so
		   for (j=0; j<document.getElementById(arguments[i]).options.length; j++)				// otherwise, choose the selection desired
			{ if (document.getElementById(arguments[i]).options[j].value == arguments[i+1]) { document.getElementById(arguments[i]).selectedIndex = j; break; } }
		}
	   }
	   if (arguments.length > 6) { objListBox.selectedIndex = -1; }	// if the user decided to reset values of textboxes, unselect the entry in the listbox
	   return 1;							// returns true if all works
	}
    }
    return 0;								// returns fail if not
}


function ListReplace2(strListBox,strOptVal,strOptTxt,intSortList,intSensitive,intPrompt) {
// this version makes it easier because it takes the item currently selected in the passed listbox and replaces it with
// the values passed.
// strListBox	The name of the listbox object you want to add the entry to.
// strOptVal	This gives the entry a value.  If it is left blank, the prior value will remain.
// strOptTxt	This gives the entry a text value.  If it is left blank, the prior value will remain.
// intSortList	Allows the listbox to resort its entries in alphabetical order (a value of 1 will sort).
// intSensitive	whether or not the list is to be sorted case sensitive (1) or case insensitive (0)
// intPrompt	This allows an overwrite prompt to appear for user confirmation before actually processing.
// object list	The values of the textboxes or listboxes appended to the end of the parameters list will have their value
//		changed (to the next value - i+1) after the entry has be updated/saved.  See the examples below to get an
//		idea of appended parameters:
//			ListReplace2('listbox name','new value','',1,0,1,'greeting','')		this will reset the username textbox to blank
//			ListReplace2('listbox name','','new text',1,1,1,'greeting','Hello')	this will reset the username textbox to 'Hello'
   var i, j;
   var objListBox = document.getElementById(strListBox);

   if (intPrompt == 1) {
	if (objListBox.options.selectedIndex == -1) { alert('You must select an entry from the listbox before you\ncan save any changes.'); return 0; }
	if (window.confirm('Are you sure you want to overwrite?') == false) { return 0; }
   }
   objListBox.options[objListBox.selectedIndex].value = strOptVal;
   objListBox.options[objListBox.selectedIndex].text = strOptTxt;
   if (intSortList == 1) { ListSort(objListBox,intSensitive); }					// sorts list after user adds a new entry (if specified)
   for (i=6; i<arguments.length; i=i+2) {				// resets the form objects to the values specified after the mandatory parameters to this function
	if (document.getElementById(arguments[i]).type == "text") {
	   document.getElementById(arguments[i]).value = arguments[i+1];
	} else if (document.getElementById(arguments[i]).type == "select" || document.getElementById(arguments[i]).type == "select-one" || document.getElementById(arguments[i]).type == "select-multiple") {
	   if (arguments[i+1] == -1) { document.getElementById(arguments[i]).selectedIndex = -1; continue; }		// if the user wants the combobox to not have any selections, then do so
	   for (j=0; j<document.getElementById(arguments[i]).options.length; j++)					// otherwise, choose the selection desired
		{ if (document.getElementById(arguments[i]).options[j].value == arguments[i+1]) { document.getElementById(arguments[i]).selectedIndex = j; break; } }
	}
   }
}


function ListRemove(strListBox,intPrompt) {
// this function removes the selected entry from the listbox being passed into the function.
// strListBox	The name of the listbox object you want to add the entry to.
// intPrompt:	This allows an overwrite prompt to appear for user confirmation before actually processing.
// object list:	The values of the textboxes or listboxes appended to the end of the parameters list will have their value
//		changed (to the next value - i+1) after the entry has be updated/saved.  See the examples below to get an
//		idea of appended parameters:
//			ListRemove(document.form.listbox,1,'greeting','')			this will reset the username textbox to blank
//			ListRemove(document.form.listbox,1,'greeting','Hello')			this will reset the username textbox to 'Hello'
   var i,j,moveUp=0;
   var objListBox = document.getElementById(strListBox);

   if (objListBox.selectedIndex == -1) { return 0; }			// error checking (if the user hasn't selected an item in the passed listbox)
   if (intPrompt) { if(window.confirm('Are you sure you want to delete the entry?') == false) { return 0; } }
   for (i=0; i<objListBox.options.length; i++) {			// cycles through all the entries in the list box
	if ((objListBox.options[i].selected) && (objListBox.options[i] != ""))			// finds the one the user selected
	   { moveUp = 1; }									// indicates we need to move all the entries aftwards, up in the list
	if ((moveUp == 1) && (i <= (objListBox.options.length - 2))) {
	   objListBox.options[i].value = objListBox.options[i + 1].value;			// copies over the value from the above entry, down
	   objListBox.options[i].text  = objListBox.options[i + 1].text;			// copies over the text from the above entry, down
	}
   }
   if (moveUp == 1) {							// if we successfully deleted an entry
	objListBox.options.length--;					// shorten the listbox by one
	for (i=2; i<arguments.length; i=i+2) {				// resets the form objects to the values specified after the mandatory parameters to this function
	   if (document.getElementById(arguments[i]).type == "text") {
		document.getElementById(arguments[i]).value = arguments[i+1];
	   } else if (document.getElementById(arguments[i]).type == "select" || document.getElementById(arguments[i]).type == "select-one" || document.getElementById(arguments[i]).type == "select-multiple") {
		if (arguments[i+1] == -1) { document.getElementById(arguments[i]).selectedIndex = -1; continue; }	// if the user wants the combobox to not have any selections, then do so
		for (j=0; j<document.getElementById(arguments[i]).options.length; j++)					// otherwise, choose the selection desired
		   { if (document.getElementById(arguments[i]).options[j].value == arguments[i+1]) { document.getElementById(arguments[i]).selectedIndex = j; break; } }
	   }
	}
	return 1;							// return success
   }
   return 0;								// returns fail if not
}


function ListRemove2(strListBox,intPrompt,intIndex) {
// this function removes the passed "index" entry from the listbox.  For example, if you know you want entry number 4
// removed from the listbox, then call this function as:  ListRemove2('listboxname', 4);
// strListBox	The name of the listbox object you want to add the entry to.
// intIndex	specifies which line to remove
// intPrompt	whether or not the user should be prompt to confirm the deletion
   var i;
   var objListBox = document.getElementById(strListBox);

   if (intPrompt) { if(window.confirm('Are you sure you want to delete the entry?') == false) { return 0; } }
   for (i=intIndex; i<objListBox.options.length-1; i++) {		// cycles through all the entries in the list box
	objListBox.options[i].value = objListBox.options[i + 1].value;	// copies over the value from the above entry, down
	objListBox.options[i].text  = objListBox.options[i + 1].text;	// copies over the text from the above entry, down
   }
   objListBox.options.length--;						// shorten the listbox by one
}


function ListRemove3(strListBox,intPrompt,intKeepSelectedItem,intKeepItemValues) {
// This function removes multiple items from a listbox.
// strListBox		The name of the listbox object you want to add the entry to.
// intPrompt		Prompts the user if they are sure they want to remove the selected item(s) before continuing.
// intKeepSelectedItem	This value specifies what type of item to keep.  True = selected items in the list, Fasle = unselected items in the list.
// intKeepItemValues	setting true retains the <option value=""> values from the items left in the list.
  var i;
  var aryNew = new Array();
   var objListBox = document.getElementById(strListBox);

  if (intPrompt) { if(window.confirm('Are you sure you want to delete the entry?') == false) { return 0; } }
  aryNew.length = 0;
  for (i=0; i<objListBox.options.length; i++) {
    // if the item has a selected value that equals what the user specified  AND  the user specified not to keep the option values, then...
    if ((objListBox.options[i].selected == intKeepSelectedItem) && (intKeepItemValues == false)) {
      aryNew.length++;
      aryNew[aryNew.length-1] = objListBox.options[i].text;		// copies over the text from the current entry

    } else if ((objListBox.options[i].selected == intKeepSelectedItem) && (intKeepItemValues == true)) {
      aryNew.length += 2;
      aryNew[aryNew.length-2] = objListBox.options[i].value;		// copies over the value from the current entry
      aryNew[aryNew.length-1] = objListBox.options[i].text;		// copies over the text from the current entry
    }
  }
  objListBox.options.length = 0;					// resets the passed listbox entry count to 0
  for (i=0; i<aryNew.length; i++) {					// copies the "saved" entries back into the listbox
    if (intKeepItemValues == false)					// only copies the text portion
      { Add2List(strListBox,aryNew[i],aryNew[i],1,-1,0); }
    else								// copies both the text and option values
      { Add2List(strListBox,aryNew[i],aryNew[i+1],0,1,0); i++; }
  }
}


function ListRemove4(strListBox,intPrompt,strCheckAgainst,strValue) {
// this function cycles through all the entries in the passed listbox and finds the one to remove
// strListBox		The name of the listbox object you want to add the entry to.
// intPrompt		Prompts the user if they are sure they want to remove the selected item(s) before continuing.
// strCheckAgainst	This is option identifies which listbox value you wish to check against.  Valid values: "text", "value".
// strValue		This is the VALUE of the 'strCheckAgainst' parameter to search for in the 'strListBox'.
  var i, found=false;
   var objListBox = document.getElementById(strListBox);

   for (i=0; i<objListBox.options.length; i++) {				// cycles through all the entries in the list box
	if (strCheckAgainst == "value" && objListBox.options[i].value == strValue) { found = true; }		// we have found the listbox entry to replace!
	else if (strCheckAgainst == "text" && objListBox.options[i].text == strValue) { found = true; }		// we have found the listbox entry to replace!
	if (found == true) {
	   if (boolPrompt == true) {
		if (! confirm('Are you sure you want to delete the entry?')) { return 0; }	// if the user clicked cancel, then exit this function
		else { intPrompt=false; }					// otherwise, turn off the prompt so it doesn't keep asking to delete
	   }
	   if (i != objListBox.options.length-1) {				// as long as we aren't on the last entry, then move the next entry in the list down one spot
		objListBox.options[i].value = objListBox.options[i + 1].value;
		objListBox.options[i].text  = objListBox.options[i + 1].text;
	   }
	}
   }
   if (found == true) {objListBox.options.length--; return true;} else { return false; }	// shorten the listbox by one if the sought after entry was found
}


function ListPlacement(strListBox,strAdjustType) {
// This function allows the user to move a selected item either up or down in a list.
  var i, j, priorValue;
   var objListBox = document.getElementById(strListBox);

  if (strAdjustType == "up") {
    if ((objListBox.selectedIndex == -1) || (objListBox.selectedIndex == 0)) { return 0; }	// exit function if the user didn't select a server ip or he/she is trying to move up the first ip
    priorValue = objListBox.options[objListBox.selectedIndex-1].text;				// set the value of the listbox item thats one position up from the selected item, to the variable
    objListBox.options[objListBox.selectedIndex-1].text = objListBox.options[objListBox.selectedIndex].text;	// set the value of the listbox item up one position to the value of the selected item
    objListBox.options[objListBox.selectedIndex].text = priorValue;				// set the value of the selected listbox item to the priorValue variable
    objListBox.selectedIndex = objListBox.selectedIndex-1;					// this allows the highlight to follow the item being moved

  } else if (strAdjustType == "down") {
    if ((objListBox.selectedIndex == -1) || (objListBox.selectedIndex == objListBox.options.length-1)) { return 0; }	// exit function if the user didn't select a server ip or he/she is trying to move down the last ip
    priorValue = objListBox.options[objListBox.selectedIndex+1].text;				// same as above, but in reverse
    objListBox.options[objListBox.selectedIndex+1].text = objListBox.options[objListBox.selectedIndex].text;
    objListBox.options[objListBox.selectedIndex].text = priorValue;
    objListBox.selectedIndex = objListBox.selectedIndex+1;					// this allows the highlight to follow the item being moved
  }
}


function ListPlacement2(strListBox,strAdjustType) {
// This function allows the user to move a selected item either up or down in a list, but this one will retain values.
  var i, j, priorText, priorValue;
   var objListBox = document.getElementById(strListBox);

  if (strAdjustType == "up") {
    if ((objListBox.selectedIndex == -1) || (objListBox.selectedIndex == 0)) { return 0; }	// exit function if the user didn't select a server ip or he/she is trying to move up the first ip
    priorText = objListBox.options[objListBox.selectedIndex-1].text;				// set the value of the listbox item thats one position up from the selected item, to the variable
    priorValue = objListBox.options[objListBox.selectedIndex-1].value;
    objListBox.options[objListBox.selectedIndex-1].text = objListBox.options[objListBox.selectedIndex].text;		// set the value of the listbox item up one position to the value of the selected item
    objListBox.options[objListBox.selectedIndex-1].value = objListBox.options[objListBox.selectedIndex].value;
    objListBox.options[objListBox.selectedIndex].text = priorText;				// set the value of the selected listbox item to the priorText variable
    objListBox.options[objListBox.selectedIndex].value = priorValue;
    objListBox.selectedIndex = objListBox.selectedIndex-1;					// this allows the highlight to follow the item being moved

  } else if (strAdjustType == "down") {
    if ((objListBox.selectedIndex == -1) || (objListBox.selectedIndex == objListBox.options.length-1)) { return 0; }	// exit function if the user didn't select a server ip or he/she is trying to move down the last ip
    priorText = objListBox.options[objListBox.selectedIndex+1].text;				// same as above, but in reverse
    priorValue = objListBox.options[objListBox.selectedIndex+1].value;
    objListBox.options[objListBox.selectedIndex+1].text = objListBox.options[objListBox.selectedIndex].text;
    objListBox.options[objListBox.selectedIndex+1].value = objListBox.options[objListBox.selectedIndex].value;
    objListBox.options[objListBox.selectedIndex].text = priorText;
    objListBox.options[objListBox.selectedIndex].value = priorValue;
    objListBox.selectedIndex = objListBox.selectedIndex+1;					// this allows the highlight to follow the item being moved
  }
}
