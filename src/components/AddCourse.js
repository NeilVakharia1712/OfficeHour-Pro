import React from "react";
import {
  Button,
  ListItem,
  List,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import "firebase/database";
import firebase from "firebase/app";

const AddCourse = () => {
  const [open, setOpen] = React.useState(false);
  const [courseName, setCourseName] = React.useState("");
  const [courseNumber, setCourseNumber] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCourseName = event => {
    setCourseName(event.target.value);
  };

  const handleChangeCourseNumber = event => {
    setCourseNumber(event.target.value);
  };

  const handleAdd = () => {
    firebase
      .database()
      .ref("courses/")
      .update({
        [courseNumber]: { id: courseNumber, title: courseName }
      });
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Course
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Course</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <TextField
                varient="outlined"
                id="standard-basic"
                label="Course Number"
                value={courseNumber}
                onChange={handleChangeCourseNumber}
              />
            </ListItem>
            <ListItem>
              <TextField
                varient="outlined"
                id="standard-basic"
                label="Course Name"
                value={courseName}
                onChange={handleChangeCourseName}
              />
            </ListItem>
          </List>
          <Button variant="outlined" color="primary" onClick={handleAdd}>
            Add (+)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCourse;
