import { React, useState } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../Store/index';

const RemoveLocModal = (props) => {
    const [select, setSelect] = useState([]);

    const dispatch = useDispatch();  
    const { closeRemoveLocModal, removeNodes } = bindActionCreators(actionCreators, dispatch);  
    const open = useSelector(state => state.modals.openRemoveLoc);
    const nodes = useSelector(state => state.nodes.nodes);

    const handleCancel = () => {
        setSelect([]);
        closeRemoveLocModal();
    };

    const handleOk = () => {
        removeNodes(select);
        closeRemoveLocModal();
        setSelect([]);
    };

    const handleChange = (event, value) => {
        if(event.target.checked) {
            setSelect([...select, value]);
        } else {
            const newArr = select.filter(item => item !== value);
            setSelect(newArr);
        }
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
        >
            <DialogTitle>Remove Nodes</DialogTitle>
            <DialogContent dividers>
                <FormGroup >
                    {nodes.map((loc) => (
                        <FormControlLabel
                            value={loc}
                            key={loc.latitude}
                            control={<Checkbox />}
                            label={`Node ${loc.node}`}
                            onChange={(e)=>handleChange(e, loc)}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RemoveLocModal;
