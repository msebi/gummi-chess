import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";


export default function CustomDialog({ open, children, title, contentText, handleContinue}) {
    return (
        <Dialog open={open}> {/* dialog container */}
        <DialogContent> {/* main body of modal/dialog */}
            <DialogContentText> {/* main text */ }
                {contentText}
            </DialogContentText>
            {children} {/*other content*/}
        </DialogContent>
        <DialogActions> {/*dialog action buttons */}
            {/* force users to make input without option to cancel */}
            {/* <Button obClick={handleClose}>Cancel</Button> */}
            <Button onClick={handleContinue}>Continue</Button>
        </DialogActions>
        </Dialog>
    );

}

