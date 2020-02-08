import React from "react";
import {
  Button,
  Radio,
  ListItem,
  List,
  TextField,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  RadioGroup
} from "@material-ui/core";
import "firebase/database";
import firebase from "firebase/app";

const EditOHForm = ({ courseNumber, sessionId, officeHours }) => {
  const [open, setOpen] = React.useState(false);
  const [instructor, setInstructor] = React.useState(
    officeHours[sessionId].instructorName
  );
  const [start, setStart] = React.useState(officeHours[sessionId].startTime);
  const [end, setEnd] = React.useState(officeHours[sessionId].endTime);
  const [location, setLocation] = React.useState(
    officeHours[sessionId].location
  );
  const [weekday, setWeekday] = React.useState({
    su: officeHours[sessionId].weekDay === "su",
    mo: officeHours[sessionId].weekDay === "mo",
    tu: officeHours[sessionId].weekDay === "tu",
    we: officeHours[sessionId].weekDay === "we",
    th: officeHours[sessionId].weekDay === "th",
    fr: officeHours[sessionId].weekDay === "fr",
    sa: officeHours[sessionId].weekDay === "sa"
  });
  const [profTA, setProfTA] = React.useState(officeHours[sessionId].TAProf);

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

  const handleChangeWeekday = event => {
    setWeekday(event.target.value);
  };

  const { su, mo, tu, we, th, fr, sa } = weekday;

  const handleEdit = () => {
    firebase
      .database()
      .ref("courses/" + courseNumber + "/officeHours/" + sessionId)
      .update({
        instructorName: instructor,
        TAProf: profTA,
        endTime: end,
        location: location,
        startTime: start,
        weekDay: weekday
      });
    setOpen(false);
  };

  return (
    <div>
      <Button variant="text" color="primary" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Edit Office Hour Session
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
              <RadioGroup
                aria-label="gender"
                name="gender2"
                value={weekday}
                onChange={handleChangeWeekday}
              >
                <FormControlLabel
                  checked={su}
                  value="su"
                  control={<Radio color="primary" />}
                  label="Sunday"
                />
                <FormControlLabel
                  checked={mo}
                  value="mo"
                  control={<Radio color="primary" />}
                  label="Monday"
                />
                <FormControlLabel
                  checked={tu}
                  value="tu"
                  control={<Radio color="primary" />}
                  label="Tuesday"
                />
                <FormControlLabel
                  checked={we}
                  value="we"
                  control={<Radio color="primary" />}
                  label="Wednesday"
                />
                <FormControlLabel
                  checked={th}
                  value="th"
                  control={<Radio color="primary" />}
                  label="Thursday"
                />
                <FormControlLabel
                  checked={fr}
                  value="fr"
                  control={<Radio color="primary" />}
                  label="Friday"
                />
                <FormControlLabel
                  checked={sa}
                  value="sa"
                  control={<Radio color="primary" />}
                  label="Saturday"
                />
              </RadioGroup>
            </ListItem>
          </List>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditOHForm;
