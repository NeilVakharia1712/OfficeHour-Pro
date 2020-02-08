import React from "react";
import {
  Button,
  Radio,
  ListItem,
  List,
  TextField,
  Checkbox,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  RadioGroup
} from "@material-ui/core";
import "firebase/database";
import firebase from "firebase/app";

const AddOHForm = ({ courseNumber }) => {
  const [open, setOpen] = React.useState(false);
  const [instructor, setInstructor] = React.useState("");
  const [start, setStart] = React.useState("00:00");
  const [end, setEnd] = React.useState("00:00");
  const [location, setLocation] = React.useState("");
  const [weekday, setWeekday] = React.useState({
    su: false,
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false
  });
  const [profTA, setProfTA] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInstructor = event => {
    setInstructor(event.target.value);
  };

  const handleProfTA = event => {
    setProfTA(event.target.value);
  };

  const handleChangeStart = event => {
    setStart(event.target.value);
  };

  const handleChangeEnd = event => {
    setEnd(event.target.value);
  };

  const handleChangeLocation = event => {
    setLocation(event.target.value);
  };

  const handleChangeWeekday = day => event => {
    setWeekday({ ...weekday, [day]: event.target.checked });
  };

  const { su, mo, tu, we, th, fr, sa } = weekday;

  const handleAdd = () => {
    Object.keys(weekday).map(function(day) {
      if (weekday[day]) {
        firebase
          .database()
          .ref("courses/" + courseNumber)
          .child("officeHours")
          .push()
          .set({
            instructorName: instructor,
            TAProf: profTA,
            endTime: end,
            location: location,
            startTime: start,
            weekDay: day
          });
      }
    });
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Office Hour Session
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Add Office Hour Session
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <TextField
                varient="outlined"
                id="standard-basic"
                label="Instructor Name"
                value={instructor}
                onChange={handleChangeInstructor}
              />
            </ListItem>
            <ListItem>
              <RadioGroup
                row
                aria-label="gender"
                name="gender2"
                value={profTA}
                onChange={handleProfTA}
              >
                <FormControlLabel
                  value="TA"
                  control={<Radio color="primary" />}
                  label="TA"
                />
                <FormControlLabel
                  value="Prof"
                  control={<Radio color="primary" />}
                  label="Professor"
                />
              </RadioGroup>
            </ListItem>
            <ListItem>
              <TextField
                varient="outlined"
                id="time"
                label="Start Time"
                type="time"
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 min
                }}
                onChange={handleChangeStart}
                value={start}
              />
            </ListItem>
            <ListItem>
              <TextField
                varient="outlined"
                id="time"
                label="End Time"
                type="time"
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 min
                }}
                onChange={handleChangeEnd}
                value={end}
              />
            </ListItem>
            <ListItem>
              <TextField
                varient="outlined"
                id="standard-basic"
                label="Location"
                value={location}
                onChange={handleChangeLocation}
              />
            </ListItem>
            <ListItem>
              <FormControl component="fieldset">
                <FormLabel component="legend">Pick Weekdays</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={su}
                        onChange={handleChangeWeekday("su")}
                        value="Sunday"
                      />
                    }
                    label="Sunday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mo}
                        onChange={handleChangeWeekday("mo")}
                        value="Monday"
                      />
                    }
                    label="Monday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tu}
                        onChange={handleChangeWeekday("tu")}
                        value="Tuesday"
                      />
                    }
                    label="Tuesday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={we}
                        onChange={handleChangeWeekday("we")}
                        value="Wednesday"
                      />
                    }
                    label="Wednesday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={th}
                        onChange={handleChangeWeekday("th")}
                        value="Thursday"
                      />
                    }
                    label="Thursday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fr}
                        onChange={handleChangeWeekday("fr")}
                        value="Friday"
                      />
                    }
                    label="Friday"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sa}
                        onChange={handleChangeWeekday("sa")}
                        value="Saturday"
                      />
                    }
                    label="Saturday"
                  />
                </FormGroup>
              </FormControl>
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

export default AddOHForm;
